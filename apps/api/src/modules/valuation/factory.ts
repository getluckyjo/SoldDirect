import { createLoomValuationAdapter } from './loom';
import type {
  ComparableSale,
  EstimateRequest,
  ValuationAdapter,
} from './types';

/**
 * No-guidance adapter: the PRODUCTION default until LOOM credentials are
 * configured. Returning null makes every caller silently skip price
 * guidance — a fabricated range must never reach a real seller.
 */
export function createNoopValuationAdapter(): ValuationAdapter {
  return {
    async estimate() {
      return null;
    },
  };
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "Jul 2026" for a sale `monthsAgo` months before `now`. */
function monthLabel(now: Date, monthsAgo: number): string {
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * DEMO-ONLY mock: a deterministic, plausible range so the simulator can show
 * the guidance experience. Wired exclusively to the demo dispatcher in
 * app.ts (reserved +2700 numbers) — never to production flows.
 */
export function createDemoValuationAdapter(
  now: () => Date = () => new Date(),
): ValuationAdapter {
  return {
    async estimate(request: EstimateRequest) {
      // Deterministic: seeded by suburb + bedrooms so demo runs are stable.
      const seed =
        [...request.suburb.toLowerCase()].reduce(
          (a, c) => a + c.charCodeAt(0),
          0,
        ) +
        (request.bedrooms ?? 2) * 7;
      const bedrooms = request.bedrooms ?? 2;
      const mid = 1_500_000 + (seed % 40) * 100_000 + bedrooms * 450_000;
      const spread = Math.round(mid * 0.08);
      const round = (n: number) => Math.round(n / 50_000) * 50_000;
      const lowZar = round(mid - spread);
      const highZar = round(mid + spread);
      const noun =
        request.propertyType === 'apartment'
          ? 'apartment'
          : request.propertyType === 'townhouse'
            ? 'townhouse'
            : 'house';
      const bedLabel = (n: number) => (n === 0 ? 'Studio' : `${n}-bed`);
      // Three illustrative comparables spread across the band, newest first.
      const comparables: ComparableSale[] = [
        {
          label: `${bedLabel(bedrooms)} ${noun}, ${request.suburb}`,
          priceZar: round(mid - spread * 0.4),
          soldWhen: monthLabel(now(), 2 + (seed % 2)),
        },
        {
          label: `${bedLabel(bedrooms)} ${noun}, ${request.suburb}`,
          priceZar: round(mid + spread * 0.35),
          soldWhen: monthLabel(now(), 4 + (seed % 3)),
        },
        {
          label: `${bedLabel(bedrooms + 1)} ${noun}, ${request.suburb}`,
          priceZar: round(mid + spread * 1.3),
          soldWhen: monthLabel(now(), 6 + (seed % 4)),
        },
      ];
      return {
        lowZar,
        highZar,
        comparablesCount: 8 + (seed % 7),
        source: 'LOOM Property Insights',
        comparables,
        medianDaysOnMarket: 31 + (seed % 29),
      };
    },
  };
}

/** LOOM when configured, otherwise the silent noop (production-safe). */
export function createValuationAdapter(
  log?: (message: string, error?: unknown) => void,
): ValuationAdapter {
  const apiUrl = process.env.LOOM_API_URL;
  const apiKey = process.env.LOOM_API_KEY;
  if (apiUrl && apiKey) {
    return createLoomValuationAdapter({ apiUrl, apiKey, log });
  }
  return createNoopValuationAdapter();
}
