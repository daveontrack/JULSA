import { getPool, hasColumn } from '@/lib/db'

export const runtime = 'nodejs'

const PUBLIC_COLLECTIONS: Record<string, string> = {
  events: 'events',
  'blog-posts': 'blog_posts',
  competitions: 'competitions',
  leaders: 'leaders',
  gallery: 'gallery_items',
  news: 'news',
  opportunities: 'opportunities',
  'academic-resources': 'academic_resources',
}

export async function GET(_request: Request, context: { params: Promise<{ collection: string }> }) {
  const { collection } = await context.params
  if (!Object.hasOwn(PUBLIC_COLLECTIONS, collection)) return Response.json({ error: 'Unknown collection.' }, { status: 404 })
  const table = PUBLIC_COLLECTIONS[collection]
  if (!table) return Response.json({ error: 'Unknown collection.' }, { status: 404 })

  const client = await getPool().connect()
  try {
    const hasPublicationState = await hasColumn(table, 'is_published')
    await client.query('BEGIN')
    await client.query('SET LOCAL ROLE anon')
    await client.query("SELECT set_config('request.jwt.claims', '{\"role\":\"anon\"}', true)")
    const publicationFilter = hasPublicationState ? 'WHERE is_published IS TRUE' : ''
    const result = await client.query(`SELECT * FROM public.${table} ${publicationFilter} ORDER BY created_at DESC NULLS LAST LIMIT 100`)
    await client.query('COMMIT')
    return Response.json({ rows: result.rows }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    await client.query('ROLLBACK').catch(() => {})
    return Response.json({ error: 'Content is temporarily unavailable.' }, { status: 503 })
  } finally {
    client.release()
  }
}
