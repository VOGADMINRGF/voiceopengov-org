import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../src/middleware";

afterEach(() => {
  delete process.env.VOG_ADMIN_USER;
  delete process.env.VOG_ADMIN_PASSWORD;
});

describe("admin authentication boundary", () => {
  it("fails closed when credentials are not configured", async () => {
    const response = await middleware(new NextRequest("https://voiceopengov.org/admin/growth"));
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("challenges invalid credentials and accepts exact credentials", async () => {
    process.env.VOG_ADMIN_USER = "growth-admin";
    process.env.VOG_ADMIN_PASSWORD = "a-long-random-password";
    const denied = await middleware(new NextRequest("https://voiceopengov.org/api/admin/funnel", {
      headers: { authorization: `Basic ${btoa("growth-admin:wrong")}` },
    }));
    expect(denied.status).toBe(401);
    expect(denied.headers.get("www-authenticate")).toContain("VoiceOpenGov Admin");

    const allowed = await middleware(new NextRequest("https://voiceopengov.org/admin/growth", {
      headers: { authorization: `Basic ${btoa("growth-admin:a-long-random-password")}` },
    }));
    expect(allowed.status).toBe(200);
  });

  it("protects every admin API alias without capturing lookalike public paths", async () => {
    process.env.VOG_ADMIN_USER = "growth-admin";
    process.env.VOG_ADMIN_PASSWORD = "a-long-random-password";
    const analytics = await middleware(new NextRequest("https://voiceopengov.org/api/admin/analytics/summary"));
    expect(analytics.status).toBe(401);

    const futureAdminRoute = await middleware(new NextRequest("https://voiceopengov.org/api/admin/newsletter/outbox"));
    expect(futureAdminRoute.status).toBe(401);

    const publicLookalike = await middleware(new NextRequest("https://voiceopengov.org/api/administrator-info"));
    expect(publicLookalike.status).toBe(200);
  });
});
