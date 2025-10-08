\
#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const WRITE = process.env.REPERATUR_WRITE === "1";
const report = [];

async function loadJson(p){
  try { return JSON.parse(await fs.readFile(p,"utf-8")); } catch { return null; }
}

async function saveJson(p, obj){
  const txt = JSON.stringify(obj, null, 2) + "\n";
  await fs.writeFile(p, txt, "utf-8");
}

const baseFiles = ["tsconfig.base.json","tsconfig.json"];
let base = null, baseFile = null;
for (const f of baseFiles){
  const j = await loadJson(f);
  if (j){ base = j; baseFile = f; break; }
}
if (!base){
  console.log("[15-paths-tsconfig] No base tsconfig found.");
  process.exit(0);
}

const paths = base.compilerOptions?.paths || {};
let changed = false;

function ensurePath(alias, target){
  if (!paths[alias]){
    paths[alias] = Array.isArray(target) ? target : [target];
    report.push(`ADD paths: ${alias} -> ${JSON.stringify(paths[alias])}`);
    changed = true;
  }
}

ensurePath("@db-web", ["packages/db-web/src"]);
ensurePath("@db-core", ["packages/db-core/src"]);
ensurePath("@features/*", ["features/*"]);
ensurePath("@ui/*", ["packages/ui/src/*"]);

if (WRITE){
  base.compilerOptions = base.compilerOptions || {};
  base.compilerOptions.paths = paths;
  await saveJson(baseFile, base);
}

const out = `tools/reperatur/reports/15-paths-tsconfig-${Date.now()}-${WRITE?"write":"dry"}.log`;
await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, report.join("\n") || "No changes");
console.log(`[15-paths-tsconfig] ${WRITE? "applied": "dry-run"}; changed: ${changed}`);
