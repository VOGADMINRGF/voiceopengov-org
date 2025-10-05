// apps/web/src/app/api/votes/summary/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  ObjectId,
  type Filter,
  type FindOptions,
} from "mongodb";
import { coreCol, votesCol } from "src/utils/triMongo";

type SummaryKey = "agree" | "neutral" | "disagree";
type Summary = Record<SummaryKey, number>;

type VotingRule =
  | { type: "simple-majority"; minQuorum?: number; weightMap?: Record<string, number> }
  | { type: "two-thirds";      minQuorum?: number; weightMap?: Record<string, number> }
  | { type: "weighted";        minQuorum?: number; weightMap: Record<string, number> };

type VoteDoc = {
  _id?: ObjectId;
  statementId: ObjectId | string;
  vote?: string;
  choice?: string;
  role?: string;
};

function normChoice(raw: unknown): SummaryKey {
  const v = String(raw ?? "").toLowerCase();
  if (v === "agree" || v === "yes" || v === "pro" || v === "for") return "agree";
  if (v === "disagree" || v === "no" || v === "contra" || v === "against") return "disagree";
  return "neutral";
}

function computeResult(rule: VotingRule, s: Summary): "passed" | "not_passed" | null {
  const total = s.agree + s.neutral + s.disagree;
  if (total === 0) return null;
  if (rule.minQuorum && total < rule.minQuorum) return "not_passed";

  if (rule.type === "two-thirds") {
    const needed = Math.ceil((2 * total) / 3);
    return s.agree >= needed ? "passed" : "not_passed";
  }
  // simple-majority & weighted → Mehrheit der (ggf. gewichteten) Stimmen
  return s.agree > s.disagree ? "passed" : "not_passed";
}

function emptySummary(): Summary {
  return { agree: 0, neutral: 0, disagree: 0 };
}

function coerceSummary(v: any): Summary {
  return {
    agree: typeof v?.agree === "number" && Number.isFinite(v.agree) ? v.agree : 0,
    neutral: typeof v?.neutral === "number" && Number.isFinite(v.neutral) ? v.neutral : 0,
    disagree: typeof v?.disagree === "number" && Number.isFinite(v.disagree) ? v.disagree : 0,
  };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const statementIdParam = url.searchParams.get("statementId");
  const fresh = url.searchParams.get("fresh") === "true";

  if (!statementIdParam) {
    return NextResponse.json({ error: "Missing statementId." }, { status: 400 });
  }
  // Ab hier typ-sicher als string behandeln
  const statementIdStr: string = statementIdParam;

  // Collections
  const stmtsRef = await coreCol<any>("statements");
  const votesRef = await votesCol<VoteDoc>("votes");

  // Statement laden: erst via _id:ObjectId, dann via id:string
  const isObjId = ObjectId.isValid(statementIdStr);
  let statement: any = null;

  if (isObjId) {
    statement = await stmtsRef.findOne(
      { _id: new ObjectId(statementIdStr) },
      { projection: { votes: 1, stats: 1, votingRule: 1, id: 1 } }
    );
  }
  if (!statement) {
    statement = await stmtsRef.findOne(
      { id: statementIdStr },
      { projection: { votes: 1, stats: 1, votingRule: 1, id: 1 } }
    );
  }
  if (!statement) {
    return NextResponse.json({ error: "Statement not found." }, { status: 404 });
  }

  const votingRule: VotingRule = statement.votingRule || { type: "simple-majority" };

  // Live-Zusammenfassung aus votes-Collection (für fresh/weighted/Inkonsistenzen)
  async function summaryFromVotes(): Promise<{ summary: Summary; total: number; source: "live" }> {
    // Filter OHNE nulls → ts(2322) vermeiden
    let match: Filter<VoteDoc>;
    if (isObjId) {
      match = {
        $or: [
          { statementId: new ObjectId(statementIdStr) },
          { statementId: statementIdStr },
        ],
      };
    } else {
      match = { statementId: statementIdStr };
    }

    // Projection typ-sicher; Options klar typisiert → ts(2769) vermeiden
    const projection = { vote: 1 as const, choice: 1 as const, role: 1 as const };
    const options: FindOptions<VoteDoc> = { projection };

    const cursor = votesRef.find(match, options).batchSize(1000);

    const weighted = votingRule.type === "weighted";
    const weightMap = (votingRule as any).weightMap || {};

    let summary = emptySummary();
    let total = 0;

    for await (const doc of cursor) {
      const key = normChoice(doc.vote ?? doc.choice);
      if (weighted) {
        const role = doc?.role ?? "Bürger";
        const wRaw = (weightMap as Record<string, unknown>)[role];
        const w = typeof wRaw === "number" && Number.isFinite(wRaw) ? wRaw : 1;
        summary[key] += w;
        total += w;
      } else {
        summary[key] += 1;
        total += 1;
      }
    }

    return { summary, total, source: "live" };
  }

  // Schnellpfad: cached Summary aus Statement-Dokument
  const cachedVotes = coerceSummary(statement.votes);
  const cachedTotal = cachedVotes.agree + cachedVotes.neutral + cachedVotes.disagree;
  const stats = {
    views: Number(statement?.stats?.views) || 0,
    votesAgree: Number(statement?.stats?.votesAgree) || 0,
    votesNeutral: Number(statement?.stats?.votesNeutral) || 0,
    votesDisagree: Number(statement?.stats?.votesDisagree) || 0,
    votesTotal: Number(statement?.stats?.votesTotal) || cachedTotal,
  };

  let summary: Summary;
  let total: number;
  let source: "cached" | "live" = "cached";

  const mustLive =
    fresh ||
    votingRule.type === "weighted" ||
    (cachedTotal === 0 && stats.votesTotal > 0);

  if (mustLive) {
    const live = await summaryFromVotes();
    summary = live.summary;
    total = live.total;
    source = live.source;
  } else {
    summary = cachedVotes;
    total = cachedTotal;
  }

  const result = computeResult(votingRule, summary);

  return NextResponse.json(
    { summary, total, votingRule, result, stats, source },
    { status: 200 }
  );
}
