import { NextResponse, type NextRequest } from 'next/server';
import {
  DATAROOM_COOKIE,
  VIEWER_COOKIE,
  newSessionCookie,
  passwordMatches,
  safeNext,
} from '@/lib/dataroom-auth';

// Password attempts are rate-limited per IP. In-memory, so per instance on
// serverless — enough to blunt guessing without adding a dependency.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const attempts = new Map<string, { count: number; windowStart: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function redirectTo(request: NextRequest, pathAndQuery: string) {
  return NextResponse.redirect(new URL(pathAndQuery, request.url), 303);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const action = String(form.get('action') ?? 'signin');
  const next = safeNext(String(form.get('next') ?? ''));

  if (action === 'signout') {
    const res = redirectTo(request, '/dataroom');
    res.cookies.set({ name: DATAROOM_COOKIE, value: '', path: '/', maxAge: 0 });
    res.cookies.set({ name: VIEWER_COOKIE, value: '', path: '/', maxAge: 0 });
    return res;
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const query = `next=${encodeURIComponent(next)}`;
  if (rateLimited(ip)) {
    return redirectTo(request, `/dataroom?error=rate&${query}`);
  }

  const password = String(form.get('password') ?? '');
  if (!passwordMatches(password)) {
    return redirectTo(request, `/dataroom?error=password&${query}`);
  }

  const res = redirectTo(request, next);
  res.cookies.set(newSessionCookie());
  return res;
}
