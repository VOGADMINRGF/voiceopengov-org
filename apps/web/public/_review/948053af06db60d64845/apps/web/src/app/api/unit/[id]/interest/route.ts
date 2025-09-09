// apps/web/src/app/api/unit/[id]/interest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/prisma";
import { shouldWatchlist } from "@/core/factcheck/triage";
import { formatError } from "@core/errors/formatError";
import { logger } from "@core/observability/logger";

export const runtime = "nodejs";

const BodySchema = z.object({ interest: z.enum(["interested", "ignored", "undecided"]) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = BodySchema.parse(await req.json());
    const unit = await prisma.extractedUnit.findUniqueOrThrow({ where: { id: params.id } });

    const triage = body.interest === "ignored" && shouldWatchlist(unit) ? "watchlist" : "none";

    const updated = await prisma.extractedUnit.update({
      where: { id: params.id },
      data: { interest: body.interest as any, triage }
    });

    return NextResponse.json({ id: updated.id, interest: updated.interest, triage: updated.triage });
  } catch (err: any) {
    logger.warn({ err }, "unit_interest_PATCH_failed");
    return NextResponse.json(formatError(err), { status: 400 });
  }
}
