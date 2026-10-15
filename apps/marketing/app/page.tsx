import Image from 'next/image';
import Link from 'next/link';
import { IconTile, type IconName } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { QualifyingNote } from '@/components/QualifyingNote';
import { Section } from '@/components/Section';
import { StickyCta } from '@/components/StickyCta';
import { WaitlistForm } from '@/components/WaitlistForm';
import { whatsappCtas } from '@/lib/whatsapp';
import { WhatsAppDemo } from '@/components/WhatsAppDemo';
import { HERO } from '@/content/site';

const CONTACT_EMAIL = 'johannes@solddirect.co.za';

const STEPS = [
  {
    title: 'Start on WhatsApp',
    body: 'Send LIST or PRICE. One menu: find out what your home is worth, or list it. Every step is a tap, and a person is one tap away.',
  },
  {
    title: 'Quick Estimate and Property Report',
    body: 'A price range from confirmed nearby sales, then a free Property Report for your home. Market guidance, not a valuation; the asking price is yours.',
  },
  {
    title: 'List, and buyers pre-qualify',
    body: 'Build your listing in a few taps and it goes to Property24. Buyers pre-qualify for a bond in the chat, so you deal with serious offers.',
  },
  {
    title: 'Offer to transfer',
    body: 'Sign the Offer to Purchase, a panel conveyancer handles the transfer, and every stage is reported until registration at the Deeds Office.',
  },
];

// Who it's for: what the seller does and what we do.
const FOR_POINTS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'key',
    title: 'You host the viewings',
    body: 'We do the paperwork.',
  },
  {
    icon: 'chat',
    title: 'A WhatsApp concierge',
    body: 'With you from mandate to registration.',
  },
  {
    icon: 'home',
    title: 'On the major property portals',
    body: 'A full, agency-grade listing, not a DIY ad.',
  },
];

// What the sale would cost on a R6m home. Framed neutrally, per CLAUDE.md:
// what a full-service sale would cost, never a struck-through price.
const COSTS = [
  {
    label: 'A full-service sale at 6% + VAT',
    value: 'R414,000',
    amount: 414_000,
    highlight: false,
  },
  {
    label: 'Sold Direct Flex, or a cash buyer (1%)',
    value: 'R60,000',
    amount: 60_000,
    highlight: false,
  },
  {
    label: 'Sold Direct on the qualifying path',
    value: 'R0',
    amount: 0,
    highlight: true,
  },
];

// What comes with the sale, from the investor site's hooks, in seller terms.
const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'bolt',
    title: 'A free instant estimate',
    body: 'A price range on WhatsApp in minutes, from confirmed sales nearby. Market guidance, not a valuation.',
  },
  {
    icon: 'chat',
    title: 'A WhatsApp concierge, always on',
    body: 'Pricing, viewings, offers, the bond and the transfer, answered in the same thread, day or night. A person is one tap away.',
  },
  {
    icon: 'handshake',
    title: 'Services after the sale',
    body: 'Removals, painting, leasing, gardening and recycling, arranged through our partners.',
  },
];

const AFTER_SALE = {
  heading: 'The relationship continues after the sale.',
  body: 'Once the transfer is registered, the same WhatsApp thread helps you settle into your new neighbourhood.',
  items: [
    'Local security groups',
    'Moms’ groups',
    'Pet sitters',
    'New restaurants',
    'Schools and sport',
    'Ultra-local tips',
  ],
};

// White-on-transparent PNGs shared with the investor site; rendered dark on
// this light page with a CSS filter.
const PARTNERS = [
  { name: 'BetterBond', src: '/partners/betterbond.png', width: 911 },
  { name: 'LOOM', src: '/partners/loom.png', width: 489 },
  { name: 'Paysoft', src: '/partners/paysoft.png', width: 564 },
  { name: 'Property24', src: '/partners/property24.png', width: 911 },
  { name: 'Lava Lamp Lab', src: '/partners/lava-lamp-lab.png', width: 389 },
];

