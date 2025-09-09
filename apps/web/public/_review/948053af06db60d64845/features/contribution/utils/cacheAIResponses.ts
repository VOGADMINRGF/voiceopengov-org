import crypto from "crypto";
import { createClient } from "redis";
import redis from "./redisClient";

export async function cacheTranslation(key: string, value: string) {
  await redis.set(key, value, "EX", 60 * 60 * 24); // 1 Tag
}

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export function hashInput(...parts: any[]) {
  const str = JSON.stringify(parts);
  return crypto.createHash("sha256").update(str).digest("hex");
}

export async function getCachedAIResponse(key: string) {
  const val = await redis.get(key);
  return val ? JSON.parse(val) : null;
}

export async function setCachedAIResponse(key: string, value: any, ttlSeconds = 3600) {
  await redis.set(key, JSON.stringify(value), { EX: ttlSeconds }); // TTL
}