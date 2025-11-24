// apps/web/src/lib/logger.ts
import pino from "pino";
import { PII_REDACT_PATHS } from "@core/pii/redact";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: [...PII_REDACT_PATHS, "user.mfaSecret"],
    censor: "***",
  },
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty" }
      : undefined,
});
