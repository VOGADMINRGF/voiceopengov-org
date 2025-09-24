// apps/web/src/app/api/contributions/analyze/route.ts
import type { NextRequest } from "next/server";
import { handleAnalyzePost } from "@/server/handlers/contributions/analyzePost";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleAnalyzePost(req);
}
