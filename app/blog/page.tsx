'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import LiveCollection from '@/components/live-collection'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Newspaper,
  PenLine,
  Search,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react'

type PostCategory =
  | 'All'
  | 'Legal Analysis'
  | 'Law & Society'
  | 'Student Voices'
  | 'Academic Corner'
  | 'JULSA Updates'

type PostType = 'Article' | 'News' | 'Magazine' | 'Event Report'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: Exclude<PostCategory, 'All'>
  type: PostType
  author: string
  date: string
  readTime: string
  featured?: boolean
  tags: string[]
}

interface Publication {
  id: number
  title: string
  description: string
  edition: string
  type: string
  pages: number
  published: string
}

const posts: BlogPost[] = [
  {
    id: 1,
    title:
      'Understanding the Role of Legal Education in Building Ethical Professionals',
    excerpt:
      'An academic reflection on how legal education can develop strong legal reasoning, professional responsibility, and a commitment to justice.',
    category: 'Academic Corner',
    type: 'Article',
    author: 'JULSA Academic Affairs',
    date: 'Academic Publication',
    readTime: '6 min read',
    featured: true,
    tags: ['Legal Education', 'Professionalism', 'Students'],
  },
  {
    id: 2,
    title: 'The Importance of Student Participation in Legal Advocacy',
    excerpt:
      'Exploring how moot courts, debates, legal writing, and public speaking help law students develop practical advocacy skills.',
    category: 'Legal Analysis',
    type: 'Article',
    author: 'JULSA',
    date: 'Legal Analysis',
    readTime: '5 min read',
    tags: ['Advocacy', 'Moot Court', 'Legal Skills'],
  },
  {
    id: 3,
    title: 'Law Students and Their Role in Community Legal Awareness',
    excerpt:
      'A student perspective on community engagement, legal awareness, service, and the responsibility of future legal professionals.',
    category: 'Law & Society',
    type: 'Article',
    author: 'JULSA Student Voice',
    date: 'Law & Society',
    readTime: '7 min read',
    tags: ['Community', 'Legal Awareness', 'Service'],
  },
  {
    id: 4,
    title: 'Developing Strong Legal Research and Writing Skills',
    excerpt:
      'Practical academic guidance for students developing research, analysis, citation, and legal writing skills.',
    category: 'Academic Corner',
    type: 'Article',
    author: 'JULSA',
    date: 'Academic Resource',
    readTime: '8 min read',
    tags: ['Research', 'Writing', 'Academic Skills'],
  },
  {
    id: 5,
    title: 'Inside JULSA: Learning, Advocacy, Leadership and Service',
    excerpt:
      "A look at the activities and student experiences that shape the work of the Jimma University Law Students' Association.",
    category: 'Student Voices',
    type: 'Article',
    author: 'JULSA Student Voice',
    date: 'Student Voices',
    readTime: '5 min read',
    tags: ['JULSA', 'Students', 'Leadership'],
  },
  {
    id: 6,
    title: 'JULSA Academic and Advocacy Activities',
    excerpt:
      'Updates and reports from academic trainings, legal research activities, advocacy programs, seminars, and student competitions.',
    category: 'JULSA Updates',
    type: 'News',
    author: 'JULSA Communications',
    date: 'JULSA Update',
    readTime: '4 min read',
    tags: ['JULSA Updates', 'Activities'],
  },
]

const publications: Publication[] = [
  {
    id: 1,
    title: 'JULSA Annual Magazine',
    description:
      'An annual collection of legal articles, student experiences, academic contributions, interviews, creative writing, event reports, reflections, achievements, and alumni experiences.',
    edition: 'Annual Edition',
    type: 'Magazine',
    pages: 0,
    published: 'Annual Publication',
  },
  {
    id: 2,
    title: 'Student Legal Writing Collection',
    description:
      'A curated collection of student contributions covering legal analysis, research, academic reflections, and student perspectives.',
    edition: 'Student Edition',
    type: 'Publication',
    pages: 0,
    published: 'Student Publication',
  },
  {
    id: 3,
    title: 'JULSA Event Reports',
    description:
      'Reports documenting seminars, moot courts, debates, trainings, competitions, community engagement, and other association activities.',
    edition: 'Activity Reports',
    type: 'Report Collection',
    pages: 0,
    published: 'JULSA Publications',
  },
]

