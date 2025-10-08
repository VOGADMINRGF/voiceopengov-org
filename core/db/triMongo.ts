import mongoose, { Connection, Schema, Model, Document } from "mongoose";

type ConnName = "core" | "pii" | "votes";
const cache: Partial<Record<ConnName, Connection>> = {};

function mk(uri?: string, dbName?: string) {
  if (!uri || !dbName) throw new Error("Missing MongoDB envs for triMongo");
  const conn = mongoose.createConnection(uri, { dbName });
  conn.set("strictQuery", true);
  return conn;
}

export function coreConn(): Connection {
  if (cache.core) return cache.core!;
  cache.core = mk(process.env.CORE_MONGODB_URI, process.env.CORE_DB_NAME);
  return cache.core!;
}
export function piiConn(): Connection {
  if (cache.pii) return cache.pii!;
  cache.pii = mk(process.env.PII_MONGODB_URI, process.env.PII_DB_NAME);
  return cache.pii!;
}
export function votesConn(): Connection {
  if (cache.votes) return cache.votes!;
  cache.votes = mk(process.env.VOTES_MONGODB_URI, process.env.VOTES_DB_NAME);
  return cache.votes!;
}

/** Kompat-Helper, falls irgendwo `modelOn(conn, ...)` benutzt wird */
export function modelOn<T extends Document>(
  conn: Connection,
  name: string,
  schema: Schema<T>,
  collection?: string
): Model<T> {
  return (conn.models[name] as Model<T>) || conn.model<T>(name, schema, collection);
}

/** Optional: Default-Objekt, falls irgendwo `default.coreConn` importiert wird */
export default { coreConn, piiConn, votesConn, modelOn };
