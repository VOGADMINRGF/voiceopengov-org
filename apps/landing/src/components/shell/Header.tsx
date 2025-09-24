"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { LOCALES, isLocale, labelForLocale, flagForLocale } from "@/utils/locale";
import clsx from "clsx";

/** Typed helper for locale-aware hrefs (works fine with typedRoutes) */
const rl = (locale: string, slug: string = "") => (`/${locale}${slug}` as Route);

const NAV: Array<{ label: string; slug: string }> = [
  { label: "Die Idee",             slug: "/howtoworks" },   // Placeholder page below
  { label: "Zur Abstimmung",       slug: "/vote" },         // Placeholder page below
  { label: "Mitglied & Sponsoring",slug: "/support" },      // existiert
  { label: "Lokal unterstützen",   slug: "/chapters" },     // existiert
];

function getActiveLocale(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : "de";
}

function replaceLocale(pathname: string, nextLocale: string): string {
  const parts = pathname.split("/");
  // parts: ["", "de", ...] or ["", ...]
  if (isLocale(parts[1])) {
    parts[1] = nextLocale;
    return parts.join("/");
  }
  return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
}

export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const locale   = getActiveLocale(pathname);

  const isActive = (slug: string) => {
    const target = `/${locale}${slug}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo / Brand */}
        <Link href={rl(locale, "")} className="shrink-0">
          <span className="text-brand-grad text-lg font-extrabold tracking-tight">
            VoiceOpenGov
          </span>
        </Link>

        {/* Main nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.slug}
              href={rl(locale, n.slug)}
              className={clsx(
                "px-3 py-1.5 rounded-xl text-sm transition",
                isActive(n.slug)
                  ? "border border-slate-300 bg-white"
                  : "hover:bg-black/5"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right side: locale switch + CTA */}
        <div className="flex items-center gap-2">
          {/* Locale pills with flags */}
          <div className="hidden items-center gap-1 md:flex">
            {LOCALES.map((l) => {
              const active = l === locale;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => router.push(replaceLocale(pathname, l))}
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
                    active
                      ? "border-slate-300 bg-white shadow-sm"
                      : "border-slate-200 hover:bg-slate-50"
                  )}
                  aria-label={labelForLocale(l)}
                >
                  <span aria-hidden>{flagForLocale(l)}</span>
                  <span className="uppercase">{l}</span>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <Link
            href={rl(locale, "/support")}
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
            style={{
              background:
                "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
            }}
          >
            Mitglied werden
          </Link>
        </div>
      </div>
    </header>
  );
}
