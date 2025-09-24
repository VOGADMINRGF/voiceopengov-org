import { KV_ENABLED } from "@/libs/featureFlags";
import { appendRecord, type AnalyticsRecord } from "@/libs/analytics/adapters/fs";
import { kvPush } from "@/libs/analytics/adapters/kv";

export async function writeEvent(input: Omit<AnalyticsRecord, "ts">) {
  const rec: AnalyticsRecord = { ts: Date.now(), ...input };
  if (KV_ENABLED) {
    try {
      await kvPush(`analytics:${rec.type}:${rec.ts}`, rec);
      return { ok: true as const };
    } catch (err) {
      console.warn("[analytics] KV failed, falling back to FS:", err);
    }
  }
  await appendRecord(rec);
  return { ok: true as const };
}
