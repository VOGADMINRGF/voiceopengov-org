// E150 Part03 – VOG-Mitgliedsrabatt für eDebatte-Produkte
// Preise werden auf Cents gerundet, um Brüche in Zahlungsflüssen zu vermeiden.
export function applyVogMembershipDiscount(
  priceCents: number,
  hasVogMembership: boolean,
): number {
  if (!hasVogMembership) return priceCents;
  const normalized = Number.isFinite(priceCents) ? priceCents : 0;
  if (normalized <= 0) return normalized;
  return Math.round(normalized * 0.75);
}

export type PricingContext = {
  hasVogMembership: boolean;
};
