import {
  NDA_CLAUSES,
  NDA_PREAMBLE,
  NDA_TITLE,
  NDA_VERSION,
} from '@/content/nda';

/** The agreement itself, rendered the same on the gate and on /dataroom/nda. */
export function NdaText({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'text-sm leading-relaxed' : 'leading-relaxed'}>
      <p className="font-semibold text-white">
        {NDA_TITLE}{' '}
        <span className="font-normal text-slate-400">
          · version {NDA_VERSION}
        </span>
      </p>
      <p className="mt-3 text-slate-300">{NDA_PREAMBLE}</p>
      {NDA_CLAUSES.map((clause) => (
        <section key={clause.heading} className="mt-4">
          <h3 className="font-semibold text-slate-100">{clause.heading}</h3>
          <p className="mt-1 text-slate-300">{clause.body}</p>
        </section>
      ))}
    </div>
  );
}
