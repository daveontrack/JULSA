import type { PoolClient } from 'pg'
import { authorizeAdminApi, runAsAdmin } from '@/lib/admin-auth'
import { readJsonObject, validateSameOrigin } from '@/lib/db'

export const runtime = 'nodejs'

const COLLECTIONS = {
  events: 'events',
  'blog-posts': 'blog_posts',
  competitions: 'competitions',
  leaders: 'leaders',
  gallery: 'gallery_items',
  news: 'news',
  opportunities: 'opportunities',
  'academic-resources': 'academic_resources',
  members: 'members',
  contacts: 'contact_messages',
} as const

type Collection = keyof typeof COLLECTIONS

const STATUS_OPTIONS: Partial<Record<Collection, string[]>> = {
  members: ['Pending', 'Approved', 'Rejected'],
  contacts: ['Unread', 'Read', 'Archived', 'Replied'],
  competitions: ['Upcoming', 'Registration Open', 'Completed'],
  opportunities: ['Open', 'Upcoming', 'Closed'],
}
const DELETE_DEPENDENTS: Partial<Record<Collection, { table: string; foreignKey: string }>> = {
  events: { table: 'event_registrations', foreignKey: 'event_id' },
  competitions: { table: 'competition_registrations', foreignKey: 'competition_id' },
}

class AdminInputError extends Error {}
class AdminNotFoundError extends Error {}

function getCollection(value: string | null): { key: Collection; table: string } | null {
  if (!value || !Object.hasOwn(COLLECTIONS, value)) return null
  const key = value as Collection
  return { key, table: COLLECTIONS[key] }
}

