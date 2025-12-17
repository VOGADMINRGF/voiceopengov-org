// packages/core/observability/logger.ts
import { createRequire } from "node:module";
import pino from "pino";
import { PII_REDACT_PATHS } from "../pii/redact";

const require = createRequire(import.meta.url);

function resolvePrettyTransport() {
  if (process.env.NODE_ENV === "production") return undefined;
  try {
    return { target: require.resolve("pino-pretty") };
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[logger] pino-pretty missing, falling back to JSON logs");
    }
    return undefined;
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [...PII_REDACT_PATHS],
    censor: "***",
  },
  transport: resolvePrettyTransport(),
  base: { service: "VOG" },
});
