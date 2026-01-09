import type { StatementRecord, QuestionRecord } from "@features/analyze/schemas";
import { stableHash } from "@core/utils/hash";
import {
  dossierClaimsCol,
  openQuestionsCol,
  updateDossierCounts,
} from "./db";
import { logDossierRevision } from "./revisions";

export function makeDeterministicId(prefix: string, parts: Array<string | number | undefined>) {
  const payload = parts.filter(Boolean).join("|");
  return `${prefix}_${stableHash(payload).slice(0, 12)}`;
}

type SeedOptions = {
  dossierId: string;
  claims?: StatementRecord[] | null;
  questions?: QuestionRecord[] | null;
  createdByRole?: "pipeline" | "system" | "editor" | "member" | "admin";
};

export async function seedDossierFromAnalysis(options: SeedOptions) {
  const { dossierId, claims = [], questions = [], createdByRole = "pipeline" } = options;
  const now = new Date();

  if (Array.isArray(claims) && claims.length > 0) {
    const col = await dossierClaimsCol();
    for (const [idx, claim] of claims.entries()) {
      const claimId = claim.id?.trim() || makeDeterministicId("claim", [dossierId, claim.text, idx]);
      const res = await col.findOneAndUpdate(
        { dossierId, claimId },
        {
          $set: {
            text: claim.text,
            kind: "fact",
            status: "open",
            updatedAt: now,
          },
          $setOnInsert: {
            dossierId,
            claimId,
            createdByRole,
            createdAt: now,
          },
        },
        { upsert: true, returnDocument: "before", includeResultMetadata: true },
      );
      if (!res.value) {
        await logDossierRevision({
          dossierId,
          entityType: "claim",
          entityId: claimId,
          action: "create",
          diffSummary: "Claim aus Analyse uebernommen.",
          byRole: createdByRole,
        });
      }
    }
  }

  if (Array.isArray(questions) && questions.length > 0) {
    const qCol = await openQuestionsCol();
    for (const [idx, question] of questions.entries()) {
      const questionId = question.id?.trim() || makeDeterministicId("question", [dossierId, question.text, idx]);
      const res = await qCol.findOneAndUpdate(
        { dossierId, questionId },
        {
          $set: {
            text: question.text,
            status: "open",
            updatedAt: now,
          },
          $setOnInsert: {
            dossierId,
            questionId,
            createdAt: now,
          },
        },
        { upsert: true, returnDocument: "before", includeResultMetadata: true },
      );
      if (!res.value) {
        await logDossierRevision({
          dossierId,
          entityType: "open_question",
          entityId: questionId,
          action: "create",
          diffSummary: "Offene Frage aus Analyse uebernommen.",
          byRole: createdByRole,
        });
      }
    }
  }

  await updateDossierCounts(dossierId, "Dossier-Zaehler nach Analyse aktualisiert.");
}
