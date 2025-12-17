import { callE150Orchestrator } from "@features/ai/orchestratorE150";
import { AnalyzeResultSchema } from "@features/analyze/schemas";
import type { AiErrorKind } from "@core/telemetry/aiUsageTypes";

const SAMPLE_TEXT =
  "In unserer Stadt soll ein autofreier Sonntag pro Monat eingeführt werden, um die Luftqualität zu verbessern und den ÖPNV zu stärken. Gleichzeitig gibt es Bedenken wegen Umsatzeinbußen im Einzelhandel und fehlender Barrierefreiheit für ältere Menschen.";

type ProviderReport = {
  provider: string;
  ok: boolean;
  errorKind: AiErrorKind | null;
  durationMs: number;
  message?: string;
};

function cleanJson(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    const firstNewline = cleaned.indexOf("\n");
    if (firstNewline !== -1) cleaned = cleaned.slice(firstNewline + 1);
    const lastFence = cleaned.lastIndexOf("```");
    if (lastFence !== -1) cleaned = cleaned.slice(0, lastFence);
    cleaned = cleaned.trim();
  }
  return cleaned;
}

function validateCandidate(rawText: string): { ok: boolean; errorKind: AiErrorKind | null; message?: string } {
  try {
    const parsed = JSON.parse(cleanJson(rawText));
    const normalized = {
      mode: parsed.mode ?? "E150",
      sourceText: parsed.sourceText ?? SAMPLE_TEXT,
      language: parsed.language ?? "de",
      claims: parsed.claims ?? [],
      notes: parsed.notes ?? [],
      questions: parsed.questions ?? [],
      knots: parsed.knots ?? [],
      consequences: parsed.consequences,
      responsibilityPaths: parsed.responsibilityPaths,
      eventualities: parsed.eventualities,
      decisionTrees: parsed.decisionTrees,
    };
    const result = AnalyzeResultSchema.safeParse(normalized);
    if (!result.success) {
      return { ok: false, errorKind: "BAD_JSON", message: result.error.message };
    }
    return { ok: true, errorKind: null };
  } catch (err: any) {
    return { ok: false, errorKind: "BAD_JSON", message: err?.message ?? "parse failed" };
  }
}

async function main() {
  console.log("▶️  Running E150 full smoke with sample text…");
  const orchestrated = await callE150Orchestrator({
    systemPrompt:
      "You are the E150 orchestrator. Return strictly valid JSON for contribution analysis, including claims, notes, questions and knots.",
    userPrompt: SAMPLE_TEXT,
    maxTokens: 1_600,
    timeoutMs: 15_000,
    requiredCapability: "core_analysis",
    telemetry: { pipeline: "orchestrator_smoke" },
  });

  const providers = new Set<string>([
    ...orchestrated.meta.usedProviders,
    ...(orchestrated.meta.failedProviders ?? []).map((f) => f.provider),
  ]);

  const rows: ProviderReport[] = [];
  for (const provider of providers) {
    const candidate = orchestrated.candidates.find((c) => c.provider === provider);
    const failure = orchestrated.meta.failedProviders.find((f) => f.provider === provider);
    if (candidate) {
      const validation = validateCandidate(candidate.rawText);
      rows.push({
        provider,
        ok: validation.ok,
        errorKind: validation.errorKind,
        durationMs: orchestrated.meta.timings[provider as keyof typeof orchestrated.meta.timings] ?? candidate.durationMs,
        message: validation.message,
      });
      continue;
    }
    rows.push({
      provider,
      ok: false,
      errorKind: failure?.errorKind ?? "UNKNOWN",
      durationMs: orchestrated.meta.timings[provider as keyof typeof orchestrated.meta.timings] ?? 0,
      message: failure?.error ?? "keine Antwort",
    });
  }

  console.table(
    rows.map((r) => ({
      Provider: r.provider,
      OK: r.ok,
      ErrorKind: r.errorKind ?? "",
      DauerMs: r.durationMs,
      Hinweis: r.message ?? "",
    })),
  );

  const successes = rows.filter((r) => r.ok).length;
  console.log(`✅ ${successes}/${rows.length} Provider lieferten schema-konforme Antworten.`);
}

main().catch((err) => {
  console.error("E150 full smoke failed", err);
  process.exitCode = 1;
});
