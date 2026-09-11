import { NextRequest, NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";
import { buildDoiMail, createDoiToken, getDoiCopy, hashDoiToken, resolveDoiLocale } from "@/lib/membershipDoi";
import { sendMail } from "@/lib/mail/sendMail";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
const RATE_LIMIT = { limit: 4, windowMs: 30 * 60 * 1000 };

async function readInput(req: NextRequest) {
  if ((req.headers.get("content-type") || "").includes("application/json")) return (await req.json().catch(() => ({}))) as Record<string, string>;
  const form = await req.formData();
  return { token: String(form.get("token") || ""), lang: String(form.get("lang") || "") };
}

export async function POST(req: NextRequest) {
  const rate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, { scope: "member-doi-resend" });
  if (!rate.ok) return NextResponse.json({ ok: false, error: "rate_limited", retryIn: rate.retryIn }, { status: 429, headers: rateLimitHeaders(rate) });
  const input = await readInput(req);
  const locale = resolveDoiLocale(input.lang);
  const token = typeof input.token === "string" ? input.token : "";
  const col = await membersCol();
  const tokenHash = token ? hashDoiToken(token) : "";
  const member = token ? await col.findOne({ status: "pending", $or: [{ doiTokenHash: tokenHash }, { doiToken: token }] }) : null;
  if (member) {
    const next = createDoiToken();
    const memberLocale = resolveDoiLocale(member.locale || locale);
    const result = await col.updateOne(
      { _id: member._id, status: "pending", $or: [{ doiTokenHash: tokenHash }, { doiToken: token }] },
      { $set: { doiTokenHash: next.tokenHash, doiExpiresAt: next.expiresAt, doiSentAt: new Date(), locale: memberLocale, updatedAt: new Date() }, $unset: { doiToken: "" } },
    );
    if (result.modifiedCount === 1) {
      const base = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      await sendMail({ to: member.email, ...buildDoiMail(memberLocale, `${base}/api/members/confirm?token=${next.token}&lang=${memberLocale}`) });
    }
  }
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    const base = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${base}/?lang=${locale}&doi=resent`, 303);
  }
  return NextResponse.json({ ok: true, message: getDoiCopy(locale).resentMessage });
}
