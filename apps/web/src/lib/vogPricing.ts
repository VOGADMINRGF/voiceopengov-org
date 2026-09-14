import type { FundingCadence } from "@/lib/fundingCheckout";

export const VOG_SUPPORTING_MONTHLY_CENTS = 499;
export const VOG_FUNDING_MONTHLY_CENTS = 1_500;
export const VOG_SUPPORTING_ANNUAL_CENTS = VOG_SUPPORTING_MONTHLY_CENTS * 12;
export const VOG_FUNDING_ANNUAL_CENTS = VOG_FUNDING_MONTHLY_CENTS * 12;

export type VogSupportLevel = "one_time" | "supporting" | "funding";
export type EDebatteEntitlement = "none" | "plus" | "pro";

export type VogSupportClassification = {
  level: VogSupportLevel;
  edebatteEntitlement: EDebatteEntitlement;
  monthlyEquivalentCents?: number;
};

export function classifyVogSupport(amountCents: number, cadence: FundingCadence): VogSupportClassification {
  if (cadence === "one_time") {
    return { level: "one_time", edebatteEntitlement: "none" };
  }

  const monthlyEquivalentCents = cadence === "annual" ? Math.floor(amountCents / 12) : amountCents;
  if (monthlyEquivalentCents >= VOG_FUNDING_MONTHLY_CENTS) {
    return { level: "funding", edebatteEntitlement: "pro", monthlyEquivalentCents };
  }
  if (monthlyEquivalentCents >= VOG_SUPPORTING_MONTHLY_CENTS) {
    return { level: "supporting", edebatteEntitlement: "plus", monthlyEquivalentCents };
  }
  return { level: "one_time", edebatteEntitlement: "none", monthlyEquivalentCents };
}

export function fundingPresets(cadence: FundingCadence) {
  if (cadence === "monthly") return [4.99, 15, 25, 50];
  if (cadence === "annual") return [59.88, 180, 300, 600];
  return [4.99, 25, 50, 100];
}
