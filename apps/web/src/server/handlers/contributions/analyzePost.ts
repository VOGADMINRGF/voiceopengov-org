// apps/web/src/server/handlers/contributions/analyzePost.ts
import { NextRequest, NextResponse } from "next/server";
import { AnalyzeBodyZ } from "@/lib/contribution/schema";
import { analyzeAndTranslate } from "@/lib/contribution/analyzeAndTranslate";
import { storeContribution } from "@/lib/contribution/storeContribution";
import { rateLimit } from "@/utils/rateLimiter";

export async function handleAnalyzePost(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "unknown";
  const rl = await rateLimit(ip, "contrib_analyze", 60, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retry_after: rl.retryAfterSec },
      { status: 429, headers: { "X-RateLimit-Limit": "60", "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(rl.resetSec) } }
    );
  }

  try {
    const body = AnalyzeBodyZ.parse(await req.json());
    const acceptLang = req.headers.get("accept-language") || undefined;
    const fromLang = acceptLang?.split(",")[0]?.toLowerCase().replace(/_/g, "-") ?? null;

    const result = await analyzeAndTranslate({
      ...body,
      fromLang,
      extractMax: Number(process.env.EXTRACT_MAX_STATEMENTS ?? 8),
      extractMinChars: Number(process.env.EXTRACT_MIN_CHARS ?? 12),
      translateConcurrency: Number(process.env.TRANSLATE_CONCURRENCY ?? 6),
      skipNoop: true,
    });

    const saved = await storeContribution({
      originalText: body.text,
      regionCodeOrName: result.region ?? null,
      userId: body.userId ?? null,
      topics: result.topics,
      statements: result.statements,
      translations: result.translations,
    });

    return NextResponse.json(
      { ...result, saved },
      { headers: { "Cache-Control": "no-store", "X-RateLimit-Remaining": String(rl.remaining), "X-RateLimit-Reset": String(rl.resetSec) } }
    );
  } catch (err: any) {
    const isZ = err?.name === "ZodError";
    return NextResponse.json(
      { error: isZ ? "invalid_request" : "analysis_failed", detail: isZ ? err.issues : String(err) },
      { status: isZ ? 400 : 500 }
    );
  }
}
