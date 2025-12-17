import { getPiiConn, pii } from "@vog/tri-mongo";

export async function piiConn() {
  return getPiiConn();
}

export async function piiDb() {
  const conn = await piiConn();
  const dbName = conn.name || conn.db?.databaseName;
  if (!dbName) throw new Error("piiConn missing database name");
  return conn.getClient().db(dbName);
}

export function piiCol(name: string) {
  return pii.getCol(name);
}

export default { piiConn, piiDb, piiCol };
