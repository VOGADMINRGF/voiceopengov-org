// features/ai/e150/providers.ts
import type { AiProviderName } from "@core/telemetry/aiUsageTypes";

export type ProviderCapability =
  | "core_analysis"
  | "impact"
  | "responsibility"
  | "report"
  | "search";

/**
 * Capability-Matrix für E150.
 *
 * Wichtig: Diese Datei importiert bewusst nichts Externes (kein providerMatrix o.ä.).
 * Der Orchestrator nutzt sie nur fürs Gatekeeping (z.B. "Gemini nicht mehr skipped").
 */
export const PROVIDER_CAPABILITIES: Record<
  AiProviderName,
  readonly ProviderCapability[]
> = {
  openai: ["core_analysis", "impact", "responsibility", "report"],
  anthropic: ["core_analysis", "impact", "responsibility", "report"],
  mistral: ["core_analysis", "impact", "responsibility", "report"],

  // FIX: Gemini war bei dir "skipped" wegen missing core_analysis
  gemini: ["core_analysis", "impact", "responsibility", "report"],

  // You.com / ARI
  ari: ["core_analysis", "impact", "responsibility", "report", "search"],
  youcom: ["core_analysis", "impact", "responsibility", "report", "search"],
} as const;

export function providerSupports(
  provider: AiProviderName,
  required: ProviderCapability,
): boolean {
  const caps = PROVIDER_CAPABILITIES[provider] ?? [];
  return caps.includes(required);
}
