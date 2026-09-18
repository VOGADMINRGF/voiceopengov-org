import Link from "next/link";
import { getRequestLocale } from "@/lib/locale";

const COPY = {
  de: {
    eyebrow: "VoiceOpenGov vor Ort",
    title:
      "Vielleicht beginnt Veränderung mit einem Tisch und ein paar Menschen aus deiner Nähe.",
    body:
      "Du kannst dich unverbindlich melden, wenn du bei einem regionalen Stammtisch dabei sein, selbst einen ersten Austausch anstoßen oder mit einem Raum, Kontakten oder Erfahrung helfen möchtest.",
    note:
      "Noch keine fertige Gruppe? Kein Problem. Du musst auch nicht alles allein organisieren.",
    primary: "In meiner Region aktiv werden",
    secondary: "Mitmachen ansehen",
  },
  en: {
    eyebrow: "VoiceOpenGov locally",
    title: "Change may begin with one table and a few people from your area.",
    body:
      "You can register without obligation if you would like to join a local meetup, help start a first conversation or contribute a room, contacts or experience.",
    note:
      "No existing group yet? That is fine. You do not need to organise everything alone.",
    primary: "Get active in my region",
    secondary: "See participation options",
  },
};

export default async function RegionalActivationTeaser() {
  const locale = await getRequestLocale();
  const copy = locale === "de" ? COPY.de : COPY.en;

  return (
    <section className="border-y border-[#f4f1e8]/10 bg-[#07110f] px-5 py-20 text-[#f4f1e8] md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2.25rem] border border-[#d6ff65]/22 bg-[radial-gradient(circle_at_82%_20%,rgba(214,255,101,0.17),transparent_36%),#0b1714] p-7 md:grid-cols-[1fr_auto] md:items-end md:p-10">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d6ff65]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.04em] md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#f4f1e8]/62">
            {copy.body}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#f4f1e8]/65">
            {copy.note}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link
            href="/mitmachen#vor-ort"
            className="inline-flex justify-center rounded-full bg-[#d6ff65] px-6 py-3.5 font-black text-[#07110f] transition hover:-translate-y-0.5 hover:bg-[#e2ff8a]"
          >
            {copy.primary}
          </Link>
          <Link
            href="/mitmachen"
            className="inline-flex justify-center rounded-full border border-[#f4f1e8]/18 px-6 py-3.5 font-bold transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]"
          >
            {copy.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
