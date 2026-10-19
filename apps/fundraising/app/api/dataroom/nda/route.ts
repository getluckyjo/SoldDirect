import { NextResponse, type NextRequest } from 'next/server';
import { NDA_VERSION } from '@/content/nda';
import { ndaConfigured } from '@/lib/dataroom-auth';

// Server-to-server: the browser never talks to the API directly.
const API_BASE = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

// Per-IP brake on signatures. In-memory, so per instance on serverless —
// enough to blunt a script without adding a dependency.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; windowStart: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function redirectTo(request: NextRequest, pathAndQuery: string) {
  return NextResponse.redirect(new URL(pathAndQuery, request.url), 303);
}

/**
 * The NDA signature form posts here. The site validates, stamps the evidence
 * (IP, user agent) and hands the signature to the API, which stores it and
 * emails the personal link. The browser lands back on the gate with a
 * "check your inbox" message: no session is opened until the link is used,
 * which is what verifies the email address.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = String(form.get('next') ?? '');
  const back = (query: string) =>
    redirectTo(
      request,
      `/dataroom?${query}${next ? `&next=${encodeURIComponent(next)}` : ''}`,
    );

  // Bots that fill the honeypot get a quiet "sent" and nothing stored.
  if (String(form.get('website') ?? '').trim()) return back('sent=1');

  if (!ndaConfigured()) return back('error=closed');

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const firm = String(form.get('firm') ?? '').trim();
  const agreed = form.get('agree') === 'on';
  if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return back('error=fields');
  }
  if (!agreed) return back('error=agree');

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) return back('error=rate');

  try {
    const res = await fetch(`${API_BASE}/api/dataroom/nda`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        firm: firm || undefined,
        ndaVersion: NDA_VERSION,
        ip: ip === 'unknown' ? undefined : ip,
        userAgent: request.headers.get('user-agent') ?? undefined,
      }),
    });
    if (!res.ok) {
      console.error(
        `[dataroom-nda] API rejected signature (status ${res.status})`,
      );
      return back('error=upstream');
    }
    const data = (await res.json()) as { emailed?: boolean };
    return back(data.emailed === false ? 'error=email' : 'sent=1');
  } catch (err) {
    console.error(
      '[dataroom-nda] API unreachable — signature NOT stored:',
      err,
    );
    return back('error=upstream');
  }
}