function collectionFromBody(body: Record<string, unknown>) {
  return typeof body.collection === 'string' ? getCollection(body.collection) : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

async function columns(client: PoolClient, table: string) {
  const result = await client.query(
    `SELECT column_name, data_type, is_nullable, column_default,
            character_maximum_length, numeric_precision
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    [table],
  )
  return result.rows
}

const SYSTEM_FIELDS = new Set(['id', 'created_at', 'updated_at', 'idempotency_key'])
const NUMERIC_TYPES = new Set(['smallint', 'integer', 'bigint', 'numeric', 'real', 'double precision'])

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

function validateData(data: Record<string, unknown>, schema: Awaited<ReturnType<typeof columns>>, create: boolean, collection: Collection) {
  const byName = new Map(schema.map((column) => [column.column_name as string, column]))
  const entries: Array<[string, unknown]> = []
  for (const [key, raw] of Object.entries(data)) {
    if (!byName.has(key) || SYSTEM_FIELDS.has(key)) throw new AdminInputError(`Unknown or read-only field: ${key}`)
    if (raw === undefined) continue
    const column = byName.get(key)
    if (!column) throw new AdminInputError('Unknown field')
    const dataType = String(column.data_type)
    let value = raw

    if (value === null) {
      if (column.is_nullable === 'NO') throw new AdminInputError(`${key} is required`)
    } else if (dataType === 'boolean') {
      if (typeof value !== 'boolean') throw new AdminInputError(`${key} must be true or false`)
    } else if (NUMERIC_TYPES.has(dataType)) {
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new AdminInputError(`${key} must be numeric`)
      if (['smallint', 'integer', 'bigint'].includes(dataType) && !Number.isInteger(value)) throw new AdminInputError(`${key} must be a whole number`)
    } else if (dataType === 'ARRAY') {
      if (!Array.isArray(value) || value.length > 200 || value.some((item) => typeof item !== 'string' || item.length > 500)) {
        throw new AdminInputError(`${key} must be a list of short text values`)
      }
    } else if (dataType === 'json' || dataType === 'jsonb') {
      if (typeof value !== 'object') throw new AdminInputError(`${key} must contain valid JSON`)
      if (JSON.stringify(value).length > 100_000) throw new AdminInputError(`${key} is too large`)
    } else {
      if (typeof value !== 'string') throw new AdminInputError(`${key} must be text`)
      const maxLength = Number(column.character_maximum_length) || 200_000
      if (value.length > maxLength) throw new AdminInputError(`${key} exceeds its maximum length`)
      const textValue = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
      if (column.is_nullable === 'NO' && textValue.length === 0) throw new AdminInputError(`${key} is required`)
      if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)) throw new AdminInputError(`${key} is not valid`)
      value = textValue
    }
    const statusOptions = key === 'status' ? STATUS_OPTIONS[collection] : undefined
    if (statusOptions && typeof value === 'string' && !statusOptions.includes(value)) {
      throw new AdminInputError(`${key} must be one of the permitted values`)
    }
    entries.push([key, value])
  }

  if (create) {
    for (const column of schema) {
      const name = String(column.column_name)
      if (!SYSTEM_FIELDS.has(name) && column.is_nullable === 'NO' && !column.column_default && !entries.some(([key]) => key === name)) {
        throw new AdminInputError(`${name} is required`)
      }
    }
  }
  if (!entries.length) throw new AdminInputError('No editable fields supplied')
  return entries
}

function errorResponse() {
  return Response.json({ error: 'The dashboard could not complete this request. Check the data and try again.' }, { status: 500 })
}

function badRequestResponse() {
  return Response.json({ error: 'The submitted record is invalid. Check its fields and try again.' }, { status: 400 })
}

function databaseErrorResponse(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : ''
  if (code === '23505') return Response.json({ error: 'A record with that unique value already exists.' }, { status: 409 })
  if (['23502', '23503', '23514', '22P02'].includes(code)) {
    return Response.json({ error: 'The submitted values do not satisfy this record’s requirements.' }, { status: 400 })
  }
  return errorResponse()
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function adminUser() {
  const access = await authorizeAdminApi()
  return access.session
    ? { user: { id: access.session.id, email: access.session.email }, response: null }
    : { user: null, response: access.response }
}

export async function GET(request: Request) {
  const auth = await adminUser()
  if (auth.response) return auth.response
  const user = auth.user!
  const collection = getCollection(new URL(request.url).searchParams.get('collection'))
  if (!collection) return Response.json({ error: 'Unknown collection.' }, { status: 404 })
  const params = new URL(request.url).searchParams
  const search = (params.get('search') ?? '').trim().slice(0, 100)
  const status = (params.get('status') ?? '').trim()
  const category = (params.get('category') ?? '').trim().slice(0, 100)
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1)
  const pageSize = Math.min(100, Math.max(10, Number.parseInt(params.get('pageSize') ?? '25', 10) || 25))

  try {
    const rows = await runAsAdmin(user, async (client) => {
      const schema = await columns(client, collection.table)
      const hasStatus = schema.some((column) => column.column_name === 'status')
      const statusOptions = STATUS_OPTIONS[collection.key]
      if (status && (!hasStatus || !statusOptions?.includes(status))) throw new AdminInputError('Unsupported status filter')
      const categoryOptions = schema.some((column) => column.column_name === 'category')
        ? (await client.query(`SELECT DISTINCT category FROM public.${collection.table} WHERE category IS NOT NULL ORDER BY category LIMIT 100`)).rows.map((row) => String(row.category))
        : []
      if (category && !categoryOptions.includes(category)) throw new AdminInputError('Unsupported category filter')
      const predicates: string[] = []
      const values: unknown[] = []
      if (search) {
        values.push(`%${search}%`)
        predicates.push(`to_jsonb(t)::text ILIKE $${values.length}`)
      }
      if (status) {
        values.push(status)
        predicates.push(`t.status = $${values.length}`)
      }
      if (category) {
        values.push(category)
        predicates.push(`t.category = $${values.length}`)
      }
      const booleanFilters: string[] = []
      for (const key of ['featured', 'is_current', 'is_published']) {
        const value = params.get(key)
        const column = schema.find((field) => field.column_name === key && field.data_type === 'boolean')
        if (value === null || !column) continue
        if (!['true', 'false'].includes(value)) throw new AdminInputError(`Invalid ${key} filter`)
        values.push(value === 'true')
        predicates.push(`t.${quoteIdentifier(key)} = $${values.length}`)
        booleanFilters.push(key)
      }
      const where = predicates.length ? `WHERE ${predicates.join(' AND ')}` : ''
      const count = await client.query(`SELECT count(*)::int AS total FROM public.${collection.table} t ${where}`, values)
      const total = Number(count.rows[0]?.total ?? 0)
      const offset = (page - 1) * pageSize
      values.push(pageSize, offset)
      const result = await client.query(
        `SELECT t.* FROM public.${collection.table} t ${where} ORDER BY t.created_at DESC NULLS LAST LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values,
      )
      return { rows: result.rows, columns: schema, total, page, pageSize, pageCount: Math.ceil(total / pageSize), statusOptions: statusOptions ?? [], categoryOptions, booleanFilters }
    })
    if (!rows) return badRequestResponse()
    return Response.json(rows, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof AdminInputError) return Response.json({ error: error.message }, { status: 400 })
    return errorResponse()
  }
}

