#!/usr/bin/env node
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Suchreihenfolge (vom wahrscheinlichsten Pfad nach weniger wahrscheinlichen):
 * 1) <repo-root>/prisma/web/schema.prisma
 * 2) apps/web/prisma/schema.prisma
 * 3) apps/core/db/prisma/schema.prisma
 * 4) <repo-root>/prisma/schema.prisma
 */
const candidates = [
  path.join(here, "..", "..", "..", "prisma", "web", "schema.prisma"),
  path.join(here, "..", "prisma", "schema.prisma"),
  path.join(here, "..", "..", "core","db", "prisma", "schema.prisma"),
  path.join(here, "..", "..", "..", "prisma", "schema.prisma"),
];

const schema = candidates.find((p) => existsSync(p));

if (!schema) {
  console.log("ℹ️  No Prisma schema found for apps/web – skipping generate.");
  process.exit(0);
}

console.log("🔧 Generating Prisma client from:", schema);

// Erst Workspace-Exec (nutzt deine Monorepo-Deps), Fallback auf dlx
try {
  execSync(`pnpm -w exec prisma generate --schema "${schema}"`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (e) {
  console.warn("⚠️  pnpm -w exec prisma failed, falling back to pnpm dlx …");
  execSync(`pnpm dlx prisma generate --schema "${schema}"`, {
    stdio: "inherit",
    env: process.env,
  });
}
