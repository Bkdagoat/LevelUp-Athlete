# Copilot Prompt for LevelUp Athlete AI Analysis Server

## Objective
Implement a comprehensive AI-powered sports analysis server for LevelUp Athlete that processes uploaded media (images/videos) to provide real-time pose landmark detection, biomechanical skeleton modeling, future-impact prediction, sport-specific scoring, injury risk analysis, and personalized improvement planning.

## Required Features and Functions

### Core Processing Functions
- `extractPoseLandmarks(mediaBuffer, mediaType)`: Process media to extract pose landmarks using MediaPipe Pose Landmarker. Support both images and videos with multi-frame aggregation.
- `computeBiomechanics(landmarks)`: Build 3D skeleton model from landmarks and compute biomechanical metrics (joint angles, velocities, forces).
- `predictFutureImpact(metrics, sport, athleteProfile)`: Predict future performance and injury risks based on current form.
- `scoreFormBySport(metrics, sportRules, athleteProfile)`: Calculate sport-specific scores for technique, balance, mobility, symmetry.
- `analyzeInjuryRisk(metrics, profile, sport)`: Assess injury probabilities with confidence levels.
- `generatePersonalizedPlan(userId, sport, analysisResults)`: Create improvement plans with drills, timelines, and progress tracking.

### API Endpoints
- `POST /api/analyze`: Accept media upload, process analysis, return structured JSON with all results.
- `GET /api/analysis/:id`: Retrieve saved analysis results.
- `POST /api/users/:userId/profile`: Update athlete profile for personalized analysis.
- `GET /api/users/:userId/progress`: Get weekly/monthly progress reports.

## Implementation Requirements

### Multi-Frame Video Aggregation
- For videos, process multiple frames (e.g., 10-30 fps sampling).
- Aggregate landmarks across frames for temporal consistency.
- Compute motion trajectories and velocity metrics.

### Confidence/Quality Gating
- Only process frames/landmarks above confidence threshold (e.g., 0.7).
- Filter out low-quality detections.
- Provide confidence scores in output.

### Per-Sport Rules
- Load sport-specific rules from `sportRules.js`.
- Different metrics and thresholds for basketball, soccer, tennis, etc.
- Sport-specific mistake detection and drill recommendations.

### Structured JSON Output
- Return analysis in standardized JSON format:
```json
{
  "analysisId": "uuid",
  "confidence": 0.85,
  "scores": {
    "technique": 78,
    "balance": 82,
    "mobility": 75,
    "symmetry": 80
  },
  "biomechanics": {...},
  "mistakes": [...],
  "drills": [...],
  "injuryRisks": [...],
  "predictions": {...},
  "personalizedPlan": {...}
}
```

### Unit/Integration Tests
- Write tests in `scoring.test.js` for all functions.
- Test with mock data and real MediaPipe outputs.
- Ensure outputs are sport-specific, not generic.

## Dependencies
- @mediapipe/tasks-vision for pose detection
- Express.js for server
- Multer for file uploads
- UUID for analysis IDs

## Quality Assurance
- All functions must handle errors gracefully.
- Validate inputs and provide meaningful error messages.
- Ensure server can handle concurrent requests.
- Optimize for mobile app usage (fast response times).

Implement this server with production-ready code, proper error handling, and comprehensive testing.