import { Queue } from "bullmq";
import { connection } from "@/lib/redis";

export const factcheckQueue = new Queue("factcheck", { connection });
// optional: export const testQueue = new Queue("test", { connection });
