// apps/web/src/utils/mongoClient.ts
import { MongoClient, Db } from "mongodb";

type Alias = "core" | "votes" | "pii";

const URIS: Record<Alias, string> = {
  core:  process.env.CORE_MONGODB_URI  || process.env.MONGODB_URI || "",
  votes: process.env.VOTES_MONGODB_URI || process.env.MONGODB_URI || "",
  pii:   process.env.PII_MONGODB_URI   || process.env.MONGODB_URI || "",
};

const DBS: Record<Alias, string> = {
  core:  process.env.CORE_MONGODB_DB  || process.env.MONGODB_DB || "vog",
  votes: process.env.VOTES_MONGODB_DB || process.env.MONGODB_DB || "vog",
  pii:   process.env.PII_MONGODB_DB   || process.env.MONGODB_DB || "vog",
};

const clients: Partial<Record<Alias, MongoClient>> = {};

export async function getDb(alias: Alias = "core"): Promise<Db> {
  const uri = URIS[alias];
  if (!uri) throw new Error(`Mongo URI for ${alias} missing`);
  if (!clients[alias]) {
    clients[alias] = new MongoClient(uri, { maxPoolSize: 8 });
    await clients[alias]!.connect();
  }
  return clients[alias]!.db(DBS[alias]);
}
