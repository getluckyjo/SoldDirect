import type { ReactNode } from 'react';
import { IconTile, type IconName } from './Icon';

export type KeyPoint = { label: string; value: string };

/**
 * Collapsible block for the business-plan section. Native
 * <details>/<summary> so it works without JavaScript and prints open.
 * The closed state is built to be read in five seconds: an icon, the
 * title, a one-line summary and up to three key figures. Everything
 * inside is the longer read, and the full version lives in the data room.
 */
export function Details({
  id,
  icon,
  title,
  summary,
  keyPoints,
  children,
}: {
  id: string;
  icon: IconName;
  title: string;
  summary?: string;
  keyPoints?: readonly KeyPoint[];
  children: ReactNode;
}) {
  return (
    <details
      id={id}
      className="group scroll-mt-20 rounded-2xl border border-slate-800 bg-navy open:border-brand-500/40"
    >
      <summary className="cursor-pointer list-none p-5 marker:content-none sm:p-6">
        <div className="flex items-start gap-4">
          <IconTile name={icon} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-4">
              <span className="block text-lg font-semibold text-white">
                {title}
              </span>
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-base font-bold text-brand-300"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </div>
            {summary ? (
              <span className="mt-1 block text-sm text-slate-400">
                {summary}
              </span>
            ) : null}
            {keyPoints && keyPoints.length > 0 ? (
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                {keyPoints.map((point) => (
                  <div
                    key={point.label}
                    className="rounded-xl border border-slate-800 bg-navy-950/60 px-3 py-2"
                  >
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {point.label}
                    </dt>
                    <dd className="mt-0.5 text-base font-bold text-white">
                      {point.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </summary>
      <div className="border-t border-slate-800 px-5 pb-6 pt-2 sm:px-6">
        {children}
      </div>
    </details>
  );
}

/**
 * An internal heading inside an open collapsible: a small icon, a short
 * label, optional one-line note. Keeps long sections scannable.
 */
export function SubHeading({
  icon,
  title,
  note,
}: {
  icon: IconName;
  title: string;
  note?: string;
}) {
  return (
    <div className="mt-8 flex items-center gap-3 first:mt-4">
      <IconTile name={icon} size="sm" />
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        {note ? <p className="text-sm text-slate-400">{note}</p> : null}
      </div>
    </div>
  );
}
