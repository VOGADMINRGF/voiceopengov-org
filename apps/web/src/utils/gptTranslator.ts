// apps/web/src/utils/gptTranslator.ts
export async function translateWithGPT(text: string, to: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  // Maskiere {placeholders} & Markdown-Links, damit sie unverändert bleiben
  const masks: { key: string; val: string }[] = [];
  let masked = text.replace(/(\{[^}]+\})/g, (_, m) => (masks.push({ key: `[[PH_${masks.length}]]`, val: m }), masks[masks.length-1].key));
  masked = masked.replace(/(\[[^\]]+\]\([^)]+\))/g, (_, m) => (masks.push({ key: `[[MD_${masks.length}]]`, val: m }), masks[masks.length-1].key));

  const sys = `You are a professional translator. Translate into '${to}'.
- Keep placeholders like [[PH_*]] unchanged.
- Keep Markdown links like [[MD_*]] unchanged.
- Preserve meaning and tone.`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: masked }],
      temperature: 0.2,
    }),
  });
  if (!r.ok) throw new Error(`OpenAI error: ${r.status} ${await r.text()}`);
  const j = await r.json();
  let out: string = j.choices?.[0]?.message?.content?.trim() ?? text;

  // Unmask
  for (const m of masks) out = out.replaceAll(m.key, m.val);
  return out;
}
