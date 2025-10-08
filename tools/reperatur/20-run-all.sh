#!/usr/bin/env bash
set -euo pipefail
mkdir -p tools/reperatur/reports

echo "== Reperatur: Codemods (Dry-Run unless REPERATUR_WRITE=1) =="
WRITE=${REPERATUR_WRITE:-0}

node tools/reperatur/10-trimongo.mjs
node tools/reperatur/11-imports-prisma.mjs
node tools/reperatur/12-next-dynamic.mjs
node tools/reperatur/13-redis-upstash.mjs
node tools/reperatur/14-mongoose-indexes.mjs
node tools/reperatur/15-paths-tsconfig.mjs

echo "== ESLint --fix (optional) =="
pnpm -w exec eslint . --ext .ts,.tsx --fix || true

echo "== Typecheck =="
pnpm -w exec tsc --noEmit -b || true
