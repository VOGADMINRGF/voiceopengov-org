import { BodySchema } from "@/lib/validation/body";
// apps/web/src/app/api/finding/upsert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { formatError } from "@core/errors/formatError";
import { hasPermission, PERMISSIONS } from "@core/auth/rbac";
import { mapOutcomeToStatus } from "@/core/factcheck/triage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!hasPermission(req, PERMISSIONS.EDITOR_ITEM_WRITE)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body = BodySchema.parse(await req.json());
    const prisma = await getPrismaClient();
    if (!prisma) {
      return NextResponse.json({ error: "storage_disabled" }, { status: 503 });
    }
    const findingModel = (prisma as any).finding;
    const factcheckClaim = (prisma as any).factcheckClaim;
    const evidenceModel = (prisma as any).evidence;
    if (!findingModel || !factcheckClaim) {
      return NextResponse.json(
        { error: "factcheck_models_missing" },
        { status: 501 },
      );
    }

    const finding = await findingModel.upsert({
      where: { claimId: body.claimId },
      create: {
        claimId: body.claimId,
        summary: body.summary,
        outcome: body.outcome,
        rationale: body.rationale,
        metrics: body.metrics,
        comparedJurisdictions: body.comparedJurisdictions,
      },
      update: {
        summary: body.summary,
        outcome: body.outcome,
        rationale: body.rationale,
        metrics: body.metrics,
        comparedJurisdictions: body.comparedJurisdictions,
        lastChecked: new Date(),
      },
    });

    await factcheckClaim.update({
      where: { id: body.claimId },
      data: { status: mapOutcomeToStatus(body.outcome), findingId: finding.id },
    });

    if (body.sources?.length) {
      await evidenceModel?.createMany(
        body.sources.map((s: any) => ({
          claimId: body.claimId,
          label: s.label,
          url: s.url,
          kind: s.kind,
        })),
      );
    }

    return NextResponse.json({ findingId: finding.id });
  } catch (err: any) {
    return NextResponse.json(formatError("bad_request", String((err as any)?.message ?? err), err), { status: 400 });
  }
}

async function getPrismaClient() {
  if (!process.env.WEB_DATABASE_URL) return null;
  const mod = await import("@/lib/prisma");
  return mod.prisma;
}
