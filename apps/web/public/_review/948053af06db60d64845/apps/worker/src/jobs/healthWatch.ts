import { Queue, Worker, QueueScheduler, JobsOptions } from "bullmq";
import fetch from "node-fetch"; // falls nicht vorhanden: pnpm -C apps/worker add node-fetch
import { connection, redis } from "../lib/redis";

const WEB_BASE_URL = process.env.WEB_BASE_URL || "http://localhost:3000";
const INTERNAL_HEALTH_TOKEN = process.env.INTERNAL_HEALTH_TOKEN || "";
const QUEUE = "health:watch";

type Row = { name: string; ok: boolean; ms: number; error?: string; skipped?: boolean };

export function registerHealthWatch() {
  new QueueScheduler(QUEUE, { connection });
  const q = new Queue(QUEUE, { connection });

  // alle 60s prüfen (anpassen wie gewünscht)
  const repeat: JobsOptions = { repeat: { every: 60_000 } };
  q.add("tick", {}, repeat);

  new Worker(QUEUE, async () => {
    const r = await fetch(`${WEB_BASE_URL}/api/health/system-matrix`, { timeout: 15_000 as any });
    if (!r.ok) return;

    const { services } = (await r.json()) as { services: Row[] };
    const downs = services.filter(s => !s.ok && !s.skipped);

    // Statuswechsel erkennen
    const lastKey = "health:last";
    const lastJson = (await redis.get(lastKey)) || "[]";
    const last: Row[] = JSON.parse(lastJson);
    const lastMap = new Map(last.map(s => [s.name, s.ok]));

    const newlyDown = downs.filter(s => lastMap.get(s.name) !== false); // vorher nicht down

    await redis.set(lastKey, JSON.stringify(services), "EX", 10 * 60); // 10 Min TTL

    if (!newlyDown.length) return;

    const subject = "VOG Monitoring – Service DOWN";
    const html = `
      <h3>Service-Ausfall erkannt</h3>
      <p>Folgende Services sind soeben ausgefallen:</p>
      <ul>${newlyDown.map(s => `<li><b>${s.name}</b> – ${s.error || "unknown"}</li>`).join("")}</ul>
      <p>Zeit: ${new Date().toISOString()}</p>
    `;

    // Mail über Web-API auslösen (einfacher, Settings & SMTP sind dort)
    await fetch(`${WEB_BASE_URL}/api/admin/alerts/notify`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-token": INTERNAL_HEALTH_TOKEN,
      },
      body: JSON.stringify({ subject, html }),
    });
  }, { connection });
}
