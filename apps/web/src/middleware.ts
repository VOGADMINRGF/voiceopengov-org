// apps/web/middleware.ts
import { NextRequest, NextResponse } from "next/server";

// ---------- Gates / Paths ----------
const VERIFIED_PATHS = ["/report", "/reports", "/statements/new", "/contributions/new"];
const ONBOARD_LOCATION_PATH = "/auth/onboarding/location";
const ADMIN_ROLES = new Set(["admin", "owner", "superadmin"]);

const isVerifiedPath = (p: string) => VERIFIED_PATHS.some((x) => p === x || p.startsWith(x + "/"));
const isLocationOnboarding = (p: string) => p === ONBOARD_LOCATION_PATH || p.startsWith(ONBOARD_LOCATION_PATH + "/");
const isPublic = (p: string) =>
  p.startsWith("/_next") || p.startsWith("/images") || p.startsWith("/api/public") ||
  p === "/" || p === "/login" || p === "/register" || p.startsWith("/verify");

// ---------- Rate limit (Edge-safe via Upstash REST) ----------
const RL_WINDOW = 60; // s
const RL_MAX = 120;   // req/min/IP
async function rateLimit(ip: string) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return { ok: true, skipped: true };
    const key = `rl:${ip}`;
    const body = JSON.stringify([["INCR", key], ["EXPIRE", key, String(RL_WINDOW)]]);
    const r = await fetch(`${url}/pipeline`, {
      method: "POST", cache: "no-store",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body
    });
    if (!r.ok) return { ok: true, skipped: true };
    const json = (await r.json()) as Array<{ result: number }>;
    const count = Number(json?.[0]?.result ?? 0);
    return { ok: count <= RL_MAX, skipped: false, count };
  } catch { return { ok: true, skipped: true }; }
}

// ---------- CSRF (double-submit) ----------
const CSRF_COOKIE = "csrf-token";
const CSRF_HEADER = "x-csrf-token";
const isApi = (req: NextRequest) => req.nextUrl.pathname.startsWith("/api/");
const isStateChanging = (m: string) => ["POST","PUT","PATCH","DELETE"].includes(m);

// ---------- Small utils (Edge crypto) ----------
function b64url(bytes: Uint8Array) {
  const b64 = Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function nonce16() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return b64url(bytes);
}

// ---------- Middleware ----------
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (req.method === "OPTIONS") return NextResponse.next();

  // 0) Early Admin coarse gate (cookie-basiert)
  if (pathname.startsWith("/admin")) {
    const role = req.cookies.get("u_role")?.value ?? "";
    if (!ADMIN_ROLES.has(role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname + (search || ""));
      url.searchParams.set("reason", "admin-only");
      return NextResponse.redirect(url);
    }
  }

  // 1) Verified-only Gate (für bestimmte Seiten)
  if (isVerifiedPath(pathname)) {
    const isVerified = req.cookies.get("u_verified")?.value === "1";
    const uid = req.cookies.get("u_id")?.value;
    if (!uid || !isVerified) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname + (search || ""));
      url.searchParams.set("reason", "verified-only");
      return NextResponse.redirect(url);
    }
  }

  // 2) Location-Onboarding Gate
  const needsLoc = req.cookies.get("u_loc")?.value !== "1";
  if (!isPublic(pathname) && needsLoc && !isLocationOnboarding(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = ONBOARD_LOCATION_PATH;
    return NextResponse.redirect(url);
  }

  // 3) Rate limit (nur API sinnvoll)
  const res = NextResponse.next();
  const rid = crypto.randomUUID();
  res.headers.set("X-Request-Id", rid);

  if (isApi(req)) {
    const ip = req.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    const rl = await rateLimit(ip);
    if (!rl.ok) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": RL_WINDOW.toString(), "X-Request-Id": rid },
      });
    }
    if (rl.skipped) res.headers.set("X-RateLimit-Policy", "skip(no-store)");
    else {
      res.headers.set("X-RateLimit-Policy", `window=${RL_WINDOW}s; max=${RL_MAX}`);
      res.headers.set("X-RateLimit-Remaining", String(Math.max(0, RL_MAX - (rl.count ?? 0))));
    }
  }

  // 4) CSP + Nonce
  const prod = process.env.NODE_ENV === "production";
  const nonce = nonce16();
  res.headers.set("x-csp-nonce", nonce);

  if (isApi(req)) {
    const cspApi = [
      "default-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'none'",
      "object-src 'none'",
      "img-src 'none'",
      "font-src 'none'",
      "style-src 'none'",
      "script-src 'none'",
      "connect-src 'self'",
    ].join("; ");
    res.headers.set("Content-Security-Policy", cspApi);
  } else {
    const cspHtml = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      prod ? "style-src 'self'" : "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      prod ? "connect-src 'self' https:" : "connect-src 'self' https: ws: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ");
    res.headers.set("Content-Security-Policy", cspHtml);
  }

  // 5) CSRF (Double-submit: Header muss gleich Cookie sein)
  if (isApi(req) && isStateChanging(req.method) && !req.nextUrl.pathname.startsWith("/api/gdpr/export")) {
    const headerToken = req.headers.get(CSRF_HEADER) || "";
    const cookieToken = req.cookies.get(CSRF_COOKIE)?.value || "";
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return new NextResponse("Forbidden (CSRF)", { status: 403 });
    }
  }
  // sicherstellen, dass Cookie existiert
  if (!req.cookies.get(CSRF_COOKIE)?.value) {
    const token = nonce16();
    // ⚠️ Für Double-Submit muss der Client ihn lesen können → nicht HttpOnly
    res.cookies.set({
      name: CSRF_COOKIE,
      value: token,
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12, // 12h
    });
  }

  // 6) Security-Header baseline
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  if (process.env.NODE_ENV === "production") {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return res;
}

// nur relevante Pfade – Next internals/Assets ausschließen
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
