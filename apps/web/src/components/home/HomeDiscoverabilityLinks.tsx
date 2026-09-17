import Link from "next/link";
import type { SupportedLocale } from "@/config/locales";
import { EDEBATTE_URL, VOTE4GOV_URL } from "@/config/links";

type Copy = {
  eyebrow: string;
  title: string;
  body: string;
  regions: string;
  regionsBody: string;
  edebatte: string;
  edebatteBody: string;
  vote4gov: string;
  vote4govBody: string;
};

const COPY: Record<SupportedLocale, Copy> = {
  de: {
    eyebrow: "Das Ökosystem",
    title: "Menschen verbinden. Themen prüfen. Systemfragen offen stellen.",
    body: "VoiceOpenGov, eDebatte und Vote4Gov haben bewusst unterschiedliche Aufgaben. So bleibt sichtbar, wo Community entsteht, wo Evidenz bearbeitet wird und wo größere Systemfragen geprüft werden.",
    regions: "Regionen & Community",
    regionsBody: "VoiceOpenGov verbindet Menschen, regionale Präsenz und nachweislich vorhandene lokale Aktivitäten.",
    edebatte: "eDebatte · Evidenz & Beteiligung",
    edebatteBody: "Quellen, Gegenpositionen, Dossiers, Alternativen, Beteiligung und Wirkung werden dort fachlich bearbeitet.",
    vote4gov: "Vote4Gov · Review & Systemfragen",
    vote4govBody: "Kritische Thesen, institutionelle Fragen und internationale Vergleiche werden dort als prüfbare Fragen behandelt.",
  },
  en: {
    eyebrow: "The ecosystem",
    title: "Connect people. Examine issues. Keep system questions open to review.",
    body: "VoiceOpenGov, eDebatte and Vote4Gov deliberately have different roles, keeping community, evidence work and system review clearly separated.",
    regions: "Regions & community",
    regionsBody: "VoiceOpenGov connects people, regional presence and locally verified activity.",
    edebatte: "eDebatte · Evidence & participation",
    edebatteBody: "Sources, counterpositions, dossiers, alternatives, participation and impact are worked on there.",
    vote4gov: "Vote4Gov · Review & system questions",
    vote4govBody: "Critical theses, institutional questions and international comparisons are treated there as questions to be examined.",
  },
  fr: {
    eyebrow: "L’écosystème",
    title: "Relier les personnes. Examiner les sujets. Questionner les systèmes.",
    body: "VoiceOpenGov, eDebatte et Vote4Gov ont volontairement des rôles distincts afin de séparer clairement communauté, travail sur les preuves et examen des systèmes.",
    regions: "Régions & communauté",
    regionsBody: "VoiceOpenGov relie les personnes, la présence régionale et les activités locales vérifiables.",
    edebatte: "eDebatte · Preuves & participation",
    edebatteBody: "Les sources, contre-positions, dossiers, alternatives, participation et effets y sont examinés.",
    vote4gov: "Vote4Gov · Revue & questions de système",
    vote4govBody: "Les thèses critiques, questions institutionnelles et comparaisons internationales y sont formulées comme des questions à examiner.",
  },
  pl: {
    eyebrow: "Ekosystem",
    title: "Łączyć ludzi. Badać tematy. Stawiać otwarte pytania systemowe.",
    body: "VoiceOpenGov, eDebatte i Vote4Gov mają celowo różne role, aby wyraźnie oddzielić społeczność, pracę nad dowodami i analizę systemową.",
    regions: "Regiony i społeczność",
    regionsBody: "VoiceOpenGov łączy ludzi, obecność regionalną i zweryfikowaną aktywność lokalną.",
    edebatte: "eDebatte · Dowody i uczestnictwo",
    edebatteBody: "Tam opracowywane są źródła, kontrstanowiska, dossier, alternatywy, uczestnictwo i skutki.",
    vote4gov: "Vote4Gov · Przegląd i pytania systemowe",
    vote4govBody: "Krytyczne tezy, pytania instytucjonalne i porównania międzynarodowe są tam traktowane jako kwestie do sprawdzenia.",
  },
  es: {
    eyebrow: "El ecosistema",
    title: "Conectar personas. Examinar temas. Abrir preguntas sobre el sistema.",
    body: "VoiceOpenGov, eDebatte y Vote4Gov tienen funciones deliberadamente distintas para separar comunidad, trabajo con evidencias y revisión de sistemas.",
    regions: "Regiones y comunidad",
    regionsBody: "VoiceOpenGov conecta personas, presencia regional y actividad local verificable.",
    edebatte: "eDebatte · Evidencia y participación",
    edebatteBody: "Allí se trabajan fuentes, posiciones contrarias, expedientes, alternativas, participación e impacto.",
    vote4gov: "Vote4Gov · Revisión y preguntas de sistema",
    vote4govBody: "Las tesis críticas, cuestiones institucionales y comparaciones internacionales se tratan allí como preguntas que deben examinarse.",
  },
  it: {
    eyebrow: "L’ecosistema",
    title: "Collegare le persone. Esaminare i temi. Aprire domande sul sistema.",
    body: "VoiceOpenGov, eDebatte e Vote4Gov hanno ruoli volutamente distinti per separare comunità, lavoro sulle evidenze e revisione dei sistemi.",
    regions: "Regioni e comunità",
    regionsBody: "VoiceOpenGov collega persone, presenza regionale e attività locali verificabili.",
    edebatte: "eDebatte · Evidenze e partecipazione",
    edebatteBody: "Fonti, controposizioni, dossier, alternative, partecipazione e impatto vengono elaborati lì.",
    vote4gov: "Vote4Gov · Revisione e domande di sistema",
    vote4govBody: "Tesi critiche, questioni istituzionali e confronti internazionali vengono trattati come domande da esaminare.",
  },
  tr: {
    eyebrow: "Ekosistem",
    title: "İnsanları buluştur. Konuları incele. Sistem sorularını açık tut.",
    body: "VoiceOpenGov, eDebatte ve Vote4Gov topluluk, kanıt çalışması ve sistem incelemesini açıkça ayırmak için bilinçli olarak farklı rollere sahiptir.",
    regions: "Bölgeler ve topluluk",
    regionsBody: "VoiceOpenGov insanları, bölgesel varlığı ve doğrulanabilir yerel faaliyetleri bir araya getirir.",
    edebatte: "eDebatte · Kanıt ve katılım",
    edebatteBody: "Kaynaklar, karşı görüşler, dosyalar, alternatifler, katılım ve etki burada işlenir.",
    vote4gov: "Vote4Gov · İnceleme ve sistem soruları",
    vote4govBody: "Eleştirel tezler, kurumsal sorular ve uluslararası karşılaştırmalar burada incelenecek sorular olarak ele alınır.",
  },
  ar: {
    eyebrow: "المنظومة",
    title: "ربط الناس. فحص القضايا. إبقاء أسئلة النظام مفتوحة للمراجعة.",
    body: "لدى VoiceOpenGov وeDebatte وVote4Gov أدوار مختلفة عمداً حتى تبقى أعمال المجتمع والأدلة ومراجعة الأنظمة منفصلة بوضوح.",
    regions: "المناطق والمجتمع",
    regionsBody: "تربط VoiceOpenGov الناس والحضور الإقليمي والنشاط المحلي القابل للتحقق.",
    edebatte: "eDebatte · الأدلة والمشاركة",
    edebatteBody: "تُعالج هناك المصادر والمواقف المقابلة والملفات والبدائل والمشاركة والأثر.",
    vote4gov: "Vote4Gov · المراجعة وأسئلة النظام",
    vote4govBody: "تُطرح هناك الأطروحات النقدية والأسئلة المؤسسية والمقارنات الدولية بوصفها أسئلة قابلة للفحص.",
  },
  ru: {
    eyebrow: "Экосистема",
    title: "Объединять людей. Проверять темы. Оставлять системные вопросы открытыми для анализа.",
    body: "VoiceOpenGov, eDebatte и Vote4Gov намеренно выполняют разные роли, чтобы сообщество, работа с доказательствами и системный анализ оставались разделёнными.",
    regions: "Регионы и сообщество",
    regionsBody: "VoiceOpenGov связывает людей, региональное присутствие и проверяемую местную активность.",
    edebatte: "eDebatte · Доказательства и участие",
    edebatteBody: "Там ведётся работа с источниками, контрпозициями, досье, альтернативами, участием и последствиями.",
    vote4gov: "Vote4Gov · Обзор и системные вопросы",
    vote4govBody: "Критические тезисы, институциональные вопросы и международные сравнения рассматриваются там как вопросы для проверки.",
  },
  zh: {
    eyebrow: "生态体系",
    title: "连接人群。审视议题。让制度问题保持可检验。",
    body: "VoiceOpenGov、eDebatte 和 Vote4Gov 有意承担不同职责，以清晰区分社区组织、证据工作和制度审视。",
    regions: "地区与社区",
    regionsBody: "VoiceOpenGov 连接人群、地区存在和可核实的本地活动。",
    edebatte: "eDebatte · 证据与参与",
    edebatteBody: "来源、反方观点、档案、备选方案、参与和影响在这里进行处理。",
    vote4gov: "Vote4Gov · 审视与制度问题",
    vote4govBody: "批判性论点、制度问题和国际比较在这里作为待检验的问题处理。",
  },
};

