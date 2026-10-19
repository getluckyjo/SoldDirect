import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Two ways into the investor data room:
 *
 * 1. A personal session. The investor signs the NDA online, the API emails a
 *    personal link, and redeeming it sets a cookie signed with
 *    DATAROOM_SESSION_SECRET that names the signatory. This is the path for
 *    investors.
 * 2. The shared partner password (DATAROOM_PASSWORD), for the founders'
 *    partners. A correct password sets a cookie whose value is an HMAC derived
 *    from the password itself, so rotating the password signs everyone out and
 *    the cookie never carries the password.
 */
export const DATAROOM_COOKIE = 'sd_dataroom';
export const VIEWER_COOKIE = 'sd_dataroom_nda';
const SESSION_DAYS = 30;

/** Who is in the room on a personal session. */
export interface Viewer {
  id: string;
  name: string;
}

function secret(): string | undefined {
  const value = process.env.DATAROOM_PASSWORD?.trim();
  return value || undefined;
}

function sessionSecret(): string | undefined {
  const value = process.env.DATAROOM_SESSION_SECRET?.trim();
  return value || secret();
}

export function dataroomConfigured(): boolean {
  return secret() !== undefined;
}

/** The NDA path needs the API and a secret to sign personal sessions with. */
export function ndaConfigured(): boolean {
  return sessionSecret() !== undefined;
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

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

export function newSessionCookie() {
  const password = secret();
  if (!password) throw new Error('DATAROOM_PASSWORD is not set');
  return {
    ...cookieBase,
    name: DATAROOM_COOKIE,
    value: sessionToken(password),
  };
}

// ── Personal (NDA) sessions ────────────────────────────────────────────────

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

/** A signed, self-contained session: `base64url(json).signature`. */
export function newViewerCookie(viewer: Viewer) {
  const key = sessionSecret();
  if (!key) throw new Error('DATAROOM_SESSION_SECRET is not set');
  const payload = Buffer.from(
    JSON.stringify({
      id: viewer.id,
      name: viewer.name,
      exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    }),
  ).toString('base64url');
  return {
    ...cookieBase,
    name: VIEWER_COOKIE,
    value: `${payload}.${sign(payload, key)}`,
  };
}

export function viewerFromCookie(cookie: string | undefined): Viewer | null {
  const key = sessionSecret();
  if (!key || !cookie) return null;
  const dot = cookie.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = cookie.slice(0, dot);
  const signature = cookie.slice(dot + 1);
  if (!same(signature, sign(payload, key))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      id?: unknown;
      name?: unknown;
      exp?: unknown;
    };
    if (
      typeof data.id !== 'string' ||
      typeof data.name !== 'string' ||
      typeof data.exp !== 'number' ||
      data.exp < Date.now()
    ) {
      return null;
    }
    return { id: data.id, name: data.name };
  } catch {
    return null;
  }
}

/** The signatory on a personal session, or null (including on the partner password). */
export async function currentViewer(): Promise<Viewer | null> {
  const jar = await cookies();
  return viewerFromCookie(jar.get(VIEWER_COOKIE)?.value);
}

export async function isAuthorised(): Promise<boolean> {
  const jar = await cookies();
  if (sessionValid(jar.get(DATAROOM_COOKIE)?.value)) return true;
  return viewerFromCookie(jar.get(VIEWER_COOKIE)?.value) !== null;
}

/** Only ever send people back inside the data room after sign-in. */
export function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith('/dataroom') || next.startsWith('//')) {
    return '/dataroom';
  }
  return next;
}
