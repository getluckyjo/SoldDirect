import type { DemoDeal, DemoListing } from './types';

/**
 * The arc the investor plays after listing: what the market does next, in
 * the order the production state machine allows. `day` is the virtual day
 * on which it happens — the chat shows a date pill so the pacing of a real
 * sale (about ten weeks) is legible in a five-minute demo.
 */
export type JourneyStepId =
  | 'enquiry'
  | 'prequal'
  | 'viewing'
  | 'offer'
  | 'bond'
  | 'fica'
  | 'clearance'
  | 'lodgement'
  | 'registered';

export interface JourneyStep {
  id: JourneyStepId;
  title: string;
  detail: string;
  /** Virtual day after listing on which the step lands. */
  day: number;
  /** The seller has to reply in the chat before the sale can move on. */
  awaitsReply?: 'viewing' | 'offer';
}

export const JOURNEY: readonly JourneyStep[] = [
  {
    id: 'enquiry',
    title: 'A buyer enquires',
    detail:
      'A buyer finds the listing on Property24 and taps "Enquire on WhatsApp". You are told at once.',
    day: 2,
  },
  {
    id: 'prequal',
    title: 'The buyer pre-qualifies',
    detail:
      'They consent to a free bond pre-qualification with our multi-bank origination partner.',
    day: 2,
  },
  {
    id: 'viewing',
    title: 'Viewing request',
    detail: 'The buyer asks to view. Confirm a slot with one tap in the chat.',
    day: 3,
    awaitsReply: 'viewing',
  },
  {
    id: 'offer',
    title: 'An offer arrives',
    detail:
      'An Offer to Purchase at 97% of asking, subject to bond. Accept, counter or ask the practitioner — in the chat.',
    day: 6,
    awaitsReply: 'offer',
  },
  {
    id: 'bond',
    title: 'OTP signed · bond granted',
    detail:
      'Both parties e-sign. Our origination partner places the bond and the bank approves it.',
    day: 18,
  },
  {
    id: 'fica',
    title: 'FICA documents',
    detail: 'Both parties send their FICA documents here, in the chat.',
    day: 20,
  },
  {
    id: 'clearance',
    title: 'Certificates and clearance',
    detail:
      'Compliance certificates booked, rates clearance and bank guarantees arranged.',
    day: 34,
  },
  {
    id: 'lodgement',
    title: 'Lodged at the Deeds Office',
    detail: 'The conveyancer lodges the transfer. Registration follows.',
    day: 62,
  },
  {
    id: 'registered',
    title: 'Registered',
    detail: 'Ownership transfers. Sold, at 0% commission to the seller.',
    day: 71,
  },
];

/** Deal statuses in journey order, for progress derivation. */
const STATUS_ORDER = [
  'enquiry',
  'offer_otp',
  'bond_application',
  'bond_granted',
  'documents_fica',
  'clearance',
  'lodgement',
  'registered',
] as const;

export function statusRank(status: string | undefined): number {
  const i = STATUS_ORDER.indexOf(status as (typeof STATUS_ORDER)[number]);
  return i;
}

/** What the server already knows has happened, from the deal and its log. */
export function completedFromServer(
  deal: DemoDeal | null,
  issued: readonly JourneyStepId[],
): Set<JourneyStepId> {
  const done = new Set<JourneyStepId>();
  if (!deal) return done;
  done.add('enquiry');
  if (deal.buyerPrequalified) done.add('prequal');
  const notes = deal.events.map((e) => e.note ?? '');
  const rank = statusRank(deal.status);
  if (notes.some((n) => n.startsWith('Viewing confirmed'))) done.add('viewing');
  if (rank >= statusRank('offer_otp')) done.add('viewing');
  // The offer step is only complete once the seller has responded.
  if (
    notes.some((n) => n.includes('accepted the offer')) ||
    notes.some((n) => n.includes('counter the offer')) ||
    rank >= statusRank('bond_application')
  ) {
    done.add('offer');
  }
  if (rank >= statusRank('bond_granted')) done.add('bond');
  if (rank >= statusRank('documents_fica')) done.add('fica');
  if (rank >= statusRank('clearance')) done.add('clearance');
  if (rank >= statusRank('lodgement')) done.add('lodgement');
  if (rank >= statusRank('registered')) done.add('registered');
  // Steps the client issued that the server cannot see as "done" yet
  // (a viewing request or offer still awaiting the seller's reply) stay
  // issued-but-open; the caller treats those as "reply in the chat".
  void issued;
  return done;
}

/** A step is issued when its message has gone out, done when resolved. */
export function nextJourneyStep(
  done: Set<JourneyStepId>,
  issued: readonly JourneyStepId[],
): { step: JourneyStep | null; awaiting: JourneyStep | null } {
  for (const step of JOURNEY) {
    if (done.has(step.id)) continue;
    if (step.awaitsReply && issued.includes(step.id)) {
      return { step: null, awaiting: step };
    }
    return { step, awaiting: null };
  }
  return { step: null, awaiting: null };
}

/** The sale is only ready for the market once the listing is live. */
export function listingIsLive(listing: DemoListing | null): boolean {
  return listing?.status === 'active';
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** "Wednesday, 14 October 2026" for a virtual day after `start`. */
export function virtualDateLabel(start: Date, day: number): string {
  const d = new Date(start.getTime() + day * DAY_MS);
  return d.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
