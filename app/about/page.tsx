import {
  ArrowIcon,
  ColumnsIcon,
  GavelIcon,
  ScalesIcon,
  UsersIcon,
} from '@/components/icons'
import Image from 'next/image'
import Link from 'next/link'
import LiveCollection from '@/components/live-collection'

const OBJECTIVES = [
  'Promote academic excellence and support students in their legal education.',
  'Encourage legal research, writing, critical thinking, and academic engagement.',
  'Develop practical legal skills through moot courts, debate, public speaking, and advocacy.',
  'Create professional development and career opportunities for law students.',
  'Develop responsible student leadership and strengthen participation in association activities.',
  'Represent and support the interests of law students.',
  'Build meaningful connections with professionals, alumni, institutions, and organizations.',
  'Promote legal education, community engagement, and awareness of legal issues.',
  'Encourage professionalism, ethical conduct, collaboration, and innovation.',
]

const VALUES = [
  {
    icon: ScalesIcon,
    title: 'Justice',
    text: 'Standing for fairness, equality, and respect for the rule of law.',
  },
  {
    icon: GavelIcon,
    title: 'Integrity',
    text: 'Acting with honesty, responsibility, accountability, and ethical conduct.',
  },
  {
    icon: ColumnsIcon,
    title: 'Excellence',
    text: 'Pursuing high standards in academic, professional, and organizational work.',
  },
  {
    icon: UsersIcon,
    title: 'Leadership',
    text: 'Developing students who lead responsibly and contribute positively to society.',
  },
]

const ADDITIONAL_VALUES = [
  {
    title: 'Service',
    text: 'Using knowledge and skills to contribute meaningfully to the community.',
  },
  {
    title: 'Inclusion',
    text: 'Creating an environment where students can participate, contribute, and belong.',
  },
  {
    title: 'Professionalism',
    text: 'Preparing students to uphold the standards and responsibilities of the legal profession.',
  },
  {
    title: 'Innovation',
    text: 'Encouraging new ideas, approaches, and solutions to academic and professional challenges.',
  },
]

const LEADERSHIP = [
  {
    role: 'President',
    name: 'Segni Niguse',
    image: '/image/leadership/Segni.jpg',
    description: 'Current President of the JULSA',
    featured: true,
  },
  {
    role: 'Vice President',
    name: 'Amanuel Abera',
    image: '/image/leadership/Amanuel.jpg',
    description: 'Vice president of JULSA',
    featured: false,
  },
  {
    role: 'General Secretary',
    name: 'Saron Berhanu',
    image: '/image/leadership/Saron.jpg',
    description: 'General secretary of JULSA',
    featured: false,
  },
  {
    role: 'President',
    name: 'Natan Tadese',
    image: '/image/leadership/presidentNatan.jpg',
    description: 'Founder and former president of JULSA',
    featured: true,
  },
  {
    role: 'Vice President',
    name: 'Tolera Dufera',
    image: '/image/leadership/Tolera.jpg',
    description: 'Former president of JULSA',
    featured: false,
  },
  {
    role: 'Former President',
    name: 'Abdulfettah Bushura',
    image: '/image/leadership/Abdulfettah.jpg',
    description: 'Former president.',
    featured: false,
  },
  {
    role: 'Former President',
    name: 'Amir Jihad',
    image: '/image/leadership/Amir.jpg',
    description: 'Former President.',
    featured: false,
  },
]

type DepartmentMember = {
  role: string
  name: string
  image?: string
}

type Department = {
  name: string
  members: DepartmentMember[]
}

