// apps/web/src/lib/redis.ts
import type { RedisClientType } from "redis";

export const VOTE_CH_PREFIX = "votes";
export const voteChannel = (statementId: string) => `${VOTE_CH_PREFIX}:${statementId}`;

const isUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// ---------- Upstash (HTTP) ----------
type UpstashRedis = import("@upstash/redis").Redis;
let upstashClient: UpstashRedis | null = null;

async function getUpstash(): Promise<UpstashRedis> {
  if (!upstashClient) {
    const { Redis } = await import("@upstash/redis");
    upstashClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return upstashClient!;
}

// ---------- node-redis (TCP) ----------
declare global {
  // eslint-disable-next-line no-var
  var __redisBase: RedisClientType | undefined;
  // eslint-disable-next-line no-var
  var __redisPub: RedisClientType | undefined;
  // eslint-disable-next-line no-var
  var __redisSub: RedisClientType | undefined;
}

function getRedisUrl(): string {
  return (
    process.env.REDIS_URL ||
    process.env.REDIS_URI ||
    process.env.REDIS ||
    "redis://127.0.0.1:6379"
  );
}

async function getNodeClient(): Promise<RedisClientType> {
  if (!global.__redisBase) {
    const { createClient } = await import("redis");
    global.__redisBase = createClient({ url: getRedisUrl() });
  }
  if (!global.__redisBase!.isOpen) await global.__redisBase!.connect();
  return global.__redisBase!;
}

async function getNodePublisher(): Promise<RedisClientType> {
  if (!global.__redisPub) {
    const base = await getNodeClient();
    global.__redisPub = base.duplicate();
  }
  if (!global.__redisPub!.isOpen) await global.__redisPub!.connect();
  return global.__redisPub!;
}

async function getNodeSubscriber(): Promise<RedisClientType> {
  if (!global.__redisSub) {
    const base = await getNodeClient();
    global.__redisSub = base.duplicate();
  }
  if (!global.__redisSub!.isOpen) await global.__redisSub!.connect();
  return global.__redisSub!;
}

// ---------- Public API ----------
export async function redisPing(): Promise<string> {
  if (isUpstash) {
    const up = await getUpstash();
    // Upstash gibt i.d.R. "PONG" zurück
    return up.ping();
  }
  const cli = await getNodeClient();
  return cli.ping(); // Promise<string>
}

export async function redisPublish(channel: string, message: string): Promise<number> {
  if (isUpstash) {
    const up = await getUpstash();
    return up.publish(channel, message); // number
  }
  const pub = await getNodePublisher();
  return pub.publish(channel, message); // number
}

export async function redisSubscribe(
  channel: string,
  onMessage: (msg: string) => void
): Promise<() => Promise<void>> {
  if (isUpstash) {
    throw new Error("Upstash(HTTP) Subscribe ist hier nicht implementiert. Nutze Worker/WebSockets.");
  }
  const sub = await getNodeSubscriber();
  await sub.subscribe(channel, (payload) => onMessage(String(payload)));
  return async () => {
    try { await sub.unsubscribe(channel); } catch {}
  };
}

export async function redisCloseAll(): Promise<void> {
  if (isUpstash) return;
  const closes: Promise<any>[] = [];
  if (global.__redisSub?.isOpen) closes.push(global.__redisSub.quit());
  if (global.__redisPub?.isOpen) closes.push(global.__redisPub.quit());
  if (global.__redisBase?.isOpen) closes.push(global.__redisBase.quit());
  await Promise.allSettled(closes);
}
