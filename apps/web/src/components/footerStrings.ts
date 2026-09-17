import { DEFAULT_LOCALE, type SupportedLocale } from "@/config/locales";
import {
  VOG_JOIN_PATH,
  VOG_QUESTIONS_PATH,
  VOG_ROLES_PATH,
  VOG_SUPPORT_PATH,
  VOG_TRANSPARENCY_PATH,
} from "@/config/links";

type FooterStrings = {
  brand: {
    claim: string;
    body: string;
  };
  columns: {
    main: string;
    initiatives: string;
    legal: string;
  };
  aria: {
    main: string;
    initiatives: string;
    legal: string;
  };
  links: {
    main: Array<{ href: string; label: string }>;
    initiatives: Array<{ href: string; label: string }>;
    legal: Array<{ href: string; label: string }>;
  };
  poweredBy: string;
};

const STRINGS: Record<SupportedLocale, FooterStrings> = {
  de: {
    brand: {
      claim: "Internationale Initiative & Community.",
      body: "Für nachvollziehbare Entscheidungsgrundlagen, offene Beteiligung und transparente Verantwortlichkeiten.",
    },
    columns: {
      main: "Mitmachen",
      initiatives: "Vertiefen",
      legal: "Kontakt & Rechtliches",
    },
    aria: {
      main: "Footer Navigation: Mitmachen",
      initiatives: "Footer Navigation: Initiativen",
      legal: "Footer Navigation: Kontakt und Rechtliches",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Community beitreten" },
        { href: VOG_QUESTIONS_PATH, label: "50 öffentliche Fragen" },
        { href: VOG_TRANSPARENCY_PATH, label: "Transparenz" },
        { href: VOG_ROLES_PATH, label: "Mitwirkungsrollen" },
        { href: VOG_SUPPORT_PATH, label: "Unterstützen" },
      ],
      initiatives: [
        { href: "/initiatives", label: "Für Initiativen" },
        { href: "/dossier", label: "Öffentliche Dossiers" },
      ],
      legal: [
        { href: "/kontakt", label: "Kontakt" },
        { href: "/impressum", label: "Impressum" },
        { href: "/datenschutz", label: "Datenschutz" },
      ],
    },
    poweredBy: "powered by Ricky G. Fleischer",
  },
  en: {
    brand: {
      claim: "International initiative & community.",
      body: "For traceable decision information, open participation and transparent responsibilities.",
    },
    columns: {
      main: "Participate",
      initiatives: "Explore",
      legal: "Contact & legal",
    },
    aria: {
      main: "Footer navigation: Participate",
      initiatives: "Footer navigation: Initiatives",
      legal: "Footer navigation: Contact and legal",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Join the community" },
        { href: VOG_QUESTIONS_PATH, label: "50 public questions" },
        { href: VOG_TRANSPARENCY_PATH, label: "Transparency" },
        { href: VOG_ROLES_PATH, label: "Ways to contribute" },
        { href: VOG_SUPPORT_PATH, label: "Support" },
      ],
      initiatives: [
        { href: "/initiatives", label: "For initiatives" },
        { href: "/dossier", label: "Public dossiers" },
      ],
      legal: [
        { href: "/kontakt", label: "Contact" },
        { href: "/impressum", label: "Legal notice" },
        { href: "/datenschutz", label: "Privacy" },
      ],
    },
    poweredBy: "powered by Ricky G. Fleischer",
  },
  fr: {
    brand: {
      claim: "Initiative et communauté internationales.",
      body: "Pour des bases de décision traçables, une participation ouverte et des responsabilités transparentes.",
    },
    columns: {
      main: "Participer",
      initiatives: "Pour les initiatives",
      legal: "Contact & juridique",
    },
    aria: {
      main: "Navigation pied de page : Participer",
      initiatives: "Navigation pied de page : Initiatives",
      legal: "Navigation pied de page : Contact et juridique",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Rejoindre la communauté" },
        { href: "/dossier", label: "Dossier" },
        { href: VOG_SUPPORT_PATH, label: "Soutenir" },
      ],
      initiatives: [{ href: "/initiatives", label: "Pour les initiatives" }],
      legal: [
        { href: "/kontakt", label: "Contact" },
        { href: "/impressum", label: "Mention légale" },
        { href: "/datenschutz", label: "Confidentialité" },
      ],
    },
    poweredBy: "propulsé par Ricky G. Fleischer",
  },
  pl: {
    brand: {
      claim: "Międzynarodowa inicjatywa i społeczność.",
      body: "Dla przejrzystych podstaw decyzji, otwartego uczestnictwa i jasnych odpowiedzialności.",
    },
    columns: {
      main: "Dołącz",
      initiatives: "Dla inicjatyw",
      legal: "Kontakt i prawo",
    },
    aria: {
      main: "Nawigacja stopki: Dołącz",
      initiatives: "Nawigacja stopki: Inicjatywy",
      legal: "Nawigacja stopki: Kontakt i prawo",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Dołącz do społeczności" },
        { href: "/dossier", label: "Dossier" },
        { href: VOG_SUPPORT_PATH, label: "Wesprzyj" },
      ],
      initiatives: [{ href: "/initiatives", label: "Dla inicjatyw" }],
      legal: [
        { href: "/kontakt", label: "Kontakt" },
        { href: "/impressum", label: "Impressum" },
        { href: "/datenschutz", label: "Prywatność" },
      ],
    },
    poweredBy: "powered by Ricky G. Fleischer",
  },
  es: {
    brand: {
      claim: "Iniciativa y comunidad internacional.",
      body: "Para información de decisión trazable, participación abierta y responsabilidades transparentes.",
    },
    columns: {
      main: "Participar",
      initiatives: "Para iniciativas",
      legal: "Contacto y legal",
    },
    aria: {
      main: "Navegación del pie: Participar",
      initiatives: "Navegación del pie: Iniciativas",
      legal: "Navegación del pie: Contacto y legal",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Unirse a la comunidad" },
        { href: "/dossier", label: "Dossier" },
        { href: VOG_SUPPORT_PATH, label: "Apoyar" },
      ],
      initiatives: [{ href: "/initiatives", label: "Para iniciativas" }],
      legal: [
        { href: "/kontakt", label: "Contacto" },
        { href: "/impressum", label: "Aviso legal" },
        { href: "/datenschutz", label: "Privacidad" },
      ],
    },
    poweredBy: "impulsado por Ricky G. Fleischer",
  },
  it: {
    brand: {
      claim: "Iniziativa e comunità internazionale.",
      body: "Per basi decisionali tracciabili, partecipazione aperta e responsabilità trasparenti.",
    },
    columns: {
      main: "Partecipa",
      initiatives: "Per iniziative",
      legal: "Contatto e legale",
    },
    aria: {
      main: "Navigazione footer: Partecipa",
      initiatives: "Navigazione footer: Iniziative",
      legal: "Navigazione footer: Contatto e legale",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Unisciti alla community" },
        { href: "/dossier", label: "Dossier" },
        { href: VOG_SUPPORT_PATH, label: "Sostieni" },
      ],
      initiatives: [{ href: "/initiatives", label: "Per iniziative" }],
      legal: [
        { href: "/kontakt", label: "Contatto" },
        { href: "/impressum", label: "Note legali" },
        { href: "/datenschutz", label: "Privacy" },
      ],
    },
    poweredBy: "realizzato da Ricky G. Fleischer",
  },
  tr: {
    brand: {
      claim: "Uluslararası girişim ve topluluk.",
      body: "İzlenebilir karar bilgisi, açık katılım ve şeffaf sorumluluklar için.",
    },
    columns: {
      main: "Katıl",
      initiatives: "Girişimler için",
      legal: "İletişim ve hukuki",
    },
    aria: {
      main: "Altbilgi gezinme: Katıl",
      initiatives: "Altbilgi gezinme: Girişimler",
      legal: "Altbilgi gezinme: İletişim ve hukuki",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Topluluğa katıl" },
        { href: "/dossier", label: "Dossier" },
        { href: VOG_SUPPORT_PATH, label: "Destekle" },
      ],
      initiatives: [{ href: "/initiatives", label: "Girişimler için" }],
      legal: [
        { href: "/kontakt", label: "İletişim" },
        { href: "/impressum", label: "Yasal bildirim" },
        { href: "/datenschutz", label: "Gizlilik" },
      ],
    },
    poweredBy: "Ricky G. Fleischer tarafından",
  },
  ar: {
    brand: {
      claim: "مبادرة ومجتمع دولي.",
      body: "من أجل معلومات قابلة للتتبع لاتخاذ القرار ومشاركة مفتوحة ومسؤوليات شفافة.",
    },
    columns: {
      main: "شارك",
      initiatives: "للمبادرات",
      legal: "التواصل والشؤون القانونية",
    },
    aria: {
      main: "تنقل التذييل: شارك",
      initiatives: "تنقل التذييل: المبادرات",
      legal: "تنقل التذييل: التواصل والشؤون القانونية",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "انضم إلى المجتمع" },
        { href: "/dossier", label: "ملف" },
        { href: VOG_SUPPORT_PATH, label: "ادعم" },
      ],
      initiatives: [{ href: "/initiatives", label: "للمبادرات" }],
      legal: [
        { href: "/kontakt", label: "تواصل" },
        { href: "/impressum", label: "إشعار قانوني" },
        { href: "/datenschutz", label: "الخصوصية" },
      ],
    },
    poweredBy: "بدعم من Ricky G. Fleischer",
  },
  ru: {
    brand: {
      claim: "Международная инициатива и сообщество.",
      body: "Для прослеживаемой информации для решений, открытого участия и прозрачной ответственности.",
    },
    columns: {
      main: "Участвовать",
      initiatives: "Для инициатив",
      legal: "Контакт и право",
    },
    aria: {
      main: "Навигация подвала: Участвовать",
      initiatives: "Навигация подвала: Инициативы",
      legal: "Навигация подвала: Контакт и право",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "Присоединиться к сообществу" },
        { href: "/dossier", label: "Досье" },
        { href: VOG_SUPPORT_PATH, label: "Поддержать" },
      ],
      initiatives: [{ href: "/initiatives", label: "Для инициатив" }],
      legal: [
        { href: "/kontakt", label: "Контакт" },
        { href: "/impressum", label: "Правовые сведения" },
        { href: "/datenschutz", label: "Конфиденциальность" },
      ],
    },
    poweredBy: "при поддержке Ricky G. Fleischer",
  },
  zh: {
    brand: {
      claim: "国际倡议与社区。",
      body: "致力于可追溯的决策信息、开放参与和透明责任。",
    },
    columns: {
      main: "参与",
      initiatives: "面向倡议",
      legal: "联系与法律",
    },
    aria: {
      main: "页脚导航：参与",
      initiatives: "页脚导航：倡议",
      legal: "页脚导航：联系与法律",
    },
    links: {
      main: [
        { href: VOG_JOIN_PATH, label: "加入社区" },
        { href: "/dossier", label: "档案" },
        { href: VOG_SUPPORT_PATH, label: "支持" },
      ],
      initiatives: [{ href: "/initiatives", label: "面向倡议" }],
      legal: [
        { href: "/kontakt", label: "联系" },
        { href: "/impressum", label: "法律声明" },
        { href: "/datenschutz", label: "隐私" },
      ],
    },
    poweredBy: "由 Ricky G. Fleischer 提供支持",
  },
};

export function getFooterStrings(locale: SupportedLocale | string): FooterStrings {
  const normalized = (locale || DEFAULT_LOCALE) as SupportedLocale;
  return STRINGS[normalized] ?? STRINGS[DEFAULT_LOCALE];
}
