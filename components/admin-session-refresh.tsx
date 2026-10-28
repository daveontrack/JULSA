'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminSessionRefresh() {
  const router = useRouter()
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((response) => {
        if (response.ok) router.refresh()
        else if (active) router.replace(response.status === 403 ? '/admin/login?unauthorized=1' : '/admin/login?expired=1')
      })
      .catch(() => { if (active) setUnavailable(true) })
    return () => { active = false }
  }, [router])

  if (unavailable) return <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-5 text-sm text-red-200">Could not verify your session. <Link href="/admin/login" className="ml-1 underline">Continue to administrator sign in</Link>.</main>
  return <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-sm text-slate-300">Refreshing secure admin session…</main>
}
