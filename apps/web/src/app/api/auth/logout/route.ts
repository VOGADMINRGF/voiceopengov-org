import { NextRequest, NextResponse } from "next/server";
import { MEMBER_SESSION_COOKIE, revokeMemberSession } from "@/lib/memberAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  await revokeMemberSession(rawToken);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: MEMBER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("cache-control", "no-store");
  return response;
}
