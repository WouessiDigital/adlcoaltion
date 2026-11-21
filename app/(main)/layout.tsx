import type { Metadata } from "next";
import { cookies } from "next/headers";
import "../globals.css";
import { Header, JoinForm } from '../../components/index';
import { LocaleProvider } from '../../lib/i18n/LocaleProvider';
import { dictionaries, isLocale, defaultLocale, LOCALE_COOKIE, type Locale } from '../../lib/i18n/dictionaries';

async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLocale()]
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { 'en-CA': '/?lang=en', 'fr-CA': '/?lang=fr' } },
  }
}

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  return (
    <LocaleProvider initialLocale={locale}>
        <Header />
        {children}
        <JoinForm/>
    </LocaleProvider>
  );
}
