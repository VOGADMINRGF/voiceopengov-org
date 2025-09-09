import { NextResponse } from "next/server";
import { PrismaClient as Web } from "@/db/web";
import { coreConn } from "@/lib/db/core";

export const dynamic = "force-dynamic";

function now() { return process.hrtime.bigint(); }
function toMs(t0: bigint) { return Number(process.hrtime.bigint() - t0) / 1_000_000; }

const web = new Web();

export async function GET() {
  const out: any = { ok: false, services: {}, ts: new Date().toISOString() };

  // Mongo (Core)
  let t = now();
  try {
    const conn = coreConn();
    await conn.db.admin().ping();
    out.services.core = { ok: true, latency: Math.round(toMs(t)) };
  } catch (e: any) {
    out.services.core = { ok: false, error: String(e?.message ?? e), latency: Math.round(toMs(t)) };
  }

  // Postgres (Web)
  t = now();
  try {
    await web.$queryRawUnsafe("SELECT 1");
    out.services.web = { ok: true, latency: Math.round(toMs(t)) };
  } catch (e: any) {
    out.services.web = { ok: false, error: String(e?.message ?? e), latency: Math.round(toMs(t)) };
  }

  out.ok = !!(out.services.core?.ok && out.services.web?.ok);
  return NextResponse.json(out, { status: out.ok ? 200 : 503 });
}
