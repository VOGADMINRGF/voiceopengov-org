import { NextRequest, NextResponse } from "next/server";
import { isSupportedLocale } from "@/config/locales";
import { verifyFundingPortalToken } from "@/lib/fundingPortalToken";
import { resolvePublicBaseUrl } from "@/lib/fundingCheckout";
import { readSecret } from "@/lib/runtimeSecrets";
import { createStripePortalSession } from "@/lib/stripeApi";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limited = await rateLimitFromRequest(request, 8, 15 * 60 * 1000, { scope: "funding-portal" });
  if (!limited.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429, headers: rateLimitHeaders(limited) });
  const body = await request.json().catch(() => null) as { token?: unknown; locale?: unknown } | null;
  const locale = typeof body?.locale === "string" && isSupportedLocale(body.locale) ? body.locale : "de";
  const stripeSecret = readSecret("STRIPE_SECRET_KEY");
  const portalSecret = readSecret("VOG_SUPPORT_SESSION_SECRET");
  if (!stripeSecret || !portalSecret) return NextResponse.json({ ok: false, error: "portal_unavailable" }, { status: 503 });
  const token = verifyFundingPortalToken(body?.token, portalSecret);
  if (!token) return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 403 });
  try {
    const baseUrl = resolvePublicBaseUrl(process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL, request.nextUrl.origin);
    const portal = await createStripePortalSession(token.customerId, `${baseUrl}/unterstuetzen?lang=${locale}`, stripeSecret);
    if (!portal.url?.startsWith("https://billing.stripe.com/")) throw new Error("invalid_portal_url");
    return NextResponse.json({ ok: true, url: portal.url });
  } catch (error) {
    console.error("[funding-portal] failed", { error: String(error) });
    return NextResponse.json({ ok: false, error: "portal_unavailable" }, { status: 502 });
  }
}
