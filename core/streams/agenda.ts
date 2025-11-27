import { coreCol, ObjectId } from "@core/db/triMongo";
import { streamAgendaCol, streamSessionsCol } from "@features/stream/db";
import type { StreamAgendaItemDoc, StreamSessionDoc } from "@features/stream/types";
import { randomUUID } from "node:crypto";

export type BuildAgendaOptions = {
  sessionId: string;
  locale?: string;
};

const FALLBACK_ITEMS: Array<Omit<StreamAgendaItemDoc, "sessionId" | "creatorId" | "createdAt" | "updatedAt">> = [
  {
    kind: "info",
    status: "queued",
    description: "Einführung & Kontext – Worum geht es, warum jetzt?",
    allowAnonymousVoting: true,
    publicAttribution: "hidden",
  },
  {
    kind: "statement",
    status: "queued",
    description: "Kern-Statements und Perspektiven vorstellen (Pro/Contra/Neutral).",
    allowAnonymousVoting: true,
    publicAttribution: "hidden",
  },
  {
    kind: "question",
    status: "queued",
    customQuestion: "Welche offenen Fragen und Unsicherheiten müssen wir klären?",
    allowAnonymousVoting: true,
    publicAttribution: "hidden",
  },
  {
    kind: "info",
    status: "queued",
    description: "Mögliche nächste Schritte und Beteiligungsoptionen.",
    allowAnonymousVoting: true,
    publicAttribution: "hidden",
  },
];

async function loadSession(sessionId: string): Promise<StreamSessionDoc | null> {
  if (!ObjectId.isValid(sessionId)) return null;
  const col = await streamSessionsCol();
  return col.findOne({ _id: new ObjectId(sessionId) });
}

async function fetchTopicStatements(topicKey?: string | null): Promise<
  Array<{ id: string; title?: string | null; text?: string | null }>
> {
  if (!topicKey) return [];
  const col = await coreCol("statements");
  const docs = await col
    .find({ topic: topicKey })
    .project({ id: 1, title: 1, text: 1 })
    .limit(5)
    .toArray();
  return docs.map((doc: any) => ({
    id: doc.id ?? doc._id?.toString?.() ?? randomUUID(),
    title: doc.title ?? null,
    text: doc.text ?? null,
  }));
}

export async function buildAgendaForSession(options: BuildAgendaOptions): Promise<StreamAgendaItemDoc[]> {
  const session = await loadSession(options.sessionId);
  if (!session) throw new Error("SESSION_NOT_FOUND");

  const topicItems = await fetchTopicStatements(session.topicKey ?? null);
  const now = new Date();

  if (topicItems.length === 0) {
    return FALLBACK_ITEMS.map((item, idx) => ({
      ...item,
      sessionId: new ObjectId(options.sessionId),
      creatorId: session.creatorId,
      order: idx,
      createdAt: now,
      updatedAt: now,
    }));
  }

  const agenda: StreamAgendaItemDoc[] = [];

  agenda.push({
    sessionId: new ObjectId(options.sessionId),
    creatorId: session.creatorId,
    kind: "info",
    status: "queued",
    description: "Einführung & Kontext zum Thema",
    allowAnonymousVoting: true,
    publicAttribution: "hidden",
    order: 0,
    createdAt: now,
    updatedAt: now,
  });

  topicItems.slice(0, 3).forEach((stmt, idx) => {
    agenda.push({
      sessionId: new ObjectId(options.sessionId),
      creatorId: session.creatorId,
      kind: "statement",
      status: "queued",
      statementId: stmt.id,
      description: stmt.title || stmt.text || "Statement aus dem Thema",
      allowAnonymousVoting: true,
      publicAttribution: "hidden",
      order: agenda.length,
      createdAt: now,
      updatedAt: now,
    });
  });

  agenda.push({
    sessionId: new ObjectId(options.sessionId),
    creatorId: session.creatorId,
    kind: "question",
    status: "queued",
    customQuestion: "Welche offenen Fragen/Unsicherheiten siehst du?",
    allowAnonymousVoting: true,
    publicAttribution: "hidden",
    order: agenda.length,
    createdAt: now,
    updatedAt: now,
  });

  agenda.push({
    sessionId: new ObjectId(options.sessionId),
    creatorId: session.creatorId,
    kind: "info",
    status: "queued",
    description: "Abschluss & nächste Schritte",
    allowAnonymousVoting: true,
    publicAttribution: "hidden",
    order: agenda.length,
    createdAt: now,
    updatedAt: now,
  });

  return agenda;
}

export async function applyAutofilledAgendaToSession(sessionId: string, locale?: string) {
  const session = await loadSession(sessionId);
  if (!session) throw new Error("SESSION_NOT_FOUND");

  const agendaItems = await buildAgendaForSession({ sessionId, locale });
  const col = await streamAgendaCol();
  await col.deleteMany({ sessionId: new ObjectId(sessionId) });
  if (agendaItems.length) {
    await col.insertMany(agendaItems, { ordered: true });
  }
  return { session, agenda: agendaItems };
}
