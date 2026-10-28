'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Handshake,
  Heart,
  Mail,
  Network,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'

interface Benefit {
  title: string
  description: string
  icon: typeof BookOpen
}

interface FAQ {
  question: string
  answer: string
}

const benefits: Benefit[] = [
  {
    title: 'Academic Development',
    description:
      'Access academic activities, research discussions, legal writing opportunities, study resources, and peer learning.',
    icon: BookOpen,
  },
  {
    title: 'Practical Legal Skills',
    description:
      'Develop practical skills through moot courts, debates, legal advocacy, public speaking, and related activities.',
    icon: Scale,
  },
  {
    title: 'Professional Development',
    description:
      'Connect with opportunities that support career planning, internships, professional communication, and future development.',
    icon: Briefcase,
  },
  {
    title: 'Leadership Opportunities',
    description:
      'Take part in association activities and develop leadership, teamwork, responsibility, and organizational skills.',
    icon: Trophy,
  },
  {
    title: 'Networking',
    description:
      'Build meaningful connections with fellow students, alumni, legal professionals, academic institutions, and partners.',
    icon: Network,
  },
  {
    title: 'Community Engagement',
    description:
      'Participate in legal awareness, community service, volunteer initiatives, and other engagement activities.',
    icon: Heart,
  },
]

const membershipRequirements = [
  'Full name',
  'Student ID',
  'Year of study',
  'Phone number',
  'Email address',
]

