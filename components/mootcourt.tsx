import { ArrowIcon, AwardIcon, GavelIcon } from "./icons";
import Reveal from "./reveal";

const ACHIEVEMENTS = [
  {
    year: "2025",
    title: "National Moot Court Championship",
    result: "Finalist",
    detail: "Advanced to the national final round in Addis Ababa.",
  },
  {
    year: "2024",
    title: "East African Human Rights Moot",
    result: "Best Oralist",
    detail: "Recognised for outstanding individual advocacy.",
  },
  {
    year: "2023",
    title: "Ethiopian Constitutional Moot",
    result: "Champions",
    detail: "Brought home the national trophy for the Faculty of Law.",
  },
  {
    year: "2022",
    title: "Regional Legal Debate Cup",
    result: "Winners",
    detail: "Undefeated across the entire regional competition.",
  },
];

const MOOT_STATS = [
  { value: "12+", label: "Competition finals" },
  { value: "6", label: "National titles" },
  { value: "40+", label: "Advocates trained yearly" },
  { value: "3", label: "International delegations" },
];

export default function MootCourt() {
  return (
    <section
      id="moot-court"
      className="relative isolate scroll-mt-24 overflow-hidden bg-night-950 py-24 text-cream-50 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-0 -z-10 h-[480px] w-[480px] rounded-full bg-gold-500/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal direction="left">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              <GavelIcon className="h-3.5 w-3.5" />
              Moot Court
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">
              Where Arguments Are{" "}
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300 bg-clip-text text-transparent">
                Won in the Courtroom
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-100/60">
              Our moot program trains student advocates through simulated trials
              that mirror real Ethiopian courts &mdash; from researching the law
              to delivering the closing argument under pressure.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <a
              href="/#join"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/50 bg-gold-400/10 px-6 py-3 text-sm font-semibold text-gold-200 transition-all hover:bg-gold-400 hover:text-night-950"
            >
              Join a Moot Team
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        {/* Stats strip */}
        <Reveal
          delay={0.1}
          className="mt-14 grid grid-cols-2 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] py-7 backdrop-blur sm:grid-cols-4"
        >
          {MOOT_STATS.map((stat) => (
            <div key={stat.label} className="px-5 text-center sm:px-7">
              <div className="font-display text-3xl font-bold text-gold-300">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cream-100/50 sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>

        {/* Achievements timeline */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((item, index) => (
            <Reveal
              key={item.year}
              as="article"
              delay={0.1 + index * 0.08}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-bold text-cream-100/20 transition-colors group-hover:text-gold-400/40">
                  {item.year}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
                  <AwardIcon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold leading-snug text-cream-50">
                {item.title}
              </h3>
              <div className="mt-3 inline-flex items-center rounded-full bg-gold-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-200">
                {item.result}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/55">
                {item.detail}
              </p>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
