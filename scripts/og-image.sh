#!/usr/bin/env bash
# Regenerates public/og-image.png (1200×630) from scripts/og-image.html using headless Chrome.
# Usage: scripts/og-image.sh   (set CHROME=/path/to/chrome if it is not in the default macOS location)
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=5000 --allow-file-access-from-files \
  --screenshot="$PWD/public/og-image.png" "file://$PWD/scripts/og-image.html"
