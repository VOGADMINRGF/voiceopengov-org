
import fs from "node:fs";
import path from "node:path";

const dataPath = path.join(process.cwd(), "data", "analytics.json");

export type Event = { t: string; path?: string; ts: number };

export function append(e: Event) {
  try {
    const raw = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : '{"events":[]}';
    const json = JSON.parse(raw);
    json.events.push(e);
    fs.writeFileSync(dataPath, JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("analytics append failed", err);
  }
}

export function all() {
  try {
    const raw = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : '{"events":[]}';
    const json = JSON.parse(raw);
    return json.events as Event[];
  } catch {
    return [];
  }
}
