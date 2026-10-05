import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { DealRow, LeadRow, ListingRow } from '@/lib/types';

export default async function Home() {
  let listings = 0;
  let deals = 0;
  let waitlist = 0;
  let error = false;
  try {
    const [l, d, w] = await Promise.all([
      apiGet<{ listings: ListingRow[] }>('/api/listings'),
      apiGet<{ deals: DealRow[] }>('/api/deals'),
      apiGet<{ leads: LeadRow[] }>('/api/leads?kind=waitlist'),
    ]);
    listings = l.listings.length;
    deals = d.deals.length;
    // People, not form submissions — matches the Waitlist page's count.
    waitlist = new Set(w.leads.map((lead) => lead.email.toLowerCase())).size;
  } catch {
    error = true;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-slate-600">
          Listings, deals and the waitlist across Sold Direct.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Could not reach the API. Check the API is running and API_INTERNAL_URL
          / INTERNAL_API_TOKEN are set.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/listings"
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300"
          >
            <p className="text-sm text-slate-500">Listings</p>
            <p className="mt-1 text-4xl font-extrabold">{listings}</p>
          </Link>
          <Link
            href="/deals"
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300"
          >
            <p className="text-sm text-slate-500">Deals</p>
            <p className="mt-1 text-4xl font-extrabold">{deals}</p>
          </Link>
          <Link
            href="/waitlist"
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300"
          >
            <p className="text-sm text-slate-500">Waitlist</p>
            <p className="mt-1 text-4xl font-extrabold">{waitlist}</p>
          </Link>
        </div>
      )}
    </div>
  );
}
