// apps/web/src/app/api/_diag/gpt/route.ts
import { NextResponse } from "next/server";
import { callOpenAI } from "@features/ai/providers/openai";
export const dynamic = "force-dynamic";

export async function GET() {
  const t0 = Date.now();
  try {
    const prompt = 'Gib NUR JSON: {"ok":true,"echo":"hi"}';
    const { text, raw } = await callOpenAI({
      prompt,
      asJson: true,
      signal: AbortSignal.timeout(
        Number(process.env.OPENAI_TIMEOUT_MS || 18000),
      ),
    });
    return NextResponse.json({ ok: true, text, model: (raw as any)?.model ?? null, timeMs: Date.now() - t0 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
