// apps/web/src/lib/db/index.ts
import { MongoClient } from "mongodb";
export { coreCol, votesCol, piiCol, pingAll } from "@core/triMongo";

declare global {
  // eslint-disable-next-line no-var
  var __coreClient__: MongoClient | undefined;
}
let client = globalThis.__coreClient__;

export async function getDb() {
  if (!process.env.CORE_MONGODB_URI || !process.env.CORE_DB_NAME) {
    throw new Error("CORE_MONGODB_URI / CORE_DB_NAME missing");
  }
  if (!client) {
    client = await MongoClient.connect(process.env.CORE_MONGODB_URI);
    globalThis.__coreClient__ = client;
  }
  return client.db(process.env.CORE_DB_NAME);
}
