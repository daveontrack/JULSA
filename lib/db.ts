import { Pool } from 'pg'
import { getPrisma } from '@/lib/prisma'

const globalForPg = globalThis as typeof globalThis & { julsaPool?: Pool }
const schemaChecks = new Map<string, Promise<boolean>>()

export function getPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('Database connection is not configured.')

  if (!globalForPg.julsaPool) {
    globalForPg.julsaPool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
      ssl: { rejectUnauthorized: false },
    })
  }

  return globalForPg.julsaPool
}

export function hasColumn(table: string, column: string) {
  const key = `${table}.${column}`
  let check = schemaChecks.get(key)
  if (!check) {
    check = getPrisma().$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = ${table} AND column_name = ${column}
      ) AS exists
    `.then((result) => result[0]?.exists ?? false)
    schemaChecks.set(key, check)
  }
  return check
}

export function cleanText(value: unknown, max: number) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max)
}

export function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

export async function readJsonObject(request: Request, maxBytes = 256_000): Promise<Record<string, unknown> | null> {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) return null
  if (!request.body) return null
  try {
    const reader = request.body.getReader()
    const chunks: Uint8Array[] = []
    let length = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > maxBytes) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    const text = new TextDecoder().decode(bytes)
    const value: unknown = JSON.parse(text)
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null
  } catch {
    return null
  }
}

export async function validateSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    const actual = new URL(origin).origin
    const requestUrl = new URL(request.url)
    const requestOrigin = requestUrl.origin
    if (actual === requestOrigin) return true
    const configured = process.env.NEXT_PUBLIC_SITE_URL
    if (configured && actual === new URL(configured).origin) return true
    const requestHost = request.headers.get('host')?.trim()
    if (requestHost) {
      if (actual === new URL(`${requestUrl.protocol}//${requestHost}`).origin) return true
    }
    if (process.env.NODE_ENV !== 'production') {
      const parsed = new URL(actual)
      return parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
    }
    return false
  } catch {
    return false
  }
}
