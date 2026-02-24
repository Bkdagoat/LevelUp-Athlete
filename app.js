import { FilesetResolver, PoseLandmarker } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';

const state = {
  currentScreen: 'login',
  darkMode: true,
  selectedSports: new Set(['Soccer', 'Basketball']),
  uploadedFile: null,
  uploadedPreviewURL: null,
  analysisResult: null,
  analyzing: false
};

const sports = ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Track', 'Swimming', 'Volleyball', 'Boxing'];
let poseLandmarker;

const fallbackData = {
  athlete: 'Jordan Lee',
  session: 'No real media analyzed yet',
  skillScores: [
    { name: 'Footwork', score: 78 },
    { name: 'Acceleration', score: 74 },
    { name: 'Balance', score: 80 },
    { name: 'Form Consistency', score: 72 }
  ],
  mistakes: ['Upload media and click “Run Real AI Analysis” for true form feedback.'],
  drills: ['A-skip progression', 'Wall drive holds', 'Single-leg balance sprint starts'],
  injuryAlerts: [{ level: 'warning', text: 'No live pose analysis yet.' }],
  weeklyProgress: [
    { label: 'Skill Score', value: '+0%' },
    { label: 'Mistakes per Session', value: 'N/A' },
    { label: 'Training Volume', value: 'N/A' },
    { label: 'Recovery Quality', value: 'N/A' }
  ]
};

const screenTitles = {
  login: 'Athlete Login',
  sports: 'Sports Selection',
  video: 'Training Video',
  analysis: 'AI Analysis',
  dashboard: 'Weekly Dashboard'
};

const screenContainer = document.getElementById('screenContainer');
const screenTitle = document.getElementById('screenTitle');

function clampScore(num) {
  return Math.max(1, Math.min(99, Math.round(num)));
}

function angle(a, b, c) {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const mag1 = Math.hypot(abx, aby);
  const mag2 = Math.hypot(cbx, cby);
  const v = dot / (mag1 * mag2 || 1);
  return Math.acos(Math.max(-1, Math.min(1, v))) * (180 / Math.PI);
}

async function getPoseLandmarker() {
  if (poseLandmarker) return poseLandmarker;
  const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task'
    },
    runningMode: 'IMAGE',
    numPoses: 1
  });
  return poseLandmarker;
}

async function analyzeImage(file) {
  const detector = await getPoseLandmarker();
  const bitmap = await createImageBitmap(file);
  const result = detector.detect(bitmap);
  bitmap.close();
  return result.landmarks?.[0];
}

async function analyzeVideo(file) {
  const detector = await getPoseLandmarker();
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url;
  video.muted = true;

  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');

  const sampleTimes = [0.15, 0.5, 0.85].map((t) => Math.max(0.05, video.duration * t));
  const landmarks = [];

  for (const t of sampleTimes) {
    await new Promise((resolve) => {
      video.currentTime = t;
      video.onseeked = resolve;
    });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = await createImageBitmap(canvas);
    const res = detector.detect(frame);
    frame.close();
    if (res.landmarks?.[0]) landmarks.push(res.landmarks[0]);
  }

  URL.revokeObjectURL(url);
  if (!landmarks.length) return null;

  const summed = landmarks[0].map((_, i) => ({
    x: landmarks.reduce((acc, lm) => acc + lm[i].x, 0) / landmarks.length,
    y: landmarks.reduce((acc, lm) => acc + lm[i].y, 0) / landmarks.length,
    z: landmarks.reduce((acc, lm) => acc + lm[i].z, 0) / landmarks.length
  }));

  return summed;
}

