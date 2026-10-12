import { START_RE } from './welcome';
import { DESCRIPTION_OPTIONS, PHOTO_GUIDE } from './intake';
import { CERTIFICATES_PITCH, SERVICES_MENU } from './photos';
import type { OnboardingStore } from './onboarding';
import type {
  DescriptionDrafter,
  ListingFacts,
  ListingPhoto,
  PhotoArea,
  PhotoReview,
} from './drafter';
import type { ReplyOptions } from '../messaging/interactive';

/**
 * The post-publish description step — photos first.
 *
 * After the seller confirms the listing we ask for photos. Once they are in,
 * one tap ("Write my description") has the description written from what
 * the photos show plus the facts, together with a short review of the photo
 * set: what buyers will see, what is still missing, and what to reshoot.
 * A draft is only ever a proposal — nothing reaches the listing until the
 * seller taps "Use this", and the scripted path never rewrites what a seller
 * typed. Free text at any point is stored VERBATIM. SKIP-able throughout;
 * keyword triggers fall through so "list" still starts a fresh intake.
 */
const SKIP_RE = /^\s*(skip|no|nope|later)\b/i;
const ENQUIRE_RE = /^enquire\b/i;
/** Control ids from the description buttons (each also typeable). */
const DRAFT_RE = /^\s*(draft|describe)\s*$/i;
const DRAFT_ANYWAY_RE = /^\s*draft_anyway\s*$/i;
const TYPE_RE = /^\s*type\s*$/i;
const USE_RE = /^\s*use\s*$/i;
const MAX_DESCRIPTION_LENGTH = 2000;
/** Below this many photos we ask for more before writing (still overridable). */
export const MIN_PHOTOS_FOR_DRAFT = 3;

/** Offered with a proposed draft — the seller always has the last word. */
const DRAFT_REVIEW_OPTIONS: ReplyOptions = {
  kind: 'buttons',
  options: [
    { id: 'USE', title: '✅ Use this' },
    { id: 'DRAFT', title: 'Try again' },
    { id: 'TYPE', title: 'I’ll write it' },
  ],
};

/** Offered when the photo set is thin. */
const FEW_PHOTOS_OPTIONS: ReplyOptions = {
  kind: 'buttons',
  options: [
    { id: 'DRAFT_ANYWAY', title: '✍️ Write it anyway' },
    { id: 'TYPE', title: 'I’ll write it' },
    { id: 'SKIP', title: 'Skip for now' },
  ],
};

const PHOTO_NUDGE =
  '📸 Now send 5–10 photos — your listing goes live with the first one.';

const AREA_LABEL: Record<PhotoArea, string> = {
  exterior: 'the front of the home',
  living: 'the living area',
  kitchen: 'the kitchen',
  bedroom: 'a bedroom',
  bathroom: 'a bathroom',
  outdoor: 'the garden, view or outdoor space',
};

function humanList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** The photo check shown under a draft: coverage, quality, what to reshoot. */
export function renderPhotoReview(review: PhotoReview | null): string {
  if (!review) return '';
  const lines: string[] = [];
  if (review.missing.length === 0 && review.quality === 'good') {
    lines.push(
      `📷 Photo check: a good set — buyers will see ${humanList(
        review.covered.map((a) => AREA_LABEL[a]),
      )}.`,
    );
  } else if (review.missing.length > 0) {
    lines.push(
      `📷 Photo check: still missing ${humanList(
        review.missing.map((a) => AREA_LABEL[a]),
      )} — buyers look for those first.`,
    );
  } else {
    lines.push('📷 Photo check: good coverage, a few shots could be better.');
  }
  for (const tip of review.tips) lines.push(`• ${tip}`);
  if (review.missing.length > 0 || review.tips.length > 0) {
    lines.push(
      'Send those and tap "Try again" and I’ll rework the description.',
    );
  }
  return `${lines.join('\n')}\n\n`;
}

export interface DescriptionDeps {
  onboarding: OnboardingStore;
  setDescription: (listingId: string, description: string) => Promise<void>;
  /**
   * Optional "Write my description" support. Without it, that button is
   * never offered and the step behaves as the plain verbatim step.
   */
  drafter?: DescriptionDrafter;
  /** Facts the drafter may use — never more than the seller told us. */
  listingFacts?: (listingId: string) => Promise<ListingFacts | null>;
  /** The listing's photos (bytes), in order, for the drafter to look at. */
  listingPhotos?: (listingId: string) => Promise<ListingPhoto[]>;
  /**
   * Lets a "Write my description" tap re-open the step after the seller
   * skipped it (their newest listing). Optional.
   */
  findListingForSeller?: (phone: string) => Promise<{ id: string } | null>;
}

