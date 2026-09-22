"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getMemberAccountStrings } from "@/app/memberAccountStrings";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "";
  const { locale } = useLocale();
  const strings = getMemberAccountStrings(locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, next }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; redirectUrl?: string }
        | null;
      if (!response.ok || !payload?.ok) {
        setError(payload?.error === "rate_limited" ? strings.common.rateLimited : strings.login.invalid);
        return;
      }
      router.push(payload.redirectUrl || "/konto");
      router.refresh();
    } catch {
      setError(strings.common.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-50 md:px-8">
      <div className="mx-auto min-w-0 max-w-lg">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">{strings.common.brand}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">{strings.login.title}</h1>
        <p className="mt-3 leading-7 text-slate-300">{strings.login.intro}</p>

        <form onSubmit={submit} className="mt-8 grid min-w-0 gap-5 rounded-[2rem] border border-slate-700/70 bg-slate-900 p-6 shadow-2xl shadow-black/25 md:p-8">
          <label className="grid gap-2 text-sm font-bold text-slate-200">
            {strings.common.email}
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-w-0 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-50 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">
            {strings.common.password}
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-w-0 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-50 outline-none focus:border-cyan-400"
            />
          </label>

          {error ? (
            <div role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-black text-[#071727] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? strings.login.submitting : strings.login.submit}
          </button>

          <div className="grid gap-2 border-t border-slate-700/70 pt-5 text-sm text-slate-300 sm:grid-cols-2">
            <Link href="/api/auth/edebatte-handoff?next=/" className="font-bold text-cyan-400 sm:col-span-2">
              Mit VoiceOpenGov bei eDebatte weitergehen
            </Link>
            <Link href="/konto/passwort" className="font-bold text-cyan-400">
              {strings.common.setupAccess}
            </Link>
            <Link href="/mitglied-werden" className="font-bold text-cyan-400 sm:text-end">
              {strings.login.noMember}
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
