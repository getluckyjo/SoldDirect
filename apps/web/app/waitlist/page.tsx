import { apiGet } from '@/lib/api';
import { dmy } from '@/lib/format';
import type { LeadRow } from '@/lib/types';

const ROLE: Record<string, { label: string; cls: string }> = {
  seller: { label: 'Selling', cls: 'bg-brand-100 text-brand-800' },
  buyer: { label: 'Buying', cls: 'bg-blue-100 text-blue-800' },
  other: { label: 'Keeping an eye out', cls: 'bg-slate-100 text-slate-700' },
  investor: { label: 'Investor', cls: 'bg-purple-100 text-purple-800' },
};

export default async function WaitlistPage() {
  let leads: LeadRow[] = [];
  let requests: LeadRow[] = [];
  let error = false;
  try {
    [leads, requests] = await Promise.all([
      apiGet<{ leads: LeadRow[] }>('/api/leads?kind=waitlist').then(
        (r) => r.leads,
      ),
      apiGet<{ leads: LeadRow[] }>('/api/leads?kind=investor').then(
        (r) => r.leads,
      ),
    ]);
  } catch {
    error = true;
  }

  // Someone can sign up twice; count people, not form submissions. The list
  // is newest first, so the first row per address is their latest answer.
  const latest = new Map<string, LeadRow>();
  for (const l of leads) {
    const key = l.email.toLowerCase();
    if (!latest.has(key)) latest.set(key, l);
  }
  const people = [...latest.values()];
  const count = (role: string) => people.filter((l) => l.role === role).length;
  const tiles = [
    { label: 'People', value: people.length },
    { label: 'Selling', value: count('seller') },
    { label: 'Buying', value: count('buyer') },
    {
      label: 'WhatsApp opt-in',
      value: people.filter((l) => l.whatsappConsentAt).length,
    },
  ];

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-bold">Data-room requests</h1>
        <p className="text-slate-600">
          From the investor site, newest first. Each one was acknowledged by
          email; the NDA and the data room go out by hand.
        </p>
      </div>
      {error ? null : requests.length === 0 ? (
        <p className="text-slate-600">No requests yet.</p>
      ) : (
        <ul className="grid gap-3">
          {requests.map((l) => (
            <li
              key={l.id}
              className="grid gap-2 rounded-2xl border border-purple-200 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-start"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {l.name ?? (
                      <span className="text-slate-400">No name given</span>
                    )}
                  </span>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                    Investor
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  <a
                    href={`mailto:${l.email}?subject=Sold%20Direct%20data%20room`}
                    className="break-all text-brand-700 hover:underline"
                  >
                    {l.email}
                  </a>
                </div>
                {l.message ? (
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                    {l.message}
                  </p>
                ) : null}
              </div>
              <div className="text-xs text-slate-400 sm:text-right">
                {dmy(l.createdAt)}
                {l.source ? <div>{l.source}</div> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Waitlist</h2>
        <p className="text-slate-600">
          Sign-ups from the marketing site, newest first.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Could not reach the API.
        </p>
      ) : leads.length === 0 ? (
        <p className="text-slate-600">No sign-ups yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((t) => (
              <div
                key={t.label}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-sm text-slate-500">{t.label}</p>
                <p className="mt-1 text-3xl font-extrabold">{t.value}</p>
              </div>
            ))}
          </div>
          <ul className="grid gap-3">
            {leads.map((l) => {
              const role = l.role ? ROLE[l.role] : undefined;
              const repeat = latest.get(l.email.toLowerCase()) !== l;
              return (
                <li
                  key={l.id}
                  className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {l.name ?? (
                          <span className="text-slate-400">No name given</span>
                        )}
                      </span>
                      {role ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${role.cls}`}
                        >
                          {role.label}
                        </span>
                      ) : null}
                      {l.whatsappConsentAt ? (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                          WhatsApp ✓
                        </span>
                      ) : null}
                      {repeat ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Earlier sign-up
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                      <a
                        href={`mailto:${l.email}`}
                        className="break-all text-brand-700 hover:underline"
                      >
                        {l.email}
                      </a>
                      {l.phone ? (
                        <a href={`tel:${l.phone}`} className="hover:underline">
                          {l.phone}
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 sm:text-right">
                    {dmy(l.createdAt)}
                    {l.source ? <div>{l.source}</div> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
