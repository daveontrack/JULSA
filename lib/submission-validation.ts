export type MembershipSubmission = {
  fullName: string
  studentId: string
  yearOfStudy: string
  phone: string
  email: string
  idempotencyKey: string
}

export type ContactSubmission = {
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  idempotencyKey: string
}

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; spam?: never }
  | { ok: false; spam: true; error?: never }

function text(value: unknown, maxLength: number) {
  if (typeof value !== 'string' || value.normalize('NFC').length > maxLength) return null
  return value.normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
}

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isPhone(value: string) {
  return /^\+?[0-9 ()-]{7,40}$/.test(value) && value.replace(/\D/g, '').length >= 7
}

function hasHoneypot(body: Record<string, unknown>) {
  return typeof body.website === 'string' && body.website.trim().length > 0
}

function isIdempotencyKey(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function parseMembershipSubmission(body: Record<string, unknown>): ParseResult<MembershipSubmission> {
  if (hasHoneypot(body)) return { ok: false, spam: true }

  const fullName = text(body.fullName, 120)
  const studentId = text(body.studentId, 80)?.toUpperCase() ?? null
  const yearOfStudy = text(body.year, 1)
  const phone = text(body.phone, 40)
  const email = text(body.email, 254)?.toLowerCase() ?? null
  const idempotencyKey = text(body.idempotencyKey, 36)?.toLowerCase() ?? null

  if (!fullName || fullName.length < 2 || !studentId || studentId.length < 2 || !yearOfStudy || !/^[1-5]$/.test(yearOfStudy)
    || !phone || !isPhone(phone) || !email || !isEmail(email)
    || body.consent !== true || !idempotencyKey || !isIdempotencyKey(idempotencyKey)) {
    return { ok: false, error: 'Check your name, student ID, year, phone number, email, and consent, then try again.' }
  }

  return { ok: true, value: { fullName, studentId, yearOfStudy, phone, email, idempotencyKey } }
}

export function parseContactSubmission(body: Record<string, unknown>): ParseResult<ContactSubmission> {
  if (hasHoneypot(body)) return { ok: false, spam: true }

  const name = text(body.name, 120)
  const email = text(body.email, 254)?.toLowerCase() ?? null
  const phoneText = text(body.phone ?? '', 40)
  const subjectText = text(body.subject ?? '', 180)
  const message = text(body.message, 5000)
  const idempotencyKey = text(body.idempotencyKey, 36)?.toLowerCase() ?? null
  const phone = phoneText || null
  const subject = subjectText || null

  if (!name || name.length < 2 || !email || !isEmail(email) || !message || message.length < 10
    || phoneText === null || (phone !== null && !isPhone(phone))
    || subjectText === null || !idempotencyKey || !isIdempotencyKey(idempotencyKey)) {
    return { ok: false, error: 'Enter your name, a valid email address, and a message of at least 10 characters. Check the optional phone and subject fields too.' }
  }

  return { ok: true, value: { name, email, phone, subject, message, idempotencyKey } }
}
