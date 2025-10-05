// core/db/mongo.ts
import { MongoClient } from "mongodb";
import type { Db, Collection, Document } from "mongodb";

let _client: MongoClient | null = null;
let _db: Db | null = null;

const URI = process.env.CORE_MONGODB_URI || process.env.MONGODB_URI || "";
const DB_NAME = process.env.CORE_DB_NAME || "core";

export async function getCoreDb(): Promise<Db> {
  if (!_client) {
    if (!URI) throw new Error("CORE_MONGODB_URI/MONGODB_URI is not set");
    _client = new MongoClient(URI);
    await _client.connect();
    _db = _client.db(DB_NAME);
  }
  return _db!;
}

/**
 * Streng typisiert: T muss ein Mongo-Document sein.
 * Wenn du nichts angibst, ist der Default "Document".
 */
export async function coreCol<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getCoreDb();
  return db.collection<T>(name);
}

export async function closeCoreDb() {
  await _client?.close();
  _client = null;
  _db = null;
}
