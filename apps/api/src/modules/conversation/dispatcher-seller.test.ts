import { describe, expect, it, vi } from 'vitest';
import { createDispatcher } from './dispatcher';
import { createInMemoryPrequalStore } from './prequal-store';
import {
  createInMemoryConversationStore,
  createInMemoryEstimateStore,
} from '../listings';
import { BetterBondReferralStub } from '../finance';
import { createDemoValuationAdapter } from '../valuation';
import type { ProfileRepository } from '../profiles';
import type { DealRepository, SellerDeal } from '../deals';
import type { InboundMessage } from '../messaging';
import { createInMemoryOptOutStore, type SendOptions } from '../notifications';

const SELLER = '+27820001111';
const BUYER = '+27830002222';

function msg(from: string, text: string, replyId?: string): InboundMessage {
  return {
    waMessageId: `wamid.${from}.${text}.${Math.random()}`,
    from,
    to: '+14155238886',
    type: replyId ? 'interactive' : 'text',
    text,
    replyId,
    raw: {},
  };
}

function makeDeps(sellerDeal: SellerDeal | null = null) {
  const sent: { to: string; text: string; opts?: SendOptions }[] = [];
  const notifier = {
    send: vi.fn(async (to: string, text: string, opts?: SendOptions) => {
      sent.push({ to, text, opts });
    }),
  };
  const profiles: ProfileRepository = {
    upsertBuyerByPhone: vi.fn(async () => ({ id: 'buyer-1' })),
    recordBuyerFinancialConsent: vi.fn(async () => {}),
  };
  const deals: DealRepository = {
    createOrGetEnquiryDeal: vi.fn(async () => ({
      id: 'deal-1',
      status: 'enquiry',
    })),
    list: vi.fn(async () => []),
    getWithTimeline: vi.fn(async () => null),
    getNotificationContext: vi.fn(async () => ({
      property: '3-bed house in Claremont',
      buyerPhone: BUYER,
      sellerPhone: SELLER,
    })),
    findLatestDealForSeller: vi.fn(async () => sellerDeal),
  };
  const recordEvent = vi.fn(async () => ({}));
  const dispatcher = createDispatcher({
    intake: {
      store: createInMemoryConversationStore(),
      createListing: vi.fn(async () => ({ id: 'listing-1' })),
      valuation: createDemoValuationAdapter(),
    },
    enquiry: { profiles, deals, finance: new BetterBondReferralStub() },
    prequalStore: createInMemoryPrequalStore(),
    notifier,
    optOut: createInMemoryOptOutStore(),
    estimate: {
      store: createInMemoryEstimateStore(),
      valuation: createDemoValuationAdapter(),
    },
    sellerDeals: {
      findLatestForSeller: deals.findLatestDealForSeller,
      recordEvent,
    },
  });
  return { dispatcher, sent, recordEvent };
}

const to = (sent: { to: string; text: string }[], phone: string) =>
  sent.filter((m) => m.to === phone).map((m) => m.text);

describe('dispatcher × seller side', () => {
  it('tells the seller when a buyer enquires and again when they consent', async () => {
    const { dispatcher, sent } = makeDeps();
    await dispatcher.handle(msg(BUYER, 'ENQUIRE listing-1'));
    expect(to(sent, SELLER)).toHaveLength(1);
    expect(to(sent, SELLER)[0]).toContain(
      'New buyer enquiry on "3-bed house in Claremont"',
    );
    expect(to(sent, BUYER)[0]).toContain('pre-qualification');

    await dispatcher.handle(msg(BUYER, 'Yes, pre-qualify me', 'YES'));
    expect(to(sent, BUYER)[1]).toContain('BetterBond');
    expect(to(sent, SELLER)).toHaveLength(2);
    expect(to(sent, SELLER)[1]).toContain('pre-qualifying for a bond');
  });

  it('never notifies the seller about their own message', async () => {
    const { dispatcher, sent } = makeDeps();
    await dispatcher.handle(msg(SELLER, 'ENQUIRE listing-1'));
    expect(to(sent, SELLER)).toHaveLength(1); // only the buyer-side reply
  });

  it('PRICE runs the Quick Estimate and START carries the facts into intake', async () => {
    const { dispatcher, sent } = makeDeps();
    await dispatcher.handle(msg(SELLER, 'price'));
    expect(sent.at(-1)?.text).toContain('Quick Estimate');
    await dispatcher.handle(msg(SELLER, 'Southern Suburbs', 'REGION:southern'));
    await dispatcher.handle(msg(SELLER, 'Claremont', 'Claremont'));
    await dispatcher.handle(msg(SELLER, 'House', 'house'));
    await dispatcher.handle(msg(SELLER, '3', '3'));
    expect(sent.at(-1)?.text).toContain('📊 *Quick Estimate*');

    await dispatcher.handle(msg(SELLER, '📄 Property Report', 'REPORT'));
    expect(sent.at(-1)?.text).toContain('📄 *Property Report*');

    await dispatcher.handle(msg(SELLER, 'List my property', 'START'));
    // Suburb, type and bedrooms are known: the optional address comes first…
    expect(sent.at(-1)?.text).toContain('street address');
    await dispatcher.handle(msg(SELLER, 'Skip — not now', 'SKIP'));
    // …then the price, with the same guidance and tap-able amounts.
    const price = sent.at(-1)!;
    expect(price.text).toContain('asking price');
    expect(price.text).toContain('💡 Price guidance');
    expect(price.opts?.interactive?.kind).toBe('buttons');
  });

  it('records a viewing slot the seller taps', async () => {
    const deal: SellerDeal = {
      id: 'deal-1',
      status: 'enquiry',
      listingId: 'listing-1',
      property: '3-bed house in Claremont',
      buyerPhone: BUYER,
    };
    const { dispatcher, sent, recordEvent } = makeDeps(deal);
    await dispatcher.handle(
      msg(SELLER, 'Saturday 11:00', 'VIEWING:Saturday 11:00'),
    );
    expect(recordEvent).toHaveBeenCalledWith({
      dealId: 'deal-1',
      actorType: 'seller',
      note: 'Viewing confirmed by the seller: Saturday 11:00',
    });
    expect(sent.at(-1)?.text).toContain('Viewing confirmed for Saturday 11:00');
  });

  it('ACCEPT and COUNTER on an offer are recorded on the deal', async () => {
    const deal: SellerDeal = {
      id: 'deal-1',
      status: 'offer_otp',
      listingId: 'listing-1',
      property: '3-bed house in Claremont',
      buyerPhone: BUYER,
    };
    const { dispatcher, sent, recordEvent } = makeDeps(deal);
    await dispatcher.handle(msg(SELLER, '✅ Accept offer', 'ACCEPT'));
    expect(recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        note: 'Seller accepted the offer via WhatsApp',
      }),
    );
    expect(sent.at(-1)?.text).toContain('Offer accepted');

    await dispatcher.handle(msg(SELLER, 'Counter', 'COUNTER'));
    expect(recordEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        note: 'Seller asked to counter the offer via WhatsApp',
      }),
    );
  });

  it('ACCEPT without an offer on the table falls through to the usual flows', async () => {
    const { dispatcher, sent, recordEvent } = makeDeps(null);
    await dispatcher.handle(msg(SELLER, 'accept'));
    expect(recordEvent).not.toHaveBeenCalled();
    expect(sent.at(-1)?.text).toContain('Welcome to Sold Direct');
  });
});
