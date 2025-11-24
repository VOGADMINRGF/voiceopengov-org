#!/usr/bin/env ts-node
/**
 * VPM25 Fundbüro – Orphan-Scanner
 *
 * Läuft am besten mit:
 *   pnpm ts-node tools/migration/VPM25/find_orphans.ts
 *   oder: node --loader ts-node/esm tools/migration/VPM25/find_orphans.ts
 *
 * Basis-Idee:
 * - Scan der alten Migration-Quellen (01/02/03)
 * - Abgleich mit aktuellem Code (apps, features, packages, src)
 * - Report nach tools/migration/VPM25/ORPHAN_FEATURES_VPM25.md
 *
 * Falls die Quell-Ordner fehlen, wird der Report mit einem Hinweis erzeugt.
 */
import { promises as fs } from "fs";
import path from "path";

type FileEntry = {
  relativePath: string;
  normalizedKey: string;
};

const repoRoot = process.cwd();
const PRIMARY_BASE = path.resolve(repoRoot, "tools/migration/VPM25");
const FALLBACK_BASE = path.resolve(repoRoot, "tools/migration__archived_DO_NOT_USE/VPM25");
const MIGRATION_DIRS = [
  "01_vpm25_original",
  "02_vpm25_landing_legacy",
  "03_edbtt_baseline_2025-11-19",
];
const CURRENT_SCAN_DIRS = ["apps", "features", "packages", "src"];
const INCLUDE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".md", ".json", ".css", ".scss", ".html"];
const EXCLUDE_DIRS = new Set(["node_modules", ".next", ".git", ".turbo", ".tmp_orphans", "dist", "build"]);

function shouldInclude(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  return INCLUDE_EXTENSIONS.includes(ext);
}

function normalizeKey(relPath: string): string {
  const normalized = relPath.replace(/\\/g, "/");
  const markers = ["apps/web/", "apps/landing/", "features/", "packages/", "src/"];
  for (const marker of markers) {
    const idx = normalized.indexOf(marker);
    if (idx >= 0) return normalized.slice(idx);
  }
  return normalized;
}

function isLegacyPath(relPath: string): boolean {
  return /(_legacy|_disabled|legacy|old)/i.test(relPath);
}

async function collectFiles(dir: string, base: string): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];
  async function walk(current: string) {
    const dirents = await fs.readdir(current, { withFileTypes: true });
    for (const dirent of dirents) {
      if (dirent.isDirectory() && EXCLUDE_DIRS.has(dirent.name)) continue;
      const full = path.join(current, dirent.name);
      if (dirent.isDirectory()) {
        await walk(full);
      } else if (shouldInclude(dirent.name)) {
        const rel = path.relative(base, full);
        entries.push({ relativePath: rel, normalizedKey: normalizeKey(rel) });
      }
    }
  }
  await walk(dir);
  return entries;
}

async function buildCurrentFileIndex(): Promise<Set<string>> {
  const set = new Set<string>();
  for (const dir of CURRENT_SCAN_DIRS) {
    const full = path.join(repoRoot, dir);
    try {
      const files = await collectFiles(full, repoRoot);
      for (const file of files) set.add(file.normalizedKey);
    } catch {
      // Ordner existiert nicht – ignorieren
    }
  }
  return set;
}

function formatList(items: Array<{ relativePath: string; reason?: string }>): string {
  if (!items.length) return "_Keine Einträge gefunden._";
  return items
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath))
    .map((item) => {
      const reason = item.reason ? ` – ${item.reason}` : "";
      return `- [ ] ${item.relativePath}${reason}`;
    })
    .join("\n");
}

async function main() {
  // Sammle vorhandene Migration-Basen (primär, ggf. Fallback).
  const migrationBases = [];
  for (const base of [PRIMARY_BASE, FALLBACK_BASE]) {
    try {
      const stat = await fs.stat(base);
      if (stat.isDirectory()) migrationBases.push(base);
    } catch {
      // kein Ordner – ignorieren
    }
  }

  // Report-Pfad immer im primären Ziel erzeugen
  await fs.mkdir(PRIMARY_BASE, { recursive: true });
  const outputPath = path.join(PRIMARY_BASE, "ORPHAN_FEATURES_VPM25.md");

  if (!migrationBases.length) {
    const report = `# Orphan-Features VPM25 – Übersicht\n\nStand: ${new Date().toISOString()}\n\n_Keine Migration-Quellen gefunden (01/02/03 fehlen)._`;
    await fs.writeFile(outputPath, report, "utf8");
    console.warn("Keine Migration-Basis gefunden – Report mit Hinweis geschrieben.");
    return;
  }

  const currentIndex = await buildCurrentFileIndex();
  const adopted: Array<{ relativePath: string; reason?: string }> = [];
  const candidates: Array<{ relativePath: string; reason?: string }> = [];
  const legacy: Array<{ relativePath: string; reason?: string }> = [];

  for (const base of migrationBases) {
    for (const folder of MIGRATION_DIRS) {
      const migrationDir = path.join(base, folder);
      try {
        const files = await collectFiles(migrationDir, base);
        for (const file of files) {
          const relPath = path.join(path.basename(base), folder, file.relativePath);
          if (isLegacyPath(file.relativePath)) {
            legacy.push({ relativePath: relPath });
            continue;
          }
          if (currentIndex.has(file.normalizedKey)) {
            adopted.push({ relativePath: relPath });
          } else {
            candidates.push({ relativePath: relPath });
          }
        }
      } catch {
        // Migration-Ordner fehlt – weiter
      }
    }
  }

  const report = `# Orphan-Features VPM25 – Übersicht\n\nStand: ${new Date().toISOString()}\n\n## 1. Vermutlich bereits übernommen\n\n${formatList(adopted)}\n\n## 2. Noch nicht übernommen (Kandidaten)\n\n${formatList(candidates)}\n\n## 3. Bewusst Legacy / _disabled\n\n${formatList(legacy)}\n`;

  await fs.writeFile(outputPath, report, "utf8");
  console.log(`Orphan-Report geschrieben nach ${path.relative(repoRoot, outputPath)}`);
  console.log(`Übernommen: ${adopted.length}, Kandidaten: ${candidates.length}, Legacy: ${legacy.length}`);
}

main().catch((err) => {
  console.error("find_orphans.ts failed", err);
  process.exit(1);
});
