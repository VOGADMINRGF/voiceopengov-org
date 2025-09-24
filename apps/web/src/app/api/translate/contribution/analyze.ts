// Nur Typen/Kommentar – KEIN nacktes JSON im Top-Level!
export type AnalyzeInput = {
  text: string;
  userProfile: { region: string; interests: string[]; roles: string[] };
  region: string;
  topics: string[];
  statements: string[];
  suggestions: string[];
  isNewContext: boolean;
};

/* Beispiel:
const example: AnalyzeInput = {
  text: "...",
  userProfile: { region: "Sachsen-Anhalt", interests: ["Umwelt","Teilhabe"], roles: ["Bürgerin"] },
  region: "Sachsen-Anhalt",
  topics: ["Migration"],
  statements: ["..."],
  suggestions: ["..."],
  isNewContext: true
};
*/
