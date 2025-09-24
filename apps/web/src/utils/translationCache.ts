// apps/web/src/utils/translationCache.ts
import { createClient } from "redis";

type CacheImpl = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSec?: number): Promise<void>;
};

class MemoryCache implements CacheImpl {
  private m = new Map<string, { v: string; exp?: number }>();
  async get(key: string) {
    const e = this.m.get(key);
    if (!e) return null;
    if (e.exp && e.exp < Date.now()) { this.m.delete(key); return null; }
    return e.v;
  }
  async set(key: string, value: string, ttlSec = 86400) {
    const exp = Date.now() + ttlSec * 1000;
    this.m.set(key, { v: value, exp });
  }
}

class RedisCache implements CacheImpl {
  private client;
  constructor(url: string) {
    this.client = createClient({ url });
    this.client.connect().catch(() => {});
  }
  async get(key: string) {
    return await this.client.get(key);
  }
  async set(key: string, value: string, ttlSec = 86400) {
    await this.client.set(key, value, { EX: ttlSec });
  }
}

const impl: CacheImpl = process.env.REDIS_URL
  ? new RedisCache(process.env.REDIS_URL)
  : new MemoryCache();

const makeKey = (text: string, to: string) => `tr:v1:${to}:${Buffer.from(text).toString("base64")}`;

export const translationCache = {
  async get(text: string, to: string) {
    return impl.get(makeKey(text, to));
  },
  async set(text: string, to: string, translated: string, ttlSec?: number) {
    await impl.set(makeKey(text, to), translated, ttlSec);
  },
};
