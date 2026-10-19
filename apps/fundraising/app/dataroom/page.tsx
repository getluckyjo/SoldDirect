import Link from 'next/link';
import { Gate } from '@/components/dataroom/Gate';
import {
  dataroomConfigured,
  isAuthorised,
  ndaConfigured,
  safeNext,
} from '@/lib/dataroom-auth';
import {
  KIND_ACTION,
  KIND_LABEL,
  availableEntries,
  hrefFor,
} from '@/lib/dataroom';

export const dynamic = 'force-dynamic';

export default async function DataroomIndex({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; sent?: string }>;
}) {
  const { error, next, sent } = await searchParams;
  if (!(await isAuthorised())) {
    return (
      <Gate
        next={safeNext(next)}
        error={error}
        sent={sent === '1'}
        ndaOpen={ndaConfigured()}
        passwordOpen={dataroomConfigured()}
      />
    );
  }

  const entries = await availableEntries();
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-sky-300">
        Seed round · R5m for 20%
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Investor data room
      </h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        Start with the overview, then the financial model and the term sheet.
        The Excel model is the working file: edit the amber inputs and every tab
        recalculates.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {entries.map((entry, i) => {
          const external = entry.kind !== 'doc';
          return (
            <li key={entry.slug}>
              <Link
                href={hrefFor(entry)}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-navy-950/60 p-5 transition hover:border-brand-500/60 hover:bg-navy-950"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-sky-400">
                  {String(i + 1).padStart(2, '0')} · {KIND_LABEL[entry.kind]}
                </p>
                <h2 className="mt-1.5 text-lg font-semibold text-white">
                  {entry.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                  {entry.blurb}
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-400">
                  {KIND_ACTION[entry.kind]}{' '}
                  {entry.kind === 'doc' ? '→' : external ? '↗' : '↓'}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 rounded-2xl border border-sky-400/40 bg-sky-600/25 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="font-semibold text-white">See the product work</h2>
          <p className="mt-1 text-sm text-slate-200">
            Sell a Cape Town home over WhatsApp on the live pipeline, from Quick
            Estimate to registration.
          </p>
        </div>
        <Link
          href="/try"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex shrink-0 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-brand-400 sm:mt-0"
        >
          Open the live demo ↗
        </Link>
      </div>
    </div>
  );
}
