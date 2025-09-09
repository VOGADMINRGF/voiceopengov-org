// apps/web/src/app/api/translate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cacheTranslation } from "@/utils/translationCache";
import { translateWithGPT } from "@/utils/gptTranslator";

export async function POST(req: NextRequest) {
  const { text, to } = await req.json();
  if (!text || !to) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const cached = await cacheTranslation.get(text, to);
  if (cached) {
    return NextResponse.json({ result: cached });
  }

  const translated = await translateWithGPT(text, to);
  await cacheTranslation.set(text, to, translated);

  return NextResponse.json({ result: translated });
}


import { analyzeContribution } from "@lib/contribution/analyzeContribution";
import { extractStatements } from "@lib/contribution/extractStatements";
import { translateAndCache } from "@lib/contribution/translateAndCache";
import { storeContribution } from "@lib/contribution/storeContribution";

export async function POST(req: Request) {
  const { text, region, userId } = await req.json();

  const analysis = await analyzeContribution(text);
  const statements = await extractStatements(analysis);
  const translations = await translateAndCache(statements, ["de", "en"]);

  const saved = await storeContribution({
    originalText: text,
    statements,
    translations,
    region,
    userId,
  });

  return Response.json({ success: true, saved });
}
