import { membersCol } from "@/lib/vogMongo";
import { getTextDirection } from "@/config/locales";
import { getDoiCopy, hashDoiToken, resolveDoiLocale } from "@/lib/membershipDoi";
import { VOG_SUPPORT_URL } from "@/config/links";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderPage(opts: { locale: ReturnType<typeof resolveDoiLocale>; title: string; message: string; ok: boolean; baseUrl: string; resendToken?: string }) {
  const { locale, title, message, ok, baseUrl, resendToken } = opts;
  const copy = getDoiCopy(locale);
  const direction = getTextDirection(locale);
  const statusColor = ok ? "#1a8cff" : "#ef4444";
  const resendForm = resendToken ? `<form method="post" action="/api/members/resend" style="margin-top:18px"><input type="hidden" name="token" value="${escapeHtml(resendToken)}"><input type="hidden" name="lang" value="${locale}"><button type="submit" style="border:0;border-radius:999px;background:#1a8cff;color:#fff;padding:10px 16px;font-weight:700;cursor:pointer">${copy.resend}</button></form>` : "";
  const html = `<!doctype html><html lang="${locale}" dir="${direction}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)}</title></head><body style="margin:0;font-family:Segoe UI,Arial,sans-serif;background:#f1f5f9;color:#0f172a"><main style="max-width:680px;margin:40px auto;padding:0 20px"><section style="border-radius:20px;background:#fff;padding:28px;box-shadow:0 20px 50px rgba(15,23,42,.08)"><div style="height:6px;border-radius:999px;background:linear-gradient(90deg,#18cfc8,#1a8cff);margin-bottom:18px"></div><h1>${escapeHtml(title)}</h1><p style="color:#475569;line-height:1.6">${escapeHtml(message)}</p><span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${statusColor};color:#fff;font-size:12px;font-weight:700">${ok ? copy.statusConfirmed : copy.statusNotConfirmed}</span>${resendForm}<p style="margin-top:20px;padding:12px;border:1px solid #18cfc8;border-radius:10px;font-size:13px">${copy.noInfluence}</p><nav style="margin-top:18px;display:flex;flex-wrap:wrap;gap:10px"><a href="${baseUrl}/?lang=${locale}" style="color:#1a8cff">${copy.home}</a><a href="${VOG_SUPPORT_URL}" style="color:#1a8cff">${copy.support}</a><a href="${baseUrl}/kontakt?lang=${locale}" style="color:#1a8cff">${copy.questions}</a></nav></section></main></body></html>`;
  return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "referrer-policy": "no-referrer" } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const locale = resolveDoiLocale(url.searchParams.get("lang"));
  const copy = getDoiCopy(locale);
  const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  if (!token) return renderPage({ locale, title: copy.missingTitle, message: copy.missingMessage, ok: false, baseUrl });

  const col = await membersCol();
  const tokenHash = hashDoiToken(token);
  const member = await col.findOne({ $or: [{ doiTokenHash: tokenHash }, { doiToken: token }] });
  if (!member) return renderPage({ locale, title: copy.invalidTitle, message: copy.invalidMessage, ok: false, baseUrl });
  const memberLocale = resolveDoiLocale(member.locale || locale);
  const memberCopy = getDoiCopy(memberLocale);
  if (member.doiExpiresAt && member.doiExpiresAt < new Date()) return renderPage({ locale: memberLocale, title: memberCopy.expiredTitle, message: memberCopy.expiredMessage, ok: false, baseUrl, resendToken: token });

  const now = new Date();
  const result = await col.updateOne(
    { _id: member._id, status: "pending", $or: [{ doiTokenHash: tokenHash }, { doiToken: token }] },
    { $set: { status: "active", confirmedAt: now, updatedAt: now }, $unset: { doiToken: "", doiTokenHash: "", doiExpiresAt: "" } },
  );
  if (result.modifiedCount !== 1) return renderPage({ locale: memberLocale, title: memberCopy.invalidTitle, message: memberCopy.invalidMessage, ok: false, baseUrl });
  return renderPage({ locale: memberLocale, title: memberCopy.confirmedTitle, message: memberCopy.confirmedMessage, ok: true, baseUrl });
}
