import IORedis, { type Redis, type RedisOptions } from "ioredis";

/**
 * URL-Reihenfolge: REDIS_URL > KV_URL > Default localhost
 * TLS wird aktiviert, wenn die URL mit rediss:// beginnt.
 */
const url = process.env.REDIS_URL || process.env.KV_URL || "redis://127.0.0.1:6379";

const baseOpts: RedisOptions = {
  maxRetriesPerRequest: null,         // BullMQ-Empfehlung
  enableReadyCheck: true,
  lazyConnect: true,
  connectionName: process.env.REDIS_CONN_NAME || "vog-worker",
  tls: url.startsWith("rediss://")
    ? (process.env.REDIS_TLS_INSECURE === "true" ? { rejectUnauthorized: false } : {})
    : undefined,
};

/** Für BullMQ: Options statt geteilter Instanz -> dedizierte Verbindungen je Queue/Worker/Events */
export const bullConnection: RedisOptions = { ...baseOpts };

/** Separater Client nur fürs Pingen/Utility */
export const pingClient: Redis = new IORedis(url, baseOpts);

pingClient.on("error", (err) => {
  console.error("[worker][redis] error:", err);
});
pingClient.on("connect", () => console.log("[worker][redis] connect"));
pingClient.on("ready", () => console.log("[worker][redis] ready"));
pingClient.on("end", () => console.warn("[worker][redis] end"));

export async function redisPing(): Promise<"ok" | string> {
  try {
    if (pingClient.status === "end") await pingClient.connect();
    const pong = await pingClient.ping();
    return /^PONG$/i.test(pong) ? "ok" : `unexpected: ${pong}`;
  } catch (e: any) {
    return e?.message ?? "unknown";
  }
}

/** Graceful shutdown (optional im Worker aufrufen) */
export async function closeRedis(): Promise<void> {
  try {
    await pingClient.quit();
  } catch {
    pingClient.disconnect();
  }
}
