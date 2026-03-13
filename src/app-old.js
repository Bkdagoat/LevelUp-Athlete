// Temporary configuration variable used to gate access during private beta.
// TODO: Remove private-beta gate when app is publicly launched. This is only
// front‑end protection; real enforcement must happen on the server side.
// The value is currently hardcoded so it can be moved to an env/config
// variable later if needed.
const ALLOWED_USERNAME = 'athlete@email.com';

const state = {
  authenticated: false,
  step: 0, // 0: login, 1: sports, 2: video, 3: analysis, 4: dashboard
  darkMode: true,
  selectedSports: new Set(),
  uploadedFile: null,
  uploadedPreviewURL: null,
  analysisResult: null,
  analyzing: false,
  userId: null
};

const sports = ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Track', 'Swimming', 'Volleyball', 'Boxing', 'Hockey', 'Rugby', 'Golf', 'Gymnastics'];

const fallbackData = {
  athlete: 'Chibuikeanyi Ibe',
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
  0: 'Athlete Login',
  1: 'Sports Selection',
  2: 'Training Video',
  3: 'AI Analysis',
  4: 'Weekly Dashboard'
};

const screenContainer = document.getElementById('screenContainer');
const screenTitle = document.getElementById('screenTitle');

async function initApp() {
  // Check authentication and progress
  try {
    const response = await fetch('/api/progress');
    if (response.ok) {
      const progress = await response.json();
      state.authenticated = true;
      state.step = progress.step || 0;
      state.selectedSports = new Set(progress.sports || []);
      state.userId = 'athlete1'; // From session
    } else {
      state.step = 0;
    }
  } catch (error) {
    state.step = 0;
  }
  renderScreen();
}

function renderScreen() {
  const templateId = ['loginScreen', 'sportsScreen', 'videoScreen', 'analysisScreen', 'dashboardScreen'][state.step];
  const template = document.getElementById(templateId);
  screenContainer.innerHTML = '';
  screenContainer.appendChild(template.content.cloneNode(true));
  screenTitle.textContent = screenTitles[state.step];

  if (state.step === 1) renderSports();
  if (state.step === 2) renderVideoUpload();
  if (state.step === 3) renderAnalysis();
  if (state.step === 4) renderDashboard();
  if (state.step === 0) bindLogin();
}

function canProceedToStep(step) {
  if (step === 0) return true;
  if (!state.authenticated) return false;
  if (step === 1) return true;
  if (step === 2) return state.selectedSports.size > 0;
  if (step === 3) return state.uploadedFile !== null;
  if (step === 4) return state.analysisResult !== null;
  return false;
}

async function proceedToStep(step) {
  if (!canProceedToStep(step)) return;
  state.step = step;
  await updateProgress();
  renderScreen();
}

async function updateProgress() {
  if (!state.authenticated) return;
  const progress = {
    step: state.step,
    sports: Array.from(state.selectedSports),
    videoUploaded: state.uploadedFile !== null,
    analysisDone: state.analysisResult !== null
  };
  await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress)
  });
}

function renderSports() {
  const chipWrap = document.getElementById('sportsChips');
  // ID in HTML is "saveSports"; previous mismatched ID caused a null
  // continueBtn and subsequent JS errors, which prevented interaction.
  const continueBtn = document.getElementById('saveSports');

  function updateContinueBtn() {
    continueBtn.disabled = state.selectedSports.size === 0;
  }

  sports.forEach((sport) => {
    const chip = document.createElement('button');
    chip.className = `chip ${state.selectedSports.has(sport) ? 'selected' : ''}`;
    chip.textContent = sport;
    chip.addEventListener('click', () => {
      if (state.selectedSports.has(sport)) state.selectedSports.delete(sport);
      else state.selectedSports.add(sport);
      updateContinueBtn();
      renderScreen();
    });
    chipWrap.appendChild(chip);
  });

  updateContinueBtn();

  continueBtn.addEventListener('click', () => {
    proceedToStep(2);
  });
}