const DEPARTMENTS: Department[] = [
  {
    name: 'Advocacy',
    members: [
      {
        role: 'Director',
        name: 'Kalkidan Melaku',
        image: '/image/leadership/Kalkidan.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Abdiyom Bekele',
        image: '/image/leadership/Abdiyom.jpg',
      },
    ],
  },
  {
    name: 'Academic Affairs & Peer Mentorship',
    members: [
      {
        role: 'Director',
        name: 'Mikiyas Nigussie',
        image: '/image/leadership/Mikiyas.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Asrat',
        image: '/image/leadership/Asrat.jpg',
      },
    ],
  },
  {
    name: 'Event Planning',
    members: [
      {
        role: 'Director',
        name: 'Mintesnot Habtu',
        image: '/image/leadership/Mintesnot.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Beamlak',
        image: '/image/leadership/Bamlak.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Neima Umer',
        image: '/image/leadership/Neima.jpg',
      },
    ],
  },
  {
    name: 'Alumni Network',
    members: [
      {
        role: 'Director',
        name: 'Ababo Kebede',
        image: '/image/leadership/Ababo.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Meshan Teshome',
        image: '/image/leadership/Meshan.jpg',
      },
    ],
  },
  {
    name: 'Career Development',
    members: [
      {
        role: 'Director',
        name: 'Mihret Melese',
        image: '/image/leadership/Mehret.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Hilaria Anteneh',
        image: '/image/leadership/Hilaria.jpg',
      },
    ],
  },
  {
    name: 'Social Inclusion',
    members: [
      {
        role: 'Director',
        name: 'Habtamu',
        image: '/image/leadership/Habtamu.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Bahiru Lema',
        image: '/image/leadership/Bahiru.jpg',
      },
    ],
  },
  {
    name: 'Finance & Fundraising',
    members: [
      {
        role: 'Director',
        name: 'Lidia Esayas',
        image: '/image/leadership/Lidya.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Eyob Gudeta',
      },
    ],
  },
  {
    name: 'Moot Court & Legal Advocacy',
    members: [
      {
        role: 'Director',
        name: 'Tsinat Diro',
        image: '/image/leadership/Tsinat.jpg',
      },
      {
        role: 'Vice Director',
        name: 'Ruhama Yesuf',
        image: '/image/leadership/Ruhama.jpg',
      },
    ],
  },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export default function AboutUs() {
  return (
    <main className='bg-night-950 text-cream-50'>
      {/* Hero */}
      <section className='relative isolate overflow-hidden border-b border-white/10'>
        {/* Jimma University background */}
        <Image
          src='/jimmauniversity.jpg'
          alt=''
          fill
          preload
          sizes='100vw'
          className='-z-10 object-cover object-center'
        />

        <div
          aria-hidden='true'
          className='absolute inset-0 -z-10 bg-gradient-to-r from-night-950/95 via-night-950/85 to-night-950/65'
        />

        <div
          aria-hidden='true'
          className='absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-gold-500/[0.08] blur-[140px]'
        />

        <div
          aria-hidden='true'
          className='absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent'
        />

        <div className='mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40'>
          <div className='max-w-4xl'>
            <div className='inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
              <span className='h-1.5 w-1.5 rounded-full bg-gold-400' />
              About JULSA
            </div>

            <h1 className='mt-7 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl'>
              Building the Future of{' '}
              <span className='bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300 bg-clip-text text-transparent'>
                Legal Leadership
              </span>
            </h1>

            <p className='mt-7 max-w-2xl text-lg leading-relaxed text-cream-100/65'>
              The Jimma University Law Students&rsquo; Association is a
              student-led association dedicated to empowering law students
              through academic excellence, practical legal skills, leadership,
              professional development, advocacy, and community engagement.
            </p>

            <div className='mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300/80'>
              <span>Learn</span>
              <span className='text-gold-400/30'>•</span>
              <span>Advocate</span>
              <span className='text-gold-400/30'>•</span>
              <span>Lead</span>
              <span className='text-gold-400/30'>•</span>
              <span>Serve</span>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership — placed right after the association description */}
      <section className='border-b border-white/10 bg-night-900 py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
            <div className='max-w-3xl'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
                01 · Leadership
              </p>

              <h2 className='mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl'>
                Meet the{' '}
                <span className='text-gold-300'>JULSA leadership.</span>
              </h2>

              <p className='mt-5 text-base leading-relaxed text-cream-100/55'>
                Student leaders who help coordinate the association and turn its
                objectives into meaningful programs and activities.
              </p>
            </div>

            <Link
              href='/#contact'
              className='group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-gold-300 transition-all hover:text-gold-200 hover:gap-3'
            >
              Connect with JULSA
              <ArrowIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </div>

          <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {LEADERSHIP.map((leader) => (
              <article
                key={`${leader.role}-${leader.name}`}
                className={`group overflow-hidden rounded-2xl border ${
                  leader.featured
                    ? 'border-gold-400/35 bg-gradient-to-b from-gold-400/[0.08] to-white/[0.02]'
                    : 'border-white/10 bg-white/[0.025]'
                }`}
              >
                {/* Portrait */}
                <div className='relative aspect-[3/4] overflow-hidden bg-night-900'>
                  <Image
                    src={leader.image}
                    alt={`${leader.name} - ${leader.role}`}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
                  />

                  <div className='absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/10 to-transparent' />

                  <span className='absolute bottom-4 left-4 rounded-full border border-gold-400/20 bg-night-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-300 backdrop-blur'>
                    {leader.role}
                  </span>
                </div>

                <div className='p-6'>
                  <h3 className='font-display text-xl font-bold'>
                    {leader.name}
                  </h3>

                  <p className='mt-3 text-sm leading-relaxed text-cream-100/50'>
                    {leader.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Leadership note */}
          <div className='mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6'>
            <p className='text-sm leading-relaxed text-cream-100/45'>
              JULSA&rsquo;s leadership structure also includes representatives
              and student leadership roles established under the
              association&rsquo;s governing framework.
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className='relative overflow-hidden py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
                02 · Our History
              </p>

              <h2 className='mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl'>
                A tradition of{' '}
                <span className='text-gold-300'>learning &amp; service.</span>
              </h2>
            </div>

            <div className='space-y-6 text-base leading-relaxed text-cream-100/65'>
              <p>
                JULSA represents a continuing tradition of law students coming
                together to participate in academic activities, student
                leadership, professional development, advocacy, and service.
              </p>

              <p>
                Over time, the association has provided a platform through which
                students can engage with legal issues, develop practical skills,
                participate in competitions and academic programs, and build
                relationships with fellow students, professionals, and alumni.
              </p>

              <p>
                Its work continues to evolve around the needs of law students
                and the wider community, with an emphasis on academic
                excellence, leadership, professionalism, and meaningful
                contribution to society.
              </p>

              <div className='rounded-2xl border border-gold-400/20 bg-white/[0.03] p-7'>
                <p className='font-display text-xl italic leading-relaxed text-gold-200'>
                  &ldquo;Once JULSA, Always Part of the Story.&rdquo;
                </p>

                <p className='mt-3 text-sm text-cream-100/45'>
                  Connecting students, leaders, and alumni across generations.
                </p>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className='mt-16 border-t border-white/10 pt-14'>
            <div className='mb-8 flex items-end justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-cream-100/35'>
                  Departments
                </p>

                <h3 className='mt-2 font-display text-2xl font-bold'>
                  Executive Departments
                </h3>
              </div>

              <span className='hidden text-xs text-cream-100/30 sm:block'>
                JULSA Leadership Structure
              </span>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
              {DEPARTMENTS.map((department, index) => (
                <article
                  key={department.name}
                  className='group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition-all duration-300 hover:border-gold-400/40 hover:bg-white/[0.04]'
                >
                  <div className='flex items-center gap-4'>
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 font-display text-sm font-bold text-gold-300'>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h4 className='font-display text-xl font-bold text-cream-50'>
                      {department.name}
                    </h4>
                  </div>

                  <div className='mt-6 space-y-5'>
                    {department.members.map((member) => (
                      <div
                        key={`${member.role}-${member.name}`}
                        className='flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-4'
                      >
                        <div className='relative h-48 w-36 shrink-0 overflow-hidden rounded-xl border-2 border-gold-400/40 bg-night-900'>
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={`${member.name} - ${member.role}`}
                              fill
                              sizes='144px'
                              className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
                            />
                          ) : (
                            <span className='flex h-full w-full items-center justify-center font-display text-4xl font-bold text-gold-300/70'>
                              {initials(member.name)}
                            </span>
                          )}
                        </div>

                        <div className='min-w-0 text-center sm:text-left'>
                          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-300/70'>
                            {member.role}
                          </p>

                          <p className='mt-1.5 font-display text-lg font-bold leading-snug text-cream-50'>
                            {member.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className='border-y border-white/10 bg-night-900 py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='max-w-3xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
              03 · Objectives
            </p>

            <h2 className='mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl'>
              What JULSA{' '}
              <span className='text-gold-300'>strives to achieve.</span>
            </h2>

            <p className='mt-5 text-base leading-relaxed text-cream-100/55'>
              Our objectives guide the association&rsquo;s academic,
              professional, leadership, advocacy, and community activities.
            </p>
          </div>

          <div className='mt-14 grid gap-4 md:grid-cols-2'>
            {OBJECTIVES.map((objective, index) => (
              <div
                key={objective}
                className='group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:border-gold-400/30 hover:bg-white/[0.04]'
              >
                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 font-display text-sm font-bold text-gold-300'>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p className='pt-1 text-sm leading-relaxed text-cream-100/65'>
                  {objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='text-center'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
              04 · Our Values
            </p>

            <h2 className='mt-5 font-display text-4xl font-bold sm:text-5xl'>
              Principles that <span className='text-gold-300'>guide us.</span>
            </h2>

            <p className='mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream-100/55'>
              JULSA is guided by values that shape how we learn, lead, advocate,
              collaborate, and serve.
            </p>
          </div>

          <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {VALUES.map((value) => {
              const Icon = value.icon

              return (
                <article
                  key={value.title}
                  className='group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.04]'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-400/10 text-gold-300 transition-colors group-hover:bg-gold-400 group-hover:text-night-950'>
                    <Icon className='h-6 w-6' />
                  </div>

                  <h3 className='mt-6 font-display text-xl font-bold'>
                    {value.title}
                  </h3>

                  <p className='mt-3 text-sm leading-relaxed text-cream-100/55'>
                    {value.text}
                  </p>
                </article>
              )
            })}
          </div>

          <div className='mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {ADDITIONAL_VALUES.map((value) => (
              <article
                key={value.title}
                className='rounded-2xl border border-white/10 bg-white/[0.02] p-6'
              >
                <h3 className='font-display text-lg font-bold text-gold-200'>
                  {value.title}
                </h3>

                <p className='mt-2 text-sm leading-relaxed text-cream-100/50'>
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className='border-y border-white/10 bg-night-900 py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='max-w-3xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
              05 · Organization
            </p>

            <h2 className='mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl'>
              How JULSA <span className='text-gold-300'>is organized.</span>
            </h2>

            <p className='mt-5 text-base leading-relaxed text-cream-100/55'>
              The association operates through its General Assembly and
              Executive Board, with departments supporting its academic,
              professional, advocacy, financial, and community activities.
            </p>
          </div>

          {/* Structure */}
          <div className='mt-14'>
            <div className='mx-auto max-w-md rounded-3xl border border-gold-400/30 bg-gradient-to-br from-gold-400/10 to-white/[0.02] p-8 text-center'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
                Highest Authority
              </p>

              <h3 className='mt-3 font-display text-2xl font-bold'>
                General Assembly
              </h3>

              <p className='mt-3 text-sm leading-relaxed text-cream-100/50'>
                The highest decision-making body of the association.
              </p>
            </div>

            <div className='mx-auto h-12 w-px bg-gradient-to-b from-gold-400/50 to-transparent' />

            <div className='mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
                Executive Leadership
              </p>

              <h3 className='mt-3 font-display text-2xl font-bold'>
                Executive Board
              </h3>

              <p className='mt-3 text-sm leading-relaxed text-cream-100/50'>
                Responsible for coordinating and implementing the
                association&rsquo;s activities and responsibilities.
              </p>

              <div className='mt-6 flex flex-wrap justify-center gap-3'>
                {['President', 'Vice President', 'Secretary General'].map(
                  (role) => (
                    <span
                      key={role}
                      className='rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-2 text-xs font-medium text-gold-200'
                    >
                      {role}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className='border-t border-white/10 bg-night-900'>
        <div className='mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24'>
          <div className='relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-400/[0.08] via-white/[0.03] to-transparent p-8 sm:p-12 lg:p-16'>
            <div
              aria-hidden='true'
              className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/[0.08] blur-[90px]'
            />

            <div className='relative max-w-3xl'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-300'>
                The JULSA Community
              </p>

              <h2 className='mt-5 font-display text-3xl font-bold sm:text-4xl'>
                Learn. Advocate. Lead. Serve.
              </h2>

              <p className='mt-5 max-w-2xl text-base leading-relaxed text-cream-100/55'>
                Be part of a community committed to academic excellence,
                professional growth, leadership, advocacy, and meaningful
                service.
              </p>

              <Link
                href='/#join'
                className='group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-300 to-gold-400 px-6 py-3 text-sm font-semibold text-night-950 transition-all hover:from-gold-200 hover:to-gold-300 hover:scale-[1.02]'
              >
                Become a Member
                <ArrowIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <LiveCollection collection='leaders' title='JULSA leadership' />
    </main>
  )
}
