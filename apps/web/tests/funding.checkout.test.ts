import { describe, expect, it } from "vitest";
import { buildStripeCheckoutBody, fundingIdempotencyKey, parseFundingRequest } from "../src/lib/fundingCheckout";

const VALID = { amountCents: 1500, cadence: "monthly", locale: "de", attemptId: "550e8400-e29b-41d4-a716-446655440000", termsAccepted: true } as const;

describe("international funding checkout", () => {
  it("enforces the 15 EUR monthly/one-time floor and annual 12x equivalent", () => {
    expect(parseFundingRequest({ ...VALID, amountCents: 1500, cadence: "monthly" })).not.toBeNull();
    expect(parseFundingRequest({ ...VALID, amountCents: 1499, cadence: "monthly" })).toBeNull();
    expect(parseFundingRequest({ ...VALID, amountCents: 1500, cadence: "one_time" })).not.toBeNull();
    expect(parseFundingRequest({ ...VALID, amountCents: 1499, cadence: "one_time" })).toBeNull();
    expect(parseFundingRequest({ ...VALID, amountCents: 18000, cadence: "annual" })).not.toBeNull();
    expect(parseFundingRequest({ ...VALID, amountCents: 17999, cadence: "annual" })).toBeNull();
    expect(parseFundingRequest({ ...VALID, cadence: "weekly" })).toBeNull();
    expect(parseFundingRequest({ ...VALID, termsAccepted: false })).toBeNull();
  });

  it("builds recurring checkout without political entitlements", () => {
    const parsed = parseFundingRequest(VALID)!;
    const body = buildStripeCheckoutBody(parsed, "https://www.voiceopengov.org");
    expect(body.get("mode")).toBe("subscription");
    expect(body.get("line_items[0][price_data][recurring][interval]")).toBe("month");
    expect(body.get("metadata[political_voice_weight]")).toBe("none");
    expect(body.get("subscription_data[metadata][political_voice_weight]")).toBe("none");
    expect(body.get("subscription_data[metadata][attempt_id]")).toBe(VALID.attemptId);
    expect(body.get("success_url")).toContain("{CHECKOUT_SESSION_ID}");
    expect(body.get("custom_text[submit][message]")).toContain("Stimmgewicht");
  });

  it("builds annual support as a yearly 180 EUR minimum subscription", () => {
    const parsed = parseFundingRequest({ ...VALID, amountCents: 18000, cadence: "annual" })!;
    const body = buildStripeCheckoutBody(parsed, "https://www.voiceopengov.org");
    expect(body.get("mode")).toBe("subscription");
    expect(body.get("line_items[0][price_data][recurring][interval]")).toBe("year");
    expect(body.get("line_items[0][price_data][unit_amount]")).toBe("18000");
  });

  it("keeps Stripe Checkout eligible for dynamic payment methods such as PayPal when enabled", () => {
    const parsed = parseFundingRequest(VALID)!;
    const body = buildStripeCheckoutBody(parsed, "https://www.voiceopengov.org");
    expect(body.has("payment_method_types")).toBe(false);
    expect([...body.keys()].some((key) => key.startsWith("payment_method_types["))).toBe(false);
  });

  it("uses a deterministic request-specific idempotency key", () => {
    const parsed = parseFundingRequest(VALID)!;
    expect(fundingIdempotencyKey(parsed)).toBe(fundingIdempotencyKey(parsed));
    expect(fundingIdempotencyKey({ ...parsed, amountCents: 5000 })).not.toBe(fundingIdempotencyKey(parsed));
  });
});
