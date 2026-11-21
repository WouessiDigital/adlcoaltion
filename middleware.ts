import { NextResponse, type NextRequest } from 'next/server'

// Serves the right language on the very first page load (no English flash before French):
// 1) ?lang=fr|en in the link wins, 2) then the saved cookie, 3) then the browser's language.
const COOKIE = 'adlc_lang'

export function middleware(req: NextRequest) {
  const param = req.nextUrl.searchParams.get('lang')
  const saved = req.cookies.get(COOKIE)?.value
  let locale: 'en' | 'fr' | null = null

  if (param === 'fr' || param === 'en') locale = param
  else if (saved === 'fr' || saved === 'en') return NextResponse.next()
  else locale = (req.headers.get('accept-language') || '').toLowerCase().startsWith('fr') ? 'fr' : 'en'

  // Make this same request render in the chosen language, and remember it for next time.
  const headers = new Headers(req.headers)
  const others = (req.headers.get('cookie') || '').split('; ').filter((c) => c && !c.startsWith(`${COOKIE}=`))
  headers.set('cookie', [...others, `${COOKIE}=${locale}`].join('; '))
  const res = NextResponse.next({ request: { headers } })
  const secure = req.headers.get('x-forwarded-proto') === 'https'
  res.cookies.set(COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure })
  return res
}

export const config = {
  // Public pages only: skip Next internals, the admin area, API routes and files with an extension.
  matcher: ['/((?!_next|admin|api|.*\\..*).*)'],
}
