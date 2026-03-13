import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { generateFakeAnalysis } from '../fakeAnalysis.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage for athlete data (replace with database in production)
const athleteDatabase = {};

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// POST /api/analyze - Generate fake/prototype AI analysis
router.post('/analyze', requireAuth, upload.single('media'), async (req, res) => {
  const { userId, sport } = req.body;
  const mediaFile = req.file;

  try {
    // Simulate a 3-second processing delay (optional)
    // This is already done on the frontend, but we can do it here too
    
    // Generate fake analysis
    const analysis = generateFakeAnalysis(sport, 'intermediate');
    
    // Add metadata
    const result = {
      ...analysis,
      analysisId: uuidv4(),
      userId,
      timestamp: new Date().toISOString(),
      videoFileName: mediaFile?.originalname || 'session.mp4'
    };

    // Store in athlete database
    if (!athleteDatabase[userId]) {
      athleteDatabase[userId] = {
        userId,
        analyses: []
      };
    }
    athleteDatabase[userId].analyses.push(result);

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// GET /api/athlete/:userId - Get athlete profile with analysis history
router.get('/athlete/:userId', requireAuth, (req, res) => {
  const { userId } = req.params;
  const athlete = athleteDatabase[userId] || { userId, analyses: [] };
  res.json(athlete);
});

// GET /api/athletes - Get all athletes (for coach dashboard)
router.get('/athletes', requireAuth, (req, res) => {
  const athletes = Object.values(athleteDatabase);
  res.json(athletes);
});

// POST /api/athlete/:userId/analyses - Get athlete's analysis history
router.get('/athlete/:userId/analyses', requireAuth, (req, res) => {
  const { userId } = req.params;
  const athlete = athleteDatabase[userId];
  if (!athlete) {
    return res.json({ analyses: [] });
  }
  res.json({ analyses: athlete.analyses });
});

export default router;
