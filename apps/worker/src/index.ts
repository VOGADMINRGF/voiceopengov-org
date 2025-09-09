// apps/worker/src/index.ts
import { Queue, Worker, QueueEvents } from "bullmq";
import { connection, redisPing } from "./lib/redis";
import { registerHealthWatch } from "./jobs/healthWatch";

let shuttingDown = false;

async function main() {
  console.log("Redis ping:", await redisPing());

  // Health-Watcher (prüft /api/health/system-matrix und mailt bei DOWN)
  registerHealthWatch();

  const queueName = "demo";
  const queue = new Queue(queueName, { connection });

  // Events (BullMQ v5: QueueScheduler entfällt)
  const events = new QueueEvents(queueName, { connection });
  events.on("completed", ({ jobId }) => console.log("[events] completed", jobId));
  events.on("failed", ({ jobId, failedReason }) => console.error("[events] failed", jobId, failedReason));
  events.on("error", (err) => console.error("[events] error", err));

  const worker = new Worker(
    queueName,
    async (job) => {
      console.log("[worker] processing", job.id, job.name, job.data);
      return { ok: true };
    },
    { connection }
  );

  worker.on("error", (err) => console.error("[worker] error", err));

  // Ein Test-Job zum Start
  await queue.add("ping", { ts: Date.now() });

  const shutdown = async (signal?: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Shutting down…${signal ? ` (${signal})` : ""}`);
    await Promise.allSettled([
      events.close(),
      worker.close(),
      queue.close(),
      // wenn euer lib/redis.ts die Connection exportiert:
      // (close/quit optional je nach ioredis-Version)
      (connection as any)?.quit?.().catch(() => (connection as any)?.disconnect?.()),
    ]);
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("uncaughtException", (err) => {
    console.error("[process] uncaughtException", err);
    shutdown("uncaughtException");
  });
  process.on("unhandledRejection", (reason) => {
    console.error("[process] unhandledRejection", reason as any);
    shutdown("unhandledRejection");
  });
}

main().catch((err) => {
  console.error("Worker boot failed:", err);
  process.exit(1);
});
