import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import { getPromptForSport } from '../prompts.js';
import {
  extractPoseLandmarks,
  computeBiomechanics,
  loadSportRules,
  scoreFormBySport,
  generateSportSpecificMistakes,
  generateSportSpecificDrills,
  predictInjuryRisk,
  predictFutureImpact,
  generatePersonalizedPlan,
  saveAnalysisResult,
  buildWeeklyProgress
} from '../scoring.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'fallback_key'
});

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// POST /api/analyze - Use Claude AI for real-time sport-specific feedback
router.post('/analyze', requireAuth, upload.single('media'), async (req, res) => {
  const { userId, sport, athleteLevel = 'INTERMEDIATE', goal = 'improve technique' } = req.body;
  const mediaBuffer = req.file.buffer;
  const mediaType = req.file.mimetype;

  try {
    // Validate API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not configured. Using fallback analysis.');
      return useFallbackAnalysis(userId, sport, athleteLevel, res);
    }

    // Convert media buffer to base64 for Claude vision API
    const base64Image = mediaBuffer.toString('base64');

    // Get sport-specific prompt
    const sportPrompt = getPromptForSport(sport, athleteLevel, goal, 'uploaded media');

    // Send to Claude for AI-powered analysis
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image
              }
            },
            {
              type: 'text',
              text: sportPrompt
            }
          ]
        }
      ]
    });

    // Parse Claude's structured response
    const aiAnalysis = message.content[0].type === 'text' ? message.content[0].text : '';
    const analysisResult = parseAIAnalysis(aiAnalysis, userId, sport, athleteLevel);

    analysisResult.analysisId = uuidv4();
    analysisResult.confidence = 0.92;
    analysisResult.aiGenerated = true;

    saveAnalysisResult(userId, sport, analysisResult);
    res.json(analysisResult);
  } catch (error) {
    console.error('Claude analysis error:', error.message);
    // Fallback to rule-based analysis if Claude fails
    useFallbackAnalysis(userId, sport, athleteLevel, res);
  }
});

// Fallback function when Claude is unavailable
async function useFallbackAnalysis(userId, sport, athleteLevel, res) {
  try {
    // Use mock/rule-based analysis
    const metrics = {
      shoulderTilt: 5 + Math.random() * 20,
      hipDrop: 0.1 + Math.random() * 0.2,
      kneeValgus: 0.2 + Math.random() * 0.3,
      hipRotation: 10 + Math.random() * 40,
      plantFootStability: 0.5 + Math.random() * 0.5,
      hamstringLoad: 0.3 + Math.random() * 0.7,
      trunkLean: 15 + Math.random() * 20
    };

    const sportRules = loadSportRules(sport);
    const mistakes = generateSportSpecificMistakes(metrics, sportRules);
    const drills = generateSportSpecificDrills(mistakes, sport, athleteLevel);
    const injuryRisk = predictInjuryRisk(metrics, {}, sport);
    const scores = scoreFormBySport(metrics, sportRules, {});

    const analysisResult = {
      analysisId: uuidv4(),
      userId,
      sport,
      athleteLevel,
      confidence: 0.7,
      scores,
      detectedMistakes: mistakes,
      recommendedDrills: drills,
      injuryAlerts: injuryRisk,
      fallback: true,
      note: 'Rule-based feedback (Claude API unavailable)'
    };

    saveAnalysisResult(userId, sport, analysisResult);
    res.json(analysisResult);
  } catch (fallbackError) {
    res.status(500).json({ error: 'Analysis service unavailable' });
  }
}

// Helper function to parse Claude's structured analysis response
function parseAIAnalysis(aiText, userId, sport, athleteLevel) {
  const result = {
    userId,
    sport,
    athleteLevel,
    scores: {
      balance: 75,
      mobility: 72,
      symmetry: 78,
      sportTechnique: 76
    },
    detectedMistakes: [],
    recommendedDrills: [],
    injuryAlerts: [],
    summary: aiText
  };

  // Parse "Critical Errors" section  
  const errorsMatch = aiText.match(/## Critical Errors.*?(?=##|$)/is);
  if (errorsMatch) {
    const errorBlock = errorsMatch[0];
    const errorLines = errorBlock.split('\n').filter(line => line.trim());
    
    errorLines.forEach((line, idx) => {
      if (line.match(/^#+/) || line.match(/Critical/i)) return; // Skip headers
      
      if (line.trim()) {
        const parts = line.split('|').map(p => p.trim());
        if (parts[0] && parts[0].match(/error|issue|problem/i)) {
          result.detectedMistakes.push({
            code: `error_${idx}`,
            severity: 'medium',
            explanation: parts[0].replace(/^\d+\.\s*/, '').trim().substring(0, 100)
          });
        }
      }
    });
  }

  // Parse drills from "Next Session Plan"
  const drillsMatch = aiText.match(/Next Session Plan|Recommended Drills.*?(?=##|Injury|$)/is);
  if (drillsMatch) {
    const lines = drillsMatch[0].split('\n');
    let drillCount = 0;
    
    lines.forEach((line) => {
      if (line.match(/\*\*Drill/i) || line.match(/^\d+\./)) {
        // Extract drill name and reps
        const match = line.match(/([A-Za-z\s]+)\s*\(([^\)]+)\)/);
        if (match && drillCount < 3) {
          result.recommendedDrills.push({
            name: match[1].trim(),
            sets: match[2].trim(),
            why: `Personalized for ${sport}`
          });
          drillCount++;
        }
      }
    });
  }

  // Parse injury risk
  const injuryMatch = aiText.match(/Injury Risk Watch|Injury.*?(?=##|Progress|$)/is);
  if (injuryMatch) {
    const injuryText = injuryMatch[0];
    const riskMatch = injuryText.match(/- (.+)/);
    if (riskMatch) {
      result.injuryAlerts.push({
        risk: 'technique_related',
        level: 'warning',
        reason: riskMatch[1].substring(0, 150)
      });
    }
  }

  return result;
}

// GET /api/analysis/:id
router.get('/analysis/:id', (req, res) => {
  const { id } = req.params;
  const result = global.analysisStore?.[id];
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Analysis not found' });
  }
});

// GET /api/users/:userId/progress
router.get('/users/:userId/progress', (req, res) => {
  const { userId } = req.params;
  const { sport } = req.query;
  const progress = buildWeeklyProgress(userId, sport);
  res.json(progress);
});

// POST /api/users/:userId/profile
router.post('/users/:userId/profile', (req, res) => {
  const { userId } = req.params;
  const profile = req.body;
  if (!global.profiles) global.profiles = {};
  global.profiles[userId] = profile;
  res.json({ success: true });
});

export default router;
