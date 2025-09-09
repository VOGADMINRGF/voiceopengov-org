// apps/web/src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { createClient, RedisClientType } from "redis";
import neo4j, { Driver } from "neo4j-driver";
import type { MongoClient as MongoClientType } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Check = { ok: boolean; ms?: number; info?: string; error?: string };

function nowNs() { return process.hrtime.bigint(); }
function toMs(nsDiff: bigint) { return Number(nsDiff) / 1_000_000; }

async function time<T>(fn: () => Promise<T>) {
  const start = nowNs();
  const v = await fn();
  return { v, ms: toMs(nowNs() - start) };
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label}_timeout_${ms}ms`)), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

/* ----------------------- Redis (lazy) ----------------------- */
declare global { // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined;
}
function getRedis(): RedisClientType | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  global.__redisClient ||= createClient({ url });
  return global.__redisClient!;
}
async function pingRedis(): Promise<Check> {
  const client = getRedis();
  if (!client) return { ok: false, info: "client_missing" };
  try {
    if (!client.isOpen) await client.connect();
    const { ms } = await time(() => withTimeout(client.ping(), 800, "redis"));
    return { ok: true, ms };
  } catch (e: any) { return { ok: false, error: String(e) }; }
}

/* ----------------------- Neo4j (lazy) ----------------------- */
declare global { // eslint-disable-next-line no-var
  var __neo4jDriver: Driver | undefined;
}
function getNeo4j(): Driver | null {
  const uri = process.env.NEO4J_URI || process.env.NEO4J_URL;
  const user = process.env.NEO4J_USER || process.env.NEO4J_USERNAME;
  const pass = process.env.NEO4J_PASSWORD || process.env.NEO4J_PASS;
  if (!uri || !user || !pass) return null;
  global.__neo4jDriver ||= neo4j.driver(uri, neo4j.auth.basic(user, pass), {
    maxConnectionPoolSize: Number(process.env.NEO4J_MAX_CONNECTION_POOL_SIZE || 50),
    connectionTimeout: Number(process.env.NEO4J_CONNECTION_TIMEOUT_MS || 8000),
    disableLosslessIntegers: String(process.env.NEO4J_DISABLE_LOSSLESS_INTEGERS ?? "true") === "true",
  });
  return global.__neo4jDriver!;
}
async function pingNeo4j(): Promise[Check] {
  const driver = getNeo4j();
  if (!driver) return { ok: false, info: "driver_missing" };
  try {
    const { ms } = await time(async () => {
      const s = driver.session();
      try { await s.run("RETURN 1"); } finally { await s.close(); }
    });
    return { ok: true, ms };
  } catch (e: any) { return { ok: false, error: String(e) }; }
}

/* ----------------------- Mongo checks -----------------------
   Bevorzugt: importiere vorhandene Keys/Helper aus "@/lib/db/mongo".
   Fallback:  nutzt globale Clients oder URI-ENVs (MONGODB_URI_*).
---------------------------------------------------------------- */
type PingMongoFn = (key: string) => Promise<void>;
let mongoKeys: string[] = [];
let pingMongoImpl: PingMongoFn | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("@/lib/db/mongo") as {
    mongoKeys: string[];
    pingMongo: (key: string) => Promise<void>;
  };
  mongoKeys = mod.mongoKeys;
  pingMongoImpl = mod.pingMongo;
} catch {
  // Fallback-Konfiguration
  const fromEnv = (process.env.MONGO_KEYS || "core,votes,pii").split(",").map(s => s.trim()).filter(Boolean);
  mongoKeys = Array.from(new Set(fromEnv));

  // lazy Map eigener Clients, falls keine globalen existieren
  declare global { // eslint-disable-next-line no-var
    var __mongoClients: Record<string, MongoClientType> | undefined;
  }
  global.__mongoClients ||= {};

  pingMongoImpl = async (key: string) => {
    // 1) globaler Client-Pool (z.B. in /src/lib/db initialisiert)
    const g: any = global;
    const globalClient: MongoClientType | undefined =
      g.__mongoClients?.[key] || g.__mongoClient || g.mongo || undefined;

    // 2) key-spezifische URI aus ENV, z.B. MONGODB_URI_CORE, MONGODB_URI_VOTES...
    const upper = key.toUpperCase().replace(/[^A-Z0-9]/g, "_");
    const uriFromEnv =
      process.env[`MONGODB_URI_${upper}`] ||
      process.env[`MONGO_URL_${upper}`] ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      "";

    let client = globalClient;
    if (!client && uriFromEnv) {
      const { MongoClient } = await import("mongodb");
      global.__mongoClients![key] ||= new MongoClient(uriFromEnv);
      client = global.__mongoClients![key];
    }
    if (!client) throw new Error(`mongo_client_missing:${key}`);

    if ((client as any).topology?.isConnected?.() === false) {
      // neuere Treiber verbinden beim ersten Call implizit
    }
    await client.db().admin().ping();
  };
}

async function pingMongoKey(key: string): Promise<[string, Check]> {
  try {
    const { ms } = await time(() => withTimeout(pingMongoImpl!(key), 900, `mongo_${key}`));
    return [key, { ok: true, ms }];
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.includes("missing")) return [key, { ok: false, info: "client_or_db_missing" }];
    return [key, { ok: false, error: msg }];
  }
}

/* ----------------------- Handler ----------------------- */
export async function GET() {
  // Pflicht: alle Mongo-Keys + Redis
  const mongoResults = await Promise.all(mongoKeys.map((k) => pingMongoKey(k)));
  const redisResult = await pingRedis().then((r) => ["redis", r] as const);
  // Optional: Neo4j
  const neo4jResult = await pingNeo4j().then((r) => ["neo4j", r] as const);

  const checks = Object.fromEntries([...mongoResults, redisResult, neo4jResult]);

  const requiredOk =
    mongoResults.every(([, r]) => r.ok) &&
    redisResult[1].ok === true;

  return NextResponse.json(
    { ok: requiredOk, ts: Date.now(), uptime: process.uptime(), checks },
    { status: requiredOk ? 200 : 503 }
  );
}
