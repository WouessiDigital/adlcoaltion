import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { Header, JoinForm } from '../../components/index'
import { LocaleProvider } from '../../lib/i18n/LocaleProvider'
import { dictionaries, isLocale, locales, defaultLocale, type Locale } from '../../lib/i18n/dictionaries'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

// Static site: one pre-built copy per language at /en/ and /fr/.
export const dynamicParams = false
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> }

async function getLocale(params: Props['params']): Promise<Locale> {
  const { lang } = await params
  return isLocale(lang) ? lang : defaultLocale
}

export async function generateMetadata({ params }: { params: Props['params'] }): Promise<Metadata> {
  const locale = await getLocale(params)
  const t = dictionaries[locale]
  return {
    metadataBase: new URL('https://adlcoalition.org'),
    title: t.meta.title,
    description: t.meta.description,
    icons: { icon: '/favicon.ico' },
    alternates: {
      canonical: `/${locale}/`,
      languages: { 'en-CA': '/en/', 'fr-CA': '/fr/', 'x-default': '/' },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      siteName: t.meta.title,
      url: `/${locale}/`,
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      alternateLocale: locale === 'fr' ? 'en_CA' : 'fr_CA',
      type: 'website',
    },
  }
}

export default async function LangLayout({ children, params }: Props) {
  const locale = await getLocale(params)
  return (
    <html lang={locale === 'fr' ? 'fr-CA' : 'en-CA'}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider initialLocale={locale}>
          <Header />
          {children}
          <JoinForm />
        </LocaleProvider>
      </body>
    </html>
  )
}
