import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * The investor data room is gated by one shared password (DATAROOM_PASSWORD),
 * handed over with the NDA. A correct password sets a session cookie whose
 * value is an HMAC derived from the password itself — so rotating the
 * password signs everyone out, and the cookie never carries the password.
 */
export const DATAROOM_COOKIE = 'sd_dataroom';
const SESSION_DAYS = 30;

function secret(): string | undefined {
  const value = process.env.DATAROOM_PASSWORD?.trim();
  return value || undefined;
}

export function dataroomConfigured(): boolean {
  return secret() !== undefined;
}

function sessionToken(password: string): string {
  return createHmac('sha256', password)
    .update('dataroom-session-v1')
    .digest('hex');
}

/** Constant-time string comparison (hashes first so lengths never leak). */
function same(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function passwordMatches(input: string): boolean {
  const password = secret();
  if (!password) return false;
  return same(input, password);
}

export function sessionValid(cookie: string | undefined): boolean {
  const password = secret();
  if (!password || !cookie) return false;
  return same(cookie, sessionToken(password));
}

export function newSessionCookie() {
  const password = secret();
  if (!password) throw new Error('DATAROOM_PASSWORD is not set');
  return {
    name: DATAROOM_COOKIE,
    value: sessionToken(password),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export async function isAuthorised(): Promise<boolean> {
  const jar = await cookies();
  return sessionValid(jar.get(DATAROOM_COOKIE)?.value);
}

/** Only ever send people back inside the data room after sign-in. */
export function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith('/dataroom') || next.startsWith('//')) {
    return '/dataroom';
  }
  return next;
}
