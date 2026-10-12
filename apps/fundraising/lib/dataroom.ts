import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { Marked } from 'marked';

/**
 * The data room's index. Files live in docs/dataroom at the repo root and are
 * copied into content/dataroom by scripts/sync-dataroom.mjs before each build.
 * Markdown documents render at /dataroom/<slug>; everything else is served
 * (behind the same gate) from /dataroom/files/<file>.
 */
export type DocKind = 'doc' | 'xlsx' | 'csv' | 'html' | 'pdf';

export interface DataroomEntry {
  slug: string;
  file: string;
  title: string;
  blurb: string;
  kind: DocKind;
  /** Served when linked from a document, but not listed on the index. */
  hidden?: boolean;
}

export const DATAROOM_ENTRIES: DataroomEntry[] = [
  {
    slug: 'overview',
    file: 'README.md',
    title: 'Overview',
    blurb:
      'The strategy in one page, the base-case headlines, what to validate before circulating, and what is next.',
    kind: 'doc',
  },
  {
    slug: '00-assumptions',
    file: '00-assumptions.md',
    title: 'Assumption base',
    blurb:
      'Sourced assumptions: market size, prices, bond economics, costs and valuation comps, each with a reliability flag, plus the confirmed data gaps.',
    kind: 'doc',
  },
  {
    slug: '01-financial-model',
    file: '01-financial-model.md',
    title: 'Financial model',
    blurb:
      'Five-year P&L and cash flow across three scenarios, the per-deal revenue engine, the volume ramp and the sensitivities.',
    kind: 'doc',
  },
  {
    slug: '02-capital-and-valuation',
    file: '02-capital-and-valuation.md',
    title: 'Capital and valuation',
    blurb:
      'Bottom-up capital requirement, the R5m seed at R20m pre-money, the cap table and the runway check.',
    kind: 'doc',
  },
  {
    slug: '03-market-sizing',
    file: '03-market-sizing.md',
    title: 'Market sizing',
    blurb:
      'TAM, SAM and SOM, the implied upper-market share with a stress test, and what a full-service sale would have cost the consumer.',
    kind: 'doc',
  },
  {
    slug: '04-indicative-term-sheet',
    file: '04-indicative-term-sheet.md',
    title: 'Indicative term sheet',
    blurb:
      'Seed terms on one page: R5m for 20%, tranched against milestones, 1× non-participating preference, lead board seat and founder reverse-vesting. Cap table at closing and the team.',
    kind: 'doc',
  },
  {
    slug: '05-regulatory-status',
    file: '05-regulatory-status.md',
    title: 'Regulatory status',
    blurb:
      'Property practitioner registration and the FFC: status, route and timeline. Why 0% sits inside the Property Practitioners Act, and the FAIS/FSP dependency for Year 2 origination.',
    kind: 'doc',
  },
  {
    slug: 'model',
    file: 'sold-direct-model.xlsx',
    title: 'Excel model (CA-reviewed)',
    blurb:
      'Twelve linked tabs: assumptions, P&L, COGS build, scenarios, market sizing, capital and valuation, use of funds, cap table and more. Edit the amber input cells and everything recalculates.',
    kind: 'xlsx',
  },
  {
    slug: 'model-csv',
    file: 'model.csv',
    title: 'Model snapshot (CSV)',
    blurb:
      'A flat snapshot of the numbers. The Excel file is the working model.',
    kind: 'csv',
  },
  {
    slug: 'partner-brief-paysoft',
    file: 'partner-brief-paysoft.html',
    title: 'Partner brief: Paysoft',
    blurb:
      'The technology-partnership brief: scope, the free-development allocation and the equity position.',
    kind: 'html',
  },
  {
    slug: 'partner-brief-property24-web',
    file: 'partner-brief-property24.html',
    title: 'Partner brief: Property24 (web version)',
    blurb: 'The same brief as a web page.',
    kind: 'html',
    hidden: true,
  },
  {
    slug: 'partner-brief-property24',
    file: 'partner-brief-property24.pdf',
    title: 'Partner brief: Property24',
    blurb:
      'The syndication brief: the incremental-inventory case and the rate structure under negotiation.',
    kind: 'pdf',
  },
];

export const KIND_LABEL: Record<DocKind, string> = {
  doc: 'Document',
  xlsx: 'Excel model',
  csv: 'CSV',
  html: 'Brief',
  pdf: 'PDF',
};

export const KIND_ACTION: Record<DocKind, string> = {
  doc: 'Read',
  xlsx: 'Download',
  csv: 'Download',
  html: 'Open',
  pdf: 'Open',
};

const CONTENT_TYPE: Record<Exclude<DocKind, 'doc'>, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv; charset=utf-8',
  html: 'text/html; charset=utf-8',
  pdf: 'application/pdf',
};

export const DATAROOM_DIR = path.join(process.cwd(), 'content', 'dataroom');

export function hrefFor(entry: DataroomEntry): string {
  return entry.kind === 'doc'
    ? `/dataroom/${entry.slug}`
    : `/dataroom/files/${entry.file}`;
}

export function entryBySlug(slug: string): DataroomEntry | undefined {
  return DATAROOM_ENTRIES.find((e) => e.slug === slug);
}

export function entryByFile(file: string): DataroomEntry | undefined {
  return DATAROOM_ENTRIES.find((e) => e.file === file);
}

/** The entries whose files made it into the build, in index order. */
export async function availableEntries(): Promise<DataroomEntry[]> {
  let names: string[];
  try {
    names = await readdir(DATAROOM_DIR);
  } catch {
    return [];
  }
  const present = new Set(names);
  return DATAROOM_ENTRIES.filter((e) => !e.hidden && present.has(e.file));
}

// Links between documents are written as ./file.md in the repo; on the site
// they point at the rendered page (or the gated file) instead.
function rewriteHref(href: string): string {
  if (!href.startsWith('./')) return href;
  const [file, hash] = href.slice(2).split('#');
  const target = entryByFile(file);
  if (!target) return href;
  return hrefFor(target) + (hash ? `#${hash}` : '');
}

const markdown = new Marked();
markdown.use({
  gfm: true,
  walkTokens(token) {
    if (token.type === 'link') token.href = rewriteHref(token.href);
  },
});

export async function readDocHtml(
  entry: DataroomEntry,
): Promise<string | null> {
  if (entry.kind !== 'doc') return null;
  let text: string;
  try {
    text = await readFile(path.join(DATAROOM_DIR, entry.file), 'utf8');
  } catch {
    return null;
  }
  const html = await markdown.parse(text);
  // Wide tables scroll inside their own box instead of breaking the page.
  return html
    .replaceAll('<table>', '<div class="table-wrap"><table>')
    .replaceAll('</table>', '</table></div>');
}

export async function readDataroomFile(
  entry: DataroomEntry,
): Promise<{ body: ArrayBuffer; contentType: string; inline: boolean } | null> {
  if (entry.kind === 'doc') return null;
  let bytes: Buffer;
  try {
    bytes = await readFile(path.join(DATAROOM_DIR, entry.file));
  } catch {
    return null;
  }
  const body = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  return {
    body,
    contentType: CONTENT_TYPE[entry.kind],
    inline: entry.kind === 'pdf' || entry.kind === 'html',
  };
}
