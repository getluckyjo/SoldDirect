import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { InvestorForm } from '@/components/InvestorForm';
import { Logo } from '@/components/Logo';
import { WhatsAppDemo } from '@/components/WhatsAppDemo';
import { Details, SubHeading } from '@/components/pitch/Details';
import { IconTile } from '@/components/pitch/Icon';
import { Section } from '@/components/pitch/Section';
import { StatGrid } from '@/components/pitch/StatGrid';
import { RevenueBars } from '@/components/pitch/RevenueBars';
import { TeamGrid } from '@/components/pitch/TeamGrid';
import { TicketCalculator } from '@/components/pitch/TicketCalculator';
import { SummaryStrip } from '@/components/pitch/SummaryStrip';
import { QualifyingNote } from '@/components/pitch/QualifyingNote';
import { StickyCta } from '@/components/pitch/StickyCta';
import {
  ACCESS_SECTION,
  ASK,
  ASK_SECTION,
  COMMUNITY_NOTE,
  CONCEPT_SECTION,
  DEMO_SECTION,
  DETAIL_SECTION,
  DISCLAIMER,
  FAQ,
  FIN_DETAIL,
  HERO,
  HOOKS_SECTION,
  MARKET_DETAIL,
  MODEL_DETAIL,
  NAV,
  NEXT_STEPS,
  PARTNER_LOGOS,
  PRODUCT_DETAIL,
  QUALIFYING_PATH_NOTE,
  RETURN_SECTION,
  RIBBON,
  TEAM_DETAIL,
  TRACTION_DETAIL,
} from '@/content/pitch';

// Copy strings mark the qualifying-path condition as "0%*"; every instance
// must resolve instantly, so split around the token and render the tooltip.
function withZeroNote(text: string): ReactNode {
  if (!text.includes('0%*')) return text;
  const parts = text.split('0%*');
  return parts.flatMap((part, i) =>
    i < parts.length - 1
      ? [part, <QualifyingNote key={`zero-${i}`} />]
      : [part],
  );
}

