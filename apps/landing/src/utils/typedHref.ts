import type { Route } from "next";

export function r(pathname: Route, params?: Record<string, string | number>) {
  return { pathname, params } as const;
}

export function rl(locale: string, path?: string) {
  // /[locale] oder /[locale]/about
  return path ? r("/[locale]/" + path as Route, { locale }) : r("/[locale]" as Route, { locale });
}
