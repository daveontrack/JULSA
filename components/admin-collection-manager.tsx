'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LoaderCircle, RefreshCw, Search, X } from 'lucide-react'

type Column = { column_name: string; data_type: string; is_nullable: string; column_default: string | null; character_maximum_length: number | null }
type Row = Record<string, unknown> & { id: string }
type CollectionData = { rows: Row[]; columns: Column[]; total: number; page: number; pageSize: number; pageCount: number; statusOptions: string[]; categoryOptions: string[]; booleanFilters: string[] }

const LABELS: Record<string, string> = {
  members: 'Membership applications', contacts: 'Contact messages', events: 'Events', 'blog-posts': 'Blog posts',
  competitions: 'Moot court competitions', leaders: 'Leaders', gallery: 'Gallery items', news: 'News',
  opportunities: 'Opportunities', 'academic-resources': 'Academic resources',
}
const NO_CREATE = new Set(['members', 'contacts'])
const SYSTEM_FIELDS = new Set(['id', 'created_at', 'updated_at', 'idempotency_key'])
const UPLOAD_FIELDS = new Set(['image_url', 'cover_image_url', 'file_url', 'rules_document_url', 'memorial_file_url'])
const FIELD_CHOICES: Record<string, Record<string, string[]>> = {
  events: { category: ['Moot Court', 'Academic', 'Debate', 'Career', 'Seminar', 'Community'] },
  'blog-posts': { category: ['Legal Analysis', 'Law & Society', 'Student Voices', 'Academic Corner', 'JULSA Updates'], post_type: ['Article', 'News', 'Magazine', 'Event Report'] },
  competitions: { status: ['Upcoming', 'Registration Open', 'Completed'] },
  gallery: { category: ['Leadership', 'Moot Court', 'Debate', 'Trainings', 'Seminars', 'Community Engagement', 'Competitions', 'Partnerships', 'Celebrations', 'Special Events'] },
  news: { category: ['JULSA Updates', 'Academic News', 'Competition Results', 'Opportunities', 'Partnerships', 'Student Achievements', 'University & Law School Updates'], news_type: ['Announcement', 'News', 'Result', 'Update'] },
  opportunities: { category: ['Internships', 'Scholarships & Fellowships', 'Competitions', 'Conferences & Trainings', 'Volunteer Opportunities', 'Jobs'], status: ['Open', 'Upcoming', 'Closed'] },
  'academic-resources': { category: ['Case Summaries', 'Legal Research', 'Lecture & Study', 'Exam Preparation', 'Legal Writing', 'Moot Court', 'Exit Exam'], resource_type: ['PDF', 'Guide', 'Notes', 'Case', 'Practice'] },
  members: { status: ['Pending', 'Approved', 'Rejected'] },
  contacts: { status: ['Unread', 'Read', 'Archived', 'Replied'] },
}

function humanize(value: string) { return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) }
function show(value: unknown) { if (value == null) return '—'; if (Array.isArray(value)) return value.join(', '); if (typeof value === 'object') return JSON.stringify(value); return String(value) }
function titleFor(row: Row) { return show(row.title ?? row.full_name ?? row.name ?? row.team_name ?? row.id) }
function initialValue(column: Column, value: unknown): string | boolean {
  if (value !== undefined && value !== null) {
    if (column.data_type === 'boolean') return Boolean(value)
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }
  if (column.data_type === 'boolean') return column.column_default?.trim().toLowerCase() === 'true'
  const textDefault = column.column_default?.match(/^'((?:[^']|'')*)'(?:::.+)?$/)
  const numberDefault = column.column_default?.match(/^-?\d+(?:\.\d+)?$/)
  return textDefault ? textDefault[1].replaceAll("''", "'") : numberDefault ? numberDefault[0] : ''
}

