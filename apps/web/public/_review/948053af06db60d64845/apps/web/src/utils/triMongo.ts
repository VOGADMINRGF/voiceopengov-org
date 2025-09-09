try { require("server-only"); } catch {}
import { MongoClient, Db, Collection } from "mongodb";

const CORE_URI  = process.env.CORE_MONGODB_URI!;
const VOTES_URI = process.env.VOTES_MONGODB_URI!;
const PII_URI   = process.env.PII_MONGODB_URI!;
const CORE_DB   = process.env.CORE_DB_NAME   ?? "core_prod";
const VOTES_DB  = process.env.VOTES_DB_NAME  ?? "votes_prod";
const PII_DB    = process.env.PII_DB_NAME    ?? "pii_prod";

if (!CORE_URI || !VOTES_URI || !PII_URI) {
  throw new Error("Missing one of CORE_MONGODB_URI / VOTES_MONGODB_URI / PII_MONGODB_URI");
}

type Cache = { client?: MongoClient; promise?: Promise<MongoClient> };
const caches: Record<string, Cache> = { core:{}, votes:{}, pii:{} };

async function getClient(kind: "core"|"votes"|"pii"): Promise<MongoClient> {
  const cache = caches[kind];
  if (!cache.promise) {
    const uri = kind==="core" ? CORE_URI : kind==="votes" ? VOTES_URI : PII_URI;
    cache.promise = new MongoClient(uri).connect().then(c => (cache.client=c, c));
  }
  return cache.client ?? (await cache.promise!);
}

export async function getCoreDb(): Promise<Db>  { return (await getClient("core")).db(CORE_DB); }
export async function getVotesDb(): Promise<Db> { return (await getClient("votes")).db(VOTES_DB); }
export async function getPiiDb(): Promise<Db>   { return (await getClient("pii")).db(PII_DB); }

export async function coreCol<T=any>(name: string):  Promise<Collection<T>> { return (await getCoreDb()).collection<T>(name); }
export async function votesCol<T=any>(name: string): Promise<Collection<T>> { return (await getVotesDb()).collection<T>(name); }
export async function piiCol<T=any>(name: string):   Promise<Collection<T>> { return (await getPiiDb()).collection<T>(name); }
