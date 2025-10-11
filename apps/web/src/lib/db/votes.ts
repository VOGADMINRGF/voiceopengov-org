/** Compatibility shim for legacy "@/lib/db/votes" */
import * as tri from "@core/triMongo";
export const votesConn = asFn<any>(
  (tri as any).votesConn || (tri as any).getVotesConn || (tri as any).votes,
);
export const votesDb = () => (votesConn() as any).db ?? (votesConn() as any);
export const votesCol = (name: string) =>
  typeof (tri as any).votesCol === "function"
    ? (tri as any).votesCol(name)
    : votesDb().collection(name);

export default { votesConn, votesDb, votesCol };
