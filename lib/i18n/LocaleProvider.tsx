'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { dictionaries, isLocale, LOCALE_COOKIE, type Dictionary, type Locale } from './dictionaries'

type I18nContext = {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const Ctx = createContext<I18nContext | null>(null)

function writeCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}

function hasCookie(): boolean {
  return document.cookie.split('; ').some((c) => c.startsWith(`${LOCALE_COOKIE}=`))
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    writeCookie(next)
    setLocaleState(next)
  }, [])

  // First visit: honour ?lang=fr|en (shareable links), otherwise the browser language.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('lang')
    if (isLocale(param)) {
      setLocale(param)
      return
    }
    if (!hasCookie()) {
      const browser = (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'en'
      setLocale(browser)
    }
  }, [setLocale])

  // Keep <html lang> and the tab title in step with the chosen language.
  useEffect(() => {
    document.documentElement.lang = locale === 'fr' ? 'fr-CA' : 'en-CA'
    document.title = dictionaries[locale].meta.title
  }, [locale])

  return <Ctx.Provider value={{ locale, t: dictionaries[locale], setLocale }}>{children}</Ctx.Provider>
}

export function useI18n(): I18nContext {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used inside <LocaleProvider>')
  return ctx
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, t, setLocale } = useI18n()
  const next: Locale = locale === 'en' ? 'fr' : 'en'
  return (
    <button
      type='button'
      lang={next === 'fr' ? 'fr-CA' : 'en-CA'}
      aria-label={t.nav.switchLabel}
      title={t.nav.switchLabel}
      onClick={() => setLocale(next)}
      className={
        'rounded-full border border-current px-3 py-1 text-sm font-bold tracking-wide transition-all hover:scale-105 ' +
        className
      }
    >
      {t.nav.switchToShort}
    </button>
  )
}
