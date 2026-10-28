'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, CalendarDays, FileText, Images, LayoutDashboard, LogOut, Mail, Trophy, UserRound, Users, BriefcaseBusiness, Newspaper } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  ['/admin', 'Overview', LayoutDashboard],
  ['/admin/members', 'Membership', Users],
  ['/admin/messages', 'Messages', Mail],
  ['/admin/events', 'Events', CalendarDays],
  ['/admin/blog', 'Blog posts', FileText],
  ['/admin/competitions', 'Moot court', Trophy],
  ['/admin/leaders', 'Leaders', UserRound],
  ['/admin/gallery', 'Gallery', Images],
  ['/admin/news', 'News', Newspaper],
  ['/admin/opportunities', 'Opportunities', BriefcaseBusiness],
  ['/admin/resources', 'Academic resources', BookOpen],
] as const

export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname() ?? '/admin'
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function signOut() {
    setSigningOut(true)
    setLogoutError('')
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' })
      if (!response.ok) throw new Error('Sign out could not be confirmed. Please retry.')
      router.replace('/admin/login')
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Sign out failed. Please retry.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <a href="#admin-main" className="sr-only z-50 rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#07111f] focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to dashboard content</a>
      <header className="border-b border-white/10 bg-[#091625]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">JULSA Administration</p><h1 className="mt-1 text-xl font-semibold sm:text-2xl">Content dashboard</h1></div>
          <div className="flex items-center gap-3 sm:gap-4"><span className="hidden max-w-[220px] truncate text-sm text-slate-400 md:block">{email}</span><button onClick={signOut} disabled={signingOut} aria-label="Sign out of the admin dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-60 sm:px-4">{signingOut ? 'Signing out…' : <><LogOut size={16} aria-hidden="true" />Sign out</>}</button></div>
        </div>
        {logoutError && <p role="alert" className="mx-auto max-w-[1500px] px-5 pb-3 text-sm text-red-300 lg:px-8">{logoutError} <button onClick={signOut} className="ml-1 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">Retry</button></p>}
      </header>
      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-5 sm:py-7 lg:grid-cols-[230px_1fr] lg:gap-6 lg:px-8">
        <nav aria-label="Admin navigation" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:mx-0 lg:sticky lg:top-6 lg:flex-col lg:self-start lg:overflow-visible lg:px-0">
          {navigation.map(([href, label, Icon]) => {
            const active = href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
            return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] sm:px-4 ${active ? 'bg-[#d4af37] font-semibold text-[#07111f]' : 'border border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'}`}><Icon size={17} aria-hidden="true" /><span>{label}</span></Link>
          })}
        </nav>
        <section id="admin-main" tabIndex={-1} aria-label="Dashboard content" className="min-h-[65vh] min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-6">{children}</section>
      </div>
    </main>
  )
}
