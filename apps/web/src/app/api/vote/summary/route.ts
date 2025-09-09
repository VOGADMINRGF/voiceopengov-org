// apps/web/src/app/api/votes/summary/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@lib/db";
import Vote from "@models/Vote";
import Statement from "@/models/core/Statement";

type SummaryKey = "agree" | "neutral" | "disagree";
type Summary = Record<SummaryKey, number>;

type VotingRule =
  | { type: "simple-majority"; minQuorum?: number; weightMap?: Record<string, number> }
  | { type: "two-thirds";      minQuorum?: number; weightMap?: Record<string, number> }
  | { type: "weighted";        minQuorum?: number; weightMap: Record<string, number> };

function normChoice(raw: unknown): SummaryKey {
  const v = String(raw ?? "").toLowerCase();
  if (["agree", "yes", "pro", "for"].includes(v)) return "agree";
  if (["disagree", "no", "contra", "against"].includes(v)) return "disagree";
  return "neutral";
}

function computeResult(rule: VotingRule, s: Summary): "passed" | "not_passed" | null {
  const total = s.agree + s.neutral + s.disagree;
  if (total === 0) return null;
  if (rule.minQuorum && total < rule.minQuorum) return "not_passed";
  if (rule.type === "two-thirds") return s.agree >= Math.ceil((2 * total) / 3) ? "passed" : "not_passed";
  return s.agree > s.disagree ? "passed" : "not_passed";
}

export async function GET(req: NextRequest) {
  const statementId = req.nextUrl.searchParams.get("statementId");
  if (!statementId) {
    return NextResponse.json({ error: "Missing statementId." }, { status: 400 });
  }

  try {
    await dbConnect();

    const statement: any =
      (await Statement.findOne({ id: statementId }).lean().catch(() => null)) ??
      (await Statement.findById(statementId).lean().catch(() => null));

    if (!statement) {
      return NextResponse.json({ error: "Statement not found." }, { status: 404 });
    }

    const votingRule: VotingRule = statement.votingRule || { type: "simple-majority" };

    const votes: Array<{ vote?: string; role?: string; choice?: string }> =
      await (Vote as any).find({ statementId }).select("vote role choice").lean();

    const summary: Summary = { agree: 0, neutral: 0, disagree: 0 };

    const weighted = votingRule.type === "weighted" && votingRule.weightMap;
    for (const v of votes) {
      const key = normChoice(v.vote ?? v.choice);
      if (weighted) {
        const role = v.role ?? "Bürger";
        const w = Number.isFinite((votingRule as any).weightMap?.[role])
          ? (votingRule as any).weightMap[role]
          : 1;
        summary[key] += w;
      } else {
        summary[key] += 1;
      }
    }

    const total = summary.agree + summary.neutral + summary.disagree;
    const result = computeResult(votingRule, summary);

    return NextResponse.json({ summary, total, votingRule, result }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Database error.", details: err?.message || String(err) }, { status: 500 });
  }
}
