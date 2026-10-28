'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Gavel,
  GraduationCap,
  Handshake,
  MapPin,
  Mic2,
  Scale,
  Search,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'

type EventCategory =
  | 'All'
  | 'Moot Court'
  | 'Academic'
  | 'Debate'
  | 'Career'
  | 'Seminar'
  | 'Community'

type Event = {
  id: number | string
  title: string
  category: Exclude<EventCategory, 'All'>
  date: string
  day: string
  month: string
  time: string
  location: string
  description: string
  icon: typeof Gavel
  featured?: boolean
}

const categories: {
  label: EventCategory
  icon: typeof Calendar
}[] = [
  { label: 'All', icon: Calendar },
  { label: 'Moot Court', icon: Gavel },
  { label: 'Academic', icon: BookOpen },
  { label: 'Debate', icon: Mic2 },
  { label: 'Career', icon: GraduationCap },
  { label: 'Seminar', icon: Users },
  { label: 'Community', icon: Handshake },
]

const fallbackEvents: Event[] = [
  {
    id: 1,
    title: 'Moot Court & Legal Advocacy Training',
    category: 'Moot Court',
    date: 'October 24, 2026',
    day: '24',
    month: 'OCT',
    time: '2:00 PM – 5:00 PM',
    location: 'Jimma University',
    description:
      'A practical session focused on legal research, case analysis, memorial writing, oral advocacy, presentation, teamwork, and professional ethics.',
    icon: Gavel,
    featured: true,
  },
  {
    id: 2,
    title: 'Legal Research & Writing Workshop',
    category: 'Academic',
    date: 'November 2, 2026',
    day: '02',
    month: 'NOV',
    time: '10:00 AM – 1:00 PM',
    location: 'Jimma University',
    description:
      "An academic workshop designed to strengthen students' legal research, writing, critical thinking, and analytical skills.",
    icon: BookOpen,
  },
  {
    id: 3,
    title: 'Student Debate & Public Speaking',
    category: 'Debate',
    date: 'November 12, 2026',
    day: '12',
    month: 'NOV',
    time: '2:00 PM – 4:30 PM',
    location: 'Jimma University',
    description:
      'An opportunity for law students to develop confidence, argumentation, public speaking, and constructive debate skills.',
    icon: Mic2,
  },
  {
    id: 4,
    title: 'Legal Career Development Session',
    category: 'Career',
    date: 'November 21, 2026',
    day: '21',
    month: 'NOV',
    time: '11:00 AM – 1:30 PM',
    location: 'Jimma University',
    description:
      'A career-focused session covering professional development, career planning, networking, and opportunities for law students.',
    icon: GraduationCap,
  },
  {
    id: 5,
    title: 'Law & Society Seminar',
    category: 'Seminar',
    date: 'December 4, 2026',
    day: '04',
    month: 'DEC',
    time: '2:00 PM – 4:00 PM',
    location: 'Jimma University',
    description:
      'A seminar creating space for students to engage with legal and social issues through discussion, reflection, and knowledge sharing.',
    icon: Scale,
  },
  {
    id: 6,
    title: 'Community Legal Awareness Program',
    category: 'Community',
    date: 'December 12, 2026',
    day: '12',
    month: 'DEC',
    time: '9:00 AM – 2:00 PM',
    location: 'Jimma Community',
    description:
      'A community engagement activity focused on legal awareness, public education, volunteerism, and meaningful service.',
    icon: Handshake,
  },
]

type EventRecord = Record<string, unknown>

