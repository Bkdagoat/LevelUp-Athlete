const state = {
  currentScreen: 'login',
  darkMode: true,
  selectedSports: new Set(['Soccer', 'Basketball'])
};

const sports = ['Soccer', 'Basketball', 'Tennis', 'Baseball', 'Track', 'Swimming', 'Volleyball', 'Boxing'];

const mockAIData = {
  athlete: 'Jordan Lee',
  session: 'Sprint mechanics - 35 min',
  skillScores: [
    { name: 'Footwork', score: 86 },
    { name: 'Acceleration', score: 79 },
    { name: 'Balance', score: 83 },
    { name: 'Form Consistency', score: 75 }
  ],
  mistakes: [
    'Overstriding during first 10m burst',
    'Arm swing crossing midline on fatigue reps',
    'Heel striking on deceleration phase'
  ],
  drills: [
    'A-skip progression - 3 x 20m',
    'Wall drive holds - 4 x 20 seconds',
    'Single-leg balance to sprint starts - 3 sets'
  ],
  injuryAlerts: [
    { level: 'warning', text: 'Moderate knee load asymmetry detected (12% variance).' },
    { level: 'danger', text: 'Hamstring fatigue trend increased across final 2 sets.' }
  ],
  weeklyProgress: [
    { label: 'Skill Score', value: '+6.8%' },
    { label: 'Mistakes per Session', value: '-18%' },
    { label: 'Training Volume', value: '+12%' },
    { label: 'Recovery Quality', value: '84/100' }
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

function renderScreen() {
  const templateId = `${state.currentScreen}Screen`;
  const template = document.getElementById(templateId);
  screenContainer.innerHTML = '';
  screenContainer.appendChild(template.content.cloneNode(true));
  screenTitle.textContent = screenTitles[state.currentScreen];

  if (state.currentScreen === 'sports') renderSports();
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

function renderAnalysis() {
  const root = document.getElementById('analysisContent');
  root.innerHTML = `
    <article class="card">
      <h2>${mockAIData.athlete}</h2>
      <p>${mockAIData.session}</p>
      <div class="metric-grid">
        ${mockAIData.skillScores
          .map((item) => `<div class="metric"><span>${item.name}</span><strong>${item.score}/100</strong></div>`)
          .join('')}
      </div>
    </article>
    <article class="card">
      <h3>Detected mistakes</h3>
      <ul>${mockAIData.mistakes.map((m) => `<li>${m}</li>`).join('')}</ul>
    </article>
    <article class="card">
      <h3>Recommended drills</h3>
      <ul>${mockAIData.drills.map((d) => `<li>${d}</li>`).join('')}</ul>
    </article>
    <article class="card">
      <h3>Injury alerts</h3>
      ${mockAIData.injuryAlerts
        .map((alert) => `<p><span class="pill ${alert.level}">${alert.level.toUpperCase()}</span> ${alert.text}</p>`)
        .join('')}
    </article>
  `;
}

function renderDashboard() {
  const root = document.getElementById('dashboardContent');
  root.innerHTML = `
    <article class="card">
      <h2>Weekly progress</h2>
      <p>Overview of your performance trends powered by simulated AI insights.</p>
      <div class="metric-grid">
      ${mockAIData.weeklyProgress
        .map((item) => `<div class="metric"><span>${item.label}</span><strong>${item.value}</strong></div>`)
        .join('')}
      </div>
    </article>
    <article class="card">
      <h3>Coach notes</h3>
      <p>Consistency improved this week. Focus on start mechanics and hamstring recovery mobility before high-intensity days.</p>
      <span class="pill success">On Track</span>
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