const TIERS = [
  {
    name: 'Free',
    tagline: '0% commission',
    price: 'R0',
    mechanic:
      'Your buyer’s bond is placed through our origination partner and a panel conveyancer handles the transfer. The lender pays us; you pay nothing.',
    points: [
      'Full listing, portal syndication & deal tracker',
      'WhatsApp concierge from mandate to registration',
      'Exclusive with us for a fixed term',
    ],
    foot: 'Cash buyer? A 1% facilitation fee, agreed up front.',
    highlight: true,
  },
  {
    name: 'Flex',
    tagline: 'No lock-in',
    price: '1%',
    mechanic:
      'No exclusivity and no partner requirements. One fee, payable only when your home sells.',
    points: [
      'The same platform, tools and concierge',
      'Any buyer, any bank, any conveyancer',
      'Nothing to pay until your home sells',
    ],
    foot: 'For sellers who prefer no exclusivity.',
    highlight: false,
  },
];

const ADDONS = [
  {
    title: 'Photography & floor plans',
    body: 'Professional photography and floor plans for your listing.',
  },
  {
    title: 'Featured placement & social campaigns',
    body: 'Featured portal placement and targeted social campaigns.',
  },
  {
    title: 'Compliance-certificate coordination',
    body: 'We arrange the certificates your transfer needs: electrical, plumbing, gas and others.',
  },
];

const FAQ = [
  {
    q: 'Is it really 0% commission?',
    a: 'Yes. When your buyer takes a bond of 80% or more through our origination partner and a panel conveyancer handles the transfer, the lender pays us an origination fee and you pay no commission.',
  },
  {
    q: 'What if my buyer pays cash?',
    a: 'A cash offer is often the best offer. With no bond there is no origination fee, so a 1% facilitation fee applies, agreed up front in your mandate. On a R6m home that is R60,000; a full-service sale at 6% plus VAT would cost about R414,000.',
  },
  {
    q: 'What does the exclusive mandate involve? Can I cancel?',
    a: 'A fixed-term exclusive mandate in plain language, e-signed on WhatsApp and held by a registered property practitioner. Cancellation follows its notice terms. Flex has no exclusivity.',
  },
  {
    q: 'Are you against estate agents?',
    a: 'No. Full-service agents are the right choice for many sellers, and we work with registered practitioners ourselves. We serve sellers who choose to sell privately.',
  },
  {
    q: 'Is my information safe?',
    a: 'We ask for consent before collecting anything, collect only what each step needs, encrypt sensitive fields and never sell your information, in line with POPIA. See the privacy notice and compliance page.',
  },
];