function buildFeedbackFromLandmarks(landmarks, type) {
  if (!landmarks) {
    return {
      athlete: 'Athlete',
      session: `${type} uploaded`,
      skillScores: [
        { name: 'Footwork', score: 40 },
        { name: 'Balance', score: 40 },
        { name: 'Posture', score: 40 },
        { name: 'Explosiveness', score: 40 }
      ],
      mistakes: ['Body landmarks could not be detected clearly. Record full body in frame with better lighting.'],
      drills: ['Retake media with full body visible (head to ankles).'],
      injuryAlerts: [{ level: 'warning', text: 'Low detection confidence. Analysis may be unreliable.' }],
      weeklyProgress: fallbackData.weeklyProgress
    };
  }

  const ls = landmarks[11], rs = landmarks[12], lh = landmarks[23], rh = landmarks[24], lk = landmarks[25], rk = landmarks[26], la = landmarks[27], ra = landmarks[28];
  const shoulderTilt = Math.abs(ls.y - rs.y) * 100;
  const hipTilt = Math.abs(lh.y - rh.y) * 100;
  const leftKneeAngle = angle(lh, lk, la);
  const rightKneeAngle = angle(rh, rk, ra);
  const kneeSymmetry = Math.abs(leftKneeAngle - rightKneeAngle);

  const balanceScore = clampScore(95 - shoulderTilt * 2.2 - hipTilt * 2.2);
  const formScore = clampScore(96 - kneeSymmetry * 1.4 - shoulderTilt * 1.5);
  const mobilityScore = clampScore(100 - Math.abs(170 - ((leftKneeAngle + rightKneeAngle) / 2)) * 1.2);
  const stabilityScore = clampScore((balanceScore + formScore + mobilityScore) / 3);

  const mistakes = [];
  const drills = [];
  const injuryAlerts = [];

  if (shoulderTilt > 6) {
    mistakes.push('Upper body tilt detected. Keep shoulders level through movement.');
    drills.push('Single-leg RDL hold (3x20s each side) to improve trunk control.');
  }
  if (hipTilt > 6) {
    mistakes.push('Hip drop/asymmetry detected. Stabilize pelvis during stance phase.');
    drills.push('Lateral band walks and glute med activation before sessions.');
    injuryAlerts.push({ level: 'warning', text: 'Pelvic asymmetry may increase knee/hip load if repeated.' });
  }
  if (kneeSymmetry > 12) {
    mistakes.push('Left/right knee mechanics are inconsistent.');
    drills.push('Split squat tempo reps (3-1-1 cadence) for bilateral control.');
  }
  if (mobilityScore < 60) {
    mistakes.push('Limited knee/ankle extension pattern suggests mobility restrictions.');
    drills.push('Ankle dorsiflexion rocks + hamstring mobility sequence (8 mins).');
    injuryAlerts.push({ level: 'danger', text: 'Reduced mobility may raise strain risk under high intensity.' });
  }

  if (!mistakes.length) {
    mistakes.push('Strong overall mechanics detected. Keep consistency and progressive overload.');
    drills.push('Continue sport-specific speed/skill progression with weekly volume increases of 5-8%.');
    injuryAlerts.push({ level: 'success', text: 'No major risk flags from this clip.' });
  }

  return {
    athlete: 'You',
    session: `Real AI ${type} analysis complete`,
    skillScores: [
      { name: 'Balance', score: balanceScore },
      { name: 'Form Consistency', score: formScore },
      { name: 'Mobility Pattern', score: mobilityScore },
      { name: 'Stability', score: stabilityScore }
    ],
    mistakes,
    drills,
    injuryAlerts,
    weeklyProgress: [
      { label: 'Avg Skill Score', value: `${Math.round((balanceScore + formScore + mobilityScore + stabilityScore) / 4)}/100` },
      { label: 'Detected Form Issues', value: `${mistakes.length}` },
      { label: 'Injury Flags', value: `${injuryAlerts.filter((x) => x.level !== 'success').length}` },
      { label: 'Analysis Source', value: type }
    ]
  };
}

function renderScreen() {
  const template = document.getElementById(`${state.currentScreen}Screen`);
  screenContainer.innerHTML = '';
  screenContainer.appendChild(template.content.cloneNode(true));
  screenTitle.textContent = screenTitles[state.currentScreen];

  if (state.currentScreen === 'sports') renderSports();
  if (state.currentScreen === 'video') renderVideoUpload();
  if (state.currentScreen === 'analysis') renderAnalysis();
  if (state.currentScreen === 'dashboard') renderDashboard();
  if (state.currentScreen === 'login') bindLogin();
}

function renderSports() {
  const chipWrap = document.getElementById('sportsChips');
  sports.forEach((sport) => {
    const chip = document.createElement('button');
    chip.className = `chip ${state.selectedSports.has(sport) ? 'selected' : ''}`;
    chip.textContent = sport;
    chip.addEventListener('click', () => {
      if (state.selectedSports.has(sport)) state.selectedSports.delete(sport);
      else state.selectedSports.add(sport);
      renderScreen();
    });
    chipWrap.appendChild(chip);
  });

  document.getElementById('saveSports').addEventListener('click', () => {
    alert(`Saved: ${Array.from(state.selectedSports).join(', ')}`);
  });
}

