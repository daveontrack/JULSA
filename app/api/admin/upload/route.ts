import { authorizeAdminApi } from '@/lib/admin-auth'
import { validateSameOrigin } from '@/lib/db'

export const runtime = 'nodejs'

const MAX_FILE_BYTES = 10 * 1024 * 1024
const BUCKET = 'julsa-public-files'

const TYPES = {
  'image/jpeg': { extension: 'jpg', signature: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  'image/png': { extension: 'png', signature: (bytes: Uint8Array) => bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 },
  'image/gif': { extension: 'gif', signature: (bytes: Uint8Array) => String.fromCharCode(...bytes.subarray(0, 6)) === 'GIF87a' || String.fromCharCode(...bytes.subarray(0, 6)) === 'GIF89a' },
  'image/webp': { extension: 'webp', signature: (bytes: Uint8Array) => String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP' },
  'application/pdf': { extension: 'pdf', signature: (bytes: Uint8Array) => String.fromCharCode(...bytes.subarray(0, 5)) === '%PDF-' },
} satisfies Record<string, { extension: string; signature: (bytes: Uint8Array) => boolean }>

export async function POST(request: Request) {
  if (!(await validateSameOrigin(request))) return Response.json({ error: 'Request origin could not be verified.' }, { status: 403 })
  const access = await authorizeAdminApi()
  if (access.response) return access.response
  if (!access.session) return Response.json({ error: 'Administrator sign-in required.' }, { status: 401 })
  const session = access.session

  const contentLength = Number(request.headers.get('content-length'))
  if (!Number.isFinite(contentLength) || contentLength <= 0) {
    return Response.json({ error: 'A bounded file upload is required.' }, { status: 411 })
  }
  if (contentLength > MAX_FILE_BYTES + 128_000) {
    return Response.json({ error: 'Files must be 10 MB or smaller.' }, { status: 413 })
  }

  let file: FormDataEntryValue | null
  try { file = (await request.formData()).get('file') }
  catch { return Response.json({ error: 'Choose a valid file to upload.' }, { status: 400 }) }
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_FILE_BYTES) {
    return Response.json({ error: 'Choose a non-empty file that is 10 MB or smaller.' }, { status: 400 })
  }

  const kind = TYPES[file.type as keyof typeof TYPES]
  if (!kind) return Response.json({ error: 'Only JPEG, PNG, GIF, WebP, and PDF files are allowed.' }, { status: 415 })
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!kind.signature(bytes)) return Response.json({ error: 'The file content does not match its declared type.' }, { status: 415 })

  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const anonKey = process.env.SUPABASE_ANON_KEY
  if (!baseUrl || !anonKey) return Response.json({ error: 'File storage is not configured.' }, { status: 503 })

  const objectPath = `${session.id}/${crypto.randomUUID()}.${kind.extension}`
  const objectUrl = `${baseUrl}/storage/v1/object/${BUCKET}/${objectPath.split('/').map(encodeURIComponent).join('/')}`
  try {
    const response = await fetch(objectUrl, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'x-upsert': 'false',
      },
      body: bytes,
      cache: 'no-store',
    })
    if (!response.ok) return Response.json({ error: 'Upload failed. Confirm the storage migration is applied and try again.' }, { status: 502 })
  } catch {
    return Response.json({ error: 'File storage is temporarily unavailable. Please try again.' }, { status: 503 })
  }

  const publicUrl = `${baseUrl}/storage/v1/object/public/${BUCKET}/${objectPath.split('/').map(encodeURIComponent).join('/')}`
  return Response.json({ url: publicUrl }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
