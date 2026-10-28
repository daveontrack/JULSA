import 'server-only'
import { cookies } from 'next/headers'
import { getPool } from '@/lib/db'
import { getPrisma } from '@/lib/prisma'

const ACCESS_COOKIE = 'julsa_admin_access'
const REFRESH_COOKIE = 'julsa_admin_refresh'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

export type AuthUser = { id: string; email: string }
export type AdminSession = AuthUser & { accessToken: string }
export type AdminAccess =
  | { status: 'admin'; session: AdminSession }
  | { status: 'forbidden'; user: AuthUser }
  | { status: 'unauthenticated' }

function authConfig() {
  const baseUrl = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY
  if (!baseUrl || !anonKey) throw new Error('Admin authentication is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY.')
  return { baseUrl: baseUrl.replace(/\/$/, ''), anonKey }
}

async function authRequest<T>(path: string, init: RequestInit): Promise<T> {
  const { baseUrl, anonKey } = authConfig()
  const response = await fetch(`${baseUrl}/auth/v1/${path}`, {
    ...init,
    cache: 'no-store',
    headers: { apikey: anonKey, 'Content-Type': 'application/json', ...init.headers },
  })
  if (!response.ok) throw new Error('Supabase Auth rejected the request.')
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export async function signInWithPassword(email: string, password: string) {
  return authRequest<{ access_token: string; refresh_token: string; expires_in: number }>(
    'token?grant_type=password',
    { method: 'POST', body: JSON.stringify({ email, password }) },
  )
}

async function loadAuthUser(accessToken: string): Promise<AuthUser | null> {
  try {
    const user = await authRequest<{ id: string; email?: string }>('user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!user.id || !user.email) return null
    return { id: user.id, email: user.email }
  } catch {
    return null
  }
}

async function isAllowlisted(userId: string) {
  const result = await getPrisma().$queryRaw<Array<{ authorized: boolean }>>`
      SELECT EXISTS (
        SELECT 1 FROM public.julsa_admins WHERE user_id = ${userId}::uuid
      ) AS authorized
    `
  return result[0]?.authorized === true
}

export async function getAdminAccess(allowRefresh = false): Promise<AdminAccess> {
  const jar = await cookies()
  let accessToken = jar.get(ACCESS_COOKIE)?.value
  if (!accessToken && !allowRefresh) return { status: 'unauthenticated' }
  let user = accessToken ? await loadAuthUser(accessToken) : null
  if (!user && allowRefresh) {
    const refreshToken = jar.get(REFRESH_COOKIE)?.value
    if (!refreshToken) return { status: 'unauthenticated' }
    try {
      const refreshed = await authRequest<{ access_token: string; refresh_token: string; expires_in: number }>(
        'token?grant_type=refresh_token',
        { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) },
      )
      accessToken = refreshed.access_token
      jar.set(ACCESS_COOKIE, refreshed.access_token, { ...COOKIE_OPTIONS, maxAge: refreshed.expires_in })
      jar.set(REFRESH_COOKIE, refreshed.refresh_token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 })
      user = await loadAuthUser(accessToken)
    } catch {
      return { status: 'unauthenticated' }
    }
  }
  if (!user || !accessToken) return { status: 'unauthenticated' }
  return await isAllowlisted(user.id)
    ? { status: 'admin', session: { ...user, accessToken } }
    : { status: 'forbidden', user }
}

export async function getAdminSession(allowRefresh = false) {
  const access = await getAdminAccess(allowRefresh)
  return access.status === 'admin' ? access.session : null
}

export async function authorizeAdminApi() {
  const access = await getAdminAccess(true)
  if (access.status === 'admin') return { session: access.session, response: null }
  if (access.status === 'forbidden') {
    return { session: null, response: Response.json({ error: 'This account is not authorized to access the JULSA administrator area.' }, { status: 403 }) }
  }
  return { session: null, response: Response.json({ error: 'Administrator sign-in required.' }, { status: 401 }) }
}

export async function setAdminSession(tokens: { access_token: string; refresh_token: string; expires_in: number }) {
  const jar = await cookies()
  jar.set(ACCESS_COOKIE, tokens.access_token, { ...COOKIE_OPTIONS, maxAge: tokens.expires_in })
  jar.set(REFRESH_COOKIE, tokens.refresh_token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 })
}

export async function clearAdminSession() {
  const jar = await cookies()
  jar.set(ACCESS_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 })
  jar.set(REFRESH_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 })
}

export async function revokeAdminSession() {
  const jar = await cookies()
  const accessToken = jar.get(ACCESS_COOKIE)?.value
  if (accessToken) {
    try {
      await authRequest<void>('logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    } catch {
      // Clear the local session even if Supabase is temporarily unavailable.
    }
  }
  await clearAdminSession()
}

export async function runAsAdmin<T>(user: AuthUser, operation: (client: import('pg').PoolClient) => Promise<T>) {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    await client.query('SET LOCAL ROLE authenticated')
    const claims = JSON.stringify({ sub: user.id, email: user.email, role: 'authenticated' })
    await client.query("SELECT set_config('request.jwt.claims', $1, true)", [claims])
    await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [user.id])
    const result = await operation(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    client.release()
  }
}

export function adminCookieNames() {
  return { access: ACCESS_COOKIE, refresh: REFRESH_COOKIE }
}
