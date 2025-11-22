import { callOpenAI } from "./providers/openai";
import { bundleYoutubeSources } from "./sources/youtube";

export type OrchestratorRun = {
  provider: "openai" | "gemini" | "anthropic" | "mistral";
  ok: boolean;
  text: string;
  ms?: number;
  error?: string;
  skipped?: boolean;
  raw?: any;
};

export async function orchestrateContribution(
  prompt: string,
  opts: { json?: boolean; youtubeUrls?: string[] } = {}
): Promise<{ runs: OrchestratorRun[]; best: OrchestratorRun | null }> {
  const runs: OrchestratorRun[] = [];

  // (1) Quellen vorziehen: YouTube-Transkripte bündeln (vendor-neutral)
  let enrichedPrompt = prompt;
  if (opts.youtubeUrls?.length) {
    const bundle = await bundleYoutubeSources(opts.youtubeUrls);
    if (bundle) {
      enrichedPrompt = `${prompt}\n\n---\nSOURCES (YouTube transcripts)\n${bundle}`;
    }
  }

  // (2) GPT-first, danach Anthropic/Mistral
  runs.push({ provider: "openai", ...(await runProvider(callOpenAI, enrichedPrompt, opts)) });

  const success = runs.find((r) => r.ok && r.text);
  const best = success || runs.sort((a, b) => (b.text?.length || 0) - (a.text?.length || 0))[0] || null;

  return { runs, best };
}

type ProviderFn = (args: { prompt: string; asJson?: boolean }) => Promise<{ text: string; raw: any }>;

async function runProvider(fn: ProviderFn, prompt: string, opts: { json?: boolean }) {
  const started = Date.now();
  try {
    const res = await fn({ prompt, asJson: opts.json });
    return { ok: true, text: res.text ?? "", raw: res.raw, ms: Date.now() - started };
  } catch (error: any) {
    return { ok: false, text: "", error: String(error?.message || error), ms: Date.now() - started };
  }
}
