// apps/web/src/utils/rateLimit.ts
type Slot = { count: number; resetAt: number };
const store = new Map<string, Slot>();
export async function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const slot = store.get(key);
  if (!slot || now > slot.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (slot.count >= limit) return { ok: false, retryIn: Math.max(0, slot.resetAt - now) };
  slot.count++;
  return { ok: true, remaining: Math.max(0, limit - slot.count) };
}
