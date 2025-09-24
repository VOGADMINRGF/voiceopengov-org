// apps/web/src/app/api/csrf/route.ts
import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE = "csrf-token";
const CSRF_HEADER = "x-csrf-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function genToken(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  // base64url ist kompakt & headerfreundlich
  // 32 Bytes → 43 Zeichen base64url
  // (16 Bytes gehen auch, 32 ist robuster)
  // @ts-ignore
  return Buffer.from(buf).toString("base64url");
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rotate = url.searchParams.get("rotate") === "1";

  let token = req.cookies.get(CSRF_COOKIE)?.value || "";
  if (!token || rotate) token = genToken(32);

  const res = new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });

  if (!req.cookies.get(CSRF_COOKIE)?.value || rotate) {
    res.cookies.set(CSRF_COOKIE, token, {
      httpOnly: true,   // <-- httpOnly bleibt AN (Client liest Header, nicht Cookie)
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12, // 12h
    });
  }

  // Client kann den Token aus dem Header ziehen
  res.headers.set(CSRF_HEADER, token);
  return res;
}

export async function HEAD() {
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
