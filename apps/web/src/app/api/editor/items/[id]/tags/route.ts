import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const tagIds = Array.isArray(body.tagIds) ? body.tagIds as string[] : [];
    const exists = await prisma.contentItem.findUnique({ where: { id: params.id } });
    if (!exists) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    // hard-replace
    await prisma.itemTag.deleteMany({ where: { itemId: params.id } });
    if (tagIds.length) {
      await prisma.itemTag.createMany({
        data: tagIds.map(tid => ({ itemId: params.id, tagId: tid })),
        skipDuplicates: true,
      });
    }
    const withTags = await prisma.contentItem.findUnique({
      where: { id: params.id },
      include: { tags: { include: { tag: true } } },
    });
    return NextResponse.json(withTags);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update tags failed" }, { status: 500 });
  }
}
