import mongoose, { Connection } from "mongoose";
import { ENV } from "@/utils/env.server";

let conn: Connection | null = null;

export function piiConn(): Connection {
  if (conn && conn.readyState === 1) return conn;
  conn = mongoose.createConnection(ENV.PII_MONGODB_URI, {
    dbName: ENV.PII_DB_NAME,
    maxPoolSize: 15,
    serverSelectionTimeoutMS: 8000,
  });
  return conn;
}
