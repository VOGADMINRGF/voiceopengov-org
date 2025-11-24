#!/usr/bin/env node
import { readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(__dirname, "..");
const featuresDir = join(repoRoot, "features");
const appSrcDir = join(repoRoot, "apps/web/src");

type FeatureReport = {
  name: string;
  path: string;
  referencedFiles: number;
  status: "used" | "orphan";
};

type RouteReport = {
  path: string;
  reason: string;
};

const ROUTE_FILES = new Set(["page.tsx", "page.ts", "route.ts", "route.tsx"]);

function ensureRipgrepAvailable() {
  const check = spawnSync("rg", ["--version"], { encoding: "utf-8" });
  if (check.error) {
    throw new Error("rg (ripgrep) is required for orphan-scanner.mts. Install via `brew install ripgrep`.");
  }
}

function listFeatureDirs(): string[] {
  if (!existsSync(featuresDir)) return [];
  return readdirSync(featuresDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function countFeatureReferences(feature: string): number {
  const pattern = `@features/${feature}`;
  const args = [
    "--glob",
    "!node_modules/**",
    "--glob",
    "!dist/**",
    "--glob",
    "!tools/migration/**",
    "--glob",
    `!features/${feature}/**`,
    "-l",
    pattern,
    ".",
  ];
  const result = spawnSync("rg", args, { cwd: repoRoot, encoding: "utf-8" });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0 && !result.stdout.trim()) {
    return 0;
  }
  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function collectFeatureReports(): FeatureReport[] {
  return listFeatureDirs().map((name) => {
    const refs = countFeatureReferences(name);
    return {
      name,
      path: `features/${name}`,
      referencedFiles: refs,
      status: refs === 0 ? "orphan" : "used",
    };
  });
}

function walkRoutes(root: string, onRoute: (filePath: string) => void) {
  if (!existsSync(root)) return;
  const entries = readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) {
      walkRoutes(fullPath, onRoute);
    } else if (ROUTE_FILES.has(entry.name)) {
      onRoute(fullPath);
    }
  }
}

function collectRouteReports(): RouteReport[] {
  const results: RouteReport[] = [];
  const disabledDir = join(appSrcDir, "_disabled");
  walkRoutes(disabledDir, (filePath) => {
    results.push({
      path: relative(repoRoot, filePath),
      reason: "inside apps/web/src/_disabled",
    });
  });

  const appDir = join(appSrcDir, "app");
  walkRoutes(appDir, (filePath) => {
    const rel = relative(appSrcDir, filePath);
    if (rel.includes("_disabled") || rel.includes("legacy") || rel.includes("deprecated")) {
      results.push({
        path: relative(repoRoot, filePath),
        reason: "route path contains _disabled/legacy segment",
      });
    }
  });

  return results;
}

function main() {
  ensureRipgrepAvailable();
  const featureReports = collectFeatureReports();
  const orphanFeatures = featureReports.filter((f) => f.status === "orphan");
  const routeReports = collectRouteReports();

  const summary = {
    generatedAt: new Date().toISOString(),
    repoRoot,
    stats: {
      totalFeatures: featureReports.length,
      orphanFeatures: orphanFeatures.length,
      flaggedRoutes: routeReports.length,
    },
    features: featureReports,
    routes: routeReports,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
