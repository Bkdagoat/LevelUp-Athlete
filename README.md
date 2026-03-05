# LevelUp AI (Real Pose Analysis Prototype)

A mobile-first web app prototype for athletes to log in, select sports, upload image/video training media, and get **real form feedback** generated from pose landmarks (MediaPipe Pose Landmarker), plus recommendations and risk alerts.

## Development

For detailed implementation requirements and Copilot prompts, see [COPILOT_PROMPT.md](COPILOT_PROMPT.md).

## What is real now

- Uses real uploaded image/video data (not only staged mock content)
- Runs body landmark detection with MediaPipe Tasks Vision on the server
- Generates feedback from detected posture asymmetry and knee mechanics
- Produces drills and injury-risk alerts from measured form signals
- Sport-specific analysis based on selected sport

## Features

- Athlete login screen
- Multi-sport selection
- Upload image/video training media with sport selection
- Real AI analysis screen with:
  - Skill scores from measured body mechanics
  - Detected form issues
  - Recommended drills
  - Injury alerts
- Weekly dashboard updated from latest analysis
- Bottom tab navigation
- Dark mode + light mode toggle

## Run locally

Start the backend server:

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

## Backend API

- POST /api/analyze: Analyze media for pose and return feedback
- GET /api/analysis/:id: Get saved analysis
- GET /api/users/:userId/progress: Get weekly progress
- POST /api/users/:userId/profile: Save user profile

## Important note

The pose model is loaded from CDN at runtime on the server, so internet access is required for analysis.

## Quick test (curl)

1) Create a session cookie by signing in (example credentials used by the prototype):

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"athlete@email.com","password":"password"}' \
  http://localhost:3000/api/signin
```

2) Upload a test image to `POST /api/analyze` (multipart/form-data). This example expects a `test.png` file in the current directory and saves/uses the session cookie from step 1:

```bash
curl -i -b cookies.txt -c cookies.txt \
  -F "userId=athlete1" \
  -F "sport=soccer" \
  -F "media=@test.png" \
  http://localhost:3000/api/analyze
```

3) Retrieve an analysis result by id (replace <analysisId> with the returned id):

```bash
curl -i http://localhost:3000/api/analysis/<analysisId>
```

These commands are suitable for quick local testing of the backend API.
