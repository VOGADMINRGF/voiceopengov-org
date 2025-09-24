import { NextRequest, NextResponse } from "next/server";

// Mutierende Methoden absichern
const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function json(status: number, data: unknown) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function middleware(req: NextRequest) {
  const { pathname, protocol, host } = req.nextUrl;

  // 1) Für mutierende API-Requests CSRF + Origin prüfen
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/public/") && MUTATING.has(req.method)) {
    const origin = req.headers.get("origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || `${protocol}//${host}`;

    // Origin muss exakt zur App passen
    if (!origin || new URL(origin).origin !== new URL(allowedOrigin).origin) {
      return json(403, { error: "bad_origin" });
    }

    // Double-Submit: Cookie-Wert muss Header-Wert entsprechen
    const cookieToken = req.cookies.get("csrf-token")?.value || "";
    const headerToken = req.headers.get("x-csrf-token") || "";

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return json(403, { error: "csrf_failed" });
    }
  }

  // 2) CSRF-Token automatisch ausgeben, falls noch nicht vorhanden
  if (req.method === "GET" && !req.cookies.get("csrf-token")) {
    const res = NextResponse.next();
    const token = crypto.randomUUID();
    res.cookies.set("csrf-token", token, {
      httpOnly: false,                // für Double-Submit lesbar
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // lokal: http erlauben
      path: "/",
      maxAge: 60 * 60 * 24,          // 1 Tag
    });
    return res;
  }

  return NextResponse.next();
}

// Middleware auf alles anwenden, außer statics und public APIs
export const config = {
  matcher: ["/((?!_next/|images/|favicon.ico|api/public/).*)"],
};
