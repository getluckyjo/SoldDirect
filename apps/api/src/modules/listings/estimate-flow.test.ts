import { describe, expect, it } from 'vitest';
import {
  ESTIMATE_OPTIONS,
  REPORT_OPTIONS,
  handleEstimateMessage,
  type EstimateFlowDeps,
} from './estimate-flow';
import { createInMemoryEstimateStore } from './estimate-store';
import { createDemoValuationAdapter } from '../valuation';
import type { ValuationAdapter } from '../valuation';

const PHONE = '+27001230000';
const NOW = new Date('2026-10-12T10:00:00+02:00');

function deps(
  valuation: ValuationAdapter = createDemoValuationAdapter(() => NOW),
): EstimateFlowDeps {
  return { store: createInMemoryEstimateStore(), valuation, now: () => NOW };
}

const say = (d: EstimateFlowDeps, text: string) =>
  handleEstimateMessage(d, { phone: PHONE, text });

describe('Quick Estimate flow', () => {
  it('PRICE opens with the framing and the region picker', async () => {
    const d = deps();
    const r = await say(d, 'price');
    expect(r.handled).toBe(true);
    expect(r.reply).toContain('Quick Estimate');
    expect(r.reply).toContain('not a formal valuation');
    expect(r.options?.kind).toBe('list');
  });

  it('is not involved when no estimate is in progress', async () => {
    const d = deps();
    expect(await say(d, 'hello')).toEqual({ handled: false });
  });

  it('three taps produce the estimate, the report, then hand over to intake', async () => {
    const d = deps();
    await say(d, 'PRICE');

    const region = await say(d, 'REGION:southern');
    expect(region.reply).toBe('And which suburb?');
    expect(region.options?.kind).toBe('list');

    const suburb = await say(d, 'Claremont');
    expect(suburb.reply).toBe('What kind of home is it?');

    const type = await say(d, 'house');
    expect(type.reply).toBe('How many bedrooms?');

    const estimate = await say(d, '3');
    expect(estimate.handled).toBe(true);
    expect(estimate.reply).toContain(
      '📊 *Quick Estimate* — 3-bed house in Claremont',
    );
    expect(estimate.reply).toMatch(/R\d[\d ]+ – R\d[\d ]+/);
    expect(estimate.reply).toContain('not a formal valuation');
    expect(estimate.options).toEqual(ESTIMATE_OPTIONS);

    const report = await say(d, 'REPORT');
    expect(report.reply).toContain(
      '📄 *Property Report* — 3-bed house in Claremont',
    );
    expect(report.reply).toContain('12/10/2026');
    expect(report.reply).toContain('Suggested asking price');
    expect(report.reply).toContain('Recent comparable sales');
    expect(report.reply).toContain('full-service sale (5–7% + VAT)');
    // WhatsApp rejects bodies over 1024 characters.
    expect(report.reply!.length).toBeLessThanOrEqual(1024);
    expect(report.options).toEqual(REPORT_OPTIONS);
    expect((await d.store.get(PHONE))?.reportSentAt).toBe(NOW.toISOString());

    const start = await say(d, 'START');
    expect(start.handled).toBe(false);
    expect(start.startIntakeWith?.facts).toEqual({
      suburb: 'Claremont',
      propertyType: 'house',
      bedrooms: 3,
    });
    expect(start.startIntakeWith?.estimate?.lowZar).toBeGreaterThan(0);
    expect(await d.store.get(PHONE)).toBeNull();
  });

  it('accepts a typed suburb, re-asks on nonsense, and flags a question for the concierge', async () => {
    const d = deps();
    await say(d, 'PRICE');
    const typed = await say(d, 'Mowbray');
    expect(typed.reply).toBe('What kind of home is it?');

    const nonsense = await say(d, 'castle');
    expect(nonsense.handled).toBe(true);
    expect(nonsense.reply).toContain('pick the kind of home');
    expect(nonsense.needsConcierge).toBeUndefined();

    const question = await say(d, 'how long does a transfer take?');
    expect(question.handled).toBe(true);
    expect(question.needsConcierge).toBe(true);
    expect(question.reply).toContain('pick the kind of home');
  });

  it('is deterministic for the same home', async () => {
    const run = async () => {
      const d = deps();
      await say(d, 'PRICE');
      await say(d, 'Sea Point');
      await say(d, 'apartment');
      return (await say(d, '2')).reply;
    };
    expect(await run()).toBe(await run());
  });

  it('offers the pricing chat when the data partner has nothing', async () => {
    const d = deps({ estimate: async () => null });
    await say(d, 'PRICE');
    await say(d, 'Nowhere');
    await say(d, 'house');
    const r = await say(d, '4');
    expect(r.reply).toContain('free, no-obligation pricing chat');
    expect(r.options?.kind).toBe('buttons');
    expect(r.options?.kind === 'buttons' && r.options.options[0].id).toBe(
      'CONSULT',
    );
    const report = await say(d, 'REPORT');
    expect(report.reply).toContain('pricing chat');
  });

  it('"List my property" mid-flow hands over whatever is known', async () => {
    const d = deps();
    await say(d, 'PRICE');
    await say(d, 'Newlands');
    const r = await say(d, 'START');
    expect(r.handled).toBe(false);
    expect(r.startIntakeWith?.facts).toEqual({ suburb: 'Newlands' });
    expect(r.startIntakeWith?.estimate).toBeUndefined();
  });
});
