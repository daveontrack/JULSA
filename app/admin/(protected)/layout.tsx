import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminCookieNames, getAdminAccess } from '@/lib/admin-auth'
import AdminLogin from '@/components/admin-login'
import AdminSessionRefresh from '@/components/admin-session-refresh'
import AdminShell from '@/components/admin-shell'

export const dynamic = 'force-dynamic'

export default async function ProtectedAdminLayout({ children }: LayoutProps<'/admin'>) {
  const access = await getAdminAccess()
  if (access.status === 'admin') return <AdminShell email={access.session.email}>{children}</AdminShell>
  if (access.status === 'forbidden') {
    return <AdminLogin initialError="This account is not authorized to access the JULSA administrator area." />
  }

  const jar = await cookies()
  if (jar.has(adminCookieNames().refresh)) return <AdminSessionRefresh />
  redirect('/admin/login')
}
