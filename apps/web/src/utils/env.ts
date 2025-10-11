import { z } from "zod";

/**
 * Striktes Env-Layer:
 *  - feste Schlüssel (Required), sinnvolle Defaults nur wo unkritisch
 *  - Alias-Felder für bestehenden Code (MODEL, TIMEOUT_MS, MONGO_URI, EMAIL_DEFAULT_FROM, NEO4J_PASS)
 *  - Fail-fast bei fehlenden Pflichtwerten
 */
const BaseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // AUTH / SECURITY
  JWT_SECRET: z.string().min(10, "JWT_SECRET too short"),
  BCRYPT_ROUNDS: z.coerce.number().int().positive().default(12),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
  EDITOR_TOKEN: z.string().optional(),

  // EMAIL
  SMTP_FROM: z.string().min(1),

  // MONGODB (Repo nutzt teils MONGO_URI)
  MONGODB_URI: z.string().min(1),
  MONGODB_DB: z.string().optional(),

  // GRAPH: Neo4j
  NEO4J_URI: z.string().min(1),
  NEO4J_USER: z.string().min(1),
  NEO4J_PASSWORD: z.string().min(1),

  // GRAPH: Arango
  ARANGO_URL: z.string().min(1),
  ARANGO_DB: z.string().min(1),
  ARANGO_USER: z.string().min(1),
  ARANGO_ROOT_PASSWORD: z.string().min(1),

  // GRAPH: Memgraph (User/Pass optional)
  MEMGRAPH_URI: z.string().min(1),
  MEMGRAPH_USER: z.string().optional(),
  MEMGRAPH_PASSWORD: z.string().optional(),

  // AI / PROVIDER
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().min(1),
  OPENAI_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  // Bei dir nicht im example → wir geben einen sicheren Default, damit TS & Runtime stabil sind
  OPENAI_URL: z.string().url().default("https://api.openai.com/v1/chat/completions"),
});

const p = BaseSchema.parse({
  NODE_ENV: process.env.NODE_ENV,

  JWT_SECRET: process.env.JWT_SECRET,
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS,
  SESSION_TTL_DAYS: process.env.SESSION_TTL_DAYS,
  EDITOR_TOKEN: process.env.EDITOR_TOKEN,

  SMTP_FROM: process.env.SMTP_FROM,

  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB,

  NEO4J_URI: process.env.NEO4J_URI,
  NEO4J_USER: process.env.NEO4J_USER,
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,

  ARANGO_URL: process.env.ARANGO_URL,
  ARANGO_DB: process.env.ARANGO_DB,
  ARANGO_USER: process.env.ARANGO_USER,
  ARANGO_ROOT_PASSWORD: process.env.ARANGO_ROOT_PASSWORD,

  MEMGRAPH_URI: process.env.MEMGRAPH_URI,
  MEMGRAPH_USER: process.env.MEMGRAPH_USER,
  MEMGRAPH_PASSWORD: process.env.MEMGRAPH_PASSWORD,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  OPENAI_TIMEOUT_MS: process.env.OPENAI_TIMEOUT_MS,
  OPENAI_URL:
    process.env.OPENAI_URL ??
    "https://api.openai.com/v1/chat/completions",
});

/** Export mit Alias-Feldern für bestehenden Code */
export const env = {
  ...p,

  // Aliasse (stets definiert):
  EMAIL_DEFAULT_FROM: p.SMTP_FROM,
  MONGO_URI: p.MONGODB_URI,
  MODEL: p.OPENAI_MODEL,
  TIMEOUT_MS: p.OPENAI_TIMEOUT_MS,
  NEO4J_PASS: p.NEO4J_PASSWORD,
};
