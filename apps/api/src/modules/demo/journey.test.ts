import { describe, expect, it, vi } from 'vitest';
import {
  buyerPhoneFor,
  offerAmountFor,
  runJourneyStep,
  type JourneyDeps,
} from './journey';
import { assertTransition } from '../deals/state-machine';
import type { DealStage } from '@sell-direct/shared';
import type { InboundMessage } from '../messaging';
import type { SendOptions } from '../notifications';

const SELLER = '+27001234567';

function makeDeps(opts: { listing?: boolean } = { listing: true }) {
  const inbound: InboundMessage[] = [];
  const sent: { to: string; text: string; opts?: SendOptions }[] = [];
  const events: string[] = [];
  const deal = { id: 'deal-1', status: 'enquiry' as DealStage };

  const deps: JourneyDeps = {
    dispatcher: {
      async handle(message) {
        inbound.push(message);
      },
    },
    notifier: {
      async send(to, text, o) {
        sent.push({ to, text, opts: o });
      },
    },
    listings: {
      findLatestForSeller: async () =>
        opts.listing
          ? {
              id: 'listing-1',
              title: '3-bed house in Claremont',
              priceZar: 3_650_000,
              status: 'active',
            }
          : null,
    },
    deals: {
      findLatestForSeller: async () =>
        inbound.length > 0
          ? {
              id: deal.id,
              status: deal.status,
              listingId: 'listing-1',
              buyerPhone: buyerPhoneFor(SELLER),
            }
          : null,
    },
    advance: {
      deals: {
        getNotificationContext: async () => ({
          property: '3-bed house in Claremont',
          buyerPhone: buyerPhoneFor(SELLER),
          sellerPhone: SELLER,
        }),
      },
      transition: vi.fn(async (input) => {
        assertTransition(deal.status, input.to);
        deal.status = input.to;
        events.push(`→ ${input.to}`);
        return { id: deal.id, status: deal.status };
      }),
      templates: {},
    },
    recordEvent: vi.fn(async (input) => {
      events.push(input.note);
      return { id: deal.id, status: deal.status };
    }),
  };
  return { deps, inbound, sent, events, deal };
}

const sellerTexts = (sent: { to: string; text: string }[]) =>
  sent.filter((m) => m.to === SELLER).map((m) => m.text);

describe('demo journey', () => {
  it('pairs the seller with a deterministic buyer in the reserved range', () => {
    expect(buyerPhoneFor('+27001234567')).toBe('+27001234568');
    expect(buyerPhoneFor('+27009999999')).toBe('+27000000000');
  });

  it('refuses without a listing and off the demo range', async () => {
    const { deps } = makeDeps({ listing: false });
    expect(await runJourneyStep(deps, SELLER, 'enquiry')).toEqual({
      ok: false,
      error: 'no_listing',
    });
    expect(await runJourneyStep(deps, '+27821234567', 'enquiry')).toEqual({
      ok: false,
      error: 'not_found',
    });
  });

  it('runs the buyer through the real enquiry and consent paths', async () => {
    const { deps, inbound } = makeDeps();
    expect(await runJourneyStep(deps, SELLER, 'enquiry')).toMatchObject({
      ok: true,
      step: 'enquiry',
    });
    expect(inbound[0]).toMatchObject({
      from: buyerPhoneFor(SELLER),
      text: 'ENQUIRE listing-1',
      type: 'text',
    });
    await runJourneyStep(deps, SELLER, 'prequal');
    expect(inbound[1]).toMatchObject({
      from: buyerPhoneFor(SELLER),
      replyId: 'YES',
      type: 'interactive',
    });
  });

  it('carries the sale from viewing to registration through the state machine', async () => {
    const { deps, sent, events, deal } = makeDeps();
    await runJourneyStep(deps, SELLER, 'enquiry');
    await runJourneyStep(deps, SELLER, 'prequal');

    const viewing = await runJourneyStep(deps, SELLER, 'viewing');
    expect(viewing.ok).toBe(true);
    const slots = sent.at(-1)!;
    expect(slots.to).toBe(SELLER);
    expect(slots.opts?.interactive?.kind).toBe('buttons');
    expect(
      slots.opts?.interactive?.kind === 'buttons' &&
        slots.opts.interactive.options.map((o) => o.id),
    ).toEqual(['VIEWING:Saturday 11:00', 'VIEWING:Sunday 14:00', 'CONSULT']);

    const offer = await runJourneyStep(deps, SELLER, 'offer');
    expect(offer).toMatchObject({ ok: true, deal: { status: 'offer_otp' } });
    const texts = sellerTexts(sent);
    expect(
      texts.some((t) => t.includes('Offer to Purchase of R3 540 000')),
    ).toBe(true);
    expect(offerAmountFor(3_650_000)).toBe(3_540_000);
    const respond = sent.at(-1)!;
    expect(
      respond.opts?.interactive?.kind === 'buttons' &&
        respond.opts.interactive.options.map((o) => o.id),
    ).toEqual(['ACCEPT', 'COUNTER', 'CONSULT']);

    const bond = await runJourneyStep(deps, SELLER, 'bond');
    expect(bond).toMatchObject({ ok: true, deal: { status: 'bond_granted' } });
    expect(events).toContain(
      'Offer to Purchase signed by both parties (e-signature)',
    );
    expect(
      sellerTexts(sent).some((t) => t.includes('Buyer’s home loan approved')),
    ).toBe(true);

    for (const [step, status] of [
      ['fica', 'documents_fica'],
      ['clearance', 'clearance'],
      ['lodgement', 'lodgement'],
      ['registered', 'registered'],
    ] as const) {
      const r = await runJourneyStep(deps, SELLER, step);
      expect(r).toMatchObject({ ok: true, deal: { status } });
    }
    expect(deal.status).toBe('registered');
    expect(sellerTexts(sent).at(-1)).toContain('Registered 🎉');
  });

  it('rejects a step out of order', async () => {
    const { deps } = makeDeps();
    await runJourneyStep(deps, SELLER, 'enquiry');
    expect(await runJourneyStep(deps, SELLER, 'registered')).toEqual({
      ok: false,
      error: 'invalid_transition',
    });
  });
});
