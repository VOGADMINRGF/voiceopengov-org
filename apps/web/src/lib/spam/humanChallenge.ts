export type HumanChallenge = {
  id: string;
  prompt: string;
  answers: string[];
  helper?: string;
};

const HUMAN_CHALLENGES: HumanChallenge[] = [
  {
    id: "farbe",
    prompt: "Schreib bitte das Wort \"blau\" in dieses Feld.",
    answers: ["blau"],
  },
  {
    id: "zahl",
    prompt: "Wieviel ist drei plus fünf? (nur die Zahl eingeben)",
    answers: ["8", "acht"],
  },
  {
    id: "planet",
    prompt: "Auf welchem Planeten leben wir? (\"Erde\")",
    answers: ["erde", "die erde"],
  },
  {
    id: "voice",
    prompt: "Wie heißt unser Projekt? Bitte \"voiceopengov\" eingeben.",
    answers: ["voiceopengov", "voice open gov"],
  },
];

const HUMAN_CHALLENGE_MAP = new Map(HUMAN_CHALLENGES.map((entry) => [entry.id, entry]));

export function pickHumanChallenge(): HumanChallenge {
  const idx = Math.floor(Math.random() * HUMAN_CHALLENGES.length);
  return HUMAN_CHALLENGES[idx];
}

function normalizeAnswer(value: unknown) {
  if (typeof value !== "string") return "";
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function verifyHumanChallenge(input: { id?: string; answer?: string }) {
  const question = HUMAN_CHALLENGE_MAP.get(input.id || "");
  if (!question) return { ok: false as const, code: "unknown_question" as const };

  const normalized = normalizeAnswer(input.answer);
  if (!normalized) return { ok: false as const, code: "missing_answer" as const };

  const matches = question.answers.some((candidate) => normalizeAnswer(candidate) === normalized);
  return matches ? { ok: true as const } : { ok: false as const, code: "wrong_answer" as const };
}
