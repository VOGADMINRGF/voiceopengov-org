export const runtime = "nodejs";

import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { votesCol, coreCol } from "@/utils/triMongo";
import { rateLimit } from "@/utils/rateLimit";

type Val = "agree" | "neutral" | "disagree";

function parseRegion(h: Headers) {
  const rc = (h.get("x-country") || h.get("cf-ipcountry") || "").toUpperCase();
  return rc || "UNK";
}

export async function POST(req: NextRequest) {
  // Rate Limit
  const lim = await rateLimit("vote:cast", 120, 60_000);
  if (!lim.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const statementId = String(body?.statementId || body?.id || "");
  const value = String(body?.value ?? body?.reaction ?? "") as Val;
  if (!["agree", "neutral", "disagree"].includes(value) || !statementId) {
    return NextResponse.json({ error: "statementId + value required" }, { status: 400 });
  }
  if (!ObjectId.isValid(statementId)) {
    return NextResponse.json({ error: "bad_statement_id" }, { status: 400 });
  }
  const stmtObjId = new ObjectId(statementId);

  // Request-Metadaten
  const userId = req.cookies.get("u_id")?.value || req.headers.get("x-user-id") || null;
  const fp = (req.headers.get("x-fp") || "").slice(0, 200);
  const ip = ((req.headers.get("x-forwarded-for") || (req as any).ip || "") as string)
    .split(",")[0].trim().slice(0, 64);
  const regionCode = parseRegion(req.headers);
  const ts = Date.now();

  // Collections
  const votes = await votesCol<any>("votes");
  const stmts = await coreCol<any>("statements");

  const key = userId
    ? { statementId: stmtObjId, userId }
    : { statementId: stmtObjId, ip: ip || null, fp: fp || null };

  const prev = await votes.findOne(key, { projection: { value: 1 } });
  if (prev && prev.value === value) return NextResponse.json({ ok: true, unchanged: true });

  await votes.updateOne(
    key,
    {
      $set: {
        statementId: stmtObjId,
        value,
        regionCode,
        ts,
        userId: userId || null,
        ip: ip || null,
        fp: fp || null,
      },
      $setOnInsert: { createdAt: new Date(ts) },
    },
    { upsert: true }
  );

  const inc: Record<string, number> = {};
  if (!prev) inc["stats.votesTotal"] = 1;

  if (value === "agree") inc["stats.votesAgree"] = (inc["stats.votesAgree"] ?? 0) + 1;
  if (value === "neutral") inc["stats.votesNeutral"] = (inc["stats.votesNeutral"] ?? 0) + 1;
  if (value === "disagree") inc["stats.votesDisagree"] = (inc["stats.votesDisagree"] ?? 0) + 1;

  if (prev) {
    if (prev.value === "agree") inc["stats.votesAgree"] = (inc["stats.votesAgree"] ?? 0) - 1;
    if (prev.value === "neutral") inc["stats.votesNeutral"] = (inc["stats.votesNeutral"] ?? 0) - 1;
    if (prev.value === "disagree") inc["stats.votesDisagree"] = (inc["stats.votesDisagree"] ?? 0) - 1;
  }

  if (Object.keys(inc).length) await stmts.updateOne({ _id: stmtObjId }, { $inc: inc });

  return NextResponse.json({ ok: true });
}

