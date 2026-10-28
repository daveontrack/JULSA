import { authorizeAdminApi, runAsAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

const CONTENT_TABLES = [
  ['events', 'Events'],
  ['blog_posts', 'Blog posts'],
  ['competitions', 'Moot court competitions'],
  ['leaders', 'Leaders'],
  ['gallery_items', 'Gallery items'],
  ['news', 'News'],
  ['opportunities', 'Opportunities'],
  ['academic_resources', 'Academic resources'],
] as const

export async function GET() {
  const access = await authorizeAdminApi()
  if (access.response) return access.response
  if (!access.session) return Response.json({ error: 'Administrator sign-in required.' }, { status: 401 })

  try {
    const summary = await runAsAdmin(access.session, async (client) => {
      const [members, messages, competitionStatuses] = await Promise.all([
        client.query(`SELECT count(*)::int AS total,
          count(*) FILTER (WHERE status = 'Pending')::int AS pending,
          count(*) FILTER (WHERE status = 'Approved')::int AS approved,
          count(*) FILTER (WHERE status = 'Rejected')::int AS rejected
          FROM public.members`),
        client.query(`SELECT count(*)::int AS total,
          count(*) FILTER (WHERE status = 'Unread')::int AS unread,
          count(*) FILTER (WHERE status = 'Read')::int AS read_count,
          count(*) FILTER (WHERE status = 'Replied')::int AS replied,
          count(*) FILTER (WHERE status = 'Archived')::int AS archived
          FROM public.contact_messages`),
        client.query(`SELECT count(*) FILTER (WHERE status = 'Upcoming')::int AS upcoming,
          count(*) FILTER (WHERE status = 'Registration Open')::int AS registration_open,
          count(*) FILTER (WHERE status = 'Completed')::int AS completed
          FROM public.competitions`),
      ])
      const content = await Promise.all(CONTENT_TABLES.map(async ([table, label]) => {
        const result = await client.query(`SELECT count(*)::int AS total FROM public.${table}`)
        const publishedColumn = await client.query(`
          SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema='public' AND table_name=$1 AND column_name='is_published'
          ) AS available
        `, [table])
        let published: number | null = null
        let drafts: number | null = null
        if (publishedColumn.rows[0]?.available) {
          const states = await client.query(`SELECT count(*) FILTER (WHERE is_published)::int AS published,
            count(*) FILTER (WHERE NOT is_published)::int AS drafts FROM public.${table}`)
          published = Number(states.rows[0]?.published ?? 0)
          drafts = Number(states.rows[0]?.drafts ?? 0)
        }
        return { table, label, total: Number(result.rows[0]?.total ?? 0), published, drafts }
      }))
      return {
        members: members.rows[0],
        messages: messages.rows[0],
        competitions: competitionStatuses.rows[0],
        content,
        publicationAvailable: content.every((item) => item.published !== null),
      }
    })
    return Response.json(summary, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ error: 'Dashboard summaries are temporarily unavailable.' }, { status: 500 })
  }
}
