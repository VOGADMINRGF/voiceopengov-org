import { MongoClient, Db } from "mongodb";

type MongoKey = "core" | "votes" | "pii" | "ai_core_reader";

type Cfg = {
  uri: string | undefined;
  dbName: string | undefined;
};

const cfg: Record<MongoKey, Cfg> = {
  core:          { uri: process.env.CORE_MONGODB_URI,          dbName: process.env.CORE_DB_NAME },
  votes:         { uri: process.env.VOTES_MONGODB_URI,         dbName: process.env.VOTES_DB_NAME },
  pii:           { uri: process.env.PII_MONGODB_URI,           dbName: process.env.PII_DB_NAME },
  ai_core_reader:{ uri: process.env.AI_CORE_READER_MONGODB_URI,dbName: process.env.AI_CORE_READER_DB_NAME },
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoClients: Partial<Record<MongoKey, MongoClient>> | undefined;
}
global.__mongoClients ||= {};

function getClient(key: MongoKey): MongoClient | null {
  const { uri } = cfg[key];
  if (!uri) return null;
  if (!global.__mongoClients![key]) {
    global.__mongoClients![key] = new MongoClient(uri);
  }
  return global.__mongoClients![key]!;
}

export function getDb(key: MongoKey): Db | null {
  const c = getClient(key);
  const name = cfg[key].dbName;
  if (!c || !name) return null;
  return c.db(name);
}

export async function pingMongo(key: MongoKey) {
  const db = getDb(key);
  if (!db) throw new Error(`${key}_client_or_db_missing`);
  return db.admin().ping();
}

/** Für Health */
export const mongoKeys: MongoKey[] = ["core", "votes", "pii", "ai_core_reader"];
