import { NextRequest } from "next/server";
import { analyzeContribution } from "@core/gpt/analyzeContribution";
import { parseAnalysisResponse } from "@core/gpt/parseAnalysisResponse";
import { formatError } from "@core/utils/errors";
import ErrorLogModel from "@/models/ErrorLog";
import { connectDB } from "@/lib/connectDB";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { text, userContext } = await req.json();
    if (!text || text.length < 10) throw new Error("TEXT_TOO_SHORT");

    const analysis = await analyzeContribution(text, userContext);
    const structured = parseAnalysisResponse(analysis.gptRaw);
                 
    return new Response(JSON.stringify({
      success: true,
      language: analysis.originalLanguage,
      statements: structured.statements,
      topics: structured.topics,
      level: structured.level,
      context: structured.context,
      suggestions: structured.suggestions,
      translations: analysis.translations
    }), { status: 200 });

  } catch (error: any) {
    const formattedError = formatError({
      message: "Analyse fehlgeschlagen",
      code: "ANALYSIS_ERROR",
      cause: error.message || error
    });

    await ErrorLogModel.create({
      ...formattedError,
      path: "/api/contribution/analyze",
      payload: req.body
    });

    return new Response(JSON.stringify(formattedError), { status: 500 });
  }
}