export async function POST(request: Request) {
  if (!(await validateSameOrigin(request))) return Response.json({ error: 'Request origin could not be verified.' }, { status: 403 })
  const auth = await adminUser()
  if (auth.response) return auth.response
  const user = auth.user!
  const body = await readJsonObject(request)
  if (!body) return badRequestResponse()
  const collection = collectionFromBody(body)
  const data = body.data
  if (!collection || !isRecord(data)) return badRequestResponse()

  try {
    const row = await runAsAdmin(user, async (client) => {
      const entries = validateData(data, await columns(client, collection.table), true, collection.key)
      const names = entries.map(([key]) => quoteIdentifier(key)).join(', ')
      const values = entries.map(([, value]) => value)
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')
      const result = await client.query(`INSERT INTO public.${collection.table} (${names}) VALUES (${placeholders}) RETURNING *`, values)
      return result.rows[0]
    })
    return Response.json({ row }, { status: 201 })
  } catch (error) {
    if (error instanceof AdminInputError) return Response.json({ error: error.message }, { status: 400 })
    return databaseErrorResponse(error)
  }
}

export async function PATCH(request: Request) {
  if (!(await validateSameOrigin(request))) return Response.json({ error: 'Request origin could not be verified.' }, { status: 403 })
  const auth = await adminUser()
  if (auth.response) return auth.response
  const user = auth.user!
  const body = await readJsonObject(request)
  if (!body) return badRequestResponse()
  const collection = collectionFromBody(body)
  const data = body.data
  if (!collection || typeof body.id !== 'string' || !UUID_RE.test(body.id) || !isRecord(data)) return badRequestResponse()

  try {
    const row = await runAsAdmin(user, async (client) => {
      const schema = await columns(client, collection.table)
      const entries = validateData(data, schema, false, collection.key)
      const values = entries.map(([, value]) => value)
      const assignments = entries.map(([key], index) => `${quoteIdentifier(key)} = $${index + 1}`)
      const idIndex = values.length + 1
      if (schema.some((column) => column.column_name === 'updated_at')) assignments.push('"updated_at" = now()')
      const result = await client.query(`UPDATE public.${collection.table} SET ${assignments.join(', ')} WHERE id = $${idIndex}::uuid RETURNING *`, [...values, body.id])
      if (!result.rowCount) throw new AdminNotFoundError('Record not found')
      return result.rows[0]
    })
    return Response.json({ row })
  } catch (error) {
    if (error instanceof AdminInputError) return Response.json({ error: error.message }, { status: 400 })
    if (error instanceof AdminNotFoundError) return Response.json({ error: error.message }, { status: 404 })
    return databaseErrorResponse(error)
  }
}

export async function DELETE(request: Request) {
  if (!(await validateSameOrigin(request))) return Response.json({ error: 'Request origin could not be verified.' }, { status: 403 })
  const auth = await adminUser()
  if (auth.response) return auth.response
  const user = auth.user!
  const body = await readJsonObject(request)
  if (!body) return badRequestResponse()
  const collection = collectionFromBody(body)
  if (!collection || typeof body.id !== 'string' || !UUID_RE.test(body.id)) return badRequestResponse()
  try {
    const deleted = await runAsAdmin(user, async (client) => {
      const dependent = DELETE_DEPENDENTS[collection.key]
      if (dependent) {
        const parent = await client.query(`SELECT id FROM public.${collection.table} WHERE id = $1::uuid FOR UPDATE`, [body.id])
        if (!parent.rowCount) return { found: false, deleted: false }
        const related = await client.query(`SELECT EXISTS (SELECT 1 FROM public.${dependent.table} WHERE ${quoteIdentifier(dependent.foreignKey)} = $1::uuid) AS has_related`, [body.id])
        if (related.rows[0]?.has_related) throw new AdminInputError('This record has linked registrations. Deletion is blocked to preserve those records.')
      }
      const result = await client.query(`DELETE FROM public.${collection.table} WHERE id = $1::uuid RETURNING id`, [body.id])
      return { found: result.rowCount === 1, deleted: result.rowCount === 1 }
    })
    if (!deleted.found || !deleted.deleted) return Response.json({ error: 'Record not found.' }, { status: 404 })
    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof AdminInputError) return Response.json({ error: error.message }, { status: 409 })
    return databaseErrorResponse(error)
  }
}
