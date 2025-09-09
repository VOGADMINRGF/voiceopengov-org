// apps/web/scripts/votes.ensureIndexes.ts
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";

// --- ENV robust laden (relativ zu diesem Script) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const candidates = [
  resolve(__dirname, "..", ".env.local"),
  resolve(__dirname, "..", ".env"),
  resolve(__dirname, "..", "..", ".env.local"),
  resolve(__dirname, "..", "..", ".env"),
];
for (const p of candidates) {
  if (existsSync(p)) { config({ path: p, override: false }); break; }
}

async function run() {
  // triMongo NACH dem env-load importieren
  const { votesCol } = await import("../src/utils/triMongo");
  const col = await votesCol<any>("votes");

  // Unique via partialFilterExpression (zuverlässiger als sparse)
  await col.createIndex(
    { statementId: 1, userId: 1 },
    { name: "votes_stmt_user_unique", unique: true,
      partialFilterExpression: { userId: { $type: "string" } } }
  );
  await col.createIndex(
    { statementId: 1, ip: 1, fp: 1 },
    { name: "votes_stmt_ip_fp_unique", unique: true,
      partialFilterExpression: { userId: null } }
  );

  // Sekundär-/Analyse-Indizes
  await col.createIndex({ statementId: 1, createdAt: -1, _id: -1 }, { name: "votes_stmt_createdAt_id_desc" });
  await col.createIndex({ statementId: 1, ts: -1, _id: -1 },           { name: "votes_stmt_ts_id_desc" });
  await col.createIndex({ value: 1, statementId: 1 },                   { name: "votes_value_stmt" });
  await col.createIndex(
    { regionCode: 1, ts: -1 },
    { name: "votes_region_ts_desc",
      partialFilterExpression: { regionCode: { $exists: true }, ts: { $exists: true } } }
  );
  await col.createIndex(
    { statementId: 1, role: 1 },
    { name: "votes_stmt_role",
      partialFilterExpression: { role: { $exists: true } } }
  );

  console.log("✓ votes indexes ensured");
}

// CJS-safe entrypoint
run()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e?.message ?? e); process.exit(1); });
