import { NextResponse, type NextRequest } from 'next/server';

/**
 * Server-side proxy for the live demo: the browser talks to this route, this
 * route talks to the API's demo simulator with the demo-scoped token. The
 * token never reaches the browser, and only the simulator's own endpoints
 * are reachable — nothing else on the internal API.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
const TOKEN = process.env.DEMO_ACCESS_TOKEN ?? '';

/** Only numbers in the simulator's reserved range may pass. */
const DEMO_PHONE_RE = /^\+2700\d{7}$/;
const MEDIA_ID_RE = /^[A-Za-z0-9_-]{1,80}$/;

const GET_PATHS = new Set(['conversation', 'state']);
const POST_PATHS = new Set(['messages', 'photo', 'journey']);

// Per-IP ceiling: the simulator may call the AI concierge on every message,
// so a runaway client should not be able to burn through the budget. In
// memory, so per-instance on serverless — enough to blunt abuse.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 400;
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

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  );
}

function notConfigured() {
  return NextResponse.json({ error: 'demo_not_configured' }, { status: 503 });
}

async function forward(path: string, init: RequestInit): Promise<NextResponse> {
  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}/api/demo/${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        'x-internal-token': TOKEN,
      },
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[demo-proxy] API unreachable:', err);
    return NextResponse.json(
      { error: 'upstream_unavailable' },
      { status: 502 },
    );
  }
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  });
}

type Context = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: Context) {
  if (!TOKEN) return notConfigured();
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  const { path } = await context.params;
  const [head, id, ...rest] = path;

  if (head === 'media' && id && rest.length === 0) {
    if (!MEDIA_ID_RE.test(id)) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    let upstream: Response;
    try {
      upstream = await fetch(
        `${API_BASE}/api/demo/media/${encodeURIComponent(id)}?token=${encodeURIComponent(TOKEN)}`,
        { cache: 'no-store' },
      );
    } catch {
      return NextResponse.json(
        { error: 'upstream_unavailable' },
        { status: 502 },
      );
    }
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'image/jpeg',
        'cache-control': 'private, max-age=3600',
      },
    });
  }

  if (!head || !GET_PATHS.has(head) || id !== undefined) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  const phone = request.nextUrl.searchParams.get('phone') ?? '';
  if (!DEMO_PHONE_RE.test(phone)) {
    return NextResponse.json({ error: 'invalid_demo_phone' }, { status: 400 });
  }
  return forward(`${head}?phone=${encodeURIComponent(phone)}`, {
    method: 'GET',
  });
}

export async function POST(request: NextRequest, context: Context) {
  if (!TOKEN) return notConfigured();
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  const { path } = await context.params;
  const [head, ...rest] = path;
  if (!head || !POST_PATHS.has(head) || rest.length > 0) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  let body: { phone?: unknown };
  try {
    body = (await request.json()) as { phone?: unknown };
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (typeof body.phone !== 'string' || !DEMO_PHONE_RE.test(body.phone)) {
    return NextResponse.json({ error: 'invalid_demo_phone' }, { status: 400 });
  }
  return forward(head, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}
