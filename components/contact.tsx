"use client";

import { useRef, useState } from "react";
import { ArrowIcon, CircleCheckIcon } from "./icons";
import Reveal from "./reveal";

const CONTACT_INFO = [
  {
    label: "Campus Office",
    value: "Student Center, Jimma University Main Campus, Jimma, Ethiopia",
  },
  { label: "Email Us", value: "julsa@ju.edu.et" },
  { label: "Call Us", value: "+251 47 111 0000" },
];

const HOURS = [
  { day: "Monday — Friday", time: "9:00 AM — 5:00 PM" },
  { day: "Saturday", time: "10:00 AM — 2:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const SOCIALS = [
  { label: "Telegram", href: "https://t.me/julsa" },
  { label: "Instagram", href: "https://instagram.com/julsa" },
  { label: "X", href: "https://x.com/julsa" },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-cream-50 placeholder:text-cream-100/35 transition-colors focus:border-gold-400/60 focus:bg-white/[0.06] focus:outline-none";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  const idempotencyKey = useRef<string | null>(null);
  const idempotencyPayload = useRef<string | null>(null);

  async function submitToBackend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setFailed(false);
    try {
      const form = event.currentTarget;
      const body = { name, email, subject: `Inquiry from ${name}`, message, website: (form.elements.namedItem("website") as HTMLInputElement).value };
      const payload = JSON.stringify(body);
      if (!idempotencyKey.current || idempotencyPayload.current !== payload) {
        idempotencyKey.current = crypto.randomUUID();
        idempotencyPayload.current = payload;
      }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, idempotencyKey: idempotencyKey.current }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Please try again later.");
      setName(""); setEmail(""); setMessage("");
      idempotencyKey.current = null;
      idempotencyPayload.current = null;
      setStatus("Message sent. Thank you for contacting JULSA.");
    } catch (error) {
      setFailed(true);
      setStatus(error instanceof Error ? error.message : "Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-24 overflow-hidden bg-night-950 py-24 text-cream-50 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold-500/[0.07] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            Contact
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">
            Let&rsquo;s{" "}
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Talk Justice
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream-100/60">
            Questions, collaborations, or partnership ideas? The JULSA executive
            committee is one message away.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Info */}
          <Reveal direction="left" delay={0.1} className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="font-display text-xl font-bold text-cream-50">
                Reach Us
              </h3>
              <ul className="mt-6 space-y-5">
                {CONTACT_INFO.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-400" />
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300/80">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm text-cream-100/75">
                        {item.value}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-7">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-cream-100/70 transition-all hover:border-gold-400/50 hover:bg-gold-400 hover:text-night-950"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gold-400/25 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8">
              <h3 className="font-display text-xl font-bold text-cream-50">
                Office Hours
              </h3>
              <ul className="mt-5 space-y-3">
                {HOURS.map((row) => (
                  <li
                    key={row.day}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-cream-100/55">{row.day}</span>
                    <span className="flex items-center gap-2 font-medium text-gold-200">
                      <CircleCheckIcon className="h-4 w-4" />
                      {row.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal direction="right" delay={0.15}>
            <form
              onSubmit={submitToBackend}
              className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm lg:p-10"
            >
            <h3 className="font-display text-xl font-bold text-cream-50">
              Send a Message
            </h3>
            <p className="mt-2 text-sm text-cream-100/55">
              We usually reply within 2 working days.
            </p>

            <div className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-cream-100/55">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Selam Tesfaye"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-cream-100/55">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@ju.edu.et"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-cream-100/55">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can JULSA help you?"
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>
              <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
            </div>

            {status && <p role={failed ? "alert" : "status"} className={`mt-4 text-sm ${failed ? "text-red-300" : "text-cream-100/75"}`}>{status}</p>}

              <button
                type="submit"
                disabled={pending}
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-4 text-sm font-semibold text-night-950 shadow-[0_0_45px_-8px_rgba(212,175,55,0.7)] transition-all hover:bg-gold-300 hover:shadow-[0_0_55px_-6px_rgba(212,175,55,0.85)]"
              >
                {pending ? "Sending…" : "Send Message"}
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
