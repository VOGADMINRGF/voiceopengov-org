import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const recordFunnelEvent = vi.hoisted(() => vi.fn());

vi.mock("@/lib/funnelEvents", () => ({
  PUBLIC_FUNNEL_EVENTS: new Set(["landing_viewed", "form_started", "funding_started"]),
  recordFunnelEvent,
}));

import { POST } from "../src/app/api/funnel/event/route";

function request(event: string, ip: string) {
  return new NextRequest("http://localhost/api/funnel/event", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ event, landingPath: "/" }),
  });
}

describe("public funnel route resilience", () => {
  beforeEach(() => {
    recordFunnelEvent.mockReset();
  });

  it("keeps invalid or authoritative events out of the public endpoint", async () => {
    const response = await POST(request("membership_confirmed", "192.0.2.10"));
    expect(response.status).toBe(400);
    expect(recordFunnelEvent).not.toHaveBeenCalled();
  });

  it("returns accepted only after telemetry was stored", async () => {
    recordFunnelEvent.mockResolvedValueOnce(undefined);
    const response = await POST(request("landing_viewed", "192.0.2.11"));
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, stored: true });
  });

  it("turns Mongo/DNS telemetry outages into a bounded truthful 503", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    recordFunnelEvent.mockRejectedValueOnce(
      Object.assign(new Error("querySrv failed"), { code: "ENOTFOUND" }),
    );

    const response = await POST(request("landing_viewed", "192.0.2.12"));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      stored: false,
      error: "telemetry_unavailable",
    });
    expect(warning).toHaveBeenCalledWith(
      "[funnel-event] telemetry store unavailable",
      { event: "landing_viewed", code: "ENOTFOUND" },
    );
    warning.mockRestore();
  });
});
