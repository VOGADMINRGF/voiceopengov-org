// apps/web/src/lib/http/typedCookies.ts
import { cookies, headers } from "next/headers";

export async function getCookie(name: string): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(name)?.value;
}
export async function setCookie(
  name: string,
  value: string,
  opts?: Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[1]
) {
  const jar = await cookies();
  jar.set(name, value, opts);
}
export async function deleteCookie(name: string) {
  const jar = await cookies();
  jar.delete(name);
}
export async function getHeader(name: string): Promise<string | undefined> {
  const h = await headers();
  return h.get(name) ?? undefined;
}
