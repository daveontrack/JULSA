'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import LiveCollection from '@/components/live-collection'
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  MessageSquare,
  Network,
  Search,
  Send,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react'

type OpportunityCategory =
  | 'All'
  | 'Internships'
  | 'Scholarships & Fellowships'
  | 'Competitions'
  | 'Conferences & Trainings'
  | 'Volunteer Opportunities'
  | 'Jobs'

type OpportunityStatus = 'Open' | 'Upcoming' | 'Closed'

interface Opportunity {
  id: number
  title: string
  organization: string
  category: Exclude<OpportunityCategory, 'All'>
  status: OpportunityStatus
  deadline: string
  location: string
  description: string
  featured?: boolean
  tags: string[]
}

interface CareerResource {
  title: string
  description: string
  icon: typeof FileText
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: 'Legal Internship Opportunities',
    organization: 'JULSA Career Hub',
    category: 'Internships',
    status: 'Open',
    deadline: 'Application deadline',
    location: 'Opportunities vary',
    description:
      'Explore internship opportunities that can help law students gain practical exposure and develop professional skills.',
    featured: true,
    tags: ['Internship', 'Legal Practice', 'Career'],
  },
  {
    id: 2,
    title: 'Scholarships & Fellowship Opportunities',
    organization: 'JULSA Opportunities',
    category: 'Scholarships & Fellowships',
    status: 'Upcoming',
    deadline: 'Check opportunity',
    location: 'Various',
    description:
      'Discover scholarship and fellowship opportunities that support academic and professional development.',
    tags: ['Scholarship', 'Fellowship', 'Academic'],
  },
  {
    id: 3,
    title: 'Student Legal Competitions',
    organization: 'JULSA Opportunities',
    category: 'Competitions',
    status: 'Open',
    deadline: 'Check competition',
    location: 'Various',
    description:
      'Find competitions that allow students to develop legal reasoning, research, advocacy, teamwork, and presentation skills.',
    tags: ['Competition', 'Advocacy', 'Moot Court'],
  },
  {
    id: 4,
    title: 'Legal Conferences & Training Programs',
    organization: 'JULSA Opportunities',
    category: 'Conferences & Trainings',
    status: 'Upcoming',
    deadline: 'Registration varies',
    location: 'Various',
    description:
      'Keep up with conferences, seminars, workshops, and training opportunities relevant to law students.',
    tags: ['Training', 'Conference', 'Networking'],
  },
  {
    id: 5,
    title: 'Community & Legal Volunteer Opportunities',
    organization: 'JULSA Community Engagement',
    category: 'Volunteer Opportunities',
    status: 'Open',
    deadline: 'Participation varies',
    location: 'Jimma & beyond',
    description:
      'Participate in volunteer initiatives, legal awareness activities, community service, and other engagement opportunities.',
    tags: ['Volunteer', 'Community', 'Service'],
  },
  {
    id: 6,
    title: 'Legal & Professional Career Opportunities',
    organization: 'JULSA Career Hub',
    category: 'Jobs',
    status: 'Open',
    deadline: 'Varies by opportunity',
    location: 'Various',
    description:
      'Explore career opportunities and professional pathways relevant to law students and graduates.',
    tags: ['Career', 'Jobs', 'Professional'],
  },
]

const categories: OpportunityCategory[] = [
  'All',
  'Internships',
  'Scholarships & Fellowships',
  'Competitions',
  'Conferences & Trainings',
  'Volunteer Opportunities',
  'Jobs',
]

