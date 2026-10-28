import { ColumnsIcon, GavelIcon, ScalesIcon, UsersIcon } from './icons'
import Reveal from './reveal'

const PILLARS = [
  {
    icon: ScalesIcon,
    title: 'Academic Excellence',
    text: 'Strengthen legal knowledge through academic programs, research, case analysis, study resources, and meaningful peer learning.',
  },
  {
    icon: GavelIcon,
    title: 'Practical Legal Skills',
    text: 'Develop practical advocacy skills through moot courts, legal writing, debate, public speaking, and hands-on legal training.',
  },
  {
    icon: UsersIcon,
    title: 'Leadership & Development',
    text: 'Create opportunities for students to grow as ethical leaders through mentorship, responsibility, collaboration, and student-led initiatives.',
  },
  {
    icon: ColumnsIcon,
    title: 'Professional Connection',
    text: 'Connect law students with professionals, alumni, institutions, opportunities, and networks that support their future legal careers.',
  },
]

export default function About({
  standalone = false,
}: {
  standalone?: boolean
}) {
  const Heading = standalone ? 'h1' : 'h2'

  return (
    <section
      id='about'
      aria-labelledby='about-title'
      className='relative isolate scroll-mt-24 overflow-hidden bg-night-950 py-24 text-cream-50 lg:py-32'
    >
      {/* Ambient glow */}
      <div
        aria-hidden='true'
        className='absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-gold-500/[0.07] blur-[120px]'
      />

      <div
        aria-hidden='true'
        className='absolute left-0 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-500/[0.04] blur-[100px]'
      />

      <div
        aria-hidden='true'
        className='absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent'
      />

      <div className='mx-auto w-full max-w-7xl px-6 lg:px-8'>
        <div className='grid items-start gap-16 lg:grid-cols-[1fr_1.1fr]'>
          {/* Narrative */}
          <Reveal direction='left'>
            <div className='inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
              <span className='h-1.5 w-1.5 rounded-full bg-gold-400' />
              About JULSA
            </div>

            <Heading
              id='about-title'
              className='mt-6 font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl'
            >
              Where We Build{' '}
              <span className='bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300 bg-clip-text text-transparent'>
                Tomorrow&rsquo;s
              </span>{' '}
              Legal Minds
            </Heading>

            <p className='mt-7 max-w-xl text-lg leading-relaxed text-cream-100/70'>
              The Jimma University Law Students&rsquo; Association is a
              student-led association committed to empowering law students
              through academic excellence, practical legal skills, leadership,
              professional development, advocacy, and meaningful community
              engagement.
            </p>

            <p className='mt-5 max-w-xl text-base leading-relaxed text-cream-100/60'>
              JULSA creates spaces where students can learn beyond the
              classroom, strengthen their legal abilities, connect with
              professionals and peers, take part in advocacy and competitions,
              and contribute meaningfully to their communities.
            </p>

            {/* Mission / Vision */}
            <div className='mt-10 rounded-2xl border border-gold-400/25 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 backdrop-blur'>
              <div className='flex items-center gap-3'>
                <span className='h-px w-10 bg-gold-400/60' />

                <span className='text-xs font-medium uppercase tracking-[0.18em] text-cream-100/50'>
                  Our Mission
                </span>
              </div>

              <p className='mt-5 font-display text-xl italic leading-relaxed text-gold-200'>
                &ldquo;To empower law students through academic excellence,
                practical legal skills, leadership development, professional
                networking, advocacy, and meaningful community
                engagement.&rdquo;
              </p>

              <div className='mt-7 border-t border-white/10 pt-6'>
                <span className='text-xs font-medium uppercase tracking-[0.18em] text-cream-100/40'>
                  Our Vision
                </span>

                <p className='mt-3 text-sm leading-relaxed text-cream-100/60'>
                  To become a leading law students&rsquo; association that
                  nurtures competent, ethical, innovative, and socially
                  responsible future legal professionals.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Pillars */}
          <div>
            <Reveal delay={0.1} className='mb-6'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300/80'>
                What We Do
              </p>

              <p className='mt-2 max-w-lg text-sm leading-relaxed text-cream-100/50'>
                From academic development to professional connection, JULSA
                brings together opportunities that help law students learn,
                advocate, lead, and serve.
              </p>
            </Reveal>

            <div className='grid gap-5 sm:grid-cols-2'>
              {PILLARS.map((pillar, index) => (
                <Reveal
                  key={pillar.title}
                  delay={0.12 + index * 0.08}
                  className='group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-gold-400/5'
                >
                  <span className='flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-400/10 text-gold-300 transition-colors duration-300 group-hover:bg-gold-400 group-hover:text-night-950'>
                    <pillar.icon className='h-6 w-6' />
                  </span>

                  <h3 className='mt-6 font-display text-xl font-bold text-cream-50'>
                    {pillar.title}
                  </h3>

                  <p className='mt-3 text-sm leading-relaxed text-cream-100/60'>
                    {pillar.text}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Secondary principle */}
            <Reveal
              delay={0.35}
              className='mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5'
            >
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <span className='text-xs font-semibold uppercase tracking-[0.2em] text-cream-100/40'>
                  Our Way Forward
                </span>

                <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-gold-200'>
                  <span>Learn</span>
                  <span className='text-gold-400/40'>•</span>
                  <span>Advocate</span>
                  <span className='text-gold-400/40'>•</span>
                  <span>Lead</span>
                  <span className='text-gold-400/40'>•</span>
                  <span>Serve</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
