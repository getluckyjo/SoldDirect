import Anthropic from '@anthropic-ai/sdk';
import type { PropertyType } from '@sell-direct/shared';

/**
 * Writes the listing description from the seller's photos and facts, and
 * reviews the photo set, so a seller can tap "Write my description" instead
 * of composing paragraphs on their phone.
 *
 * Two hard rules, both load-bearing:
 *  1. It only ever uses the facts the seller gave us and what the photos
 *     plainly show — it must never invent a feature. A fabricated
 *     "north-facing garden" is a misrepresentation in a property listing,
 *     not a harmless embellishment.
 *  2. The seller approves the text before it is saved. The drafter proposes;
 *     the seller decides.
 *
 * Like the extractor, implementations are SILENT failures: any error or
 * timeout returns null and the flow falls back to "type it yourself".
 */
export interface DescriptionDrafter {
  draft(facts: ListingFacts): Promise<DescriptionDraft | null>;
}

export interface ListingPhoto {
  bytes: Buffer;
  mimeType: string;
}

export interface ListingFacts {
  title: string;
  propertyType?: PropertyType | null;
  suburb?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  priceZar?: number | null;
  photoCount?: number;
  /** The seller's photos, in listing order (at most MAX_PHOTOS are sent). */
  photos?: ListingPhoto[];
}

/** What the photos cover, as buyers look for it. */
export type PhotoArea =
  'exterior' | 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'outdoor';

export interface PhotoReview {
  quality: 'good' | 'mixed' | 'poor';
  covered: PhotoArea[];
  missing: PhotoArea[];
  /** Up to three short, specific things the seller can fix with a phone. */
  tips: string[];
}

export interface DescriptionDraft {
  description: string;
  /** null when the draft was written from the facts alone. */
  photoReview: PhotoReview | null;
}

/** Used when no API key is configured, or drafting is switched off. */
export function createNoopDescriptionDrafter(): DescriptionDrafter {
  return {
    async draft() {
      return null;
    },
  };
}

const MAX_DRAFT_LENGTH = 1500;
const MAX_PHOTOS = 10;
const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);
const AREAS: PhotoArea[] = [
  'exterior',
  'living',
  'kitchen',
  'bedroom',
  'bathroom',
  'outdoor',
];

/**
 * Byte-stable (cache-friendly): the listing's facts and photos travel in the
 * user turn, never here.
 *
 * The positioning rules mirror CLAUDE.md: never anti-agent, never
 * anti-PPRA, savings framed neutrally. A listing description is buyer-facing
 * copy, so it stays about the home — not about how the seller is selling it.
 */
const DRAFTER_SYSTEM_PROMPT = `You write property-listing descriptions for a Cape Town marketplace where owners sell directly, and you review the listing photos.

Rules for the description:
- Use ONLY the facts given and what the photos clearly show. Never invent, infer or embellish — no gardens, views, finishes, renovations, security, parking, schools or amenities unless they are in the facts or plainly visible in a photo. If you are not sure something is there, leave it out. An invented feature is a misrepresentation.
- With photos: three short paragraphs, 120–180 words in total. (1) The home and where it is. (2) Inside — the rooms, light, finishes and flow you can actually see. (3) Outside and extras — garden, pool, view, balcony, parking, security — only when visible or in the facts. Name a room only when a photo shows it.
- Without photos: 2–3 sentences, 60 words maximum, from the facts alone.
- Warm and factual, never salesy. No exclamation marks, no "stunning", "dream", "must-see".
- South African English, en-ZA spelling, ZAR.
- Describe the home only. Never mention commission, estate agents, the selling process, Sold Direct, or the photos themselves.
- Do not include the price unless it is in the facts, and never present it as a bargain or compare it to anything.

Rules for the photo review (only when photos are given):
- "covered": which of exterior, living, kitchen, bedroom, bathroom, outdoor (garden, pool, view, balcony) the photos show.
- "missing": the ones from that list the photos do not show.
- "quality": "good", "mixed" or "poor" — judge light, sharpness, framing (landscape, straight, the whole room), tidiness and duplicates.
- "tips": up to three short, specific, friendly suggestions the seller can act on with a phone, each naming the photo it is about, e.g. "The lounge photo is dark — open the curtains and switch the lights on." An empty list when there is nothing worth fixing.

Output ONLY a JSON object with two keys: "description" (string) and "photoReview" (an object with "covered", "missing", "quality" and "tips", or null when no photos were given). No markdown, no code fences, no preamble.`;

