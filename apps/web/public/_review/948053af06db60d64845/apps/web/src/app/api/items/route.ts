// apps/web/src/app/api/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContentKind, PublishStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind") as ContentKind | null;
    const locale = (searchParams.get("locale") as any) || undefined;
    const regionCode = searchParams.get("region") || undefined;
    const active = searchParams.get("active") === "true";
    const latest = searchParams.get("latest") === "true";
    const take = Math.min(parseInt(searchParams.get("take") || "50", 10), 200);

    const now = new Date();

    const where: any = {
      status: PublishStatus.published,
      OR: [{ publishAt: null }, { publishAt: { lte: now } }],
      AND: [{ OR: [{ expireAt: null }, { expireAt: { gt: now } }] }],
    };
    if (kind) where.kind = kind;
    if (locale) where.locale = locale;

    // Region-Filter: wenn regionCode gesetzt, matchen wir effective Region-Hierarchie einfach (pragmatisch)
    // Vereinfachung: match per Region.code = regionCode (exakte Ebene). Hier kann später Hierarchie-Matching ergänzt werden.
    if (regionCode) {
      // Join via regionEffective -> Region.code
      const regions = await prisma.region.findMany({ where: { code: regionCode } });
      if (regions.length) where.regionEffectiveId = regions[0].id;
    }

    const items = await prisma.contentItem.findMany({
      where,
      include: {
        answerOptions: { orderBy: { order: "asc" } },
        regionEffective: true,
        topic: { select: { id: true, slug: true, title: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take,
    });

    // latest=true → pro Topic / Kind nur das jüngste
    if (latest) {
      const seen = new Set<string>();
      const filtered: typeof items = [];
      for (const it of items) {
        const key = `${it.topicId}:${it.kind}`;
        if (!seen.has(key)) {
          seen.add(key);
          filtered.push(it);
        }
      }
      return NextResponse.json(filtered);
    }

    return NextResponse.json(items);
  } catch (e: any) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch items" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
