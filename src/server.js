import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import analyzeRouter from './routes/analyze.js';

const app = express();
// Render (and many other hosting providers) supplies the port in an environment
// variable.  Fall back to 3000 for local development/testing.
const PORT = process.env.PORT || 3000;

// temporary private-beta access control
// TODO: move to environment/config or remove post-launch
const ALLOWED_USERNAME = 'athlete@email.com';

app.use(express.json());
app.use(session({
  // in production you should set SESSION_SECRET in environment variables
  secret: process.env.SESSION_SECRET || 'levelup-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
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
  let { email, password } = req.body;
  email = (email || '').trim().toLowerCase();

  // TODO: Remove private-beta gate when app is publicly launched
  // This is a prototype measure; real access control must be handled
  // by authentication/authz in production.
  if (email !== ALLOWED_USERNAME.toLowerCase()) {
    return res.status(401).json({ error: 'This app is currently private. Access is restricted.' });
  }

  // Simple prototype auth: any password is accepted as long as the
  // allowed username matches.  This keeps the gate tied to your email
  // only, per the temporary requirement.
  if (email === ALLOWED_USERNAME.toLowerCase()) {
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