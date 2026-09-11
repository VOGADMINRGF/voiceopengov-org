import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_LOCALES = new Set([
  "de",
  "en",
  "fr",
  "es",
  "tr",
  "ar",
  "pl",
  "it",
  "ru",
  "zh",
]);

type NextResponseWithNext = typeof NextResponse & {
  next(init?: { request?: { headers?: Headers } }): Response;
};

const nextResponse = NextResponse as NextResponseWithNext;

async function secureEqual(actual: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [actualHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(actual)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const a = new Uint8Array(actualHash);
  const b = new Uint8Array(expectedHash);
  let mismatch = a.length ^ b.length;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0;
}

async function hasAdminAccess(request: NextRequest): Promise<boolean> {
  const user = process.env.VOG_ADMIN_USER;
  const password = process.env.VOG_ADMIN_PASSWORD;
  if (!user || !password) return false;
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 1) return false;
    return (await secureEqual(decoded.slice(0, separator), user)) &&
      (await secureEqual(decoded.slice(separator + 1), password));
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/growth") || request.nextUrl.pathname.startsWith("/api/admin/funnel")) {
    if (!(await hasAdminAccess(request))) {
      return new Response("Admin authentication required", {
        status: process.env.VOG_ADMIN_USER && process.env.VOG_ADMIN_PASSWORD ? 401 : 503,
        headers: {
          "cache-control": "no-store",
          "www-authenticate": 'Basic realm="VoiceOpenGov Growth", charset="UTF-8"',
        },
      });
    }
  }
  const requestedLocale = request.nextUrl.searchParams.get("lang")?.toLowerCase();
  if (!requestedLocale || !PUBLIC_LOCALES.has(requestedLocale)) {
    return nextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-vog-locale", requestedLocale);

  return nextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
