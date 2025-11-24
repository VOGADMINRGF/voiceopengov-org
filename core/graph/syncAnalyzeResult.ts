import crypto from "node:crypto";
import type { AnalyzeResult } from "@features/analyze/schemas";
import { getGraphDriver } from "./driver";

type SyncArgs = {
  result: AnalyzeResult;
  locale?: string;
  sourceId?: string;
};

export async function syncAnalyzeResultToGraph({ result, locale, sourceId }: SyncArgs) {
  const driver = getGraphDriver();
  if (!driver) return false;

  const session = driver.session();
  const resolvedSourceId =
    sourceId ||
    crypto.createHash("sha1").update(result.sourceText).digest("hex").slice(0, 32);

  const claimsPayload = result.claims.map((claim, index) => {
    const claimIndex =
      typeof (claim as any).index === "number"
        ? (claim as any).index
        : typeof (claim as any).statementIndex === "number"
          ? (claim as any).statementIndex
          : index;

    return {
      id: claim.id || `${resolvedSourceId}-claim-${index}`,
      text: claim.text,
      responsibility: claim.responsibility ?? null,
      topic: claim.topic ?? claim.domain ?? null,
      statementIndex: claimIndex,
      locale: locale ?? result.language ?? "de",
    };
  });

  const knotsPayload = (result.knots ?? []).map((knot) => ({
    id: knot.id,
    label: knot.label,
    description: knot.description,
  }));

  const responsibilities = result.consequences?.responsibilities ?? [];

  try {
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $claims AS claim
        MERGE (s:Statement {id: claim.id})
        SET s.text = claim.text,
            s.locale = claim.locale,
            s.updatedAt = timestamp(),
            s.topic = claim.topic,
            s.sourceId = $sourceId,
            s.responsibility = claim.responsibility
        WITH s
        WHERE s.topic IS NOT NULL
        MERGE (t:Topic {name: s.topic})
        MERGE (s)-[:BELONGS_TO_TOPIC]->(t)
        `,
        { claims: claimsPayload, sourceId: resolvedSourceId },
      ),
    );

    if (knotsPayload.length > 0) {
      await session.executeWrite((tx) =>
        tx.run(
          `
          UNWIND $knots AS knot
          MERGE (k:Knot {id: knot.id})
          SET k.label = knot.label,
              k.description = knot.description
          MERGE (source:Source {id: $sourceId})
          MERGE (source)-[:FEATURES]->(k)
          `,
          { knots: knotsPayload, sourceId: resolvedSourceId },
        ),
      );
    }

    if (responsibilities.length > 0) {
      await session.executeWrite((tx) =>
        tx.run(
          `
          UNWIND $responsibilities AS resp
          MERGE (r:Responsibility {id: resp.id})
          SET r.level = resp.level,
              r.actor = resp.actor,
              r.text = resp.text,
              r.relevance = resp.relevance
          MERGE (source:Source {id: $sourceId})
          MERGE (source)-[:ASSIGNS]->(r)
          `,
          { responsibilities, sourceId: resolvedSourceId },
        ),
      );
    }

    return true;
  } catch (error) {
    console.error("[graph] syncAnalyzeResultToGraph failed", error);
    return false;
  } finally {
    await session.close();
  }
}
