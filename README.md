<div align="center">
  <img src="public/logo.jpg" alt="JULSA logo" width="112" />
  <h1>JULSA | Faculty of Law</h1>
  <p><strong>Learn the law. Strengthen your voice. Serve your community.</strong></p>
  <p>The digital home of the Jimma University Law Students' Association.</p>
  <p>
    <a href="https://julsa-faculty-of-law.vercel.app"><img src="https://img.shields.io/badge/Visit%20the%20live%20site-JULSA-c8a84b?style=for-the-badge" alt="Visit the live JULSA website" /></a>
    <img src="https://img.shields.io/badge/Next.js-16-111111?style=for-the-badge&logo=nextdotjs" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-4169e1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
  <p>
    <a href="#explore-the-site">Explore</a> |
    <a href="#highlights">Highlights</a> |
    <a href="#getting-started">Get started</a> |
    <a href="#admin-and-data">Admin and data</a>
  </p>
</div>

---

## Welcome

JULSA brings the Jimma University Faculty of Law community together around legal learning, advocacy, leadership, and service. This repository contains the website and the tools that help the association share events, resources, news, and opportunities.

## Explore the site

| Visit | What you'll find |
| --- | --- |
| [Home](https://julsa-faculty-of-law.vercel.app/) | JULSA overview, membership, events, and contact |
| [About](https://julsa-faculty-of-law.vercel.app/about) | The association, its mission, and leadership |
| [Events](https://julsa-faculty-of-law.vercel.app/events) | Upcoming activities and event details |
| [Academic Hub](https://julsa-faculty-of-law.vercel.app/academic-hub#resources) | Study and legal research resources |
| [Moot Court](https://julsa-faculty-of-law.vercel.app/moot-court) | Advocacy, competitions, and moot court |
| [Blog](https://julsa-faculty-of-law.vercel.app/blog) | Articles and JULSA updates |
| [Membership](https://julsa-faculty-of-law.vercel.app/members#register) | Membership information and registration |
| [News](https://julsa-faculty-of-law.vercel.app/news) | Association and academic news |
| [Opportunities](https://julsa-faculty-of-law.vercel.app/career) | Career and professional opportunities |
| [Gallery](https://julsa-faculty-of-law.vercel.app/gallery) | JULSA activities and community moments |
| [Contact](https://julsa-faculty-of-law.vercel.app/contact) | Contact the association |

## Highlights

<details open>
  <summary><strong>A public site made for the law school community</strong></summary>
  <br />
  Browse academic resources, events, moot court activities, student writing, news, career opportunities, and membership information from one place.
</details>

<details>
  <summary><strong>Admin tools connected to the database</strong></summary>
  <br />
  Authorized administrators can manage events, blog posts, competitions, news, resources, opportunities, gallery items, and leadership content. Membership applications and contact messages are available in the protected dashboard.
</details>

<details>
  <summary><strong>Published content updates without a manual refresh</strong></summary>
  <br />
  Public content sections refresh from the database every five seconds. New events are published by default and can be saved as drafts from the admin editor.
</details>

<details>
  <summary><strong>Protected, validated submissions</strong></summary>
  <br />
  Contact messages and membership applications are validated on the server and stored in PostgreSQL. The admin area requires an authorized Supabase account.
</details>

## Getting started

### Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project with the JULSA database schema

### Install and run

<pre><code>git clone https://github.com/daveontrack/JULSA.git
cd JULSA
npm ci
npm run dev</code></pre>

Open <a href="http://localhost:3000">http://localhost:3000</a>.

### Database setup

The SQL setup files live in supabase/migrations. Review and apply the required migrations to the target Supabase project before enabling the related features. Admin access also requires an administrator account that is allowlisted in the julsa_admins table.

### Useful commands

| Command | Purpose |
| --- | --- |
| <code>npm run dev</code> | Start the local development server |
| <code>npm run build</code> | Build the production app |
| <code>npm run start</code> | Serve a production build |
| <code>npm run lint</code> | Run ESLint |
| <code>npm test</code> | Run submission validation tests |
| <code>npm run db:generate</code> | Generate the Prisma client |
| <code>npm run db:introspect</code> | Introspect the connected database |

## Admin and data

Open <a href="https://julsa-faculty-of-law.vercel.app/admin/login">the admin sign-in</a> to access the dashboard. Only accounts explicitly authorized for JULSA administration can sign in.

The database connection and Supabase authentication values must be configured in the deployment environment. Never commit credentials or private applicant data.

## Built with

- Next.js App Router and React
- TypeScript and Tailwind CSS
- PostgreSQL and Supabase Auth/Storage
- Prisma and the PostgreSQL driver

## Contributing

Improvements are welcome. Keep changes focused, preserve the existing visual language, and run the relevant checks before opening a pull request.

<div align="center">
  <br />
  <sub>Built for the Jimma University Law Students' Association | Faculty of Law</sub>
</div>