function renderVideoUpload() {
  const mediaInput = document.getElementById('mediaInput');
  const uploadStatus = document.getElementById('uploadStatus');
  const previewWrap = document.getElementById('previewWrap');
  const sportSelect = document.getElementById('sportSelect');
  const continueBtn = document.getElementById('videoContinue');

  sportSelect.innerHTML = '';
  state.selectedSports.forEach((sport) => {
    const option = document.createElement('option');
    option.value = sport.toLowerCase();
    option.textContent = sport;
    sportSelect.appendChild(option);
  });

  const refreshPreview = () => {
    previewWrap.innerHTML = '';
    if (!state.uploadedPreviewURL || !state.uploadedFile) return;

    const isVideo = state.uploadedFile.type.startsWith('video/');
    const el = document.createElement(isVideo ? 'video' : 'img');
    el.src = state.uploadedPreviewURL;
    if (isVideo) el.controls = true;
    previewWrap.appendChild(el);

    uploadStatus.innerHTML = `<p><strong>Status:</strong> ${state.uploadedFile.name} ready</p>`;
    continueBtn.disabled = false;
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
    continueBtn.disabled = true;
  });

  document.getElementById('analyzeMedia').addEventListener('click', async () => {
    if (!state.uploadedFile || state.analyzing) {
      if (!state.uploadedFile) alert('Upload an image or video first.');
      return;
    }

    state.analyzing = true;
    uploadStatus.innerHTML = '<p><strong>Status:</strong> Running real pose AI analysis...</p>';

    const sport = sportSelect.value;
    const formData = new FormData();
    formData.append('userId', state.userId);
    formData.append('sport', sport);
    formData.append('media', state.uploadedFile);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      state.analysisResult = result;
      uploadStatus.innerHTML = '<p><strong>Status:</strong> Analysis complete ✅</p>';
      proceedToStep(3);
    } catch (error) {
      console.error(error);
      uploadStatus.innerHTML = '<p><strong>Status:</strong> Analysis failed. Check server.</p>';
      alert('Real AI analysis failed. Ensure server is running.');
    } finally {
      state.analyzing = false;
    }
  });

  continueBtn.addEventListener('click', () => {
    proceedToStep(3);
  });
}

function renderAnalysis() {
  const data = state.analysisResult || fallbackData;
  const root = document.getElementById('analysisContent');
  root.innerHTML = `
    <article class="card">
      <h2>${data.userId || 'Athlete'}</h2>
      <p>${data.session || `Real AI ${data.sport || 'sport'} analysis complete`}</p>
      <div class="metric-grid">
        ${Object.entries(data.scores || {}).map(([key, value]) => `<div class="metric"><span>${key}</span><strong>${value}/100</strong></div>`).join('')}
      </div>
    </article>
    <article class="card">
      <h3>Detected form issues</h3>
      <ul>${(data.detectedMistakes || []).map((m) => `<li>${m.explanation}</li>`).join('')}</ul>
    </article>
    <article class="card">
      <h3>How to improve</h3>
      <ul>${(data.recommendedDrills || []).map((d) => `<li>${d.name} (${d.sets}): ${d.why}</li>`).join('')}</ul>
    </article>
    <article class="card">
      <h3>Injury risk alerts</h3>
      ${(data.injuryAlerts || []).map((alert) => `<p><span class="pill ${alert.level}">${alert.level.toUpperCase()}</span> ${alert.reason}</p>`).join('')}
    </article>
    <button class="primary-btn" id="analysisContinue">Continue</button>
  `;

  document.getElementById('analysisContinue').addEventListener('click', () => {
    proceedToStep(4);
  });
}

function renderDashboard() {
  const data = state.analysisResult || fallbackData;
  const root = document.getElementById('dashboardContent');
  root.innerHTML = `
    <article class="card">
      <h2>Weekly progress</h2>
      <p>Your dashboard updates from latest real AI form analysis.</p>
      <div class="metric-grid">
        ${Object.entries(data.weeklyProgress || {}).map(([key, value]) => `<div class="metric"><span>${key}</span><strong>${value}</strong></div>`).join('')}
      </div>
    </article>
    <button class="primary-btn" id="dashboardContinue">Start New Session</button>
  `;

  document.getElementById('dashboardContinue').addEventListener('click', () => {
    // Reset to step 2 for new session
    state.uploadedFile = null;
    state.uploadedPreviewURL = null;
    state.analysisResult = null;
    proceedToStep(2);
  });
}

function bindLogin() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const continueBtn = document.getElementById('loginContinue');
  const errorDiv = document.getElementById('loginError');

  function updateContinueBtn() {
    continueBtn.disabled = !emailInput.value.trim() || !passwordInput.value.trim();
  }

  emailInput.addEventListener('input', updateContinueBtn);
  passwordInput.addEventListener('input', updateContinueBtn);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    // private-beta access gate (front-end only)
    // NOTE: this check is purely for early UX; a determined user can
    // bypass it.  Proper restriction should be enforced on the server.
    if (email !== ALLOWED_USERNAME.toLowerCase()) {
      errorDiv.textContent = 'This app is currently private. Access is restricted.';
      errorDiv.style.display = 'block';
      return;
    }

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok) {
        state.authenticated = true;
        state.userId = result.userId;
        errorDiv.style.display = 'none';
        proceedToStep(1);
      } else {
        errorDiv.textContent = result.error || 'Sign in failed';
        errorDiv.style.display = 'block';
      }
    } catch (error) {
      errorDiv.textContent = 'Network error';
      errorDiv.style.display = 'block';
    }
  });
}

document.getElementById('themeToggle').addEventListener('click', () => {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('light', !state.darkMode);
  document.getElementById('themeToggle').textContent = state.darkMode ? '🌙' : '☀️';
});

initApp();
