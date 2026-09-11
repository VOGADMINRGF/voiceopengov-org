import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_FUNNEL_EVENTS, recordFunnelEvent } from "@/lib/funnelEvents";
import type { FunnelEventName } from "@/lib/vogMongo";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const buckets = new Map<string, { count: number; resetAt: number }>();

function allowed(request: NextRequest): boolean {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  if (!allowed(request)) return NextResponse.json({ ok: false }, { status: 429 });
  const body = await request.json().catch(() => null);
  const event = body?.event as FunnelEventName | undefined;
  if (!event || !PUBLIC_FUNNEL_EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await recordFunnelEvent({
    event,
    sessionId: body.sessionId,
    source: body.source,
    medium: body.medium,
    campaign: body.campaign,
    country: body.country,
    locale: body.locale,
    landingPath: body.landingPath,
  });
  return NextResponse.json({ ok: true }, { status: 202 });
}
