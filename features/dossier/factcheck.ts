import type { DossierClaimStatus, DossierFindingVerdict } from "./schemas";

export function mapOutcomeToClaimStatus(outcome?: string | null): DossierClaimStatus {
  switch (String(outcome ?? "").toUpperCase()) {
    case "LIKELY_TRUE":
    case "TRUE":
    case "SUPPORTS":
      return "supported";
    case "LIKELY_FALSE":
    case "FALSE":
    case "REFUTES":
      return "refuted";
    case "MIXED":
    case "UNCLEAR":
    case "UNDETERMINED":
    default:
      return "unclear";
  }
}

export function mapOutcomeToFindingVerdict(outcome?: string | null): DossierFindingVerdict {
  switch (String(outcome ?? "").toUpperCase()) {
    case "LIKELY_TRUE":
    case "TRUE":
    case "SUPPORTS":
      return "supports";
    case "LIKELY_FALSE":
    case "FALSE":
    case "REFUTES":
      return "refutes";
    case "MIXED":
      return "mixed";
    case "UNCLEAR":
    case "UNDETERMINED":
    default:
      return "unclear";
  }
}
