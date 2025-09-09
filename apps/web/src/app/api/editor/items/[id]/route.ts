// apps/web/src/app/api/editor/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContentKind, PublishStatus, RegionMode } from "@prisma/client";
import { validateItemDraft } from "@lib/validation/contentValidation";
import sanitizeHtml from "sanitize-html";
import { hasPermission, PERMISSIONS, type Role } from "@core/auth/rbac";
import { formatError } from "@core/errors/formatError";
import { logger } from "@core/observability/logger";

type Params = { params: { id: string } };

// --- GET /api/editor/items/[id] ---
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const role = (req.cookies.get("u_role")?.value as Role) ?? "guest";
    if (!hasPermission(role, PERMISSIONS.EDITOR_ITEM_READ)) {
      const fe = formatError("FORBIDDEN", "Permission denied", { role });
      logger.warn({ fe }, "ITEM_GET_FORBIDDEN");
      return NextResponse.json(fe, { status: 403 });
    }

    const item = await prisma.contentItem.findUnique({
      where: { id: params.id },
      include: {
        answerOptions: { orderBy: { order: "asc" } },
        regionEffective: true,
        regionManual: true,
        topic: { select: { id: true, slug: true, title: true } },
      },
    });

    if (!item) {
      const fe = formatError("NOT_FOUND", "Item not found", { id: params.id });
      logger.warn({ fe }, "ITEM_GET_NOTFOUND");
      return NextResponse.json(fe, { status: 404 });
    }

    return NextResponse.json({ ok: true, item }, { status: 200 });
  } catch (e: any) {
    const fe = formatError("INTERNAL_ERROR", "Unexpected failure", e?.message ?? e);
    logger.error({ fe, e }, "ITEM_GET_FAIL");
    return NextResponse.json(fe, { status: 500 });
  }
}

// --- PATCH /api/editor/items/[id] ---
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const role = (req.cookies.get("u_role")?.value as Role) ?? "guest";
    if (!hasPermission(role, PERMISSIONS.EDITOR_ITEM_WRITE)) {
      const fe = formatError("FORBIDDEN", "Permission denied", { role });
      logger.warn({ fe }, "ITEM_PATCH_FORBIDDEN");
      return NextResponse.json(fe, { status: 403 });
    }

    const body = await req.json();

    const current = await prisma.contentItem.findUnique({
      where: { id: params.id },
      include: { answerOptions: true },
    });
    if (!current) {
      const fe = formatError("NOT_FOUND", "Item not found", { id: params.id });
      logger.warn({ fe }, "ITEM_PATCH_NOTFOUND");
      return NextResponse.json(fe, { status: 404 });
    }

    // Eingaben mergen (Fallback auf current)
    const kind = (body.kind as ContentKind) ?? current.kind;
    const text = (typeof body.text === "string" ? body.text : current.text) as string;
    const topicId = (body.topicId as string) ?? current.topicId;
    const locale = body.locale ?? current.locale;
    const regionMode = (body.regionMode as RegionMode) ?? current.regionMode;
    const regionManualId = body.regionManualId ?? current.regionManualId;
    const publishAt = body.publishAt ? new Date(body.publishAt) : current.publishAt;
    const expireAt = body.expireAt ? new Date(body.expireAt) : current.expireAt;
    const title = body.title ?? current.title;
    const richText =
      body.richText !== undefined ? sanitizeHtml(String(body.richText)) : current.richText;
    const authorName = body.authorName ?? current.authorName;
    const status = (body.status as PublishStatus) ?? current.status;

    const answerOptions = (body.answerOptions ?? null) as
      | Array<{ id?: string; label: string; value: string; exclusive?: boolean; order?: number }>
      | null;

    // Validierung
    const validation = await validateItemDraft({
      kind,
      text,
      topicId,
      regionMode,
      regionManualId,
      publishAt,
      expireAt,
      locale,
      answerOptions: answerOptions ?? current.answerOptions,
    });

    // Atomar: ContentItem-Update + Options-Änderungen
    const result = await prisma.$transaction(async (tx) => {
      // 1) Item updaten
      await tx.contentItem.update({
        where: { id: params.id },
        data: {
          kind,
          text,
          topicId,
          locale,
          regionMode,
          regionManualId,
          publishAt: publishAt ?? undefined,
          expireAt: expireAt ?? undefined,
          title,
          richText,
          authorName,
          status,
          validation,
          regionAuto: validation.regionAuto ?? undefined,
        },
      });

      // 2) AnswerOptions upserten (nur wenn übergeben)
      if (answerOptions) {
        const existing = current.answerOptions;
        const keepIds = new Set(answerOptions.filter((o) => o.id).map((o) => o.id as string));
        const toDelete = existing.filter((e) => !keepIds.has(e.id)).map((e) => e.id);
        if (toDelete.length) {
          await tx.answerOption.deleteMany({ where: { id: { in: toDelete } } });
        }

        for (let idx = 0; idx < answerOptions.length; idx++) {
          const o = answerOptions[idx];
          const order = Number.isFinite(o.order) ? (o.order as number) : idx;
          if (o.id) {
            await tx.answerOption.update({
              where: { id: o.id },
              data: {
                label: o.label,
                value: o.value,
                exclusive: !!o.exclusive,
                order,
              },
            });
          } else {
            await tx.answerOption.create({
              data: {
                itemId: params.id,
                label: o.label,
                value: o.value,
                exclusive: !!o.exclusive,
                order,
              },
            });
          }
        }
      }

      // 3) Rückgabe laden
      return tx.contentItem.findUnique({
        where: { id: params.id },
        include: {
          answerOptions: { orderBy: { order: "asc" } },
          regionEffective: true,
          regionManual: true,
          topic: { select: { id: true, slug: true, title: true } },
        },
      });
    });

    return NextResponse.json({ ok: true, item: result }, { status: 200 });
  } catch (e: any) {
    const fe = formatError("INTERNAL_ERROR", "Update failed", e?.message ?? e);
    logger.error({ fe, e }, "ITEM_PATCH_FAIL");
    return NextResponse.json(fe, { status: 500 });
  }
}

// --- DELETE /api/editor/items/[id] ---
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const role = (req.cookies.get("u_role")?.value as Role) ?? "guest";
    if (!hasPermission(role, PERMISSIONS.EDITOR_ITEM_WRITE)) {
      const fe = formatError("FORBIDDEN", "Permission denied", { role });
      logger.warn({ fe }, "ITEM_DELETE_FORBIDDEN");
      return NextResponse.json(fe, { status: 403 });
    }

    await prisma.contentItem.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    const fe = formatError("INTERNAL_ERROR", "Delete failed", e?.message ?? e);
    logger.error({ fe, e }, "ITEM_DELETE_FAIL");
    return NextResponse.json(fe, { status: 500 });
  }
}
