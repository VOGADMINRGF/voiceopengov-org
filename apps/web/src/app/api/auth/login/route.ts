import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { membersCol } from "@/lib/vogMongo";
import {
  createMemberSession,
  MEMBER_SESSION_COOKIE,
  MEMBER_SESSION_MAX_AGE_SECONDS,
  normalizeMemberEmail,
  verifyMemberCredential,
} from "@/lib/memberAuth";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 8, windowMs: 15 * 60 * 1000 };
const LoginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(128),
});

export async function POST(req: NextRequest) {
  const rate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, {
    scope: "member-login",
  });
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryIn: rate.retryIn },
      { status: 429, headers: rateLimitHeaders(rate) },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const email = normalizeMemberEmail(parsed.data.email);
  const verified = await verifyMemberCredential(email, parsed.data.password);
  if (!verified.ok || !ObjectId.isValid(verified.memberId)) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const members = await membersCol();
  const member = await members.findOne(
    { _id: new ObjectId(verified.memberId), email, status: "active" },
    { projection: { _id: 1 } },
  );
  if (!member?._id) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const session = await createMemberSession(String(member._id));
  const response = NextResponse.json({ ok: true, redirectUrl: "/konto" });
  response.cookies.set({
    name: MEMBER_SESSION_COOKIE,
    value: session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MEMBER_SESSION_MAX_AGE_SECONDS,
  });
  response.headers.set("cache-control", "no-store");
  return response;
}
