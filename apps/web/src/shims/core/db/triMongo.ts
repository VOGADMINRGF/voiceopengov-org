// triMongo shim: dynamischer Import der echten Implementierung ohne Alias-Zyklus
type Any = any;
let cached: Any | null = null;

async function loadCore(): Promise<Any> {
  if (cached) return cached;
  try {
    // Pfad: von apps/web/src/shims/core/db -> repo root -> core/core/triMongo
    const mod: Any = await import("@core/triMongo");
    cached = mod?.default ?? mod;
  } catch {
    cached = {};
  }
  return cached!;
}

export default {} as Any;

export async function getDb(name?: string): Promise<any> {
  const tri = await loadCore();
  if (typeof tri.getDb === "function") return tri.getDb(name);
  if (typeof tri.coreCol === "function") {
    const c = await tri.coreCol("_health");
    return (c && (c.db || c._db || c.client?.db?.())) ?? c;
  }
  return tri.db ?? null;
}

export async function getCol(name: string): Promise<any> {
  const tri = await loadCore();
  if (typeof tri.getCol === "function") return tri.getCol(name);
  if (typeof tri.coreCol === "function") return tri.coreCol(name);
  return (await getDb())?.collection?.(name);
}
export async function coreCol(name: string): Promise<any> {
  const tri = await loadCore();
  if (typeof tri.coreCol === "function") return tri.coreCol(name);
  return getCol(name);
}
export async function votesCol(name: string): Promise<any> {
  const tri = await loadCore();
  if (typeof tri.votesCol === "function") return tri.votesCol(name);
  return getCol(name);
}
export async function piiCol(name: string): Promise<any> {
  const tri = await loadCore();
  if (typeof tri.piiCol === "function") return tri.piiCol(name);
  return getCol(name);
}
export const coreConn  = undefined as any;
export const votesConn = undefined as any;
export const piiConn   = undefined as any;
