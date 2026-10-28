import { NextResponse } from 'next/server'
import { clearAdminSession, getAdminAccess } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  const access = await getAdminAccess(true)
  if (access.status === 'unauthenticated') {
    await clearAdminSession()
    return NextResponse.json({ error: 'Administrator sign-in required.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }
  if (access.status === 'forbidden') {
    return NextResponse.json({ error: 'This account is not authorized to access the JULSA administrator area.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }
  return NextResponse.json({ email: access.session.email }, { headers: { 'Cache-Control': 'no-store' } })
}
