'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Gavel,
  GraduationCap,
  MapPin,
  Mic2,
  Search,
  Scale,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import LiveCollection from '@/components/live-collection'

type CompetitionStatus = 'Upcoming' | 'Registration Open' | 'Completed'

type Competition = {
  id: number
  title: string
  status: CompetitionStatus
  date: string
  time: string
  location: string
  description: string
  category: string
  icon: typeof Trophy
  featured?: boolean
}

const competitions: Competition[] = [
  {
    id: 1,
    title: 'JULSA Moot Court Competition',
    status: 'Upcoming',
    date: 'November 2026',
    time: 'Schedule to be announced',
    location: 'Jimma University',
    description:
      'A practical legal advocacy competition where students develop legal research, case analysis, memorial writing, oral advocacy, presentation, and teamwork skills.',
    category: 'Moot Court',
    icon: Gavel,
    featured: true,
  },
  {
    id: 2,
    title: 'Student Legal Debate',
    status: 'Registration Open',
    date: 'December 2026',
    time: 'Schedule to be announced',
    location: 'Jimma University',
    description:
      'A student competition designed to strengthen legal reasoning, argumentation, public speaking, and constructive debate.',
    category: 'Debate',
    icon: Mic2,
  },
  {
    id: 3,
    title: 'Legal Research & Advocacy Challenge',
    status: 'Upcoming',
    date: 'January 2027',
    time: 'Schedule to be announced',
    location: 'Jimma University',
    description:
      'An academic challenge focused on legal research, critical analysis, case reasoning, and effective presentation of legal arguments.',
    category: 'Legal Research',
    icon: Search,
  },
]

const skills = [
  {
    title: 'Legal Research',
    description:
      'Develop the ability to identify, examine, and organize relevant legal authorities.',
    icon: Search,
  },
  {
    title: 'Legal Reasoning',
    description:
      'Learn to analyze legal issues and construct clear, logical arguments.',
    icon: Scale,
  },
  {
    title: 'Memorial Writing',
    description:
      'Develop structured written arguments supported by legal research and analysis.',
    icon: FileText,
  },
  {
    title: 'Oral Advocacy',
    description:
      'Build confidence in presenting legal arguments clearly and persuasively.',
    icon: Mic2,
  },
  {
    title: 'Case Analysis',
    description:
      'Strengthen your ability to understand facts, identify issues, and analyze cases.',
    icon: Gavel,
  },
  {
    title: 'Presentation',
    description:
      'Practice professional communication and effective presentation of legal arguments.',
    icon: GraduationCap,
  },
  {
    title: 'Teamwork',
    description:
      'Work collaboratively while preparing research, arguments, and competition strategy.',
    icon: Users,
  },
  {
    title: 'Professional Ethics',
    description:
      'Develop professional conduct and ethical awareness throughout advocacy activities.',
    icon: ShieldCheck,
  },
]

const preparationSteps = [
  {
    number: '01',
    title: 'Understand the Case',
    description:
      'Read the problem carefully, identify the facts, legal issues, and arguments involved.',
  },
  {
    number: '02',
    title: 'Research the Law',
    description:
      'Find and analyze the relevant legal authorities needed to support your arguments.',
  },
  {
    number: '03',
    title: 'Build the Argument',
    description:
      'Organize your legal reasoning and develop clear arguments for your side.',
  },
  {
    number: '04',
    title: 'Prepare the Memorial',
    description:
      'Transform your research and arguments into a structured written submission.',
  },
  {
    number: '05',
    title: 'Practice Oral Advocacy',
    description:
      'Present your arguments, respond to questions, and improve your courtroom communication.',
  },
]

