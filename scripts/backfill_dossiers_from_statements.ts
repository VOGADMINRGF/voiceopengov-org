#!/usr/bin/env tsx
import { coreCol, ObjectId } from "@core/db/triMongo";
import { ensureDossierForStatement } from "@features/dossier/db";
import { seedDossierFromAnalysis } from "@features/dossier/seed";

type StatementDoc = {
  _id?: ObjectId;
  id?: string;
  title?: string;
  text?: string;
  content?: string;
  language?: string;
  category?: string;
  analysis?: any;
  createdAt?: Date;
};

function parseLimit(args: string[]) {
  const arg = args.find((a) => a.startsWith("--limit="));
  if (!arg) return 0;
  const v = Number(arg.split("=")[1] ?? "0");
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function shouldEnqueue(args: string[]) {
  if (args.includes("--no-enqueue")) return false;
  if (args.includes("--enqueue")) return true;
  return process.env.BACKFILL_ENQUEUE === "1";
}

async function enqueueFactcheck(payload: any) {
  try {
    const { getFactcheckQueue } = await import("@core/queue/factcheckQueue");
    const q = getFactcheckQueue();
    await q.add("factcheck", payload, { jobId: `stmt-${payload.contributionId}` });
    return true;
  } catch (err) {
    console.warn("[backfill] enqueue skipped", (err as any)?.message ?? err);
    return false;
  }
}

async function run() {
  const args = process.argv.slice(2);
  const limit = parseLimit(args);
  const doEnqueue = shouldEnqueue(args);

  const col = await coreCol<StatementDoc>("statements");
  const cursor = col.find({}, { projection: { id: 1, title: 1, text: 1, content: 1, language: 1, category: 1, analysis: 1, createdAt: 1 } })
    .sort({ createdAt: -1, _id: -1 });
  if (limit) cursor.limit(limit);

  let processed = 0;
  let seeded = 0;
  let enqueued = 0;

  for await (const stmt of cursor) {
    const statementId = String(stmt.id ?? stmt._id ?? "");
    if (!statementId) continue;

    const aliases = new Set<string>();
    if (stmt.id) aliases.add(String(stmt.id));
    if (stmt._id) aliases.add(String(stmt._id));

    const dossier = await ensureDossierForStatement(
      statementId,
      { title: stmt.title ?? undefined },
      Array.from(aliases),
    );
    if (!dossier) continue;

    const claims = Array.isArray(stmt.analysis?.claims) ? stmt.analysis.claims : [];
    const questions = Array.isArray(stmt.analysis?.questions) ? stmt.analysis.questions : [];
    if (claims.length || questions.length) {
      await seedDossierFromAnalysis({
        dossierId: dossier.dossierId,
        claims,
        questions,
        createdByRole: "system",
      });
      seeded += 1;
    }

    if (doEnqueue) {
      const inputText = (stmt.text ?? stmt.content ?? "").trim();
      if (inputText) {
        const ok = await enqueueFactcheck({
          contributionId: statementId,
          text: inputText,
          language: stmt.language ?? "de",
          topic: stmt.category ?? undefined,
        });
        if (ok) enqueued += 1;
      }
    }

    processed += 1;
  }

  console.log(`[backfill] processed=${processed} seeded=${seeded} enqueued=${enqueued} limit=${limit || "none"}`);
}

run().catch((err) => {
  console.error("[backfill] fatal", err);
  process.exit(1);
});
