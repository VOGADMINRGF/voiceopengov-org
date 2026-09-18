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

function errorCode(error: unknown): string {
  if (!error || typeof error !== "object") return "unknown";
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code.slice(0, 40) : "unknown";
}

export async function POST(request: NextRequest) {
  if (!allowed(request)) return NextResponse.json({ ok: false }, { status: 429 });
  const body = await request.json().catch(() => null);
  const event = body?.event as FunnelEventName | undefined;
  if (!event || !PUBLIC_FUNNEL_EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
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
  } catch (error) {
    // Public acquisition telemetry is non-critical. Preserve a truthful 503
    // without leaking connection strings or turning a landing-page metric
    // outage into an uncaught application error.
    console.warn("[funnel-event] telemetry store unavailable", {
      event,
      code: errorCode(error),
    });
    return NextResponse.json(
      { ok: false, stored: false, error: "telemetry_unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, stored: true }, { status: 202 });
}
