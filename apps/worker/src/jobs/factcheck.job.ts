import type { Job } from "bullmq";

type FactcheckPayload = {
  statementId: string;
  lang?: string;
  claims?: Array<{ text: string }>;
  // … weitere Felder, die du enqueue-st
};

export async function factcheckProcessor(job: Job<FactcheckPayload>) {
  console.log("[factcheck] received", job.id, job.data);
  // 1) Statement + Claims laden/verifizieren
  // 2) GPT/Provider(s) aufrufen
  // 3) Ergebnisse persistieren / Events feuern
}
