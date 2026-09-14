import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import { createFundingPortalToken, verifyFundingPortalToken } from "../src/lib/fundingPortalToken";
import { fundingUpdateFromStripeEvent, parseStripeEvent, publicFundingStatus, verifyStripeSignature } from "../src/lib/stripeFunding";

const META = { purpose: "voluntary_support", political_voice_weight: "none", locale: "de", attempt_id: "550e8400-e29b-41d4-a716-446655440000", support_level: "funding", edebatte_entitlement: "pro" };

describe("Stripe funding webhook contract", () => {
  it("verifies only a current signature over the unmodified raw body", () => {
    const payload = '{"id":"evt_signature_test","data":{"object":{}}}';
    const timestamp = 1_800_000_000;
    const secret = "whsec_test_secret";
    const signature = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
    expect(verifyStripeSignature(payload, `t=${timestamp},v1=${signature}`, secret, timestamp)).toBe(true);
    expect(verifyStripeSignature(`${payload} `, `t=${timestamp},v1=${signature}`, secret, timestamp)).toBe(false);
    expect(verifyStripeSignature(payload, `t=${timestamp - 301},v1=${signature}`, secret, timestamp)).toBe(false);
  });

  it("accepts only VoiceOpenGov support events and maps paid checkout safely", () => {
    const payload = JSON.stringify({ id: "evt_checkout_paid_123", type: "checkout.session.completed", created: 1_800_000_000, data: { object: { id: "cs_test_checkout123456", mode: "subscription", payment_status: "paid", amount_total: 2500, currency: "eur", customer: "cus_customer123456", subscription: "sub_subscription123456", metadata: META } } });
    const event = parseStripeEvent(payload)!;
    const update = fundingUpdateFromStripeEvent(event)!;
    expect(update.status).toBe("succeeded");
    expect(update.cadence).toBe("recurring");
    expect(update.attemptId).toBe(META.attempt_id);
    expect(update.supportLevel).toBe("funding");
    expect(update.edebatteEntitlement).toBe("pro");
    expect(fundingUpdateFromStripeEvent({ ...event, data: { object: { ...event.data.object, metadata: {} } } })).toBeNull();
  });

  it("does not present an unpaid Checkout Session as successful", () => {
    expect(publicFundingStatus({ id: "cs_test_checkout123456", payment_status: "unpaid", status: "open", mode: "payment", metadata: META })?.status).toBe("pending");
    expect(publicFundingStatus({ id: "cs_test_checkout123456", payment_status: "paid", status: "complete", mode: "payment", metadata: META })?.status).toBe("succeeded");
  });

  it("binds short-lived portal access to the Stripe customer and checkout session", () => {
    const secret = "a-secure-support-session-secret";
    const token = createFundingPortalToken("cus_customer123456", "cs_test_checkout123456", secret, 1_000);
    expect(verifyFundingPortalToken(token, secret, 2_000)?.customerId).toBe("cus_customer123456");
    expect(verifyFundingPortalToken(token, "wrong-secret", 2_000)).toBeNull();
    expect(verifyFundingPortalToken(token, secret, 1_000 + 16 * 60 * 1000)).toBeNull();
  });
});
