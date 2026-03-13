import { generateFakeAnalysis, getAthleteProgress, generateTeamAnalytics } from './fakeAnalysis.js';

const ALLOWED_USERNAME = 'athlete@email.com';

const state = {
  authenticated: false,
  currentPage: 0,
  darkMode: true,
  selectedSports: new Set(),
  uploadedFile: null,
  uploadedPreviewURL: null,
  analysisResult: null,
  analyzing: false,
  userId: null,
  userName: 'Athlete',
  currentAthlete: null,
  athletes: {},
  allAthletes: [
    { id: 'athlete1', name: 'Jordan Smith', sport: 'Basketball', skillScore: 86, rank: 'Elite', analyses: [] },
    { id: 'athlete2', name: 'Alex Johnson', sport: 'Soccer', skillScore: 72, rank: 'Gold', analyses: [] },
    { id: 'athlete3', name: 'Taylor Williams', sport: 'Tennis', skillScore: 65, rank: 'Gold', analyses: [] },
    { id: 'athlete4', name: 'Morgan Davis', sport: 'Track', skillScore: 78, rank: 'Gold', analyses: [] }
  ],
  userRole: 'athlete'
};

const sports = ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Track', 'Swimming', 'Volleyball', 'Boxing', 'Hockey', 'Rugby', 'Golf', 'Gymnastics'];

const pageScreenMap = {
  0: 'loginScreen',
  1: 'sportsScreen',
  2: 'videoScreen',
  3: 'analysisScreen',
  4: 'coachDashboardScreen',
  5: 'teamAnalyticsScreen'
};

const pageTitles = {
  0: 'Athlete Login',
  1: 'Sports Selection',
  2: 'Training Video',
  3: 'AI Analysis Results',
  4: 'Coach Dashboard',
  5: 'Team Analytics'
};

const screenContainer = document.getElementById('screenContainer');
const screenTitle = document.getElementById('screenTitle');

async function initApp() {
  try {
    const response = await fetch('/api/progress');
    if (response.ok) {
      const progress = await response.json();
      state.authenticated = true;
      state.currentPage = progress.page || 0;
      state.selectedSports = new Set(progress.sports || []);
      state.userId = 'athlete1';
      state.userName = 'Athlete';
    } else {
      state.currentPage = 0;
    }
  } catch (error) {
    console.error('Init error:', error);
    state.currentPage = 0;
  }
  
  setupNavigation();
  renderPage();
}

function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if (state.authenticated || idx === 0) {
        state.currentPage = idx;
        updateNavActive();
        renderPage();
      }
    });
  });
}

function updateNavActive() {
  document.querySelectorAll('.nav-item').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === state.currentPage);
  });
}

function renderPage() {
  const templateId = pageScreenMap[state.currentPage];
  const template = document.getElementById(templateId);
  if (!template) {
    console.error(`Template ${templateId} not found`);
    return;
  }
  
  screenContainer.innerHTML = '';
  screenContainer.appendChild(template.content.cloneNode(true));
  screenTitle.textContent = pageTitles[state.currentPage];
  updateNavActive();

  switch (state.currentPage) {
    case 0: renderLogin(); break;
    case 1: renderSports(); break;
    case 2: renderVideoUpload(); break;
    case 3: renderAnalysis(); break;
    case 4: renderCoachDashboard(); break;
    case 5: renderTeamAnalytics(); break;
  }
}

function renderLogin() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginContinue');
  const errorDiv = document.getElementById('loginError');

  function updateLoginBtn() {
    loginBtn.disabled = !emailInput.value.trim() || !passwordInput.value.trim();
  }

  emailInput.addEventListener('input', updateLoginBtn);
  passwordInput.addEventListener('input', updateLoginBtn);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

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
        state.userName = email.split('@')[0];
        errorDiv.style.display = 'none';
        state.currentPage = 1;
        renderPage();
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

function renderSports() {
  const chipWrap = document.getElementById('sportsChips');
  const saveBtn = document.getElementById('saveSports');

  chipWrap.innerHTML = '';
  sports.forEach((sport) => {
    const chip = document.createElement('button');
    chip.className = `chip ${state.selectedSports.has(sport) ? 'selected' : ''}`;
    chip.textContent = sport;
    chip.type = 'button';
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.selectedSports.has(sport)) {
        state.selectedSports.delete(sport);
      } else {
        state.selectedSports.add(sport);
      }
      chip.classList.toggle('selected');
    });
    chipWrap.appendChild(chip);
  });

  saveBtn.disabled = state.selectedSports.size === 0;
  saveBtn.addEventListener('click', () => {
    state.currentPage = 2;
    renderPage();
  });
}

