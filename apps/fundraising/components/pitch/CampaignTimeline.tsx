import type { ReactNode } from 'react';
import { IconTile, type IconName } from './Icon';

export type CampaignItem = {
  icon: IconName;
  when: string;
  title: string;
  body: string;
};

type Props = {
  items: readonly CampaignItem[];
  /** Optional copy transform, used by the page to resolve the 0%* token. */
  renderBody?: (body: string) => ReactNode;
};

/**
 * The campaigns as a vertical timeline. Each node is a native
 * <details>/<summary>, so the page reads as a five-second scan (when and
 * what) and opens to the detail without JavaScript. The first node starts
 * open so the section never reads empty.
 */
export function CampaignTimeline({ items, renderBody }: Props) {
  return (
    <ol className="relative mt-10 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-slate-800">
      {items.map((c, i) => (
        <li key={c.title} className="relative">
          <details className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center gap-4 py-3 marker:content-none">
              <IconTile name={c.icon} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium uppercase tracking-wide text-sky-400">
                  {c.when}
                </span>
                <span className="block text-lg font-semibold leading-snug text-white">
                  {c.title}
                </span>
              </span>
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-base font-bold text-brand-300"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="max-w-2xl pb-5 pl-14 pr-10 text-sm leading-relaxed text-slate-300">
              {renderBody ? renderBody(c.body) : c.body}
            </p>
          </details>
        </li>
      ))}
    </ol>
  );
}