const careerResources: CareerResource[] = [
  {
    title: 'CV & Resume Support',
    description:
      'Learn how to organize your education, skills, experience, achievements, and activities into a clear professional CV.',
    icon: FileText,
  },
  {
    title: 'Cover Letter Guidance',
    description:
      'Build stronger applications with practical guidance for writing focused and professional cover letters.',
    icon: Send,
  },
  {
    title: 'Interview Preparation',
    description:
      'Prepare for interviews by developing professional communication, confidence, structured answers, and presentation skills.',
    icon: MessageSquare,
  },
  {
    title: 'Professional Communication',
    description:
      'Develop the communication skills needed for applications, networking, interviews, and professional environments.',
    icon: Handshake,
  },
  {
    title: 'Internship Applications',
    description:
      'Understand how to identify relevant opportunities, prepare application materials, and approach internship applications effectively.',
    icon: Briefcase,
  },
  {
    title: 'Career Planning',
    description:
      'Reflect on your interests, strengths, goals, and possible legal career pathways as you prepare for professional life.',
    icon: Lightbulb,
  },
]

const statusStyles: Record<OpportunityStatus, string> = {
  Open: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  Upcoming: 'border-[#d4af37]/20 bg-[#d4af37]/10 text-[#e8c968]',
  Closed: 'border-white/10 bg-white/[0.05] text-slate-500',
}

