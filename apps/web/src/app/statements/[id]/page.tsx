// apps/web/src/app/statements/[id]/page.tsx
export const dynamic = "force-dynamic";

import "server-only";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { coreCol } from "@/utils/triMongo";                 // ⬅️ triMongo statt getCoreCol
import StatementDetailClient from "@features/statement/components/StatementDetailClient";

type Stats = { votesTotal: number; votesAgree: number; votesNeutral: number; votesDisagree: number };

export default async function StatementPage({ params }: { params: { id: string } }) {
  const stmts = await coreCol<any>("statements");

  // Selector: unterstützt sowohl neue _id (ObjectId) als auch altes id-Feld (String)
  const selector = ObjectId.isValid(params.id)
    ? { _id: new ObjectId(params.id) }
    : { id: params.id };

  // Keine Projection, damit _id für Fallback verfügbar bleibt
  const doc = await stmts.findOne(selector);
  if (!doc) return notFound();

  // Einheitliche ID & Inhalt (neu: text, alt: content)
  const statementId: string = doc.id ?? String(doc._id);
  const content: string | undefined = doc.text ?? doc.content ?? undefined;

  // Initiale Stats (Fallback)
  const stats: Stats = doc.stats ?? {
    votesTotal: 0,
    votesAgree: 0,
    votesNeutral: 0,
    votesDisagree: 0,
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        {doc.category && <p className="text-sm text-neutral-500">{doc.category}</p>}
      </header>

      {content && <p className="text-lg leading-relaxed">{content}</p>}

      <StatementDetailClient statementId={statementId} initialStats={stats} />

      {/* Optional: Analyse-Block (legacy) */}
      {doc.analysis?.summary && (
        <section className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Analyse</h2>
          <pre className="text-sm whitespace-pre-wrap">{doc.analysis.summary}</pre>
        </section>
      )}
    </div>
  );
}
