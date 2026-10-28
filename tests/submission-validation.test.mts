import assert from 'node:assert/strict'
import test from 'node:test'
import { parseContactSubmission, parseMembershipSubmission } from '../lib/submission-validation.ts'

const key = 'a0b1c2d3-e4f5-4678-8abc-1234567890ab'

test('membership values are trimmed, normalized, and validated', () => {
  const result = parseMembershipSubmission({
    fullName: '  Selam Tesfaye  ', studentId: ' ju-123 ', year: '3', phone: '+251 911 222 333',
    email: ' STUDENT@EXAMPLE.EDU ', consent: true, idempotencyKey: key,
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(result.value, {
    fullName: 'Selam Tesfaye', studentId: 'JU-123', yearOfStudy: '3',
    phone: '+251 911 222 333', email: 'student@example.edu', idempotencyKey: key,
  })
})

test('membership rejects invalid year, consent, phone, email, and oversized fields', () => {
  const valid = { fullName: 'Selam Tesfaye', studentId: 'JU-123', year: '3', phone: '+251911222333', email: 's@example.edu', consent: true, idempotencyKey: key }
  for (const invalid of [
    { ...valid, year: '6' }, { ...valid, consent: false }, { ...valid, phone: 'call me' }, { ...valid, phone: '-------' },
    { ...valid, email: 'not-an-email' }, { ...valid, fullName: 'x'.repeat(121) },
    { ...valid, idempotencyKey: 'not-a-uuid' },
  ]) assert.equal(parseMembershipSubmission(invalid).ok, false)
})

test('membership honeypot is rejected as spam rather than reported as saved', () => {
  const result = parseMembershipSubmission({ website: 'bot-filled-this' })
  assert.equal(result.ok, false)
  assert.equal('spam' in result && result.spam, true)
  assert.equal('spam' in parseMembershipSubmission({ website: 'x'.repeat(5000) }), true)
})

test('contact values normalize and allow optional phone and subject', () => {
  const result = parseContactSubmission({ name: '  Dawit Abebe ', email: ' D@EXAMPLE.ORG ', message: 'Please contact me about the moot court.', phone: '', subject: '', idempotencyKey: key })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(result.value, {
    name: 'Dawit Abebe', email: 'd@example.org', message: 'Please contact me about the moot court.',
    phone: null, subject: null, idempotencyKey: key,
  })
})

test('contact rejects invalid required and optional fields and overlong content', () => {
  const valid = { name: 'Dawit Abebe', email: 'd@example.org', message: 'Please contact me about the moot court.', phone: '', subject: '', idempotencyKey: key }
  for (const invalid of [
    { ...valid, name: 'x' }, { ...valid, email: 'invalid' }, { ...valid, message: 'short' },
    { ...valid, phone: 'not a phone' }, { ...valid, phone: '-------' }, { ...valid, subject: 's'.repeat(181) },
    { ...valid, message: 'm'.repeat(5001) }, { ...valid, idempotencyKey: 'invalid' },
  ]) assert.equal(parseContactSubmission(invalid).ok, false)
})

test('contact honeypot is rejected as spam rather than reported as saved', () => {
  const result = parseContactSubmission({ website: 'bot-filled-this' })
  assert.equal(result.ok, false)
  assert.equal('spam' in result && result.spam, true)
})
