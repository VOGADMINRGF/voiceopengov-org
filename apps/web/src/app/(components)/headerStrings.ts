import { DEFAULT_LOCALE, type SupportedLocale } from "@/config/locales";

type HeaderStrings = {
  navigationLabel: string;
  localeLabel: string;
  menuLabel: string;
  theme: {
    label: string;
    system: string;
    light: string;
  };
  aria: {
    localeSelect: string;
    openNav: string;
    mobileNav: string;
  };
};

const STRINGS: Record<SupportedLocale, HeaderStrings> = {
  de: {
    navigationLabel: "Navigation",
    localeLabel: "Sprache",
    menuLabel: "Menü",
    theme: { label: "Darstellung", system: "System", light: "Hell" },
    aria: {
      localeSelect: "Sprache wählen (aktuell {label})",
      openNav: "Navigation öffnen",
      mobileNav: "Mobile Navigation",
    },
  },
  en: {
    navigationLabel: "Navigation",
    localeLabel: "Language",
    menuLabel: "Menu",
    theme: { label: "Appearance", system: "System", light: "Light" },
    aria: {
      localeSelect: "Choose language (current {label})",
      openNav: "Open navigation",
      mobileNav: "Mobile navigation",
    },
  },
  fr: {
    navigationLabel: "Navigation",
    localeLabel: "Langue",
    menuLabel: "Menu",
    theme: { label: "Apparence", system: "Système", light: "Clair" },
    aria: {
      localeSelect: "Choisir la langue (actuellement {label})",
      openNav: "Ouvrir la navigation",
      mobileNav: "Navigation mobile",
    },
  },
  pl: {
    navigationLabel: "Nawigacja",
    localeLabel: "Język",
    menuLabel: "Menu",
    theme: { label: "Wygląd", system: "System", light: "Jasny" },
    aria: {
      localeSelect: "Wybierz język (obecnie {label})",
      openNav: "Otwórz nawigację",
      mobileNav: "Nawigacja mobilna",
    },
  },
  es: {
    navigationLabel: "Navegación",
    localeLabel: "Idioma",
    menuLabel: "Menú",
    theme: { label: "Apariencia", system: "Sistema", light: "Claro" },
    aria: {
      localeSelect: "Elegir idioma (actual {label})",
      openNav: "Abrir navegación",
      mobileNav: "Navegación móvil",
    },
  },
  it: {
    navigationLabel: "Navigazione",
    localeLabel: "Lingua",
    menuLabel: "Menu",
    theme: { label: "Aspetto", system: "Sistema", light: "Chiaro" },
    aria: {
      localeSelect: "Scegli la lingua (attuale {label})",
      openNav: "Apri navigazione",
      mobileNav: "Navigazione mobile",
    },
  },
  tr: {
    navigationLabel: "Gezinme",
    localeLabel: "Dil",
    menuLabel: "Menü",
    theme: { label: "Görünüm", system: "Sistem", light: "Açık" },
    aria: {
      localeSelect: "Dil seç (şu an {label})",
      openNav: "Gezinmeyi aç",
      mobileNav: "Mobil gezinme",
    },
  },
  ar: {
    navigationLabel: "التنقل",
    localeLabel: "اللغة",
    menuLabel: "القائمة",
    theme: { label: "المظهر", system: "النظام", light: "فاتح" },
    aria: {
      localeSelect: "اختر اللغة (الحالية {label})",
      openNav: "افتح التنقل",
      mobileNav: "التنقل على الهاتف",
    },
  },
  ru: {
    navigationLabel: "Навигация",
    localeLabel: "Язык",
    menuLabel: "Меню",
    theme: { label: "Вид", system: "Система", light: "Светлый" },
    aria: {
      localeSelect: "Выбрать язык (сейчас {label})",
      openNav: "Открыть навигацию",
      mobileNav: "Мобильная навигация",
    },
  },
  zh: {
    navigationLabel: "导航",
    localeLabel: "语言",
    menuLabel: "菜单",
    theme: { label: "外观", system: "系统", light: "浅色" },
    aria: {
      localeSelect: "选择语言（当前 {label}）",
      openNav: "打开导航",
      mobileNav: "移动端导航",
    },
  },
};

export function getHeaderStrings(locale: SupportedLocale | string): HeaderStrings {
  const normalized = (locale || DEFAULT_LOCALE) as SupportedLocale;
  return STRINGS[normalized] ?? STRINGS[DEFAULT_LOCALE];
}
