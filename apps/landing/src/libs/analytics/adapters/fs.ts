import { promises as fs } from "fs";
import path from "path";

export type AnalyticsRecord = {
  ts: number;
  type: "pageview" | "event";
  name: string;
  path?: string;
  locale?: string;
  payload?: unknown;
  ip?: string;
  ua?: string;
};

const FILE = path.join(process.cwd(), "data", "analytics.json");

async function ensureFile() {
  const dir = path.dirname(FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

export async function appendRecord(rec: AnalyticsRecord) {
  await ensureFile();
  let arr: unknown = [];
  try {
    const raw = await fs.readFile(FILE, "utf8");
    arr = JSON.parse(raw);
  } catch {
    arr = [];
  }
  // 🚑 robust: wenn kein Array, zurücksetzen
  if (!Array.isArray(arr)) arr = [];
  (arr as AnalyticsRecord[]).push(rec);
  const trimmed = (arr as AnalyticsRecord[]).slice(-10000);
  await fs.writeFile(FILE, JSON.stringify(trimmed, null, 2), "utf8");
}
