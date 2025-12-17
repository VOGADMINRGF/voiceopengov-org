export type E150Question = {
  id: string;
  text: string;
  tags: string[];
  level: "basis" | "vertieft";
};

export const E150_QUESTION_CATALOG: E150Question[] = [
  { id: "recht-1", text: "Welche rechtlichen Grundlagen sind für den Vorschlag maßgeblich?", tags: ["recht"], level: "basis" },
  { id: "recht-2", text: "Welche Genehmigungen oder Gesetzesänderungen wären erforderlich?", tags: ["recht"], level: "vertieft" },
  { id: "fakten-1", text: "Welche belastbaren Daten stützen die zentrale Behauptung?", tags: ["faktenlage"], level: "basis" },
  { id: "fakten-2", text: "Welche Annahmen sind unbelegt oder müssten noch geprüft werden?", tags: ["faktenlage"], level: "vertieft" },
  { id: "international-1", text: "Gibt es vergleichbare Beispiele aus anderen Ländern oder Städten?", tags: ["international"], level: "basis" },
  { id: "international-2", text: "Welche internationalen Standards oder Verpflichtungen sind relevant?", tags: ["international", "recht"], level: "vertieft" },
  { id: "betroffene-1", text: "Welche Gruppen wären besonders betroffen und wie können sie einbezogen werden?", tags: ["betroffene", "gesellschaftlich"], level: "basis" },
  { id: "kosten-1", text: "Welche Kosten entstehen und wie sollen sie finanziert werden?", tags: ["finanzen"], level: "basis" },
  { id: "wirkung-1", text: "Welche positiven und negativen Folgen sind kurzfristig zu erwarten?", tags: ["impact", "gesellschaftlich"], level: "basis" },
  { id: "wirkung-2", text: "Welche langfristigen Nebenwirkungen könnten auftreten?", tags: ["impact", "gesellschaftlich"], level: "vertieft" },
];

export function selectE150Questions(
  tags: string[],
  level: "basis" | "vertieft",
  max = 5,
): E150Question[] {
  const normalized = tags.map((t) => t.toLowerCase());
  const matches = E150_QUESTION_CATALOG.filter((q) => {
    if (q.level !== level) return false;
    return q.tags.some((t) => normalized.includes(t.toLowerCase()));
  });
  const fallback = E150_QUESTION_CATALOG.filter((q) => q.level === level);
  const pool = matches.length ? matches : fallback;
  const unique: E150Question[] = [];
  for (const q of pool) {
    if (unique.find((x) => x.text === q.text)) continue;
    unique.push(q);
    if (unique.length >= max) break;
  }
  return unique;
}
