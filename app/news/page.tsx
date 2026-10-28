'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import LiveCollection from '@/components/live-collection'
import {
  ArrowRight,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Megaphone,
  Newspaper,
  Search,
  Trophy,
  Users,
  X,
} from 'lucide-react'

type NewsCategory =
  | 'All'
  | 'JULSA Updates'
  | 'Academic News'
  | 'Competition Results'
  | 'Opportunities'
  | 'Partnerships'
  | 'Student Achievements'
  | 'University & Law School Updates'

type NewsType = 'Announcement' | 'News' | 'Result' | 'Update'

interface NewsItem {
  id: number
  title: string
  excerpt: string
  category: Exclude<NewsCategory, 'All'>
  type: NewsType
  date: string
  readTime: string
  featured?: boolean
  tags: string[]
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'JULSA Academic, Advocacy and Student Activities',
    excerpt:
      'Stay informed about academic activities, advocacy programs, student engagement, seminars, trainings, and other JULSA initiatives.',
    category: 'JULSA Updates',
    type: 'Announcement',
    date: 'JULSA Update',
    readTime: '3 min read',
    featured: true,
    tags: ['JULSA', 'Activities', 'Students'],
  },
  {
    id: 2,
    title: 'Academic Programs, Seminars and Legal Trainings',
    excerpt:
      'Updates about academic programs, legal research activities, seminars, guest lectures, workshops, and other learning opportunities.',
    category: 'Academic News',
    type: 'News',
    date: 'Academic Update',
    readTime: '4 min read',
    tags: ['Academic', 'Training', 'Research'],
  },
  {
    id: 3,
    title: 'Moot Court and Student Competition Updates',
    excerpt:
      'Follow JULSA moot court, debate, advocacy, and other student competition announcements and results.',
    category: 'Competition Results',
    type: 'Result',
    date: 'Competition Update',
    readTime: '3 min read',
    tags: ['Moot Court', 'Competition', 'Advocacy'],
  },
  {
    id: 4,
    title: 'New Career and Student Opportunities',
    excerpt:
      'Discover internships, scholarships, fellowships, conferences, trainings, volunteer opportunities, and career opportunities.',
    category: 'Opportunities',
    type: 'Announcement',
    date: 'Opportunity Update',
    readTime: '4 min read',
    tags: ['Career', 'Internship', 'Opportunities'],
  },
  {
    id: 5,
    title: 'JULSA Partnerships and Institutional Connections',
    excerpt:
      'News about collaboration and engagement with the university, law school, alumni, legal professionals, academic institutions, and other partners.',
    category: 'Partnerships',
    type: 'Update',
    date: 'Partnership Update',
    readTime: '3 min read',
    tags: ['Partnerships', 'Networking', 'Collaboration'],
  },
  {
    id: 6,
    title: 'Celebrating Student Achievements',
    excerpt:
      'Recognizing student achievements, academic contributions, competition participation, leadership, and other accomplishments.',
    category: 'Student Achievements',
    type: 'News',
    date: 'Student News',
    readTime: '3 min read',
    tags: ['Students', 'Achievements', 'Leadership'],
  },
  {
    id: 7,
    title: 'Jimma University Law School Updates',
    excerpt:
      'Relevant university and law school updates that are important to JULSA members and the wider law student community.',
    category: 'University & Law School Updates',
    type: 'Update',
    date: 'University Update',
    readTime: '3 min read',
    tags: ['University', 'Law School', 'Students'],
  },
]

const categories: NewsCategory[] = [
  'All',
  'JULSA Updates',
  'Academic News',
  'Competition Results',
  'Opportunities',
  'Partnerships',
  'Student Achievements',
  'University & Law School Updates',
]

const categoryIcons: Record<Exclude<NewsCategory, 'All'>, typeof Bell> = {
  'JULSA Updates': Bell,
  'Academic News': Newspaper,
  'Competition Results': Trophy,
  Opportunities: Megaphone,
  Partnerships: Users,
  'Student Achievements': Trophy,
  'University & Law School Updates': Newspaper,
}

