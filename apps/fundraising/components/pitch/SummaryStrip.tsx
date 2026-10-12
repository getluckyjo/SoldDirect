import { SUMMARY_STRIP } from '@/content/pitch';

/**
 * The deal at a glance — the most important element on the page. An
 * investor who reads nothing else should still get the deal from it.
 */
export function SummaryStrip() {
  return (
    <div
      id="summary"
      className="mt-10 scroll-mt-24 rounded-2xl border border-slate-700/80 bg-navy/80 p-4 backdrop-blur sm:p-5"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
        {SUMMARY_STRIP.map((s) => (
          <div key={s.label}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
            <p className="mt-1 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl lg:whitespace-nowrap">
              {s.value}
            </p>
            {s.sub ? (
              <p className="mt-1 text-xs text-slate-400 lg:whitespace-nowrap">
                {s.sub}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
