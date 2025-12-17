"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useCurrentUser, clearCachedUser, primeCachedUser } from "@/hooks/auth";
import type { AuthUser } from "@/hooks/auth";

type NavItem = {
  href: string;
  label: string;
  description: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/mitglied-werden",
    label: "Swipes",
    description:
      "Themen & Positionen bewerten – Schnell-Abstimmungen zu laufenden eDebatte-Themen (Vorverkauf unter „Mitmachen“).",
  },
  {
    href: "/mitglied-werden",
    label: "Statements",
    description:
      "Eigene Positionen einbringen – deine Argumente & Vorschläge zu aktuellen eDebatte-Themen.",
  },
  {
    href: "/mitglied-werden",
    label: "Streams",
    description:
      "Themen live diskutieren – Themen als Stream vorstellen und gemeinsam vertiefen.",
  },
  {
    href: "/mitglied-werden",
    label: "Reports",
    description:
      "Übersichten & Ergebnisse – Reports zu Themen, Abstimmungen und Beteiligung in deiner Region.",
  },
];

function deriveInitials(value: string) {
  const parts = value.trim().split(" ").filter(Boolean);
  if (!parts.length) return "DU";
  const first = parts[0]?.[0]?.toUpperCase() ?? "";
  const second = parts[1]?.[0]?.toUpperCase() ?? "";
  return `${first}${second}` || first || "DU";
}

export function SiteHeader({ initialUser }: { initialUser?: AuthUser | null }) {
  const { locale } = useLocale();
  const { user } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const avatarLabel = deriveInitials(user?.name || user?.email || "Du");
  const avatarUrl = user?.avatarUrl ?? null;

  const localeLabel = useMemo(
    () => (locale || "de").toUpperCase(),
    [locale],
  );

  useEffect(() => {
    if (initialUser !== undefined) {
      primeCachedUser(initialUser ?? null);
    }
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("logout failed", err);
    } finally {
      clearCachedUser();
      setLoggingOut(false);
      setMobileOpen(false);
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-lg font-extrabold leading-tight tracking-tight"
            style={{
              backgroundImage:
                "linear-gradient(120deg,var(--brand-cyan),var(--brand-blue))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            VoiceOpenGov
          </span>
        </Link>

        {/* Rechts: Avatar/Account + Hamburger */}
        <div className="flex items-center gap-3">
          {!user && (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-600"
            >
              Login / Registrierung
            </Link>
          )}
          <button
            type="button"
            aria-label={user ? "Account-Menü öffnen" : "Navigation öffnen"}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/80 bg-white/90 text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-300"
          >
            {user ? (
              avatarUrl ? (
                <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
                  <span
                    aria-hidden="true"
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${avatarUrl})` }}
                  />
                </span>
              ) : (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 shadow-sm">
                  {avatarLabel}
                </span>
              )
            ) : (
              <>
                <span className="sr-only">Menü</span>
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h10"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile-Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-100/80 bg-white/95">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Navigations
              </span>
              <span
                aria-label={`Sprache: ${localeLabel}`}
                className="text-[11px] font-semibold uppercase tracking-wide text-slate-400"
              >
                {localeLabel}
              </span>
            </div>

            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col gap-2 text-sm font-semibold text-slate-800"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-left hover:border-sky-300 hover:bg-sky-50"
                >
                  <span className="block text-sm font-semibold">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-600">
                    {item.description}
                  </span>
                </Link>
              ))}

              <Link
                href="/mitglied-werden"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_10px_25px_rgba(56,189,248,0.4)]"
              >
                Mitmachen
              </Link>

              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-600"
                  >
                    Mein Konto
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-rose-300 hover:text-rose-600 disabled:opacity-60"
                  >
                    {loggingOut ? "Abmelden …" : "Abmelden"}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-600"
                >
                  Login / Registrierung
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
