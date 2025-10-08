// Kompat-Wrapper für ältere Importe wie  "@/utils/mongo/votes"
import type { Collection } from "mongodb";
import { votesCol } from "@core/triMongo";

// Falls irgendwo getVotesDb().collection("…") benutzt wird:
export async function getVotesDb() {
  return {
    collection<T = any>(name: string): Promise<Collection<T>> {
      return votesCol<T>(name);
    },
  };
}

// direkte Weitergabe – neue Aufrufe können auch votesCol(...) nutzen
export { votesCol };
