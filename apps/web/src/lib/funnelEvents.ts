import { createHash } from "crypto";
import {
  funnelEventsCol,
  type FunnelEventDoc,
  type FunnelEventName,
} from "@/lib/vogMongo";

const RETENTION_DAYS = 90;
const MAX_VALUE_LENGTH = 120;

export const PUBLIC_FUNNEL_EVENTS = new Set<FunnelEventName>([
  "landing_viewed",
  "form_started",
  "funding_started",
]);

function clean(value: unknown, max = MAX_VALUE_LENGTH): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = [...value.trim()]
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join("");
  return normalized ? normalized.slice(0, max) : undefined;
}

export function hashFunnelSession(value: unknown): string | undefined {
  const session = clean(value, 80);
  if (!session || !/^[A-Za-z0-9_-]{16,80}$/.test(session)) return undefined;
  return createHash("sha256").update(session).digest("hex");
}

export type FunnelEventInput = {
  event: FunnelEventName;
  sessionId?: unknown;
  memberId?: unknown;
  source?: unknown;
  medium?: unknown;
  campaign?: unknown;
  country?: unknown;
  locale?: unknown;
  landingPath?: unknown;
};

export function buildFunnelEvent(input: FunnelEventInput, now = new Date()): FunnelEventDoc {
  return {
    event: input.event,
    occurredAt: now,
    expiresAt: new Date(now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000),
    sessionHash: hashFunnelSession(input.sessionId),
    memberId: clean(input.memberId, 80),
    source: clean(input.source),
    medium: clean(input.medium),
    campaign: clean(input.campaign),
    country: clean(input.country, 8)?.toUpperCase(),
    locale: clean(input.locale, 8)?.toLowerCase(),
    landingPath: clean(input.landingPath, 240),
  };
}

export async function recordFunnelEvent(input: FunnelEventInput): Promise<void> {
  const col = await funnelEventsCol();
  await col.insertOne(buildFunnelEvent(input));
}
