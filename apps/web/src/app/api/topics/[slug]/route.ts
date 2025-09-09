// apps/web/src/app/api/topics/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const now = new Date();

    const topic = await prisma.topic.findUnique({
      where: { slug: params.slug },
      include: {
        items: {
          where: {
            status: PublishStatus.published,
            // Falls ihr nur SWIPE anzeigen wollt, einkommentieren:
            // kind: "SWIPE",
            OR: [{ publishAt: null }, { publishAt: { lte: now } }],
            AND: [{ OR: [{ expireAt: null }, { expireAt: { gt: now } }] }],
          },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          include: {
            answerOptions: { orderBy: { order: "asc" } },
            regionEffective: true,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ topic, asOf: now.toISOString() });
  } catch (err) {
    console.error(`GET /api/topics/${params.slug} error:`, err);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
