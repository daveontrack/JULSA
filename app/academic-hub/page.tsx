'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Gavel,
  GraduationCap,
  Library,
  PenLine,
  Search,
  Scale,
  X,
} from 'lucide-react'
import LiveCollection from '@/components/live-collection'

type ResourceCategory =
  | 'All'
  | 'Case Summaries'
  | 'Legal Research'
  | 'Lecture & Study'
  | 'Exam Preparation'
  | 'Legal Writing'
  | 'Moot Court'
  | 'Exit Exam'

type ResourceType = 'PDF' | 'Guide' | 'Notes' | 'Case' | 'Practice'

type Resource = {
  id: number
  title: string
  category: Exclude<ResourceCategory, 'All'>
  type: ResourceType
  description: string
  subject: string
  year: string
  icon: typeof BookOpen
  fileUrl?: string
  featured?: boolean
}

const categories: {
  label: ResourceCategory
  icon: typeof BookOpen
}[] = [
  { label: 'All', icon: Library },
  { label: 'Case Summaries', icon: Scale },
  { label: 'Legal Research', icon: Search },
  { label: 'Lecture & Study', icon: BookOpen },
  { label: 'Exam Preparation', icon: GraduationCap },
  { label: 'Legal Writing', icon: PenLine },
  { label: 'Moot Court', icon: Gavel },
  { label: 'Exit Exam', icon: FileText },
]

const resources: Resource[] = [
  {
    id: 1,
    title: 'Legal Research Fundamentals',
    category: 'Legal Research',
    type: 'Guide',
    subject: 'Legal Research',
    year: 'All Years',
    description:
      'A practical starting point for developing legal research skills, identifying relevant authorities, and organizing legal findings.',
    icon: Search,
    featured: true,
  },
  {
    id: 2,
    title: 'Case Analysis & Case Summary Guide',
    category: 'Case Summaries',
    type: 'Guide',
    subject: 'Case Analysis',
    year: 'All Years',
    description:
      'A structured guide for understanding, analyzing, and presenting important elements of a legal case.',
    icon: Scale,
    featured: true,
  },
  {
    id: 3,
    title: 'Legal Writing Fundamentals',
    category: 'Legal Writing',
    type: 'Guide',
    subject: 'Legal Writing',
    year: 'All Years',
    description:
      'Resources designed to support clear, structured, analytical, and professional legal writing.',
    icon: PenLine,
  },
  {
    id: 4,
    title: 'Moot Court Preparation Guide',
    category: 'Moot Court',
    type: 'Guide',
    subject: 'Moot Court',
    year: 'All Years',
    description:
      'Preparation material covering legal research, case analysis, memorial writing, oral advocacy, presentation, and teamwork.',
    icon: Gavel,
    featured: true,
  },
  {
    id: 5,
    title: 'Lecture & Study Materials',
    category: 'Lecture & Study',
    type: 'Notes',
    subject: 'Law',
    year: 'All Years',
    description:
      'A central space for lecture materials, study notes, and other academic resources shared with law students.',
    icon: BookOpen,
  },
  {
    id: 6,
    title: 'Exam Preparation Resources',
    category: 'Exam Preparation',
    type: 'Practice',
    subject: 'Exam Preparation',
    year: 'All Years',
    description:
      'Revision materials and study resources to help students organize their academic preparation.',
    icon: GraduationCap,
  },
  {
    id: 7,
    title: 'Exit Exam Preparation Hub',
    category: 'Exit Exam',
    type: 'Practice',
    subject: 'Exit Exam',
    year: 'All Years',
    description:
      'A dedicated space for exit exam preparation resources, revision materials, practice questions, and study support.',
    icon: GraduationCap,
  },
  {
    id: 8,
    title: 'Legal Research & Writing Resources',
    category: 'Legal Research',
    type: 'PDF',
    subject: 'Research & Writing',
    year: 'All Years',
    description:
      'Academic resources supporting legal research, analysis, writing, and critical thinking.',
    icon: FileText,
  },
]

