"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { getLocaleConfig, SUPPORTED_LOCALES, type SupportedLocale } from "@/config/locales";
import {
  EDEBATTE_URL,
  VOG_JOIN_PATH,
  VOG_QUESTIONS_PATH,
  VOG_ROLES_PATH,
  VOG_TRANSPARENCY_PATH,
  VOTE4GOV_URL,
} from "@/config/links";
import { getHeaderStrings } from "./headerStrings";

type PrimaryCopy = {
  tagline: string;
  movement: string;
  questions: string;
  transparency: string;
  join: string;
  login: string;
  ecosystem: string;
  edebatte: string;
  vote4gov: string;
  roles: string;
};

const PRIMARY_COPY: Record<SupportedLocale, PrimaryCopy> = {
  de: {
    tagline: "Internationale Mitgliederbewegung",
    movement: "Bewegung",
    questions: "50 Fragen",
    transparency: "Transparenz",
    join: "Mitglied werden",
    login: "Anmelden",
    ecosystem: "Das Ökosystem",
    edebatte: "Offene Infrastruktur für Erkenntnis und Beteiligung.",
    vote4gov: "Gesellschaftliche Denkwerkstatt.",
    roles: "Mitwirkungsrollen",
  },
  en: {
    tagline: "International membership movement",
    movement: "Movement",
    questions: "50 questions",
    transparency: "Transparency",
    join: "Become a member",
    login: "Sign in",
    ecosystem: "The ecosystem",
    edebatte: "Open infrastructure for insight and participation.",
    vote4gov: "Civic think tank.",
    roles: "Ways to contribute",
  },
  fr: {
    tagline: "Mouvement international de membres",
    movement: "Mouvement",
    questions: "50 questions",
    transparency: "Transparence",
    join: "Devenir membre",
    login: "Se connecter",
    ecosystem: "L’écosystème",
    edebatte: "Infrastructure ouverte pour comprendre et participer.",
    vote4gov: "Atelier de réflexion citoyenne.",
    roles: "Rôles de participation",
  },
  pl: {
    tagline: "Międzynarodowy ruch członkowski",
    movement: "Ruch",
    questions: "50 pytań",
    transparency: "Przejrzystość",
    join: "Zostań członkiem",
    login: "Zaloguj się",
    ecosystem: "Ekosystem",
    edebatte: "Otwarta infrastruktura wiedzy i uczestnictwa.",
    vote4gov: "Społeczna pracownia idei.",
    roles: "Role uczestnictwa",
  },
  es: {
    tagline: "Movimiento internacional de miembros",
    movement: "Movimiento",
    questions: "50 preguntas",
    transparency: "Transparencia",
    join: "Hazte miembro",
    login: "Iniciar sesión",
    ecosystem: "El ecosistema",
    edebatte: "Infraestructura abierta para comprender y participar.",
    vote4gov: "Laboratorio de pensamiento cívico.",
    roles: "Formas de participar",
  },
  it: {
    tagline: "Movimento associativo internazionale",
    movement: "Movimento",
    questions: "50 domande",
    transparency: "Trasparenza",
    join: "Diventa membro",
    login: "Accedi",
    ecosystem: "L’ecosistema",
    edebatte: "Infrastruttura aperta per conoscenza e partecipazione.",
    vote4gov: "Laboratorio di pensiero civico.",
    roles: "Ruoli di partecipazione",
  },
  tr: {
    tagline: "Uluslararası üyelik hareketi",
    movement: "Hareket",
    questions: "50 soru",
    transparency: "Şeffaflık",
    join: "Üye ol",
    login: "Giriş yap",
    ecosystem: "Ekosistem",
    edebatte: "Bilgi ve katılım için açık altyapı.",
    vote4gov: "Toplumsal düşünce atölyesi.",
    roles: "Katılım rolleri",
  },
  ar: {
    tagline: "حركة عضوية دولية",
    movement: "الحركة",
    questions: "50 سؤالاً",
    transparency: "الشفافية",
    join: "انضم كعضو",
    login: "تسجيل الدخول",
    ecosystem: "المنظومة",
    edebatte: "بنية مفتوحة للمعرفة والمشاركة.",
    vote4gov: "مختبر للتفكير المجتمعي.",
    roles: "أدوار المشاركة",
  },
  ru: {
    tagline: "Международное движение участников",
    movement: "Движение",
    questions: "50 вопросов",
    transparency: "Прозрачность",
    join: "Стать участником",
    login: "Войти",
    ecosystem: "Экосистема",
    edebatte: "Открытая инфраструктура знаний и участия.",
    vote4gov: "Общественная лаборатория идей.",
    roles: "Роли участия",
  },
  zh: {
    tagline: "国际成员运动",
    movement: "运动",
    questions: "50 个问题",
    transparency: "透明度",
    join: "成为成员",
    login: "登录",
    ecosystem: "生态系统",
    edebatte: "用于认知与参与的开放基础设施。",
    vote4gov: "社会思考实验室。",
    roles: "参与角色",
  },
};