function recordText(record: EventRecord, key: string) {
  const value = record[key]
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function mapEventRecord(record: EventRecord, index: number): Event {
  const date = recordText(record, 'date_formatted') || recordText(record, 'created_at')
  const knownCategories: Exclude<EventCategory, 'All'>[] = [
    'Moot Court', 'Academic', 'Debate', 'Career', 'Seminar', 'Community',
  ]
  const rawCategory = recordText(record, 'category')
  const category = knownCategories.includes(rawCategory as Exclude<EventCategory, 'All'>)
    ? rawCategory as Exclude<EventCategory, 'All'>
    : 'Academic'
  const icons = {
    'Moot Court': Gavel,
    Academic: BookOpen,
    Debate: Mic2,
    Career: GraduationCap,
    Seminar: Users,
    Community: Handshake,
  }

  return {
    id: recordText(record, 'id') || index,
    title: recordText(record, 'title') || 'JULSA event',
    category,
    date,
    day: recordText(record, 'day_number') || date.match(/\b\d{1,2}\b/)?.[0] || '',
    month: (recordText(record, 'month_name') || date.match(/[A-Za-z]+/)?.[0] || '').slice(0, 3).toUpperCase(),
    time: recordText(record, 'time_range'),
    location: recordText(record, 'location'),
    description: recordText(record, 'description'),
    icon: icons[category],
    featured: record.featured === true,
  }
}

const eventHighlights = [
  {
    title: 'Moot Court',
    description:
      'Build practical advocacy skills through legal research, case analysis, memorial writing, and oral presentation.',
    icon: Gavel,
  },
  {
    title: 'Academic Development',
    description:
      'Strengthen legal research, writing, critical thinking, and academic preparation.',
    icon: BookOpen,
  },
  {
    title: 'Debate & Public Speaking',
    description:
      'Develop confidence, argumentation, communication, and presentation skills.',
    icon: Mic2,
  },
  {
    title: 'Career Development',
    description:
      'Explore professional development, networking, career planning, and opportunities.',
    icon: GraduationCap,
  },
]

export default function Events() {
  const [eventItems, setEventItems] = useState<Event[]>(fallbackEvents)
  const [activeCategory, setActiveCategory] = useState<EventCategory>('All')

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true
    const loadEvents = async () => {
      try {
        const response = await fetch('/api/content/events', { cache: 'no-store' })
        if (!response.ok) return
        const result = await response.json()
        if (active && Array.isArray(result.rows)) {
          setEventItems(result.rows.length ? result.rows.map(mapEventRecord) : fallbackEvents)
        }
      } catch {
        // Keep the built-in events visible when the content service is unavailable.
      }
    }

    void loadEvents()
    const refresh = window.setInterval(() => { void loadEvents() }, 5_000)
    return () => {
      active = false
      window.clearInterval(refresh)
    }
  }, [])

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return eventItems.filter((event) => {
      const matchesCategory =
        activeCategory === 'All' || event.category === activeCategory

      const matchesSearch =
        query.length === 0 ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [eventItems, activeCategory, searchQuery])

  const featuredEvent = eventItems.find((event) => event.featured) ?? eventItems[0]

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>
      {/* =========================================================
          EVENT TYPES
      ========================================================= */}
      <section
        id='event-types'
        className='border-b border-white/10 bg-[#091525]'
      >
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='mb-12 max-w-2xl'>
            <p className='mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
              What We Do
            </p>

            <h2 className='font-serif text-4xl font-semibold text-white sm:text-5xl'>
              More than events.
              <span className='block text-slate-400'>
                Opportunities to grow.
              </span>
            </h2>

            <p className='mt-5 leading-7 text-slate-400'>
              JULSA activities are designed around academic excellence,
              practical legal skills, professional development, leadership,
              advocacy, and community engagement.
            </p>
          </div>

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {eventHighlights.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className='group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/[0.05]'
                >
                  <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37]'>
                    <Icon className='h-5 w-5' />
                  </div>

                  <h3 className='text-lg font-semibold text-white'>
                    {item.title}
                  </h3>

                  <p className='mt-3 text-sm leading-6 text-slate-400'>
                    {item.description}
                  </p>

                  <div className='mt-5 h-px w-10 bg-[#d4af37]/50 transition-all duration-300 group-hover:w-20' />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED EVENT
      ========================================================= */}
      {featuredEvent && (
        <section className='relative overflow-hidden'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.12),transparent_35%)]' />

          <div className='relative mx-auto max-w-7xl px-6 py-20 lg:px-8'>
            <div className='mb-8 flex items-center gap-3'>
              <div className='h-px w-10 bg-[#d4af37]' />

              <span className='text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]'>
                Featured Event
              </span>
            </div>

            <div className='overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-white/[0.035]'>
              <div className='grid lg:grid-cols-[0.8fr_1.2fr]'>
                {/* Date panel */}
                <div className='relative flex min-h-[350px] flex-col justify-between overflow-hidden bg-[#d4af37] p-8 text-[#07111f] sm:p-10'>
                  <div className='absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full border-[40px] border-[#07111f]/10' />

                  <div>
                    <p className='text-sm font-bold uppercase tracking-[0.25em]'>
                      Upcoming
                    </p>

                    <div className='mt-10'>
                      <span className='block text-8xl font-bold leading-none'>
                        {featuredEvent.day}
                      </span>

                      <span className='mt-2 block text-xl font-bold tracking-[0.25em]'>
                        {featuredEvent.month}
                      </span>
                    </div>
                  </div>

                  <div className='relative'>
                    <p className='text-sm font-semibold'>
                      {featuredEvent.date}
                    </p>

                    <p className='mt-1 text-sm opacity-75'>
                      {featuredEvent.time}
                    </p>
                  </div>
                </div>

                {/* Content panel */}
                <div className='p-8 sm:p-10 lg:p-12'>
                  <div className='mb-5 flex flex-wrap items-center gap-3'>
                    <span className='rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#e6c65c]'>
                      {featuredEvent.category}
                    </span>

                    <span className='flex items-center gap-1.5 text-sm text-slate-400'>
                      <MapPin className='h-4 w-4' />
                      {featuredEvent.location}
                    </span>
                  </div>

                  <h2 className='max-w-2xl font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl'>
                    {featuredEvent.title}
                  </h2>

                  <p className='mt-6 max-w-2xl leading-7 text-slate-400'>
                    {featuredEvent.description}
                  </p>

                  <div className='mt-8 flex flex-wrap gap-4'>
                    <button
                      type='button'
                      onClick={() => setSelectedEvent(featuredEvent)}
                      className='group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#07111f] transition hover:bg-[#d4af37]'
                    >
                      View Event Details
                      <ChevronRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </button>

                    <div className='flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-400'>
                      <Clock className='h-4 w-4 text-[#d4af37]' />
                      {featuredEvent.time}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          UPCOMING EVENTS
      ========================================================= */}
      <section
        id='upcoming-events'
        className='border-y border-white/10 bg-[#091525]'
      >
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <p className='mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
                Calendar
              </p>

              <h2 className='font-serif text-4xl font-semibold text-white sm:text-5xl'>
                Upcoming Events
              </h2>

              <p className='mt-5 leading-7 text-slate-400'>
                Find academic activities, competitions, professional development
                programs, seminars, and community initiatives.
              </p>
            </div>

            {/* Search */}
            <div className='relative w-full lg:max-w-xs'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500' />

              <input
                type='text'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search events...'
                className='w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#d4af37]/50'
              />
            </div>
          </div>

          {/* Category filters */}
          <div className='mt-10 flex gap-2 overflow-x-auto pb-2'>
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.label

              return (
                <button
                  key={category.label}
                  type='button'
                  onClick={() => setActiveCategory(category.label)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'border-[#d4af37] bg-[#d4af37] text-[#07111f]'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  {category.label}
                </button>
              )
            })}
          </div>

          {/* Event grid */}
          <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {filteredEvents.map((event) => {
              const Icon = event.icon

              return (
                <article
                  key={event.id}
                  className='group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30'
                >
                  {/* Event top */}
                  <div className='relative flex items-start justify-between border-b border-white/10 p-6'>
                    <div className='flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-[#d4af37] text-[#07111f]'>
                      <span className='text-xl font-bold leading-none'>
                        {event.day}
                      </span>
                      <span className='mt-1 text-[10px] font-bold tracking-widest'>
                        {event.month}
                      </span>
                    </div>

                    <div className='flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37]'>
                      <Icon className='h-5 w-5' />
                    </div>
                  </div>

                  {/* Event content */}
                  <div className='flex flex-1 flex-col p-6'>
                    <span className='mb-3 w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400'>
                      {event.category}
                    </span>

                    <h3 className='text-xl font-semibold leading-snug text-white'>
                      {event.title}
                    </h3>

                    <p className='mt-3 flex-1 text-sm leading-6 text-slate-400'>
                      {event.description}
                    </p>

                    <div className='mt-6 space-y-3 border-t border-white/10 pt-5'>
                      <div className='flex items-center gap-3 text-sm text-slate-400'>
                        <Clock className='h-4 w-4 shrink-0 text-[#d4af37]' />
                        {event.time}
                      </div>

                      <div className='flex items-center gap-3 text-sm text-slate-400'>
                        <MapPin className='h-4 w-4 shrink-0 text-[#d4af37]' />
                        {event.location}
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={() => setSelectedEvent(event)}
                      className='group/button mt-6 flex items-center gap-2 text-sm font-semibold text-[#d4af37]'
                    >
                      View Details
                      <ArrowRight className='h-4 w-4 transition-transform group-hover/button:translate-x-1' />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className='rounded-2xl border border-dashed border-white/10 py-20 text-center'>
              <Calendar className='mx-auto h-10 w-10 text-slate-600' />

              <h3 className='mt-5 text-lg font-semibold text-white'>
                No events found
              </h3>

              <p className='mt-2 text-sm text-slate-500'>
                Try another category or search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          EVENT PHILOSOPHY
      ========================================================= */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(16,181,203,0.08),transparent_35%)]' />

        <div className='relative mx-auto max-w-7xl px-6 py-24 lg:px-8'>
          <div className='grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]'>
            <div>
              <p className='mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
                Why Participate?
              </p>

              <h2 className='font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl'>
                Every activity is a chance to
                <span className='text-[#d4af37]'> grow.</span>
              </h2>

              <p className='mt-6 max-w-xl leading-8 text-slate-400'>
                JULSA activities bring students together around learning,
                advocacy, leadership, professional development, and service.
                They create opportunities to develop skills beyond the classroom
                and connect with fellow law students and professionals.
              </p>

              <div className='mt-8 flex flex-wrap gap-3'>
                {['Learn', 'Advocate', 'Lead', 'Serve'].map((word) => (
                  <span
                    key={word}
                    className='rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 px-4 py-2 text-sm font-semibold text-[#e6c65c]'
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className='relative'>
              <div className='absolute -inset-4 rounded-3xl bg-[#d4af37]/5 blur-2xl' />

              <div className='relative rounded-3xl border border-white/10 bg-white/[0.035] p-8 sm:p-10'>
                <div className='mb-8 flex items-center justify-between'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                      JULSA
                    </p>

                    <h3 className='mt-2 font-serif text-2xl font-semibold text-white'>
                      Learn · Advocate · Lead · Serve
                    </h3>
                  </div>

                  <div className='flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37]'>
                    <Trophy className='h-5 w-5' />
                  </div>
                </div>

                <div className='space-y-4'>
                  {[
                    {
                      number: '01',
                      title: 'Academic Excellence',
                    },
                    {
                      number: '02',
                      title: 'Practical Legal Skills',
                    },
                    {
                      number: '03',
                      title: 'Leadership & Development',
                    },
                    {
                      number: '04',
                      title: 'Community Engagement',
                    },
                  ].map((item) => (
                    <div
                      key={item.number}
                      className='flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.025] p-4'
                    >
                      <span className='font-mono text-xs text-[#d4af37]'>
                        {item.number}
                      </span>

                      <span className='text-sm font-medium text-slate-200'>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className='border-t border-white/10 bg-[#d4af37] text-[#07111f]'>
        <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8'>
          <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm font-bold uppercase tracking-[0.25em] opacity-70'>
                Be Part of JULSA
              </p>

              <h2 className='mt-3 font-serif text-3xl font-semibold sm:text-4xl'>
                Learn, advocate, lead, and serve.
              </h2>

              <p className='mt-3 max-w-xl leading-7 opacity-75'>
                Join the JULSA community and take part in activities that
                support academic growth, practical skills, leadership,
                professional development, and service.
              </p>
            </div>

            <Link
              href='/members#register'
              className='group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#07111f] px-7 py-4 font-semibold text-white transition hover:bg-[#102238]'
            >
              Become a Member
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          EVENT MODAL
      ========================================================= */}
      {selectedEvent && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm'
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className='relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#091525] shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              onClick={() => setSelectedEvent(null)}
              aria-label='Close event details'
              className='absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='bg-[#d4af37] p-8 text-[#07111f] sm:p-10'>
              <div className='flex items-center gap-5'>
                <div className='flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#07111f] text-white'>
                  <span className='text-3xl font-bold leading-none'>
                    {selectedEvent.day}
                  </span>

                  <span className='mt-1 text-xs font-bold tracking-widest text-[#d4af37]'>
                    {selectedEvent.month}
                  </span>
                </div>

                <div>
                  <p className='text-xs font-bold uppercase tracking-[0.2em] opacity-60'>
                    {selectedEvent.category}
                  </p>

                  <h2 className='mt-2 pr-8 font-serif text-2xl font-semibold sm:text-3xl'>
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className='p-8 sm:p-10'>
              <p className='leading-7 text-slate-300'>
                {selectedEvent.description}
              </p>

              <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-5 w-5 text-[#d4af37]' />

                    <div>
                      <p className='text-xs uppercase tracking-wider text-slate-500'>
                        Date
                      </p>

                      <p className='mt-1 text-sm font-medium text-white'>
                        {selectedEvent.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <div className='flex items-center gap-3'>
                    <Clock className='h-5 w-5 text-[#d4af37]' />

                    <div>
                      <p className='text-xs uppercase tracking-wider text-slate-500'>
                        Time
                      </p>

                      <p className='mt-1 text-sm font-medium text-white'>
                        {selectedEvent.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2'>
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-5 w-5 text-[#d4af37]' />

                    <div>
                      <p className='text-xs uppercase tracking-wider text-slate-500'>
                        Location
                      </p>

                      <p className='mt-1 text-sm font-medium text-white'>
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setSelectedEvent(null)}
                className='mt-8 w-full rounded-full bg-[#d4af37] px-6 py-3.5 font-semibold text-[#07111f] transition hover:bg-[#e6c65c]'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
