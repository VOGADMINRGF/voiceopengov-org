import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  GERMAN_STATE_REGIONS,
  getGermanStateRegion,
} from "@/content/regionalStates";
import { REGIONAL_INTEREST_SOURCE_PATH } from "@/lib/regionalInterestContract";

function source(path: string) {
  return readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
}

describe("regional community page contract", () => {
  it("defines all 16 German states once with unique stable slugs", () => {
    expect(GERMAN_STATE_REGIONS).toHaveLength(16);
    expect(new Set(GERMAN_STATE_REGIONS.map((region) => region.slug)).size).toBe(16);
    expect(getGermanStateRegion("berlin")?.name).toBe("Berlin");
    expect(getGermanStateRegion("brandenburg")?.name).toBe("Brandenburg");
  });

  it("fails honest while regional community structures are still being built", () => {
    expect(GERMAN_STATE_REGIONS.every((region) => region.communityStatus === "building")).toBe(true);
    expect(GERMAN_STATE_REGIONS.filter((region) => region.searchVisibility === "index").map((region) => region.slug)).toEqual(["berlin"]);
    expect(GERMAN_STATE_REGIONS.filter((region) => region.searchVisibility === "noindex")).toHaveLength(15);
  });

  it("keeps thin build-state entries out of the sitemap while retaining Berlin", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith("/regionen/deutschland/berlin"))).toBe(true);

    for (const region of GERMAN_STATE_REGIONS.filter((entry) => entry.searchVisibility === "noindex")) {
      expect(urls.some((url) => url.endsWith(`/regionen/deutschland/${region.slug}`))).toBe(false);
    }
  });

  it("routes regional activation and evidence work through the canonical handoffs", () => {
    const genericPage = source("app/regionen/deutschland/[slug]/page.tsx");
    const germanyPage = source("app/regionen/deutschland/page.tsx");

    expect(REGIONAL_INTEREST_SOURCE_PATH).toBe("/vor-ort");
    expect(genericPage).toContain("REGIONAL_INTEREST_SOURCE_PATH");
    expect(germanyPage).toContain("REGIONAL_INTEREST_SOURCE_PATH");
    expect(genericPage).toContain('localHref("/go/edebatte", locale)');
    expect(genericPage).toContain('index: region.searchVisibility === "index"');
  });

  it("keeps Berlin dedicated and prevents the generic route from claiming it", () => {
    const genericPage = source("app/regionen/deutschland/[slug]/page.tsx");
    const berlinPage = source("app/regionen/deutschland/berlin/page.tsx");

    expect(genericPage).toContain('region.slug !== "berlin"');
    expect(genericPage).toContain('region.slug === "berlin"');
    expect(berlinPage).toContain("VoiceOpenGov Berlin");
  });
});
