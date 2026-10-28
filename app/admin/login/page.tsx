import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLogin from '@/components/admin-login'
import AdminSessionRefresh from '@/components/admin-session-refresh'
import { adminCookieNames, getAdminAccess } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const [access, query, jar] = await Promise.all([getAdminAccess(), searchParams, cookies()])
  if (access.status === 'admin') redirect('/admin')
  if (access.status === 'forbidden') {
    return <AdminLogin initialError="This account is not authorized to access the JULSA administrator area." />
  }
  if (jar.has(adminCookieNames().refresh)) return <AdminSessionRefresh />
  const initialError = query.expired === '1' ? 'Your administrator session expired. Sign in again.' : ''
  return <AdminLogin initialError={initialError} />
}
