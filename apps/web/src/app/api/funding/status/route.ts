import { NextRequest, NextResponse } from "next/server";
import { createFundingPortalToken } from "@/lib/fundingPortalToken";
import { readSecret } from "@/lib/runtimeSecrets";
import { retrieveStripeCheckoutSession } from "@/lib/stripeApi";
import { isCheckoutSessionId, publicFundingStatus } from "@/lib/stripeFunding";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limited = await rateLimitFromRequest(request, 20, 15 * 60 * 1000, { scope: "funding-status" });
  if (!limited.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429, headers: rateLimitHeaders(limited) });
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!isCheckoutSessionId(sessionId)) return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 400 });
  const stripeSecret = readSecret("STRIPE_SECRET_KEY");
  const portalSecret = readSecret("VOG_SUPPORT_SESSION_SECRET");
  if (!stripeSecret || !portalSecret) return NextResponse.json({ ok: false, error: "status_unavailable" }, { status: 503 });
  try {
    const session = await retrieveStripeCheckoutSession(sessionId, stripeSecret);
    const status = publicFundingStatus(session);
    if (!status) return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 404 });
    const manageToken = status.customerId && status.status === "succeeded"
      ? createFundingPortalToken(status.customerId, status.checkoutSessionId, portalSecret)
      : undefined;
    return NextResponse.json({ ok: true, status: status.status, amountCents: status.amountCents, currency: status.currency, cadence: status.cadence, canManage: Boolean(manageToken), manageToken });
  } catch (error) {
    console.error("[funding-status] provider lookup failed", { error: String(error) });
    return NextResponse.json({ ok: false, error: "status_unavailable" }, { status: 502 });
  }
}
