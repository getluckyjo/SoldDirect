import type { ReactNode } from 'react';

/**
 * Collapsible block for the "detail, if you want it" section. Native
 * <details>/<summary> so it works without JavaScript and prints open.
 * The page sells the concept; everything inside one of these is optional
 * reading, and the full version lives in the data room.
 */
export function Details({
  id,
  title,
  summary,
  children,
}: {
  id: string;
  title: string;
  summary?: string;
  children: ReactNode;
}) {
  return (
    <details
      id={id}
      className="group scroll-mt-20 rounded-2xl border border-slate-800 bg-navy open:border-brand-500/40"
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 p-5 marker:content-none sm:p-6">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-lg font-bold text-brand-300"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-semibold text-white">
            {title}
          </span>
          {summary ? (
            <span className="mt-0.5 block text-sm text-slate-400">
              {summary}
            </span>
          ) : null}
        </span>
      </summary>
      <div className="border-t border-slate-800 px-5 pb-6 pt-2 sm:px-6">
        {children}
      </div>
    </details>
  );
}
