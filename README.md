# LevelUp AI (Athlete Mobile App Prototype)

A mobile-first web prototype for **LevelUp AI**, designed for athletes to log in, select sports, upload/record training videos, and review simulated AI performance insights.

## Features

- Athlete login screen
- Multi-sport selection
- Training video capture/upload actions (UI simulation)
- AI analysis screen with:
  - Skill scores
  - Detected mistakes
  - Recommended drills
  - Injury alerts
- Weekly progress dashboard
- Bottom tab-style navigation between all screens
- Dark mode with blue accent branding + light mode toggle

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173` in your browser.
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
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LevelUp AI</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="app-shell">
      <header class="top-bar">
        <div>
          <p class="eyebrow">LevelUp AI</p>
          <h1 id="screenTitle">Athlete Login</h1>
        </div>
        <button id="themeToggle" class="ghost-btn" aria-label="Toggle theme">🌙</button>
      </header>

      <main id="screenContainer" class="screen-container"></main>

      <nav class="bottom-nav" aria-label="Main navigation">
        <button data-screen="login" class="nav-item active">Login</button>
        <button data-screen="sports" class="nav-item">Sports</button>
        <button data-screen="video" class="nav-item">Video</button>
        <button data-screen="analysis" class="nav-item">Analysis</button>
        <button data-screen="dashboard" class="nav-item">Dashboard</button>
      </nav>
    </div>

    <template id="loginScreen">
      <section class="card-stack">
        <article class="card">
          <h2>Welcome back athlete 👋</h2>
          <p>Sign in to review your performance and unlock AI training insights.</p>
          <form class="form-grid" id="loginForm">
            <label>
              Email
              <input type="email" placeholder="athlete@email.com" required />
            </label>
            <label>
              Password
              <input type="password" placeholder="••••••••" required />
            </label>
            <button type="submit" class="primary-btn">Log In</button>
          </form>
        </article>
        <article class="card">
          <h3>Why LevelUp AI?</h3>
          <ul>
            <li>Personalized skill scoring</li>
            <li>Mistake detection from every session</li>
            <li>Recommended drills for faster improvement</li>
          </ul>
        </article>
      </section>
    </template>

    <template id="sportsScreen">
      <section class="card-stack">
        <article class="card">
          <h2>Select your sports</h2>
          <p>Choose one or more sports so our AI can tailor your analysis.</p>
          <div class="chip-grid" id="sportsChips"></div>
          <button class="primary-btn" id="saveSports">Save Preferences</button>
        </article>
      </section>
    </template>

    <template id="videoScreen">
      <section class="card-stack">
        <article class="card">
          <h2>Capture training session</h2>
          <p>Record with your camera or upload your latest workout clip.</p>
          <div class="split-actions">
            <button class="primary-btn">🎥 Record Video</button>
            <button class="secondary-btn">⬆️ Upload Video</button>
          </div>
          <div class="mock-upload">
            <p><strong>Latest upload:</strong> sprint-drills-session.mp4</p>
            <p>Status: Ready for AI analysis</p>
          </div>
        </article>
      </section>
    </template>

    <template id="analysisScreen">
      <section class="card-stack" id="analysisContent"></section>
    </template>

    <template id="dashboardScreen">
      <section class="card-stack" id="dashboardContent"></section>
    </template>

    <script src="app.js"></script>
  </body>
</html>
:root {
  --bg: #0b1020;
  --surface: #121a2f;
  --surface-alt: #1a2542;
  --text: #e7ecff;
  --muted: #aeb7d8;
  --accent: #3f7bff;
  --accent-soft: rgba(63, 123, 255, 0.2);
  --success: #35d49c;
  --warning: #ffb84a;
  --danger: #ff6f7f;
}

body.light {
  --bg: #f4f7ff;
  --surface: #ffffff;
  --surface-alt: #ebf0ff;
  --text: #11162e;
  --muted: #5b6280;
  --accent: #2f68f2;
  --accent-soft: rgba(47, 104, 242, 0.14);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background: radial-gradient(circle at top, #142244 0, var(--bg) 50%);
  color: var(--text);
  display: grid;
  place-items: center;
  padding: 16px;
}

.app-shell {
  width: min(440px, 100%);
  background: var(--surface);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  min-height: 90vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.top-bar {
  padding: 18px 18px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.eyebrow { margin: 0; color: var(--accent); font-weight: 700; letter-spacing: .04em; text-transform: uppercase; font-size: .78rem; }

h1 { margin: 4px 0 0; font-size: 1.35rem; }
h2 { margin-top: 0; }
h3 { margin-top: 0; }

.ghost-btn, .primary-btn, .secondary-btn {
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.ghost-btn {
  width: 38px;
  height: 38px;
  background: var(--surface-alt);
  color: var(--text);
}

.primary-btn {
  background: var(--accent);
  color: #fff;
  padding: 12px 14px;
}

.secondary-btn {
  background: var(--accent-soft);
  color: var(--text);
  padding: 12px 14px;
}

.screen-container {
  padding: 10px 16px 20px;
  overflow: auto;
}

.card-stack { display: grid; gap: 12px; }

.card {
  background: var(--surface-alt);
  border-radius: 18px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.07);
}

.form-grid { display: grid; gap: 10px; margin-top: 12px; }
label { display: grid; gap: 6px; font-size: .9rem; color: var(--muted); }
input {
  background: var(--surface);
  color: var(--text);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 10px;
}

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 14px 0;
}

.chip {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

.chip.selected { background: var(--accent-soft); border-color: var(--accent); }

.split-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }

.mock-upload {
  font-size: .9rem;
  color: var(--muted);
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed rgba(255,255,255,0.2);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.metric {
  background: var(--surface);
  border-radius: 12px;
  padding: 10px;
}

.metric strong { display: block; font-size: 1.3rem; margin-top: 4px; }

.pill {
  display: inline-block;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: .8rem;
  font-weight: 700;
}

.pill.warning { background: rgba(255, 184, 74, .2); color: var(--warning); }
.pill.danger { background: rgba(255, 111, 127, .2); color: var(--danger); }
.pill.success { background: rgba(53, 212, 156, .2); color: var(--success); }

.bottom-nav {
  border-top: 1px solid rgba(255,255,255,0.08);
  background: var(--surface);
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.nav-item {
  border: none;
  background: transparent;
  color: var(--muted);
  padding: 8px 4px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.nav-item.active {
  color: var(--text);
  background: var(--accent-soft);
}
