'use client';

import { useState } from 'react';

// The seller sets their home's price; both plans and the full-service
// comparison update live. Savings are framed neutrally per CLAUDE.md: what a
// full-service sale would cost, never a struck-through price.

const MIN_PRICE = 1_000_000;
const MAX_PRICE = 15_000_000;
const STEP = 100_000;
const DEFAULT_PRICE = 6_000_000;

const FLEX_RATE = 0.01;
// The full-service comparison: 6% commission plus 15% VAT.
const FULL_SERVICE_RATE = 0.06 * 1.15;

/** R6,000,000 — commas, matching the rest of the site's copy. */
function rand(amount: number): string {
  return `R${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

const INCLUDED = [
  'A full listing on the major property portals',
  'The WhatsApp concierge, from mandate to registration',
  'A deal tracker through every transfer stage',
  'Pre-qualified buyers, with the bond in the chat',
];

function Tick() {
  return (
    <span aria-hidden className="font-semibold text-brand-600">
      ✓
    </span>
  );
}

export function PricingPlans() {
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const flexFee = rand(price * FLEX_RATE);

  return (
    <div className="mt-10">
      {/* Price slider */}
      <div className="mx-auto max-w-4xl rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label
            htmlFor="home-price"
            className="text-sm font-semibold text-slate-600"
          >
            Your home&rsquo;s price
          </label>
          <output
            htmlFor="home-price"
            className="text-3xl font-extrabold tabular-nums tracking-tight text-slate-900"
          >
            {rand(price)}
          </output>
        </div>
        <input
          id="home-price"
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          aria-valuetext={rand(price)}
          className="mt-4 w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{rand(MIN_PRICE)}</span>
          <span>{rand(MAX_PRICE)}</span>
        </div>
      </div>

      {/* The two plans */}
      <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="relative flex flex-col rounded-3xl bg-white p-8 shadow-xl ring-2 ring-brand-300">
          <span className="absolute -top-3 left-8 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            0% commission
          </span>
          <h3 className="text-lg font-bold text-slate-900">Free</h3>
          <p className="mt-4 text-6xl font-extrabold tracking-tight text-brand-600">
            R0
          </p>
          <p className="mt-2 text-sm text-slate-600">
            No commission on your {rand(price)} home: the lender pays us an
            origination fee instead.
          </p>
          <p className="mt-6 text-sm font-semibold text-slate-900">
            What qualifies
          </p>
          <ul className="mt-3 grid gap-2.5 text-sm text-slate-600">
            <li className="flex gap-2">
              <Tick />A 90-day (or longer) exclusive mandate
            </li>
            <li className="flex gap-2">
              <Tick />
              Your buyer&rsquo;s bond of 80% or more, placed through our
              origination partner
            </li>
            <li className="flex gap-2">
              <Tick />A panel conveyancer handles the transfer
            </li>
          </ul>
          <div aria-hidden className="min-h-6 flex-1" />
          <p className="border-t border-slate-100 pt-4 text-sm text-slate-500">
            Cash buyer? A 1% facilitation fee ({flexFee}), agreed up front.
          </p>
        </div>

        <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-slate-900">Flex</h3>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              No lock-in
            </span>
          </div>
          <p className="mt-4 text-6xl font-extrabold tracking-tight text-slate-900">
            1%
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{flexFee}</span> on
            your {rand(price)} home, payable only when it sells.
          </p>
          <p className="mt-6 text-sm font-semibold text-slate-900">
            No conditions
          </p>
          <ul className="mt-3 grid gap-2.5 text-sm text-slate-600">
            <li className="flex gap-2">
              <Tick />
              No exclusivity
            </li>
            <li className="flex gap-2">
              <Tick />
              Any buyer, any bank, any conveyancer
            </li>
            <li className="flex gap-2">
              <Tick />
              Nothing to pay until your home sells
            </li>
          </ul>
          <div aria-hidden className="min-h-6 flex-1" />
          <p className="border-t border-slate-100 pt-4 text-sm text-slate-500">
            For sellers who prefer no exclusivity.
          </p>
        </div>
      </div>

      {/* Included on both, and the neutral comparison */}
      <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-slate-200 p-6 sm:p-8">
        <p className="text-sm font-semibold text-slate-900">
          Included on both plans
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-2">
              <Tick />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
          For comparison, a full-service sale at 6% plus VAT would cost{' '}
          <span className="font-semibold text-slate-900">
            {rand(price * FULL_SERVICE_RATE)}
          </span>{' '}
          on the same home.
        </p>
      </div>
    </div>
  );
}
