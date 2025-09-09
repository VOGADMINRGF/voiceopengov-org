"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiInfo, FiBookOpen, FiLogOut } from "react-icons/fi";
import { useUser } from "@features/user/context/UserContext";
import { useLocale } from "@context/LocaleContext";
import { getSupportedFlags } from "@features/stream/utils/nationalFlag";
import UniversalSearchBar from "@features/common/components/UniversalSearchBar";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const MAIN_LINKS = [
  { href: "/swipe", label: "Swipemodus / Stöbern" },
  { href: "/beitraege", label: "Statements / Beiträge" },
  { href: "/stream", label: "Streams zu Statements" },
  { href: "/report", label: "Zusammenfassung / Reportthemen" },
];

const PERSONAL_LINKS = [
  { href: "/dashboard", label: "Mein Dashboard" },
  { href: "/profil", label: "Mein Profil" },
  { href: "/mitgliedschaft", label: "Meine Mitgliedschaft" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, role, logout } = useUser();
  const { locale, setLocale } = useLocale();
  const pathname = usePathname(); // einmalig holen

  const allLanguages = getSupportedFlags();
  const current = allLanguages.find((l) => l.code === locale) || allLanguages[0];

  const displayName = user?.name || (user as any)?.email || "Gast";
  const avatarUrl = (user as any)?.avatarUrl as string | undefined;

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as any)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isOpen]);

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 h-14 flex items-center px-2 md:px-6">
        <button onClick={() => setIsOpen(true)} className="p-2 rounded-xl hover:bg-neutral-100 md:hidden" aria-label="Menü öffnen">
          <FiMenu />
        </button>

        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-2xl font-bold text-coral tracking-tight" tabIndex={0}>
            VoiceOpenGov
          </Link>
        </div>

        <div className="flex items-center gap-3 min-w-[140px] justify-end flex-shrink-0">
          {role === "guest" ? (
            <Link href="/login" className="text-sm text-gray-600 hover:underline">Login</Link>
          ) : (
            <Link href="/dashboard" className="text-sm font-medium text-coral border border-coral px-3 py-1 rounded hover:text-coral/80 transition">
              Mein Bereich
            </Link>
          )}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen((open) => !open)} className="text-2xl transition" aria-label="Sprache wechseln" title={current.name}>
              {current.label}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded shadow-lg flex flex-wrap z-50 border border-neutral-200 min-w-[220px] max-h-64 overflow-y-auto">
                {allLanguages.map((l) => (
                  <button key={l.code} onClick={() => { setLocale(l.code); setDropdownOpen(false); }}
                    className={clsx("text-2xl p-2 hover:bg-indigo-50", locale === l.code && "ring-2 ring-purple-400 rounded")}
                    title={l.name}>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-14" />

      <div className="w-full bg-white border-b border-neutral-100 shadow-sm z-40">
        <div className="max-w-2xl mx-auto py-2 px-2 md:px-0 flex justify-center">
          <UniversalSearchBar />
        </div>
      </div>
      <div className="h-2" />

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          <nav className="fixed top-0 left-0 w-[90vw] max-w-[320px] h-full bg-white shadow-2xl flex flex-col z-50 outline-none" aria-label="Seitennavigation" tabIndex={0}>
            <div className="flex flex-col items-center mt-7 mb-6 gap-2">
              <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center text-3xl text-coral overflow-hidden border">
                {avatarUrl ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" /> : <FiUser />}
              </div>
              <span className="text-lg font-bold">{displayName}</span>
              <span className="text-xs text-neutral-500">{role === "guest" ? "Nicht angemeldet" : role === "admin" ? "Admin" : "Mitglied"}</span>
            </div>

            <span className="text-xs text-neutral-400 px-4 mb-1">Mitmachen</span>
            <ul className="flex flex-col gap-1 mb-4">
              {MAIN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={clsx("block px-6 py-2 rounded font-medium transition text-base",
                      pathname === link.href ? "bg-coral/10 text-coral border-l-4 border-coral font-bold" : "hover:bg-coral/5")}
                    tabIndex={0} aria-current={pathname === link.href ? "page" : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <span className="text-xs text-neutral-400 px-4 mb-1">Dein Bereich</span>
            <ul className="flex flex-col gap-1 mb-4">
              {PERSONAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={clsx("block px-6 py-2 rounded font-medium transition text-base",
                      pathname === link.href ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold" : "hover:bg-indigo-50")}
                    tabIndex={0} aria-current={pathname === link.href ? "page" : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="px-4 py-4 border-t border-neutral-100 flex flex-col gap-2 mt-auto">
              <Link href="/support" className="text-xs text-neutral-500 hover:underline flex gap-2 items-center"><FiInfo /> Support</Link>
              <Link href="/faq" className="text-xs text-neutral-500 hover:underline flex gap-2 items-center"><FiBookOpen /> FAQ</Link>
              {role !== "guest" && (
                <button onClick={async () => { setIsOpen(false); await logout(); }}
                  className="flex items-center gap-2 text-xs text-neutral-400 hover:text-red-700 font-medium mt-2">
                  <FiLogOut /> Logout
                </button>
              )}
            </div>

            <button className="absolute top-3 right-3 text-2xl text-neutral-400 hover:text-coral focus:outline-none focus-visible:ring-2"
              aria-label="Drawer schließen" onClick={() => setIsOpen(false)} tabIndex={0}>
              <FiX />
            </button>
          </nav>
        </>
      )}
    </>
  );
}
