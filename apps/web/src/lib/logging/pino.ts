import { createRequire } from "node:module";
import pino from "pino";

const require = createRequire(import.meta.url);

function resolvePrettyTransport() {
  if (process.env.NODE_ENV !== "development") return undefined;
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
  transport: resolvePrettyTransport(),
});
