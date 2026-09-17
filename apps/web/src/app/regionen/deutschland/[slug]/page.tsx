import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "@/components/seo/StructuredData";
import TranslationStatusNotice from "@/components/i18n/TranslationStatusNotice";
import { REQUIRED_LAUNCH_LOCALES, getLocaleConfig } from "@/config/locales";
import { VOICEOPENGOV_URL } from "@/config/links";
import { GERMAN_STATE_REGIONS, getGermanStateRegion } from "@/content/regionalStates";
import { regionalSeoLocale } from "@/content/regionalSeo";
import { localeAlternates, localizedCanonicalUrl } from "@/lib/i18n/localeContract";
import { getRequestLocale } from "@/lib/locale";
import { REGIONAL_INTEREST_SOURCE_PATH } from "@/lib/regionalInterestContract";

type PageProps = { params: Promise<{ slug: string }> };

type GenericCopy = {
  eyebrow: string;
  intro: (name: string) => string;
  currentTitle: string;
  currentText: string;
  communityTitle: string;
  communityText: string;
  actionTitle: string;
  actionText: string;
  join: string;
  dossier: string;
  back: string;
};

const COPY: Record<ReturnType<typeof regionalSeoLocale>, GenericCopy> = {
  de: {
    eyebrow: "VoiceOpenGov vor Ort",
    intro: (name) => `VoiceOpenGov ${name} ist der regionale Einstieg für Menschen, Themen und Community. Die Seite bildet nur nachweisbare Strukturen ab und behauptet keine Gruppe, Mitgliederzahl oder Veranstaltung, die noch nicht existiert.`,
    currentTitle: "Aktuell in der Region",
    currentText: "Regionale Themen werden hier erst hervorgehoben, wenn ihre Relevanz und regionale Zuordnung nachvollziehbar belegt sind. Die vertiefende Prüfung von Quellen, Gegenpositionen und Alternativen gehört zu eDebatte.",
    communityTitle: "Community im Aufbau",
    communityText: "Für diese Region ist derzeit keine verifizierte lokale Gruppe, Mitgliederzahl oder feste Ansprechperson veröffentlicht. Sobald belastbare Strukturen existieren, können sie hier transparent sichtbar werden.",
    actionTitle: "Mitmachen",
    actionText: "Du kannst VoiceOpenGov unterstützen, beim regionalen Aufbau mitwirken oder ein Thema zur nachvollziehbaren Bearbeitung in eDebatte weiterführen.",
    join: "Regional aktiv werden",
    dossier: "Thema bei eDebatte prüfen",
    back: "Zurück zu Deutschland",
  },
  en: {
    eyebrow: "VoiceOpenGov locally",
    intro: (name) => `VoiceOpenGov ${name} is the regional entry point for people, topics and community. This page only shows verifiable structures and does not invent a group, membership count or event that does not yet exist.`,
    currentTitle: "Current in the region",
    currentText: "Regional topics are highlighted only when their relevance and regional scope can be traced. Detailed work on sources, counterpositions and alternatives belongs to eDebatte.",
    communityTitle: "Community being built",
    communityText: "No verified local group, membership count or permanent contact is currently published for this region. Verified structures can be shown transparently once they exist.",
    actionTitle: "Take part",
    actionText: "You can support VoiceOpenGov, help build the regional community or take a topic to eDebatte for traceable examination.",
    join: "Get active locally",
    dossier: "Examine a topic on eDebatte",
    back: "Back to Germany",
  },
  fr: {
    eyebrow: "VoiceOpenGov localement",
    intro: (name) => `VoiceOpenGov ${name} est le point d’entrée régional pour les personnes, les sujets et la communauté. Cette page ne montre que des structures vérifiables et n’invente ni groupe, ni nombre de membres, ni événement.`,
    currentTitle: "Actuellement dans la région",
    currentText: "Les sujets régionaux ne sont mis en avant que lorsque leur pertinence et leur rattachement régional sont vérifiables. L’examen approfondi des sources, contre-positions et alternatives relève d’eDebatte.",
    communityTitle: "Communauté en construction",
    communityText: "Aucun groupe local vérifié, nombre de membres ou contact permanent n’est actuellement publié pour cette région. Les structures vérifiées pourront être rendues visibles lorsqu’elles existeront.",
    actionTitle: "Participer",
    actionText: "Vous pouvez soutenir VoiceOpenGov, contribuer au développement régional ou poursuivre l’examen d’un sujet sur eDebatte.",
    join: "Agir dans ma région",
    dossier: "Examiner un sujet sur eDebatte",
    back: "Retour à l’Allemagne",
  },
  es: {
    eyebrow: "VoiceOpenGov en tu región",
    intro: (name) => `VoiceOpenGov ${name} es el punto de entrada regional para personas, temas y comunidad. Esta página solo muestra estructuras verificables y no inventa grupos, cifras de miembros ni eventos que aún no existan.`,
    currentTitle: "Actualidad regional",
    currentText: "Los temas regionales solo se destacan cuando su relevancia y alcance regional pueden justificarse. El análisis detallado de fuentes, posiciones contrarias y alternativas corresponde a eDebatte.",
    communityTitle: "Comunidad en construcción",
    communityText: "Actualmente no se publica ningún grupo local verificado, cifra de miembros ni contacto permanente para esta región. Las estructuras verificadas podrán mostrarse cuando existan.",
    actionTitle: "Participar",
    actionText: "Puedes apoyar VoiceOpenGov, ayudar a construir la comunidad regional o llevar un tema a eDebatte para su análisis trazable.",
    join: "Participar en mi región",
    dossier: "Analizar un tema en eDebatte",
    back: "Volver a Alemania",
  },
  tr: {
    eyebrow: "VoiceOpenGov yerelde",
    intro: (name) => `VoiceOpenGov ${name}, insanlar, konular ve topluluk için bölgesel giriş noktasıdır. Bu sayfa yalnızca doğrulanabilir yapıları gösterir; henüz var olmayan grup, üye sayısı veya etkinlikleri varmış gibi göstermez.`,
    currentTitle: "Bölgede güncel",
    currentText: "Bölgesel konular yalnızca önemleri ve bölgesel bağları izlenebilir olduğunda öne çıkarılır. Kaynaklar, karşı görüşler ve alternatiflerin ayrıntılı incelenmesi eDebatte’ye aittir.",
    communityTitle: "Topluluk oluşturuluyor",
    communityText: "Bu bölge için şu anda doğrulanmış bir yerel grup, üye sayısı veya kalıcı irtibat kişisi yayımlanmamıştır. Doğrulanmış yapılar oluştuğunda şeffaf biçimde gösterilebilir.",
    actionTitle: "Katıl",
    actionText: "VoiceOpenGov’u destekleyebilir, bölgesel topluluğun kurulmasına katkıda bulunabilir veya bir konuyu izlenebilir inceleme için eDebatte’ye taşıyabilirsin.",
    join: "Bölgemde aktif ol",
    dossier: "Konuyu eDebatte’de incele",
    back: "Almanya’ya dön",
  },
  ar: {
    eyebrow: "VoiceOpenGov محليًا",
    intro: (name) => `VoiceOpenGov ${name} هو المدخل الإقليمي للأشخاص والموضوعات والمجتمع. تعرض هذه الصفحة الهياكل القابلة للتحقق فقط ولا تدّعي وجود مجموعة أو عدد أعضاء أو فعالية غير موجودة بعد.`,
    currentTitle: "حاليًا في المنطقة",
    currentText: "لا تُبرز الموضوعات الإقليمية إلا عندما تكون أهميتها وصلتها بالمنطقة قابلة للتتبع. أما الفحص المتعمق للمصادر والمواقف المقابلة والبدائل فهو من اختصاص eDebatte.",
    communityTitle: "المجتمع قيد البناء",
    communityText: "لا توجد حاليًا مجموعة محلية موثقة أو أعداد أعضاء أو جهة اتصال دائمة منشورة لهذه المنطقة. يمكن إظهار الهياكل الموثقة بشفافية عند وجودها.",
    actionTitle: "شارك",
    actionText: "يمكنك دعم VoiceOpenGov أو المساعدة في بناء المجتمع الإقليمي أو نقل موضوع إلى eDebatte لفحصه بصورة قابلة للتتبع.",
    join: "شارك محليًا",
    dossier: "افحص موضوعًا في eDebatte",
    back: "العودة إلى ألمانيا",
  },
};

