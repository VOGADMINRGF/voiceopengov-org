import { funnelEventsCol, type FunnelEventName } from "@/lib/vogMongo";

export const FUNNEL_STAGES: FunnelEventName[] = [
  "landing_viewed",
  "form_started",
  "registration_submitted",
  "doi_sent",
  "membership_confirmed",
  "funding_started",
  "payment_succeeded",
];

export type FunnelBreakdownRow = {
  value: string;
  stages: Record<string, number>;
};

export type FunnelSummary = {
  generatedAt: string;
  since: string;
  totals: Record<string, number>;
  breakdowns: Record<"source" | "campaign" | "country" | "locale", FunnelBreakdownRow[]>;
};

type AggregateRow = { _id: { dimension?: string | null; event: string }; count: number };

function rowsToBreakdown(rows: AggregateRow[]): FunnelBreakdownRow[] {
  const grouped = new Map<string, Record<string, number>>();
  for (const row of rows) {
    const value = row._id.dimension?.trim() || "(direct/unknown)";
    const stages = grouped.get(value) ?? {};
    stages[row._id.event] = row.count;
    grouped.set(value, stages);
  }
  return [...grouped.entries()]
    .map(([value, stages]) => ({ value, stages }))
    .sort((a, b) => (b.stages.landing_viewed ?? b.stages.registration_submitted ?? 0) - (a.stages.landing_viewed ?? a.stages.registration_submitted ?? 0))
    .slice(0, 50);
}

export async function getFunnelSummary(days = 30): Promise<FunnelSummary> {
  const safeDays = Math.max(1, Math.min(90, Math.trunc(days) || 30));
  const sinceDate = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000);
  const col = await funnelEventsCol();
  const totalsRows = await col.aggregate<{ _id: string; count: number }>([
    { $match: { occurredAt: { $gte: sinceDate } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
  ]).toArray();
  const totals = Object.fromEntries(FUNNEL_STAGES.map((stage) => [stage, 0]));
  for (const row of totalsRows) totals[row._id] = row.count;

  const breakdownEntries = await Promise.all(
    (["source", "campaign", "country", "locale"] as const).map(async (dimension) => {
      const rows = await col.aggregate<AggregateRow>([
        { $match: { occurredAt: { $gte: sinceDate } } },
        { $group: { _id: { dimension: `$${dimension}`, event: "$event" }, count: { $sum: 1 } } },
      ]).toArray();
      return [dimension, rowsToBreakdown(rows)] as const;
    }),
  );
  return {
    generatedAt: new Date().toISOString(),
    since: sinceDate.toISOString(),
    totals,
    breakdowns: Object.fromEntries(breakdownEntries) as FunnelSummary["breakdowns"],
  };
}
