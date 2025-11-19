// apps/web/src/app/api/contributions/analyze/route.ts
import { NextRequest } from "next/server";
import { analyzeContribution } from "@features/analyze/analyzeContribution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
} as const;

function ok(data: any, status = 200) {
  return new Response(JSON.stringify({ ok: true, ...data }), {
    status,
    headers: JSON_HEADERS,
  });
}

function err(message: string, status = 500, extra: any = {}) {
  return new Response(JSON.stringify({ ok: false, error: message, ...extra }), {
    status,
    headers: JSON_HEADERS,
  });
}

/**
 * E150 – Nicht-Stream-Analyse
 * - Input: { text, locale?, maxClaims? }
 * - Output: { ok: true, result: AnalyzeResult }
 * - Keine zusätzlichen Heuristiken: wir reichen nur das zurück, was analyzeContribution liefert.
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.text !== "string") {
      return err("Missing 'text' in request body", 400);
    }

    const locale =
      typeof body.locale === "string" && body.locale.trim()
        ? body.locale
        : "de";
    const maxClaims =
      typeof body.maxClaims === "number" && Number.isFinite(body.maxClaims)
        ? body.maxClaims
        : 20;

    const result = await analyzeContribution({
      text: body.text,
      locale,
      maxClaims,
    });

    // NUR das Ergebnis der AI-Schicht, keine extra Inhalte
    return ok({ result }, 200);
  } catch (e: any) {
    console.error("[E150] /api/contributions/analyze error", e);
    return err("Internal analyze error", 500, {
      reason: e?.message ?? String(e),
    });
  }
}
