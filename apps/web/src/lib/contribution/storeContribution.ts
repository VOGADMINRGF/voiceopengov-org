// apps/web/src/lib/contribution/storeContribution.ts
import { prismaWeb } from "@/lib/dbWeb";
import type { AnalyzedStatement, TopicScore } from "@/types/contribution";

export async function storeContribution(opts: {
  originalText: string;
  regionCodeOrName?: string | null;
  userId?: string | null;
  topics: TopicScore[];
  statements: AnalyzedStatement[];
  translations?: Record<string, string[]>; // pro Sprache je Statement ein String
}) {
  const region = opts.regionCodeOrName
    ? await prismaWeb.region.findFirst({
        where: { OR: [{ code: opts.regionCodeOrName }, { name: opts.regionCodeOrName }] },
      })
    : null;

  const created = await prismaWeb.contribution.create({
    data: {
      originalText: opts.originalText,
      userId: opts.userId ?? null,
      regionId: region?.id ?? null,
      topicsJson: opts.topics as any,
      translationsJson: (opts.translations ?? null) as any,
      statements: {
        create: opts.statements.map((s, idx) => ({
          text: s.text,
          type: s.type,
          polarity: s.polarity,
          order: idx,
        })),
      },
    },
    select: { id: true },
  });

  return created;
}
