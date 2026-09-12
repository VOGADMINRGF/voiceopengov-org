import Link from "next/link";
import { getRequestLocale } from "@/lib/locale";
import { isCheckoutSessionId } from "@/lib/stripeFunding";
import { FUNDING_STRINGS } from "../fundingStrings";
import FundingStatus from "./FundingStatus";

export const metadata = { robots: { index: false, follow: false } };

export default async function FundingSuccessPage({ searchParams }: { searchParams?: Promise<{ session_id?: string }> }) {
  const locale = await getRequestLocale();
  const strings = FUNDING_STRINGS[locale];
  const params = await searchParams;
  const sessionId = isCheckoutSessionId(params?.session_id) ? params.session_id : undefined;
  return <main className="min-h-screen bg-[#020617] px-5 py-24 text-[#f8fafc]" dir={locale === "ar" ? "rtl" : "ltr"}><section className="mx-auto max-w-2xl rounded-3xl border border-cyan-400/30 bg-slate-900 p-8 text-center"><div className="mx-auto h-2 w-24 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" /><h1 className="mt-8 text-4xl font-black">{strings.successTitle}</h1><p className="mt-5 text-lg leading-relaxed text-slate-300">{strings.successBody}</p><FundingStatus sessionId={sessionId} locale={locale} strings={strings} /><p className="mt-5 rounded-xl bg-cyan-400/10 p-4 font-bold text-cyan-100">{strings.noInfluence}</p><Link href={`/?lang=${locale}`} className="mt-8 inline-flex rounded-full border border-cyan-300 px-6 py-3 font-bold text-cyan-200">{strings.home}</Link></section></main>;
}
