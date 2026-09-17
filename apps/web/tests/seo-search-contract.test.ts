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

  it("keeps visible homepage and footer aligned with the identity and mandate contract", () => {
    const homeClient = source("components/home/HomeClient.tsx");
    const homeCopy = source("components/home/homeRelaunchCopy.ts");
    const footer = source("components/SiteFooter.tsx");

    for (const surface of [homeClient, homeCopy, footer]) {
      expect(surface).not.toContain("Internationale Initiative & Community");
      expect(surface).not.toContain("International initiative & community");
    }

    expect(homeCopy).toContain("politische Bürger- und Mitgliederbewegung im Aufbau");
    expect(homeCopy).toContain("gültig abgeschlossenes eDebatte-Ergebnis");
    expect(homeCopy).toContain("bindenden Repräsentationsauftrag");
    expect(homeCopy).toContain("eDebatte bleibt der unabhängige Evidenz-, Beteiligungs- und Entscheidungsraum");
    expect(homeCopy).not.toContain("sie entscheidet nicht automatisch für VoiceOpenGov");
    expect(homeCopy).not.toContain("VoiceOpenGov entscheidet seinen eigenen Programmstand nach den eigenen Governance-Regeln");
    expect(homeClient).toContain('from "./homeRelaunchCopy"');

    expect(footer).toContain("Bürgerbewegung & regionale Repräsentation");
    expect(footer).toContain("Persönliche öffentliche Stimme");
    expect(footer).toContain("nicht automatisch eine VoiceOpenGov-Position");
  });

  it("keeps ecosystem canonical hosts aligned with their own sites", () => {
    const links = source("config/links.ts");
    expect(links).toContain('EDEBATTE_CANONICAL_URL = "https://www.edebatte.org"');
    expect(links).toContain('VOTE4GOV_CANONICAL_URL = "https://www.vote4gov.eu"');
    expect(links).not.toContain('VOTE4GOV_CANONICAL_URL = "https://vote4gov.eu"');
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

  it("gives questions, transparency and support distinct search identities", () => {
    const questions = source("app/fragen/layout.tsx");
    const transparency = source("app/transparenz/page.tsx");
    const support = source("app/unterstuetzen/page.tsx");
    for (const page of [questions, transparency, support]) {
      expect(page).toContain("localizedCanonicalUrl");
      expect(page).toContain("localeAlternates");
      expect(page).toContain("openGraph");
      expect(page).toContain("twitter");
    }
    expect(questions).toContain("50 Kernfragen: dynamischer Programmstand");
    expect(transparency).toContain("Transparenz bei VoiceOpenGov");
    expect(support).toContain("Beiträge kaufen kein Stimmgewicht");
  });

  it("links regional acquisition directly to the canonical /mitmachen anchor", () => {
    const regions = source("app/regionen/page.tsx");
    expect(regions).toContain('new URL("/mitmachen", VOICEOPENGOV_URL)');
    expect(regions).toContain("#vor-ort");
    expect(regions).not.toContain('href={href("/vor-ort", locale)}');
    expect(regions).not.toContain("{copy.principle}");
  });
});
