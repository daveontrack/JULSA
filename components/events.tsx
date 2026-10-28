import { ArrowIcon, ColumnsIcon, GavelIcon, ScalesIcon } from './icons'
import Reveal from './reveal'

const CATEGORY_ICONS = {
  moot: GavelIcon,
  debate: ColumnsIcon,
  training: ScalesIcon,
  seminar: ColumnsIcon,
} as const

const EVENTS = [
  {
    icon: 'moot',
    day: '14',
    month: 'Oct',
    title: 'Moot Court & Legal Advocacy',
    tag: 'Moot Court',
    text: 'Develop legal research, case analysis, memorial writing, and oral advocacy through practical moot court activities.',
    location: 'Jimma University · Law School',
    featured: true,
  },
  {
    icon: 'debate',
    day: '21',
    month: 'Oct',
    title: 'Debate & Public Speaking',
    tag: 'Debate',
    text: 'Strengthen critical thinking, argumentation, communication, and public speaking through student-led debate.',
    location: 'Jimma University · Law School',
    featured: false,
  },
  {
    icon: 'training',
    day: '26',
    month: 'Oct',
    title: 'Legal Research & Writing Workshop',
    tag: 'Training',
    text: 'Build stronger research and legal writing skills through practical academic training and collaborative learning.',
    location: 'Jimma University · Law School',
    featured: false,
  },
  {
    icon: 'seminar',
    day: '04',
    month: 'Nov',
    title: 'Legal Seminar & Guest Lecture',
    tag: 'Seminar',
    text: 'Learn from legal professionals and invited speakers through discussions on law, professional practice, and emerging legal issues.',
    location: 'Jimma University · Law School',
    featured: false,
  },
] as const

