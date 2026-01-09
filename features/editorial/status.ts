import type { EditorialStatus } from "./types";

export const EDITORIAL_STATUS_TRANSITIONS: Record<EditorialStatus, EditorialStatus[]> = {
  triage: ["review", "rejected", "archived"],
  review: ["fact_check", "ready", "rejected", "archived"],
  fact_check: ["ready", "rejected", "archived", "review"],
  ready: ["published", "rejected", "archived", "review"],
  published: ["archived"],
  rejected: ["review", "archived"],
  archived: [],
};

export function canTransition(from: EditorialStatus, to: EditorialStatus): boolean {
  return EDITORIAL_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
