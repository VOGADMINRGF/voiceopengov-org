import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("public web hardening contract", () => {
  it("does not load the legacy eDebatte compatibility stylesheet as a second public CSS layer", () => {
    expect(existsSync(new URL("../src/app/head.tsx", import.meta.url))).toBe(false);
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain('import "./globals.css"');
    expect(layout).toContain('import "./brand-ci.css"');
    expect(layout).not.toContain("edebatte-ci.css");
  });

  it("keeps the low-risk response security header baseline enabled", () => {
    const nextConfig = read("next.config.ts");
    expect(nextConfig).toContain('key: "X-Content-Type-Options", value: "nosniff"');
    expect(nextConfig).toContain('key: "Referrer-Policy", value: "strict-origin-when-cross-origin"');
    expect(nextConfig).toContain('key: "Strict-Transport-Security", value: "max-age=31536000"');
    expect(nextConfig).toContain('source: "/:path*"');
  });

  it("preserves keyboard, reduced-motion and locale-aware document accessibility", () => {
    const globals = read("src/app/globals.css");
    const layout = read("src/app/layout.tsx");

    expect(globals).toContain(":focus-visible");
    expect(globals).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globals).toContain("animation-duration: 0.01ms !important");
    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('id="main-content"');
    expect(layout).toContain("lang={initialLocale}");
    expect(layout).toContain("dir={getTextDirection(initialLocale)}");
  });

  it("stabilizes supporter avatars and announces asynchronous count updates", () => {
    const supporterBanner = read("src/components/home/SupporterBanner.tsx");
    expect(supporterBanner).toContain("width={48}");
    expect(supporterBanner).toContain("height={48}");
    expect(supporterBanner).toContain('loading="lazy"');
    expect(supporterBanner).toContain('decoding="async"');
    expect(supporterBanner).toContain('role="status"');
    expect(supporterBanner).toContain('aria-live="polite"');
  });

  it("keeps the visible homepage on the binding eDebatte representation contract", () => {
    const copy = read("src/components/home/homeRelaunchCopy.ts");
    const client = read("src/components/home/HomeClient.tsx");

    expect(copy).toContain("gültig abgeschlossenes eDebatte-Ergebnis");
    expect(copy).toContain("bindenden Repräsentationsauftrag");
    expect(copy).toContain("An eDebatte decision validly concluded under published rules");
    expect(copy).toContain("binding representation mandate");
    expect(copy).toContain("Entwürfe, laufende Debatten und informelle Stimmungsbilder");
    expect(copy).not.toContain("VoiceOpenGov entscheidet seinen eigenen Programmstand nach den eigenen Governance-Regeln");
    expect(copy).not.toContain("VoiceOpenGov decides its own programme state under its own governance rules");
    expect(copy).not.toContain("it does not automatically decide VoiceOpenGov positions");
    expect(client).not.toContain("HOME_RELAUNCH_COPY: Record");
  });
});
