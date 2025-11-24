// features/user/engagement.ts

export const XP_PER_SWIPE = 1;
export const SWIPES_PER_CONTRIBUTION_CREDIT = 100;

export type EngagementLevel =
  | "interessiert"
  | "engagiert"
  | "begeistert"
  | "brennend"
  | "inspirierend"
  | "leuchtend";

type Threshold = { minXp: number; level: EngagementLevel };

const LEVEL_THRESHOLDS: Threshold[] = [
  { minXp: 50_000, level: "leuchtend" },
  { minXp: 15_000, level: "inspirierend" },
  { minXp: 5_000, level: "brennend" },
  { minXp: 1_500, level: "begeistert" },
  { minXp: 250, level: "engagiert" },
  { minXp: 0, level: "interessiert" },
];

export function getEngagementLevel(xp: number): EngagementLevel {
  const safeXp = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
  const match = LEVEL_THRESHOLDS.find((entry) => safeXp >= entry.minXp);
  return match?.level ?? "interessiert";
}

export function swipesUntilNextCredit(totalSwipes: number): number {
  const safeTotal = Number.isFinite(totalSwipes) ? Math.max(0, Math.floor(totalSwipes)) : 0;
  const remainder = safeTotal % SWIPES_PER_CONTRIBUTION_CREDIT;
  if (remainder === 0) {
    return SWIPES_PER_CONTRIBUTION_CREDIT;
  }
  return SWIPES_PER_CONTRIBUTION_CREDIT - remainder;
}
