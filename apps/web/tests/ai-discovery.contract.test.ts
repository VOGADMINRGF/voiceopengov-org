import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("AI/search machine-readable contract", () => {
  it("keeps llms.txt aligned with VoiceOpenGov-owned governance", () => {
    const llms = read("public/llms.txt");

    for (const marker of [
      "VoiceOpenGov decides its own program state under its own published governance rules.",
      "an eDebatte result does not automatically become a VoiceOpenGov position",
      "An eDebatte snapshot is evidence / participation context, not the authority that silently creates a VoiceOpenGov position.",
      "Personal Vote4Gov theses are not automatically VoiceOpenGov positions.",
    ]) {
      expect(llms).toContain(marker);
    }

    for (const retired of [
      "A valid eDebatte result is binding for VoiceOpenGov representation",
      "valid eDebatte majority decisions",
      "the valid majority decision becomes the VoiceOpenGov representation mandate",
      "VoiceOpenGov explicitly commits its political representation to valid eDebatte decisions",
    ]) {
      expect(llms).not.toContain(retired);
    }
  });

  it("keeps multilingual search metadata on the same governance truth", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain("eigener demokratischer Willensbildung");
    expect(layout).toContain("its own democratic will-formation");
    expect(layout).toContain("formation démocratique de sa propre volonté");
    expect(layout).toContain("formación democrática de su propia voluntad");
    expect(layout).toContain("kendi demokratik irade oluşumunu");
    expect(layout).toContain("إرادتها الديمقراطية الخاصة");
    expect(layout).not.toContain("represent valid majorities");
    expect(layout).not.toContain("majorités représentées");
  });

  it("explicitly allows OAI-SearchBot while keeping APIs out of crawl scope", () => {
    const robots = read("src/app/robots.ts");
    expect(robots).toContain('userAgent: "OAI-SearchBot"');
    expect(robots).toContain('disallow: ["/api/"]');
    expect(robots).toContain('sitemap: `${VOICEOPENGOV_URL}/sitemap.xml`');
  });

  it("keeps canonical ecosystem hosts aligned", () => {
    const links = read("src/config/links.ts");
    expect(links).toContain('export const EDEBATTE_CANONICAL_URL = "https://www.edebatte.org";');
    expect(links).toContain('export const VOTE4GOV_CANONICAL_URL = "https://www.vote4gov.eu";');
    expect(links).not.toContain('VOTE4GOV_CANONICAL_URL = "https://vote4gov.eu"');
  });

  it("submits IndexNow only after the exact Vercel production status succeeds", () => {
    const indexNow = read("scripts/submit-indexnow-after-vercel.mjs");
    const key = read("public/b9e75cf96bbd019de7be3f11b46bd928.txt").trim();
    expect(key).toBe("b9e75cf96bbd019de7be3f11b46bd928");
    expect(indexNow).toContain('const site = "https://www.voiceopengov.org"');
    expect(indexNow).toContain('status.context === "Vercel"');
    expect(indexNow).toContain('if (vercelState !== "success")');
    expect(indexNow).toContain("production domain does not yet expose the verification key");
    expect(indexNow).toContain('`${site}/sitemap.xml?indexnow=${encodeURIComponent(sha)}`');
    expect(indexNow).toContain("https://api.indexnow.org/indexnow");
  });
});
