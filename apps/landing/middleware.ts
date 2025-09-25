// vpm25/apps/landing/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const intl = createIntlMiddleware({
  locales: (process.env.SUPPORTED_LOCALES ?? "de,en,fr").split(","),
  defaultLocale: process.env.DEFAULT_LOCALE ?? "de",
  localePrefix: "always",
});

// Expliziter Matcher: alles außer Assets/API
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|assets/|api/|.*\\.|favicon.ico|robots.txt|sitemap.xml|opengraph-image).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const PASS = process.env.PROTECT_PASSWORD;

  // Helper: Markiere JEDE Antwort, damit wir sehen, dass MW lief
  const hit = (res: NextResponse) => {
    res.headers.set("x-mw", "hit");
    res.headers.set("x-mw-path", pathname);
    return res;
  };

  // Harter Test: wenn MW läuft, MUSS /mw-test immer 401 liefern
  if (pathname === "/mw-test") return hit(unauthorized());

  // (Matcher filtert Assets schon raus, das hier schadet aber nicht)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/opengraph-image")
  ) {
    return hit(NextResponse.next());
  }

  // Basic-Auth, sobald Passwort gesetzt
  if (PASS) {
    const auth = req.headers.get("authorization") ?? "";
    const [scheme, b64] = auth.split(" ");
    if (scheme !== "Basic" || !b64) return hit(unauthorized());
    try {
      const [, pwd] = atob(b64).split(":");
      if (pwd !== PASS) return hit(unauthorized());
    } catch {
      return hit(unauthorized());
    }
  }

  // danach i18n
  return hit(intl(req));
}

function unauthorized() {
  const res = new NextResponse("Authentication required", { status: 401 });
  res.headers.set("WWW-Authenticate", 'Basic realm="VoiceOpenGov"');
  return res;
}
