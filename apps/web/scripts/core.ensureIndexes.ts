// apps/web/scripts/core.ensureIndexes.ts
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

// 1) ENV laden
const envCandidates = [
  resolve(process.cwd(), ".env.local"),
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../.env.local"),
  resolve(process.cwd(), "../.env"),
  resolve(process.cwd(), "../../.env.local"),
  resolve(process.cwd(), "../../.env"),
];
for (const p of envCandidates) {
  if (existsSync(p)) { config({ path: p, override: false }); break; }
}

function maskUri(uri?: string) {
  if (!uri) return "(unset)";
  try {
    const u = new URL(uri);
    const host = u.host;
    const hasCreds = Boolean(u.username || u.password);
    return `${u.protocol}//${hasCreds ? "***@" : ""}${host}${u.pathname || "/"}`;
  } catch { return "(invalid URI)"; }
}

async function main() {
  const results: Record<string, unknown> = {};
  const uriMasked = maskUri(process.env.CORE_MONGODB_URI);
  const dbName = process.env.CORE_DB_NAME ?? "(default: test)";
  console.log("CORE_MONGODB_URI:", uriMasked);
  console.log("CORE_DB_NAME:", dbName);

  // Source
console.log("→ indexing Source …");
const Source = (await import("../src/models/core/Source")).default;
await Source.createIndexes();
const srcIdx = await Source.collection.indexes();
results["sources.createIndexes"] = "ok";
results["sources.indexes"] = srcIdx;

// Stream
console.log("→ indexing Stream …");
const Stream = (await import("../src/models/core/Stream")).default;
await Stream.createIndexes();
const streamIdx = await Stream.collection.indexes();
results["streams.createIndexes"] = "ok";
results["streams.indexes"] = streamIdx;

// StreamEvent
console.log("→ indexing StreamEvent …");
const StreamEvent = (await import("../src/models/core/StreamEvent")).default;
await StreamEvent.createIndexes();
const seIdx = await StreamEvent.collection.indexes();
results["stream_events.createIndexes"] = "ok";
results["stream_events.indexes"] = seIdx;

  // 3) OPTIONAL: Legacy-Collections via triMongo — nur wenn wirklich vorhanden
  try {
    const tri = await import("../src/utils/triMongo");
    const coreCol = (tri as any).coreCol as (<T>(name: string) => Promise<any>) | undefined;

    if (coreCol) {
      const dummy = await coreCol<any>("__dummy__").catch(() => null);
      const db = dummy?.db;
      const listCollections = db?.listCollections?.bind(db);
      if (typeof listCollections === "function") {
        const colNames = await listCollections().toArray();
        const has = (n: string) => colNames.some((c: any) => c.name === n);

        if (has("statements")) {
          console.log("→ indexing legacy 'statements' …");
          const statements = await coreCol<any>("statements");
          results["statements.createIndexes"] = await statements.createIndexes([
            { key: { createdAt: -1, _id: -1 }, name: "stmts_createdAt_desc_id_desc" },
            { key: { category: 1, createdAt: -1 }, name: "stmts_category_asc_createdAt_desc" },
            { key: { userId: 1, createdAt: -1 }, name: "stmts_userId_asc_createdAt_desc" },
            { key: { language: 1, createdAt: -1 }, name: "stmts_language_asc_createdAt_desc" },
            { key: { "stats.votesTotal": -1 }, name: "stmts_stats_votesTotal_desc" },
          ]);
        } else {
          results["statements.createIndexes"] = { note: "collection not found (skipped)" };
        }

        if (has("votes")) {
          console.log("→ indexing legacy 'votes' …");
          const votes = await coreCol<any>("votes");
          results["votes.createIndexes"] = await votes.createIndexes([
            { key: { statementId: 1, value: 1 }, name: "votes_statementId_value" },
            { key: { statementId: 1, role: 1 }, name: "votes_statementId_role" },
            { key: { createdAt: -1 }, name: "votes_createdAt_desc" },
          ]);
        } else {
          results["votes.createIndexes"] = { note: "collection not found (skipped)" };
        }
      } else {
        results["legacyCollections"] = { note: "db.listCollections() not available (skipped)" };
      }
    } else {
      results["legacyCollections"] = { note: "triMongo.coreCol not found (skipped)" };
    }
  } catch (e) {
    results["legacyCollections"] = { note: "triMongo import failed (skipped)", error: String(e) };
  }

  console.log("✔ core indexes result:", JSON.stringify(results, null, 2));
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("index creation failed:", e);
  process.exit(1);
});
