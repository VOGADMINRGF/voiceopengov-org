// apps/web/src/lib/security/csrf.ts
import { NextRequest, NextResponse } from "next/server";

export function ensureCsrfCookie(res: NextResponse, existing?: string | null) {
  if (existing) return res;
  const token = crypto.randomUUID();
  res.cookies.set("csrf-token", token, {
    httpOnly: false,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}

export function verifyCsrf(req: NextRequest, allowedOrigin?: string) {
  const origin = req.headers.get("origin");
  const expectedOrigin = allowedOrigin || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  if (!origin || new URL(origin).origin !== new URL(expectedOrigin).origin) {
    return { ok: false, reason: "bad_origin" as const };
  }
  const cookieToken = req.cookies.get("csrf-token")?.value || "";
  const headerToken = req.headers.get("x-csrf-token") || "";
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return { ok: false, reason: "csrf_failed" as const };
  }
  return { ok: true as const };
}
