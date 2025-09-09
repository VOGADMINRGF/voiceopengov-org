// apps/web/src/lib/db/index.ts
import { MongoClient, Db } from "mongodb";

/** Keys für eure vier Cluster */
export type MongoKey = "core" | "votes" | "pii" | "ai_core_reader";

/** ENV → Konfiguration je Cluster */
const CFG: Record<MongoKey, { uri?: string; db?: string }> = {
  core:           { uri: process.env.CORE_MONGODB_URI,           db: process.env.CORE_DB_NAME },
  votes:          { uri: process.env.VOTES_MONGODB_URI,          db: process.env.VOTES_DB_NAME },
  pii:            { uri: process.env.PII_MONGODB_URI,            db: process.env.PII_DB_NAME },
  ai_core_reader: { uri: process.env.AI_CORE_READER_MONGODB_URI, db: process.env.AI_CORE_READER_DB_NAME },
};

/** Legacy-Fallback (für bestehenden Code) */
const LEGACY_URI = process.env.CORE_MONGODB_URI || process.env.MONGODB_URI || process.env.MONGO_URL;

declare global {
  // eslint-disable-next-line no-var
  var __mongoClients: Partial<Record<MongoKey | "legacy", MongoClient>> | undefined;
}
global.__mongoClients ||= {};

/** interner Helper: Client holen/instanziieren (lazy, hot-reload-safe) */
function ensureClient(label: MongoKey | "legacy", uri?: string): MongoClient | null {
  if (!uri) return null;
  const store = global.__mongoClients!;
  if (!store[label]) {
    store[label] = new MongoClient(uri);
  }
  return store[label]!;
}

/** Öffentliche API */
// 1) gerichtete Clients / DBs
export function getClient(key: MongoKey): MongoClient | null {
  return ensureClient(key, CFG[key].uri);
}

export function getDb(key: MongoKey): Db | null {
  const c = getClient(key);
  const name = CFG[key].db;
  if (!c || !name) return null;
  return c.db(name);
}

// 2) Pings
export async function pingMongo(key: MongoKey) {
  const db = getDb(key);
  if (!db) throw new Error(`${key}_client_or_db_missing`);
  return db.admin().ping();
}

// 3) Sammelpings (praktisch für Health-Routes)
export async function pingAll(keys: MongoKey[] = ["core", "votes", "pii", "ai_core_reader"]) {
  const out: Record<string, { ok: boolean; error?: string }> = {};
  await Promise.all(keys.map(async k => {
    try { await pingMongo(k); out[k] = { ok: true }; }
    catch (e: any) { out[k] = { ok: false, error: String(e?.message || e) }; }
  }));
  return out;
}

// 4) Legacy-Export (Kompatibilität zu alter Single-Client-Nutzung)
export const mongo: MongoClient | null = ensureClient("legacy", LEGACY_URI);

// Optionaler Legacy-Ping für bestehenden Code
export async function mongoPing() {
  if (!mongo) throw new Error("mongo_client_missing");
  return mongo.db().admin().ping();
}

// Nützlich für Call-Sites
export const mongoKeys: MongoKey[] = ["core", "votes", "pii", "ai_core_reader"];
