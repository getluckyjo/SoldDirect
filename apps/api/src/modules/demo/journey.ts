import { formatZar } from '@sell-direct/shared';
import type { Dispatcher } from '../conversation';
import type { Notifier } from '../notifications';
import type { AdvanceDealDeps } from '../deals';
import { advanceDeal } from '../deals';
import type { DealEventInput } from '../deals';
import type { InboundMessage } from '../messaging';
import { DEMO_PHONE_RE } from './types';

/**
 * The demo's "market responds" director.
 *
 * A seller who has listed in the simulator can watch the rest of the sale
 * happen to them: a buyer enquires, pre-qualifies, asks to view, makes an
 * offer, the bond is granted, FICA, clearance, lodgement, registration.
 *
 * Everything the SELLER receives is produced by the production code paths —
 * the enquiry flow, the deal state machine, the stage notifications. The
 * only simulated party is the buyer: a scripted buyer on a paired demo
 * number sends the same inbound messages a real buyer's phone would.
 */
export const JOURNEY_STEPS = [
  'enquiry',
  'prequal',
  'viewing',
  'offer',
  'bond',
  'fica',
  'clearance',
  'lodgement',
  'registered',
] as const;
export type JourneyStep = (typeof JOURNEY_STEPS)[number];

export function isJourneyStep(value: unknown): value is JourneyStep {
  return (
    typeof value === 'string' &&
    (JOURNEY_STEPS as readonly string[]).includes(value)
  );
}

/** The seller's latest listing, as the journey needs it. */
export interface JourneyListing {
  id: string;
  title: string;
  priceZar: number;
  status: string;
}

/** The seller's latest deal, as the journey needs it. */
export interface JourneyDeal {
  id: string;
  status: string;
  listingId: string;
  buyerPhone: string;
}

export interface JourneyDeps {
  /** The DEMO dispatcher — replies land in the message log, never a BSP. */
  dispatcher: Dispatcher;
  /** The demo notifier, for the platform's own messages to the seller. */
  notifier: Notifier;
  listings: {
    findLatestForSeller(phone: string): Promise<JourneyListing | null>;
  };
  deals: {
    findLatestForSeller(phone: string): Promise<JourneyDeal | null>;
  };
  advance: Omit<AdvanceDealDeps, 'notifier'>;
  recordEvent: (input: DealEventInput) => Promise<unknown>;
  log?: (message: string, error?: unknown) => void;
}

export type JourneyResult =
  | { ok: true; step: JourneyStep; deal?: { id: string; status: string } }
  | {
      ok: false;
      error: 'no_listing' | 'no_deal' | 'invalid_transition' | 'not_found';
    };

/**
 * The simulated buyer's number: the seller's demo number plus one, inside
 * the reserved range. Deterministic so a replayed step reuses the same
 * buyer (and the same deal) rather than creating a second enquiry.
 */
export function buyerPhoneFor(sellerPhone: string): string {
  const digits = Number(sellerPhone.slice(5));
  return `+2700${String((digits + 1) % 10_000_000).padStart(7, '0')}`;
}

let seq = 0;

function buyerInbound(
  from: string,
  text: string,
  replyId?: string,
): InboundMessage {
  seq += 1;
  return {
    waMessageId: `wamid.demo.buyer.${Date.now()}.${seq}`,
    from,
    to: 'demo',
    type: replyId ? 'interactive' : 'text',
    text,
    replyId,
    raw: { demo: true, simulatedBuyer: true },
  };
}

/** The offer the simulated buyer makes: 97% of asking, rounded to R10 000. */
export function offerAmountFor(priceZar: number): number {
  return Math.round((priceZar * 0.97) / 10_000) * 10_000;
}

/** The bond granted on that offer: 90% loan-to-value, rounded to R10 000. */
export function bondAmountFor(offerZar: number): number {
  return Math.round((offerZar * 0.9) / 10_000) * 10_000;
}

