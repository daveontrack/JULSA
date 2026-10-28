'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from './links'
import { ScalesIcon } from './icons'
import Image from 'next/image'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Prevent body scrolling while mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const getHref = (href: string) => {
    if (href.startsWith('#') && pathname !== '/') {
      return `/${href}`
    }

    return href
  }

  const joinHref = '/#join'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'border-b border-white/10 bg-night-950/95 shadow-lg shadow-black/40 backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-night-950/60 to-transparent backdrop-blur-md'
      }`}
    >
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8'>
        {/* Logo */}
        <Link
          href='/'
          className='group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3'
        >
          <Image
            src='/logo.jpg'
            alt='JULSA Logo'
            width={40}
            height={40}
            className='h-10 w-10 rounded-full object-cover'
          />

          <span className='flex min-w-0 flex-col leading-tight'>
            <span className='truncate font-display text-base font-bold tracking-wide text-cream-50 sm:text-lg'>
              JULSA
            </span>

            <span className='hidden text-[10px] uppercase tracking-[0.16em] text-gold-300/90 xs:block sm:text-[11px] sm:tracking-[0.18em]'>
              Faculty of Law
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden items-center gap-6 lg:flex xl:gap-8'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={getHref(link.href)}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-gold-300'
                  : 'text-cream-100/70 hover:text-gold-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Join Button */}
        <Link
          href={joinHref}
          className='hidden shrink-0 rounded-full border border-gold-400/50 bg-gold-400/10 px-5 py-2.5 text-sm font-semibold text-gold-200 transition-all hover:bg-gradient-to-r hover:from-gold-300 hover:to-gold-400 hover:text-night-950 hover:scale-[1.02] lg:inline-flex'
        >
          Join Us
        </Link>

        {/* Mobile Actions */}
        <div className='flex items-center gap-2 lg:hidden'>
          <Link
            href={joinHref}
            className='hidden rounded-full bg-gradient-to-r from-gold-300 to-gold-400 px-4 py-2 text-xs font-semibold text-night-950 transition-all hover:from-gold-200 hover:to-gold-300 hover:scale-[1.02] sm:inline-flex'
          >
            Join Us
          </Link>

          <button
            type='button'
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cream-50 transition-all hover:border-gold-400/40 hover:bg-gold-400/10 hover:text-gold-300'
          >
            {mobileOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-night-950/98 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileOpen
            ? 'max-h-[calc(100vh-65px)] opacity-100'
            : 'max-h-0 border-t-transparent opacity-0'
        }`}
      >
        <div className='mx-auto max-w-7xl overflow-y-auto px-4 py-5 sm:px-6'>
          <nav className='flex flex-col gap-1'>
            {NAV_LINKS.map((link) => {
              const href = getHref(link.href)
              const isActive =
                pathname === link.href ||
                (link.href === '/' && pathname === '/')

              return (
                <Link
                  key={link.href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-400/10 text-gold-300'
                      : 'text-cream-100/75 hover:bg-white/5 hover:text-gold-300'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Join CTA */}
          <div className='mt-4 border-t border-white/10 pt-4'>
            <Link
              href={joinHref}
              onClick={() => setMobileOpen(false)}
              className='flex w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-gold-400 px-5 py-3 text-sm font-semibold text-night-950 transition-all hover:from-gold-200 hover:to-gold-300'
            >
              Join JULSA
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
