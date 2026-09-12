"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getMemberAccountStrings } from "@/app/memberAccountStrings";

type Member = {
  id: string;
  type: "person" | "organisation";
  email: string;
  firstName?: string;
  lastName?: string;
  orgName?: string;
  city?: string;
  country?: string;
  status: "active";
  isPublic: boolean;
  publicSupporter: boolean;
  wantsNewsletter: boolean;
  wantsNewsletterEdDebatte: boolean;
  confirmedAt?: string;
};

type SessionResponse =
  | { authenticated: false }
  | { authenticated: true; member: Member };

export default function KontoPage() {
  const { locale } = useLocale();
  const strings = getMemberAccountStrings(locale);
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json() as Promise<SessionResponse>)
      .then((payload) => {
        if (cancelled) return;
        setMember(payload.authenticated ? payload.member : null);
      })
      .catch(() => {
        if (!cancelled) setMember(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-50 md:px-8">
        <div className="mx-auto max-w-3xl text-slate-300">{strings.account.loading}</div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-50 md:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-700/70 bg-slate-900 p-8">
          <h1 className="text-3xl font-black">{strings.account.title}</h1>
          <p className="mt-3 text-slate-300">{strings.account.unauthenticated}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-black text-[#071727]">{strings.common.login}</Link>
            <Link href="/konto/passwort" className="rounded-full border border-slate-700 px-5 py-3 font-bold">{strings.common.setupAccess}</Link>
          </div>
        </div>
      </main>
    );
  }

  const displayName =
    member.type === "organisation"
      ? member.orgName || strings.join.organisation
      : [member.firstName, member.lastName].filter(Boolean).join(" ") || strings.join.person;

  return (
    <main className="min-h-[72vh] bg-slate-950 px-5 py-12 text-slate-50 md:px-8 md:py-16">
      <div className="mx-auto min-w-0 max-w-4xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">{strings.account.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">{displayName}</h1>
            <p className="mt-2 text-slate-400">{member.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="self-start rounded-full border border-slate-700 px-5 py-2.5 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400 sm:self-auto"
          >
            {strings.account.logout}
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-[2rem] border border-cyan-500/25 bg-slate-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-400">{strings.account.status}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_18px_rgba(24,207,200,0.55)]" />
              <span className="text-xl font-black">{strings.account.active}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{strings.account.statusBody}</p>
          </section>

          <section className="rounded-[2rem] border border-slate-700/70 bg-slate-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{strings.account.region}</p>
            <p className="mt-4 text-xl font-black">
              {[member.city, member.country].filter(Boolean).join(", ") || strings.account.notSet}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {strings.account.publicSums}: {member.isPublic ? strings.account.allowed : strings.account.notAllowed}
            </p>
          </section>

          <section className="rounded-[2rem] border border-slate-700/70 bg-slate-900 p-6 md:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{strings.account.communication}</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <StatusLine label={strings.account.vogUpdates} active={member.wantsNewsletter} on={strings.account.on} off={strings.account.off} />
              <StatusLine label={strings.account.edebatteUpdates} active={member.wantsNewsletterEdDebatte} on={strings.account.on} off={strings.account.off} />
              <StatusLine label={strings.account.supporterBanner} active={member.publicSupporter} on={strings.account.on} off={strings.account.off} />
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-black text-[#071727]">{strings.account.toMovement}</Link>
          <Link href="/konto/passwort" className="rounded-full border border-slate-700 px-5 py-3 font-bold">{strings.account.changePassword}</Link>
          <Link href="/kontakt" className="rounded-full border border-slate-700 px-5 py-3 font-bold">{strings.common.contact}</Link>
        </div>
      </div>
    </main>
  );
}

function StatusLine({ label, active, on, off }: { label: string; active: boolean; on: string; off: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 px-4 py-3">
      <span className="font-bold">{label}</span>
      <span className={`ms-2 ${active ? "text-cyan-400" : "text-slate-500"}`}>
        {active ? on : off}
      </span>
    </div>
  );
}
