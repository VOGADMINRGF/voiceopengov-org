import { coreCol } from "@core/db/triMongo";

export async function logError(msg: string, ctx?: any) {
  // Mongo (persist)
  try {
    const col = await coreCol<any>("error_logs");
    await col.insertOne({ ts: new Date(), lvl:"error", msg, ctx: ctx||{} });
  } catch {}

  // Redis (ring buffer) optional
  if (process.env.REDIS_URL) {
    try {
      const mod = await import("ioredis").catch(()=>null);
      if (!mod) return;
      const Redis = mod.default; const r = new Redis(process.env.REDIS_URL as string);
      const entry = JSON.stringify({ ts: Date.now(), lvl:"error", msg, ctx: ctx||{} });
      await r.lpush("errors:last", entry);
      await r.ltrim("errors:last", 0, 9999); // Ringbuffer ~10k
      await r.quit();
    } catch { /* ignore */ }
  }
}
