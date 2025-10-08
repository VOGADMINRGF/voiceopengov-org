// core/db/triMongo.ts
import { MongoClient, type Db, type Collection, type Document as MongoDoc } from "mongodb";

/** tri = core, votes, pii (+ ai_core_reader mit Fallback → core) */
export type TriStore = "core" | "votes" | "pii" | "ai_core_reader";

type Conn = { uri?: string; db?: string };
const CFG: Record<TriStore, Conn> = {
  core:           { uri: process.env.CORE_MONGODB_URI,           db: process.env.CORE_DB_NAME },
  votes:          { uri: process.env.VOTES_MONGODB_URI,          db: process.env.VOTES_DB_NAME },
  pii:            { uri: process.env.PII_MONGODB_URI,            db: process.env.PII_DB_NAME },
  ai_core_reader: { uri: process.env.AI_CORE_READER_MONGODB_URI, db: process.env.AI_CORE_READER_DB_NAME },
};

declare global {
  // eslint-disable-next-line no-var
  var __TRIMONGO__: {
    clients: Partial<Record<TriStore, MongoClient>>;
    dbs: Partial<Record<TriStore, Db>>;
    connecting: Partial<Record<TriStore, Promise<MongoClient>>>;
  } | undefined;
}
const store = (globalThis.__TRIMONGO__ ??= { clients: {}, dbs: {}, connecting: {} });

function must(v: string | undefined, msg: string): string {
  if (!v) throw new Error(msg);
  return v;
}

function uriFor(key: TriStore): string {
  if (key === "ai_core_reader") return CFG.ai_core_reader.uri || must(CFG.core.uri, "CORE_MONGODB_URI missing");
  return must(CFG[key].uri, `${key.toUpperCase()}_MONGODB_URI missing`);
}
function dbNameFor(key: TriStore): string {
  if (key === "ai_core_reader") return CFG.ai_core_reader.db || must(CFG.core.db, "CORE_DB_NAME missing");
  return must(CFG[key].db, `${key.toUpperCase()}_DB_NAME missing`);
}

async function clientFor(key: TriStore): Promise<MongoClient> {
  if (store.clients[key]) return store.clients[key]!;
  if (store.connecting[key]) return store.connecting[key]!;
  const p = MongoClient.connect(uriFor(key), { maxPoolSize: 8 });
  store.connecting[key] = p;
  const c = await p;
  store.clients[key] = c;
  return c;
}

export async function triClient(key: TriStore = "core"): Promise<MongoClient> {
  return clientFor(key);
}

export async function triDb(key: TriStore = "core"): Promise<Db> {
  if (store.dbs[key]) return store.dbs[key]!;
  const db = (await clientFor(key)).db(dbNameFor(key));
  store.dbs[key] = db;
  return db;
}

export async function triCol<T extends MongoDoc = MongoDoc>(key: TriStore, name: string): Promise<Collection<T>> {
  const db = await triDb(key);
  return db.collection<T>(name);
}

/** Convenience-Shortcuts */
export const coreCol  = <T extends MongoDoc = MongoDoc>(name: string) => triCol<T>("core", name);
export const votesCol = <T extends MongoDoc = MongoDoc>(name: string) => triCol<T>("votes", name);
export const piiCol   = <T extends MongoDoc = MongoDoc>(name: string) => triCol<T>("pii", name);
export const aiReaderCol = <T extends MongoDoc = MongoDoc>(name: string) => triCol<T>("ai_core_reader", name);

/** Health */
export async function triPing(key: TriStore) {
  const db = await triDb(key);
  await db.command({ ping: 1 });
  return { ok: true as const };
}
export async function triPingAll(keys: TriStore[] = ["core", "votes", "pii", "ai_core_reader"]) {
  const out: Record<string, { ok: boolean; error?: string; usingFallback?: boolean }> = {};
  await Promise.all(keys.map(async (k) => {
    try {
      const usingFallback =
        k === "ai_core_reader" &&
        (!CFG.ai_core_reader.uri || !CFG.ai_core_reader.db) &&
        !!(CFG.core.uri && CFG.core.db);
      await triPing(k);
      out[k] = { ok: true, ...(usingFallback ? { usingFallback: true } : {}) };
    } catch (e: any) {
      out[k] = { ok: false, error: e?.message || String(e) };
    }
  }));
  return out;
}

/** Kompat-Aliase, falls Altcode `getDb/getCol` etc. nutzt */
export const getDb = triDb;
export const getCol = triCol;
export const pingMongo = triPing;
export const pingAll = triPingAll;

/** Tests/CLI */
export async function triCloseAll() {
  await Promise.all(Object.values(store.clients).map(c => c?.close()));
  store.clients = {}; store.connecting = {}; store.dbs = {};
}
