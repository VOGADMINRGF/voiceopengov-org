// E200: In-memory rate limiter for HumanCheck endpoints.
const memoryStore = new Map<string, { count: number; expiresAt: number }>();
const DEFAULT_WINDOW_SECONDS = 15 * 60;

export async function incrementRateLimit(key: string, windowSeconds: number = DEFAULT_WINDOW_SECONDS) {
  const now = Date.now();
  const current = memoryStore.get(key);
  if (current && current.expiresAt > now) {
    current.count += 1;
    return current.count;
  }
  memoryStore.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
  return 1;
}
