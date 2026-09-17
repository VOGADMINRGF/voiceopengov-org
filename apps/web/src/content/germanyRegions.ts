import type { SupportedLocale } from "@/config/locales";

export type GermanyRegionStatus = "available" | "building";

export type GermanyStateRegion = {
  slug: string;
  name: string;
  status: GermanyRegionStatus;
};

/**
 * Canonical territorial registry for the German state layer.
 *
 * A registry entry does not imply that a local VoiceOpenGov group, member count,
 * event, partner or spokesperson exists. Only `available` entries may link to a
 * dedicated public regional page. `building` entries stay visible as honest
 * architecture without creating thin or invented local pages.
 */
export const GERMANY_STATE_REGIONS: readonly GermanyStateRegion[] = [
  { slug: "baden-wuerttemberg", name: "Baden-Württemberg", status: "building" },
  { slug: "bayern", name: "Bayern", status: "building" },
  { slug: "berlin", name: "Berlin", status: "available" },
  { slug: "brandenburg", name: "Brandenburg", status: "building" },
  { slug: "bremen", name: "Bremen", status: "building" },
  { slug: "hamburg", name: "Hamburg", status: "building" },
  { slug: "hessen", name: "Hessen", status: "building" },
  { slug: "mecklenburg-vorpommern", name: "Mecklenburg-Vorpommern", status: "building" },
  { slug: "niedersachsen", name: "Niedersachsen", status: "building" },
  { slug: "nordrhein-westfalen", name: "Nordrhein-Westfalen", status: "building" },
  { slug: "rheinland-pfalz", name: "Rheinland-Pfalz", status: "building" },
  { slug: "saarland", name: "Saarland", status: "building" },
  { slug: "sachsen", name: "Sachsen", status: "building" },
  { slug: "sachsen-anhalt", name: "Sachsen-Anhalt", status: "building" },
  { slug: "schleswig-holstein", name: "Schleswig-Holstein", status: "building" },
  { slug: "thueringen", name: "Thüringen", status: "building" },
] as const;

type RegionDirectoryCopy = {
  title: string;
  intro: string;
  available: string;
  building: string;
  buildingDetail: string;
  openRegion: string;
};

export const REGION_DIRECTORY_COPY: Record<SupportedLocale, RegionDirectoryCopy> = {
  de: {
    title: "Bundesländer",
    intro: "Die territoriale Struktur ist vollständig sichtbar. Eine eigene Regionalseite entsteht aber erst, wenn es dort belastbaren Community- oder Themenkontext gibt.",
    available: "Regionaler Einstieg vorhanden",
    building: "Community im Aufbau",
    buildingDetail: "Noch keine eigene Gruppe, Mitgliederzahl, Veranstaltung oder Ansprechperson behauptet.",
    openRegion: "Region öffnen",
  },
  en: {
    title: "Federal states",
    intro: "The territorial structure is visible in full. A dedicated regional page is only published when there is reliable community or topic context.",
    available: "Regional entry available",
    building: "Community being built",
    buildingDetail: "No local group, member count, event or contact person is being claimed yet.",
    openRegion: "Open region",
  },
  fr: {
    title: "Länder allemands",
    intro: "La structure territoriale est visible dans son ensemble. Une page régionale n’est publiée que lorsqu’un contexte communautaire ou thématique fiable existe.",
    available: "Point d’entrée régional disponible",
    building: "Communauté en construction",
    buildingDetail: "Aucun groupe local, nombre de membres, événement ou contact n’est encore revendiqué.",
    openRegion: "Ouvrir la région",
  },
  pl: {
    title: "Kraje związkowe",
    intro: "Pełna struktura terytorialna jest widoczna. Osobna strona regionu powstaje dopiero wtedy, gdy istnieje wiarygodny kontekst społeczności lub tematów.",
    available: "Dostępny punkt regionalny",
    building: "Społeczność w budowie",
    buildingDetail: "Nie deklarujemy jeszcze lokalnej grupy, liczby członków, wydarzenia ani osoby kontaktowej.",
    openRegion: "Otwórz region",
  },
  es: {
    title: "Estados federados",
    intro: "La estructura territorial completa es visible. Solo se publica una página regional propia cuando existe un contexto comunitario o temático fiable.",
    available: "Punto de entrada regional disponible",
    building: "Comunidad en construcción",
    buildingDetail: "Aún no se afirma que exista un grupo local, número de miembros, evento o persona de contacto.",
    openRegion: "Abrir región",
  },
  it: {
    title: "Stati federati",
    intro: "La struttura territoriale completa è visibile. Una pagina regionale dedicata viene pubblicata solo quando esiste un contesto affidabile di comunità o temi.",
    available: "Ingresso regionale disponibile",
    building: "Community in costruzione",
    buildingDetail: "Non viene ancora dichiarata l’esistenza di un gruppo locale, numero di membri, evento o referente.",
    openRegion: "Apri regione",
  },
  tr: {
    title: "Federal eyaletler",
    intro: "Bölgesel yapı bütünüyle görünür. Ayrı bir bölge sayfası ancak güvenilir topluluk veya konu bağlamı olduğunda yayımlanır.",
    available: "Bölgesel giriş mevcut",
    building: "Topluluk kuruluyor",
    buildingDetail: "Henüz yerel grup, üye sayısı, etkinlik veya irtibat kişisi olduğu iddia edilmiyor.",
    openRegion: "Bölgeyi aç",
  },
  ar: {
    title: "الولايات الاتحادية",
    intro: "تظهر البنية الإقليمية كاملة، لكن لا تُنشر صفحة إقليمية مستقلة إلا عند وجود سياق موثوق للمجتمع أو للموضوعات.",
    available: "مدخل إقليمي متاح",
    building: "المجتمع قيد البناء",
    buildingDetail: "لا ندّعي حالياً وجود مجموعة محلية أو عدد أعضاء أو فعالية أو جهة اتصال.",
    openRegion: "فتح المنطقة",
  },
  ru: {
    title: "Федеральные земли",
    intro: "Территориальная структура показана полностью. Отдельная страница региона публикуется только при наличии проверяемого контекста сообщества или тем.",
    available: "Региональный раздел доступен",
    building: "Сообщество формируется",
    buildingDetail: "Пока не заявляется о местной группе, числе участников, мероприятии или контактном лице.",
    openRegion: "Открыть регион",
  },
  zh: {
    title: "联邦州",
    intro: "完整的地区结构会公开展示，但只有在存在可靠的社区或议题背景时才发布独立地区页面。",
    available: "已有地区入口",
    building: "社区建设中",
    buildingDetail: "目前不声称存在本地小组、成员数量、活动或联系人。",
    openRegion: "打开地区",
  },
};