export default function CareerPage() {
  const [activeCategory, setActiveCategory] =
    useState<OpportunityCategory>('All')
  const [search, setSearch] = useState('')
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null)

  const filteredOpportunities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return opportunities.filter((opportunity) => {
      const matchesCategory =
        activeCategory === 'All' || opportunity.category === activeCategory

      if (!normalizedSearch) {
        return matchesCategory
      }

      const searchableText = [
        opportunity.title,
        opportunity.organization,
        opportunity.category,
        opportunity.status,
        opportunity.location,
        opportunity.description,
        ...opportunity.tags,
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && searchableText.includes(normalizedSearch)
    })
  }, [activeCategory, search])

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>

      {/* Opportunity categories */}
      <section className='border-b border-white/10 bg-[#091625]'>
        <div className='mx-auto max-w-7xl px-6 py-5 lg:px-8'>
          <div className='flex gap-2 overflow-x-auto pb-1'>
            {categories.map((category) => (
              <button
                key={category}
                type='button'
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  activeCategory === category
                    ? 'bg-[#d4af37] text-[#07111f]'
                    : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section
        id='opportunities'
        className='mx-auto max-w-7xl px-6 py-20 lg:px-8'
      >
        <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-end'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
              Opportunity board
            </p>

            <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              Find your next opportunity.
            </h2>

            <p className='mt-3 max-w-2xl text-slate-400'>
              Explore internships, scholarships, competitions, training,
              volunteer opportunities, and career opportunities relevant to law
              students.
            </p>
          </div>

          <div className='relative w-full lg:w-80'>
            <Search
              size={18}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search opportunities...'
              className='w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50 focus:bg-white/[0.06]'
            />
          </div>
        </div>

        {filteredOpportunities.length > 0 ? (
          <div className='mt-10 grid gap-5 lg:grid-cols-2'>
            {filteredOpportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className='group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/[0.055]'
              >
                <div className='flex items-start justify-between gap-5'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10'>
                    {opportunity.category === 'Internships' && (
                      <Briefcase size={22} className='text-[#d4af37]' />
                    )}

                    {opportunity.category === 'Scholarships & Fellowships' && (
                      <Award size={22} className='text-[#d4af37]' />
                    )}

                    {opportunity.category === 'Competitions' && (
                      <Trophy size={22} className='text-[#d4af37]' />
                    )}

                    {opportunity.category === 'Conferences & Trainings' && (
                      <GraduationCap size={22} className='text-[#d4af37]' />
                    )}

                    {opportunity.category === 'Volunteer Opportunities' && (
                      <HeartIcon size={22} className='text-[#d4af37]' />
                    )}

                    {opportunity.category === 'Jobs' && (
                      <Briefcase size={22} className='text-[#d4af37]' />
                    )}
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[opportunity.status]}`}
                  >
                    {opportunity.status}
                  </span>
                </div>

                <p className='mt-6 text-xs uppercase tracking-[0.14em] text-slate-500'>
                  {opportunity.category}
                </p>

                <h3 className='mt-2 text-xl font-semibold leading-snug transition group-hover:text-[#e8c968]'>
                  {opportunity.title}
                </h3>

                <p className='mt-3 text-sm leading-6 text-slate-400'>
                  {opportunity.description}
                </p>

                <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                  <div className='flex items-center gap-2 text-xs text-slate-500'>
                    <Calendar size={15} />
                    {opportunity.deadline}
                  </div>

                  <div className='flex items-center gap-2 text-xs text-slate-500'>
                    <MapPin size={15} />
                    {opportunity.location}
                  </div>
                </div>

                <div className='mt-5 flex flex-wrap gap-2'>
                  {opportunity.tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-slate-400'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className='mt-6 border-t border-white/10 pt-5'>
                  <button
                    type='button'
                    onClick={() => setSelectedOpportunity(opportunity)}
                    className='inline-flex items-center gap-2 text-sm font-medium text-[#e8c968] transition hover:gap-3'
                  >
                    View opportunity
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className='mt-10 rounded-2xl border border-dashed border-white/10 py-16 text-center'>
            <Search size={34} className='mx-auto text-slate-600' />

            <h3 className='mt-4 text-lg font-medium'>No opportunities found</h3>

            <p className='mt-2 text-sm text-slate-500'>
              Try another search term or category.
            </p>

            <button
              type='button'
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
              }}
              className='mt-5 text-sm text-[#e8c968] hover:underline'
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Career development */}
      <section
        id='career-tools'
        className='border-y border-white/10 bg-[#091625]'
      >
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='max-w-3xl'>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
              Career development
            </p>

            <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              Prepare for the professional world.
            </h2>

            <p className='mt-4 leading-7 text-slate-400'>
              Opportunities matter, but preparation matters too. Use these
              resources to strengthen the skills and materials you need when
              applying for internships, programs, and professional
              opportunities.
            </p>
          </div>

          <div className='mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {careerResources.map((resource) => {
              const Icon = resource.icon

              return (
                <div
                  key={resource.title}
                  className='group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/[0.055]'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10'>
                    <Icon size={22} className='text-[#d4af37]' />
                  </div>

                  <h3 className='mt-6 text-xl font-semibold transition group-hover:text-[#e8c968]'>
                    {resource.title}
                  </h3>

                  <p className='mt-3 text-sm leading-6 text-slate-400'>
                    {resource.description}
                  </p>

                  <button
                    type='button'
                    className='mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#e8c968]'
                  >
                    Explore resource
                    <ChevronRight size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Career pathway */}
      <section className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
        <div className='overflow-hidden rounded-[2rem] border border-[#d4af37]/20 bg-gradient-to-br from-[#101d2d] to-[#09121f] p-8 sm:p-12'>
          <div className='grid items-center gap-12 lg:grid-cols-[1fr_1fr]'>
            <div>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10'>
                <Lightbulb size={23} className='text-[#d4af37]' />
              </div>

              <h2 className='mt-6 text-3xl font-semibold sm:text-4xl'>
                Start planning your career early.
              </h2>

              <p className='mt-4 leading-7 text-slate-400'>
                Your legal career is built through more than academic results.
                Explore opportunities, develop practical skills, build
                professional relationships, and understand the direction you
                want to take.
              </p>

              <Link
                href='/membership'
                className='mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 font-medium text-[#07111f] transition hover:bg-[#e4c45d]'
              >
                Join JULSA
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className='space-y-3'>
              {[
                {
                  number: '01',
                  title: 'Discover',
                  text: 'Find opportunities that match your interests and goals.',
                },
                {
                  number: '02',
                  title: 'Prepare',
                  text: 'Strengthen your CV, applications, communication, and interview skills.',
                },
                {
                  number: '03',
                  title: 'Connect',
                  text: 'Build relationships through networking, events, and professional activities.',
                },
                {
                  number: '04',
                  title: 'Grow',
                  text: 'Turn experiences into skills that support your future legal career.',
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className='flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4'
                >
                  <span className='pt-1 text-sm font-semibold text-[#d4af37]'>
                    {step.number}
                  </span>

                  <div>
                    <h3 className='font-medium'>{step.title}</h3>

                    <p className='mt-1 text-sm leading-6 text-slate-500'>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Networking */}
      <section className='border-t border-white/10 bg-[#050d17]'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]'>
            <div>
              <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
                Professional connection
              </p>

              <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
                Build relationships that last.
              </h2>

              <p className='mt-4 leading-7 text-slate-400'>
                JULSA&apos;s professional development vision includes networking
                with alumni, legal professionals, academic institutions, and
                other partners.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-3'>
              {[
                {
                  icon: Users,
                  title: 'Peers',
                  text: 'Learn and collaborate with fellow students.',
                },
                {
                  icon: Network,
                  title: 'Alumni',
                  text: 'Learn from graduates and build professional connections.',
                },
                {
                  icon: Briefcase,
                  title: 'Professionals',
                  text: 'Discover pathways into legal and professional environments.',
                },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className='rounded-2xl border border-white/10 bg-white/[0.03] p-5'
                  >
                    <Icon size={22} className='text-[#d4af37]' />

                    <h3 className='mt-5 font-semibold'>{item.title}</h3>

                    <p className='mt-2 text-sm leading-6 text-slate-500'>
                      {item.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity modal */}
      {selectedOpportunity && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm'
          onClick={() => setSelectedOpportunity(null)}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='opportunity-title'
            className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1726] shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='relative border-b border-white/10 p-7 sm:p-9'>
              <button
                type='button'
                onClick={() => setSelectedOpportunity(null)}
                aria-label='Close opportunity'
                className='absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white'
              >
                <X size={18} />
              </button>

              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[selectedOpportunity.status]}`}
              >
                {selectedOpportunity.status}
              </span>

              <p className='mt-5 text-xs uppercase tracking-[0.15em] text-slate-500'>
                {selectedOpportunity.category}
              </p>

              <h2
                id='opportunity-title'
                className='mt-2 pr-8 text-3xl font-semibold leading-tight'
              >
                {selectedOpportunity.title}
              </h2>

              <p className='mt-3 text-sm text-slate-500'>
                {selectedOpportunity.organization}
              </p>
            </div>

            <div className='p-7 sm:p-9'>
              <p className='leading-7 text-slate-300'>
                {selectedOpportunity.description}
              </p>

              <div className='mt-7 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <div className='flex items-center gap-2 text-xs text-slate-500'>
                    <Calendar size={15} />
                    Deadline
                  </div>

                  <p className='mt-2 text-sm text-slate-300'>
                    {selectedOpportunity.deadline}
                  </p>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <div className='flex items-center gap-2 text-xs text-slate-500'>
                    <MapPin size={15} />
                    Location
                  </div>

                  <p className='mt-2 text-sm text-slate-300'>
                    {selectedOpportunity.location}
                  </p>
                </div>
              </div>

              <div className='mt-7 flex flex-wrap gap-2'>
                {selectedOpportunity.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-slate-400'
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className='mt-8 rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/5 p-5'>
                <p className='text-sm leading-6 text-slate-400'>
                  This is currently a placeholder opportunity entry. Once JULSA
                  has real opportunity data, this section can display the
                  official application link, eligibility requirements, deadline,
                  organizer, and downloadable documents.
                </p>
              </div>

              <button
                type='button'
                onClick={() => setSelectedOpportunity(null)}
                className='mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 font-medium text-[#07111f] transition hover:bg-[#e4c45d]'
              >
                Close
                <X size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
      <LiveCollection collection='opportunities' title='Current opportunities' />
    </main>
  )
}

/**
 * Small heart icon kept local so the page does not need
 * another icon dependency beyond lucide-react.
 */
function HeartIcon({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size ?? 24}
      height={size ?? 24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden='true'
    >
      <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z' />
    </svg>
  )
}
