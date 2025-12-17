"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HumanChallenge } from "@/lib/spam/humanChallenge";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, any>) => string;
      reset?: (id?: string) => void;
      remove?: (id?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Props = {
  sent?: boolean;
  error?: string;
  challenge: HumanChallenge;
};

function useFormStartTimestamp() {
  const [formStartedAt, setFormStartedAt] = useState<string>("");
  useEffect(() => {
    setFormStartedAt(String(Date.now()));
  }, []);
  return formStartedAt;
}

function useTurnstile() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !widgetRef.current) return;
    let cancelled = false;

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.turnstile) return resolve();
        const existing = document.querySelector<HTMLScriptElement>(
          "script[data-turnstile]"
        );
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("load")), {
            once: true,
          });
          return;
        }
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.dataset.turnstile = "1";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("load"));
        document.head.appendChild(script);
      });

    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile || !widgetRef.current) return;
        try {
          const id = window.turnstile.render(widgetRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            "response-field": false,
            callback: (val: string) => setToken(val),
            "error-callback": () => setError("verify_failed"),
            "expired-callback": () => setToken(""),
          });
          widgetIdRef.current = id;
        } catch (e) {
          setError("render_failed");
        }
      })
      .catch(() => setError("load_failed"));

    return () => {
      cancelled = true;
      if (widgetIdRef.current) {
        window.turnstile?.reset?.(widgetIdRef.current);
        window.turnstile?.remove?.(widgetIdRef.current);
      }
    };
  }, []);

  return { token, error, widgetRef };
}

const errorText: Record<string, string> = {
  ratelimit: "Kurz zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut oder schreib direkt an kontakt@voiceopengov.org.",
  captcha:
    "Die Verifizierung konnte nicht abgeschlossen werden. Bitte lade die Seite neu oder schreib uns direkt an kontakt@voiceopengov.org.",
  invalid:
    "Die Angaben waren unvollständig. Bitte prüfe die Felder oder schreib direkt an kontakt@voiceopengov.org.",
  challenge:
    "Die Sicherheitsfrage wurde nicht korrekt beantwortet. Bitte versuche es erneut oder schreib uns direkt an kontakt@voiceopengov.org.",
};

export default function KontaktForm({ sent, error, challenge }: Props) {
  const formStartedAt = useFormStartTimestamp();
  const { token: turnstileToken, error: turnstileError, widgetRef } = useTurnstile();
  const showTurnstile = Boolean(TURNSTILE_SITE_KEY);
  const displayError = error ? errorText[error] ?? errorText.invalid : null;

  return (
    <section
      id="kontaktformular"
      className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100"
    >
      <h2 className="text-base font-semibold text-slate-900 text-center">Kontaktformular</h2>
      <p className="mt-1 text-center text-xs text-slate-600">
        Wir routen dein Anliegen intern an die passende Stelle.
      </p>
      {sent && (
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800">
          Danke! Deine Nachricht ist bei uns angekommen. Wir freuen uns über jedes Feedback und
          melden uns zeitnah.
        </div>
      )}
      {displayError && (
        <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
          {displayError}
        </div>
      )}
      {!sent && turnstileError && showTurnstile && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Die Schutzabfrage konnte nicht geladen werden. Du kannst das Formular trotzdem absenden
          oder uns direkt per Mail an{" "}
          <a
            href="mailto:kontakt@voiceopengov.org"
            className="font-semibold text-amber-900 underline underline-offset-4"
          >
            kontakt@voiceopengov.org
          </a>{" "}
          schreiben.
        </div>
      )}

      <form className="mt-5 space-y-4 relative" action="/api/contact" method="POST">
        <input type="hidden" name="formStartedAt" value={formStartedAt} readOnly />
        <input type="hidden" name="turnstileToken" value={turnstileToken} readOnly />
        <input type="hidden" name="humanChallengeId" value={challenge.id} readOnly />

        <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Bitte dieses Feld frei lassen</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          <input id="hp_contact" name="hp_contact" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="category" className="block text-xs font-semibold text-slate-700">
            Worum geht es?
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Bitte auswählen …</option>
            <option value="juristisch">Juristische / rechtliche Anfrage</option>
            <option value="presse">Presse- / Interviewanfrage</option>
            <option value="medien">Medien / Kooperation</option>
            <option value="partei">Partei, Fraktion oder Mandatsträger:in</option>
            <option value="bewerbung">Bewerbung / Mitarbeit</option>
            <option value="sonstiges">Sonstiges Anliegen</option>
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-semibold text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-700">
            Telefon (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Wenn du einen Rückruf wünschst, gib bitte eine Nummer an."
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="subject" className="block text-xs font-semibold text-slate-700">
            Betreff (optional)
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Worum geht es in einem Satz?"
            maxLength={200}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="block text-xs font-semibold text-slate-700">
            Nachricht
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Wie können wir dir helfen?"
            maxLength={5000}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="humanAnswer" className="block text-xs font-semibold text-slate-700">
            Kurze Sicherheitsfrage
          </label>
          <p className="text-[11px] text-slate-600">{challenge.prompt}</p>
          <input
            id="humanAnswer"
            name="humanAnswer"
            type="text"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Antwort hier eintragen (Pflichtfeld)"
          />
        </div>

        {showTurnstile && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3">
            <p className="text-[11px] text-slate-600">
              Kurze Bestätigung, dass du kein Bot bist:
            </p>
            <div ref={widgetRef} className="mt-2" aria-live="polite" />
          </div>
        )}

        <div className="flex items-start gap-2 pt-1">
          <input
            id="newsletterOptIn"
            name="newsletterOptIn"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <label htmlFor="newsletterOptIn" className="text-[11px] leading-snug text-slate-600">
            Ich möchte gelegentlich Updates und Informationen zu VoiceOpenGov erhalten (Newsletter).
            Du kannst dich jederzeit wieder abmelden.
          </label>
        </div>

        <p className="text-[11px] text-slate-500">
          Mit dem Absenden erklärst du dich einverstanden, dass wir deine Angaben zur Bearbeitung
          deiner Anfrage verarbeiten. Vollständige Datenschutz-Hinweise folgen nach
          Gesellschaftseintragung.
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,116,144,0.35)] transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-sky-200 md:w-auto md:px-10"
          >
            Anfrage absenden
          </button>

          <Link
            href="mailto:kontakt@voiceopengov.org"
            className="w-full rounded-full border border-sky-200 bg-sky-50/60 px-4 py-3 text-center text-sm font-semibold text-sky-700 shadow-[0_6px_18px_rgba(14,165,233,0.15)] transition hover:border-sky-400 hover:bg-white hover:text-sky-900 md:w-auto"
          >
            Oder direkt per E-Mail schreiben
          </Link>
        </div>
      </form>
    </section>
  );
}
