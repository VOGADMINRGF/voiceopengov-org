// apps/web/src/app/api/contributions/analyze/route.ts
import { NextRequest } from "next/server";
import {
  analyzeContribution,
  type AnalyzeResultWithMeta,
} from "@features/analyze/analyzeContribution";
import { deriveContextNotes } from "@features/analyze/context";
import {
  deriveCriticalQuestions,
  deriveKnots,
} from "@features/analyze/questionizers";
import { syncAnalyzeResultToGraph } from "@core/graph";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
} as const;

const DEFAULT_MAX_CLAIMS = 20;

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

type AnalyzeBody = {
  text: string;
  locale?: string;
  maxClaims?: number;
  stream?: boolean;
  live?: boolean;
};

type AnalyzeJobInput = {
  text: string;
  locale: string;
  maxClaims: number;
};

function sanitizeLocale(locale?: string): string {
  if (typeof locale === "string" && locale.trim()) {
    return locale.trim();
  }
  return "de";
}

function sanitizeMaxClaims(maxClaims?: number): number {
  if (
    typeof maxClaims === "number" &&
    Number.isFinite(maxClaims) &&
    maxClaims > 0
  ) {
    return Math.min(DEFAULT_MAX_CLAIMS, Math.max(1, Math.floor(maxClaims)));
  }
  return DEFAULT_MAX_CLAIMS;
}

/**
 * E150 – Contribution-AI
 * - JSON: { ok: true, result: AnalyzeResult }
 * - SSE: progress/result/error-events mit identischem Result-Shape
 */
export async function POST(req: NextRequest): Promise<Response> {
  let body: AnalyzeBody | null = null;

  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body", 400);
  }

  if (!body || typeof body.text !== "string" || !body.text.trim()) {
    return err("Missing 'text' in request body", 400);
  }

  const locale = sanitizeLocale(body.locale);
  const maxClaims = sanitizeMaxClaims(body.maxClaims);
  const text = body.text.trim();
  const analyzeInput: AnalyzeJobInput = { text, locale, maxClaims };

  if (wantsSse(req, body)) {
    return startAnalyzeSseStream(analyzeInput);
  }

  try {
    const result = await runAnalyzeJob(analyzeInput);
    const sourceId = crypto.createHash("sha1").update(text).digest("hex").slice(0, 32);
    syncAnalyzeResultToGraph({ result, sourceId, locale }).catch((err) => {
      console.error("[E150] graph sync failed", err);
    });
    return ok({ result }, 200);
  } catch (error) {
    console.error("[E150] /api/contributions/analyze error", error);
    return err(normalizeAnalyzerError(error), 500);
  }
}

const SSE_HEADERS = {
  "content-type": "text/event-stream; charset=utf-8",
  "cache-control": "no-cache, no-transform",
  connection: "keep-alive",
} as const;

function wantsSse(req: NextRequest, body: AnalyzeBody | null): boolean {
  if (body?.stream === true || body?.live === true) return true;
  const accept = req.headers.get("accept")?.toLowerCase() ?? "";
  return accept.includes("text/event-stream");
}

function startAnalyzeSseStream(input: AnalyzeJobInput): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      const sendProgress = (stage: string, pct: number) =>
        sendEvent("progress", { stage, pct });

      try {
        sendProgress("init", 5);
        sendProgress("dispatch", 15);

        sendProgress("analyzing", 35);
        const result = await runAnalyzeJob(input);

        sendProgress("finalizing", 85);
        sendEvent("result", { result });
        sendProgress("complete", 100);
        controller.close();
      } catch (error) {
        console.error("[E150] SSE analyze error", error);
        sendEvent("error", { reason: normalizeAnalyzerError(error) });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: SSE_HEADERS,
  });
}

async function runAnalyzeJob(input: AnalyzeJobInput): Promise<AnalyzeResultWithMeta> {
  const analyzed = await analyzeContribution({
    text: input.text,
    locale: input.locale,
    maxClaims: input.maxClaims,
  });
  return finalizeAnalyzeResult(analyzed);
}

function finalizeAnalyzeResult(
  result: AnalyzeResultWithMeta
): AnalyzeResultWithMeta {
  const notes = hasEntries(result.notes)
    ? result.notes
    : deriveContextNotes(result);
  const questions = hasEntries(result.questions)
    ? result.questions
    : deriveCriticalQuestions(result);
  const knots = hasEntries(result.knots) ? result.knots : deriveKnots(result);
  const consequencesBundle = result.consequences ?? {
    consequences: [],
    responsibilities: [],
  };
  const responsibilityPaths = Array.isArray(result.responsibilityPaths)
    ? result.responsibilityPaths
    : [];

  return {
    ...result,
    notes,
    questions,
    knots,
    consequences: {
      consequences: consequencesBundle.consequences ?? [],
      responsibilities: consequencesBundle.responsibilities ?? [],
    },
    responsibilityPaths,
  };
}

function hasEntries<T>(value?: T[] | null): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

function normalizeAnalyzerError(error: unknown): string {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : typeof error === "string"
        ? error
        : "";

  if (message.includes("KI-Antwort war kein gültiges JSON")) {
    return "AnalyzeContribution: KI-Antwort war kein gültiges JSON. Bitte später erneut versuchen.";
  }
  return "AnalyzeContribution: Fehler im Analyzer. Bitte später erneut versuchen.";
}