export function SiteHeader() {
  const { locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const router = useRouter();
  const strings = getHeaderStrings(locale);
  const activeLang = locale || "de";
  const copy = PRIMARY_COPY[activeLang as SupportedLocale] ?? PRIMARY_COPY.de;

  const activeLocaleConfig = useMemo(
    () => getLocaleConfig(activeLang as SupportedLocale),
    [activeLang],
  );
  const localeOptions = SUPPORTED_LOCALES.map((code) => {
    const config = getLocaleConfig(code);
    return { code, label: config.label, flag: config.flagEmoji || "🏳️" };
  });
  const localeAriaLabel = strings.aria.localeSelect.replace(
    "{label}",
    activeLocaleConfig.label,
  );

  useEffect(() => {
    if (!mobileOpen) setLocaleOpen(false);
  }, [mobileOpen]);

  const handleLocaleSelect = (next: SupportedLocale) => {
    setLocale(next);
    setLocaleOpen(false);
    setMobileOpen(false);
    router.refresh();
  };

  const primaryLinks = [
    { href: "/#movement", label: copy.movement },
    { href: VOG_QUESTIONS_PATH, label: copy.questions },
    { href: VOG_TRANSPARENCY_PATH, label: copy.transparency },
  ];
  const secondaryLinks = strings.navItems.filter((item) => item.href !== VOG_JOIN_PATH);

  return (
    <header className="sticky top-0 z-50 border-b border-[#f4f1e8]/10 bg-[#07110f]/92 text-[#f4f1e8] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" aria-label="VoiceOpenGov Startseite" className="group flex min-w-0 items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#d6ff65]/35 bg-[#d6ff65]/10">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d6ff65] shadow-[0_0_22px_rgba(214,255,101,0.65)]" />
            <span className="absolute -bottom-1 right-1 h-2.5 w-2.5 rotate-45 border-b border-r border-[#d6ff65]/35 bg-[#07110f]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black uppercase tracking-[0.19em] text-[#f4f1e8] transition group-hover:text-[#d6ff65]">
              VoiceOpenGov
            </span>
            <span className="hidden truncate text-[10px] font-semibold uppercase tracking-[0.13em] text-[#f4f1e8]/45 sm:block">
              {copy.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label={strings.navigationLabel} className="hidden items-center gap-5 text-sm font-semibold text-[#f4f1e8]/68 lg:flex">
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#d6ff65]">
              {item.label}
            </Link>
          ))}
          <a href={EDEBATTE_URL} className="transition hover:text-[#d6ff65]">
            eDebatte ↗
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label={localeAriaLabel}
              aria-expanded={localeOpen}
              onClick={() => setLocaleOpen((open) => !open)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f4f1e8]/15 bg-[#0b1714] px-3 text-xs font-bold uppercase tracking-wide text-[#f4f1e8]/75 transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]"
            >
              <span aria-hidden="true">{activeLocaleConfig.flagEmoji || "🏳️"}</span>
              <span>{activeLang}</span>
            </button>
            {localeOpen ? (
              <div className="absolute right-0 mt-2 grid w-52 gap-1 rounded-2xl border border-[#f4f1e8]/15 bg-[#0b1714] p-2 shadow-2xl shadow-black/40">
                {localeOptions.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => handleLocaleSelect(language.code)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#f4f1e8]/75 transition hover:bg-[#d6ff65]/10 hover:text-[#d6ff65]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden="true">{language.flag}</span>
                      <span>{language.label}</span>
                    </span>
                    <span className="uppercase text-[#f4f1e8]/35">{language.code}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2.5 text-sm font-bold text-[#f4f1e8]/75 transition hover:text-[#d6ff65] lg:inline-flex"
          >
            {copy.login}
          </Link>
          <Link
            href={VOG_JOIN_PATH}
            className="hidden rounded-full bg-[#d6ff65] px-4 py-2.5 text-sm font-black text-[#07110f] transition hover:-translate-y-0.5 hover:bg-[#e2ff8a] sm:inline-flex"
          >
            {copy.join}
          </Link>
          <button
            type="button"
            aria-label={strings.aria.openNav}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f4f1e8]/15 bg-[#0b1714] text-[#f4f1e8] transition hover:border-[#d6ff65]/55 hover:text-[#d6ff65]"
          >
            <span className="sr-only">{strings.menuLabel}</span>
            {mobileOpen ? (
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#f4f1e8]/10 bg-[#07110f]/98 shadow-2xl shadow-black/45">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-6 md:grid-cols-[1fr_.8fr] md:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d6ff65]">
                {strings.navigationLabel}
              </p>
              <nav aria-label={strings.aria.mobileNav} className="mt-4 grid gap-2 sm:grid-cols-2">
                {primaryLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-[#f4f1e8]/10 bg-[#0b1714] px-4 py-3 font-bold transition hover:border-[#d6ff65]/45 hover:text-[#d6ff65]"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={VOG_ROLES_PATH}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-[#f4f1e8]/10 bg-[#0b1714] px-4 py-3 font-bold transition hover:border-[#d6ff65]/45 hover:text-[#d6ff65]"
                >
                  {copy.roles}
                </Link>
                {secondaryLinks.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-[#f4f1e8]/10 bg-[#0b1714] px-4 py-3 transition hover:border-[#d6ff65]/45"
                  >
                    <span className="block font-bold">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#f4f1e8]/45">{item.description}</span>
                  </Link>
                ))}
              </nav>
              <Link
                href={VOG_JOIN_PATH}
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex w-full justify-center rounded-full bg-[#d6ff65] px-5 py-3 font-black text-[#07110f] sm:hidden"
              >
                {copy.join}
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-full border border-[#f4f1e8]/20 px-5 py-3 font-bold text-[#f4f1e8] lg:hidden"
              >
                {copy.login}
              </Link>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d6ff65]">{copy.ecosystem}</p>
              <div className="mt-4 grid gap-2">
                <a href={EDEBATTE_URL} className="rounded-2xl border border-[#f4f1e8]/10 p-4 transition hover:border-[#d6ff65]/45">
                  <strong className="block text-lg">eDebatte ↗</strong>
                  <span className="mt-1 block text-sm leading-5 text-[#f4f1e8]/50">{copy.edebatte}</span>
                </a>
                <a href={VOTE4GOV_URL} className="rounded-2xl border border-[#f4f1e8]/10 p-4 transition hover:border-[#d6ff65]/45">
                  <strong className="block text-lg">Vote4Gov ↗</strong>
                  <span className="mt-1 block text-sm leading-5 text-[#f4f1e8]/50">{copy.vote4gov}</span>
                </a>
              </div>

              <div className="mt-5 sm:hidden">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#f4f1e8]/45">{strings.localeLabel}</p>
                <div className="grid grid-cols-2 gap-2">
                  {localeOptions.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => handleLocaleSelect(language.code)}
                      className="flex items-center gap-2 rounded-xl border border-[#f4f1e8]/10 bg-[#0b1714] px-3 py-2 text-xs font-semibold"
                    >
                      <span aria-hidden="true">{language.flag}</span>
                      <span>{language.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
