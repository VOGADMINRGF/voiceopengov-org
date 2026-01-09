import { coreCol, ObjectId } from "@core/db/triMongo";

export type StatementDoc = {
  _id?: ObjectId;
  id?: string;
  title?: string;
  text?: string;
  analysis?: any;
};

export function getCanonicalStatementId(statement: StatementDoc | null | undefined, fallbackId: string) {
  if (statement?.id) return String(statement.id);
  if (statement?._id) return String(statement._id);
  return fallbackId;
}

export function getStatementAliases(statement: StatementDoc | null | undefined) {
  const aliases = new Set<string>();
  if (statement?.id) aliases.add(String(statement.id));
  if (statement?._id) aliases.add(String(statement._id));
  return [...aliases];
}

export async function loadStatementByAnyId(statementId: string) {
  const stmts = await coreCol<StatementDoc>("statements");
  if (ObjectId.isValid(statementId)) {
    const doc = await stmts.findOne({ _id: new ObjectId(statementId) });
    if (doc) return doc;
  }
  return stmts.findOne({ id: statementId });
}
