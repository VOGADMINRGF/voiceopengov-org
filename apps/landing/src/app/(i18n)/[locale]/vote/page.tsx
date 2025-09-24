import Link from "next/link";
import type { Metadata } from "next";
import KpiBadges from "@/components/widgets/KpiBadges";
import ShareBar from "@/components/widgets/ShareBar";
import Callout from "@/components/ui/Callout";
import StructuredData from "@/components/seo/StructuredData";
import StickyCtaBar from "@/components/layout/StickyCtaBar";
import JournalismCharter from "@/components/JournalismCharter";
import EvidenceGraphMini from "@/components/widgets/EvidenceGraphMini";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = "Abstimmen – fair, nachvollziehbar, wirksam";
  const description =
    "So stimmst du ab: klare Vorlagen, geheime Stimmen, dokumentierte Regeln, Ergebnis mit Minderheitenbericht und Audit-Trail.";
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/vote` },
    openGraph: { title, description },
  };
}

export default function VotePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main id="content" className="section" role="main" aria-labelledby="vote-title">
      <div className="mx-auto max-w-3xl prose prose-slate">
        {/* Lead */}
        <header className="rounded-2xl border p-6 brand-lead">
          <h1 id="vote-title" className="!mt-0">
            Abstimmen – fair, nachvollziehbar, wirksam
          </h1>
          <p className="!mt-2 text-slate-700">
            <strong>In 20 Sekunden:</strong> Du liest eine klar formulierte Vorlage mit Pro &amp; Contra, gibst deine{" "}
            <em>geheime</em> Stimme ab und siehst später Ergebnis, Quorum, Beteiligung und einen kurzen
            Minderheitenbericht. Regeln &amp; Methodik sind vorab öffentlich – für alle gleich.
          </p>
          <KpiBadges
            items={[
              { k: "Beteiligung", v: "live angezeigt" },
              { k: "Quorum-Status", v: "transparent" },
              { k: "Methoden-Hinweise", v: "verlinkt" },
            ]}
          />
        </header>

        {/* Ablauf */}
        <h2 id="ablauf">So läuft eine Abstimmung</h2>
        <ol>
          <li>
            <strong>Vorlage lesen:</strong> Kurztext, Begründung, Pro/Contra, Quellen &amp; Unsicherheiten – alles verlinkt.
          </li>
          <li>
            <strong>Berechtigung:</strong> Eine Person = eine Stimme; bei Bedarf Region-Nachweis (getrennt gespeichert).
          </li>
          <li>
            <strong>Stimme abgeben:</strong> Geheime Token; Trennung Identität ↔ Stimme.
          </li>
          <li>
            <strong>Zählen &amp; prüfen:</strong> Quorum-Check, definierte Mehrheiten (z. B. 2/3 bei Grundsatzfragen),
            methodische Notizen.
          </li>
          <li>
            <strong>Veröffentlichen:</strong> Ergebnis, Beteiligung, Quorum, Konfidenz, Minderheitenbericht, Audit-Trail.
          </li>
        </ol>

        {/* Mini-Graph */}
        <div className="not-prose my-6" aria-label="Evidenz-Graph-Beispiel">
          <EvidenceGraphMini />
        </div>

        {/* Fact-Checking & Trust-Score */}
        <h2 id="trust">Fact-Checking & Trust-Score – in Alltagssprache</h2>
        <ul>
          <li>
            <strong>Wer prüft?</strong> Community, Kurator:innen und verifizierte Expert:innen.
          </li>
          <li>
            <strong>Was misst der Trust-Score?</strong> Mischung aus <em>Quellenqualität</em>, <em>Plausibilität</em> und{" "}
            <em>Konsensbreite</em>.
          </li>
          <li>
            <strong>Fehlerkultur:</strong> Korrekturen werden sichtbar gehalten, nicht versteckt.
          </li>
        </ul>

        {/* Fairness */}
        <Callout kind="info" title="Warum das fair ist">
          <ul className="list-disc pl-5">
            <li>
              <strong>Gleiche Regeln</strong> für Darstellung von Pro &amp; Contra.
            </li>
            <li>
              <strong>Geheime Stimmabgabe</strong>; öffentlich sind nur Aggregate.
            </li>
            <li>
              <strong>Offene Methodik</strong> statt nachträglicher Anpassungen.
            </li>
            <li>
              <strong>Minderheiten werden gehört</strong> – kurzer Bericht gehört zum Standard.
            </li>
          </ul>
        </Callout>

        {/* Regeln */}
        <h2 id="regeln">Regeln – kurz &amp; klar</h2>
        <ul>
          <li>
            <strong>Quorum (Standard):</strong> 10 % der stimmberechtigten Einheit.
          </li>
          <li>
            <strong>Mehrheiten:</strong> Grundordnung/hohe Budgets → 2/3; Operatives → einfache Mehrheit.
          </li>
          <li>
            <strong>Bindungswirkung:</strong> Intern verbindlich; extern adressieren wir zuständige Stellen mit Begründung.
          </li>
          <li>
            <strong>Barrierearm:</strong> klare Sprache, mobil-tauglich, symmetrische Darstellung.
          </li>
        </ul>

        {/* Nachlauf */}
        <h2 id="nachher">Nach der Abstimmung</h2>
        <ol>
          <li>
            <strong>Mandat &amp; Zuständigkeit:</strong> Wer setzt um? Mit welchen Partnern?
          </li>
          <li>
            <strong>Plan:</strong> Meilensteine, Budget, Risiken – öffentlich trackbar.
          </li>
          <li>
            <strong>Wirkung:</strong> Kennzahlen &amp; Lerneffekte fließen in die nächste Vorlage ein.
          </li>
        </ol>

        {/* Journalismus */}
        <h2 id="journalismus">Journalistische Einbindung</h2>
        <JournalismCharter />

        {/* Ausblick */}
        <h2 id="ausblick">
          Ausblick: Wirkung &amp; Vertrauens-Score 2.0{" "}
          <span className="text-xs text-slate-500">(intern: E200)</span>
        </h2>
        <ul>
          <li>
            <strong>Impact-Dashboards:</strong> Entwicklung von Beteiligung &amp; Wirkung über Zeit.
          </li>
          <li>
            <strong>Trust-Score 2.0:</strong> Graphbasierte Maße (Quellgüte, Widersprüche, Korrekturen, Community-Review).
          </li>
          <li>
            <strong>Replikations-Kits:</strong> geprüfte Skripte/Datenschnitte für externe Nachrechnungen.
          </li>
        </ul>

        {/* Mitmachen */}
        <h2 id="mitmachen">Mitmachen – Rollen</h2>
        <p>
          <Link href={`/${locale}/statements/new`}>Anliegen einreichen</Link> ·{" "}
          <Link href={`/${locale}/support`}>Mitglied werden</Link> ·{" "}
          <Link href={`/${locale}/careers`}>Bewirb dich fürs Team</Link> ·{" "}
        </p>

        {/* Footer */}
        <ShareBar title="Abstimmen – fair, nachvollziehbar, wirksam" path={`/${locale}/vote`} />
        <StickyCtaBar locale={locale} />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Abstimmen – VoiceOpenGov",
            description:
              "Transparente Abstimmungen mit Evidenz-Graph, Zählregeln, Audit-Trail und journalistischer Einbindung.",
          }}
        />
        <p>
          Stand: <time dateTime="2025-09-22">September 2025</time>
        </p>
      </div>
    </main>
  );
}
