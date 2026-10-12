import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { InvestorForm } from '@/components/InvestorForm';
import { Logo } from '@/components/Logo';
import { WhatsAppDemo } from '@/components/WhatsAppDemo';
import { Details } from '@/components/pitch/Details';
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
  CONCEPT_SECTION,
  DEMO_SECTION,
  DETAIL_SECTION,
  DISCLAIMER,
  FAQ,
  FIN_DETAIL,
  HERO,
  MARKET_DETAIL,
  MODEL_DETAIL,
  NAV,
  NEXT_STEPS,
  PRODUCT_DETAIL,
  QUALIFYING_PATH_NOTE,
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
                className="whitespace-nowrap hover:text-white"
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

      {/* Hero — the concept and the deal, nothing else */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/cape-town-hero.jpg"
          alt="Homes above the bay in Camps Bay, Cape Town, beneath the Twelve Apostles"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-navy/90 via-navy/75 to-slate-900/45"
        />
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-16 sm:pb-20 sm:pt-24">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-300">
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

      {/* The concept */}
      <Section
        id="concept"
        tone="tinted"
        eyebrow="Proposition"
        heading={CONCEPT_SECTION.heading}
      >
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CONCEPT_SECTION.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-navy p-6"
            >
              <h3 className="font-semibold text-brand-300">{card.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-300">
                {withZeroNote(card.body)}
              </p>
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

      {/* The raise */}
      <Section
        id="ask"
        eyebrow="The round"
        heading={ASK_SECTION.heading}
        intro={ASK_SECTION.intro}
      >
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-brand-500/40 bg-brand-500/5 p-6">
            <p className="text-sm font-medium text-slate-400">Seed round</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-white">
              {ASK.amount}{' '}
              <span className="text-2xl text-brand-300">for {ASK.stake}</span>
            </p>
            <p className="mt-1 text-base text-slate-300">{ASK.preMoney}</p>
            <p className="mt-4 text-sm text-slate-400">{ASK.seriesA}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-6">
            <h3 className="font-semibold text-white">Use of funds</h3>
            <ul className="mt-3 grid gap-2 text-base text-slate-300">
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

      {/* The detail, collapsed */}
      <Section
        id="detail"
        tone="tinted"
        eyebrow="Further detail"
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
            title={FIN_DETAIL.heading}
            summary="Revenue of R6.1m in Year 1 to R162.3m in Year 5; EBITDA-positive from Year 2. Base case, reviewed by a chartered accountant."
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {FIN_DETAIL.intro}
            </p>
            <RevenueBars />
            <StatGrid stats={FIN_DETAIL.stats} />
            <div className="mt-6">
              <TicketCalculator />
            </div>
            <p className="mt-6 max-w-3xl text-xs text-slate-400">
              {FIN_DETAIL.caveat}
            </p>
          </Details>

          <Details
            id="model"
            title={MODEL_DETAIL.heading}
            summary="Bond origination is the principal line: 0.5% of the bond through BetterBond in Year 1, about 1.5% in-house from Year 2."
          >
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
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {MODEL_DETAIL.revenueLines.map((line) => (
                <div
                  key={line.title}
                  className="rounded-2xl border border-slate-800 p-6"
                >
                  <h3 className="font-semibold">{line.title}</h3>
                  <p className="mt-2 text-base text-slate-300">{line.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 max-w-3xl">
              <h3 className="font-semibold text-white">
                {MODEL_DETAIL.perDeal.heading}
              </h3>
              <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-800 text-center">
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
            title={PRODUCT_DETAIL.heading}
            summary="Scope of the transfer process covered, cost of delivery, registered practitioners, and the cost base."
          >
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {PRODUCT_DETAIL.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-800 p-6"
                >
                  <h3 className="font-semibold text-brand-300">{card.title}</h3>
                  <p className="mt-2 text-base text-slate-300">
                    {withZeroNote(card.body)}
                  </p>
                </div>
              ))}
            </div>
          </Details>

          <Details
            id="market"
            title={MARKET_DETAIL.heading}
            summary="An addressable market of about R6.25bn a year. Entry at prime Cape Town, broadening into the national upper market."
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {MARKET_DETAIL.intro}
            </p>
            <StatGrid stats={MARKET_DETAIL.stats} />
            <p className="mt-6 max-w-3xl text-base text-slate-300">
              {MARKET_DETAIL.consumer}
            </p>
          </Details>

          <Details
            id="traction"
            title={TRACTION_DETAIL.heading}
            summary="What is built, and the launch partnerships in progress: BetterBond, LOOM, Capture Media and Paysoft."
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {TRACTION_DETAIL.intro}
            </p>
            <ul className="mt-6 grid max-w-3xl gap-3 text-slate-300">
              {TRACTION_DETAIL.shipped.map((item) => (
                <li key={item} className="flex gap-3 text-base">
                  <span aria-hidden className="text-brand-400">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
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
            title={TEAM_DETAIL.heading}
            summary="Two full-time founders and a technology partner providing the CTO function."
          >
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              {TEAM_DETAIL.intro}
            </p>
            <TeamGrid />
          </Details>

          <Details
            id="faq"
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
            title="What happens next"
            summary="The process from here to an allocation."
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
