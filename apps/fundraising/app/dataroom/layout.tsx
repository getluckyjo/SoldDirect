import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';
import { currentViewer, isAuthorised } from '@/lib/dataroom-auth';

export const metadata: Metadata = {
  title: 'Sold Direct — Investor data room',
  description:
    'Confidential investor materials, for prospective investors under NDA.',
  robots: { index: false, follow: false, noarchive: true },
};

export default async function DataroomLayout({
  children,
}: {
  children: ReactNode;
}) {
  const open = await isAuthorised();
  const viewer = open ? await currentViewer() : null;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-navy">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/dataroom" className="inline-flex items-baseline">
            <Logo className="text-lg" />
            <span className="ml-2 hidden text-sm text-slate-400 sm:inline">
              Data room
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-200 sm:inline">
              Confidential
            </span>
            <Link href="/" className="text-slate-300 hover:text-sky-200">
              Investor site
            </Link>
            {viewer ? (
              <span
                className="hidden max-w-[12rem] truncate text-slate-400 md:inline"
                title={viewer.name}
              >
                {viewer.name}
              </span>
            ) : null}
            {open ? (
              <form method="post" action="/api/dataroom/session">
                <input type="hidden" name="action" value="signout" />
                <button
                  type="submit"
                  className="text-slate-300 hover:text-sky-200"
                >
                  Sign out
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-8 text-xs leading-relaxed text-slate-500">
          Prepared for prospective investors under NDA. Not an offer to the
          public. Projections are illustrative and unaudited, with the sourcing
          caveats stated in each document. Do not forward.
        </div>
      </footer>
    </div>
  );
}