export interface DescriptionResult {
  handled: boolean;
  reply?: string;
  options?: ReplyOptions;
}

/** What follows once the description is settled, given where the photos stand. */
function completion(lead: string, photoCount: number): DescriptionResult {
  if (photoCount === 0) {
    return { handled: true, reply: `${lead} ${PHOTO_NUDGE}` };
  }
  return {
    handled: true,
    reply: `${lead}\n\n${CERTIFICATES_PITCH}`,
    options: SERVICES_MENU,
  };
}

export async function handleDescriptionMessage(
  deps: DescriptionDeps,
  message: { phone: string; text: string },
): Promise<DescriptionResult> {
  let state = await deps.onboarding.get(message.phone);
  const text = message.text.trim();

  if (!state) {
    // A "Write my description" tap after the step was skipped re-opens it
    // against the seller's newest listing.
    if (DRAFT_RE.test(text) && deps.findListingForSeller) {
      const listing = await deps.findListingForSeller(message.phone);
      if (!listing) return { handled: false };
      state = { listingId: listing.id };
      await deps.onboarding.set(message.phone, state);
    } else {
      return { handled: false };
    }
  }

  if (text === '' || START_RE.test(text) || ENQUIRE_RE.test(text)) {
    // A new flow (or a pure photo message) — abandon the description step.
    if (START_RE.test(text) || ENQUIRE_RE.test(text)) {
      await deps.onboarding.clear(message.phone);
    }
    return { handled: false };
  }

  const photoCount = async () =>
    (await deps.listingFacts?.(state!.listingId))?.photoCount ?? 0;

  if (SKIP_RE.test(text)) {
    await deps.onboarding.clear(message.phone);
    return completion(
      'No problem — you can add a description any time by tapping ✍️ Write my description.',
      await photoCount(),
    );
  }

  // "Use this" — the seller approved the draft we showed them.
  if (USE_RE.test(text) && state.draft) {
    await deps.setDescription(
      state.listingId,
      state.draft.slice(0, MAX_DESCRIPTION_LENGTH),
    );
    await deps.onboarding.clear(message.phone);
    return completion('Description saved 👌', await photoCount());
  }

  // "Write my description" / "Try again" / "Write it anyway".
  if (
    (DRAFT_RE.test(text) || DRAFT_ANYWAY_RE.test(text)) &&
    deps.drafter &&
    deps.listingFacts
  ) {
    const facts = await deps.listingFacts(state.listingId);
    const photos = facts
      ? ((await deps.listingPhotos?.(state.listingId)) ?? [])
      : [];
    if (
      facts &&
      photos.length < MIN_PHOTOS_FOR_DRAFT &&
      !DRAFT_ANYWAY_RE.test(text)
    ) {
      const have =
        photos.length === 0
          ? 'no photos yet'
          : `${photos.length} photo${photos.length === 1 ? '' : 's'} so far`;
      return {
        handled: true,
        reply:
          `I have ${have}. To write something buyers trust I’d like at least ` +
          `${MIN_PHOTOS_FOR_DRAFT} — ideally:\n${PHOTO_GUIDE}\n\n` +
          'Send a few more, then tap ✍️ again.',
        options: FEW_PHOTOS_OPTIONS,
      };
    }
    const draft = facts ? await deps.drafter.draft({ ...facts, photos }) : null;
    if (!draft) {
      // Silent failure by contract — never strand the seller.
      return {
        handled: true,
        reply:
          'I couldn’t write one just now — send a sentence or two in your own ' +
          'words and I’ll save it, or skip for now.',
        options: DESCRIPTION_OPTIONS,
      };
    }
    await deps.onboarding.set(message.phone, {
      ...state,
      draft: draft.description,
    });
    const from =
      photos.length > 0
        ? `written from your ${photos.length} photo${photos.length === 1 ? '' : 's'} and the details you gave me`
        : 'written from the details you gave me';
    return {
      handled: true,
      reply:
        `Here’s your description, ${from} — nothing is saved until you say so:\n\n` +
        `"${draft.description}"\n\n` +
        `${renderPhotoReview(draft.photoReview)}Happy with it?`,
      options: DRAFT_REVIEW_OPTIONS,
    };
  }

  // "I'll write it" — invite the seller's own words.
  if (TYPE_RE.test(text)) {
    return {
      handled: true,
      reply:
        'Go ahead — a few sentences about what makes it special. I’ll save ' +
        'it exactly as you write it.',
    };
  }

  // Anything else is the seller's own description, stored verbatim.
  await deps.setDescription(
    state.listingId,
    text.slice(0, MAX_DESCRIPTION_LENGTH),
  );
  await deps.onboarding.clear(message.phone);
  return completion('Description saved 👌', await photoCount());
}
