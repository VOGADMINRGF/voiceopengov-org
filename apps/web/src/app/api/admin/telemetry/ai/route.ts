import { NextResponse } from "next/server";

/**
 * Liefert Status für AI-Provider OHNE echte Requests (kein Tokenverbrauch).
 * Logik: Wenn KEY fehlt -> skipped(202). Wenn KEY vorhanden -> ok=true (keine externen Calls).
 */
type Prov = { name: string; label: string; envKeys: string[]; note?: string };

const PROVS: Prov[] = [
  { name: "openai",    label: "OpenAI",    envKeys: ["OPENAI_API_KEY"], note: "Nur Key-Präsenz geprüft (202/OK)." },
  { name: "anthropic", label: "Anthropic", envKeys: ["ANTHROPIC_API_KEY"] },
  { name: "gemini",    label: "Google Gemini", envKeys: ["GOOGLE_API_KEY","GEMINI_API_KEY"] },
  { name: "cohere",    label: "Cohere",    envKeys: ["COHERE_API_KEY"] },
];

export async function GET() {
  const providers = PROVS.map(p => {
    const hasKey = p.envKeys.some(k => !!process.env[k]);
    if (!hasKey) return { name: p.name, label: p.label, ok: false, skipped: true, code: 202, note: "Kein API-Key gesetzt." };
    return { name: p.name, label: p.label, ok: true, code: 202, note: p.note || "Key vorhanden, Request übersprungen." };
  });
  return NextResponse.json({ providers, ts: new Date().toISOString() });
}
