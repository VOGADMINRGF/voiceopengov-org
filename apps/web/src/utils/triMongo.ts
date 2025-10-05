// apps/web/src/utils/triMongo.ts
import {
  MongoClient,
  Db,
  Collection,
  type Document as MongoDoc, // ⬅️ wichtig: Mongo-Dokumenttyp, nicht DOM-Document
} from "mongodb";

type ClusterKey = "core" | "votes" | "pii" | "ai_core_reader";

const CFG: Record<ClusterKey, { uri?: string; db?: string }> = {
  core:           { uri: process.env.CORE_MONGODB_URI,           db: process.env.CORE_DB_NAME },
  votes:          { uri: process.env.VOTES_MONGODB_URI,          db: process.env.VOTES_DB_NAME },
  pii:            { uri: process.env.PII_MONGODB_URI,            db: process.env.PII_DB_NAME },
  ai_core_reader: { uri: process.env.AI_CORE_READER_MONGODB_URI, db: process.env.AI_CORE_READER_DB_NAME },
};

/** Hot-reload-sicherer Global-Store (Next.js dev) */
type Store = {
  clients: Partial<Record<ClusterKey, MongoClient>>;
  dbs: Partial<Record<ClusterKey, Db>>;
  connecting: Partial<Record<ClusterKey, Promise<MongoClient>>>;
};

declare global {
  // eslint-disable-next-line no-var
  var __triMongo: Store | undefined;
}
globalThis.__triMongo ||= { clients: {}, dbs: {}, connecting: {} };
const store = globalThis.__triMongo as Store;

/** URI & DB-Name mit Fallback: ai_core_reader → core */
function uriFor(key: ClusterKey): string | undefined {
  if (key === "ai_core_reader") return CFG.ai_core_reader.uri || CFG.core.uri;
  return CFG[key].uri;
}
function dbNameFor(key: ClusterKey): string | undefined {
  if (key === "ai_core_reader") return CFG.ai_core_reader.db || CFG.core.db;
  return CFG[key].db;
}

async function getClient(key: ClusterKey): Promise<MongoClient> {
  if (store.clients[key]) return store.clients[key]!;
  if (store.connecting[key]) return store.connecting[key]!;

  const uri = uriFor(key);
  if (!uri) throw new Error(`${key}_mongodb_uri_missing`);

  const p = MongoClient.connect(uri);
  store.connecting[key] = p;
  const client = await p;
  store.clients[key] = client;
  return client;
}

async function getDb(key: ClusterKey): Promise<Db> {
  if (store.dbs[key]) return store.dbs[key]!;
  const name = dbNameFor(key);
  if (!name) throw new Error(`${key}_db_name_missing`);
  const client = await getClient(key);
  const db = client.db(name);
  store.dbs[key] = db;
  return db;
}

/** Collection-Helper (generisch) — T muss ein Mongo-Dokument sein */
async function col<T extends MongoDoc = MongoDoc>(key: ClusterKey, name: string): Promise<Collection<T>> {
  const db = await getDb(key);
  return db.collection<T>(name);
}

/** Öffentliche Helfer */
export async function coreCol<T extends MongoDoc = MongoDoc>(name: string) {
  return col<T>("core", name);
}
export async function votesCol<T extends MongoDoc = MongoDoc>(name: string) {
  return col<T>("votes", name);
}
export async function piiCol<T extends MongoDoc = MongoDoc>(name: string) {
  return col<T>("pii", name);
}
/** AI Core Reader: eigener Cluster ODER Fallback → CORE */
export async function aiReaderCol<T extends MongoDoc = MongoDoc>(name: string) {
  return col<T>("ai_core_reader", name);
}

/** Health */
export async function pingMongo(key: ClusterKey) {
  const db = await getDb(key);
  await db.command({ ping: 1 });
  return { ok: true };
}

export async function pingAll(keys: ClusterKey[] = ["core", "votes", "pii", "ai_core_reader"]) {
  const out: Record<string, { ok: boolean; error?: string; usingFallback?: boolean }> = {};
  await Promise.all(
    keys.map(async (k) => {
      try {
        const usingFallback =
          k === "ai_core_reader" &&
          (!CFG.ai_core_reader.uri || !CFG.ai_core_reader.db) &&
          !!(CFG.core.uri && CFG.core.db);
        await pingMongo(k);
        out[k] = { ok: true, ...(usingFallback ? { usingFallback: true } : {}) };
      } catch (e: any) {
        out[k] = { ok: false, error: e?.message || String(e) };
      }
    })
  );
  return out;
}
