'use client'

import { FormEvent, useRef, useState } from 'react'
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const idempotencyKey = useRef<string | null>(null)
  const idempotencyPayload = useRef<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    const payload = JSON.stringify(values)
    if (!idempotencyKey.current || idempotencyPayload.current !== payload) {
      idempotencyKey.current = crypto.randomUUID()
      idempotencyPayload.current = payload
    }
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, idempotencyKey: idempotencyKey.current }),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || 'We could not send your message. Please try again.')
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
    <main className='min-h-screen bg-[#07111f] px-5 py-28 text-white sm:px-8 lg:px-10'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-12 max-w-2xl'>
          <p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]'>
            Get in Touch
          </p>

          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            Contact Us
          </h1>

          <p className='mt-4 text-base leading-7 text-slate-400'>
            Have a question, suggestion, or want to connect with JULSA? We would
            love to hear from you.
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Contact Information */}
          <div className='rounded-2xl border border-white/10 bg-[#0b1828] p-7 sm:p-9'>
            <h2 className='text-2xl font-bold'>Let&apos;s connect</h2>

            <p className='mt-3 text-sm leading-6 text-slate-400'>
              Reach out to the Jimma University Law Students&apos; Association
              for inquiries, academic activities, partnerships, and other
              association matters.
            </p>

            <div className='mt-8 space-y-6'>
              {/* Location */}
              <div className='flex gap-4'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]'>
                  <MapPin className='h-5 w-5' />
                </div>

                <div>
                  <h3 className='font-semibold'>Location</h3>
                  <p className='mt-1 text-sm text-slate-400'>
                    Jimma University
                    <br />
                    Jimma, Ethiopia
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className='flex gap-4'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]'>
                  <Phone className='h-5 w-5' />
                </div>

                <div>
                  <h3 className='font-semibold'>Phone</h3>
                  <a
                    href='tel:0914428530'
                    className='mt-1 block text-sm text-slate-400 hover:text-[#d4af37]'
                  >
                    0914 428 530
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className='flex gap-4'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]'>
                  <Mail className='h-5 w-5' />
                </div>

                <div>
                  <h3 className='font-semibold'>Email</h3>
                  <p className='mt-1 text-sm text-slate-500'>
                    Email address coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='rounded-2xl border border-white/10 bg-[#0b1828] p-7 sm:p-9'>
            {submitted ? (
              <div className='flex min-h-[380px] flex-col items-center justify-center text-center'>
                <CheckCircle2 className='h-14 w-14 text-[#d4af37]' />

                <h2 className='mt-5 text-2xl font-bold'>Message Sent</h2>

                <p className='mt-3 max-w-sm text-sm leading-6 text-slate-400'>
                  Thank you for contacting JULSA. We appreciate your message.
                </p>

                <button
                  type='button'
                  onClick={() => { setSubmitted(false); setError('') }}
                  className='mt-6 text-sm font-semibold text-[#d4af37] hover:text-[#e5c45b]'
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className='text-2xl font-bold'>Send us a message</h2>

                <form onSubmit={handleSubmit} className='mt-7 space-y-5'>
                  <div>
                    <label
                      htmlFor='name'
                      className='mb-2 block text-sm font-medium text-slate-300'
                    >
                      Full Name
                    </label>

                    <input
                      id='name'
                      name='name'
                      type='text'
                      required
                      placeholder='Your name'
                      className='w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#d4af37]/50'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='mb-2 block text-sm font-medium text-slate-300'
                    >
                      Email Address
                    </label>

                    <input
                      id='email'
                      name='email'
                      type='email'
                      required
                      placeholder='you@example.com'
                      className='w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#d4af37]/50'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='subject'
                      className='mb-2 block text-sm font-medium text-slate-300'
                    >
                      Subject
                    </label>

                    <input
                      id='subject'
                      name='subject'
                      type='text'
                      required
                      placeholder='Subject'
                      className='w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#d4af37]/50'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='mb-2 block text-sm font-medium text-slate-300'
                    >
                      Message
                    </label>

                    <textarea
                      id='message'
                      name='message'
                      rows={6}
                      required
                      placeholder='Write your message...'
                      className='w-full resize-none rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-[#d4af37]/50'
                    />
                  </div>

                  <div aria-hidden='true' className='absolute -left-[10000px] h-px w-px overflow-hidden'>
                    <label htmlFor='website'>Leave this field empty</label>
                    <input id='website' name='website' type='text' tabIndex={-1} autoComplete='off' />
                  </div>

                  {error && <p role='alert' className='text-sm text-red-300'>{error}</p>}

                  <button
                    type='submit'
                    disabled={pending}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-sm font-bold text-[#07111f] transition hover:bg-[#e5c45b]'
                  >
                    {pending ? 'Sending…' : 'Send Message'}
                    <Send className='h-4 w-4' />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className='mt-10 text-center'>
          <p className='text-sm text-slate-500'>
            Learn. Advocate. Lead. Serve.
          </p>
        </div>
      </div>
    </main>
  )
}
