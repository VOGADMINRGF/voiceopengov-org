// apps/web/src/app/api/finding/upsert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/prisma";
import { formatError } from "@core/errors/formatError";
import { hasPermission, PERMISSIONS } from "@core/auth/rbac";
import { mapOutcomeToStatus } from "@/core/factcheck/triage";

export const runtime = "nodejs";

const BodySchema = z.object({
  claimId: z.string().min(1),
  summary: z.string().min(10),
  outcome: z.enum(["LIKELY_TRUE", "LIKELY_FALSE", "MIXED", "UNDETERMINED"]),
  rationale: z.string().min(5),
  metrics: z.any().optional(),
  comparedJurisdictions: z.any().optional(),
  sources: z.array(z.object({ label: z.string(), url: z.string().url(), kind: z.string().optional() })).optional()
});

export async function POST(req: NextRequest) {
  try {
    if (!hasPermission(req, PERMISSIONS.EDITOR_EDIT)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body = BodySchema.parse(await req.json());

    const finding = await prisma.finding.upsert({
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
      }
    });

    await prisma.factcheckClaim.update({
      where: { id: body.claimId },
      data: { status: mapOutcomeToStatus(body.outcome), findingId: finding.id }
    });

    if (body.sources?.length) {
      await prisma.evidence.createMany({
        data: body.sources.map((s) => ({ claimId: body.claimId, label: s.label, url: s.url, kind: s.kind }))
      });
    }

    return NextResponse.json({ findingId: finding.id });
  } catch (err: any) {
    return NextResponse.json(formatError(err), { status: 400 });
  }
}
