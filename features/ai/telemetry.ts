// Lightweight telemetry sink for AI orchestration.
// Data stays in-memory (ring buffer) but can be mirrored via a custom sink.
import type { AiErrorKind } from "@core/telemetry/aiUsageTypes";

export type AiTelemetryEvent = {
  ts: number;
  task: string;
  pipeline: string;
  provider: string;
  model?: string;
  success: boolean;
  retries: number;
  durationMs?: number;
  tokensIn?: number;
  tokensOut?: number;
  fallbackUsed?: boolean;
  errorKind?: AiErrorKind | null;
};

export type AiTelemetrySummary = {
  totals: {
    calls: number;
    successRate: number;
    avgDurationMs: number;
    fallbackRate: number;
  };
  perProvider: Array<{
    provider: string;
    calls: number;
    successRate: number;
    avgDurationMs: number;
    fallbackRate: number;
  }>;
};

const MAX_EVENTS = Number(process.env.AI_TELEMETRY_BUFFER_MAX ?? 1000);
const buffer: AiTelemetryEvent[] = [];

let customSink: ((event: AiTelemetryEvent) => Promise<void> | void) | null = null;

export function setTelemetrySink(fn: ((event: AiTelemetryEvent) => Promise<void> | void) | null) {
  customSink = fn;
}

export async function recordAiTelemetry(
  event: Omit<AiTelemetryEvent, "ts"> & { ts?: number }
): Promise<void> {
  const entry: AiTelemetryEvent = {
    ts: event.ts ?? Date.now(),
    task: event.task,
    pipeline: event.pipeline,
    provider: event.provider,
    model: event.model,
    success: event.success,
    retries: event.retries ?? 0,
    durationMs: event.durationMs,
    tokensIn: event.tokensIn,
    tokensOut: event.tokensOut,
    fallbackUsed: event.fallbackUsed ?? false,
    errorKind: event.errorKind ?? null,
  };

  buffer.push(entry);
  if (buffer.length > MAX_EVENTS) buffer.shift();

  if (customSink) {
    await Promise.resolve(customSink(entry)).catch(() => {});
  }

  // eslint-disable-next-line no-console
  console.info("[AI-Telemetry]", JSON.stringify(entry));
}

export function recentEvents(limit = 200): AiTelemetryEvent[] {
  if (limit <= 0) return [];
  return buffer.slice(Math.max(0, buffer.length - limit));
}

export function summarizeTelemetry(events: AiTelemetryEvent[] = buffer): AiTelemetrySummary {
  const totals = {
    calls: events.length,
    success: events.filter((e) => e.success).length,
    durationSum: events.reduce((sum, e) => sum + (e.durationMs ?? 0), 0),
    fallbackCount: events.filter((e) => e.fallbackUsed).length,
  };

  const perProvider = new Map<
    string,
    { provider: string; calls: number; success: number; durationSum: number; fallback: number }
  >();

  for (const event of events) {
    if (!perProvider.has(event.provider)) {
      perProvider.set(event.provider, {
        provider: event.provider,
        calls: 0,
        success: 0,
        durationSum: 0,
        fallback: 0,
      });
    }
    const bucket = perProvider.get(event.provider)!;
    bucket.calls += 1;
    if (event.success) bucket.success += 1;
    bucket.durationSum += event.durationMs ?? 0;
    if (event.fallbackUsed) bucket.fallback += 1;
  }

  const formatRate = (num: number, denom: number) =>
    denom > 0 ? Math.round((num / denom) * 1000) / 10 : 0;
  const formatAvg = (sum: number, denom: number) =>
    denom > 0 ? Math.round(sum / denom) : 0;

  return {
    totals: {
      calls: totals.calls,
      successRate: formatRate(totals.success, totals.calls),
      avgDurationMs: formatAvg(totals.durationSum, totals.calls),
      fallbackRate: formatRate(totals.fallbackCount, totals.calls),
    },
    perProvider: Array.from(perProvider.values()).map((bucket) => ({
      provider: bucket.provider,
      calls: bucket.calls,
      successRate: formatRate(bucket.success, bucket.calls),
      avgDurationMs: formatAvg(bucket.durationSum, bucket.calls),
      fallbackRate: formatRate(bucket.fallback, bucket.calls),
    })),
  };
}
