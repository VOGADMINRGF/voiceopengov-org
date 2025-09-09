// core/queue/factcheckQueue.ts
import { Queue, Worker, QueueEvents, JobsOptions } from "bullmq";
import IORedis from "ioredis";

export const FACTCHECK_QUEUE = "factcheck";
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let _conn: IORedis | null = null;
export function getRedis() {
  if (!_conn) _conn = new IORedis(REDIS_URL);
  return _conn;
}

let _queue: Queue | null = null;
export function getFactcheckQueue() {
  if (!_queue) {
    _queue = new Queue(FACTCHECK_QUEUE, {
      connection: getRedis(),
      defaultJobOptions: { removeOnComplete: 1000, removeOnFail: 500 } as JobsOptions,
    });
  }
  return _queue;
}

// Optional: QueueEvents (Monitoring/Hooks)
let _events: QueueEvents | null = null;
export function getFactcheckQueueEvents() {
  if (!_events) _events = new QueueEvents(FACTCHECK_QUEUE, { connection: getRedis() });
  return _events;
}