export default function Events() {
  const upcoming = EVENTS.filter((event) => event.featured)
  const regular = EVENTS.filter((event) => !event.featured)
  const [head, ...rest] = regular

  return (
    <section
      id='events'
      className='relative isolate scroll-mt-24 overflow-hidden bg-night-900 py-24 text-cream-50 lg:py-32'
    >
      {/* Ambient glow */}
      <div
        aria-hidden='true'
        className='absolute -right-40 top-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-gold-500/[0.08] blur-[140px]'
      />

      <div
        aria-hidden='true'
        className='absolute -left-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-gold-500/[0.04] blur-[130px]'
      />

      <div
        aria-hidden='true'
        className='absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent'
      />

      <div className='mx-auto w-full max-w-7xl px-6 lg:px-8'>
        {/* Section heading */}
        <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end'>
          <Reveal>
            <div className='inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
              <span className='h-1.5 w-1.5 rounded-full bg-gold-400' />
              JULSA Events
            </div>

            <h2 className='mt-6 font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl'>
              Learn,{' '}
              <span className='bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300 bg-clip-text text-transparent'>
                Compete
              </span>{' '}
              &amp; Connect
            </h2>

            <p className='mt-5 max-w-xl text-base leading-relaxed text-cream-100/60'>
              Discover the academic programs, competitions, trainings, seminars,
              networking opportunities, and community activities that bring the
              JULSA community together.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <a
              href='#events'
              className='group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/50 bg-gold-400/10 px-6 py-3 text-sm font-semibold text-gold-200 transition-all hover:bg-gold-400 hover:text-night-950'
            >
              View All Events
              <ArrowIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </a>
          </Reveal>
        </div>

        {/* Events */}
        <div className='mt-16 grid gap-6 lg:grid-cols-2'>
          {/* Featured event */}
          {upcoming.map((event) => {
            const Icon = CATEGORY_ICONS[event.icon]

            return (
              <Reveal
                key={event.title}
                as='article'
                className='group relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-xl hover:shadow-gold-400/10 lg:p-10'
              >
                <div
                  aria-hidden='true'
                  className='absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl opacity-70 transition-opacity group-hover:opacity-100'
                />

                <div className='relative flex flex-col gap-6 sm:flex-row'>
                  {/* Date */}
                  <div className='flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-gold-400/40 bg-night-900 text-center'>
                    <span className='font-display text-4xl font-bold leading-none text-gold-300'>
                      {event.day}
                    </span>

                    <span className='mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream-100/60'>
                      {event.month}
                    </span>
                  </div>

                  {/* Content */}
                  <div className='min-w-0'>
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-200'>
                      <Icon className='h-3.5 w-3.5' />
                      {event.tag}
                    </span>

                    <h3 className='mt-3 font-display text-2xl font-bold leading-snug text-cream-50'>
                      {event.title}
                    </h3>

                    <p className='mt-2 text-sm leading-relaxed text-cream-100/60'>
                      {event.text}
                    </p>

                    <p className='mt-4 text-xs font-medium uppercase tracking-wider text-gold-300/80'>
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className='relative mt-8 flex flex-wrap gap-3'>
            <a
              href='/members#register'
              className='group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/50 bg-gold-400/10 px-6 py-3 text-sm font-semibold text-gold-200 transition-all hover:bg-gradient-to-r hover:from-gold-300 hover:to-gold-400 hover:text-night-950 hover:scale-[1.02]'
            >
                    Join JULSA
                    <ArrowIcon className='h-4 w-4' />
                  </a>

                  <a
                    href='#events'
                    className='inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-cream-100/80 transition-colors hover:border-gold-400/50 hover:text-gold-200'
                  >
                    Learn More
                  </a>
                </div>
              </Reveal>
            )
          })}

          {/* Regular events */}
          <div className='flex flex-col gap-4'>
            {[head, ...rest].map((event, index) => {
              const Icon = CATEGORY_ICONS[event.icon]

              return (
                <Reveal
                  key={event.title}
                  as='article'
                  direction='left'
                  delay={0.08 + index * 0.08}
                  className='group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-gold-400/5'
                >
                  {/* Date */}
                  <div className='flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-gold-400/30 bg-night-900 text-center'>
                    <span className='font-display text-2xl font-bold leading-none text-gold-300'>
                      {event.day}
                    </span>

                    <span className='mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream-100/60'>
                      {event.month}
                    </span>
                  </div>

                  {/* Content */}
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <Icon className='h-4 w-4 shrink-0 text-gold-300' />

                      <span className='text-[11px] font-semibold uppercase tracking-wider text-gold-300/80'>
                        {event.tag}
                      </span>
                    </div>

                    <h3 className='mt-1 truncate font-display text-base font-bold text-cream-50'>
                      {event.title}
                    </h3>

                    <p className='mt-1 truncate text-xs text-cream-100/50'>
                      {event.location}
                    </p>
                  </div>

                  {/* Action */}
                  <a
                    href='#events'
                    aria-label={`Learn more about ${event.title}`}
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-cream-100/70 transition-all hover:border-gold-400 hover:bg-gold-400 hover:text-night-950'
                  >
                    <ArrowIcon className='h-4 w-4' />
                  </a>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Event categories */}
        <Reveal
          delay={0.25}
          className='mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-8'
        >
          <span className='text-xs font-semibold uppercase tracking-[0.18em] text-cream-100/30'>
            Explore
          </span>

          <span className='text-sm text-cream-100/50'>Moot Courts</span>

          <span className='text-gold-400/40'>•</span>

          <span className='text-sm text-cream-100/50'>Debates</span>

          <span className='text-gold-400/40'>•</span>

          <span className='text-sm text-cream-100/50'>Trainings</span>

          <span className='text-gold-400/40'>•</span>

          <span className='text-sm text-cream-100/50'>Seminars</span>

          <span className='text-gold-400/40'>•</span>

          <span className='text-sm text-cream-100/50'>Competitions</span>

          <span className='text-gold-400/40'>•</span>

          <span className='text-sm text-cream-100/50'>
            Community Engagement
          </span>
        </Reveal>
      </div>
    </section>
  )
}