function renderVideoUpload() {
  const mediaInput = document.getElementById('mediaInput');
  const uploadStatus = document.getElementById('uploadStatus');
  const previewWrap = document.getElementById('previewWrap');
  const sportSelect = document.getElementById('sportSelect');
  const analyzeBtn = document.getElementById('analyzeMedia');
  const clearBtn = document.getElementById('clearMedia');

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

  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.uploadedPreviewURL) URL.revokeObjectURL(state.uploadedPreviewURL);
    state.uploadedFile = null;
    state.uploadedPreviewURL = null;
    state.analysisResult = null;
    uploadStatus.innerHTML = '<p><strong>Status:</strong> Waiting for upload</p>';
    previewWrap.innerHTML = '';
    mediaInput.value = '';
  });

  analyzeBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!state.uploadedFile || state.analyzing) {
      if (!state.uploadedFile) alert('Upload an image or video first.');
      return;
    }

    state.analyzing = true;
    uploadStatus.innerHTML = `<div class="loading-spinner"></div><p><strong>Status:</strong> Running AI analysis simulation... (3 seconds)</p>`;

    const sport = sportSelect.value;

    // Simulate 3-second loading animation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate fake analysis
    const fakeAnalysis = generateFakeAnalysis(sport, 'intermediate');
    state.analysisResult = {
      ...fakeAnalysis,
      userId: state.userId,
      timestamp: new Date().toISOString()
    };

    uploadStatus.innerHTML = '<p><strong>Status:</strong> Analysis complete ✅</p>';
    state.analyzing = false;
    state.currentPage = 3;
    renderPage();
  });
}

function renderAnalysis() {
  const data = state.analysisResult;
  if (!data) {
    screenContainer.innerHTML = '<p>No analysis results available.</p>';
    return;
  }

  const root = document.getElementById('analysisContent');
  const rankColor = getRankColor(data.rankTier);

  root.innerHTML = `
    <article class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0;">${state.userName}</h2>
          <p style="margin: 4px 0; color: var(--muted);">${data.sport}</p>
        </div>
        <div class="rank-badge" style="background: ${rankColor};">
          <strong>${data.rankTier}</strong>
          <p>${data.skillScore}</p>
        </div>
      </div>
    </article>

    <article class="card">
      <h3>Performance Score</h3>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${data.skillScore}%"></div>
      </div>
      <p style="text-align: center; font-size: 1.4rem; margin: 12px 0; font-weight: 700;">${data.skillScore}/100</p>
    </article>

    <article class="card">
      <h3>Detected Issues (${data.mistakes.length})</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${data.mistakes.map((m) => `<li>${m}</li>`).join('')}
      </ul>
    </article>

    <article class="card">
      <h3>Recommended Drills</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${data.recommendedDrills.slice(0, 5).map((d) => `<li>${d}</li>`).join('')}
      </ul>
    </article>

    <article class="card">
      <h3>Injury Risk Assessment</h3>
      <p><span class="pill ${data.injuryRisk.toLowerCase()}">${data.injuryRisk.toUpperCase()}</span></p>
      <p style="font-size: 0.9rem; color: var(--muted);">Based on detected form issues and movement patterns</p>
    </article>

    <article class="card">
      <h3>Strengths</h3>
      <p>${data.strengths.join(', ')}</p>
    </article>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <button class="secondary-btn" id="newAnalysis">New Analysis</button>
      <button class="primary-btn" id="viewDashboard">View Dashboard</button>
    </div>
  `;

  document.getElementById('newAnalysis').addEventListener('click', () => {
    state.analysisResult = null;
    state.uploadedFile = null;
    state.uploadedPreviewURL = null;
    state.currentPage = 2;
    renderPage();
  });

  document.getElementById('viewDashboard').addEventListener('click', () => {
    state.currentPage = 4;
    renderPage();
  });
}

