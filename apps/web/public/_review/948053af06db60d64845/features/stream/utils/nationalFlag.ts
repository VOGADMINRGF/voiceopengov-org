// features/stream/utils/nationalFlag.ts

const FLAG_MAP: Record<string, string> = {
  de: "🇩🇪", en: "🇬🇧", es: "🇪🇸", fr: "🇫🇷", pt: "🇵🇹", it: "🇮🇹", pl: "🇵🇱", ru: "🇷🇺", uk: "🇺🇦",
  tr: "🇹🇷", nl: "🇳🇱", hi: "🇮🇳", zh: "🇨🇳", ja: "🇯🇵", ar: "🇸🇦", ro: "🇷🇴", cs: "🇨🇿", el: "🇬🇷",
  sv: "🇸🇪", da: "🇩🇰", fi: "🇫🇮", hu: "🇭🇺", no: "🇳🇴", sk: "🇸🇰", bg: "🇧🇬", lt: "🇱🇹", et: "🇪🇪",
  sl: "🇸🇮", lv: "🇱🇻", hr: "🇭🇷", sq: "🇦🇱", sr: "🇷🇸", ka: "🇬🇪", fa: "🇮🇷", ko: "🇰🇷",
  eu: "🇪🇺", un: "🇺🇳"
};

export const SUPPORTED_FLAGS = [
  { code: "de", label: FLAG_MAP.de, name: "Deutsch", country: "Deutschland" },
  { code: "en", label: FLAG_MAP.en, name: "English", country: "United Kingdom" },
  { code: "es", label: FLAG_MAP.es, name: "Español", country: "España" },
  { code: "fr", label: FLAG_MAP.fr, name: "Français", country: "France" },
  { code: "pt", label: FLAG_MAP.pt, name: "Português", country: "Portugal" },
  { code: "it", label: FLAG_MAP.it, name: "Italiano", country: "Italia" },
  { code: "pl", label: FLAG_MAP.pl, name: "Polski", country: "Polska" },
  { code: "ru", label: FLAG_MAP.ru, name: "Русский", country: "Россия" },
  { code: "uk", label: FLAG_MAP.uk, name: "Українська", country: "Україна" },
  { code: "tr", label: FLAG_MAP.tr, name: "Türkçe", country: "Türkiye" },
  { code: "nl", label: FLAG_MAP.nl, name: "Nederlands", country: "Nederland" },
  { code: "hi", label: FLAG_MAP.hi, name: "हिन्दी (Hindi)", country: "भारत" },
  { code: "zh", label: FLAG_MAP.zh, name: "中文 (Chinesisch)", country: "中国" },
  { code: "ja", label: FLAG_MAP.ja, name: "日本語 (Japanisch)", country: "日本" },
  { code: "ar", label: FLAG_MAP.ar, name: "العربية (Arabisch)", country: "مصر" }, // Alternativ: "Saudi-Arabien", "Ägypten"
  { code: "ro", label: FLAG_MAP.ro, name: "Română", country: "România" },
  { code: "cs", label: FLAG_MAP.cs, name: "Čeština", country: "Česko" },
  { code: "el", label: FLAG_MAP.el, name: "Ελληνικά (Griechisch)", country: "Ελλάδα" },
  { code: "sv", label: FLAG_MAP.sv, name: "Svenska", country: "Sverige" },
  { code: "da", label: FLAG_MAP.da, name: "Dansk", country: "Danmark" },
  { code: "fi", label: FLAG_MAP.fi, name: "Suomi", country: "Suomi" },
  { code: "hu", label: FLAG_MAP.hu, name: "Magyar", country: "Magyarország" },
  { code: "no", label: FLAG_MAP.no, name: "Norsk", country: "Norge" },
  { code: "sk", label: FLAG_MAP.sk, name: "Slovenčina", country: "Slovensko" },
  { code: "bg", label: FLAG_MAP.bg, name: "Български (Bulgarisch)", country: "България" },
  { code: "lt", label: FLAG_MAP.lt, name: "Lietuvių", country: "Lietuva" },
  { code: "et", label: FLAG_MAP.et, name: "Eesti", country: "Eesti" },
  { code: "sl", label: FLAG_MAP.sl, name: "Slovenščina", country: "Slovenija" },
  { code: "lv", label: FLAG_MAP.lv, name: "Latviešu", country: "Latvija" },
  { code: "hr", label: FLAG_MAP.hr, name: "Hrvatski", country: "Hrvatska" },
  { code: "sq", label: FLAG_MAP.sq, name: "Shqip (Albanisch)", country: "Shqipëri" },
  { code: "sr", label: FLAG_MAP.sr, name: "Српски (Serbisch)", country: "Србија" },
  { code: "ka", label: FLAG_MAP.ka, name: "ქართული (Georgisch)", country: "საქართველო" },
  { code: "fa", label: FLAG_MAP.fa, name: "فارسی (Persisch)", country: "ایران" },
  { code: "ko", label: FLAG_MAP.ko, name: "한국어 (Koreanisch)", country: "대한민국" }
];


export function getSupportedFlags() {
  return SUPPORTED_FLAGS;
}

export function getNationalFlag(code: string) {
  if (!code) return "🏳️";
  return FLAG_MAP[code.toLowerCase()] || "🏳️";
}