function localHref(path: string, locale: string) {
  const url = new URL(path, VOICEOPENGOV_URL);
  if (locale !== "de") url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}

export function generateStaticParams() {
  return GERMAN_STATE_REGIONS.filter((region) => region.slug !== "berlin").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getGermanStateRegion(slug);
  if (!region || region.slug === "berlin") return {};
  const locale = regionalSeoLocale(await getRequestLocale());
  const copy = COPY[locale];
  const path = `/regionen/deutschland/${region.slug}`;
  const baseCanonical = `${VOICEOPENGOV_URL}${path}`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);
  const title = `VoiceOpenGov ${region.name}`;
  const description = copy.intro(region.name);

  return {
    title,
    description,
    robots: {
      index: region.searchVisibility === "index",
      follow: true,
    },
    alternates: { canonical, languages: localeAlternates(baseCanonical, REQUIRED_LAUNCH_LOCALES) },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function StateRegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = getGermanStateRegion(slug);
  if (!region || region.slug === "berlin") notFound();

  const locale = regionalSeoLocale(await getRequestLocale());
  const copy = COPY[locale];
  const path = `/regionen/deutschland/${region.slug}`;
  const baseCanonical = `${VOICEOPENGOV_URL}${path}`;
  const canonical = localizedCanonicalUrl(baseCanonical, locale);

  return (
    <main className="bg-[#020617] text-[#f8fafc]">
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${canonical}#page`,
          url: canonical,
          name: `VoiceOpenGov ${region.name}`,
          description: copy.intro(region.name),
          inLanguage: getLocaleConfig(locale).bcp47,
          isPartOf: { "@type": "WebSite", "@id": `${VOICEOPENGOV_URL}/#website`, name: "VoiceOpenGov", url: `${VOICEOPENGOV_URL}/` },
          about: { "@type": "AdministrativeArea", name: region.name, containedInPlace: { "@type": "Country", name: "Germany" } },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "VoiceOpenGov", item: `${VOICEOPENGOV_URL}/` },
            { "@type": "ListItem", position: 2, name: "Regionen", item: `${VOICEOPENGOV_URL}/regionen` },
            { "@type": "ListItem", position: 3, name: "Deutschland", item: `${VOICEOPENGOV_URL}/regionen/deutschland` },
            { "@type": "ListItem", position: 4, name: region.name, item: canonical },
          ],
        },
      ]} />
      <TranslationStatusNotice locale={locale} status={getLocaleConfig(locale).defaultTranslationStatus} />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#18cfc8]">{copy.eyebrow}</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">VoiceOpenGov {region.name}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro(region.name)}</p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.currentTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.currentText}</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.communityTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.communityText}</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-[#0b1220] p-7">
            <h2 className="text-2xl font-bold">{copy.actionTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{copy.actionText}</p>
          </article>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[#18cfc8] px-6 py-3 font-bold text-[#071727]" href={localHref(REGIONAL_INTEREST_SOURCE_PATH, locale)}>{copy.join}</Link>
          <Link className="rounded-full border border-[#1a8cff] px-6 py-3 font-bold" href={localHref("/go/edebatte", locale)}>{copy.dossier} →</Link>
          <Link className="rounded-full border border-slate-700 px-6 py-3 font-bold" href={localHref("/regionen/deutschland", locale)}>{copy.back}</Link>
        </div>
      </section>
    </main>
  );
}
