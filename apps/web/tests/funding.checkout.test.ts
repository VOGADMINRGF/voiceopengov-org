import { describe, expect, it } from "vitest";
import { buildStripeCheckoutBody, fundingIdempotencyKey, parseFundingRequest } from "../src/lib/fundingCheckout";
import { classifyVogSupport } from "../src/lib/vogPricing";

const VALID = { amountCents: 2500, cadence: "monthly", locale: "de", attemptId: "550e8400-e29b-41d4-a716-446655440000", termsAccepted: true } as const;

describe("international funding checkout", () => {
  it("rejects invalid amounts, cadence and missing consent", () => {
    expect(parseFundingRequest({ ...VALID, amountCents: 498 })).toBeNull();
    expect(parseFundingRequest({ ...VALID, amountCents: 499 })).not.toBeNull();
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
    expect(body.get("subscription_data[metadata][support_level]")).toBe("funding");
    expect(body.get("subscription_data[metadata][edebatte_entitlement]")).toBe("pro");
    expect(body.get("success_url")).toContain("{CHECKOUT_SESSION_ID}");
    expect(body.get("custom_text[submit][message]")).toContain("Stimmgewicht");
  });

  it("maps recurring VOG thresholds to eDebatte without buying political rights", () => {
    expect(classifyVogSupport(499, "monthly")).toMatchObject({ level: "supporting", edebatteEntitlement: "plus" });
    expect(classifyVogSupport(1500, "monthly")).toMatchObject({ level: "funding", edebatteEntitlement: "pro" });
    expect(classifyVogSupport(5_988, "annual")).toMatchObject({ level: "supporting", edebatteEntitlement: "plus" });
    expect(classifyVogSupport(18_000, "annual")).toMatchObject({ level: "funding", edebatteEntitlement: "pro" });
    expect(classifyVogSupport(10_000, "one_time")).toMatchObject({ level: "one_time", edebatteEntitlement: "none" });
  });

  it("uses a deterministic request-specific idempotency key", () => {
    const parsed = parseFundingRequest(VALID)!;
    expect(fundingIdempotencyKey(parsed)).toBe(fundingIdempotencyKey(parsed));
    expect(fundingIdempotencyKey({ ...parsed, amountCents: 5000 })).not.toBe(fundingIdempotencyKey(parsed));
  });
});
