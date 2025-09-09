// core/factcheck/triage.ts
import type { ExtractedUnit } from "@prisma/client";

export function shouldWatchlist(u: Pick<ExtractedUnit, "kind" | "confidence" | "text">): boolean {
  const hotKeywords = [/miete|mietendeckel/i, /wahl|wahlrecht/i, /gesundheit|krankenhaus/i];
  const topical = hotKeywords.some((re) => re.test(u.text));
  return (u.kind === "claim" && u.confidence >= 0.7) || topical;
}

export function mapOutcomeToStatus(outcome: string) {
  switch (outcome) {
    case "LIKELY_TRUE":
      return "VERIFIED";
    case "LIKELY_FALSE":
      return "REFUTED";
    case "MIXED":
      return "MIXED";
    default:
      return "OPEN";
  }
}
