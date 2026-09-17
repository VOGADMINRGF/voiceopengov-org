import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
}

describe("public SEO/search contract", () => {
  it("describes VoiceOpenGov by its current civic and regional role", () => {
    const layout = source("app/layout.tsx");
    expect(layout).toContain("Bürgerbeteiligung & regionale Repräsentation");
    expect(layout).toContain("regional political representation");
    expect(layout).toContain('card: "summary"');
    expect(layout).not.toContain("Internationale Initiative & Community");
  });

  it("keeps sitemap canonical and free of redirects or synthetic freshness", () => {
    const sitemap = source("app/sitemap.ts");
    expect(sitemap).not.toContain('"/mitmachen/rollen"');
    expect(sitemap).not.toContain("lastModified");
    expect(sitemap).not.toContain("changeFrequency");
    expect(sitemap).not.toContain("priority:");
    expect(sitemap).toContain('"/mitmachen"');
    expect(sitemap).toContain('"/regionen"');
    expect(sitemap).toContain('"/unterstuetzen"');
  });

  it("gives /mitmachen dedicated canonical and social metadata", () => {
    const join = source("app/mitmachen/page.tsx");
    expect(join).toContain("localizedCanonicalUrl");
    expect(join).toContain("localeAlternates");
    expect(join).toContain("regional eDebatte × VoiceOpenGov presence");
    expect(join).toContain("openGraph");
    expect(join).toContain("twitter");
  });

  it("links regional acquisition directly to the canonical /mitmachen anchor", () => {
    const regions = source("app/regionen/page.tsx");
    expect(regions).toContain('new URL("/mitmachen", VOICEOPENGOV_URL)');
    expect(regions).toContain("#vor-ort");
    expect(regions).not.toContain('href={href("/vor-ort", locale)}');
  });
});
