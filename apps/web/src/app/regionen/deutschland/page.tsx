import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";
import { REQUIRED_LAUNCH_LOCALES, getLocaleConfig } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { GERMAN_STATE_REGIONS } from "@/content/regionalStates";
import { REGIONAL_SEO_COPY, regionalSeoLocale } from "@/content/regionalSeo";
import {
  localeAlternates,
  localizedCanonicalUrl,
} from "@/lib/i18n/localeContract";
import { getRequestLocale } from "@/lib/locale";
import { REGIONAL_INTEREST_SOURCE_PATH } from "@/lib/regionalInterestContract";

const PATH = "/regionen/deutschland";

function href(path: string, locale: string) {
  const url = new URL(path, VOICEOPENGOV_URL);
  if (locale !== "de") url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = regionalSeoLocale(await getRequestLocale());
  const copy = REGIONAL_SEO_COPY[locale].germany;
  const baseCanonical = `${VOICEOPENGOV_URL}${PATH}`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  return {
    title: copy.title,
    description: copy.intro,
    alternates: {
      canonical,
      languages: localeAlternates(baseCanonical, REQUIRED_LAUNCH_LOCALES),
    },
    openGraph: {
      title: copy.title,
      description: copy.intro,
      url: canonical,
      type: "website",
    },
  };
}

export default async function GermanyRegionPage() {
  const locale = regionalSeoLocale(await getRequestLocale());
  const copy = REGIONAL_SEO_COPY[locale].germany;
  const baseCanonical = `${VOICEOPENGOV_URL}${PATH}`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  return (
    <main className="bg-[#020617] text-[#f8fafc]">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${canonical}#page`,
            url: canonical,
            name: copy.title,
            description: copy.intro,
            inLanguage: getLocaleConfig(locale).bcp47,
            isPartOf: {
              "@type": "WebSite",
              "@id": `${VOICEOPENGOV_URL}/#website`,
              name: "VoiceOpenGov",
              url: `${VOICEOPENGOV_URL}/`,
            },
            about: {
              "@type": "Country",
              name: "Germany",
              alternateName: "Deutschland",
            },
            hasPart: GERMAN_STATE_REGIONS.map((region) => ({
              "@type": "WebPage",
              name: `VoiceOpenGov ${region.name}`,
              url: `${VOICEOPENGOV_URL}/regionen/deutschland/${region.slug}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "VoiceOpenGov", item: `${VOICEOPENGOV_URL}/` },
              { "@type": "ListItem", position: 2, name: "Regionen", item: `${VOICEOPENGOV_URL}/regionen` },
              { "@type": "ListItem", position: 3, name: "Deutschland", item: canonical },
            ],
          },
        ]}
      />
      <TranslationStatusNotice
        locale={locale}
        status={getLocaleConfig(locale).defaultTranslationStatus}
      />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#18cfc8]">{copy.eyebrow}</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.whyTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.whyText}</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.modelTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.modelText}</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.guardrailTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.guardrailText}</p>
          </article>
        </div>

        <section className="mt-14" aria-labelledby="states-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18cfc8]">Community · Regionen</p>
            <h2 id="states-heading" className="mt-3 text-3xl font-bold">Bundesländer</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Jeder Einstieg zeigt nur verifizierbare regionale Strukturen. Wo noch keine lokale Community nachweisbar ist, steht ausdrücklich „Community im Aufbau“ statt erfundener Zahlen, Gruppen oder Ansprechpartner.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GERMAN_STATE_REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={href(`/regionen/deutschland/${region.slug}`, locale)}
                className="rounded-2xl border border-slate-800 bg-[#0b1220] px-5 py-4 font-semibold transition hover:border-[#18cfc8] hover:text-[#18cfc8]"
              >
                {region.name} →
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[#18cfc8] px-6 py-3 font-bold text-[#071727]" href={href("/regionen/deutschland/berlin", locale)}>
            {copy.berlinAction} →
          </Link>
          <Link className="rounded-full border border-[#1a8cff] px-6 py-3 font-bold" href={href(REGIONAL_INTEREST_SOURCE_PATH, locale)}>
            {copy.regionalAction}
          </Link>
        </div>
      </section>
    </main>
  );
}
