#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/public/maps"
OUT_FILE="$OUT_DIR/world-states.svg"

SRC_URL="https://raw.githubusercontent.com/raphaellepuschitz/SVG-World-Map/master/src/world-states.svg"

mkdir -p "$OUT_DIR"

curl -fsSL "$SRC_URL" -o "$OUT_FILE"

echo "Saved $OUT_FILE"
