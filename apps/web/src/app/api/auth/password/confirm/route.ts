import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { membersCol } from "@/lib/vogMongo";
import {
  consumePasswordSetupToken,
  revokeAllMemberSessions,
  setMemberPassword,
  validateMemberPassword,
} from "@/lib/memberAuth";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 8, windowMs: 30 * 60 * 1000 };
const ConfirmSchema = z.object({
  token: z.string().min(20).max(256),
  password: z.string().min(1).max(128),
});

export async function POST(req: NextRequest) {
  const rate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, {
    scope: "member-password-confirm",
  });
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryIn: rate.retryIn },
      { status: 429, headers: rateLimitHeaders(rate) },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = ConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const passwordValidation = validateMemberPassword(parsed.data.password);
  if ("error" in passwordValidation) {
    return NextResponse.json(
      { ok: false, error: passwordValidation.error },
      { status: 400 },
    );
  }

  const token = await consumePasswordSetupToken(parsed.data.token);
  if (!token || !ObjectId.isValid(token.memberId)) {
    return NextResponse.json({ ok: false, error: "invalid_or_expired_token" }, { status: 400 });
  }

  const members = await membersCol();
  const member = await members.findOne(
    { _id: new ObjectId(token.memberId), status: "active" },
    { projection: { _id: 1, email: 1 } },
  );
  if (!member?._id || !member.email) {
    return NextResponse.json({ ok: false, error: "invalid_or_expired_token" }, { status: 400 });
  }

  await setMemberPassword(String(member._id), member.email, parsed.data.password);
  await revokeAllMemberSessions(String(member._id));
  return NextResponse.json({ ok: true, redirectUrl: "/login" });
}
