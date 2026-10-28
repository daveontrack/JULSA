'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { LoaderCircle, RefreshCw } from 'lucide-react'

type Summary = {
  members: { total: number; pending: number; approved: number; rejected: number }
  messages: { total: number; unread: number; read_count: number; replied: number; archived: number }
  competitions: { upcoming: number; registration_open: number; completed: number }
  content: { table: string; label: string; total: number; published: number | null; drafts: number | null }[]
  publicationAvailable: boolean
}

function SummaryCard({ title, value, detail }: { title: string; value: number; detail: string }) {
  return <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-3xl font-semibold">{value.toLocaleString()}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setRefreshing(true)
    setError('')
    try {
      const response = await fetch('/api/admin/overview', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not load dashboard summary.')
      setSummary(result)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load dashboard summary.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  if (loading) return <div role="status" className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-400"><LoaderCircle className="animate-spin text-[#d4af37]" size={20} aria-hidden="true" />Loading live dashboard summaries…</div>
  if (error && !summary) return <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200"><p role="alert">{error}</p><button onClick={() => void load()} disabled={refreshing} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200/20 px-3 py-2 font-medium hover:bg-red-200/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-60"><RefreshCw size={15} aria-hidden="true" />Retry loading</button></div>
  if (!summary) return <p className="py-10 text-sm text-slate-400">No dashboard summary is available.</p>

  const routes: Record<string, string> = {
    events: 'events', blog_posts: 'blog', competitions: 'competitions', leaders: 'leaders',
    gallery_items: 'gallery', news: 'news', opportunities: 'opportunities', academic_resources: 'resources',
  }

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Overview</p><h2 className="mt-2 text-2xl font-semibold">Current activity</h2><p className="mt-1 text-sm text-slate-400">Counts are read from JULSA’s live database.</p></div><button onClick={() => void load()} disabled={refreshing} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-60"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />Refresh</button></div>
    {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">Dashboard could not refresh: {error}</p>}
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard title="Membership applications" value={summary.members.total} detail={`${summary.members.pending} pending · ${summary.members.approved} approved · ${summary.members.rejected} rejected`} />
      <SummaryCard title="Contact messages" value={summary.messages.total} detail={`${summary.messages.unread} unread · ${summary.messages.replied} replied · ${summary.messages.archived} archived`} />
      <SummaryCard title="Competitions accepting registration" value={summary.competitions.registration_open} detail={`${summary.competitions.upcoming} upcoming · ${summary.competitions.completed} completed`} />
      <SummaryCard title="Unread messages" value={summary.messages.unread} detail={`${summary.messages.read_count} read`} />
    </div>
    <div className="mt-8"><h3 className="text-lg font-semibold">Managed content</h3><p className="mt-1 text-sm text-slate-400">Open a section to search, filter, edit, or remove database records.</p></div>
    {!summary.publicationAvailable && <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">Draft and publish controls need an approved database migration. Existing content remains publicly visible until that migration is approved and applied.</p>}
    {summary.content.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{summary.content.map((item) => <Link key={item.table} href={`/admin/${routes[item.table]}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#d4af37]/40 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"><p className="text-sm text-slate-300">{item.label}</p><p className="mt-2 text-2xl font-semibold">{item.total.toLocaleString()}</p>{item.published !== null && <p className="mt-1 text-xs text-slate-500">{item.published} published · {item.drafts} drafts</p>}</Link>)}</div> : <p className="mt-4 rounded-xl border border-dashed border-white/15 p-6 text-sm text-slate-400">No managed content tables are available.</p>}
  </div>
}
