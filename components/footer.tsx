import { ScalesIcon } from './icons'
import { NAV_LINKS } from './links'
import Reveal from './reveal'

const PROGRAM_LINKS = [
  { label: 'Moot Court', href: '#moot-court' },
  { label: 'Legal Aid Clinic', href: '#legal-aid' },
  { label: 'Research Journal', href: '#journal' },
  { label: 'Student Welfare', href: '#welfare' },
]

const CONTACT = {
  location: 'Faculty of Law, Jimma University, Jimma, Ethiopia',
  email: 'julsa@ju.edu.et',
  phone: '+251 47 111 0000',
}

const SOCIALS = [
  {
    label: 'Telegram',
    href: 'https://t.me/julsa',
    path: 'M11.94 2A9.94 9.94 0 1 0 21.87 11.9 9.94 9.94 0 0 0 11.94 2Zm4.77 7.08c-.22 1.35-1.12 4.63-1.58 6.14-.2.62-.57.82-.94.7-.65-.2-1.02-.66-1.58-1.29-.44-.5-.87-.97-1.31-1.29-.88-.63-1.42-.55-2.06.26l-.32.43c-.23.3-.5.53-1 .42-.7-.22-1.41-.43-2.04-.58-.44-.11-.77-.33-.88-.63-.11-.4.14-.62.55-.76 1.6-.7 3.24-1.42 4.84-2.17a2.9 2.9 0 0 1 3.06.32c.3.21.46.46.35.6Zm1.6 2.54a9.55 9.55 0 0 1-.3 1.5 4.5 4.5 0 0 0-.25.92c.1-.05.27-.28.34-.35a11.6 11.6 0 0 0 .76-1.03.38.38 0 0 0-.55-.44v-.6Z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/julsa',
    path: 'M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-3.26-.16-4.77-1.7-4.92-4.93C2.1 15.58 2.1 15.2 2.1 12s0-3.58.07-4.85C2.32 3.92 3.84 2.4 7.09 2.26 8.4 2.2 8.8 2.2 12 2.2Zm0 3.68a6.13 6.13 0 1 0 6.12 6.12A6.12 6.12 0 0 0 12 5.88Zm0 10.1a3.98 3.98 0 1 1 3.98-3.98 3.98 3.98 0 0 1-3.98 3.98Zm6.4-11.72a1.43 1.43 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z',
  },
  {
    label: 'X',
    href: 'https://x.com/julsa',
    path: 'M18.9 2.1h3.68l-8.04 9.2L24 22.9h-7.41l-5.8-7.59L4.15 22.9H.46l8.6-9.83L-.4 2.1h7.6l5.24 6.93ZM17.6 20.8h2.04L6.44 4.1H4.23Z',
  },
]

export default function Footer() {
  return (
    <footer className='relative isolate scroll-mt-24 overflow-hidden bg-gradient-to-b from-night-950 to-night-950 text-cream-50'>
      <div
        aria-hidden='true'
        className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent'
      />
      <div
        aria-hidden='true'
        className='absolute -left-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-gold-500/6 blur-[120px]'
      />

      <div className='mx-auto w-full max-w-7xl px-6 pb-10 pt-20 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]'>
          {/* Brand */}
          <Reveal direction='left'>
            <a href='#' className='group flex items-center gap-3'>
              <span className='flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/40 bg-gold-400/10 text-gold-300 transition-colors group-hover:bg-gold-400/20'>
                <ScalesIcon className='h-6 w-6' />
              </span>
              <span className='flex flex-col leading-tight'>
                <span className='font-display text-lg font-bold tracking-wide text-cream-50'>
                  JULSA
                </span>
                <span className='text-[11px] uppercase tracking-[0.18em] text-gold-300/90'>
                  Faculty of Law
                </span>
              </span>
            </a>
            <p className='mt-6 max-w-sm text-sm leading-relaxed text-cream-100/60'>
              The Jimma University Law Students&rsquo; Association &mdash;
              equipping future advocates, judges, and human rights defenders
              with the voice to pursue justice.
            </p>
            <div className='mt-7 flex items-center gap-3'>
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.label}
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream-100/70 transition-all hover:border-gold-400/50 hover:bg-gold-400 hover:text-night-950'
                >
                  <svg
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='h-4.5 w-4.5'
                    aria-hidden='true'
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Explore */}
          <Reveal delay={0.1}>
            <h4 className='text-xs font-semibold uppercase tracking-[0.22em] text-gold-300'>
              Explore
            </h4>
            <ul className='mt-6 space-y-3.5'>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className='text-sm text-cream-100/70 transition-colors hover:text-gold-200'
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Programs */}
          <Reveal delay={0.16}>
            <h4 className='text-xs font-semibold uppercase tracking-[0.22em] text-gold-300'>
              Programs
            </h4>
            <ul className='mt-6 space-y-3.5'>
              {PROGRAM_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className='text-sm text-cream-100/70 transition-colors hover:text-gold-200'
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.22}>
            <h4 className='text-xs font-semibold uppercase tracking-[0.22em] text-gold-300'>
              Contact
            </h4>
            <ul className='mt-6 space-y-4 text-sm text-cream-100/70'>
              <li className='flex gap-3'>
                <span
                  className='mt-0.5 h-4 w-4 shrink-0 text-gold-300'
                  aria-hidden='true'
                >
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
                    <circle cx='12' cy='10' r='3' />
                  </svg>
                </span>
                <span>{CONTACT.location}</span>
              </li>
              <li className='flex gap-3'>
                <span
                  className='mt-0.5 h-4 w-4 shrink-0 text-gold-300'
                  aria-hidden='true'
                >
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z' />
                  </svg>
                </span>
                <span>{CONTACT.email}</span>
              </li>
              <li className='flex gap-3'>
                <span
                  className='mt-0.5 h-4 w-4 shrink-0 text-gold-300'
                  aria-hidden='true'
                >
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z' />
                  </svg>
                </span>
                <span>{CONTACT.phone}</span>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <Reveal
          delay={0.3}
          className='mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row'
        >
          <p className='text-xs text-cream-100/45'>
            &copy; {new Date().getFullYear()} Jimma University Law
            Students&rsquo; Association. All rights reserved.
          </p>
          <p className='text-xs uppercase tracking-[0.18em] text-cream-100/45'>
            <span className='text-gold-300/80'>Equi</span> &middot;{' '}
            <span className='text-gold-300/80'>Justi</span> &middot;{' '}
            <span className='text-gold-300/80'>Veritas</span>
          </p>
        </Reveal>
      </div>
    </footer>
  )
}
