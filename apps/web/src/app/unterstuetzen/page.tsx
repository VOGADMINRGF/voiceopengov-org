import { getRequestLocale } from "@/lib/locale";
import FundingCheckoutForm from "./FundingCheckoutForm";
import { FUNDING_STRINGS } from "./fundingStrings";

export const metadata = { robots: { index: true, follow: true } };

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
  return <main className="min-h-screen bg-[#020617] px-4 py-16 text-[#f8fafc] sm:px-6" dir={locale === "ar" ? "rtl" : "ltr"}>
    <div className="mx-auto max-w-5xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">{strings.eyebrow}</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{strings.title}</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{strings.body}</p>
      <p className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 font-bold text-cyan-100">{strings.noInfluence}</p>
      {params?.cancelled === "1" && <p className="mt-5 rounded-xl bg-slate-800 p-4">{strings.cancelled}</p>}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><FundingCheckoutForm locale={locale} strings={strings} enabled={stripeEnabled} />
        <aside className="space-y-5"><section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-6"><p className="text-sm leading-relaxed text-slate-300">{strings.provider}</p><p className="mt-4 text-sm leading-relaxed text-slate-300">{strings.fees}</p><p className="mt-4 text-sm leading-relaxed text-slate-300">{strings.withdrawal}</p></section>
          <section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-6"><h2 className="text-xl font-bold">{strings.bankTitle}</h2><p className="mt-2 text-slate-300">{strings.bankBody}</p>{hasBank ? <dl className="mt-4 space-y-2 break-all text-sm"><div><dt className="text-slate-400">Recipient</dt><dd>{bank.recipient}</dd></div><div><dt className="text-slate-400">IBAN</dt><dd>{bank.iban}</dd></div><div><dt className="text-slate-400">BIC</dt><dd>{bank.bic}</dd></div><div><dt className="text-slate-400">Bank</dt><dd>{bank.name}</dd></div></dl> : <p className="mt-4 text-sm text-slate-400">{strings.bankUnavailable}</p>}</section>
        </aside></div></div>
  </main>;
}
