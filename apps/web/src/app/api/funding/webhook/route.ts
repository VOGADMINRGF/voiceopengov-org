import { NextRequest, NextResponse } from "next/server";
import { recordFunnelEvent } from "@/lib/funnelEvents";
import { applyFundingProviderUpdate, claimStripeWebhookEvent, failStripeWebhookEvent, finishStripeWebhookEvent } from "@/lib/fundingStore";
import { fundingUpdateFromStripeEvent, parseStripeEvent, verifyStripeSignature } from "@/lib/stripeFunding";
import { readSecret } from "@/lib/runtimeSecrets";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = readSecret("STRIPE_WEBHOOK_SECRET");
  if (!secret) return NextResponse.json({ ok: false, error: "webhook_unconfigured" }, { status: 503 });

  const payload = await request.text();
  if (!verifyStripeSignature(payload, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 400 });
  }
  const event = parseStripeEvent(payload);
  if (!event) return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });

  let claim: Awaited<ReturnType<typeof claimStripeWebhookEvent>>;
  try {
    claim = await claimStripeWebhookEvent(event.id, event.type);
  } catch (error) {
    console.error("[stripe-webhook] storage unavailable", { eventId: event.id, error: String(error) });
    return NextResponse.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
  }
  if (claim === "duplicate") return NextResponse.json({ ok: true, duplicate: true });
  if (claim === "busy") return NextResponse.json({ ok: false, error: "event_in_progress" }, { status: 409 });

  try {
    const update = fundingUpdateFromStripeEvent(event);
    if (update) {
      const applied = await applyFundingProviderUpdate(update);
      if (applied.successRecorded) {
        await recordFunnelEvent({
          event: "payment_succeeded",
          sessionId: update.attemptId || update.checkoutSessionId || update.eventId,
          locale: update.locale,
          landingPath: "/unterstuetzen",
        });
      }
    }
    await finishStripeWebhookEvent(event.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    await failStripeWebhookEvent(event.id, error).catch(() => {});
    console.error("[stripe-webhook] processing failed", { eventId: event.id, error: String(error) });
    return NextResponse.json({ ok: false, error: "processing_failed" }, { status: 500 });
  }
}
