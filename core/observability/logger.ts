// packages/core/observability/logger.ts
import pino from "pino";
import { PII_REDACT_PATHS } from "../pii/redact";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [...PII_REDACT_PATHS],
    censor: "***",
  },
  transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" },
  base: { service: "VOG" },
});