const categories: PostCategory[] = [
  'All',
  'Legal Analysis',
  'Law & Society',
  'Student Voices',
  'Academic Corner',
  'JULSA Updates',
]

const categoryIcons: Record<Exclude<PostCategory, 'All'>, typeof FileText> = {
  'Legal Analysis': FileText,
  'Law & Society': Users,
  'Student Voices': PenLine,
  'Academic Corner': GraduationCap,
  'JULSA Updates': Newspaper,
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<PostCategory>('All')
  const [search, setSearch] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory

      if (!normalizedSearch) {
        return matchesCategory
      }

      const searchableContent = [
        post.title,
        post.excerpt,
        post.category,
        post.type,
        post.author,
        ...post.tags,
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && searchableContent.includes(normalizedSearch)
    })
  }, [activeCategory, search])

  const featuredPost = posts.find((post) => post.featured) ?? posts[0]

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>

      {/* Category strip */}
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

      {/* Articles */}
      <section id='articles' className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
        <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-end'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
              Latest thinking
            </p>

            <h2 className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
              Articles & Stories
            </h2>

            <p className='mt-3 max-w-2xl text-slate-400'>
              Read contributions from students and the association across legal
              analysis, academic development, society, and student life.
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
              placeholder='Search articles...'
              className='w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50 focus:bg-white/[0.06]'
            />
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {filteredPosts.map((post) => {
              const Icon = categoryIcons[post.category]

              return (
                <article
                  key={post.id}
                  className='group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/[0.055]'
                >
                  <div className='relative flex h-48 items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0d1d30] to-[#07111f]'>
                    <div className='absolute left-6 top-6 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1.5 text-xs text-[#e8c968]'>
                      {post.type}
                    </div>

                    <div className='absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#d4af37]/10 blur-2xl' />

                    <Icon
                      size={54}
                      strokeWidth={1.2}
                      className='relative text-[#d4af37]/80 transition duration-300 group-hover:scale-110'
                    />
                  </div>

                  <div className='flex flex-1 flex-col p-6'>
                    <div className='flex items-center gap-2 text-xs text-slate-500'>
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className='mt-3 text-xl font-semibold leading-snug transition group-hover:text-[#e8c968]'>
                      {post.title}
                    </h3>

                    <p className='mt-3 line-clamp-3 text-sm leading-6 text-slate-400'>
                      {post.excerpt}
                    </p>

                    <div className='mt-5 flex flex-wrap gap-2'>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className='rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-slate-400'
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className='mt-auto pt-6'>
                      <div className='mb-5 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-slate-500'>
                        <PenLine size={14} />
                        {post.author}
                      </div>

                      <button
                        type='button'
                        onClick={() => setSelectedPost(post)}
                        className='inline-flex items-center gap-2 text-sm font-medium text-[#e8c968] transition hover:gap-3'
                      >
                        Read article
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className='mt-10 rounded-2xl border border-dashed border-white/10 py-16 text-center'>
            <Search size={34} className='mx-auto text-slate-600' />
            <h3 className='mt-4 text-lg font-medium'>No articles found</h3>
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

      {/* Publication section */}
      <section
        id='publications'
        className='border-y border-white/10 bg-[#091625]'
      >
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='grid gap-12 lg:grid-cols-[0.8fr_1.2fr]'>
            <div>
              <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
                Publications
              </p>

              <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
                Preserve the work.
                <span className='block text-[#d4af37]'>
                  Share the knowledge.
                </span>
              </h2>

              <p className='mt-5 max-w-xl leading-7 text-slate-400'>
                JULSA publications bring together legal scholarship, student
                experiences, interviews, event reports, creative contributions,
                achievements, and alumni perspectives.
              </p>

              <div className='mt-8 rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6'>
                <div className='flex items-start gap-4'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10'>
                    <Newspaper size={21} className='text-[#d4af37]' />
                  </div>

                  <div>
                    <h3 className='font-semibold'>JULSA Annual Magazine</h3>

                    <p className='mt-2 text-sm leading-6 text-slate-400'>
                      An annual publication celebrating academic contributions,
                      student voices, interviews, event reports, reflections,
                      achievements, and alumni experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              {publications.map((publication) => (
                <div
                  key={publication.id}
                  className='group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-[#d4af37]/25 hover:bg-white/[0.055]'
                >
                  <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
                    <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10'>
                      <FileText size={28} className='text-[#d4af37]' />
                    </div>

                    <div className='flex-1'>
                      <div className='flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                        <span>{publication.type}</span>
                        <span>•</span>
                        <span>{publication.edition}</span>
                      </div>

                      <h3 className='mt-1 text-xl font-semibold transition group-hover:text-[#e8c968]'>
                        {publication.title}
                      </h3>

                      <p className='mt-2 text-sm leading-6 text-slate-400'>
                        {publication.description}
                      </p>
                    </div>

                    <button
                      type='button'
                      className='inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-[#d4af37]/30 hover:text-[#e8c968]'
                    >
                      View
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Write / contribute */}
      <section className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
        <div className='relative overflow-hidden rounded-[2rem] border border-[#d4af37]/20 bg-gradient-to-br from-[#101d2d] to-[#09121f] p-8 sm:p-12'>
          <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl' />

          <div className='relative grid items-center gap-10 lg:grid-cols-[1fr_auto]'>
            <div>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10'>
                <PenLine size={23} className='text-[#d4af37]' />
              </div>

              <h2 className='text-3xl font-semibold sm:text-4xl'>
                Have something worth sharing?
              </h2>

              <p className='mt-4 max-w-2xl leading-7 text-slate-400'>
                JULSA encourages student contributions that support academic
                discussion, legal writing, research, reflection, and the sharing
                of student experiences.
              </p>
            </div>

            <Link
              href='/contact'
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 font-medium text-[#07111f] transition hover:bg-[#e4c45d]'
            >
              Contribute to JULSA
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className='border-t border-white/10 bg-[#050d17]'>
        <div className='mx-auto max-w-4xl px-6 py-16 text-center lg:px-8'>
          <Tag size={22} className='mx-auto text-[#d4af37]' />

          <h2 className='mt-5 text-2xl font-semibold sm:text-3xl'>
            Learn. Advocate. Lead. Serve.
          </h2>

          <p className='mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500'>
            A space for legal knowledge, student voices, academic contribution,
            and the continuing story of JULSA.
          </p>
        </div>
      </section>

      {/* Article modal */}
      {selectedPost && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm'
          onClick={() => setSelectedPost(null)}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='article-title'
            className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1726] shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='relative border-b border-white/10 p-7 sm:p-9'>
              <button
                type='button'
                onClick={() => setSelectedPost(null)}
                aria-label='Close article'
                className='absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white'
              >
                <X size={18} />
              </button>

              <span className='inline-flex rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1.5 text-xs text-[#e8c968]'>
                {selectedPost.category}
              </span>

              <h2
                id='article-title'
                className='mt-5 pr-8 text-3xl font-semibold leading-tight sm:text-4xl'
              >
                {selectedPost.title}
              </h2>

              <div className='mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500'>
                <span className='inline-flex items-center gap-2'>
                  <PenLine size={15} />
                  {selectedPost.author}
                </span>

                <span className='inline-flex items-center gap-2'>
                  <Clock size={15} />
                  {selectedPost.readTime}
                </span>

                <span className='inline-flex items-center gap-2'>
                  <Calendar size={15} />
                  {selectedPost.date}
                </span>
              </div>
            </div>

            <div className='p-7 sm:p-9'>
              <p className='text-base leading-8 text-slate-300'>
                {selectedPost.excerpt}
              </p>

              <div className='my-8 h-px bg-white/10' />

              <p className='leading-8 text-slate-400'>
                This article space is ready to be connected to the JULSA
                publication system. Once articles are stored in Supabase, the
                full article body, author information, publication date,
                featured image, downloadable resources, and related articles can
                be displayed here.
              </p>

              <div className='mt-8 flex flex-wrap gap-2'>
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-slate-400'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <LiveCollection collection='blog-posts' title='Latest blog posts' />
    </main>
  )
}
