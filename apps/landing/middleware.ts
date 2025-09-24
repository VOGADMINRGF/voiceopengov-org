// vpm25/apps/landing/middleware.ts MW Test
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const intl = createIntlMiddleware({
  locales: (process.env.SUPPORTED_LOCALES ?? "de,en,fr").split(","),
  defaultLocale: process.env.DEFAULT_LOCALE ?? "de",
  localePrefix: "always",
});

export default function middleware(req: NextRequest) {
  const PASS = process.env.PROTECT_PASSWORD;
  const { pathname } = req.nextUrl;

  // --- VALIDIERUNGS-TEST: sollte IMMER 401 liefern, wenn Middleware greift ---
  if (pathname === "/mw-test") return unauthorized();

  // Statische Assets & API freigeben
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/opengraph-image");
  if (isAsset) return NextResponse.next();

  // Basic Auth aktiv, sobald ENV gesetzt ist
  if (PASS) {
    const auth = req.headers.get("authorization") || "";
    const [scheme, b64] = auth.split(" ");
    if (scheme !== "Basic" || !b64) return unauthorized();
    try {
      const [, pwd] = atob(b64).split(":");
      if (pwd !== PASS) return unauthorized();
    } catch {
      return unauthorized();
    }
  }

  // Danach i18n; Debug-Header setzen, um Middleware-Hit zu sehen
  const res = intl(req) as NextResponse;
  res.headers.set("x-mw", "hit");
  res.headers.set("x-lock", PASS ? "1" : "0");
  return res;
}

function unauthorized() {
  const res = new NextResponse("Authentication required", { status: 401 });
  res.headers.set("WWW-Authenticate", 'Basic realm="VoiceOpenGov"');
  return res;
}

// Auf ALLE Pfade anwenden, inkl. "/"
export const config = { matcher: ["/:path*"] };
