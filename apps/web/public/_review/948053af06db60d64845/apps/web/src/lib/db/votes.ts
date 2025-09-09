import mongoose from "mongoose";
import { ENV } from "../../utils/env.server";

let conn: mongoose.Connection | undefined;

export function votesConn(): mongoose.Connection {
  if (!conn) {
    conn = mongoose.createConnection(ENV.VOTES_MONGODB_URI, {
      dbName: ENV.VOTES_DB_NAME,
      maxPoolSize: 30,
      serverSelectionTimeoutMS: 8000,
    });
  }
  return conn;
}
