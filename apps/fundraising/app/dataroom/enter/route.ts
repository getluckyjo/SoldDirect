import { NextResponse, type NextRequest } from 'next/server';
import { newViewerCookie, ndaConfigured, safeNext } from '@/lib/dataroom-auth';

const API_BASE = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

/**
 * The personal link from the NDA email lands here. The token is redeemed
 * server-side with the API (which checks expiry and revocation and counts the
 * open), and a signed personal session cookie opens the room.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('t') ?? '';
  const next = safeNext(request.nextUrl.searchParams.get('next') ?? undefined);
  const fail = (code: string) =>
    NextResponse.redirect(new URL(`/dataroom?error=${code}`, request.url), 303);

  if (!ndaConfigured()) return fail('closed');
  if (token.length < 20) return fail('link');

  try {
    const res = await fetch(`${API_BASE}/api/dataroom/nda/redeem`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    });
    if (res.status === 404) return fail('link');
    if (!res.ok) return fail('upstream');
    const { viewer } = (await res.json()) as {
      viewer: { id: string; name: string };
    };
    const out = NextResponse.redirect(new URL(next, request.url), 303);
    out.cookies.set(newViewerCookie({ id: viewer.id, name: viewer.name }));
    return out;
  } catch (err) {
    console.error('[dataroom-enter] API unreachable:', err);
    return fail('upstream');
  }
}