export async function runJourneyStep(
  deps: JourneyDeps,
  sellerPhone: string,
  step: JourneyStep,
): Promise<JourneyResult> {
  if (!DEMO_PHONE_RE.test(sellerPhone))
    return { ok: false, error: 'not_found' };
  const listing = await deps.listings.findLatestForSeller(sellerPhone);
  if (!listing) return { ok: false, error: 'no_listing' };
  const buyerPhone = buyerPhoneFor(sellerPhone);
  const advance: AdvanceDealDeps = { ...deps.advance, notifier: deps.notifier };

  const dealOrFail = async () => {
    const deal = await deps.deals.findLatestForSeller(sellerPhone);
    return deal && deal.listingId === listing.id ? deal : null;
  };

  switch (step) {
    case 'enquiry': {
      // The real deep-link path: buyer profile + enquiry deal + the
      // pre-qualification invite to the buyer, and the seller's notice.
      await deps.dispatcher.handle(
        buyerInbound(buyerPhone, `ENQUIRE ${listing.id}`),
      );
      return { ok: true, step };
    }
    case 'prequal': {
      // The buyer taps "Yes, pre-qualify me": consent recorded, referral to
      // the originator, seller told a verified buyer is on the home.
      await deps.dispatcher.handle(
        buyerInbound(buyerPhone, 'Yes, pre-qualify me', 'YES'),
      );
      return { ok: true, step };
    }
    case 'viewing': {
      const deal = await dealOrFail();
      if (!deal) return { ok: false, error: 'no_deal' };
      await deps.notifier.send(
        sellerPhone,
        `📅 The pre-qualified buyer would like to view "${listing.title}". ` +
          `Which slot suits you? You host the viewing; we confirm it with the buyer and send directions.`,
        {
          interactive: {
            kind: 'buttons',
            options: [
              { id: 'VIEWING:Saturday 11:00', title: 'Saturday 11:00' },
              { id: 'VIEWING:Sunday 14:00', title: 'Sunday 14:00' },
              { id: 'CONSULT', title: 'Suggest another' },
            ],
          },
        },
      );
      return { ok: true, step, deal: { id: deal.id, status: deal.status } };
    }
    case 'offer': {
      const deal = await dealOrFail();
      if (!deal) return { ok: false, error: 'no_deal' };
      const amount = offerAmountFor(listing.priceZar);
      const result = await advanceDeal(advance, {
        dealId: deal.id,
        to: 'offer_otp',
        actorType: 'system',
        note:
          `an Offer to Purchase of ${formatZar(amount)} has been received from the ` +
          `pre-qualified buyer, subject to bond approval within 21 days`,
      });
      if (!result.ok) return result;
      await deps.notifier.send(
        sellerPhone,
        `How would you like to respond? Our registered property practitioner ` +
          `prepares the paperwork either way — nothing is binding until both parties sign.`,
        {
          interactive: {
            kind: 'buttons',
            options: [
              { id: 'ACCEPT', title: '✅ Accept offer' },
              { id: 'COUNTER', title: 'Counter' },
              { id: 'CONSULT', title: 'Ask our practitioner' },
            ],
          },
        },
      );
      return { ok: true, step, deal: result.deal };
    }
    case 'bond': {
      const deal = await dealOrFail();
      if (!deal) return { ok: false, error: 'no_deal' };
      const offer = offerAmountFor(listing.priceZar);
      const bond = bondAmountFor(offer);
      await deps.recordEvent({
        dealId: deal.id,
        actorType: 'system',
        note: 'Offer to Purchase signed by both parties (e-signature)',
      });
      await deps.notifier.send(
        sellerPhone,
        `✍️ The Offer to Purchase for "${listing.title}" is signed by both parties. ` +
          `The buyer's deposit of ${formatZar(offer - bond)} is being paid into the ` +
          `conveyancer's trust account, and the bond application has gone to BetterBond.`,
      );
      const applied = await advanceDeal(advance, {
        dealId: deal.id,
        to: 'bond_application',
        actorType: 'system',
      });
      if (!applied.ok) return applied;
      const granted = await advanceDeal(advance, {
        dealId: deal.id,
        to: 'bond_granted',
        actorType: 'system',
        bank: 'Standard Bank',
        amountZar: formatZar(bond),
      });
      if (!granted.ok) return granted;
      return { ok: true, step, deal: granted.deal };
    }
    case 'fica':
    case 'clearance':
    case 'lodgement':
    case 'registered': {
      const deal = await dealOrFail();
      if (!deal) return { ok: false, error: 'no_deal' };
      const to =
        step === 'fica'
          ? 'documents_fica'
          : step === 'clearance'
            ? 'clearance'
            : step === 'lodgement'
              ? 'lodgement'
              : 'registered';
      const result = await advanceDeal(advance, {
        dealId: deal.id,
        to,
        actorType: 'system',
      });
      if (!result.ok) return result;
      return { ok: true, step, deal: result.deal };
    }
  }
}
