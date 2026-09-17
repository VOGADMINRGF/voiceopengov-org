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
  VOG_SUPPORT_PATH,
  VOG_TRANSPARENCY_PATH,
} from "@/config/links";
import { getHeaderStrings } from "./headerStrings";

type HeaderCopy = {
  tagline: string;
  why: string;
  questions: string;
  transparency: string;
  support: string;
  join: string;
  login: string;
};

const COPY: Record<SupportedLocale, HeaderCopy> = {
  de: { tagline: "Initiative für informierte Beteiligung", why: "Warum", questions: "50 Fragen", transparency: "Transparenz", support: "Unterstützen", join: "Mitmachen", login: "Anmelden" },
  en: { tagline: "Initiative for informed participation", why: "Why", questions: "50 questions", transparency: "Transparency", support: "Support", join: "Participate", login: "Sign in" },
  fr: { tagline: "Initiative pour une participation éclairée", why: "Pourquoi", questions: "50 questions", transparency: "Transparence", support: "Soutenir", join: "Participer", login: "Se connecter" },
  pl: { tagline: "Inicjatywa na rzecz świadomego uczestnictwa", why: "Dlaczego", questions: "50 pytań", transparency: "Przejrzystość", support: "Wesprzyj", join: "Dołącz", login: "Zaloguj się" },
  es: { tagline: "Iniciativa para una participación informada", why: "Por qué", questions: "50 preguntas", transparency: "Transparencia", support: "Apoyar", join: "Participar", login: "Iniciar sesión" },
  it: { tagline: "Iniziativa per una partecipazione informata", why: "Perché", questions: "50 domande", transparency: "Trasparenza", support: "Sostieni", join: "Partecipa", login: "Accedi" },
  tr: { tagline: "Bilinçli katılım için girişim", why: "Neden", questions: "50 soru", transparency: "Şeffaflık", support: "Destekle", join: "Katıl", login: "Giriş yap" },
  ar: { tagline: "مبادرة للمشاركة المستنيرة", why: "لماذا", questions: "50 سؤالاً", transparency: "الشفافية", support: "ادعم", join: "شارك", login: "تسجيل الدخول" },
  ru: { tagline: "Инициатива за осознанное участие", why: "Почему", questions: "50 вопросов", transparency: "Прозрачность", support: "Поддержать", join: "Участвовать", login: "Войти" },
  zh: { tagline: "推动知情参与的倡议", why: "为什么", questions: "50 个问题", transparency: "透明度", support: "支持", join: "参与", login: "登录" },
};

export function SiteHeader() {
  const { locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const router = useRouter();
  const strings = getHeaderStrings(locale);
  const activeLang = (locale || "de") as SupportedLocale;
  const copy = COPY[activeLang] ?? COPY.de;
  const activeLocaleConfig = useMemo(() => getLocaleConfig(activeLang), [activeLang]);
  const localeOptions = SUPPORTED_LOCALES.map((code) => {
    const config = getLocaleConfig(code);
    return { code, label: config.label, flag: config.flagEmoji || "🏳️" };
  });

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
    { href: "/#warum", label: copy.why },
    { href: EDEBATTE_URL, label: "eDebatte ↗" },
    { href: VOG_QUESTIONS_PATH, label: copy.questions },
    { href: VOG_TRANSPARENCY_PATH, label: copy.transparency },
    { href: VOG_SUPPORT_PATH, label: copy.support },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/82 text-[#f8fafc] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" aria-label="VoiceOpenGov Startseite" className="group flex min-w-0 items-center">
          <span className="min-w-0 leading-none">
            <span className="block truncate text-[17px] font-semibold tracking-[-0.03em]">
              <span className="text-white">Voice</span><span className="bg-gradient-to-r from-[#18cfc8] to-[#1a8cff] bg-clip-text text-transparent">OpenGov</span>
            </span>
            <span className="mt-1 hidden truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
              {copy.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label={strings.navigationLabel} className="hidden items-center gap-5 text-sm font-semibold text-slate-300 lg:flex">
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#18cfc8]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label={strings.aria.localeSelect.replace("{label}", activeLocaleConfig.label)}
              aria-expanded={localeOpen}
              onClick={() => setLocaleOpen((open) => !open)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-3 text-xs font-bold uppercase tracking-wide text-slate-300 transition hover:border-[#18cfc8]/50 hover:text-[#18cfc8]"
            >
              <span aria-hidden="true">{activeLocaleConfig.flagEmoji || "🏳️"}</span>
              <span>{activeLang}</span>
            </button>
            {localeOpen ? (
              <div className="absolute right-0 mt-2 grid w-52 gap-1 rounded-2xl border border-white/12 bg-[#0b1220] p-2 shadow-2xl shadow-black/45">
                {localeOptions.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => handleLocaleSelect(language.code)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-[#18cfc8]/10 hover:text-[#18cfc8]"
                  >
                    <span className="inline-flex items-center gap-2"><span aria-hidden="true">{language.flag}</span><span>{language.label}</span></span>
                    <span className="uppercase text-slate-500">{language.code}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Link href="/login" className="hidden px-2 py-2 text-sm font-semibold text-slate-400 transition hover:text-white lg:inline-flex">
            {copy.login}
          </Link>
          <Link href={VOG_JOIN_PATH} className="hidden rounded-full bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-4 py-2.5 text-sm font-black text-[#071727] shadow-[0_10px_30px_rgba(24,207,200,.14)] transition hover:-translate-y-0.5 sm:inline-flex">
            {copy.join}
          </Link>
          <button
            type="button"
            aria-label={strings.aria.openNav}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] text-white transition hover:border-[#18cfc8]/50 hover:text-[#18cfc8] lg:hidden"
          >
            <span className="sr-only">{strings.menuLabel}</span>
            {mobileOpen ? (
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#020617]/98 shadow-2xl shadow-black/50 lg:hidden">
          <div className="mx-auto max-w-6xl px-5 py-5 md:px-8">
            <nav aria-label={strings.aria.mobileNav} className="grid gap-2">
              {primaryLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-semibold text-slate-200 transition hover:border-[#18cfc8]/45 hover:text-[#18cfc8]">
                  {item.label}
                </Link>
              ))}
              <Link href={VOG_JOIN_PATH} onClick={() => setMobileOpen(false)} className="mt-2 rounded-xl bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-4 py-3 text-center font-black text-[#071727]">
                {copy.join}
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
