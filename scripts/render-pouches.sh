#!/usr/bin/env bash
# Regenerates public/products/<slug>.webp (transparent, 800×800) from the live 3D pouch, via the Vite dev
# server and headless Chrome. These posters stand in for the 3D model on phones / reduced motion / no WebGL.
# Usage: scripts/render-pouches.sh   (set CHROME=/path/to/chrome if it is not in the default macOS location)
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT=5199
npx vite --port $PORT --strictPort >/dev/null 2>&1 &
VITE=$!
trap 'kill $VITE 2>/dev/null' EXIT
until curl -s "http://localhost:$PORT/" >/dev/null; do sleep 0.3; done
mkdir -p public/products
CHROME="$CHROME" PORT=$PORT node scripts/render-pouches.mjs crystal-brite hyper-clean pure-choice
