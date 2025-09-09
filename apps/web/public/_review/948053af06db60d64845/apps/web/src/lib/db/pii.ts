import mongoose from "mongoose";
import { ENV } from "../../utils/env.server";

let conn: mongoose.Connection | undefined;

export function piiConn(): mongoose.Connection {
  if (!conn) {
    conn = mongoose.createConnection(ENV.PII_MONGODB_URI, {
      dbName: ENV.PII_DB_NAME,
      maxPoolSize: 15,
      serverSelectionTimeoutMS: 8000,
    });
  }
  return conn;
}
