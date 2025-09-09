// apps/web/src/app/api/editor/items/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublishStatus, RegionMode } from "@prisma/client";
import { logger } from "@core/observability/logger";
import { formatError } from "@core/errors/formatError";
import { hasPermission, PERMISSIONS, type Role } from "@core/auth/rbac";

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const traceStart = Date.now();
  try {
    const { id } = params;

    // --- Session / RBAC ---
    // TODO: Rolle/Nutzer-ID aus Session oder Middleware korrekt ermitteln
    const role = "editor" as Role;
    if (!hasPermission(role, PERMISSIONS.EDITOR_ITEM_PUBLISH)) {
      const err = formatError("FORBIDDEN", "Permission denied");
      logger.warn({ id, role }, "ITEM_PUBLISH_FORBIDDEN");
      return NextResponse.json(err, { status: 403 });
    }

    // --- Item laden ---
    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: { answerOptions: true, topic: true },
    });
    if (!item) {
      const err = formatError("NOT_FOUND", "Item not found", { id });
      logger.warn({ id }, "ITEM_NOT_FOUND");
      return NextResponse.json(err, { status: 404 });
    }

    // --- Idempotenz ---
    if (item.status === PublishStatus.published) {
      logger.info({ id, tookMs: Date.now() - traceStart }, "ITEM_ALREADY_PUBLISHED");
      return NextResponse.json({ ok: true, item }, { status: 200 });
    }

    // --- Validierung ---
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!item.text || item.text.trim().length < 8) {
      errors.push("Text zu kurz.");
    }
    if (item.kind === "EVENT" || item.kind === "SUNDAY_POLL") {
      if (item.answerOptions.length < 2) {
        errors.push("Mindestens 2 Antwortoptionen erforderlich.");
      }
      if (item.kind === "EVENT" && !item.answerOptions.some((o) => o.exclusive)) {
        errors.push("EVENT: Mindestens eine exklusive Option erforderlich.");
      }
    }
    if (item.publishAt && item.expireAt && item.expireAt <= item.publishAt) {
      errors.push("expireAt muss nach publishAt liegen.");
    }

    // --- Region bestimmen ---
    let regionEffectiveId = item.regionEffectiveId ?? null;
    if (item.regionMode === RegionMode.MANUAL) {
      if (!item.regionManualId) {
        errors.push("RegionMode=MANUAL benötigt regionManualId.");
      } else {
        regionEffectiveId = item.regionManualId;
      }
    } else {
      const decided = (item.regionAuto as any)?.decidedRegionId as string | undefined;
      if (decided) regionEffectiveId = decided;
      if (!regionEffectiveId) {
        errors.push("AUTO-Region konnte nicht sicher bestimmt werden.");
      }
    }

    // --- Bei Fehlern: in REVIEW parken ---
    if (errors.length) {
      await prisma.contentItem.update({
        where: { id: item.id },
        data: {
          status: PublishStatus.review,
          validation: { ...(item.validation || {}), errors, warnings },
        },
      });
      logger.warn({ id, errors, warnings }, "ITEM_VALIDATION_FAILED");
      return NextResponse.json({ ok: false, errors, warnings }, { status: 400 });
    }

    // --- Publish atomar durchführen ---
    const updated = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const patch = await tx.contentItem.update({
        where: { id: item.id },
        data: {
          status: PublishStatus.published,
          publishAt: item.publishAt ?? now,
          regionEffectiveId,
          validation: { ...(item.validation || {}), errors: [], warnings },
        },
      });

      return tx.contentItem.findUnique({
        where: { id: patch.id },
        include: {
          topic: { select: { id: true, slug: true, title: true } },
          answerOptions: { orderBy: { order: "asc" } },
          regionEffective: true,
          regionManual: true,
        },
      });
    });

    logger.info(
      { id, status: updated?.status, tookMs: Date.now() - traceStart },
      "ITEM_PUBLISH_OK"
    );
    return NextResponse.json({ ok: true, item: updated }, { status: 200 });
  } catch (e: any) {
    logger.error({ e }, "ITEM_PUBLISH_FAIL");
    const err = formatError("BAD_REQUEST", "Publish failed", e?.message ?? e);
    return NextResponse.json(err, { status: 500 });
  }
}
