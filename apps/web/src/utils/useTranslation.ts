import { absUrl } from "@/utils/serverBaseUrl";
// src/utils/useTranslation.ts
import { useLang } from "@/context/LanguageContext";

export async function translateText(text: string): Promise<string> {
  const lang = useLang().lang;

  const res = await fetch(absUrl("/api/translate", {
    method: "POST",
    body: JSON.stringify({ text, to: lang }),
  });

  const data = await res.json();
  return data.result || text;
}
