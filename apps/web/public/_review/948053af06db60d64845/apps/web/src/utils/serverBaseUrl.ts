import { headers } from "next/headers";

/** Basis-URL für Server Components (ohne Slash am Ende). */
export function serverBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_BASE_URL;
  if (env && /^https?:\/\//i.test(env)) return env.replace(/\/$/, "");
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host  = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

/** Aus "/api/foo" wird "http(s)://host/api/foo". */
export function absUrl(path: string): string {
  const base = serverBaseUrl();
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