function renderVideoUpload() {
  const mediaInput = document.getElementById('mediaInput');
  const uploadStatus = document.getElementById('uploadStatus');
  const previewWrap = document.getElementById('previewWrap');

  const refreshPreview = () => {
    previewWrap.innerHTML = '';
    if (!state.uploadedPreviewURL || !state.uploadedFile) return;

    const isVideo = state.uploadedFile.type.startsWith('video/');
    const el = document.createElement(isVideo ? 'video' : 'img');
    el.src = state.uploadedPreviewURL;
    if (isVideo) el.controls = true;
    previewWrap.appendChild(el);

    uploadStatus.innerHTML = `<p><strong>Status:</strong> ${state.uploadedFile.name} ready</p>`;
  };

  refreshPreview();

  mediaInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (state.uploadedPreviewURL) URL.revokeObjectURL(state.uploadedPreviewURL);
    state.uploadedFile = file;
    state.uploadedPreviewURL = URL.createObjectURL(file);
    state.analysisResult = null;
    refreshPreview();
  });

  document.getElementById('clearMedia').addEventListener('click', () => {
    if (state.uploadedPreviewURL) URL.revokeObjectURL(state.uploadedPreviewURL);
    state.uploadedFile = null;
    state.uploadedPreviewURL = null;
    state.analysisResult = null;
    uploadStatus.innerHTML = '<p><strong>Status:</strong> Waiting for upload</p>';
    previewWrap.innerHTML = '';
    mediaInput.value = '';
  });

  document.getElementById('analyzeMedia').addEventListener('click', async () => {
    if (!state.uploadedFile || state.analyzing) {
      if (!state.uploadedFile) alert('Upload an image or video first.');
      return;
    }

    state.analyzing = true;
    uploadStatus.innerHTML = '<p><strong>Status:</strong> Running real pose AI analysis...</p>';

    try {
      const type = state.uploadedFile.type.startsWith('video/') ? 'video' : 'image';
      const landmarks = type === 'video' ? await analyzeVideo(state.uploadedFile) : await analyzeImage(state.uploadedFile);
      state.analysisResult = buildFeedbackFromLandmarks(landmarks, type);
      uploadStatus.innerHTML = '<p><strong>Status:</strong> Analysis complete ✅</p>';
      state.currentScreen = 'analysis';
      syncNav();
      renderScreen();
    } catch (error) {
      console.error(error);
      uploadStatus.innerHTML = '<p><strong>Status:</strong> Analysis failed. Check internet/model loading and retry.</p>';
      alert('Real AI analysis failed. Ensure internet is available to load MediaPipe model files.');
    } finally {
      state.analyzing = false;
    }
  });
}

function renderAnalysis() {
  const data = state.analysisResult || fallbackData;
  const root = document.getElementById('analysisContent');
  root.innerHTML = `
    <article class="card">
      <h2>${data.athlete}</h2>
      <p>${data.session}</p>
      <div class="metric-grid">
        ${data.skillScores.map((item) => `<div class="metric"><span>${item.name}</span><strong>${item.score}/100</strong></div>`).join('')}
      </div>
    </article>
    <article class="card">
      <h3>Detected form issues</h3>
      <ul>${data.mistakes.map((m) => `<li>${m}</li>`).join('')}</ul>
    </article>
    <article class="card">
      <h3>How to improve</h3>
      <ul>${data.drills.map((d) => `<li>${d}</li>`).join('')}</ul>
    </article>
    <article class="card">
      <h3>Injury risk alerts</h3>
      ${data.injuryAlerts.map((alert) => `<p><span class="pill ${alert.level}">${alert.level.toUpperCase()}</span> ${alert.text}</p>`).join('')}
    </article>
  `;
}

function renderDashboard() {
  const data = state.analysisResult || fallbackData;
  const root = document.getElementById('dashboardContent');
  root.innerHTML = `
    <article class="card">
      <h2>Weekly progress</h2>
      <p>Your dashboard updates from latest real AI form analysis.</p>
      <div class="metric-grid">
        ${data.weeklyProgress.map((item) => `<div class="metric"><span>${item.label}</span><strong>${item.value}</strong></div>`).join('')}
      </div>
    </article>
  `;
}

function bindLogin() {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.currentScreen = 'sports';
    syncNav();
    renderScreen();
  });
}

function syncNav() {
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.screen === state.currentScreen);
  });
}

document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.currentScreen = btn.dataset.screen;
    syncNav();
    renderScreen();
  });
});

document.getElementById('themeToggle').addEventListener('click', () => {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('light', !state.darkMode);
  document.getElementById('themeToggle').textContent = state.darkMode ? '🌙' : '☀️';
});

renderScreen();
