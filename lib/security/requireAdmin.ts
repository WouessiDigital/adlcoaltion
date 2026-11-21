import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

// One authorization rule for every place that shows member data (dashboard page and API).
// Fails CLOSED: if ADMIN_EMAILS is not configured, nobody gets member data.
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  const email = String(session?.user?.email || '').toLowerCase()
  if (!session || !email) return null

  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (allowed.length === 0 || !allowed.includes(email)) return null

  return session
}
