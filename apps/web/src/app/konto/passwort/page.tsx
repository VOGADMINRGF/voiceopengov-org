"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getMemberAccountStrings } from "@/app/memberAccountStrings";

export default function PasswortPage() {
  const { locale } = useLocale();
  const strings = getMemberAccountStrings(locale);
  const [tokenReady, setTokenReady] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("token") || "";
    setToken(value);
    setTokenReady(true);
  }, []);

  function passwordError(code?: string) {
    const errors: Record<string, string> = {
      password_too_short: strings.join.passwordTooShort,
      password_too_long: strings.join.passwordTooLong,
      password_needs_number: strings.join.passwordNeedsNumber,
      password_needs_special: strings.join.passwordNeedsSpecial,
      invalid_or_expired_token: strings.password.invalidToken,
      rate_limited: strings.common.rateLimited,
    };
    return (code && errors[code]) || strings.password.failed;
  }

  async function requestLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/password/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!response.ok || !payload?.ok) {
        setError(payload?.error === "rate_limited" ? strings.common.rateLimited : strings.common.networkError);
        return;
      }
      setMessage(strings.password.genericSent);
    } catch {
      setError(strings.common.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  async function setNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== passwordRepeat) {
      setError(strings.password.mismatch);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/password/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!response.ok || !payload?.ok) {
        setError(passwordError(payload?.error));
        return;
      }
      setComplete(true);
    } catch {
      setError(strings.password.failed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-50 md:px-8">
      <div className="mx-auto min-w-0 max-w-lg">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">{strings.password.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          {token ? strings.password.setTitle : strings.password.setupTitle}
        </h1>
        <p className="mt-3 leading-7 text-slate-300">
          {token ? strings.password.setIntro : strings.password.setupIntro}
        </p>

        {!tokenReady ? (
          <div className="mt-8 text-slate-400">{strings.common.setupAccess} …</div>
        ) : complete ? (
          <div className="mt-8 rounded-[2rem] border border-cyan-500/25 bg-slate-900 p-7">
            <h2 className="text-2xl font-black">{strings.password.savedTitle}</h2>
            <p className="mt-3 text-slate-300">{strings.password.savedBody}</p>
            <Link href="/login" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-black text-[#071727]">
              {strings.common.login}
            </Link>
          </div>
        ) : token ? (
          <form onSubmit={setNewPassword} className="mt-8 grid min-w-0 gap-5 rounded-[2rem] border border-slate-700/70 bg-slate-900 p-6 md:p-8">
            <PasswordField label={strings.password.newPassword} value={password} onChange={setPassword} />
            <PasswordField label={strings.password.repeatPassword} value={passwordRepeat} onChange={setPasswordRepeat} />
            <p className="text-xs leading-5 text-slate-400">{strings.password.hint}</p>
            {error ? <ErrorBox>{error}</ErrorBox> : null}
            <button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-black text-[#071727] disabled:opacity-60">
              {submitting ? strings.password.saving : strings.password.save}
            </button>
          </form>
        ) : (
          <form onSubmit={requestLink} className="mt-8 grid min-w-0 gap-5 rounded-[2rem] border border-slate-700/70 bg-slate-900 p-6 md:p-8">
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              {strings.password.emailLabel}
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-w-0 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-50 outline-none focus:border-cyan-400" />
            </label>
            {message ? (
              <div role="status" aria-live="polite" className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3 text-sm text-slate-200">{message}</div>
            ) : null}
            {error ? <ErrorBox>{error}</ErrorBox> : null}
            <button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-black text-[#071727] disabled:opacity-60">
              {submitting ? strings.password.requesting : strings.password.requestLink}
            </button>
            <Link href="/login" className="text-center text-sm font-bold text-cyan-400">{strings.password.backLogin}</Link>
          </form>
        )}
      </div>
    </main>
  );
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200">
      {label}
      <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-50 outline-none focus:border-cyan-400" />
    </label>
  );
}

function ErrorBox({ children }: { children: string }) {
  return <div role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{children}</div>;
}