function renderCoachDashboard() {
  const root = document.getElementById('coachContent');

  // Prepare athlete data
  const athletesData = state.allAthletes.map(a => ({
    ...a,
    recentScore: a.analyses?.[a.analyses.length - 1]?.skillScore || a.skillScore
  }));

  const avgScore = Math.round(athletesData.reduce((sum, a) => sum + a.recentScore, 0) / athletesData.length);

  root.innerHTML = `
    <article class="card">
      <h2>Coach Dashboard</h2>
      <p>Manage athletes and track performance</p>
    </article>

    <article class="card">
      <h3>Team Overview</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <p class="stat-label">Total Athletes</p>
          <p class="stat-value">${athletesData.length}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Avg Skill Score</p>
          <p class="stat-value">${avgScore}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Sessions Today</p>
          <p class="stat-value">3</p>
        </div>
      </div>
    </article>

    <article class="card">
      <h3>Athlete Roster</h3>
      ${athletesData.map(a => `
        <div class="athlete-row">
          <div>
            <h4 style="margin: 0;">${a.name}</h4>
            <p style="margin: 4px 0; color: var(--muted); font-size: 0.9rem;">${a.sport}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-weight: 700;">${a.recentScore}</p>
            <p style="margin: 4px 0; color: var(--muted); font-size: 0.9rem;">${a.rank}</p>
          </div>
        </div>
      `).join('')}
    </article>

    <article class="card">
      <h3>Upload Athlete Video</h3>
      <label>
        Athlete Name
        <input type="text" id="coachAthleteInput" placeholder="Select or enter name" />
      </label>
      <label>
        Sport
        <select id="coachSportSelect">
          ${sports.map(s => `<option value="${s.toLowerCase()}">${s}</option>`).join('')}
        </select>
      </label>
      <label>
        Video File
        <input type="file" id="coachVideoInput" accept="image/*,video/*" />
      </label>
      <button class="primary-btn" id="coachAnalyzeBtn">Analyze Video</button>
    </article>

    <article class="card">
      <h3>Recent Analyses</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Jordan Smith - Basketball: 82 (Improving)</li>
        <li>Alex Johnson - Soccer: 71 (Stable)</li>
        <li>Taylor Williams - Tennis: 68 (Needs Work)</li>
      </ul>
    </article>
  `;

  document.getElementById('coachAnalyzeBtn').addEventListener('click', () => {
    const athleteInput = document.getElementById('coachAthleteInput');
    const videoInput = document.getElementById('coachVideoInput');
    
    if (!athleteInput.value || !videoInput.files[0]) {
      alert('Please select an athlete and video file');
      return;
    }
    
    alert(`Analyzing video for ${athleteInput.value}...`);
  });
}

function renderTeamAnalytics() {
  const root = document.getElementById('teamAnalyticsContent');
  const analytics = generateTeamAnalytics(state.allAthletes);

  root.innerHTML = `
    <article class="card">
      <h2>Team Analytics</h2>
      <p>Comprehensive team performance metrics</p>
    </article>

    <article class="card">
      <h3>Team Performance Overview</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <p class="stat-label">Avg Skill Score</p>
          <p class="stat-value">${analytics.teamAverageScore}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Players Improving</p>
          <p class="stat-value">${analytics.playersImproving}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Injury Alerts</p>
          <p class="stat-value">${analytics.injuryRiskAlerts}</p>
        </div>
      </div>
    </article>

    <article class="card">
      <h3>Most Common Issue</h3>
      <p style="font-size: 1.1rem; font-weight: 600;">${analytics.mostCommonMistake}</p>
      <p style="color: var(--muted); margin-top: 8px;">Focus team drills on this area</p>
    </article>

    <article class="card">
      <h3>Ranking Leaderboard</h3>
      ${state.allAthletes.map((a, i) => `
        <div class="leaderboard-row">
          <span style="font-weight: 700; color: var(--accent); min-width: 30px;">#${i + 1}</span>
          <div style="flex: 1;">
            <p style="margin: 0; font-weight: 600;">${a.name}</p>
            <p style="margin: 4px 0; font-size: 0.9rem; color: var(--muted);">${a.sport}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-weight: 700;">${a.skillScore}</p>
            <p style="margin: 4px 0; font-size: 0.9rem; color: var(--accent);">${a.rank}</p>
          </div>
        </div>
      `).join('')}
    </article>

    <article class="card">
      <h3>Weekly Improvements</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Jordan Smith: +5 points</li>
        <li>Morgan Davis: +3 points</li>
        <li>Alex Johnson: +1 point</li>
      </ul>
    </article>

    <article class="card">
      <h3>High Injury Risk Athletes</h3>
      ${analytics.injuryRiskAlerts > 0 ? `
        <p style="color: var(--danger); font-weight: 600;">⚠️ ${analytics.injuryRiskAlerts} athlete(s) at high risk</p>
        <p style="font-size: 0.9rem; color: var(--muted);">Review their recent analyses and recommend rest or form correction</p>
      ` : `
        <p style="color: var(--success);">✓ All athletes at low risk</p>
      `}
    </article>
  `;
}

function getRankColor(rank) {
  const colors = {
    'Pro': '#FFD700',
    'Elite': '#E91E63',
    'Gold': '#FFA500',
    'Silver': '#C0C0C0',
    'Bronze': '#CD7F32'
  };
  return colors[rank] || '#3F7BFF';
}

document.getElementById('themeToggle').addEventListener('click', () => {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('light', !state.darkMode);
  document.getElementById('themeToggle').textContent = state.darkMode ? '🌙' : '☀️';
});

initApp();
