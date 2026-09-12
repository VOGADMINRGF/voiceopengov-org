import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isSupportedLocale } from "@/config/locales";
import { recordFunnelEvent } from "@/lib/funnelEvents";
import {
  buildStripeCheckoutBody,
  fundingIdempotencyKey,
  parseFundingRequest,
  resolvePublicBaseUrl,
} from "@/lib/fundingCheckout";
import { readSecret } from "@/lib/runtimeSecrets";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
const RATE_LIMIT = { limit: 8, windowMs: 15 * 60 * 1000 };

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const limited = await rateLimitFromRequest(request, RATE_LIMIT.limit, RATE_LIMIT.windowMs, { scope: "funding-checkout" });
  if (!limited.ok) {
    return NextResponse.json({ ok: false, requestId, error: "rate_limited" }, { status: 429, headers: rateLimitHeaders(limited) });
  }

  const input = parseFundingRequest(await request.json().catch(() => null));
  if (!input || !isSupportedLocale(input.locale)) {
    return NextResponse.json({ ok: false, requestId, error: "invalid_request" }, { status: 400 });
  }
  const secret = readSecret("STRIPE_SECRET_KEY");
  if (!secret) {
    return NextResponse.json({ ok: false, requestId, error: "checkout_unavailable" }, { status: 503 });
  }

  try {
    const baseUrl = resolvePublicBaseUrl(
      process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL,
      request.nextUrl.origin,
    );
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": fundingIdempotencyKey(input),
      },
      body: buildStripeCheckoutBody(input, baseUrl),
      cache: "no-store",
    });
    const session = await response.json().catch(() => null) as { id?: string; url?: string } | null;
    if (!response.ok || !session?.id || !session.url?.startsWith("https://checkout.stripe.com/")) {
      console.error("[funding-checkout] provider rejected request", { requestId, status: response.status });
      return NextResponse.json({ ok: false, requestId, error: "checkout_unavailable" }, { status: 502 });
    }
    await recordFunnelEvent({
      event: "funding_started",
      sessionId: input.attemptId,
      locale: input.locale,
      landingPath: "/unterstuetzen",
    }).catch((error) => console.warn("[funding-checkout] funnel event failed", { requestId, error: String(error) }));
    return NextResponse.json({ ok: true, requestId, url: session.url });
  } catch (error) {
    console.error("[funding-checkout] failed", { requestId, error: String(error) });
    return NextResponse.json({ ok: false, requestId, error: "checkout_unavailable" }, { status: 502 });
  }
}