export default function Investors() {
  return (
    <div>
      <div
        role="note"
        className="border-b border-white/10 bg-navy-950 px-6 py-2 text-center text-sm font-semibold text-brand-300"
      >
        {RIBBON}
      </div>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-navy">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <span className="inline-flex shrink-0 items-baseline">
            <Logo className="text-lg" />
            <span className="ml-2 hidden text-sm font-normal text-slate-400 sm:inline">
              Investors
            </span>
          </span>
          <nav className="hidden min-w-0 items-center gap-5 text-sm text-slate-300 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap hover:text-sky-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#access"
            className="shrink-0 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-navy hover:bg-brand-400"
          >
            Request access
          </a>
        </div>
      </header>

      {/* Hero — the proposition and the round, nothing else */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/cape-town-aerial-hero.jpg"
          alt="Aerial view of Green Point and the Atlantic coast beneath a tablecloth cloud on Table Mountain, Cape Town"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[50%_35%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-navy/90 via-navy/70 to-navy/40"
        />
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-16 sm:pb-20 sm:pt-24">
          <p className="text-sm font-medium uppercase tracking-wide text-sky-300">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm sm:text-6xl">
            {HERO.title}{' '}
            <span className="text-brand-400">
              {HERO.titleAccentPre}
              <QualifyingNote />
              {HERO.titleAccentPost}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200">{HERO.sub}</p>

          <SummaryStrip />

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#access"
              className="inline-flex rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-brand-400"
            >
              {HERO.ctaPrimary}
            </a>
            <a
              href="#demo"
              className="inline-flex rounded-lg border border-slate-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-brand-400 hover:text-brand-300"
            >
              {HERO.ctaSecondary} ↓
            </a>
            <a
              href={DEMO_SECTION.tryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg border border-brand-500/60 bg-brand-500/10 px-5 py-2.5 text-sm font-semibold text-brand-200 transition hover:bg-brand-500/20 hover:text-white"
            >
              {HERO.ctaTry} ↗
            </a>
          </div>
        </div>
      </section>

      {/* The proposition */}
      <Section
        id="concept"
        tone="tinted"
        eyebrow="Concept"
        heading={CONCEPT_SECTION.heading}
      >
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CONCEPT_SECTION.cards.map((card, i) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-slate-800 bg-navy p-6"
            >
              <div className="flex items-center gap-3">
                <IconTile name={card.icon} size="lg" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-sky-400">
                    {i + 1} of 3
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {card.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-base font-semibold leading-snug text-brand-300">
                {withZeroNote(card.lead)}
              </p>
              <ul className="mt-4 grid gap-2.5 border-t border-slate-800 pt-4 text-sm leading-relaxed text-slate-300">
                {card.points.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
                    />
                    <span>{withZeroNote(point)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* The hooks */}
      <Section
        id="hooks"
        eyebrow="The hooks"
        heading={HOOKS_SECTION.heading}
        intro={HOOKS_SECTION.intro}
      >
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {HOOKS_SECTION.hooks.map((hook, i) => (
            <div
              key={hook.title}
              className="flex gap-5 rounded-2xl border border-slate-800 bg-navy p-6"
            >
              <IconTile name={hook.icon} size="lg" />
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-sky-400">
                  Hook {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-white">
                  {hook.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {withZeroNote(hook.body)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Interactive journey */}
      <Section
        id="demo"
        eyebrow="Product demonstration"
        heading={DEMO_SECTION.heading}
        intro={DEMO_SECTION.intro}
        backdrop={{
          src: '/bo-kaap-street.jpg',
          alt: 'Colourful Bo-Kaap houses beneath Lion’s Head, Cape Town',
        }}
      >
        <div className="mt-8 rounded-3xl bg-white p-4 shadow-2xl sm:p-8">
          <WhatsAppDemo />
        </div>

        {/* Hands-on: the real seller flow, running in the browser */}
        <div className="mt-8 grid gap-6 rounded-2xl border border-brand-500/40 bg-navy/80 p-6 backdrop-blur md:grid-cols-[1fr_auto] md:items-center sm:p-8">
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              {DEMO_SECTION.tryHeading}
            </h3>
            <p className="mt-2 max-w-2xl text-base text-slate-300">
              {DEMO_SECTION.tryBody}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {DEMO_SECTION.tryNote}
            </p>
          </div>
          <a
            href={DEMO_SECTION.tryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-semibold text-navy transition hover:bg-brand-400"
          >
            {DEMO_SECTION.tryCta}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </Section>

      {/* Partner logos */}
      <section
        aria-label={PARTNER_LOGOS.heading}
        className="border-y border-brand-500/30 bg-brand-500/10"
      >
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
            {PARTNER_LOGOS.heading}
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {PARTNER_LOGOS.logos.map((logo) => (
              <li key={logo.name} className="flex items-center">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-7 w-auto sm:h-8"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Community aside */}
      <section
        aria-label={COMMUNITY_NOTE.heading}
        className="border-y border-sky-400/40 bg-sky-600/25"
      >
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-5 rounded-2xl border border-sky-400/30 bg-navy/70 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
            <IconTile name="map" size="lg" tone="sky" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-sky-300">
                {COMMUNITY_NOTE.eyebrow}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {COMMUNITY_NOTE.heading}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
                {COMMUNITY_NOTE.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {COMMUNITY_NOTE.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-xs text-sky-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The round */}
      <Section
        id="ask"
        eyebrow="The round"
        heading={ASK_SECTION.heading}
        intro={ASK_SECTION.intro}
      >
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-brand-500/40 bg-brand-500/5 p-6">
            <div className="flex items-center gap-3">
              <IconTile name="coins" />
              <p className="text-sm font-medium text-slate-400">Seed round</p>
            </div>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-white">
              {ASK.amount}{' '}
              <span className="text-2xl text-brand-300">for {ASK.stake}</span>
            </p>
            <p className="mt-1 text-base text-slate-300">{ASK.preMoney}</p>
            <p className="mt-4 text-sm text-slate-400">{ASK.seriesA}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <IconTile name="steps" />
              <h3 className="font-semibold text-white">Use of funds</h3>
            </div>
            <ul className="mt-4 grid gap-2 text-base text-slate-300">
              {ASK_SECTION.useOfFunds.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-brand-400">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#access"
              className="mt-6 inline-flex rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-brand-400"
            >
              Request the data room
            </a>
          </div>
        </div>
      </Section>

      {/* Return on the R5m */}
      <Section
        id="returns"
        tone="tinted"
        eyebrow="IRR"
        heading={RETURN_SECTION.heading}
        intro={RETURN_SECTION.intro}
      >
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RETURN_SECTION.tiles.map((tile, i) => (
            <div
              key={tile.label}
              className={`rounded-2xl border p-5 ${
                i >= 2
                  ? 'border-brand-500/40 bg-brand-500/5'
                  : 'border-slate-800 bg-navy'
              }`}
            >
              <p className="text-sm font-medium text-slate-400">{tile.label}</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-white">
                {tile.value}
              </p>
              {tile.sub ? (
                <p className="mt-1 text-sm text-slate-400">{tile.sub}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-navy">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <IconTile name="growth" size="sm" />
              <h3 className="font-semibold text-white">
                Multiple and IRR by scenario and exit multiple
              </h3>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              {RETURN_SECTION.cellNote}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Scenario
                  </th>
                  {RETURN_SECTION.columns.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-5 py-3 text-center font-medium"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RETURN_SECTION.rows.map((row) => {
                  const highlight = 'highlight' in row && row.highlight;
                  return (
                    <tr
                      key={row.scenario}
                      className={`border-t border-slate-800 ${
                        highlight ? 'bg-brand-500/5' : ''
                      }`}
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 align-top font-semibold text-white"
                      >
                        {row.scenario}
                        <span className="block text-xs font-normal text-slate-400">
                          {row.revenue}
                        </span>
                      </th>
                      {row.cells.map((cell, i) => (
                        <td
                          key={cell}
                          className={`px-5 py-4 text-center text-base tabular-nums ${
                            highlight && i === 1
                              ? 'font-extrabold text-brand-300'
                              : 'font-semibold text-slate-100'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-800 px-5 py-2 text-xs text-slate-500 sm:hidden">
            {RETURN_SECTION.cellNote}
          </p>
        </div>

        <ul className="mt-6 grid max-w-3xl gap-2 text-xs leading-relaxed text-slate-400">
          {RETURN_SECTION.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span aria-hidden className="text-brand-400">
                ·
              </span>
              {note}
            </li>
          ))}
        </ul>
      </Section>

      {/* The business plan, collapsed */}
      <Section
        id="detail"
        eyebrow="The Numbers"
        heading={DETAIL_SECTION.heading}
        intro={DETAIL_SECTION.intro}
        backdrop={{
          src: '/cape-town-aerial-atlantic.jpg',
          alt: 'Aerial view of the Atlantic Seaboard beneath Lion’s Head — Bantry Bay and Sea Point, Cape Town',
        }}
      >
        <div className="mt-8 grid gap-3">
          <Details
            id="numbers"
            icon="chart"
            title={FIN_DETAIL.heading}
            summary="Base case, reviewed by a chartered accountant. Revenue, margin and the enterprise-value range."
            keyPoints={FIN_DETAIL.keyPoints}
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {FIN_DETAIL.intro}
            </p>
            <SubHeading
              icon="chart"
              title="Revenue by year"
              note="Base case, R'm, with registered transactions below each year."
            />
            <RevenueBars />
            <SubHeading
              icon="coins"
              title="Headline figures"
              note="Margin, breakeven and the valuation range."
            />
            <StatGrid stats={FIN_DETAIL.stats} />
            <SubHeading
              icon="growth"
              title="Illustrative return on a ticket"
              note="Select an amount; figures derive from the base-case model."
            />
            <div className="mt-4">
              <TicketCalculator />
            </div>
            <p className="mt-6 max-w-3xl text-xs text-slate-400">
              {FIN_DETAIL.caveat}
            </p>
          </Details>

          <Details
            id="model"
            icon="bank"
            title={MODEL_DETAIL.heading}
            summary="Bond origination is the principal line; sponsorship, panel advertising and the 1% fee complete it."
            keyPoints={MODEL_DETAIL.keyPoints}
          >
            <SubHeading
              icon="bank"
              title="Origination: referral, then in-house"
              note="The step that lifts revenue per transaction from Year 2."
            />
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {[
                MODEL_DETAIL.originationStep.y1,
                MODEL_DETAIL.originationStep.y2,
              ].map((step, i) => (
                <div
                  key={step.label}
                  className={`rounded-2xl border p-6 ${
                    i === 1
                      ? 'border-brand-500/40 bg-brand-500/5'
                      : 'border-slate-800'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-400">
                    {step.label}
                  </p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    {step.rate}
                  </p>
                  <p className="mt-2 text-base text-slate-300">{step.body}</p>
                </div>
              ))}
            </div>
            <SubHeading
              icon="coins"
              title="The four revenue lines"
              note="Origination, bank sponsorship, panel advertising, facilitation fee."
            />
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {MODEL_DETAIL.revenueLines.map((line) => (
                <div
                  key={line.title}
                  className="rounded-2xl border border-slate-800 p-6"
                >
                  <h4 className="font-semibold text-brand-300">{line.title}</h4>
                  <p className="mt-2 text-base text-slate-300">{line.body}</p>
                </div>
              ))}
            </div>
            <SubHeading
              icon="home"
              title={MODEL_DETAIL.perDeal.heading}
              note="Per registered transaction, base case."
            />
            <div className="mt-4 max-w-3xl">
              <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-800 text-center">
                {MODEL_DETAIL.perDeal.rows.map((row) => (
                  <div
                    key={row.year}
                    className="border-slate-800 p-4 [&:not(:first-child)]:border-l"
                  >
                    <p className="text-sm text-slate-400">{row.year}</p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                      {row.value}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{row.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {MODEL_DETAIL.perDeal.explainer}
              </p>
            </div>
          </Details>

          <Details
            id="product"
            icon="phone"
            title={PRODUCT_DETAIL.heading}
            summary="What the platform covers, what it costs to deliver, who is involved, and the cost base."
            keyPoints={PRODUCT_DETAIL.keyPoints}
          >
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {PRODUCT_DETAIL.cards.map((card, i) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-800 p-6"
                >
                  <div className="flex items-center gap-3">
                    <IconTile
                      name={
                        (['shield', 'chat', 'people', 'coins'] as const)[i] ??
                        'check'
                      }
                      size="sm"
                    />
                    <h4 className="font-semibold text-brand-300">
                      {card.title}
                    </h4>
                  </div>
                  <p className="mt-3 text-base text-slate-300">
                    {withZeroNote(card.body)}
                  </p>
                </div>
              ))}
            </div>
          </Details>

          <Details
            id="market"
            icon="map"
            title={MARKET_DETAIL.heading}
            summary="Size, entry point and the share the base case implies by Year 5."
            keyPoints={MARKET_DETAIL.keyPoints}
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {MARKET_DETAIL.intro}
            </p>
            <SubHeading
              icon="map"
              title="Sizing"
              note="Total, serviceable and obtainable market, base case."
            />
            <StatGrid stats={MARKET_DETAIL.stats} />
            <SubHeading
              icon="home"
              title="What sellers retain"
              note="Against the full-service benchmark of 6% plus VAT."
            />
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {MARKET_DETAIL.consumer}
            </p>
          </Details>

          <Details
            id="traction"
            icon="check"
            title={TRACTION_DETAIL.heading}
            summary="What is built, and the launch partnerships in progress: BetterBond, LOOM, Capture Media, Paysoft, Lava Lamp Lab and Property24."
            keyPoints={TRACTION_DETAIL.keyPoints}
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {TRACTION_DETAIL.intro}
            </p>
            <SubHeading icon="check" title="Built" />
            <ul className="mt-4 grid max-w-3xl gap-3 text-slate-300">
              {TRACTION_DETAIL.shipped.map((item) => (
                <li key={item} className="flex gap-3 text-base">
                  <span aria-hidden className="text-brand-400">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <SubHeading icon="people" title="Partners" />
            <div className="mt-4 flex flex-wrap gap-3">
              {TRACTION_DETAIL.partners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-baseline gap-2 rounded-full border border-slate-700 bg-navy px-5 py-2.5"
                >
                  <span className="font-semibold text-white">
                    {partner.name}
                  </span>
                  <span className="text-sm text-slate-400">{partner.role}</span>
                </div>
              ))}
            </div>
          </Details>

          <Details
            id="team"
            icon="people"
            title={TEAM_DETAIL.heading}
            summary="Two full-time founders and a technology partner providing the CTO function."
            keyPoints={TEAM_DETAIL.keyPoints}
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {TEAM_DETAIL.intro}
            </p>
            <TeamGrid />
          </Details>

          <Details
            id="faq"
            icon="question"
            title="Questions and answers"
            summary="Sustainability of 0%, the position on agents, the conveyancer line, Purplebricks, sufficiency of the round, risks, and the terms."
          >
            <div className="mt-4 grid gap-3">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group/faq rounded-xl border border-slate-800 p-4 open:border-brand-500/40"
                >
                  <summary className="cursor-pointer list-none font-semibold text-slate-100 marker:content-none">
                    <span className="mr-2 text-brand-400 group-open/faq:hidden">
                      +
                    </span>
                    <span className="mr-2 hidden text-brand-400 group-open/faq:inline">
                      −
                    </span>
                    {item.q}
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-slate-300">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Details>

          <Details
            id="next"
            icon="steps"
            title="What happens next"
            summary="The process from here to an allocation."
            keyPoints={[
              { label: 'Step 1', value: 'Data room under NDA' },
              { label: 'Step 2', value: 'Model and cap table' },
              { label: 'Step 3', value: 'Meet the founders' },
            ]}
          >
            <ol className="mt-4 grid max-w-2xl gap-3 text-base text-slate-300">
              {NEXT_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-300"
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Details>
        </div>
      </Section>

      {/* Access / data room */}
      <section
        id="access"
        className="mx-auto max-w-3xl scroll-mt-20 px-6 py-16"
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {ACCESS_SECTION.heading}
          </h2>
          <p className="mt-2 text-base text-slate-300">
            {ACCESS_SECTION.intro}
          </p>
          <div className="mt-8">
            <InvestorForm />
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Prefer email?{' '}
            <a
              href="mailto:johannes@solddirect.co.za"
              className="font-medium text-brand-400 hover:text-brand-300"
            >
              johannes@solddirect.co.za
            </a>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            {DISCLAIMER}
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500">
          <p>{QUALIFYING_PATH_NOTE}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p>
              © {new Date().getFullYear()} Sold Direct. Cape Town, South Africa.
              Confidential — do not distribute. Not an offer to the public;
              private placement only.
            </p>
            <nav className="flex gap-5">
              <a
                href="mailto:johannes@solddirect.co.za"
                className="hover:text-slate-300"
              >
                johannes@solddirect.co.za
              </a>
              <Link href="/onepager" className="hover:text-slate-300">
                One-pager
              </Link>
              <Link href="/privacy" className="hover:text-slate-300">
                Privacy notice
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      <StickyCta />
    </div>
  );
}
