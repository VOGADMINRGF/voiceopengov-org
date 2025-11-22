import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ contributionId: string }> },
) {
  const { contributionId } = await context.params;

  const prisma = await getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ ok: false, reason: "prisma_disabled", results: [] }, { status: 503 });
  }

  const factcheckJob = (prisma as any).factcheckJob;
  const factcheckResult = (prisma as any).factcheckResult;
  if (!factcheckJob || !factcheckResult) {
    return NextResponse.json(
      { ok: false, reason: "Factcheck models not available", results: [] },
      { status: 501 },
    );
  }

  const job = await factcheckJob.findFirst({
    where: { contributionId },
    orderBy: { createdAt: "desc" },
  });

  if (!job) {
    return NextResponse.json(
      { ok: false, reason: "No job found for contributionId", results: [] },
      { status: 404 },
    );
  }

  const results = await factcheckResult.findMany({
    where: { jobId: job.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    ok: true,
    job: {
      id: job.id,
      status: job.status,
      tokensUsed: job.tokensUsed,
      durationMs: job.durationMs,
    },
    results,
  });
}

async function getPrismaClient() {
  if (!process.env.WEB_DATABASE_URL) return null;
  const mod = await import("@/lib/prisma");
  return mod.prisma;
}
