import { NextResponse } from 'next/server'
import { validateSameOrigin } from '@/lib/db'
import { revokeAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!(await validateSameOrigin(request))) return NextResponse.json({ error: 'Request origin could not be verified.' }, { status: 403 })
  await revokeAdminSession()
  return NextResponse.json({ success: true })
}
