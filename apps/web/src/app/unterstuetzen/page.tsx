import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/locale";
import { REQUIRED_LAUNCH_LOCALES } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { localeAlternates, localizedCanonicalUrl } from "@/lib/i18n/localeContract";
import FundingCheckoutForm from "./FundingCheckoutForm";
import { FUNDING_STRINGS } from "./fundingStrings";

const META = {
  de: {
    title: "VoiceOpenGov freiwillig unterstützen",
    description: "VoiceOpenGov freiwillig finanziell unterstützen. Beiträge kaufen kein Stimmgewicht und sind von kostenfreier Beteiligung und politischer Repräsentation getrennt.",
  },
  en: {
    title: "Support VoiceOpenGov voluntarily",
    description: "Support VoiceOpenGov voluntarily. Financial support does not buy voting weight and remains separate from free participation and political representation.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = locale === "de" ? META.de : META.en;
  const baseCanonical = `${VOICEOPENGOV_URL}/unterstuetzen`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical, languages: localeAlternates(baseCanonical, REQUIRED_LAUNCH_LOCALES) },
    openGraph: { title: copy.title, description: copy.description, url: canonical, type: "website" },
    twitter: { card: "summary", title: copy.title, description: copy.description },
    robots: { index: true, follow: true },
  };
}

export default async function SupportPage({ searchParams }: { searchParams?: Promise<{ cancelled?: string }> }) {
  const locale = await getRequestLocale();
  const strings = FUNDING_STRINGS[locale];
  const params = await searchParams;
  const bank = {
    recipient: process.env.VOG_PAYMENT_BANK_RECIPIENT,
    iban: process.env.VOG_PAYMENT_BANK_IBAN,
    bic: process.env.VOG_PAYMENT_BANK_BIC,
    name: process.env.VOG_PAYMENT_BANK_NAME,
  };
  const hasBank = Object.values(bank).every(Boolean);
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
  const providerStatus = locale === "de"
    ? "Aufbauphase: VoiceOpenGov wird derzeit von Ricky G. Fleischer als natürlicher Person betrieben. Es besteht aktuell kein eigener Rechtsträger für VoiceOpenGov; insbesondere sind eine VOG Holding oder eine Gesellschaft derzeit nicht Vertragspartner oder Zahlungsempfänger. Bis zu einer wirksamen späteren Umstellung ist Ricky G. Fleischer Zahlungsempfänger. Die Unterstützung ist freiwillig, von der kostenfreien Mitgliedschaft getrennt und wird nicht als steuerbegünstigte Spende angeboten; Zuwendungsbestätigungen werden nicht ausgestellt."
    : "Build phase: VoiceOpenGov is currently operated by Ricky G. Fleischer as a natural person. VoiceOpenGov currently has no separate legal entity; in particular, no VOG Holding or company is currently the contractual partner or payment recipient. Until a later effective transition, Ricky G. Fleischer is the payment recipient. Support is voluntary, separate from free membership and is not offered as a tax-privileged charitable donation; no charitable contribution receipts are issued.";

  return <main className="min-h-screen bg-[#020617] px-4 py-16 text-[#f8fafc] sm:px-6" dir={locale === "ar" ? "rtl" : "ltr"}>
    <div className="mx-auto max-w-5xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">{strings.eyebrow}</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{strings.title}</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{strings.body}</p>
      <p className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 font-bold text-cyan-100">{strings.noInfluence}</p>
      <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-relaxed text-amber-50">{providerStatus}</p>
      {params?.cancelled === "1" && <p className="mt-5 rounded-xl bg-slate-800 p-4">{strings.cancelled}</p>}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><FundingCheckoutForm locale={locale} strings={strings} enabled={stripeEnabled} />
        <aside className="space-y-5"><section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-6"><p className="text-sm leading-relaxed text-slate-300">{strings.provider}</p><p className="mt-4 text-sm leading-relaxed text-slate-300">{strings.fees}</p><p className="mt-4 text-sm leading-relaxed text-slate-300">{strings.withdrawal}</p></section>
          <section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-6"><h2 className="text-xl font-bold">{strings.bankTitle}</h2><p className="mt-2 text-slate-300">{strings.bankBody}</p>{hasBank ? <dl className="mt-4 space-y-2 break-all text-sm"><div><dt className="text-slate-400">Recipient</dt><dd>{bank.recipient}</dd></div><div><dt className="text-slate-400">IBAN</dt><dd>{bank.iban}</dd></div><div><dt className="text-slate-400">BIC</dt><dd>{bank.bic}</dd></div><div><dt className="text-slate-400">Bank</dt><dd>{bank.name}</dd></div></dl> : <p className="mt-4 text-sm text-slate-400">{strings.bankUnavailable}</p>}</section>
        </aside></div></div>
  </main>;
}
