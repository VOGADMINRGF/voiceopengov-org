import { getMongoDb } from "@/lib/db/mongo";

export type ReviewTarget =
  | {
      type: "supporter";
      doc: any;
    }
  | {
      type: "initiative";
      doc: any;
    };

export async function findReviewTarget(tokenHash: string): Promise<ReviewTarget | null> {
  const db = await getMongoDb();
  const now = new Date();

  const supporter = await db.collection("supporters_pii").findOne({
    reviewTokenHash: tokenHash,
    reviewTokenExpiresAt: { $gt: now },
  });
  if (supporter) return { type: "supporter", doc: supporter };

  const initiative = await db.collection("initiative_intake").findOne({
    reviewTokenHash: tokenHash,
    reviewTokenExpiresAt: { $gt: now },
  });
  if (initiative) return { type: "initiative", doc: initiative };

  return null;
}
