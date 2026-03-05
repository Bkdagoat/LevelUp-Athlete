import express from 'express';
import session from 'express-session';
import analyzeRouter from './routes/analyze.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({
  secret: 'levelup-secret-key', // In production, use env var
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Auth routes
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;
  // Simple hardcoded auth for prototype
  if (email === 'athlete@email.com' && password === 'password') {
    req.session.userId = 'athlete1';
    req.session.progress = req.session.progress || { step: 0, sports: [], videoUploaded: false, analysisDone: false };
    res.json({ success: true, userId: req.session.userId });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/signout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get user progress
app.get('/api/progress', requireAuth, (req, res) => {
  res.json(req.session.progress);
});

// Update progress
app.post('/api/progress', requireAuth, (req, res) => {
  const { step, sports, videoUploaded, analysisDone } = req.body;
  req.session.progress = { ...req.session.progress, step, sports, videoUploaded, analysisDone };
  res.json({ success: true });
});

app.use('/api', analyzeRouter);

// Serve static files from root for the frontend
app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});