export default function Home() {
  // Every CTA sends people into WhatsApp with LIST or PRICE pre-filled.
  // Null until the sender is approved (docs/META-ONBOARDING.md) — the
  // waitlist is the fallback until then.
  const wa = whatsappCtas();

  return (
    <div>
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-navy">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo className="text-lg" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 sm:flex">
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#journey" className="hover:text-white">
              The journey
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
            <Link href="/compliance" className="hover:text-white">
              Compliance
            </Link>
            <a
              href={wa ? wa.list.href : '#waitlist'}
              className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              {wa ? 'Send “LIST” on WhatsApp' : 'Join waitlist'}
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative isolate overflow-hidden">
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
          className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/80 via-slate-900/55 to-slate-900/25"
        />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/30 backdrop-blur">
            {HERO.eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm sm:text-6xl">
            {HERO.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-semibold leading-snug text-white drop-shadow-sm sm:text-2xl">
            {HERO.sub}{' '}
            <span className="text-brand-300">
              {HERO.subAccentPre}
              <QualifyingNote />
              {HERO.subAccentPost}
            </span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={wa ? wa.list.href : '#waitlist'}
              className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-950/20 transition hover:bg-brand-500"
            >
              {wa ? 'Send “LIST” on WhatsApp' : 'Join the waitlist'}
            </a>
            {wa ? (
              <a
                href={wa.price.href}
                className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Send “PRICE” — what’s my home worth?
              </a>
            ) : null}
            <a
              href="#how"
              className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              See how it works
            </a>
          </div>
          {wa ? (
            <p className="mt-4 text-sm text-slate-200">
              Everything happens on WhatsApp. No forms, no logins.
            </p>
          ) : null}
        </div>
      </section>

      {/* Who it's for + what the sale would cost */}
      <section
        id="for"
        className="scroll-mt-20 border-y border-slate-200/70 bg-slate-50"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
              Who it&rsquo;s for
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              For sellers who choose to sell direct.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Full-service agents are the right choice for many sellers. Sold
              Direct is for those who prefer to sell themselves, with our
              platform and people handling each step.
            </p>
            <ul className="mt-8 grid gap-5">
              {FOR_POINTS.map((point) => (
                <li key={point.title} className="flex gap-4">
                  <IconTile name={point.icon} />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {point.title}
                    </p>
                    <p className="mt-0.5 text-slate-600">{point.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-4 border-t border-slate-200 pt-6">
              <IconTile name="shield" />
              <p className="text-sm text-slate-600">
                Every mandate will be held by a PPRA-registered property
                practitioner.{' '}
                <Link
                  href="/compliance"
                  className="font-medium text-brand-700 underline-offset-2 hover:underline"
                >
                  How we keep it compliant →
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
            <p className="text-sm font-semibold text-slate-500">
              On a R6m home
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              What the sale would cost you
            </h3>
            <dl className="mt-6 grid gap-6">
              {COSTS.map((cost) => (
                <div
                  key={cost.label}
                  className={
                    cost.highlight ? 'border-t border-slate-200 pt-6' : ''
                  }
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <dt
                      className={
                        cost.highlight
                          ? 'font-semibold text-slate-900'
                          : 'text-sm text-slate-600'
                      }
                    >
                      {cost.label}
                    </dt>
                    <dd
                      className={`shrink-0 font-extrabold tabular-nums tracking-tight ${
                        cost.highlight
                          ? 'text-5xl text-brand-600'
                          : 'text-2xl text-slate-700'
                      }`}
                    >
                      {cost.value}
                    </dd>
                  </div>
                  {/* Meter: each cost as a share of the full-service cost */}
                  <div
                    aria-hidden
                    className="mt-2 h-2 rounded-full bg-slate-100"
                  >
                    {cost.amount > 0 ? (
                      <div
                        className="h-2 rounded-full bg-slate-400"
                        style={{
                          width: `${(cost.amount / COSTS[0].amount) * 100}%`,
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-slate-500">
              The qualifying path: a 90-day exclusive mandate, your
              buyer&rsquo;s bond placed through our partner, and a panel
              conveyancer.{' '}
              <a
                href="#pricing"
                className="font-medium text-brand-700 underline-offset-2 hover:underline"
              >
                Compare the options →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section
        id="how"
        eyebrow="The journey"
        heading="How it works"
        intro="The South African property journey, guided step by step on WhatsApp, from the first message to registration."
        backdrop={{
          src: '/bo-kaap-street.jpg',
          alt: 'Colourful Bo-Kaap houses beneath Lion’s Head, Cape Town',
        }}
      >
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-white/50 bg-white/90 p-6 shadow-lg backdrop-blur"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* What comes with the sale, and after it */}
      <Section
        id="included"
        eyebrow="What you get"
        heading="More than a listing."
        intro="Everything that comes with selling through Sold Direct, from the first estimate to life in your next home."
      >
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <IconTile name={f.icon} />
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-brand-200 bg-brand-50/60 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
          <IconTile name="map" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              And afterwards
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {AFTER_SALE.heading}
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              {AFTER_SALE.body}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {AFTER_SALE.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-inset ring-slate-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Interactive journey */}
      <Section
        id="journey"
        tone="tinted"
        eyebrow="The journey, step by step"
        heading="The whole journey, inside WhatsApp."
        intro="One Cape Town home, from “What’s my home worth?” to registered sale. Press Play, or step through it."
      >
        <div className="mt-8 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200 sm:p-8">
          <WhatsAppDemo />
        </div>
        <div className="mt-8 grid gap-6 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center sm:p-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Try the seller flow yourself.
            </h3>
            <p className="mt-2 max-w-2xl text-slate-600">
              The listing flow runs in your browser with no server behind it.
              Nothing you type is stored. Type “list” to begin.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Opens in a new tab. Price guidance in the demonstration is
              illustrative.
            </p>
          </div>
          <a
            href="/demo.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Open the seller flow
            <span aria-hidden>↗</span>
          </a>
        </div>
      </Section>

      {/* Partners */}
      <section aria-label="Our partners" className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Our partners
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {PARTNERS.map((p) => (
              <li key={p.name} className="flex items-center">
                <Image
                  src={p.src}
                  alt={p.name}
                  width={p.width}
                  height={160}
                  className="h-7 w-auto opacity-70 brightness-0 sm:h-8"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <Section
        id="pricing"
        eyebrow="Pricing"
        heading="Two ways to sell."
        intro="When your buyer’s bond is placed through our partner, the lender pays us and you pay 0%. With no bond, a 1% facilitation fee applies, agreed up front."
      >
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                tier.highlight
                  ? 'border-brand-300 bg-white shadow-lg ring-2 ring-brand-200'
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  {tier.name}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  {tier.tagline}
                </span>
              </div>
              <p className="mt-4 text-6xl font-extrabold tracking-tight text-slate-900">
                {tier.price}
              </p>
              <p className="mt-4 text-sm text-slate-600">{tier.mechanic}</p>
              <ul className="mt-6 grid gap-2.5 text-sm text-slate-600">
                {tier.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden className="font-semibold text-brand-600">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div aria-hidden className="min-h-6 flex-1" />
              <p className="border-t border-slate-100 pt-4 text-sm text-slate-500">
                {tier.foot}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-4xl text-center text-sm text-slate-600">
          On a R6m home, that is{' '}
          <span className="font-semibold text-brand-700">R0</span> or{' '}
          <span className="font-semibold text-brand-700">R60,000</span>. A
          full-service sale at 6% plus VAT would cost about R414,000.
        </p>
        <p className="mx-auto mt-3 max-w-4xl text-center text-xs text-slate-400">
          Pricing shown is indicative for our Cape Town launch and subject to
          our terms.
        </p>
      </Section>

      {/* Add-ons */}
      <Section
        id="addons"
        eyebrow="À la carte"
        heading="Optional add-ons"
        intro="Optional services, priced per service."
        backdrop={{
          src: '/living-room-interior.jpg',
          alt: 'A bright, professionally styled living room, ready for viewings',
          overlay: 'light',
        }}
      >
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {ADDONS.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
            >
              <h3 className="font-semibold text-brand-700">{a.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="Questions" heading="Questions sellers ask">
        <div className="mt-8 grid max-w-3xl gap-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-brand-300"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none">
                <span className="mr-2 text-brand-600">＋</span>
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* City banner */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/cape-town-hero.jpg"
          alt="Homes above the bay in Camps Bay, Cape Town, beneath the Twelve Apostles"
          width={2400}
          height={1350}
          sizes="100vw"
          className="h-[22rem] w-full object-cover object-[50%_40%] saturate-[1.1] sm:h-[30rem]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-12">
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl">
              Built for Cape Town, from the first listing to registration.
            </h2>
            <p className="mt-3 max-w-xl text-lg text-slate-200 drop-shadow">
              Designed around how South African transfers work.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="mx-auto max-w-3xl scroll-mt-20 px-6 py-16"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Join the Cape Town launch list
          </h2>
          <p className="mt-2 text-slate-600">
            Register your interest and we will be in touch as we go live.
          </p>
          {wa ? (
            <p className="mt-3 rounded-xl bg-brand-50 p-3 text-sm text-brand-800">
              Ready now? Send{' '}
              <a
                href={wa.list.href}
                className="font-semibold underline underline-offset-2"
              >
                “LIST”
              </a>{' '}
              or{' '}
              <a
                href={wa.price.href}
                className="font-semibold underline underline-offset-2"
              >
                “PRICE”
              </a>{' '}
              to our WhatsApp and we’ll take it from there.
            </p>
          ) : null}
          <div className="mt-8">
            <WaitlistForm />
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Prefer email?{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-brand-700 hover:text-brand-600"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Logo className="text-lg" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
            <span>
              © {new Date().getFullYear()} Sold Direct. Cape Town, South Africa.
            </span>
            <nav className="flex flex-wrap gap-5">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                {CONTACT_EMAIL}
              </a>
              <Link href="/onepager" className="hover:text-white">
                One-pager
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy notice
              </Link>
              <Link href="/compliance" className="hover:text-white">
                Compliance
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      <StickyCta />
    </div>
  );
}
