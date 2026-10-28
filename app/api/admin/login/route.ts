import { NextResponse } from 'next/server'
import { cleanText, readJsonObject, validateSameOrigin } from '@/lib/db'
import { signInWithPassword, setAdminSession, getAdminAccess, revokeAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!(await validateSameOrigin(request))) return NextResponse.json({ error: 'Request origin could not be verified.' }, { status: 403 })
  const body = await readJsonObject(request, 8_000)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  const email = cleanText(body.email, 254).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  if (!email || password.length < 8 || password.length > 256) return NextResponse.json({ error: 'Enter your administrator email and password.' }, { status: 400 })

  let tokens
  try {
    tokens = await signInWithPassword(email, password)
  } catch {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  try {
    await setAdminSession(tokens)
    const access = await getAdminAccess()
    if (access.status === 'admin') {
      return NextResponse.json({ success: true, email: access.session.email })
    }
    await revokeAdminSession()
    if (access.status === 'forbidden') {
      return NextResponse.json({ error: 'This account is not authorized to access the JULSA administrator area.' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Could not verify the new administrator session. Please try again.' }, { status: 503 })
  } catch {
    await revokeAdminSession()
    return NextResponse.json({ error: 'Administrator access could not be verified right now. Please try again.' }, { status: 503 })
  }
}
