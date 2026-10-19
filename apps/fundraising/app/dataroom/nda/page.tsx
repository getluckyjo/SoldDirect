import type { Metadata } from 'next';
import Link from 'next/link';
import { NdaText } from '@/components/dataroom/NdaText';

export const metadata: Metadata = {
  title: 'Investor NDA — Sold Direct data room',
  description:
    'The non-disclosure agreement every investor signs before entering the Sold Direct data room.',
  robots: { index: false, follow: false },
};

/** The NDA in full, readable before signing and linked from the confirmation email. */
export default function NdaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dataroom"
        className="text-sm font-medium text-brand-400 hover:text-brand-300"
      >
        ← Data room
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
        The investor NDA
      </h1>
      <p className="mt-3 text-slate-300">
        Every investor signs this agreement online before the data room opens.
        It is short, one-way and governed by South African law.
      </p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-navy-950/60 p-6 sm:p-8">
        <NdaText />
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Ready?{' '}
        <Link
          href="/dataroom"
          className="font-medium text-brand-400 hover:text-brand-300"
        >
          Sign and enter the data room
        </Link>
        .
      </p>
    </div>
  );
}
