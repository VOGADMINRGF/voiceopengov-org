import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

async function main() {
  const queue = new Queue("factcheck", { connection });

  const job = await queue.add("demo", {
    text: "Dies ist ein Test-Factcheck: 'Die Erde ist flach.'",
    language: "de",
    topic: "Wissenschaft",
  });

  console.log("Job enqueued:", job.id);
  await queue.close();
  connection.disconnect();
}

main().catch(console.error);