function DeleteConfirmation({ title, busy, onCancel, onConfirm }: { title: string; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  const cancel = useRef<HTMLButtonElement>(null)
  const confirm = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    cancel.current?.focus()
    return () => previous?.focus()
  }, [])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && !busy) {
      event.preventDefault()
      onCancel()
    } else if (event.key === 'Tab') {
      const first = cancel.current
      const last = confirm.current
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
  }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel() }}>
    <div role="alertdialog" aria-modal="true" aria-labelledby="admin-delete-title" aria-describedby="admin-delete-description" onKeyDown={handleKeyDown} className="w-full rounded-t-2xl border border-white/10 bg-[#0b1828] p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">Confirm deletion</p>
      <h3 id="admin-delete-title" className="mt-2 text-lg font-semibold text-white">Delete this record?</h3>
      <p id="admin-delete-description" className="mt-2 break-words text-sm leading-6 text-slate-300"><span className="font-medium text-white">{title}</span> will be permanently removed. This action cannot be undone.</p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button ref={cancel} type="button" disabled={busy} onClick={onCancel} className="min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-50">Cancel</button>
        <button ref={confirm} type="button" disabled={busy} onClick={onConfirm} className="min-h-11 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:opacity-60">{busy ? 'Deleting…' : 'Delete permanently'}</button>
      </div>
    </div>
  </div>
}

