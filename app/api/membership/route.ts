import { getPool, readJsonObject, validateSameOrigin } from '@/lib/db'
import { parseMembershipSubmission } from '@/lib/submission-validation'

export const runtime = 'nodejs'

function isDuplicateStudentId(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'
    && 'constraint' in error && error.constraint === 'members_student_id_key'
}

export async function POST(request: Request) {
  if (!(await validateSameOrigin(request))) {
    return Response.json({ error: 'Please submit this form from the JULSA website.' }, { status: 403 })
  }

  const body = await readJsonObject(request, 16_000)
  if (!body) return Response.json({ error: 'Invalid form submission.' }, { status: 400 })

  const parsed = parseMembershipSubmission(body)
  if (!parsed.ok) {
    if (parsed.spam) return Response.json({ error: 'Invalid form submission.' }, { status: 400 })
    return Response.json({ error: parsed.error }, { status: 400 })
  }
  const { fullName, studentId, yearOfStudy, phone, email, idempotencyKey } = parsed.value

  let client
  try {
    client = await getPool().connect()
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))', ['membership-idempotency', idempotencyKey])

    // This narrow lookup runs only on the server before switching to the public role.
    // It returns booleans only and lets retries confirm the original insert without
    // granting public SELECT access to membership applications.
    const prior = await client.query(
      `SELECT
         EXISTS (SELECT 1 FROM public.members WHERE idempotency_key = $1::uuid) AS key_exists,
         EXISTS (SELECT 1 FROM public.members
           WHERE idempotency_key = $1::uuid AND full_name = $2 AND student_id = $3
             AND year_of_study = $4 AND phone = $5 AND email = $6) AS same_submission`,
      [idempotencyKey, fullName, studentId, yearOfStudy, phone, email],
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
      `INSERT INTO public.members (full_name, student_id, year_of_study, phone, email, idempotency_key)
       VALUES ($1, $2, $3, $4, $5, $6::uuid)`,
      [fullName, studentId, yearOfStudy, phone, email, idempotencyKey],
    )

    if (inserted.rowCount !== 1) {
      await client.query('ROLLBACK')
      return Response.json({ error: 'That student ID is already registered. Check it or contact JULSA if you need help.' }, { status: 409 })
    }

    await client.query('COMMIT')
    return Response.json({ success: true }, { status: 201 })
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {})
    if (isDuplicateStudentId(error)) {
      return Response.json({ error: 'That student ID is already registered. Check it or contact JULSA if you need help.' }, { status: 409 })
    }
    return Response.json({ error: 'We could not save your registration right now. Please try again.' }, { status: 503 })
  } finally {
    client?.release()
  }
}
