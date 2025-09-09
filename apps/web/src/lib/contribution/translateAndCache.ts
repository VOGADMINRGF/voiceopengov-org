import { gptTranslate } from "@/utils/gptTranslator";
import { cacheTranslation } from "@/utils/translationCache";

export async function translateAndCache(texts: string[], targetLanguages: string[]) {
  const result: Record<string, Record<string, string>> = {};

  for (const text of texts) {
    result[text] = {};
    for (const lang of targetLanguages) {
      const cached = cacheTranslation.get(text, lang);
      if (cached) {
        result[text][lang] = cached;
        continue;
      }
      const translation = await gptTranslate(text, lang);
      cacheTranslation.set(text, lang, translation);
      result[text][lang] = translation;
    }
  }

  return result;
}
