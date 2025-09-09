// scripts/ensureIndexes.ts
import "dotenv/config";
import { MongoClient, Db } from "mongodb";

type Cfg = { uri: string; dbName: string; label: "CORE"|"VOTES"|"PII" };

const CFGS: Cfg[] = [
  { uri: process.env.CORE_MONGODB_URI!,  dbName: process.env.CORE_DB_NAME!,  label: "CORE" },
  { uri: process.env.VOTES_MONGODB_URI!, dbName: process.env.VOTES_DB_NAME!, label: "VOTES" },
  { uri: process.env.PII_MONGODB_URI!,   dbName: process.env.PII_DB_NAME!,   label: "PII" },
];

// --- CORE: öffentliche Inhalte / Statements / AI ---
async function ensureCore(db: Db) {
  // Wenn du "statements" nutzt:
  const statements = db.collection("statements");
  await statements.createIndex({ createdAt: -1, _id: -1 }, { name: "st_byCreatedAt_Id" });
  await statements.createIndex({ userId: 1, createdAt: -1 }, { name: "st_byUser_CreatedAt" });
  await statements.createIndex({ language: 1, createdAt: -1 }, { name: "st_byLang_CreatedAt" });
  await statements.createIndex({ title: "text", text: "text" }, { name: "st_text_de", default_language: "german" });

  // Falls ihr stattdessen "contributions" verwendet, die gleichen Indexe dort:
  // const contrib = db.collection("contributions");
  // await contrib.createIndex({ authorId: 1, createdAt: -1 }, { name: "co_byAuthor_CreatedAt" });
  // await contrib.createIndex({ tags: 1 }, { name: "co_byTags" });
  // await contrib.createIndex({ status: 1 }, { name: "co_byStatus" });
  // await contrib.createIndex({ title: "text", text: "text" }, { name: "co_text_de", default_language: "german" });

  // AI / Factcheck (optional)
  await db.collection("ai_runs").createIndex({ createdAt: -1 }, { name: "ai_runs_byCreatedAt" });
  await db.collection("ai_cache").createIndex({ key: 1 }, { name: "ai_cache_key", unique: true });
  await db.collection("claims").createIndex({ lang: 1, updatedAt: -1 }, { name: "claims_lang_updated" });
  await db.collection("source_claims").createIndex({ sourceId: 1, claimId: 1 }, { name: "sc_source_claim", unique: true });
}

// --- VOTES: Stimmen/Swipes (pseudonymisiert) ---
async function ensureVotes(db: Db) {
  const votes = db.collection("votes");
  await votes.createIndex({ statementId: 1, userId: 1 }, { name: "vote_unique_per_user", unique: true });
  await votes.createIndex({ createdAt: -1 }, { name: "vote_byCreatedAt" });

  const voteAgg = db.collection("vote_aggregates");
  await voteAgg.createIndex({ statementId: 1 }, { name: "voteAgg_byStatement", unique: true });

  const swipes = db.collection("swipes"); // falls genutzt
  await swipes.createIndex({ statementId: 1, createdAt: -1 }, { name: "sw_byStatement_CreatedAt" });
  await swipes.createIndex({ userHash: 1, createdAt: -1 }, { name: "sw_byUser_CreatedAt" });
}

// --- PII: Users/Tokens/Sessions ---
async function ensurePii(db: Db) {
  const users = db.collection("users");
  await users.createIndex({ email_lc: 1 }, { name: "u_email_lc", unique: true });
  await users.createIndex({ createdAt: -1 }, { name: "u_byCreatedAt" });

  const tokens = db.collection("tokens");
  await tokens.createIndex({ expiresAt: 1 }, { name: "tok_ttl", expireAfterSeconds: 0 }); // TTL auf expiresAt

  // Falls Sessions in Mongo:
  // await db.collection("sessions").createIndex({ expiresAt: 1 }, { name: "sess_ttl", expireAfterSeconds: 0 });
}

async function run() {
  for (const c of CFGS) {
    const cli = new MongoClient(c.uri);
    await cli.connect();
    const db = cli.db(c.dbName);
    console.log(`⏳ ensuring indexes for [${c.label}] ${c.dbName}`);

    if (c.label === "CORE")  await ensureCore(db);
    if (c.label === "VOTES") await ensureVotes(db);
    if (c.label === "PII")   await ensurePii(db);

    await cli.close();
    console.log(`✅ done for [${c.label}]`);
  }
  console.log("🎉 all indexes ensured");
}

run().catch((e) => { console.error(e); process.exit(1); });