const faqs: FAQ[] = [
  {
    question: 'Who can register as a JULSA member?',
    answer:
      "Membership registration is intended for law students connected with Jimma University. The association's membership process can be used to collect the required student information.",
  },
  {
    question: 'What information is required for registration?',
    answer:
      'The membership requirements identify full name, student ID, year of study, phone number, and email address as the information collected during registration.',
  },
  {
    question: 'What can members participate in?',
    answer:
      "Members can engage with JULSA's academic, advocacy, leadership, networking, professional development, competition, and community engagement activities.",
  },
  {
    question: 'Will members have an online dashboard?',
    answer:
      'A Member Dashboard is identified as a future feature for JULSA. The current registration section can therefore be designed to support a future member account system.',
  },
]

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const idempotencyKey = useRef<string | null>(null)
  const idempotencyPayload = useRef<string | null>(null)

  useEffect(() => {
    if (window.location.hash !== '#register') return
    window.requestAnimationFrame(() => {
      document.getElementById('register')?.scrollIntoView({ block: 'start' })
    })
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = event.currentTarget
    const formData = new FormData(form)
    const values: Record<string, string | boolean> = {}
    formData.forEach((value, key) => {
      if (typeof value === 'string') values[key] = value
    })
    values.consent = formData.has('consent')
    const payload = JSON.stringify(values)
    if (!idempotencyKey.current || idempotencyPayload.current !== payload) {
      idempotencyKey.current = crypto.randomUUID()
      idempotencyPayload.current = payload
    }
    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, idempotencyKey: idempotencyKey.current }),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || 'We could not submit your application. Please try again.')
      }
      setSubmitted(true)
      idempotencyKey.current = null
      idempotencyPayload.current = null
      form.reset()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Please try again later.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#07111f] text-white'>
      {/* Why membership */}
      <section id='benefits' className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
        <div className='max-w-3xl'>
          <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
            Why join JULSA?
          </p>

          <h2 className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
            Membership is more than a registration.
          </h2>

          <p className='mt-4 leading-7 text-slate-400'>
            It is an opportunity to learn with others, strengthen practical
            legal skills, develop professionally, contribute to the student
            community, and grow into a responsible future legal professional.
          </p>
        </div>

        <div className='mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <div
                key={benefit.title}
                className='group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:bg-white/[0.055]'
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10'>
                  <Icon size={22} className='text-[#d4af37]' />
                </div>

                <h3 className='mt-6 text-xl font-semibold transition group-hover:text-[#e8c968]'>
                  {benefit.title}
                </h3>

                <p className='mt-3 text-sm leading-6 text-slate-400'>
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Membership journey */}
      <section className='border-y border-white/10 bg-[#091625]'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8'>
          <div className='text-center'>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
              Your journey
            </p>

            <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              From registration to participation.
            </h2>
          </div>

          <div className='mt-14 grid gap-6 md:grid-cols-4'>
            {[
              {
                number: '01',
                title: 'Register',
                text: 'Submit your student information through the membership form.',
                icon: GraduationCap,
              },
              {
                number: '02',
                title: 'Connect',
                text: 'Become part of a community of law students and future legal professionals.',
                icon: Handshake,
              },
              {
                number: '03',
                title: 'Participate',
                text: 'Take part in academic, advocacy, competition, leadership, and community activities.',
                icon: Users,
              },
              {
                number: '04',
                title: 'Grow',
                text: 'Build practical skills, professional connections, and leadership experience.',
                icon: Award,
              },
            ].map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.number}
                  className='relative rounded-2xl border border-white/10 bg-white/[0.03] p-6'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-semibold text-[#d4af37]'>
                      {step.number}
                    </span>

                    <Icon size={21} className='text-slate-500' />
                  </div>

                  <h3 className='mt-8 text-xl font-semibold'>{step.title}</h3>

                  <p className='mt-3 text-sm leading-6 text-slate-400'>
                    {step.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id='register' className='scroll-mt-24 mx-auto max-w-7xl px-6 py-20 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-[0.75fr_1.25fr]'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
              Membership registration
            </p>

            <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              Start your JULSA journey.
            </h2>

            <p className='mt-5 leading-7 text-slate-400'>
              Provide the required student information to begin the membership
              registration process.
            </p>

            <div className='mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-6'>
              <div className='flex items-center gap-3'>
                <GraduationCap size={21} className='text-[#d4af37]' />
                <h3 className='font-semibold'>Information required</h3>
              </div>

              <div className='mt-5 space-y-3'>
                {membershipRequirements.map((requirement) => (
                  <div
                    key={requirement}
                    className='flex items-center gap-3 text-sm text-slate-400'
                  >
                    <CheckCircle2 size={16} className='text-[#d4af37]' />
                    {requirement}
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-5 rounded-2xl border border-[#d4af37]/15 bg-[#d4af37]/5 p-6'>
              <p className='text-sm leading-6 text-slate-400'>
                Your details are submitted securely for the JULSA membership process.
              </p>
            </div>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl sm:p-8'>
            {submitted ? (
              <div className='flex min-h-[520px] flex-col items-center justify-center text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10'>
                  <CheckCircle2 size={32} className='text-[#d4af37]' />
                </div>

                <h3 className='mt-6 text-2xl font-semibold'>
                  Registration received
                </h3>

                <p className='mt-3 max-w-md text-sm leading-6 text-slate-400'>
                  Your application has been securely received. JULSA will follow
                  up using the contact details you provided.
                </p>

                <button
                  type='button'
                  onClick={() => { setSubmitted(false); setError('') }}
                  className='mt-7 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10'
                >
                  Submit another registration
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div aria-hidden='true' className='absolute -left-[10000px] h-px w-px overflow-hidden'>
                  <label htmlFor='membership-website'>Leave this field empty</label>
                  <input id='membership-website' name='website' type='text' tabIndex={-1} autoComplete='off' />
                </div>
                <div>
                  <label
                    htmlFor='fullName'
                    className='mb-2 block text-sm font-medium text-slate-300'
                  >
                    Full name
                  </label>

                  <input
                    id='fullName'
                    name='fullName'
                    type='text'
                    required
                    placeholder='Enter your full name'
                    className='w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50'
                  />
                </div>

                <div className='grid gap-5 sm:grid-cols-2'>
                  <div>
                    <label
                      htmlFor='studentId'
                      className='mb-2 block text-sm font-medium text-slate-300'
                    >
                      Student ID
                    </label>

                    <input
                      id='studentId'
                      name='studentId'
                      type='text'
                      required
                      placeholder='Student ID'
                      className='w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='year'
                      className='mb-2 block text-sm font-medium text-slate-300'
                    >
                      Year of study
                    </label>

                    <select
                      id='year'
                      name='year'
                      required
                      defaultValue=''
                      className='w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]/50'
                    >
                      <option value='' disabled>
                        Select year
                      </option>
                      <option value='1'>Year 1</option>
                      <option value='2'>Year 2</option>
                      <option value='3'>Year 3</option>
                      <option value='4'>Year 4</option>
                      <option value='5'>Year 5</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='phone'
                    className='mb-2 block text-sm font-medium text-slate-300'
                  >
                    Phone number
                  </label>

                  <div className='relative'>
                    <Phone
                      size={17}
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-600'
                    />

                    <input
                      id='phone'
                      name='phone'
                      type='tel'
                      required
                      placeholder='Phone number'
                      className='w-full rounded-xl border border-white/10 bg-[#07111f] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='mb-2 block text-sm font-medium text-slate-300'
                  >
                    Email address
                  </label>

                  <div className='relative'>
                    <Mail
                      size={17}
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-600'
                    />

                    <input
                      id='email'
                      name='email'
                      type='email'
                      required
                      placeholder='student@example.com'
                      className='w-full rounded-xl border border-white/10 bg-[#07111f] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#d4af37]/50'
                    />
                  </div>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.025] p-4'>
                  <label className='flex cursor-pointer items-start gap-3'>
                    <input
                      type='checkbox'
                      name='consent'
                      required
                      className='mt-1 h-4 w-4 accent-[#d4af37]'
                    />

                    <span className='text-xs leading-5 text-slate-500'>
                      I confirm that the information provided is accurate and
                      that I am submitting this information for JULSA membership
                      registration.
                    </span>
                  </label>
                </div>

                {error && <p role='alert' className='text-sm text-red-300'>{error}</p>}

                <button
                  type='submit'
                  disabled={pending}
                  className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3.5 font-medium text-[#07111f] transition hover:bg-[#e4c45d]'
                >
                  {pending ? 'Submitting…' : 'Submit Membership Registration'}
                  <Send size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='border-t border-white/10 bg-[#091625]'>
        <div className='mx-auto max-w-4xl px-6 py-20 lg:px-8'>
          <div className='text-center'>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-[#d4af37]'>
              Membership FAQ
            </p>

            <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              Common questions
            </h2>
          </div>

          <div className='mt-10 space-y-3'>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index

              return (
                <div
                  key={faq.question}
                  className='overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]'
                >
                  <button
                    type='button'
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className='flex w-full items-center justify-between gap-5 px-6 py-5 text-left'
                    aria-expanded={isOpen}
                  >
                    <span className='font-medium text-white'>
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={19}
                      className={`shrink-0 text-[#d4af37] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className='border-t border-white/10 px-6 pb-6 pt-4'>
                      <p className='text-sm leading-7 text-slate-400'>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='border-t border-white/10 bg-[#050d17]'>
        <div className='mx-auto max-w-4xl px-6 py-16 text-center lg:px-8'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10'>
            <Users size={25} className='text-[#d4af37]' />
          </div>

          <h2 className='mt-6 text-3xl font-semibold'>
            Your journey starts here.
          </h2>

          <p className='mx-auto mt-4 max-w-2xl leading-7 text-slate-500'>
            Join a community committed to academic excellence, practical legal
            skills, leadership, advocacy, and service.
          </p>

          <a
            href='#register'
            className='mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 font-medium text-[#07111f] transition hover:bg-[#e4c45d]'
          >
            Register as a Member
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </main>
  )
}
