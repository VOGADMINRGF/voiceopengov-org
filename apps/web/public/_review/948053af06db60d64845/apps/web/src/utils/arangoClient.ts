import { Database } from "arangojs";

const url = process.env.ARANGO_URL as string;
const dbName = (process.env.ARANGO_DB as string) || "vog";
const user = process.env.ARANGO_USER as string;
const password = process.env.ARANGO_PASSWORD as string;

let db: Database | null = null;

export function getArango() {
  if (!url || !user || !password) throw new Error("ARANGO env missing");
  if (!db) {
    db = new Database({ url });
    db.useBasicAuth(user, password);
    db.useDatabase(dbName);
  }
  return db;
}

export async function arangoPing() {
  const d = getArango();
  const version = await d.version();
  return Boolean(version);
}