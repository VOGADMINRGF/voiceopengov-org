import { describe, expect, it } from "vitest";
import { buildFunnelEvent, hashFunnelSession, PUBLIC_FUNNEL_EVENTS } from "../src/lib/funnelEvents";

describe("privacy-preserving funnel events", () => {
  it("hashes valid session IDs and rejects short identifiers", () => {
    expect(hashFunnelSession("550e8400-e29b-41d4-a716-446655440000")).toMatch(/^[a-f0-9]{64}$/);
    expect(hashFunnelSession("too-short")).toBeUndefined();
  });

  it("normalizes dimensions and expires raw events after 90 days", () => {
    const now = new Date("2026-09-11T00:00:00.000Z");
    const event = buildFunnelEvent({
      event: "form_started",
      sessionId: "550e8400-e29b-41d4-a716-446655440000",
      country: "de",
      locale: "DE",
      source: " newsletter\n",
    }, now);
    expect(event.country).toBe("DE");
    expect(event.locale).toBe("de");
    expect(event.source).toBe("newsletter");
    expect(event.expiresAt.toISOString()).toBe("2026-12-10T00:00:00.000Z");
    expect(event).not.toHaveProperty("email");
    expect(event).not.toHaveProperty("ip");
  });

  it("does not expose authoritative server events to the public endpoint", () => {
    expect(PUBLIC_FUNNEL_EVENTS.has("landing_viewed")).toBe(true);
    expect(PUBLIC_FUNNEL_EVENTS.has("membership_confirmed")).toBe(false);
    expect(PUBLIC_FUNNEL_EVENTS.has("payment_succeeded")).toBe(false);
  });
});