function localHref(path: string, locale: SupportedLocale) {
  if (locale === "de") return path;
  const params = new URLSearchParams({ lang: locale });
  return `${path}?${params.toString()}`;
}

function bridgeHref(path: string, locale: SupportedLocale) {
  const params = new URLSearchParams({ lang: locale });
  return `${path}?${params.toString()}`;
}

export default function HomeDiscoverabilityLinks({ locale }: { locale: SupportedLocale }) {
  const copy = COPY[locale] ?? COPY.en;

  return (
    <section className="border-t border-slate-800 bg-[#020617]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-18">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18cfc8]">{copy.eyebrow}</p>
        <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">{copy.body}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Link href={localHref("/regionen", locale)} className="rounded-3xl border border-slate-800 bg-[#0b1220] p-6 transition hover:border-[#18cfc8]/60">
            <strong className="text-xl">{copy.regions}</strong>
            <span className="mt-3 block leading-7 text-slate-300">{copy.regionsBody}</span>
          </Link>
          <Link href={bridgeHref(EDEBATTE_URL, locale)} className="rounded-3xl border border-slate-800 bg-[#0b1220] p-6 transition hover:border-[#1a8cff]/70">
            <strong className="text-xl">{copy.edebatte}</strong>
            <span className="mt-3 block leading-7 text-slate-300">{copy.edebatteBody}</span>
          </Link>
          <Link href={bridgeHref(VOTE4GOV_URL, locale)} className="rounded-3xl border border-slate-800 bg-[#0b1220] p-6 transition hover:border-[#1a8cff]/70">
            <strong className="text-xl">{copy.vote4gov}</strong>
            <span className="mt-3 block leading-7 text-slate-300">{copy.vote4govBody}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
