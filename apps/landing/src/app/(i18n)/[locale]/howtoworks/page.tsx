import Link from "next/link";
import type { Metadata } from "next";
import KpiBadges from "@/components/widgets/KpiBadges";
import StoryStrip from "@/components/widgets/StoryStrip";
import ShareBar from "@/components/widgets/ShareBar";
import Callout from "@/components/ui/Callout";
import StructuredData from "@/components/seo/StructuredData";
import StickyCtaBar from "@/components/layout/StickyCtaBar";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = "So funktioniert VoiceOpenGov – verständlich & transparent";
  const description =
    "Anliegen → Faktenlage → faire Abstimmung → öffentliche Umsetzung. Jede Zahl und jeder Schritt sind nachvollziehbar – für Bürger:innen, Medien und Verwaltungen.";
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/howtoworks` },
    openGraph: { title, description },
  };
}

export default function HowToWorksPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="section" role="main" aria-labelledby="how-title">
      <div className="mx-auto max-w-3xl prose prose-slate">
        {/* Lead */}
        <header id="how-title" className="rounded-2xl border p-6 brand-lead">
          <h1 className="!mt-0">So funktioniert VoiceOpenGov</h1>
          <p className="!mt-2 text-slate-700">
            <strong>In 60 Sekunden:</strong> Du bringst ein Anliegen ein, wir legen die Fakten offen, alle sehen Pro &amp;
            Contra unter denselben Regeln, und die Gemeinschaft stimmt fair ab. Danach wird die Umsetzung öffentlich
            begleitet. Jede Zahl und jeder Schritt bleiben überprüfbar.
          </p>
          <KpiBadges
            items={[
              { k: "Quellen-Abdeckung", v: "hoch" },
              { k: "Disagreement-Index", v: "niedrig" },
              { k: "Re-Run-Stabilität", v: "hoch" },
            ]}
          />
        </header>

        {/* Zielgruppen */}
        <h2 id="fuer-wen">Für wen ist das?</h2>
        <div className="not-prose grid gap-3 sm:grid-cols-3">
          {[
            { t: "Bürger:innen", d: "Anliegen einreichen, fair debattieren, geheim abstimmen." },
            { t: "Journalist:innen", d: "Dossiers, Embeds &amp; Exporte – lokal bis investigativ." },
            { t: "Verwaltungen", d: "Mandat, Plan, Risiken &amp; Wirkung öffentlich tracken." },
          ].map((c, i) => (
            <div key={i} className="brand-card" role="region" aria-label={c.t}>
              <div className="text-sm font-semibold">{c.t}</div>
              <p className="text-sm text-slate-600 mt-1">{c.d}</p>
            </div>
          ))}
        </div>

        {/* Beispiel */}
        <h2 id="beispiel">Der einfachste Einstieg: ein Beispiel</h2>
        <p>
          <strong>„Sicherer Schulweg“:</strong> Eine Mutter schlägt vor, vor der Schule Tempo 30 ganztägig einzuführen.
          Wir zerlegen das Anliegen in <em>prüfbare Aussagen</em> (Unfalllage, Verkehrsfluss, Alternativen), sammeln{" "}
          <em>Quellen</em> und zeigen <em>Gegenpositionen</em>. Danach entscheidet die Gemeinschaft – mit klaren Regeln.
        </p>

        {/* Warum einzigartig */}
        <h2 id="warum-einzigartig">Warum das einzigartig ist</h2>
        <ul>
          <li>
            <strong>Transparente Struktur:</strong> Anliegen werden sauber aufbereitet – maschinen- und menschenlesbar.
          </li>
          <li>
            <strong>Neutrale Verfahren:</strong> Öffentliche Regeln, Audit-Trail, Reproduzierbarkeit.
          </li>
          <li>
            <strong>Journalismus von Beginn an:</strong> Dossiers, Embeds &amp; Exporte (CSV/JSON) – lokal bis investigativ.
          </li>
          <li>
            <strong>Regionale Legitimität:</strong> Entscheidungen können auf Gemeinden, Kreise oder Länder begrenzt werden;
            Identität &amp; Stimme sind getrennt.
          </li>
        </ul>

        {/* Prozess in fünf Schritten */}
        <h2 id="prozess">Von der Idee zur Entscheidung – in fünf Schritten</h2>
        <ol>
          <li>
            <strong>Anliegen einreichen:</strong> Ziel, Region, Zuständigkeit – kurze Begründung; keine Fachsprache
            nötig.
          </li>
          <li>
            <strong>Faktenlage aufbauen:</strong> Studien, Daten und Gegenpositionen – jede Quelle ist verlinkt und datiert.
          </li>
          <li>
            <strong>Debatte unter Regeln:</strong> Pro &amp; Contra werden symmetrisch moderiert. Dominanz einzelner Stimmen
            wird verhindert.
          </li>
          <li>
            <strong>Abstimmen:</strong> Geheim; Zählregeln &amp; Quoren sind vorab veröffentlicht.
          </li>
          <li>
            <strong>Umsetzung &amp; Wirkung:</strong> Verantwortliche, Budget und Meilensteine sind öffentlich; Wirkung
            fließt in die nächste Vorlage ein.
          </li>
        </ol>

        {/* Teaser zur Mechanik */}
        <Callout kind="tip" title="Abstimmungslogik verstehen">
          <p className="m-0">
            Wie der Evidenz-Graph, Fact-Checking und die Zählregeln genau funktionieren, erklären wir Schritt für Schritt
            auf der Abstimmungsseite.
            <br />
            <Link href={`/${locale}/vote#evidenz`}>Zur Abstimmungslogik</Link>
          </p>
        </Callout>

        {/* Mitgliedschaft */}
        <h2 id="mitgliedschaft">Mitgliedschaft – unabhängig bleiben</h2>
        <p>
          Deine Mitgliedschaft finanziert Moderation, Aufbereitung und öffentliche Nachvollziehbarkeit – ohne
          Abhängigkeiten.
          <br />
          <Link href={`/${locale}/support`}>Jetzt Mitglied werden</Link>
        </p>

        {/* Beispiel-Stories */}
        <StoryStrip locale={locale} className="mt-6" />

        {/* Footer */}
        <ShareBar title="So funktioniert VoiceOpenGov" path={`/${locale}/howtoworks`} />
        <StickyCtaBar locale={locale} />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "So funktioniert VoiceOpenGov",
            description: "Anliegen → Faktenlage → faire Abstimmung → Umsetzung. Transparent & reproduzierbar.",
            step: [
              { "@type": "HowToStep", name: "Anliegen einreichen" },
              { "@type": "HowToStep", name: "Faktenlage prüfen" },
              { "@type": "HowToStep", name: "Debatte &amp; Pro/Contra" },
              { "@type": "HowToStep", name: "Abstimmen" },
              { "@type": "HowToStep", name: "Umsetzen &amp; Wirkung" },
            ],
          }}
        />
        <p>
          Stand: <time dateTime="2025-09-22">22. September 2025</time>
        </p>
      </div>
    </main>
  );
}
