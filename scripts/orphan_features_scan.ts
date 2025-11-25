import { promises as fs } from "fs";
import path from "path";

type FeatureFolder = {
  name: string;
  root: string;
  absolutePath: string;
};

type UsageHit = {
  file: string;
  feature: FeatureFolder;
};

const FEATURE_ROOTS = [
  "apps/web/src/features",
  "features",
];

const SEARCH_ROOTS = [
  "apps/web/src/app",
  "features",
];

async function pathExists(candidate: string) {
  try {
    await fs.access(candidate);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw err;
  }
}

async function listDirectories(root: string): Promise<FeatureFolder[]> {
  if (!(await pathExists(root))) return [];
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      root,
      absolutePath: path.join(root, entry.name),
    }));
}

async function collectFeatureFolders(): Promise<FeatureFolder[]> {
  const all: FeatureFolder[] = [];
  for (const root of FEATURE_ROOTS) {
    const folders = await listDirectories(root);
    all.push(...folders);
  }
  return all;
}

function isScriptFile(file: string) {
  return file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".mts");
}

async function collectScriptFiles(root: string): Promise<string[]> {
  if (!(await pathExists(root))) return [];
  const results: string[] = [];
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(root, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectScriptFiles(abs);
      results.push(...nested);
      continue;
    }
    if (entry.isFile() && isScriptFile(abs)) {
      results.push(abs);
    }
  }
  return results;
}

function normalizePath(p: string) {
  return p.split(path.sep).join("/");
}

function buildPatterns(feature: FeatureFolder) {
  return [
    `@features/${feature.name}`,
    `@/features/${feature.name}`,
    `features/${feature.name}`,
    `../features/${feature.name}`,
    `./features/${feature.name}`,
  ];
}

async function findUsages(feature: FeatureFolder, files: string[]): Promise<UsageHit[]> {
  const patterns = buildPatterns(feature);
  const hits: UsageHit[] = [];
  const featureScope = normalizePath(feature.absolutePath);

  for (const file of files) {
    const normalizedFile = normalizePath(file);
    if (normalizedFile.startsWith(featureScope)) continue;

    const content = await fs.readFile(file, "utf8");
    if (patterns.some((p) => content.includes(p))) {
      hits.push({ file: normalizedFile, feature });
    }
  }

  return hits;
}

async function main() {
  const features = await collectFeatureFolders();
  const searchFiles = (
    await Promise.all(SEARCH_ROOTS.map((root) => collectScriptFiles(root)))
  ).flat();

  const used: Array<{ feature: FeatureFolder; hits: UsageHit[] }> = [];
  const orphaned: FeatureFolder[] = [];

  for (const feature of features) {
    const hits = await findUsages(feature, searchFiles);
    if (hits.length === 0) {
      orphaned.push(feature);
    } else {
      used.push({ feature, hits });
    }
  }

  console.log("# Orphan Feature Scan\n");

  console.log("## Used Features");
  if (used.length === 0) {
    console.log("- (none found)");
  } else {
    for (const entry of used) {
      const locations = [...new Set(entry.hits.map((hit) => hit.file))];
      console.log(`- ${normalizePath(entry.feature.root)}/${entry.feature.name} (used in ${locations.join(", ")})`);
    }
  }

  console.log("\n## Potential Orphans");
  if (orphaned.length === 0) {
    console.log("- (none found)");
  } else {
    for (const feature of orphaned) {
      console.log(`- ${normalizePath(feature.root)}/${feature.name} (no imports found)`);
    }
  }
}

main().catch((err) => {
  console.error("[orphan_features_scan] failed:", err);
  process.exitCode = 1;
});
