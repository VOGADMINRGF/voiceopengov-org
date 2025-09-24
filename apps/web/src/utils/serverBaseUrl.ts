// apps/web/src/utils/serverBaseUrl.ts
// server-only: nur in Server Components / Route-Handlern verwenden!
import "server-only";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";

export function serverBaseUrl(): string {
  // Versuch über next/headers (Standardfall bei RSC/RH)
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0].trim();
    if (host) return `${proto}://${host}`;
  } catch {
    /* headers() evtl. nicht verfügbar (z.B. ohne Request-Kontext) */
  }
  // Fallbacks (Vercel / lokal / manuell konfiguriert)
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  return process.env.NEXT_PUBLIC_APP_URL || vercel || "http://localhost:3000";
}

export function serverBaseUrlFrom(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = (req.headers.get("x-forwarded-proto") ?? "http").split(",")[0].trim();
  return `${proto}://${host}`;
}

export function absServerUrl(path: string): string {
  const base = serverBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return /^https?:\/\//i.test(path) ? path : new URL(p, base).toString();
}

export function absServerUrlFrom(req: NextRequest, path: string): string {
  const base = serverBaseUrlFrom(req);
  const p = path.startsWith("/") ? path : `/${path}`;
  return /^https?:\/\//i.test(path) ? path : new URL(p, base).toString();
}
