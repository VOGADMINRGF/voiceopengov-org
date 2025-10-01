// apps/web/src/lib/api.ts
import { NextRequest, NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message = "Bad Request", status = 400, extra?: any) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function json<T = any>(req: NextRequest): Promise<T> {
  return (await req.json()) as T;
}

export function assertMethod(req: NextRequest, ...allowed: string[]) {
  const m = req.method?.toUpperCase();
  if (!m || !allowed.map((s) => s.toUpperCase()).includes(m)) {
    throw new Error(`Method not allowed: ${m}`);
  }
}

export default { ok, fail, json, assertMethod };