export default function MootCourtPage() {
  const [statusFilter, setStatusFilter] = useState<'All' | CompetitionStatus>(
    'All',
  )

  const [searchQuery, setSearchQuery] = useState('')

  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null)

  const filteredCompetitions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return competitions.filter((competition) => {
      const statusMatches =
        statusFilter === 'All' || competition.status === statusFilter

      const searchMatches =
        query.length === 0 ||
        competition.title.toLowerCase().includes(query) ||
        competition.description.toLowerCase().includes(query) ||
        competition.category.toLowerCase().includes(query)

      return statusMatches && searchMatches
    })
  }, [statusFilter, searchQuery])

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>
    

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}
      <section className='border-b border-white/10 bg-[#091525]'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='grid gap-14 lg:grid-cols-[0.8fr_1.2fr]'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
                Why Moot Court?
              </p>

              <h2 className='mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl'>
                Learn law by
                <span className='block text-[#d4af37]'>
                  putting it into practice.
                </span>
              </h2>
            </div>

            <div>
              <p className='text-lg leading-8 text-slate-300'>
                Moot court provides students with an opportunity to develop
                practical legal skills through structured case analysis,
                research, written advocacy, oral argument, and teamwork.
              </p>

              <p className='mt-6 leading-7 text-slate-500'>
                Through competitions and advocacy activities, students can
                strengthen their ability to reason through legal problems,
                communicate arguments, and approach legal practice with
                professionalism and ethical awareness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SKILLS
      ========================================================= */}
      <section className='border-b border-white/10'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='max-w-2xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
              Skills
            </p>

            <h2 className='mt-3 font-serif text-4xl font-semibold sm:text-5xl'>
              What you develop
            </h2>

            <p className='mt-5 leading-7 text-slate-400'>
              Moot court activities are designed around practical legal and
              professional skills that complement classroom learning.
            </p>
          </div>

          <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {skills.map((skill, index) => {
              const Icon = skill.icon

              return (
                <div
                  key={skill.title}
                  className='group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]'>
                      <Icon className='h-5 w-5' />
                    </div>

                    <span className='font-mono text-xs text-slate-700'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className='mt-6 font-semibold text-white'>
                    {skill.title}
                  </h3>

                  <p className='mt-3 text-sm leading-6 text-slate-500'>
                    {skill.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          COMPETITIONS
      ========================================================= */}
      <section
        id='competitions'
        className='border-b border-white/10 bg-[#091525]'
      >
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
                Competition Calendar
              </p>

              <h2 className='mt-3 font-serif text-4xl font-semibold sm:text-5xl'>
                Moot Court & Competitions
              </h2>

              <p className='mt-5 leading-7 text-slate-400'>
                Discover competitions and advocacy activities available through
                JULSA.
              </p>
            </div>

            <div className='relative w-full lg:max-w-xs'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600' />

              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search competitions...'
                className='w-full rounded-full border border-white/10 bg-[#07111f] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50'
              />
            </div>
          </div>

          {/* Filters */}
          <div className='mt-9 flex gap-2 overflow-x-auto pb-2'>
            {['All', 'Upcoming', 'Registration Open', 'Completed'].map(
              (status) => {
                const active = statusFilter === status

                return (
                  <button
                    key={status}
                    type='button'
                    onClick={() =>
                      setStatusFilter(status as 'All' | CompetitionStatus)
                    }
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'border-[#d4af37] bg-[#d4af37] text-[#07111f]'
                        : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                )
              },
            )}
          </div>

          {/* Competition cards */}
          <div className='mt-10 space-y-4'>
            {filteredCompetitions.map((competition) => {
              const Icon = competition.icon

              return (
                <article
                  key={competition.id}
                  className='group overflow-hidden rounded-2xl border border-white/10 bg-[#07111f] transition hover:border-[#d4af37]/30'
                >
                  <div className='grid lg:grid-cols-[180px_1fr_auto]'>
                    {/* Date */}
                    <div className='flex flex-col justify-center border-b border-white/10 bg-[#d4af37] p-6 text-[#07111f] lg:border-b-0 lg:border-r'>
                      <Trophy className='h-6 w-6 opacity-70' />

                      <p className='mt-5 text-xs font-bold uppercase tracking-[0.2em] opacity-60'>
                        Competition
                      </p>

                      <p className='mt-2 font-serif text-xl font-semibold'>
                        {competition.date}
                      </p>
                    </div>

                    {/* Content */}
                    <div className='p-6 sm:p-7'>
                      <div className='flex flex-wrap items-center gap-3'>
                        <span className='rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d4af37]'>
                          {competition.category}
                        </span>

                        <span className='rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500'>
                          {competition.status}
                        </span>
                      </div>

                      <h3 className='mt-4 text-xl font-semibold text-white sm:text-2xl'>
                        {competition.title}
                      </h3>

                      <p className='mt-3 max-w-3xl text-sm leading-6 text-slate-500'>
                        {competition.description}
                      </p>

                      <div className='mt-5 flex flex-wrap gap-5 text-xs text-slate-600'>
                        <span className='flex items-center gap-2'>
                          <Clock className='h-4 w-4 text-[#d4af37]' />
                          {competition.time}
                        </span>

                        <span className='flex items-center gap-2'>
                          <MapPin className='h-4 w-4 text-[#d4af37]' />
                          {competition.location}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className='flex items-center border-t border-white/10 p-6 lg:border-l lg:border-t-0'>
                      <button
                        type='button'
                        onClick={() => setSelectedCompetition(competition)}
                        className='group/button inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-[#d4af37]/40 hover:bg-[#d4af37]/10 hover:text-[#d4af37] lg:w-auto'
                      >
                        Details
                        <ChevronRight className='h-4 w-4 transition-transform group-hover/button:translate-x-1' />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredCompetitions.length === 0 && (
            <div className='rounded-2xl border border-dashed border-white/10 py-20 text-center'>
              <Trophy className='mx-auto h-10 w-10 text-slate-700' />

              <h3 className='mt-5 font-semibold text-white'>
                No competitions found
              </h3>

              <p className='mt-2 text-sm text-slate-500'>
                Try another search or status filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          PREPARATION
      ========================================================= */}
      <section id='preparation' className='border-b border-white/10'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='grid gap-14 lg:grid-cols-[0.75fr_1.25fr]'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
                Preparation
              </p>

              <h2 className='mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl'>
                How to prepare for
                <span className='block text-[#d4af37]'>a moot court.</span>
              </h2>

              <p className='mt-6 leading-7 text-slate-400'>
                Strong advocacy starts long before the oral argument. Use a
                structured preparation process to move from understanding the
                case to confidently presenting your arguments.
              </p>

              <a
                href='/academic-hub'
                className='group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37]'
              >
                Explore Academic Resources
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </a>
            </div>

            <div className='space-y-3'>
              {preparationSteps.map((step) => (
                <div
                  key={step.number}
                  className='group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#d4af37]/30 sm:p-6'
                >
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 font-mono text-xs font-semibold text-[#d4af37]'>
                    {step.number}
                  </div>

                  <div>
                    <h3 className='font-semibold text-white'>{step.title}</h3>

                    <p className='mt-2 text-sm leading-6 text-slate-500'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TEAM / COMMUNITY
      ========================================================= */}
      <section className='border-b border-white/10 bg-[#091525]'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-10 lg:p-14'>
            <div className='grid items-center gap-12 lg:grid-cols-[1fr_auto]'>
              <div>
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]'>
                  <Users className='h-6 w-6' />
                </div>

                <h2 className='mt-7 max-w-2xl font-serif text-3xl font-semibold sm:text-4xl'>
                  Great advocacy is built together.
                </h2>

                <p className='mt-5 max-w-2xl leading-7 text-slate-400'>
                  Moot court encourages students to work collaboratively,
                  exchange ideas, divide research responsibilities, practice
                  arguments, and learn from one another.
                </p>

                <div className='mt-7 flex flex-wrap gap-3'>
                  {[
                    'Research',
                    'Collaboration',
                    'Practice',
                    'Feedback',
                    'Growth',
                  ].map((item) => (
                    <span
                      key={item}
                      className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300'
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className='flex h-32 w-32 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5'>
                <div className='flex h-20 w-20 items-center justify-center rounded-full bg-[#d4af37] text-[#07111f]'>
                  <Award className='h-9 w-9' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className='bg-[#d4af37] text-[#07111f]'>
        <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8'>
          <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm font-bold uppercase tracking-[0.25em] opacity-60'>
                Take the Next Step
              </p>

              <h2 className='mt-3 font-serif text-3xl font-semibold sm:text-4xl'>
                Ready to strengthen your advocacy skills?
              </h2>

              <p className='mt-4 max-w-xl leading-7 opacity-75'>
                Explore JULSA resources, follow upcoming competitions, and take
                part in activities that turn legal knowledge into practical
                skills.
              </p>
            </div>

            <a
              href='/academic-hub'
              className='group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#07111f] px-7 py-4 font-semibold text-white transition hover:bg-[#102238]'
            >
              Visit Academic Hub
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMPETITION MODAL
      ========================================================= */}
      {selectedCompetition && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm'
          onClick={() => setSelectedCompetition(null)}
        >
          <div
            className='relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#091525] shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              onClick={() => setSelectedCompetition(null)}
              aria-label='Close competition details'
              className='absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='bg-[#d4af37] p-8 text-[#07111f] sm:p-10'>
              <div className='flex items-start gap-5'>
                <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07111f] text-[#d4af37]'>
                  <selectedCompetition.icon className='h-6 w-6' />
                </div>

                <div className='pr-8'>
                  <p className='text-xs font-bold uppercase tracking-[0.2em] opacity-60'>
                    {selectedCompetition.category}
                  </p>

                  <h2 className='mt-2 font-serif text-2xl font-semibold sm:text-3xl'>
                    {selectedCompetition.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className='p-8 sm:p-10'>
              <div className='mb-6 inline-flex rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#d4af37]'>
                {selectedCompetition.status}
              </div>

              <p className='leading-7 text-slate-300'>
                {selectedCompetition.description}
              </p>

              <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-5 w-5 text-[#d4af37]' />

                    <div>
                      <p className='text-xs uppercase tracking-wider text-slate-600'>
                        Date
                      </p>

                      <p className='mt-1 text-sm text-white'>
                        {selectedCompetition.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <div className='flex items-center gap-3'>
                    <Clock className='h-5 w-5 text-[#d4af37]' />

                    <div>
                      <p className='text-xs uppercase tracking-wider text-slate-600'>
                        Time
                      </p>

                      <p className='mt-1 text-sm text-white'>
                        {selectedCompetition.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2'>
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-5 w-5 text-[#d4af37]' />

                    <div>
                      <p className='text-xs uppercase tracking-wider text-slate-600'>
                        Location
                      </p>

                      <p className='mt-1 text-sm text-white'>
                        {selectedCompetition.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setSelectedCompetition(null)}
                className='mt-8 w-full rounded-full bg-[#d4af37] px-6 py-3.5 font-semibold text-[#07111f] transition hover:bg-[#e6c65c]'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <LiveCollection collection='competitions' title='Current moot court competitions' />
    </main>
  )
}
