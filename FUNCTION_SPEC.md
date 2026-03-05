# Sport-Specific AI Analysis Function Spec (for your coding agent)

Use this as a drop-in specification for a backend coding agent so uploaded pictures/videos get sport-specific, user-specific feedback (not generic repeated feedback).

## 1) API functions/endpoints

### `POST /api/analyze`
Analyzes one uploaded image/video for one sport.

**Input (multipart/form-data):**
- `userId` (string)
- `sport` (string, e.g. `basketball`, `soccer`, `tennis`)
- `media` (file: image or video)

**Output JSON:**
- `analysisId`
- `confidence`
- `scores`
- `detectedMistakes`
- `recommendedDrills`
- `injuryAlerts`
- `nextBestActions`

### `GET /api/analysis/:analysisId`
Returns one saved analysis.

### `GET /api/users/:userId/progress?sport=<sport>`
Returns weekly trend and progression for that sport.

### `POST /api/users/:userId/profile`
Saves athlete profile used for personalization (age, level, dominant side, injury history, goals).

---

## 2) Core backend function list (implement these names)

```ts
async function extractPoseLandmarks(mediaBuffer: Buffer, mediaType: "image" | "video"): Promise<PoseFrame[]>;
function computeBiomechanics(frames: PoseFrame[]): BiomechanicsMetrics;
function loadSportRules(sport: string): SportRules;
function scoreFormBySport(metrics: BiomechanicsMetrics, rules: SportRules, profile: AthleteProfile): SkillScores;
function generateSportSpecificMistakes(metrics: BiomechanicsMetrics, rules: SportRules): MistakeItem[];
function generateSportSpecificDrills(mistakes: MistakeItem[], sport: string, level: AthleteProfile["level"]): DrillItem[];
function predictInjuryRisk(metrics: BiomechanicsMetrics, profile: AthleteProfile, sport: string): InjuryAlert[];
function buildPersonalizedFeedback(input: {
  userId: string;
  sport: string;
  profile: AthleteProfile;
  metrics: BiomechanicsMetrics;
  scores: SkillScores;
  mistakes: MistakeItem[];
  drills: DrillItem[];
  injuryAlerts: InjuryAlert[];
  confidence: number;
}): AnalysisResponse;
async function saveAnalysisResult(userId: string, sport: string, response: AnalysisResponse): Promise<string>;
async function buildWeeklyProgress(userId: string, sport: string): Promise<WeeklyProgressResponse>;
```

---

## 3) Critical rule: no generic one-size-fits-all feedback

Create `sportRules.ts` with per-sport thresholds and drill mappings:

```ts
export const SPORT_RULES: Record<string, SportRules> = {
  basketball: {
    keyMetrics: ["kneeValgus", "hipDrop", "trunkLean", "landingSymmetry"],
    thresholds: { kneeValgus: 0.18, hipDrop: 0.08, trunkLean: 12, landingSymmetry: 0.75 },
    drillMap: {
      kneeValgus: ["Banded Squat", "Single-Leg Step Down"],
      hipDrop: ["Lateral Band Walk", "Single-Leg Bridge"],
    },
  },
  soccer: {
    keyMetrics: ["plantFootStability", "hipRotationControl", "hamstringLoad", "trunkLean"],
    thresholds: { plantFootStability: 0.70, hipRotationControl: 0.68, hamstringLoad: 0.65, trunkLean: 10 },
    drillMap: {
      plantFootStability: ["Single-Leg Balance Reach", "Copenhagen Plank"],
      hamstringLoad: ["Nordic Curl", "RDL Progression"],
    },
  },
  tennis: {
    keyMetrics: ["shoulderRotationTiming", "trunkRotation", "splitStepSymmetry"],
    thresholds: { shoulderRotationTiming: 0.72, trunkRotation: 0.70, splitStepSymmetry: 0.74 },
    drillMap: {
      shoulderRotationTiming: ["Shadow Serve Sequencing", "Med-Ball Rotational Throw"],
      splitStepSymmetry: ["Reactive Split-Step Ladder", "Lateral Hop Hold"],
    },
  },
};
```

---

## 4) Minimum response contract

```json
{
  "analysisId": "uuid",
  "userId": "u123",
  "sport": "soccer",
  "confidence": 0.87,
  "scores": {
    "balance": 81,
    "mobility": 74,
    "symmetry": 69,
    "sportTechnique": 77
  },
  "detectedMistakes": [
    {
      "code": "hip_drop",
      "severity": "medium",
      "explanation": "Pelvic control drops on single-leg load during plant phase."
    }
  ],
  "recommendedDrills": [
    {
      "name": "Lateral Band Walk",
      "sets": "3x12",
      "why": "Improves frontal-plane hip stability used in plant/cut mechanics."
    }
  ],
  "injuryAlerts": [
    {
      "risk": "hamstring_strain",
      "level": "warning",
      "reason": "High posterior-chain load asymmetry and reduced hip control."
    }
  ],
  "nextBestActions": [
    "Reduce sprint volume 15% for 1 week.",
    "Run stability drill block 3x/week.",
    "Re-test with side-view video in 7 days."
  ]
}
```

---

## 5) Tests your coding agent must add

1. Same pose metrics + different sports should produce different mistakes/drills/scores.
2. Same sport + different athlete profiles (beginner vs advanced, injury history) should produce different recommendations.
3. Low landmark confidence should return a `needs_better_capture` guidance message instead of fake certainty.
4. Video analysis should aggregate multi-frame metrics (not only one frame).

---

## 6) Frontend handoff functions

Your frontend should stop generating final coaching rules client-side and call backend functions instead:

- `uploadAndAnalyze(file, userId, sport)` → `POST /api/analyze`
- `renderServerAnalysis(response)`
- `loadWeeklyProgress(userId, sport)` → `GET /api/users/:userId/progress?sport=...`

This ensures each user gets personalized, sport-specific coaching output from actual uploaded media.