const quickAccess = [
  {
    title: 'Case Summaries',
    description: 'Understand cases through structured summaries and analysis.',
    icon: Scale,
    category: 'Case Summaries' as ResourceCategory,
  },
  {
    title: 'Legal Research',
    description: 'Build stronger legal research and analytical skills.',
    icon: Search,
    category: 'Legal Research' as ResourceCategory,
  },
  {
    title: 'Study Materials',
    description: 'Find lecture and study materials in one place.',
    icon: BookOpen,
    category: 'Lecture & Study' as ResourceCategory,
  },
  {
    title: 'Exam Preparation',
    description: 'Prepare and organize your revision effectively.',
    icon: GraduationCap,
    category: 'Exam Preparation' as ResourceCategory,
  },
]

export default function AcademicHubPage() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('All')

  const [searchQuery, setSearchQuery] = useState('')

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  )

  const [showFilters, setShowFilters] = useState(false)

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return resources.filter((resource) => {
      const categoryMatch =
        activeCategory === 'All' || resource.category === activeCategory

      const searchMatch =
        query.length === 0 ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.subject.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query)

      return categoryMatch && searchMatch
    })
  }, [activeCategory, searchQuery])

  const featuredResources = resources.filter((resource) => resource.featured)

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>
      <section className='border-b border-white/10 bg-[#091525]'>
        <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8'>
          <div className='mb-9'>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
              Quick Access
            </p>

            <h2 className='mt-3 font-serif text-3xl font-semibold sm:text-4xl'>
              Start with what you need
            </h2>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {quickAccess.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.title}
                  type='button'
                  onClick={() => setActiveCategory(item.category)}
                  className='group text-left rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/[0.05]'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]'>
                      <Icon className='h-5 w-5' />
                    </div>

                    <ArrowRight className='h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-[#d4af37]' />
                  </div>

                  <h3 className='mt-5 font-semibold text-white'>
                    {item.title}
                  </h3>

                  <p className='mt-2 text-sm leading-6 text-slate-500'>
                    {item.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED RESOURCES
      ========================================================= */}
      <section className='border-b border-white/10'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
                Featured
              </p>

              <h2 className='mt-3 font-serif text-4xl font-semibold'>
                Start learning
              </h2>
            </div>

            <a
              href='#resources'
              className='group inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37]'
            >
              View all resources
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </a>
          </div>

          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {featuredResources.map((resource) => {
              const Icon = resource.icon

              return (
                <button
                  key={resource.id}
                  type='button'
                  onClick={() => setSelectedResource(resource)}
                  className='group text-left rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37]'>
                      <Icon className='h-5 w-5' />
                    </div>

                    <span className='rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500'>
                      {resource.type}
                    </span>
                  </div>

                  <h3 className='mt-7 text-xl font-semibold text-white'>
                    {resource.title}
                  </h3>

                  <p className='mt-3 text-sm leading-6 text-slate-400'>
                    {resource.description}
                  </p>

                  <div className='mt-7 flex items-center gap-2 text-sm font-semibold text-[#d4af37]'>
                    Explore resource
                    <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          RESOURCE LIBRARY
      ========================================================= */}
      <section id='resources' className='border-b border-white/10 bg-[#091525]'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='max-w-2xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
              Resource Library
            </p>

            <h2 className='mt-3 font-serif text-4xl font-semibold sm:text-5xl'>
              Find what you need
            </h2>

            <p className='mt-5 leading-7 text-slate-400'>
              Browse academic resources by category or search for a specific
              topic.
            </p>
          </div>

          {/* Search */}
          <div className='mt-10 flex flex-col gap-4 lg:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500' />

              <input
                type='text'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search academic resources...'
                className='w-full rounded-2xl border border-white/10 bg-[#07111f] py-4 pl-14 pr-5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50'
              />
            </div>

            <button
              type='button'
              onClick={() => setShowFilters((current) => !current)}
              className='inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#07111f] px-6 py-4 text-sm font-medium text-slate-300 transition hover:border-[#d4af37]/30 hover:text-white lg:hidden'
            >
              <Filter className='h-4 w-4' />
              Categories
            </button>
          </div>

          {/* Categories */}
          <div
            className={`mt-6 flex gap-2 overflow-x-auto pb-2 ${
              showFilters ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {categories.map((category) => {
              const Icon = category.icon
              const active = activeCategory === category.label

              return (
                <button
                  key={category.label}
                  type='button'
                  onClick={() => {
                    setActiveCategory(category.label)
                    setShowFilters(false)
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'border-[#d4af37] bg-[#d4af37] text-[#07111f]'
                      : 'border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  {category.label}
                </button>
              )
            })}
          </div>

          {/* Results */}
          <div className='mt-10'>
            <div className='mb-5 flex items-center justify-between'>
              <p className='text-sm text-slate-500'>
                {filteredResources.length}{' '}
                {filteredResources.length === 1 ? 'resource' : 'resources'}{' '}
                available
              </p>

              {activeCategory !== 'All' && (
                <button
                  type='button'
                  onClick={() => setActiveCategory('All')}
                  className='text-sm text-[#d4af37] hover:text-[#e6c65c]'
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              {filteredResources.map((resource) => {
                const Icon = resource.icon

                return (
                  <article
                    key={resource.id}
                    className='group rounded-2xl border border-white/10 bg-[#07111f] p-6 transition duration-300 hover:border-[#d4af37]/30'
                  >
                    <div className='flex gap-5'>
                      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]'>
                        <Icon className='h-5 w-5' />
                      </div>

                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]'>
                            {resource.category}
                          </span>

                          <span className='text-slate-700'>•</span>

                          <span className='text-[10px] uppercase tracking-wider text-slate-600'>
                            {resource.type}
                          </span>
                        </div>

                        <h3 className='mt-2 text-lg font-semibold text-white'>
                          {resource.title}
                        </h3>

                        <p className='mt-2 text-sm leading-6 text-slate-500'>
                          {resource.description}
                        </p>

                        <div className='mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-600'>
                          <span>{resource.subject}</span>
                          <span>{resource.year}</span>
                        </div>

                        <button
                          type='button'
                          onClick={() => setSelectedResource(resource)}
                          className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37]'
                        >
                          View resource
                          <ChevronRight className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {filteredResources.length === 0 && (
              <div className='rounded-2xl border border-dashed border-white/10 py-20 text-center'>
                <Search className='mx-auto h-10 w-10 text-slate-700' />

                <h3 className='mt-5 font-semibold text-white'>
                  No resources found
                </h3>

                <p className='mt-2 text-sm text-slate-500'>
                  Try another search term or category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          MOOT COURT
      ========================================================= */}
      <section className='border-b border-white/10'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]'>
            <div>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]'>
                <Gavel className='h-6 w-6' />
              </div>

              <p className='mt-7 text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]'>
                Moot Court Resources
              </p>

              <h2 className='mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl'>
                Turn legal knowledge into
                <span className='text-[#d4af37]'> practice.</span>
              </h2>

              <p className='mt-5 leading-7 text-slate-400'>
                Build the practical skills needed for moot court and legal
                advocacy through focused resources and preparation materials.
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              {[
                'Legal Research',
                'Legal Reasoning',
                'Memorial Writing',
                'Oral Advocacy',
                'Case Analysis',
                'Presentation',
                'Teamwork',
                'Professional Ethics',
              ].map((skill, index) => (
                <div
                  key={skill}
                  className='flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-4'
                >
                  <span className='font-mono text-xs text-[#d4af37]'>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className='text-sm font-medium text-slate-300'>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          EXIT EXAM
      ========================================================= */}
      <section id='exit-exam' className='relative overflow-hidden bg-[#091525]'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(212,175,55,0.1),transparent_35%)]' />

        <div className='relative mx-auto max-w-7xl px-6 py-24 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]'>
            <div>
              <span className='inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#e6c65c]'>
                <GraduationCap className='h-4 w-4' />
                Exit Exam Hub
              </span>

              <h2 className='mt-6 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl'>
                Prepare with
                <span className='text-[#d4af37]'> purpose.</span>
              </h2>

              <p className='mt-6 max-w-2xl text-lg leading-8 text-slate-400'>
                A dedicated area for exit exam preparation resources, revision
                materials, practice questions, and study support.
              </p>

              <div className='mt-8 flex flex-wrap gap-3'>
                {[
                  'Revision Materials',
                  'Practice Questions',
                  'Study Resources',
                  'Preparation Guides',
                ].map((item) => (
                  <span
                    key={item}
                    className='rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300'
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className='rounded-3xl border border-white/10 bg-white/[0.035] p-7 sm:p-8'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]'>
                <GraduationCap className='h-6 w-6' />
              </div>

              <h3 className='mt-6 font-serif text-2xl font-semibold'>
                Your preparation starts here.
              </h3>

              <p className='mt-3 text-sm leading-6 text-slate-500'>
                Resources can be organized here as the JULSA academic library
                grows.
              </p>

              <button
                type='button'
                onClick={() => {
                  setActiveCategory('Exit Exam')

                  window.setTimeout(() => {
                    document
                      .getElementById('resources')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }, 0)
                }}
                className='group mt-7 inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 font-semibold text-[#07111f] transition hover:bg-[#e6c65c]'
              >
                Explore Exit Exam Resources
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTRIBUTE CTA
      ========================================================= */}
      <section className='border-t border-white/10 bg-[#d4af37] text-[#07111f]'>
        <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8'>
          <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm font-bold uppercase tracking-[0.25em] opacity-60'>
                Build the Library
              </p>

              <h2 className='mt-3 font-serif text-3xl font-semibold sm:text-4xl'>
                Knowledge grows when we share it.
              </h2>

              <p className='mt-4 max-w-xl leading-7 opacity-75'>
                Help strengthen the JULSA academic community by contributing
                useful academic materials and resources.
              </p>
            </div>

            <a
              href='/contact'
              className='group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#07111f] px-7 py-4 font-semibold text-white transition hover:bg-[#102238]'
            >
              Contact JULSA
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          RESOURCE MODAL
      ========================================================= */}
      {selectedResource && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm'
          onClick={() => setSelectedResource(null)}
        >
          <div
            className='relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#091525] shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              onClick={() => setSelectedResource(null)}
              aria-label='Close resource details'
              className='absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='bg-[#d4af37] p-8 text-[#07111f] sm:p-10'>
              <div className='flex items-start gap-5'>
                <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07111f] text-[#d4af37]'>
                  <selectedResource.icon className='h-6 w-6' />
                </div>

                <div className='pr-8'>
                  <p className='text-xs font-bold uppercase tracking-[0.2em] opacity-60'>
                    {selectedResource.category}
                  </p>

                  <h2 className='mt-2 font-serif text-2xl font-semibold sm:text-3xl'>
                    {selectedResource.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className='p-8 sm:p-10'>
              <p className='leading-7 text-slate-300'>
                {selectedResource.description}
              </p>

              <div className='mt-7 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <p className='text-xs uppercase tracking-wider text-slate-600'>
                    Subject
                  </p>

                  <p className='mt-1 text-sm text-white'>
                    {selectedResource.subject}
                  </p>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
                  <p className='text-xs uppercase tracking-wider text-slate-600'>
                    Resource Type
                  </p>

                  <p className='mt-1 text-sm text-white'>
                    {selectedResource.type}
                  </p>
                </div>
              </div>

              <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                {selectedResource.fileUrl ? (
                  <a
                    href={selectedResource.fileUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3.5 font-semibold text-[#07111f] transition hover:bg-[#e6c65c]'
                  >
                    <Download className='h-4 w-4' />
                    Open Resource
                  </a>
                ) : (
                  <div className='inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm text-slate-400'>
                    <FileText className='h-4 w-4' />
                    Resource coming soon
                  </div>
                )}

                <button
                  type='button'
                  onClick={() => setSelectedResource(null)}
                  className='rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <LiveCollection collection='academic-resources' title='Latest academic resources' />
    </main>
  )
}
