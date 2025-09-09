// apps/web/src/lib/db/core.ts
import mongoose, { Connection } from "mongoose";
import { ENV } from "../../utils/env.server";

// In Dev kann das Modul wegen HMR mehrfach geladen werden.
// => Connection in globalThis cachen.
declare global {
  // eslint-disable-next-line no-var
  var __coreConn: Connection | null | undefined;
  // eslint-disable-next-line no-var
  var __coreConnBoundEvents: boolean | undefined;
}
const g = globalThis as typeof globalThis & {
  __coreConn?: Connection | null;
  __coreConnBoundEvents?: boolean;
};

function maskUri(uri?: string) {
  if (!uri) return "(unset)";
  try {
    const u = new URL(uri);
    const host = u.host;
    const hasCreds = Boolean(u.username || u.password);
    return `${u.protocol}//${hasCreds ? "***@" : ""}${host}${u.pathname || "/"}`;
  } catch { return "(invalid URI)"; }
}

export function coreConn(): Connection {
  if (g.__coreConn && g.__coreConn.readyState === 1) return g.__coreConn;

  const uri = ENV.CORE_MONGODB_URI;              // z.B. mongodb+srv://…
  const dbName = ENV.CORE_DB_NAME ?? "core_prod"; // falls in URI kein /dbname
  if (!uri) throw new Error("CORE_MONGODB_URI missing");

  // Hinweis: Bei Atlas mit mongodb+srv ist TLS automatisch, KEINE extra tls-Option setzen.
  const conn = mongoose.createConnection(uri, {
    dbName,
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10_000,
    // ggf. hilfreich bei IPv6-Problemen: family: 4
    // family: 4,
  });

  // Einmalige Event-Logs (nur beim ersten Aufbau binden)
  if (!g.__coreConnBoundEvents) {
    conn.on("connected", () => {
      console.log(`[coreConn] connected → ${maskUri(uri)} db=${dbName}`);
    });
    conn.on("error", (err) => {
      console.error("[coreConn] error:", err);
    });
    conn.on("disconnected", () => {
      console.warn("[coreConn] disconnected");
    });
    g.__coreConnBoundEvents = true;
  }

  g.__coreConn = conn;
  return conn;
}

// Für Scripts, die warten müssen, bis die Verbindung “open” ist
export async function coreConnReady(): Promise<Connection> {
  const c = coreConn();
  if (c.readyState === 1) return c;
  await new Promise<void>((resolve, reject) => {
    c.once("open", () => resolve());
    c.once("error", (e) => reject(e));
  });
  return c;
}

// Optional: sauber schließen (z. B. in CLI-Scripts/Tests)
export async function coreConnClose(): Promise<void> {
  if (g.__coreConn) {
    await g.__coreConn.close().catch(() => {});
    g.__coreConn = null;
  }
}
