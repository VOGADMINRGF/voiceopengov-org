// apps/web/src/app/statements/[id]/page.tsx
export const dynamic = "force-dynamic";
import { ObjectId } from "@core/db/triMongo";
import { notFound } from "next/navigation";

import type {
  ConsequenceRecord,
  ResponsibilityPath,
  ResponsibilityRecord,
} from "@features/analyze/schemas";
import StatementDetailClient from "@features/statement/components/StatementDetailClient";
import {
  ConsequencesPreviewCard,
  ResponsibilityPreviewCard,
} from "@features/statement/components/StatementImpactPreview";

type Stats = {
  votesTotal: number;
  votesAgree: number;
  votesNeutral: number;
  votesDisagree: number;
};

export default async function StatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tri: any = await import("@core/db/triMongo");
  const stmts = tri.coreCol
    ? await tri.coreCol("statements")
    : (await tri.getDb()).collection("statements");

  const selector = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { id };

  const doc = await stmts.findOne(selector);
  if (!doc) return notFound();

  const statementId: string = doc.id ?? String(doc._id);
  const content: string | undefined = doc.text ?? doc.content ?? undefined;

  const stats: Stats = doc.stats ?? {
    votesTotal: 0,
    votesAgree: 0,
    votesNeutral: 0,
    votesDisagree: 0,
  };

  const analysis = doc.analysis ?? null;
  const consequenceBundle = analysis?.consequences;
  const consequences: ConsequenceRecord[] = Array.isArray(consequenceBundle?.consequences)
    ? consequenceBundle.consequences
    : [];
  const responsibilities: ResponsibilityRecord[] = Array.isArray(consequenceBundle?.responsibilities)
    ? consequenceBundle.responsibilities
    : [];
  const responsibilityPaths: ResponsibilityPath[] = Array.isArray(analysis?.responsibilityPaths)
    ? analysis.responsibilityPaths
    : [];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        {doc.category && (
          <p className="text-sm text-neutral-500">{doc.category}</p>
        )}
      </header>

      {content && <p className="text-lg leading-relaxed">{content}</p>}

      <section className="grid gap-4 md:grid-cols-2">
        <ConsequencesPreviewCard
          consequences={consequences}
          responsibilities={responsibilities}
        />
        <ResponsibilityPreviewCard
          responsibilities={responsibilities}
          paths={responsibilityPaths}
          showPathOverlay
          overlayButtonLabel="Zuständigkeitsweg anzeigen"
        />
      </section>

      <StatementDetailClient statementId={statementId} initialStats={stats} />

      {doc.analysis?.summary && (
        <section className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Analyse</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {doc.analysis.summary}
          </pre>
        </section>
      )}
    </div>
  );
}
