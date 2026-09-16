import Link from "next/link";
import { VOG_JOIN_PATH, VOG_QUESTIONS_PATH, VOG_ROLES_PATH } from "@/config/links";

export const metadata = {
  title: "Mitmachen | VoiceOpenGov",
  description:
    "Mitglied werden, an öffentlichen Fragen mitarbeiten oder regional aktiv werden: drei einfache Einstiege in VoiceOpenGov.",
};

export default function JoinPage() {
  const cards = [
    {
      eyebrow: "Mitgliedschaft",
      title: "Mitglied werden",
      body: "Werde Teil der offenen Mitgliederbewegung und entwickle Themen, Positionen und regionale Strukturen mit.",
      href: VOG_JOIN_PATH,
      cta: "Mitgliedschaft starten",
    },
    {
      eyebrow: "Öffentliche Fragen",
      title: "An einer Frage mitarbeiten",
      body: "Wähle eine der 50 öffentlichen Orientierungsfragen und steige direkt in den passenden eDebatte-Arbeitsraum ein.",
      href: VOG_QUESTIONS_PATH,
      cta: "Frage auswählen",
    },
    {
      eyebrow: "Rollen & Region",
      title: "Verantwortung übernehmen",
      body: "Finde eine Rolle, die zu dir passt – von Quellenarbeit und Moderation bis zur regionalen Aktivierung vor Ort.",
      href: VOG_ROLES_PATH,
      cta: "Mitwirkungsrollen ansehen",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#07110f] text-[#f4f1e8]">
      <section className="border-b border-[#f4f1e8]/10 bg-[radial-gradient(circle_at_82%_18%,rgba(214,255,101,0.16),transparent_30%)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#d6ff65]">Mitmachen</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Nicht nur zuschauen. Einen konkreten Einstieg wählen.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#f4f1e8]/62">
            VoiceOpenGov ist keine Partei und kein fertiges Programm. Menschen bringen Themen ein, prüfen Argumente,
            arbeiten an öffentlichen Fragen und übernehmen Verantwortung in ihrer Region.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-22">
        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-[#f4f1e8]/10 bg-[#0b1714] p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#18cfc8]">{card.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-black">{card.title}</h2>
              <p className="mt-4 leading-7 text-[#f4f1e8]/58">{card.body}</p>
              <Link
                href={card.href}
                className="mt-7 inline-flex rounded-full border border-[#d6ff65]/35 px-4 py-2.5 text-sm font-black text-[#d6ff65] transition hover:bg-[#d6ff65] hover:text-[#07110f]"
              >
                {card.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
