import StreamEvent from "@/models/core/StreamEvent";

type AppendInput = {
  kind?: "EVENT" | "METRIC" | "LOG";
  type: string;
  ts?: string | number | Date;
  sourceId?: string | null;
  partitionKey?: string | null;
  seq?: number | null;
  idempotencyKey?: string | null;
  status?: "ACCEPTED" | "APPLIED" | "REJECTED";
  topicRef?: string | null;
  statementRef?: string | null;
  userRef?: string | null;
  domainRef?: string | null;
  payload?: any;
  meta?: any;
};

// zentrale Append-Funktion mit Idempotenz
export async function appendEvent(input: AppendInput) {
  const ts = input.ts ? new Date(input.ts) : new Date();

  if (input.idempotencyKey) {
    await StreamEvent.updateOne(
      { idempotencyKey: input.idempotencyKey },
      { $setOnInsert: { ...input, ts } },
      { upsert: true }
    );
    return StreamEvent.findOne({ idempotencyKey: input.idempotencyKey }).lean();
  }

  return StreamEvent.create({ ...input, ts });
}
