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
      // Web Share API, wenn vorhanden
      if (navigator && "share" in navigator) {
        await (navigator as any).share({ title: "VoiceOpenGov", text, url });
        return;
      }
      // Fallback: Link in Zwischenablage
      await navigator.clipboard.writeText(url);
      alert("Link kopiert. Danke fürs Teilen!");
    } catch {
      // Letzter Fallback: nichts tun
    }
  }, [safeLocale]);

  return (
    <section className="section">
      <div className="mx-auto max-w-2xl">
        <div
          className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full
                     bg-gradient-to-tr from-[var(--brand-accent-1)] to-[var(--brand-accent-2)]
                     text-white text-2xl"
          aria-hidden
        >
          {ok ? "✓" : "!"}
        </div>

        <h1 className="text-3xl font-extrabold leading-tight">
          <span className="text-brand-grad">
            {ok ? "Danke fürs Bestätigen!" : "Bestätigung fehlgeschlagen"}
          </span>
        </h1>

        {ok ? (
          <>
            <p className="mt-3 text-slate-600">
              Mega, deine Anmeldung ist aktiv. Wenn du unsere Arbeit stärken willst:
              Schon <strong>5,63&nbsp;€</strong> im Monat senden das richtige Signal. Und
              noch wertvoller: Empfiehl die Idee weiter.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={supportUrl} className="btn btn-primary bg-brand-grad">
                Unterstützen ab 5,63&nbsp;€
              </Link>
              <button onClick={share} className="btn btn-outline" aria-label="Seite teilen">
                Weiterempfehlen
              </button>
              <a
                className="btn btn-outline"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  "Ich unterstütze VoiceOpenGov – Mach mit!"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Auf X/Twitter teilen
              </a>
              <Link href={`/${safeLocale}`} className="btn btn-outline">
                Zur Startseite
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-slate-600">
              Uups, der Link war ungültig oder bereits verwendet. Versuch es bitte erneut
              oder melde dich bei uns.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href={`/${safeLocale}`} className="btn btn-outline">
                Zur Startseite
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
