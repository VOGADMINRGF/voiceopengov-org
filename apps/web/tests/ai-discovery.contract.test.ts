import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function readRoot(path: string) {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");
}

describe("AI/search machine-readable contract", () => {
  it("keeps machine truth aligned with the binding eDebatte mandate SSOT", () => {
    const llms = read("public/llms.txt");
    const agents = readRoot("AGENTS.md");
    const readme = readRoot("README.md");

    expect(agents).toContain(
      "VoiceOpenGov is the political representation and implementation layer for valid eDebatte decisions.",
    );
    expect(readme).toContain(
      "Für VoiceOpenGov ist ein nach den geltenden Regeln gültig festgestelltes eDebatte-Ergebnis politisch bindend.",
    );

    for (const marker of [
      "A validly concluded eDebatte decision binds the responsible VoiceOpenGov representation within its defined scope.",
      "Drafts, open processes and informal sentiment do not bind VoiceOpenGov.",
      "A majority percentage describes the defined eligible voting process and rule.",
      "Personal Vote4Gov theses are not automatically VoiceOpenGov positions.",
    ]) {
      expect(llms).toContain(marker);
    }

    for (const contradictory of [
      "An eDebatte result does not automatically become a VoiceOpenGov position.",
      "VoiceOpenGov decides its own program state under its own published governance rules.",
      "adoption, change or rejection follow VoiceOpenGov's own governance rules",
    ]) {
      expect(llms).not.toContain(contradictory);
    }
  });

  it("keeps multilingual search metadata on the same binding governance truth", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain("gültige, nach veröffentlichten Regeln abgeschlossene eDebatte-Entscheidungen");
    expect(layout).toContain("represent valid eDebatte decisions concluded under published rules");
    expect(layout).toContain("les décisions eDebatte valides conclues selon des règles publiées");
    expect(layout).toContain("las decisiones válidas de eDebatte concluidas según reglas publicadas");
    expect(layout).toContain("yayımlanmış kurallara göre geçerli biçimde tamamlanan eDebatte kararlarını");
    expect(layout).toContain("قرارات eDebatte الصحيحة والمكتملة وفق قواعد منشورة");
    expect(layout).not.toContain("its own democratic will-formation");
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
