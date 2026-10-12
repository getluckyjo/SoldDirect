import { formatZar } from '@sell-direct/shared';
/**
 * Valuation seam. Price guidance comes from a market-data partner (LOOM
 * Property Insights) behind this interface — swappable, best-effort, and
 * strictly data-minimised.
 *
 * Hard rules:
 * - `estimate` returns null whenever no real data is available. Callers
 *   silently skip guidance on null — a fabricated range must NEVER reach a
 *   real seller (this is why there is no "stub with numbers" in production;
 *   the demo injects its own clearly-mock adapter).
 * - POPIA data minimisation: partner responses may include property-owner
 *   names and contact numbers. That data never crosses this interface —
 *   only the price range and comparables metadata below.
 * - Copy framing (Property Valuers Profession Act): this is a market-data
 *   ESTIMATE, never a "valuation"; the asking price is always the seller's.
 */
export interface EstimateRequest {
  /** Street address when the seller gave one — the most accurate lookup. */
  address?: string | null;
  suburb: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
}

/**
 * One recent comparable sale, as shown in the Property Report. Deliberately
 * label-only: no street address and no party names ever cross the seam.
 */
export interface ComparableSale {
  /** e.g. "3-bed house, Claremont" */
  label: string;
  priceZar: number;
  /** e.g. "Jul 2026" */
  soldWhen: string;
}

export interface PriceEstimate {
  lowZar: number;
  highZar: number;
  /** How many recent comparable sales informed the range, when known. */
  comparablesCount?: number;
  /** Attribution shown to the user (e.g. "LOOM Property Insights"). */
  source: string;
  /** The comparable sales behind the range, when the partner supplies them. */
  comparables?: ComparableSale[];
  /** Median days from listing to sale for homes in this band, when known. */
  medianDaysOnMarket?: number;
}

export interface ValuationAdapter {
  /** Best-effort: null means "no guidance" — never throws to callers. */
  estimate(request: EstimateRequest): Promise<PriceEstimate | null>;
}

/** Render the user-facing guidance line — one place, one framing. */
export function renderEstimateLine(estimate: PriceEstimate): string {
  return (
    `💡 Price guidance: homes like yours recently sold for ` +
    `${formatZar(estimate.lowZar)}–${formatZar(estimate.highZar)} (based on confirmed ` +
    `sales via ${estimate.source}). The asking price is yours — reply ` +
    `CONSULT anytime for a free pricing chat with our team.`
  );
}

/**
 * A suggested asking price from the band: just above the midpoint, rounded
 * to R50 000, never above the top of the range. Guidance only — the seller
 * chooses the price, and the report says so.
 */
export function suggestedAskingPrice(estimate: PriceEstimate): number {
  const mid = (estimate.lowZar + estimate.highZar) / 2;
  const raised = mid + (estimate.highZar - mid) * 0.5;
  const rounded = Math.round(raised / 50_000) * 50_000;
  return Math.min(rounded, estimate.highZar);
}

/**
 * What a full-service sale (5–7% + VAT) would have cost on a price — the
 * neutral comparison the positioning guardrails allow. Rounded to R1 000.
 */
export function fullServiceCostRange(priceZar: number): {
  lowZar: number;
  highZar: number;
} {
  const round = (n: number) => Math.round(n / 1_000) * 1_000;
  return {
    lowZar: round(priceZar * 0.0575),
    highZar: round(priceZar * 0.0805),
  };
}

/** DD/MM/YYYY, the South African convention used across the product. */
export function formatDateZa(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}

/**
 * The Quick Estimate: the band, its basis, and the invitation to the full
 * Property Report. WhatsApp body limit is 1024 characters — keep it tight.
 */
export function renderQuickEstimate(
  estimate: PriceEstimate,
  headline: string,
): string {
  const basis =
    estimate.comparablesCount !== undefined
      ? `${estimate.comparablesCount} confirmed sales nearby in the last 12 months, via ${estimate.source}`
      : `confirmed recent sales via ${estimate.source}`;
  return (
    `📊 *Quick Estimate* — ${headline}\n\n` +
    `Homes like yours recently sold for *${formatZar(estimate.lowZar)} – ${formatZar(estimate.highZar)}*\n` +
    `(${basis})\n\n` +
    `That's market guidance from confirmed sales, not a formal valuation — the asking price is always yours.\n\n` +
    `Want the full picture? The free Property Report adds the comparable sales, time on market and a suggested asking price.`
  );
}

/**
 * The Property Report: range, suggested asking price, comparables, market
 * pace and the cost of selling. Stays under WhatsApp's 1024-character body.
 */
export function renderPropertyReport(
  estimate: PriceEstimate,
  headline: string,
  now: Date = new Date(),
): string {
  const asking = suggestedAskingPrice(estimate);
  const cost = fullServiceCostRange(asking);
  const comparables = (estimate.comparables ?? []).slice(0, 3);
  const comparableLines =
    comparables.length > 0
      ? `🏘 *Recent comparable sales*\n` +
        comparables
          .map((c) => `• ${c.label} — ${formatZar(c.priceZar)} (${c.soldWhen})`)
          .join('\n') +
        '\n\n'
      : '';
  const pace =
    estimate.medianDaysOnMarket !== undefined
      ? `⏱ *Market pace:* median ${estimate.medianDaysOnMarket} days to sell in this band\n`
      : '';
  return (
    `📄 *Property Report* — ${headline}\n` +
    `${formatDateZa(now)} · ${estimate.source}\n\n` +
    `💰 *Estimated range:* ${formatZar(estimate.lowZar)} – ${formatZar(estimate.highZar)}\n` +
    `🎯 *Suggested asking price:* ${formatZar(asking)} — positioned to draw offers in the first 4–6 weeks\n\n` +
    comparableLines +
    pace +
    `🧾 *Cost of selling:* 0% commission on our qualifying path. For reference, a full-service sale (5–7% + VAT) at ${formatZar(asking)} would have cost about ${formatZar(cost.lowZar)}–${formatZar(cost.highZar)}.\n\n` +
    `Guidance from confirmed sales, not a formal valuation — the asking price is yours. Ready to list? It takes about two minutes here, and these details carry over.`
  );
}
