"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";

type Props = { params: { locale: string } };
const LOCALE_RE = /^[a-z]{2}(?:-[A-Z]{2})?$/;

export default function NewsletterConfirmPage({ params: { locale } }: Props) {
  const sp = useSearchParams();
  const ok = sp.get("ok") === "1";
  const safeLocale = useMemo(() => (LOCALE_RE.test(locale) ? locale : "de"), [locale]);

  const supportUrl = useMemo(
    () => `/${safeLocale}/support?amount=5.63&rhythm=monthly`,
    [safeLocale]
  );

  const share = useCallback(async () => {
    const text =
      "Ich unterstütze VoiceOpenGov – für direkte, transparente Entscheidungen. Mach mit!";
    const url = `${window.location.origin}/${safeLocale}`;
    try {
      if ("share" in navigator) {
        await (navigator as any).share({ title: "VoiceOpenGov", text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link kopiert. Danke fürs Teilen!");
      }
    } catch {}
  }, [safeLocale]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <section
        className="max-w-xl w-full rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
              ok ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-rose-50 ring-1 ring-rose-200"
            }`}
            aria-hidden="true"
          >
            <span className={`text-xl ${ok ? "text-emerald-600" : "text-rose-600"}`}>
              {ok ? "✓" : "!"}
            </span>
          </div>
          <h1 className="text-xl font-semibold">
            {ok ? "Anmeldung bestätigt" : "Bestätigung fehlgeschlagen"}
          </h1>
        </div>

        {ok ? (
          <>
            <p className="mt-4 text-gray-600">
              Deine Anmeldung ist aktiv. Wenn du unsere Arbeit stärken willst: Schon{" "}
              <strong>5,63&nbsp;€</strong> im Monat setzt ein Signal. Noch wertvoller:
              Empfiehl die Idee weiter.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={supportUrl}
                className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Unterstützen ab 5,63&nbsp;€
              </Link>

              <button
                onClick={share}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                aria-label="Seite teilen"
              >
                Weiterempfehlen
              </button>

              <a
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  "Ich unterstütze VoiceOpenGov – Mach mit!"
                )}&url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/${safeLocale}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Auf X/Twitter teilen
              </a>

              <Link
                href={`/${safeLocale}`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Zur Startseite
              </Link>
            </div>

            <div className="mt-8 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p>
                Keine E-Mail gesehen? Schau im Spam nach oder füge{" "}
                <span className="font-mono">no-reply@voiceopengov.org</span> deinem Adressbuch
                hinzu.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-gray-600">
              Der Bestätigungslink ist ungültig oder bereits abgelaufen. Fordere bitte einen neuen
              Link an.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/${safeLocale}/newsletter/subscribe`}
                className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Neuen Link anfordern
              </Link>
              <Link
                href={`/${safeLocale}`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Zur Startseite
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
