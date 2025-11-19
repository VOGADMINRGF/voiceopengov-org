import { NextRequest } from "next/server";
import OpenAI from "openai";
export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-2024-08-06";

/* ---------- SSE helpers ---------- */
function chunk(event: string, data: any) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}
const sseHeaders = {
  "content-type": "text/event-stream",
  "cache-control": "no-store",
  connection: "keep-alive",
} as const;

/* ---------- Output extractor (SDK-drift tolerant) ---------- */
function pickOutputText(resp: any): string {
  if (!resp) return "";
  if (typeof resp.output_text === "string") return resp.output_text;
  if (Array.isArray(resp.output)) {
    const parts: string[] = [];
    for (const item of resp.output) {
      for (const c of item?.content ?? []) {
        if (typeof c?.text === "string") parts.push(c.text);
        if (c?.type === "output_text" && typeof c?.text === "string") parts.push(c.text);
      }
    }
    if (parts.length) return parts.join("\n");
  }
  if (typeof resp.text === "string") return resp.text;
  return "";
}

/* ---------- Strict Schemas ---------- */
const OutlineItem = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string" },
    label: { type: "string" },
    summary: { type: "string" },
    start: { type: "integer" },
    end: { type: "integer" },
  },
  required: ["id", "label", "summary", "start", "end"],
} as const;

const ClaimItem = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string" },
    text: { type: "string" },
    kind: { type: "string" },
    topic: { type: "string" },
    confidence: { type: "number" },
    title: { type: ["string", "null"] },
    summary: { type: ["string", "null"] },
    zustaendigkeit: { type: ["string", "null"] },
    zeitraum: { type: ["string", "null"] },
    ort: { type: ["string", "null"] },
    sources: { type: "array", items: { type: "string" } },
  },
  required: ["text"],
} as const;

const AnalyzeResultSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outline: { type: "array", items: OutlineItem },
    claims: { type: "array", items: ClaimItem },
    notes: { type: "array", items: { type: "string" } },
    questions: { type: "array", items: { type: "string" } },
    knots: { type: "array", items: { type: "string" } },
  },
  required: ["claims"],
} as const;

/* ---------- JSON-Schema format objects (SDK-agnostic) ---------- */
const OUTLINE_FORMAT = {
  type: "json_schema",
  name: "OutlineOnly",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: { outline: { type: "array", items: OutlineItem } },
    required: ["outline"],
  },
  strict: true,
} as any;

const ANALYZE_FORMAT = {
  type: "json_schema",
  name: "AnalyzeResult",
  schema: AnalyzeResultSchema as any,
  strict: true,
} as any;

/* ---------- simple related streams suggester (placeholder) ---------- */
function suggestRelatedStreams(claims: any[]): Array<{ id: string; title: string; topic: string }> {
  const topics = new Set<string>();
  for (const c of claims) {
    const t = String(c.topic || "").toLowerCase();
    if (t) topics.add(t);
    // fallback: heuristik aus text
    const txt = String(c.text || "").toLowerCase();
    if (txt.includes("verfassung")) topics.add("verfassung & grundrechte");
    if (txt.includes("tiere") || txt.includes("tierhaltung")) topics.add("tierschutz & landwirtschaft");
    if (txt.includes("polizei") || txt.includes("sanitäter")) topics.add("innere sicherheit & rettung");
  }
  let i = 0;
  return [...topics].slice(0, 6).map((t) => ({
    id: `rel-${++i}`,
    title: `Themen-Stream: ${t}`,
    topic: t,
  }));
}

export async function POST(req: NextRequest) {
  const { text = "", locale = "de", maxClaims = 12 } = await req.json().catch(() => ({}));
  const src = String(text).slice(0, 8000);
  if (!src.trim()) {
    return new Response(chunk("error", { reason: "EMPTY_TEXT" }), { headers: sseHeaders });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (e: string, d: any) => controller.enqueue(enc.encode(chunk(e, d)));

      // Aggregat für ein finales 'result' Event (passend zu new/page.tsx)
      let agg: {
        outline: any[];
        claims: any[];
        notes: string[];
        questions: string[];
        knots: string[];
      } = { outline: [], claims: [], notes: [], questions: [], knots: [] };

      try {
        /* 1) Outline früh → UI kann Marker/Scroll vorbereiten */
        const outlineResp = await openai.responses.create({
          model: MODEL,
          input: [
            { role: "system", content: "Gliedere den Text in Abschnitte (id,label,summary,start,end). Antworte NUR als JSON: { outline: [...] }" },
            { role: "user", content: [{ type: "input_text", text: src }] },
          ],
          text: { format: OUTLINE_FORMAT },
        });
        const oRaw = pickOutputText(outlineResp);
        agg.outline = oRaw ? JSON.parse(oRaw).outline ?? [] : [];
        send("outline", { outline: agg.outline });
        send("progress", { processedIds: agg.outline.map((o: any) => o.id) });

        /* 2) Vollanalyse (strict) */
        const nClaims = Math.min(20, Math.max(1, Number(maxClaims)));
        const analyzeResp = await openai.responses.create({
          model: MODEL,
          input: [
            {
              role: "system",
              content:
                `Liefere strikt valides JSON im Schema "AnalyzeResult". ` +
                `Extrahiere bis zu ${nClaims} atomare, neutrale Statements (1 Satz, ${locale}). ` +
                `Fülle zusätzlich "notes", "questions", "knots".`,
            },
            { role: "user", content: [{ type: "input_text", text: src }] },
          ],
          text: { format: ANALYZE_FORMAT },
        });

        const aRaw = pickOutputText(analyzeResp);
        const parsed = aRaw ? JSON.parse(aRaw) : {};
        agg.claims = Array.isArray(parsed.claims) ? parsed.claims : [];
        agg.notes = Array.isArray(parsed.notes) ? parsed.notes : [];
        agg.questions = Array.isArray(parsed.questions) ? parsed.questions : [];
        agg.knots = Array.isArray(parsed.knots) ? parsed.knots : [];

        if (agg.claims.length) send("claims", { claims: agg.claims });
        if (agg.notes.length) send("notes", { notes: agg.notes });
        if (agg.questions.length) send("questions", { questions: agg.questions });
        if (agg.knots.length) send("knots", { knots: agg.knots });

        /* 3) Themen-Streams vorschlagen (aus Claims) */
        const related = suggestRelatedStreams(agg.claims);
        if (related.length) send("related_streams", { items: related });

        /* 4) Finale Aggregation (für new/MainEditor.onResult) */
        send("result", {
          outline: agg.outline,
          claims: agg.claims,
          notes: agg.notes,
          questions: agg.questions,
          knots: agg.knots,
        });

        send("done", { ok: true });
      } catch (err: any) {
        const reason =
          err?.message ||
          err?.error?.message ||
          err?.response?.data?.error?.message ||
          "AI_ERROR";
        send("error", { reason });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders });
}
