'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type Entry = Record<string, unknown>

function text(value: unknown) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function first(entry: Entry, keys: string[]) {
  for (const key of keys) {
    const value = text(entry[key]).trim()
    if (value) return value
  }
  return ''
}

function safeImage(value: string) {
  try {
    if (value.startsWith('/')) return value
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.toString() : ''
  } catch { return '' }
}

export default function LiveCollection({ collection, title }: { collection: string; title: string }) {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const response = await fetch(`/api/content/${collection}`, { cache: 'no-store' })
        if (!response.ok) return
        const result = await response.json()
        if (active && Array.isArray(result.rows)) setEntries(result.rows)
      } catch {
        // Keep the last successful data visible if a refresh temporarily fails.
      }
    }

    void load()
    const refresh = window.setInterval(() => { void load() }, 5_000)
    return () => {
      active = false
      window.clearInterval(refresh)
    }
  }, [collection])

  if (!entries.length) return null

  return (
    <section className="border-y border-white/10 bg-[#091525] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Current JULSA content</p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{title}</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.slice(0, 6).map((entry, index) => {
            const heading = first(entry, ['title', 'name']) || `Item ${index + 1}`
            const description = first(entry, ['excerpt', 'description', 'content'])
            const date = first(entry, ['date_formatted', 'competition_date', 'deadline', 'date_label', 'published_date', 'created_at'])
            const image = safeImage(first(entry, ['image_url', 'cover_image_url']))
            return <article key={text(entry.id) || index} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {image && <Image src={image} alt="" width={960} height={420} unoptimized className="h-40 w-full object-cover" />}
              <div className="p-5">
                {date && <p className="text-xs uppercase tracking-wider text-[#d4af37]">{date}</p>}
                <h3 className="mt-2 font-semibold">{heading}</h3>
                {description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{description}</p>}
              </div>
            </article>
          })}
        </div>
      </div>
    </section>
  )
}
