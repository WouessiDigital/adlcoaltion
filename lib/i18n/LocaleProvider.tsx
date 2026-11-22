'use client'
import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { dictionaries, LOCALE_COOKIE, type Dictionary, type Locale } from './dictionaries'

type I18nContext = {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
  /** Path inside the current language, e.g. href('/calendar/') -> '/fr/calendar/' */
  href: (path: string) => string
}

const Ctx = createContext<I18nContext | null>(null)

function writeCookie(locale: Locale) {
  const secure = window.location.protocol === 'https:' ? '; secure' : ''
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax${secure}`
}

// Static site: each language is its own set of pages (/en/... and /fr/...).
// Switching language opens the same page in the other language and remembers the choice.
export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const locale = initialLocale

  const href = useCallback((path: string) => `/${locale}${path.startsWith('/') ? path : `/${path}`}`, [locale])

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return
      writeCookie(next)
      const { pathname, hash } = window.location
      const rest = pathname.replace(/^\/(en|fr)(?=\/|$)/, '') || '/'
      window.location.assign(`/${next}${rest.startsWith('/') ? rest : `/${rest}`}${hash}`)
    },
    [locale]
  )

  // Remember the language of the pages being read, for the next visit to the root address.
  useEffect(() => {
    writeCookie(locale)
  }, [locale])

  return <Ctx.Provider value={{ locale, t: dictionaries[locale], setLocale, href }}>{children}</Ctx.Provider>
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
