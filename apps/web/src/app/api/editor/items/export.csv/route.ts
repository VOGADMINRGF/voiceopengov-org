import { prisma } from "@lib/prisma";

export async function GET() {
  const items = await prisma.contentItem.findMany({
    include: { regionEffective: true, topic: true, answerOptions: { orderBy: { order: "asc" } } },
    orderBy: [{ createdAt: "desc" }],
    take: 1000,
  });

  const header = [
    "id","kind","status","locale","topicSlug","title","text",
    "publishAt","expireAt","regionCode","answerOptions"
  ];
  const lines = [header.join(",")];

  const esc = (s: any) => {
    const v = s == null ? "" : String(s);
    if (v.includes(",") || v.includes("\n") || v.includes("\"")) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };

  for (const it of items) {
    const row = [
      it.id,
      it.kind,
      it.status,
      it.locale,
      it.topic?.slug ?? "",
      it.title ?? "",
      it.text.replace(/\s+/g, " ").slice(0, 500),
      it.publishAt?.toISOString() ?? "",
      it.expireAt?.toISOString() ?? "",
      it.regionEffective?.code ?? "",
      (it.answerOptions ?? []).map(o => `${o.label}:${o.value}`).join("|"),
    ].map(esc);
    lines.push(row.join(","));
  }

  const csv = lines.join("\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="items_export.csv"',
      "cache-control": "no-store",
    },
  });
}
