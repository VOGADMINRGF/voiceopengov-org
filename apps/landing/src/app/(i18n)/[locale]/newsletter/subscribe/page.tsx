import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

type Props = { params: { locale: string } };

const LOCALE_RE = /^[a-z]{2}(?:-[A-Z]{2})?$/;

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    title: "Newsletter – VoiceOpenGov",
    description:
      "Melde dich für den VoiceOpenGov-Newsletter an und erhalte Updates zu Transparenz, Beteiligung und direkter Demokratie.",
    robots: { index: true, follow: true },
  };
}

// Nur das Formular braucht Client-JS
const ClientSubscribeForm = dynamic(() => import("./ClientSubscribeForm"), { ssr: false });

export default function SubscribePage({ params }: Props) {
  const raw = params.locale;
  const locale = LOCALE_RE.test(raw) ? raw : "de";

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">
          Newsletter abonnieren
        </h1>
        <p className="mt-2 text-gray-600">
          Erhalte gelegentlich Updates zu Projekten, Ergebnissen und Mitmach-Möglichkeiten.
          Wir nutzen <strong>Double-Opt-In</strong> und senden kein Spam.
        </p>

        <div className="mt-6">
          <ClientSubscribeForm locale={locale} />
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Mit deiner Anmeldung bestätigst du unsere{" "}
          <Link href={`/${locale}/legal/privacy`} className="underline">
            Datenschutzhinweise
          </Link>.
        </p>
      </section>
    </main>
  );
}
