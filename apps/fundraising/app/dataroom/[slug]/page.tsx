import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { isAuthorised } from '@/lib/dataroom-auth';
import {
  DATAROOM_ENTRIES,
  entryBySlug,
  hrefFor,
  readDocHtml,
} from '@/lib/dataroom';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = entryBySlug(slug);
  return {
    title: entry
      ? `${entry.title} — Sold Direct data room`
      : 'Sold Direct — Investor data room',
  };
}

export default async function DataroomDoc({ params }: Props) {
  const { slug } = await params;
  const entry = entryBySlug(slug);
  if (!entry) notFound();
  if (!(await isAuthorised())) {
    redirect(`/dataroom?next=${encodeURIComponent(`/dataroom/${slug}`)}`);
  }
  if (entry.kind !== 'doc') redirect(hrefFor(entry));

  const html = await readDocHtml(entry);
  if (!html) notFound();

  const docs = DATAROOM_ENTRIES.filter((e) => e.kind === 'doc');
  const at = docs.findIndex((e) => e.slug === slug);
  const prev = at > 0 ? docs[at - 1] : undefined;
  const next = at < docs.length - 1 ? docs[at + 1] : undefined;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dataroom"
        className="text-sm font-medium text-brand-400 hover:text-brand-300"
      >
        ← Data room
      </Link>
      <article
        className="dataroom-prose mt-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <nav className="mt-12 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-sm">
        {prev ? (
          <Link
            href={hrefFor(prev)}
            className="font-medium text-brand-400 hover:text-brand-300"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={hrefFor(next)}
            className="font-medium text-brand-400 hover:text-brand-300"
          >
            {next.title} →
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
