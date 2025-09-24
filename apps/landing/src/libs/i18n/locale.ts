// src/libs/i18n/locale.ts
"use client";

import { usePathname } from "next/navigation";

const BCP47_RE = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/; // locker, reicht für de, de-DE, en, fr-CH, ...

export function detectLocaleFromPathname(pathname: string): string | null {
  const seg = (pathname || "/").split("/")[1]?.trim();
  if (!seg) return null;
  return BCP47_RE.test(seg) ? seg : null;
}

export function useLocaleAuto(defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "de") {
  const pathname = usePathname() || "/";
  const fromPath = detectLocaleFromPathname(pathname);
  if (fromPath) return fromPath.toLowerCase();

  // Fallback: Browser-Language (nur im Client verfügbar)
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language.toLowerCase();
  }
  return (defaultLocale || "de").toLowerCase();
}
