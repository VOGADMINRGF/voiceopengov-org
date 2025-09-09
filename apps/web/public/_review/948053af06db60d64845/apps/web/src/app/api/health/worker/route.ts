// apps/web/src/app/api/health/worker/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new IORedis(url, { tls: url.startsWith("rediss://") ? {} : undefined, maxRetriesPerRequest: null });

export async function GET() {
  try {
    const q = new Queue("demo", { connection });
    const qe = new QueueEvents("demo", { connection });
    await qe.waitUntilReady();
    const counts = await q.getJobCounts("waiting","active","completed","failed","delayed");
    await Promise.allSettled([qe.close(), q.close()]);
    return NextResponse.json({ ok: true, counts });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  } finally {
    // ioredis bleibt in Web-Route besser nicht global offen
    try { await connection.quit(); } catch {}
  }
}
