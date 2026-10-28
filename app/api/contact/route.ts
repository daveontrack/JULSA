import { getPool, readJsonObject, validateSameOrigin } from '@/lib/db'
import { parseContactSubmission } from '@/lib/submission-validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!(await validateSameOrigin(request))) {
    return Response.json({ error: 'Please submit this form from the JULSA website.' }, { status: 403 })
  }

  const body = await readJsonObject(request, 32_000)
  if (!body) return Response.json({ error: 'Invalid form submission.' }, { status: 400 })

  const parsed = parseContactSubmission(body)
  if (!parsed.ok) {
    if (parsed.spam) return Response.json({ error: 'Invalid form submission.' }, { status: 400 })
    return Response.json({ error: parsed.error }, { status: 400 })
  }
  const { name, email, phone, subject, message, idempotencyKey } = parsed.value

  let client
  try {
    client = await getPool().connect()
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))', ['contact-idempotency', idempotencyKey])

    // Check only whether this idempotency key matches this payload. The API never
    // returns message contents, and this check runs server-side before public RLS role.
    const prior = await client.query(
      `SELECT
         EXISTS (SELECT 1 FROM public.contact_messages WHERE idempotency_key = $1::uuid) AS key_exists,
         EXISTS (SELECT 1 FROM public.contact_messages
           WHERE idempotency_key = $1::uuid AND name = $2 AND email = $3
             AND phone IS NOT DISTINCT FROM $4::varchar
             AND subject IS NOT DISTINCT FROM $5::varchar AND message = $6) AS same_submission`,
      [idempotencyKey, name, email, phone, subject, message],
    )

    if (prior.rows[0]?.key_exists) {
      if (!prior.rows[0].same_submission) {
        await client.query('ROLLBACK')
        return Response.json({ error: 'This submission could not be safely retried. Refresh the form and submit again.' }, { status: 409 })
      }
      await client.query('COMMIT')
      return Response.json({ success: true }, { status: 200 })
    }

    await client.query('SET LOCAL ROLE anon')
    await client.query("SELECT set_config('request.jwt.claims', '{\"role\":\"anon\"}', true)")
    const inserted = await client.query(
      `INSERT INTO public.contact_messages (name, email, phone, subject, message, idempotency_key)
       VALUES ($1, $2, $3, $4, $5, $6::uuid)`,
      [name, email, phone, subject, message, idempotencyKey],
    )

    if (inserted.rowCount !== 1) {
      await client.query('ROLLBACK')
      return Response.json({ error: 'We could not confirm that your message was saved. Please try again.' }, { status: 503 })
    }

    await client.query('COMMIT')
    return Response.json({ success: true }, { status: 201 })
  } catch {
    if (client) await client.query('ROLLBACK').catch(() => {})
    return Response.json({ error: 'We could not save your message right now. Please try again.' }, { status: 503 })
  } finally {
    client?.release()
  }
}
