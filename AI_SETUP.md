# LevelUp AI - Real-Time Sports Analysis with Claude AI

## Setup & Configuration

### Get Your Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### Add Your API Key

1. Open `.env` file in the project root
2. Replace the placeholder:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
   ```
3. Save the file (do NOT commit `.env` to git)

### Start the Server

```bash
npm install  # Install dependencies (if not done)
npm start    # Start development server on http://localhost:3000
```

### Test the AI Analysis

1. Open http://localhost:3000 in your browser
2. Log in with: `athlete@email.com` (any password)
3. Select a sport
4. Upload an image/video of an athlete performing that sport
5. Click "Run Real AI Analysis"
6. Claude will analyze the technique and provide:
   - Phase-by-phase technique breakdown with scores
   - Critical errors and root causes
   - Personalized drills with sets/reps
   - Injury risk warnings
   - Actionable correction cues

### How the AI Analysis Works

1. **Image Upload** → Sent to Claude with sport-specific prompt
2. **Claude Vision API** → Analyzes motion mechanics, form, alignment
3. **Sport-Specific Framework** → Evaluates based on detailed sports criteria
4. **Structured Response** → Returns coaching feedback in organized format
5. **Frontend Display** → Shows analysis with scores, errors, and drills

### Fallback Behavior

If Claude API is unavailable (no API key or API error), the app automatically falls back to rule-based analysis using biomechanics thresholds.

### Supported Sports

- Basketball
- Soccer
- Baseball
- Tennis
- Volleyball
- Track (Sprint starts)
- Swimming (Freestyle)
- Boxing
- Hockey
- Rugby
- Golf
- Gymnastics

### Example Analysis Output

```
Athlete Snapshot
Sport: Basketball | Level: Intermediate | Drill: Jump shot | Goal: Improve technique

Phase-by-Phase Technique Breakdown
| Phase | Score | What went well | Error detected | Why it matters | Correction cue |
| Set point | 7/10 | Good elbow position | Low release point | Affects arc and range | Raise elbow to eye level |
| ...

Critical Errors (Top 3)
1. Inconsistent release point | Elbow drops during loading | Maintain fixed elbow under wrist
2. Weak guide hand | Hand drifting away | Keep guide hand under ball centerline
3. Poor follow-through | Arm drops early | Hold follow-through until ball hits rim

Next Session Plan
**Drill 1** - Form shooting from 8 feet (3x20 reps): Focus on release consistency
**Drill 2** - Elbow pushups (3x15): Build stabilizing strength
**Drill 3** - One-hand shooting (3x10 each side): Isolate and strengthen release

Injury Risk Watch
- High elbow drop risk: May indicate rotator cuff compensation
- Prevention: Strengthen stabilizer muscles with band work
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Claude API key from Anthropic Console |

### Troubleshooting

**"Analysis service unavailable"**
- Check that `ANTHROPIC_API_KEY` is set in `.env`
- Verify your API key is valid at https://console.anthropic.com/
- Check server logs for specific error messages

**"Rule-based feedback (Claude API unavailable)"**
- Claude API failed but fallback analysis was successful
- Check your internet connection
- Verify API key is correct

**Server won't start**
- Make sure port 3000 is not in use: `lsof -i :3000`
- Install dependencies: `npm install`
- Check Node.js version: `node --version` (v18+ recommended)

### API Response Structure

The `/api/analyze` endpoint returns:

```json
{
  "analysisId": "uuid",
  "userId": "athlete1",
  "sport": "basketball",
  "athleteLevel": "INTERMEDIATE",
  "confidence": 0.92,
  "scores": {
    "balance": 75,
    "mobility": 72,
    "symmetry": 78,
    "sportTechnique": 76
  },
  "detectedMistakes": [
    {
      "code": "error_0",
      "severity": "medium",
      "explanation": "Elbow drops during release"
    }
  ],
  "recommendedDrills": [
    {
      "name": "Form shooting from 8 feet",
      "sets": "3x20 reps",
      "why": "Personalized for basketball"
    }
  ],
  "injuryAlerts": [
    {
      "risk": "technique_related",
      "level": "warning",
      "reason": "High elbow drop risk"
    }
  ],
  "summary": "[Full Claude analysis text]",
  "aiGenerated": true
}
```

---

**Ready to provide real AI-powered coaching feedback!** 🚀
