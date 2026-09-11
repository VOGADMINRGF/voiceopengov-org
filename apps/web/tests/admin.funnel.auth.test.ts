import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../src/middleware";

afterEach(() => {
  delete process.env.VOG_ADMIN_USER;
  delete process.env.VOG_ADMIN_PASSWORD;
});

describe("growth dashboard authentication", () => {
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
    expect(denied.headers.get("www-authenticate")).toContain("VoiceOpenGov Growth");

    const allowed = await middleware(new NextRequest("https://voiceopengov.org/admin/growth", {
      headers: { authorization: `Basic ${btoa("growth-admin:a-long-random-password")}` },
    }));
    expect(allowed.status).toBe(200);
  });
});