export default function AdminCollectionManager({ collection }: { collection: string }) {
  const [data, setData] = useState<CollectionData | null>(null)
  const [selected, setSelected] = useState<Row | null>(null)
  const [draft, setDraft] = useState<Record<string, string | boolean>>({})
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [booleanFilters, setBooleanFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const retryAction = useRef<(() => void) | null>(null)
  const fields = useMemo(() => data?.columns.filter((column) => !SYSTEM_FIELDS.has(column.column_name)) ?? [], [data])

  const load = useCallback(async () => {
    setLoading(true); setError(''); retryAction.current = null
    try {
      const query = new URLSearchParams({ collection, page: String(page), pageSize: '25' })
      if (search) query.set('search', search)
      if (status) query.set('status', status)
      if (category) query.set('category', category)
      for (const [key, value] of Object.entries(booleanFilters)) if (value) query.set(key, value)
      const response = await fetch(`/api/admin/data?${query}`, { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not load records.')
      setData(result)
      if (selected && !result.rows.some((row: Row) => row.id === selected.id)) setSelected(null)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not load records.'); retryAction.current = () => setReloadToken((value) => value + 1) }
    finally { setLoading(false) }
  }, [collection, page, search, status, category, booleanFilters, selected])

  useEffect(() => { const timer = window.setTimeout(() => { void load() }, 0); return () => window.clearTimeout(timer) }, [load, reloadToken])
  useEffect(() => { const timer = window.setTimeout(() => { setPage(1); setSearch(searchText.trim()) }, 300); return () => window.clearTimeout(timer) }, [searchText])

  function begin(row: Row | null) {
    setSelected(row); setNotice(''); setError(''); setFieldErrors({}); setConfirmDelete(false); retryAction.current = null
    const values: Record<string, string | boolean> = {}
    for (const column of fields) {
      const value = row?.[column.column_name]
      values[column.column_name] = !row && collection === 'events' && column.column_name === 'is_published'
        ? true
        : initialValue(column, value)
    }
    setDraft(values)
  }

  function payload() {
    const result: Record<string, unknown> = {}
    for (const field of fields) {
      const key = field.column_name
      const value = draft[key]
      if (!selected && field.column_default && value === '') continue
      if (field.data_type === 'boolean') result[key] = Boolean(value)
      else if (['smallint', 'integer', 'bigint', 'numeric', 'real', 'double precision'].includes(field.data_type)) result[key] = value === '' && field.is_nullable === 'YES' ? null : Number(value)
      else if (field.data_type === 'ARRAY') result[key] = String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean)
      else if (field.data_type === 'jsonb' || field.data_type === 'json') result[key] = value ? JSON.parse(String(value)) : null
      else result[key] = value === '' && field.is_nullable === 'YES' ? null : value
    }
    return result
  }

  function validateFields() {
    const next: Record<string, string> = {}
    for (const field of fields) {
      const key = field.column_name
      const value = draft[key]
      if (field.data_type === 'boolean') continue
      const raw = String(value ?? '')
      const trimmed = raw.trim()
      if (field.is_nullable === 'NO' && !field.column_default && !trimmed) {
        next[key] = `${humanize(key)} is required.`
        continue
      }
      if (field.character_maximum_length !== null && trimmed.length > field.character_maximum_length) {
        next[key] = `Use no more than ${field.character_maximum_length} characters.`
        continue
      }
      if (['smallint', 'integer', 'bigint', 'numeric', 'real', 'double precision'].includes(field.data_type) && trimmed && !Number.isFinite(Number(trimmed))) {
        next[key] = 'Enter a valid number.'
        continue
      }
      if (key === 'email' && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        next[key] = 'Enter a valid email address.'
        continue
      }
      if (key.endsWith('_url') && trimmed) {
        try {
          const url = new URL(trimmed)
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol')
        } catch { next[key] = 'Enter a valid http or https URL.'; continue }
      }
      if ((field.data_type === 'json' || field.data_type === 'jsonb') && trimmed) {
        try { JSON.parse(trimmed) } catch { next[key] = 'Enter valid JSON.' }
      }
    }
    return next
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setNotice('')
    const validation = validateFields()
    setFieldErrors(validation)
    const firstInvalid = Object.keys(validation)[0]
    if (firstInvalid) {
      document.getElementById(`admin-field-${firstInvalid}`)?.focus()
      return
    }
    setSaving(true)
    try {
      const publicationColumnExists = data?.columns.some((column) => column.column_name === 'is_published') ?? false
      if (!selected && !NO_CREATE.has(collection) && !publicationColumnExists && !window.confirm('This table has no draft/published field yet. Saving this new record will make it publicly visible immediately. Continue?')) return
      const response = await fetch('/api/admin/data', {
        method: selected ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, id: selected?.id, data: payload() }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save this record.')
      setSelected(null); setNotice(selected ? 'Changes saved.' : 'Record created.'); setPage(1); await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Check the entered values and try again.')
      retryAction.current = () => {
        const form = document.getElementById('admin-editor-form')
        if (form instanceof HTMLFormElement) form.requestSubmit()
      }
    }
    finally { setSaving(false) }
  }

  async function remove() {
    if (!selected) return
    setSaving(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/admin/data', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collection, id: selected.id }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not delete this record.')
      setSelected(null); setConfirmDelete(false); setNotice('Record deleted.'); await load()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not delete this record.'); retryAction.current = () => { void remove() } }
    finally { setSaving(false) }
  }

  async function uploadFile(field: string, file: File | undefined) {
    if (!file) return
    setSaving(true); setError(''); setNotice('')
    try {
      const form = new FormData(); form.set('file', file)
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not upload the file.')
      setDraft((current) => ({ ...current, [field]: result.url })); setNotice('File uploaded. Save the record to keep its URL.')
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not upload the file. Select the file again to retry.'); retryAction.current = null }
    finally { setSaving(false) }
  }

  const availableStatus = data?.statusOptions ?? []
  const availableCategories = data?.categoryOptions ?? []
  const availableBooleanFilters = data?.booleanFilters ?? []

  const anyFilter = Boolean(searchText || status || category || Object.values(booleanFilters).some(Boolean))
  const clearFilters = () => { setSearchText(''); setSearch(''); setStatus(''); setCategory(''); setBooleanFilters({}); setPage(1) }

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">Record management</p><h2 className="mt-2 text-2xl font-semibold">{LABELS[collection] ?? 'Records'}</h2><p className="mt-1 text-sm text-slate-400">{data ? `${data.total.toLocaleString()} database records` : 'Search and manage database records.'}</p></div>
      {!NO_CREATE.has(collection) && <button onClick={() => begin(null)} disabled={!data || loading} className="min-h-11 rounded-xl bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-[#07111f] transition hover:bg-[#e3c468] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50">New record</button>}
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <label className="text-xs font-medium text-slate-400">Search records<span className="relative mt-1.5 block"><Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search fields…" className="min-h-11 w-full rounded-lg border border-white/10 bg-[#07111f] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus-visible:border-[#d4af37]/60 focus-visible:ring-2 focus-visible:ring-[#d4af37]/30" /></span></label>
      {availableStatus.length > 0 && <label className="text-xs font-medium text-slate-400">Filter by status<select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#07111f] px-3 py-2.5 text-sm text-white outline-none focus-visible:border-[#d4af37]/60 focus-visible:ring-2 focus-visible:ring-[#d4af37]/30"><option value="">All statuses</option>{availableStatus.map((value) => <option key={value}>{value}</option>)}</select></label>}
      {availableCategories.length > 0 && <label className="text-xs font-medium text-slate-400">Filter by category<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }} className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#07111f] px-3 py-2.5 text-sm text-white outline-none focus-visible:border-[#d4af37]/60 focus-visible:ring-2 focus-visible:ring-[#d4af37]/30"><option value="">All categories</option>{availableCategories.map((value) => <option key={value}>{value}</option>)}</select></label>}
      {availableBooleanFilters.map((key) => <label key={key} className="text-xs font-medium text-slate-400">{key === 'is_current' ? 'Leadership term' : key === 'is_published' ? 'Publication' : 'Featured'}<select value={booleanFilters[key] ?? ''} onChange={(event) => { setBooleanFilters((current) => ({ ...current, [key]: event.target.value })); setPage(1) }} className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#07111f] px-3 py-2.5 text-sm text-white outline-none focus-visible:border-[#d4af37]/60 focus-visible:ring-2 focus-visible:ring-[#d4af37]/30"><option value="">All</option><option value="true">{key === 'is_published' ? 'Published' : 'Yes'}</option><option value="false">{key === 'is_published' ? 'Draft' : 'No'}</option></select></label>)}
    </div>
    {anyFilter && <button onClick={clearFilters} className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-400 underline decoration-white/20 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"><X size={14} aria-hidden="true" />Clear filters</button>}
    {!NO_CREATE.has(collection) && data && !data.columns.some((column) => column.column_name === 'is_published') && <p className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">This table has no publication field. New records are immediately public.</p>}
    {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</p>}
    {error && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200"><p role="alert">{error}</p>{retryAction.current && <button onClick={() => retryAction.current?.()} disabled={saving || loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200/20 px-3 py-2 font-medium hover:bg-red-200/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-60"><RefreshCw size={14} className={saving || loading ? 'animate-spin' : ''} aria-hidden="true" />Retry</button>}</div>}

    <div className={`mt-5 grid gap-5 ${selected || (!NO_CREATE.has(collection) && fields.length) ? 'xl:grid-cols-[minmax(0,1fr)_minmax(330px,0.8fr)]' : ''}`}>
      <div className="min-w-0 overflow-hidden rounded-xl border border-white/10">
        {loading ? <div role="status" className="flex min-h-40 items-center justify-center gap-3 p-5 text-sm text-slate-400"><LoaderCircle size={19} className="animate-spin text-[#d4af37]" aria-hidden="true" />Loading records…</div> : data?.rows.length ? <>
          <div className="space-y-2 p-3 sm:hidden">{data.rows.map((row) => <button key={row.id} type="button" onClick={() => begin(row)} aria-label={`Open details for ${titleFor(row)}`} aria-pressed={selected?.id === row.id} className={`w-full rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${selected?.id === row.id ? 'border-[#d4af37]/50 bg-[#d4af37]/[0.07]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'}`}><span className="block break-words text-sm font-medium text-white">{titleFor(row)}</span><span className="mt-1 block break-words text-xs text-slate-400">{show(row.email ?? row.category ?? row.description ?? row.subject)}</span><span className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500"><span>{show(row.updated_at ?? row.created_at)}</span><span className="rounded-full bg-white/[0.06] px-2 py-1 text-slate-300">{show(row.status)}</span></span></button>)}</div>
          <div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[540px] text-left text-sm"><caption className="sr-only">{LABELS[collection] ?? 'Database'} records. Select a record to view or edit details.</caption><thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-slate-400"><tr><th scope="col" className="px-4 py-3">Record</th><th scope="col" className="px-4 py-3">Date</th><th scope="col" className="px-4 py-3">Status</th></tr></thead><tbody>{data.rows.map((row) => <tr key={row.id} className={`border-t border-white/5 hover:bg-white/[0.04] ${selected?.id === row.id ? 'bg-white/[0.06]' : ''}`}><td className="max-w-[320px] px-4 py-3"><button type="button" onClick={() => begin(row)} aria-label={`Open details for ${titleFor(row)}`} aria-pressed={selected?.id === row.id} className="block min-h-10 w-full rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"><span className="block truncate font-medium text-white">{titleFor(row)}</span><span className="mt-1 block truncate text-xs text-slate-500">{show(row.email ?? row.category ?? row.description ?? row.subject)}</span></button></td><td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{show(row.updated_at ?? row.created_at)}</td><td className="px-4 py-3 text-xs text-slate-300">{show(row.status)}</td></tr>)}</tbody></table></div>
        </> : <div className="p-6"><p className="text-sm font-medium text-slate-200">{anyFilter ? 'No matching records.' : 'No records yet.'}</p><p className="mt-1 text-xs leading-5 text-slate-500">{anyFilter ? 'Try clearing one or more filters.' : 'New database records will appear here.'}</p>{anyFilter && <button onClick={clearFilters} className="mt-3 min-h-10 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">Clear filters</button>}</div>}
      </div>

      {(!NO_CREATE.has(collection) || selected) && fields.length > 0 && <form id="admin-editor-form" onSubmit={save} noValidate className="min-w-0 rounded-xl border border-white/10 p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wider text-[#d4af37]">{selected ? 'Selected record' : 'New entry'}</p><h3 className="mt-1 font-semibold">{selected ? 'Edit record' : 'Create record'}</h3></div>{selected && <button type="button" onClick={() => begin(null)} className="min-h-10 rounded-lg px-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">New instead</button>}</div>
        <div className="mt-4 max-h-[65vh] space-y-3 overflow-y-auto pr-1">{fields.map((field) => {
          const key = field.column_name; const label = collection === 'events' && key === 'is_published' ? 'Publish immediately' : humanize(key); const value = draft[key]
          const choices = FIELD_CHOICES[collection]?.[key]
          const required = field.is_nullable === 'NO' && !field.column_default
          const invalid = Boolean(fieldErrors[key])
          const errorId = `admin-error-${key}`
          const describedBy = invalid ? errorId : undefined
          const controlClass = `mt-1.5 min-h-11 w-full rounded-lg border bg-[#07111f] px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/40 ${invalid ? 'border-red-400/70' : 'border-white/10 focus-visible:border-[#d4af37]/60'}`
          const fieldError = invalid && <span id={errorId} className="mt-1.5 block text-xs text-red-300">{fieldErrors[key]}</span>
          if (field.data_type === 'boolean') return <label key={key} className="flex min-h-11 items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-slate-200"><input id={`admin-field-${key}`} type="checkbox" checked={Boolean(value)} onChange={(event) => { setDraft((current) => ({ ...current, [key]: event.target.checked })); setFieldErrors((current) => ({ ...current, [key]: '' })) }} className="h-4 w-4 rounded accent-[#d4af37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]" />{label}</label>
          if (choices) return <label key={key} htmlFor={`admin-field-${key}`} className="block text-xs font-medium text-slate-400">{label}{required && <span aria-hidden="true" className="ml-1 text-[#d4af37]">*</span>}<select id={`admin-field-${key}`} aria-invalid={invalid} aria-describedby={describedBy} required={required} value={String(value ?? '')} onChange={(event) => { setDraft((current) => ({ ...current, [key]: event.target.value })); setFieldErrors((current) => ({ ...current, [key]: '' })) }} className={controlClass}><option value="">Select {label.toLowerCase()}</option>{choices.map((option) => <option key={option}>{option}</option>)}</select>{fieldError}</label>
          const large = ['text', 'json', 'jsonb', 'ARRAY'].includes(field.data_type)
          const numeric = ['smallint', 'integer', 'bigint', 'numeric', 'real', 'double precision'].includes(field.data_type)
          const type = numeric ? 'number' : key === 'email' ? 'email' : key.endsWith('_url') ? 'url' : key === 'date' || key.endsWith('_date') ? 'date' : 'text'
          return <label key={key} htmlFor={`admin-field-${key}`} className="block text-xs font-medium text-slate-400">{label}{required && <span aria-hidden="true" className="ml-1 text-[#d4af37]">*</span>}{large ? <textarea id={`admin-field-${key}`} aria-invalid={invalid} aria-describedby={describedBy} required={required} maxLength={field.character_maximum_length ?? undefined} rows={field.data_type === 'jsonb' ? 4 : 3} value={String(value ?? '')} onChange={(event) => { setDraft((current) => ({ ...current, [key]: event.target.value })); setFieldErrors((current) => ({ ...current, [key]: '' })) }} className={`${controlClass} min-h-24`} /> : <input id={`admin-field-${key}`} aria-invalid={invalid} aria-describedby={describedBy} type={type} maxLength={numeric ? undefined : field.character_maximum_length ?? undefined} required={required} value={String(value ?? '')} onChange={(event) => { setDraft((current) => ({ ...current, [key]: event.target.value })); setFieldErrors((current) => ({ ...current, [key]: '' })) }} className={controlClass} />}{fieldError}{UPLOAD_FIELDS.has(key) && <span className="mt-2 flex flex-wrap items-center gap-3"><input type="file" accept="image/jpeg,image/png,image/gif,image/webp,application/pdf" disabled={saving} aria-label={`Upload ${label}`} onChange={(event) => { void uploadFile(key, event.target.files?.[0]); event.currentTarget.value = '' }} className="max-w-full text-xs file:mr-3 file:min-h-10 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]" /><span className="text-[11px] text-slate-500">Images/PDF, max 10 MB</span></span>}</label>
        })}</div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row"><button type="submit" disabled={saving} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-[#07111f] hover:bg-[#e3c468] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50">{saving && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}{saving ? 'Saving…' : 'Save record'}</button>{selected && <button type="button" onClick={() => setConfirmDelete(true)} disabled={saving} className="min-h-11 rounded-lg border border-red-400/30 px-4 py-2.5 text-sm text-red-200 hover:bg-red-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50">Delete</button>}</div>
      </form>}
    </div>

    <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p aria-live="polite" className="text-slate-500">Page {data?.page ?? page} of {Math.max(1, data?.pageCount ?? 0)} <span aria-hidden="true">·</span> 25 records per page</p><div className="grid grid-cols-2 gap-2 sm:flex"><button aria-label="Previous page" disabled={loading || page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="min-h-11 rounded-lg border border-white/10 px-4 py-2 text-slate-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-40">Previous</button><button aria-label="Next page" disabled={loading || !data || page >= data.pageCount} onClick={() => setPage((current) => current + 1)} className="min-h-11 rounded-lg border border-white/10 px-4 py-2 text-slate-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-40">Next</button></div></div>
    {confirmDelete && selected && <DeleteConfirmation title={titleFor(selected)} busy={saving} onCancel={() => setConfirmDelete(false)} onConfirm={() => void remove()} />}
  </div>
}
