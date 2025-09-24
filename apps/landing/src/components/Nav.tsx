
"use client";
import Link from "next/link";
export default function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="text-xl font-semibold text-brand-grad">VoiceOpenGov</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="#mechanik" className="hover:underline">Mechanik</Link>
          <Link href="#governance" className="hover:underline">Governance</Link>
          <Link href="#mitglied" className="rounded-full bg-gradient-to-r from-brand-from to-brand-to px-3 py-1.5 text-white shadow-soft">Mitglied werden</Link>
        </nav>
      </div>
    </header>
  );
}
