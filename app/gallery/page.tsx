'use client'

import Image from 'next/image'
import LiveCollection from '@/components/live-collection'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Expand,
  Image as ImageIcon,
  Search,
  X,
} from 'lucide-react'

type GalleryCategory =
  | 'All'
  | 'Leadership'
  | 'Moot Court'
  | 'Debate'
  | 'Trainings'
  | 'Seminars'
  | 'Community Engagement'
  | 'Competitions'
  | 'Partnerships'
  | 'Celebrations'
  | 'Special Events'

type GalleryItem = {
  id: number
  title: string
  category: Exclude<GalleryCategory, 'All'>
  description: string
  image: string
  date: string
}

const categories: GalleryCategory[] = [
  'All',
  'Leadership',
  'Moot Court',
  'Debate',
  'Trainings',
  'Seminars',
  'Community Engagement',
  'Competitions',
  'Partnerships',
  'Celebrations',
  'Special Events',
]

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'JULSA Leadership',
    category: 'Leadership',
    description:
      'Moments from JULSA leadership activities and student representation.',
    image: '/gallery/leadership.jpg',
    date: 'Leadership',
  },
  {
    id: 2,
    title: 'Moot Court Advocacy',
    category: 'Moot Court',
    description:
      'Students developing legal research, reasoning and oral advocacy skills.',
    image: '/gallery/moot-court.jpg',
    date: 'Moot Court',
  },
  {
    id: 3,
    title: 'Legal Debate',
    category: 'Debate',
    description:
      'Students engaging in structured debate and public speaking activities.',
    image: '/gallery/debate.jpg',
    date: 'Debate',
  },
  {
    id: 4,
    title: 'Academic Training',
    category: 'Trainings',
    description:
      'Academic and professional development sessions for law students.',
    image: '/gallery/training.jpg',
    date: 'Training',
  },
  {
    id: 5,
    title: 'Legal Seminar',
    category: 'Seminars',
    description:
      'Seminars and academic discussions focused on law and legal practice.',
    image: '/gallery/seminar.jpg',
    date: 'Seminar',
  },
  {
    id: 6,
    title: 'Community Engagement',
    category: 'Community Engagement',
    description:
      'JULSA students participating in community-focused activities and service.',
    image: '/gallery/community.jpg',
    date: 'Community',
  },
  {
    id: 7,
    title: 'Student Competition',
    category: 'Competitions',
    description:
      'Students putting their legal knowledge and advocacy skills into practice.',
    image: '/gallery/competition.jpg',
    date: 'Competition',
  },
  {
    id: 8,
    title: 'Institutional Partnership',
    category: 'Partnerships',
    description:
      'Moments from collaborations with academic and professional partners.',
    image: '/gallery/partnership.jpg',
    date: 'Partnership',
  },
  {
    id: 9,
    title: 'JULSA Celebration',
    category: 'Celebrations',
    description:
      'Celebrating achievements, milestones and the JULSA community.',
    image: '/gallery/celebration.jpg',
    date: 'Celebration',
  },
  {
    id: 10,
    title: 'Special Event',
    category: 'Special Events',
    description:
      'Memorable moments from special JULSA activities and gatherings.',
    image: '/gallery/special-event.jpg',
    date: 'Special Event',
  },
  {
    id: 11,
    title: 'Academic Community',
    category: 'Trainings',
    description:
      'Students learning together through academic and professional sessions.',
    image: '/gallery/academic-session.jpg',
    date: 'Academic',
  },
  {
    id: 12,
    title: 'Advocacy & Leadership',
    category: 'Leadership',
    description:
      'Building confidence, leadership and professional responsibility.',
    image: '/gallery/advocacy.jpg',
    date: 'Leadership',
  },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return galleryItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const selectedIndex = selectedImage
    ? filteredItems.findIndex((item) => item.id === selectedImage.id)
    : -1

  const showPrevious = () => {
    if (selectedIndex === -1 || filteredItems.length === 0) return

    const previousIndex =
      selectedIndex === 0 ? filteredItems.length - 1 : selectedIndex - 1

    setSelectedImage(filteredItems[previousIndex])
  }

  const showNext = () => {
    if (selectedIndex === -1 || filteredItems.length === 0) return

    const nextIndex =
      selectedIndex === filteredItems.length - 1 ? 0 : selectedIndex + 1

    setSelectedImage(filteredItems[nextIndex])
  }

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>
      {/* Compact heading */}
      <section className='relative overflow-hidden border-b border-white/10'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.12),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(30,64,175,0.12),transparent_30%)]' />

        <div className='relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-8 lg:px-10 lg:pb-14'>
          <div className='max-w-3xl'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e5c45b]'>
              <Camera className='h-3.5 w-3.5' />
              JULSA Gallery
            </div>

            <h1 className='text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl'>
              Moments that tell the
              <span className='block text-[#d4af37]'>JULSA story.</span>
            </h1>

            <p className='mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg'>
              Explore moments from leadership, moot court, debates, academic
              activities, competitions, community engagement and the wider JULSA
              community.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery controls */}
      <section className='border-b border-white/10 bg-[#081421]/80'>
        <div className='mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            {/* Search */}
            <div className='relative w-full lg:max-w-sm'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500' />

              <input
                type='text'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search gallery...'
                className='h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50 focus:bg-white/[0.06]'
              />
            </div>

            {/* Count */}
            <div className='flex items-center gap-2 text-sm text-slate-500'>
              <ImageIcon className='h-4 w-4' />
              <span>
                {filteredItems.length}{' '}
                {filteredItems.length === 1 ? 'memory' : 'memories'}
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className='mt-5 overflow-x-auto pb-1'>
            <div className='flex min-w-max gap-2'>
              {categories.map((category) => {
                const isActive = activeCategory === category

                return (
                  <button
                    key={category}
                    type='button'
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      isActive
                        ? 'border-[#d4af37] bg-[#d4af37] text-[#07111f]'
                        : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-[#d4af37]/40 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className='mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
        {filteredItems.length > 0 ? (
          <div className='columns-1 gap-5 sm:columns-2 lg:columns-3'>
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                type='button'
                onClick={() => setSelectedImage(item)}
                className='group relative mb-5 block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b1828] text-left shadow-xl shadow-black/10 break-inside-avoid'
                aria-label={`Open ${item.title}`}
              >
                <div
                  className={`relative overflow-hidden ${
                    index % 3 === 0
                      ? 'aspect-[4/5]'
                      : index % 3 === 1
                        ? 'aspect-[4/3]'
                        : 'aspect-square'
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover transition duration-700 group-hover:scale-105'
                  />

                  {/* Image overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-[#020812] via-transparent to-transparent opacity-80' />

                  <div className='absolute inset-x-0 bottom-0 p-5'>
                    <div className='mb-2 inline-flex rounded-full border border-[#d4af37]/30 bg-[#07111f]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#e5c45b] backdrop-blur-md'>
                      {item.category}
                    </div>

                    <h2 className='text-lg font-bold text-white'>
                      {item.title}
                    </h2>

                    <p className='mt-1 line-clamp-2 text-xs leading-5 text-slate-300'>
                      {item.description}
                    </p>
                  </div>

                  {/* Expand icon */}
                  <div className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100'>
                    <Expand className='h-4 w-4' />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className='flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center'>
            <div className='mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10'>
              <Camera className='h-7 w-7 text-[#d4af37]' />
            </div>

            <h2 className='text-xl font-bold text-white'>
              No gallery items found
            </h2>

            <p className='mt-2 max-w-md text-sm leading-6 text-slate-500'>
              Try another search term or choose a different gallery category.
            </p>

            <button
              type='button'
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className='mt-6 rounded-xl bg-[#d4af37] px-5 py-2.5 text-sm font-bold text-[#07111f] transition hover:bg-[#e5c45b]'
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Community CTA */}
      <section className='mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10'>
        <div className='relative overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-gradient-to-br from-[#0e1d30] to-[#091321] p-7 sm:p-10 lg:p-12'>
          <div className='absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl' />

          <div className='relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between'>
            <div className='max-w-2xl'>
              <span className='text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]'>
                Our Story
              </span>

              <h2 className='mt-3 text-2xl font-bold sm:text-3xl'>
                Every moment becomes part of the JULSA story.
              </h2>

              <p className='mt-3 text-sm leading-6 text-slate-400'>
                From the classroom to advocacy, every activity contributes to a
                community of students learning, leading, serving and growing
                together.
              </p>
            </div>

            <div className='flex shrink-0 items-center gap-3'>
              <a
                href='/events'
                className='inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#07111f] transition hover:bg-[#e5c45b]'
              >
                Explore Events
                <ArrowRight className='h-4 w-4' />
              </a>

              <a
                href='/about'
                className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#d4af37]/30 hover:bg-white/[0.07]'
              >
                About JULSA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className='fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm'
          role='dialog'
          aria-modal='true'
          aria-label={selectedImage.title}
          onClick={() => setSelectedImage(null)}
        >
          {/* Close */}
          <button
            type='button'
            onClick={() => setSelectedImage(null)}
            className='absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20'
            aria-label='Close image viewer'
          >
            <X className='h-5 w-5' />
          </button>

          {/* Previous */}
          {filteredItems.length > 1 && (
            <button
              type='button'
              onClick={(event) => {
                event.stopPropagation()
                showPrevious()
              }}
              className='absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:bg-white/10 sm:left-7'
              aria-label='Previous image'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
          )}

          {/* Next */}
          {filteredItems.length > 1 && (
            <button
              type='button'
              onClick={(event) => {
                event.stopPropagation()
                showNext()
              }}
              className='absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:bg-white/10 sm:right-7'
              aria-label='Next image'
            >
              <ChevronRight className='h-6 w-6' />
            </button>
          )}

          <div
            className='relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#081421] shadow-2xl'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='relative min-h-[45vh] flex-1 sm:min-h-[65vh]'>
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                sizes='100vw'
                className='object-contain'
              />
            </div>

            <div className='border-t border-white/10 bg-[#081421] px-5 py-4 sm:px-7'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <div className='mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37]'>
                    {selectedImage.category}
                  </div>

                  <h3 className='text-lg font-bold text-white'>
                    {selectedImage.title}
                  </h3>
                </div>

                <div className='text-xs text-slate-500'>
                  {selectedIndex + 1} / {filteredItems.length}
                </div>
              </div>

              <p className='mt-2 max-w-3xl text-sm leading-6 text-slate-400'>
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
      <LiveCollection collection='gallery' title='Recent gallery items' />
    </main>
  )
}
