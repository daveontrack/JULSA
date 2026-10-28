'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLogin({ initialError = '' }: { initialError?: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(initialError)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Could not sign in.')
      router.replace('/admin')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not sign in. Please try again.')
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-5 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">JULSA Administration</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Use an existing Supabase Auth administrator account. Admin registration is disabled.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm text-slate-300">Email<input name="email" type="email" autoComplete="username" required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus-visible:border-[#d4af37]/60 focus-visible:ring-2 focus-visible:ring-[#d4af37]/25" /></label>
          <label className="block text-sm text-slate-300">Password<input name="password" type="password" autoComplete="current-password" required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus-visible:border-[#d4af37]/60 focus-visible:ring-2 focus-visible:ring-[#d4af37]/25" /></label>
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          <button disabled={pending} className="min-h-12 w-full rounded-xl bg-[#d4af37] px-5 py-3 font-semibold text-[#07111f] transition hover:bg-[#e3c468] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60">{pending ? 'Signing in…' : 'Sign in securely'}</button>
        </form>
        <Link href="/" className="mt-6 inline-block rounded text-sm text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">Return to website</Link>
      </section>
    </main>
  )
}
