# LevelUp AI (Real Pose Analysis Prototype)

A mobile-first web app prototype for athletes to log in, select sports, upload image/video training media, and get **real form feedback** generated from pose landmarks (MediaPipe Pose Landmarker), plus recommendations and risk alerts.

## What is real now

- Uses real uploaded image/video data (not only staged mock content)
- Runs body landmark detection with MediaPipe Tasks Vision in-browser
- Generates feedback from detected posture asymmetry and knee mechanics
- Produces drills and injury-risk alerts from measured form signals

## Features

- Athlete login screen
- Multi-sport selection
- Upload image/video training media
- Real AI analysis screen with:
  - Skill scores from measured body mechanics
  - Detected form issues
  - Recommended drills
  - Injury alerts
- Weekly dashboard updated from latest analysis
- Bottom tab navigation
- Dark mode + light mode toggle

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173` in your browser.

## Important note

The pose model is loaded from CDN at runtime, so internet access is required for first load.

## Need production-grade sport-specific analysis functions?

Use `FUNCTION_SPEC.md` as a ready-to-send specification for your coding agent (backend endpoints, function signatures, sport rule schema, response contract, and required tests).