function renderFacts(facts: ListingFacts, photoCount: number): string {
  const lines = [`Headline: ${facts.title}`];
  if (facts.propertyType) lines.push(`Property type: ${facts.propertyType}`);
  if (facts.suburb) lines.push(`Suburb: ${facts.suburb}, Cape Town`);
  if (facts.bedrooms !== undefined && facts.bedrooms !== null) {
    lines.push(`Bedrooms: ${facts.bedrooms}`);
  }
  if (facts.bathrooms !== undefined && facts.bathrooms !== null) {
    lines.push(`Bathrooms: ${facts.bathrooms}`);
  }
  if (facts.priceZar) {
    lines.push(`Asking price: R${facts.priceZar.toLocaleString('en-ZA')}`);
  }
  const photosLine =
    photoCount > 0
      ? `${photoCount} listing photo${photoCount === 1 ? '' : 's'} attached, in the order the seller sent them.`
      : 'No photos yet.';
  return `Facts:\n${lines.join('\n')}\n\n${photosLine}\n\nWrite the description and the photo review as JSON.`;
}

function isArea(value: unknown): value is PhotoArea {
  return typeof value === 'string' && (AREAS as string[]).includes(value);
}

function parseReview(value: unknown): PhotoReview | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const quality =
    raw.quality === 'good' || raw.quality === 'mixed' || raw.quality === 'poor'
      ? raw.quality
      : 'mixed';
  const list = (v: unknown) => (Array.isArray(v) ? v.filter(isArea) : []);
  const covered = list(raw.covered);
  const missing = list(raw.missing).filter((a) => !covered.includes(a));
  const tips = Array.isArray(raw.tips)
    ? raw.tips
        .filter((t): t is string => typeof t === 'string' && t.trim() !== '')
        .map((t) => t.trim())
        .slice(0, 3)
    : [];
  return { quality, covered, missing, tips };
}

/**
 * The model answers in JSON; a reply that is not JSON (or is fenced) still
 * yields the text as the description so a formatting slip never strands the
 * seller.
 */
export function parseDraft(text: string): DescriptionDraft | null {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  if (trimmed === '') return null;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const description =
      typeof parsed.description === 'string' ? parsed.description.trim() : '';
    if (description === '') return null;
    return {
      description: description.slice(0, MAX_DRAFT_LENGTH),
      photoReview: parseReview(parsed.photoReview),
    };
  } catch {
    if (trimmed.startsWith('{')) return null;
    return {
      description: trimmed.slice(0, MAX_DRAFT_LENGTH),
      photoReview: null,
    };
  }
}

export interface AnthropicDrafterConfig {
  apiKey?: string;
  /** Override the model id (default claude-opus-4-8). */
  model?: string;
  log?: (message: string, error?: unknown) => void;
  /** Test seam: inject a fake client. */
  client?: Anthropic;
}

export function createAnthropicDescriptionDrafter(
  config: AnthropicDrafterConfig = {},
): DescriptionDrafter {
  const client =
    config.client ??
    new Anthropic(config.apiKey ? { apiKey: config.apiKey } : undefined);
  const model = config.model || 'claude-opus-4-8';
  const log = config.log ?? (() => {});

  return {
    async draft(facts) {
      try {
        const photos = (facts.photos ?? [])
          .filter((p) => IMAGE_TYPES.has(p.mimeType))
          .slice(0, MAX_PHOTOS);
        const content: Anthropic.Messages.ContentBlockParam[] = photos.map(
          (p) => ({
            type: 'image',
            source: {
              type: 'base64',
              media_type: p.mimeType as
                'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: p.bytes.toString('base64'),
            },
          }),
        );
        content.push({ type: 'text', text: renderFacts(facts, photos.length) });
        const response = await client.messages.create({
          model,
          max_tokens: 900,
          system: DRAFTER_SYSTEM_PROMPT,
          messages: [{ role: 'user', content }],
        });
        const text = response.content
          .filter((block) => block.type === 'text')
          .map((block) => (block as { text: string }).text)
          .join('')
          .trim();
        return parseDraft(text);
      } catch (error) {
        // Never surface a model failure to a seller mid-flow.
        log('description drafting failed', error);
        return null;
      }
    },
  };
}
