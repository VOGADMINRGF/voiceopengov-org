// src/utils/translationCache.ts
const memoryCache: Record<string, string> = {};

function createKey(text: string, to: string) {
  return `${text}_${to}`.toLowerCase();
}

export const cacheTranslation = {
  get: async (text: string, to: string) => {
    const key = createKey(text, to);
    return memoryCache[key];
  },
  set: async (text: string, to: string, translated: string) => {
    const key = createKey(text, to);
    memoryCache[key] = translated;
  },
};
