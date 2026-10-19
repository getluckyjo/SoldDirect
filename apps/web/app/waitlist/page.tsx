import { apiGet } from '@/lib/api';
import { dmy } from '@/lib/format';
import type { LeadRow, NdaRow } from '@/lib/types';

const ROLE: Record<string, { label: string; cls: string }> = {
  seller: { label: 'Selling', cls: 'bg-brand-100 text-brand-800' },
  buyer: { label: 'Buying', cls: 'bg-blue-100 text-blue-800' },
  other: { label: 'Keeping an eye out', cls: 'bg-slate-100 text-slate-700' },
  investor: { label: 'Investor', cls: 'bg-purple-100 text-purple-800' },
};

export default async function WaitlistPage() {
  let leads: LeadRow[] = [];
  let requests: LeadRow[] = [];
  let ndas: NdaRow[] = [];
  let error = false;
  try {
    [leads, requests, ndas] = await Promise.all([
      apiGet<{ leads: LeadRow[] }>('/api/leads?kind=waitlist').then(
        (r) => r.leads,
      ),
      apiGet<{ leads: LeadRow[] }>('/api/leads?kind=investor').then(
        (r) => r.leads,
      ),
      apiGet<{ signatures: NdaRow[] }>('/api/dataroom/nda').then(
        (r) => r.signatures,
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
        <h1 className="text-2xl font-bold">Signed NDAs</h1>
        <p className="text-slate-600">
          Investors who signed the NDA on the investor site, newest first. Each
          one received a personal data-room link by email.
        </p>
      </div>
      {error ? null : ndas.length === 0 ? (
        <p className="text-slate-600">No signatures yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Firm</th>
                <th className="px-4 py-2">Signed</th>
                <th className="px-4 py-2">Opened</th>
                <th className="px-4 py-2">Version</th>
              </tr>
            </thead>
            <tbody>
              {ndas.map((n) => (
                <tr key={n.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <div className="font-medium">{n.name}</div>
                    <a
                      href={`mailto:${n.email}`}
                      className="text-brand-700 hover:underline"
                    >
                      {n.email}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{n.firm ?? '—'}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {dmy(n.signedAt)}
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {n.revokedAt
                      ? 'Revoked'
                      : n.openCount === 0
                        ? 'Not yet'
                        : `${n.openCount}× · last ${dmy(n.lastOpenedAt!)}`}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{n.ndaVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Introduction requests</h2>
        <p className="text-slate-600">
          From the investor site&apos;s contact form, newest first. Each one was
          acknowledged by email.
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
