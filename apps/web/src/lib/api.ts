// apps/web/src/lib/api.ts
import { NextRequest, NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

// kleinem Upgrade: init als optionales 4. Arg
export function fail(message = "Bad Request", status = 400, extra?: any, init?: ResponseInit) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status, ...(init || {}) });
}

/** ✅ Alias für Alt-Code, der { err } importiert */
export function err(
  a?: number | string,
  b?: string | number,
  extra?: any,
  init?: ResponseInit
) {
  // unterstützt beide Aufrufstile:
  // err(500, "msg")  |  err("msg", 500)  |  err("msg")  |  err(500)
  let status = 500;
  let message = "Error";
  if (typeof a === "number") { status = a; if (typeof b === "string") message = b; }
  else if (typeof a === "string") { message = a; if (typeof b === "number") status = b; }
  return fail(message, status, extra, init);
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

export default { ok, fail, err, json, assertMethod };