const typeStyles: Record<NewsType, string> = {
  Announcement: 'border-[#d4af37]/20 bg-[#d4af37]/10 text-[#e8c968]',
  News: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
  Result: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  Update: 'border-white/10 bg-white/[0.05] text-slate-400',
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All')
  const [search, setSearch] = useState('')
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  const filteredNews = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return newsItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory

      if (!normalizedSearch) {
        return matchesCategory
      }

      const searchableText = [
        item.title,
        item.excerpt,
        item.category,
        item.type,
        item.date,
        ...item.tags,
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && searchableText.includes(normalizedSearch)
    })
  }, [activeCategory, search])

  const featuredNews = newsItems.find((item) => item.featured) ?? newsItems[0]

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>
      {/* Page heading */}
      <section className='border-b border-white/10 bg-[#091625]'>
        <div className='mx-auto max-w-7xl px-6 pb-10 pt-28 lg:px-8'>
          <div className='flex flex-col justify-between gap-7 lg:flex-row lg:items-end'>
            <div className='max-w-3xl'>
              <div className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#d4af37]'>
                <Bell size={17} />
                Announcements & News
              </div>

              <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
                Stay informed with JULSA.
              </h1>

              <p className='mt-4 max-w-2xl leading-7 text-slate-400'>
                Follow the latest JULSA announcements, academic news,
                competition updates, opportunities, partnerships, and student
                achievements.
              </p>
            </div>

            <div className='flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400'>
              <Megaphone size={17} className='text-[#d4af37]' />
              Learn what&apos;s happening
            </div>
          </div>
        </div>
      </section>

      {/* Featured announcement */}
      <section className='mx-auto max-w-7xl px-6 pt-12 lg:px-8'>
        <div className='overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-gradient-to-br from-[#101d2d] to-[#09121f]'>
          <div className='grid lg:grid-cols-[1.35fr_0.65fr]'>
            <div className='p-7 sm:p-9 lg:p-10'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-medium text-[#e8c968]'>
                  <Bell size={13} />
                  Featured Announcement
                </span>

                <span className='text-xs text-slate-500'>
                  {featuredNews.category}
                </span>
              </div>

              <h2 className='mt-5 max-w-3xl text-2xl font-semibold leading-tight sm:text-3xl'>
                {featuredNews.title}
              </h2>

              <p className='mt-4 max-w-2xl leading-7 text-slate-400'>
                {featuredNews.excerpt}
              </p>

              <button
                type='button'
                onClick={() => setSelectedNews(featuredNews)}
                className='mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#e8c968] transition hover:gap-3'
              >
                Read announcement
                <ArrowRight size={16} />
              </button>
            </div>

            <div className='relative hidden min-h-[260px] overflow-hidden border-l border-white/10 bg-white/[0.025] lg:block'>
              <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl' />

              <div className='absolute bottom-8 left-8 right-8'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10'>
                  <Newspaper size={30} className='text-[#d4af37]' />
                </div>

                <p className='mt-5 text-sm text-slate-500'>JULSA</p>

                <p className='mt-1 text-lg font-medium'>News & Updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className='mx-auto max-w-7xl px-6 pt-12 lg:px-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
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

          <div className='relative w-full shrink-0 lg:w-80'>
            <Search
              size={18}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search news...'
              className='w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50'
            />
          </div>
        </div>
      </section>

      {/* News grid */}
      <section className='mx-auto max-w-7xl px-6 py-12 lg:px-8'>
        {filteredNews.length > 0 ? (
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {filteredNews.map((item) => {
              const Icon = categoryIcons[item.category]

              return (
                <article
                  key={item.id}
                  className='group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/[0.055]'
                >
                  {/* News image placeholder */}
                  <div className='relative flex h-44 items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0d1d30] to-[#07111f]'>
                    <div className='absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#d4af37]/10 blur-2xl' />

                    <Icon
                      size={48}
                      strokeWidth={1.2}
                      className='relative text-[#d4af37]/75 transition duration-300 group-hover:scale-110'
                    />

                    <span
                      className={`absolute left-5 top-5 rounded-full border px-3 py-1.5 text-xs font-medium ${typeStyles[item.type]}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <div className='flex flex-1 flex-col p-6'>
                    <div className='flex items-center gap-2 text-xs text-slate-500'>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h2 className='mt-3 text-xl font-semibold leading-snug transition group-hover:text-[#e8c968]'>
                      {item.title}
                    </h2>

                    <p className='mt-3 line-clamp-3 text-sm leading-6 text-slate-400'>
                      {item.excerpt}
                    </p>

                    <div className='mt-5 flex flex-wrap gap-2'>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className='rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-slate-500'
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className='mt-auto border-t border-white/10 pt-5'>
                      <div className='flex items-center gap-2 text-xs text-slate-500'>
                        <Calendar size={14} />
                        {item.date}
                      </div>

                      <button
                        type='button'
                        onClick={() => setSelectedNews(item)}
                        className='mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#e8c968] transition hover:gap-3'
                      >
                        Read more
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className='rounded-2xl border border-dashed border-white/10 py-16 text-center'>
            <Search size={34} className='mx-auto text-slate-600' />

            <h3 className='mt-4 text-lg font-medium'>No news found</h3>

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

      {/* Quick links */}
      <section className='border-y border-white/10 bg-[#091625]'>
        <div className='mx-auto max-w-7xl px-6 py-14 lg:px-8'>
          <div className='grid gap-4 md:grid-cols-3'>
            <Link
              href='/academic-hub'
              className='group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#d4af37]/30 hover:bg-white/[0.05]'
            >
              <Newspaper size={22} className='text-[#d4af37]' />

              <h3 className='mt-5 font-semibold'>Academic Hub</h3>

              <p className='mt-2 text-sm leading-6 text-slate-500'>
                Explore academic resources, research materials, and study
                support.
              </p>

              <span className='mt-5 inline-flex items-center gap-2 text-sm text-[#e8c968]'>
                Explore
                <ChevronRight size={16} />
              </span>
            </Link>

            <Link
              href='/moot-court'
              className='group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#d4af37]/30 hover:bg-white/[0.05]'
            >
              <Trophy size={22} className='text-[#d4af37]' />

              <h3 className='mt-5 font-semibold'>Moot Court & Competitions</h3>

              <p className='mt-2 text-sm leading-6 text-slate-500'>
                Follow competitions, advocacy activities, preparation, and
                student participation.
              </p>

              <span className='mt-5 inline-flex items-center gap-2 text-sm text-[#e8c968]'>
                Explore
                <ChevronRight size={16} />
              </span>
            </Link>

            <Link
              href='/career'
              className='group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#d4af37]/30 hover:bg-white/[0.05]'
            >
              <Megaphone size={22} className='text-[#d4af37]' />

              <h3 className='mt-5 font-semibold'>Career & Opportunities</h3>

              <p className='mt-2 text-sm leading-6 text-slate-500'>
                Find internships, scholarships, competitions, trainings, and
                career opportunities.
              </p>

              <span className='mt-5 inline-flex items-center gap-2 text-sm text-[#e8c968]'>
                Explore
                <ChevronRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom statement */}
      <section className='bg-[#050d17]'>
        <div className='mx-auto max-w-4xl px-6 py-16 text-center lg:px-8'>
          <Bell size={23} className='mx-auto text-[#d4af37]' />

          <h2 className='mt-5 text-2xl font-semibold sm:text-3xl'>
            Stay connected with JULSA.
          </h2>

          <p className='mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500'>
            Follow the latest developments across academic activities,
            competitions, opportunities, partnerships, and the JULSA community.
          </p>
        </div>
      </section>

      {/* News modal */}
      {selectedNews && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm'
          onClick={() => setSelectedNews(null)}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='news-title'
            className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1726] shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='relative border-b border-white/10 p-7 sm:p-9'>
              <button
                type='button'
                onClick={() => setSelectedNews(null)}
                aria-label='Close news'
                className='absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white'
              >
                <X size={18} />
              </button>

              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${typeStyles[selectedNews.type]}`}
              >
                {selectedNews.type}
              </span>

              <p className='mt-5 text-xs uppercase tracking-[0.15em] text-slate-500'>
                {selectedNews.category}
              </p>

              <h2
                id='news-title'
                className='mt-2 pr-8 text-3xl font-semibold leading-tight'
              >
                {selectedNews.title}
              </h2>

              <div className='mt-5 flex flex-wrap gap-4 text-sm text-slate-500'>
                <span className='inline-flex items-center gap-2'>
                  <Calendar size={15} />
                  {selectedNews.date}
                </span>

                <span className='inline-flex items-center gap-2'>
                  <Clock size={15} />
                  {selectedNews.readTime}
                </span>
              </div>
            </div>

            <div className='p-7 sm:p-9'>
              <p className='text-base leading-8 text-slate-300'>
                {selectedNews.excerpt}
              </p>

              <div className='my-8 h-px bg-white/10' />

              <div className='rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/5 p-5'>
                <p className='text-sm leading-6 text-slate-400'>
                  This announcement area is ready to be connected to the JULSA
                  news system. Once real news is added, this view can display
                  the complete announcement, images, publication date,
                  attachments, related news, and official links.
                </p>
              </div>

              <div className='mt-7 flex flex-wrap gap-2'>
                {selectedNews.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-slate-400'
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                type='button'
                onClick={() => setSelectedNews(null)}
                className='mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10'
              >
                Close
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <LiveCollection collection='news' title='Latest JULSA news' />
    </main>
  )
}
