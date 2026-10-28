import { ArrowIcon, CircleCheckIcon, UsersIcon } from "./icons";
import Reveal from "./reveal";

const BENEFITS = [
  {
    title: "Priority Program Access",
    text: "First seats for moot trials, legal clinics, and faculty-led seminars.",
  },
  {
    title: "Mentorship Circles",
    text: "Be paired with senior students and practising alumni in the legal field.",
  },
  {
    title: "Career & Internship Alerts",
    text: "Direct updates on internships at firms, courts, and human rights offices.",
  },
  {
    title: "Research Opportunities",
    text: "Co-author articles for the JULSA student journal and legal review.",
  },
  {
    title: "Networking Events",
    text: "Meet judges, advocates, and public interest leaders throughout the year.",
  },
  {
    title: "Community Impact",
    text: "Serve on our legal aid team and make a real difference beyond campus.",
  },
];

const STEPS = [
  { n: "01", title: "Fill the Form", text: "Register your details as an active student of the Faculty." },
  { n: "02", title: "Pay Dues", text: "Settle the annual membership fee via your class coordinator." },
  { n: "03", title: "Get Verified", text: "Receive your membership confirmation and digital ID card." },
];

export default function Members() {
  return (
    <section
      id="members"
      className="relative isolate scroll-mt-24 overflow-hidden bg-night-900 py-24 text-cream-50 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-gold-500/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — pitch + benefits */}
          <Reveal direction="left">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              <UsersIcon className="h-3.5 w-3.5" />
              Membership
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">
              Become One of{" "}
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300 bg-clip-text text-transparent">
                Us
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-100/60">
              Membership in JULSA opens doors across mooting, legal aid, research,
              and community service — the people and programs that make the
              Faculty of Law feel like home.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((benefit, index) => (
                <Reveal
                  key={benefit.title}
                  as="li"
                  delay={0.12 + index * 0.06}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-gold-400/5"
                >
                  <div className="flex items-center gap-2.5">
                    <CircleCheckIcon className="h-5 w-5 shrink-0 text-gold-300" />
                    <h3 className="font-semibold text-sm text-cream-50">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-cream-100/55">
                    {benefit.text}
                  </p>
                </Reveal>
              ))}
            </ul>
          </Reveal>

          {/* Right — steps + CTA */}
          <Reveal direction="right" delay={0.15}>
            <div className="rounded-3xl border border-gold-400/25 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 backdrop-blur-sm lg:p-10">
              <h3 className="font-display text-2xl font-bold text-cream-50">
                How to Join
              </h3>
              <p className="mt-2 text-sm text-cream-100/55">
                Three simple steps to become a JULSA member.
              </p>

              <ol className="mt-8 space-y-6">
                {STEPS.map((step) => (
                  <li key={step.n} className="flex gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold-400/40 bg-night-900 font-display text-base font-bold text-gold-300">
                      {step.n}
                    </span>
                    <div>
                      <h4 className="font-semibold text-cream-50">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-cream-100/55">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <a
                id="join"
                href="/members#register"
                className="group mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-300 to-gold-400 px-7 py-4 text-sm font-semibold text-night-950 shadow-[0_0_45px_-8px_rgba(212,175,55,0.7)] transition-all hover:from-gold-200 hover:to-gold-300 hover:shadow-[0_0_55px_-6px_rgba(212,175,55,0.85)] hover:scale-[1.01]"
              >
                Apply for Membership
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <p className="mt-4 text-center text-xs text-cream-100/45">
                Membership is open to all registered students of the Faculty of
                Law.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
