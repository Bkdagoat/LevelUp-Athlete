// postpone importing Mediapipe until needed, since the browser
// bundle references `document` and will crash when loaded in Node.
// extractPoseLandmarks does its own dynamic import when SKIP_MEDIAPIPE
// is not set.
import { SPORT_RULES } from './sportRules.js';
import { v4 as uuidv4 } from 'uuid';

let poseLandmarker;

export async function extractPoseLandmarks(mediaBuffer, mediaType) {
  // For server-side (Node) environments we never actually run Mediapipe –
  // the package pulls in browser globals like `document` which crash.
  // Using either the explicit SKIP flag or detecting absence of `window`
  // allows us to return mock landmarks immediately.
  if (process.env.SKIP_MEDIAPIPE === '1' || typeof window === 'undefined') {
    const mockLandmarks = [
      { x: 0.5, y: 0.1, z: 0, visibility: 0.9 }
    ];
    const confidence = 0.85;
    return { landmarks: mockLandmarks, confidence };
  }

  // lazy-import the heavy Mediapipe bundle inside the function so that
  // the module load doesn't run in Node (where it references `document`)
  if (!poseLandmarker) {
    const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task'
      },
      runningMode: 'IMAGE',
      numPoses: 1
    });
  }

  // For videos, would need to decode frames and aggregate
  // Placeholder: assume image, process single frame

  const mockLandmarks = [
    { x: 0.5, y: 0.1, z: 0, visibility: 0.9 }
  ];
  const confidence = 0.85;

  return { landmarks: mockLandmarks, confidence };
}

export function computeBiomechanics(landmarks) {
  // Compute metrics from landmarks
  // Assume landmarks is array of {x,y,z,visibility}
  // Placeholder calculations – currently mocked for prototype.  To make
  // the front‑end feel responsive we randomize values so "bad" inputs
  // are more likely to generate form issues.  A real implementation would
  // derive these numbers from the landmarks.
  const rand = () => Math.random();

  return {
    shoulderTilt: 5 + rand() * 20,         // degrees
    hipDrop: 0.1 + rand() * 0.2,            // meters (>=0.1)
    kneeValgus: 0.2 + rand() * 0.3,         // ratio (>=0.2, always above basketball threshold)
    hipRotation: 10 + rand() * 40,         // degrees
    plantFootStability: 0.5 + rand() * 0.5, // stability score
    hamstringLoad: 0.3 + rand() * 0.7,      // load fraction
    trunkLean: 15 + rand() * 20,           // degrees (>=15, often over basketball threshold)
    // etc.
  };
}

export function loadSportRules(sport) {
  return SPORT_RULES[sport] || SPORT_RULES.basketball; // default
}

export function scoreFormBySport(metrics, sportRules, athleteProfile) {
  // Compute scores based on metrics, rules, profile
  const scores = {};
  sportRules.keyMetrics.forEach(metric => {
    const value = metrics[metric] || 0;
    const threshold = sportRules.thresholds[metric] || 1;
    scores[metric] = Math.max(0, 100 - (value / threshold) * 100);
  });
  // Aggregate
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  return {
    balance: avg,
    mobility: avg,
    symmetry: avg,
    sportTechnique: avg
  };
}

export function generateSportSpecificMistakes(metrics, sportRules) {
  const mistakes = [];
  Object.keys(sportRules.thresholds).forEach(metric => {
    if (metrics[metric] > sportRules.thresholds[metric]) {
      mistakes.push({
        code: metric,
        severity: 'medium',
        explanation: `High ${metric} detected.`
      });
    }
  });
  return mistakes;
}

export function generateSportSpecificDrills(mistakes, sport, athleteLevel) {
  const drills = [];
  mistakes.forEach(mistake => {
    const issueDrills = SPORT_RULES[sport]?.drillsByIssue[mistake.code] || [];
    issueDrills.forEach(drill => {
      drills.push({
        name: drill,
        sets: '3x10',
        why: `Addresses ${mistake.code} for ${sport}.`
      });
    });
  });
  return drills;
}

export function predictInjuryRisk(metrics, profile, sport) {
  // Simple prediction
  const risks = [];
  if (metrics.hipDrop > 0.1) {
    risks.push({
      risk: 'hip_injury',
      level: 'warning',
      reason: 'High hip drop increases load.'
    });
  }
  return risks;
}

export function predictFutureImpact(metrics, sport, athleteProfile) {
  // Predict future performance based on current metrics
  // Placeholder: simple extrapolation
  const predictions = {
    performanceTrend: metrics.hipDrop < 0.05 ? 'improving' : 'declining',
    injuryProbability: metrics.kneeValgus > 0.15 ? 0.3 : 0.1,
    skillProgression: {
      weeksToNextLevel: 8,
      expectedImprovement: '+12%'
    }
  };
  return predictions;
}

export function buildPersonalizedFeedback({ userId, sport, metrics, mistakes, drills, injuryRisk }) {
  return {
    analysisId: uuidv4(),
    userId,
    sport,
    confidence: 0.87,
    scores: scoreFormBySport(metrics, loadSportRules(sport), {}),
    detectedMistakes: mistakes,
    recommendedDrills: drills,
    injuryAlerts: injuryRisk,
    nextBestActions: ['Practice drills weekly'],
    weeklyProgress: { trend: '+4.2%', consistency: 0.78 }
  };
}

export function saveAnalysisResult(userId, sport, result) {
  // In-memory store for prototype
  if (!global.analysisStore) global.analysisStore = {};
  global.analysisStore[result.analysisId] = result;
  return result.analysisId;
}

export function generatePersonalizedPlan(userId, sport, analysisResults) {
  // Create improvement plan based on analysis
  const plan = {
    userId,
    sport,
    durationWeeks: 6,
    focusAreas: analysisResults.mistakes.map(m => m.code),
    weeklySchedule: [
      { week: 1, drills: analysisResults.drills.slice(0, 2), goals: 'Build foundation' },
      { week: 2, drills: analysisResults.drills, goals: 'Improve technique' }
    ],
    milestones: ['Reduce hip drop by 20%', 'Increase symmetry score to 85']
  };
  return plan;
}

export function buildWeeklyProgress(userId, sport) {
  // Mock progress
  return { trend: '+4.2%', consistency: 0.78 };
}