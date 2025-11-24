// features/ai/providers/anthropic.ts
import { withMetrics } from "../orchestrator";

const API_BASE = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(
  /\/+$/,
  "",
);
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
const VERSION = process.env.ANTHROPIC_VERSION || "2023-06-01";

export type AskArgs = {
  prompt: string;
  maxOutputTokens?: number;
  signal?: AbortSignal;
};

export type AskResult = {
  text: string;
  raw: any;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
};

function extractText(data: any): string {
  try {
    const first = data?.content?.[0];
    if (typeof first?.text === "string") return first.text.trim();
    const nested = first?.content?.[0]?.text;
    if (typeof nested === "string") return nested.trim();
  } catch {
    // ignore
  }
  return "";
}

async function post(body: Record<string, unknown>, signal?: AbortSignal) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY fehlt");
  }

  const res = await fetch(`${API_BASE}/v1/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": VERSION,
      "x-api-key": process.env.ANTHROPIC_API_KEY,
    },
    body: JSON.stringify(body),
    signal,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    const err: any = new Error(`Anthropic error ${res.status}: ${msg}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

async function askAnthropic({
  prompt,
  maxOutputTokens = 1200,
  signal,
}: AskArgs): Promise<AskResult> {
  if (!prompt) throw new Error("prompt darf nicht leer sein");

  const body = {
    model: MODEL,
    max_tokens: maxOutputTokens,
    system:
      "Return strictly valid JSON (RFC8259). No explanations, no Markdown, no code fences.",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const data = await post(body, signal);
  return {
    text: extractText(data),
    raw: data,
    model: data?.model,
    tokensIn: data?.usage?.input_tokens,
    tokensOut: data?.usage?.output_tokens,
  };
}

function jsonOk(result: AskResult) {
  if (!result?.text) return false;
  try {
    JSON.parse(result.text);
    return true;
  } catch {
    return false;
  }
}

export const callAnthropic = withMetrics<Parameters<typeof askAnthropic>, AskResult>(
  "anthropic",
  askAnthropic,
  { jsonOk },
);

export default callAnthropic;
