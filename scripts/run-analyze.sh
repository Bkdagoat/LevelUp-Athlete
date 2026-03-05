#!/usr/bin/env bash
set -euo pipefail

# Simple helper to sign in and POST a media file to /api/analyze
# Usage: ./scripts/run-analyze.sh [file] [sport]
# Defaults: file=test.png sport=soccer

BASE_URL=${BASE_URL:-http://localhost:3000}
EMAIL=${EMAIL:-athlete@email.com}
PASSWORD=${PASSWORD:-password}
FILE=${1:-test.png}
SPORT=${2:-soccer}
COOKIEFILE=${COOKIEFILE:-cookies.txt}

if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE"
  exit 1
fi

echo "Signing in to $BASE_URL..."
curl -s -c "$COOKIEFILE" -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  "$BASE_URL/api/signin"

echo "\nUploading $FILE (sport=$SPORT) to $BASE_URL/api/analyze..."
curl -s -b "$COOKIEFILE" -F "userId=athlete1" -F "sport=$SPORT" -F "media=@$FILE" \
  "$BASE_URL/api/analyze" -o analyze.json

echo "\nResponse saved to analyze.json:\n"
cat analyze.json

echo "\nDone."
