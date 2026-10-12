// All copy and numbers for the investor pitch page live here so a designer
// restyle only touches components. Figures must match the data room —
// each block cites its source document. Copy follows the positioning
// guardrails in CLAUDE.md (never anti-agent; savings framed neutrally;
// every 0% resolves to the qualifying-path note).
//
// The page sells the concept. Anything an investor only needs once they are
// interested (model detail, market sizing, team, traction, FAQ) renders
// inside collapsibles, and the full detail lives in the data room.

export type Stat = { label: string; value: string; sub?: string };
export type Card = { title: string; body: string };

// source: docs/dataroom/02-capital-and-valuation.md §1
export const RIBBON =
  'Seed round open: R5m for 20% at a R20m pre-money valuation';

// source: docs/dataroom/02-capital-and-valuation.md §1
export const ASK = {
  amount: 'R5m',
  stake: '20%',
  preMoney: 'R20m pre-money · R25m post-money',
  seriesA:
    'Covers the cash trough in every modelled scenario, the conservative case included, because a four-person team runs the business until it is self-funding — EBITDA-positive in Year 2. A Series A is modelled at Year 3 as optional — offence, not survival.',
} as const;

export const HERO = {
  eyebrow: 'Private placement · Cape Town · WhatsApp-first',
  title: 'Sell a home on WhatsApp.',
  // The 0%* token is rendered between these two parts as a tap-to-resolve note.
  titleAccentPre: 'At ',
  titleAccentPost: ' commission.',
  sub: 'Sold Direct runs the whole private sale — listing, buyer, bond, offer, transfer — over WhatsApp, with registered property practitioners guiding every step. The seller pays nothing on the qualifying path. The bank pays us.',
  ctaPrimary: 'Request the data room',
  ctaSecondary: 'See it work',
  ctaTry: 'Try it yourself',
} as const;

// The one-sentence resolution behind every 0%* (tooltip copy).
export const QUALIFYING_TOOLTIP =
  '0% applies on the qualifying path: exclusive mandate + ≥80% bond via our origination partner. Otherwise a 1% flex fee applies.';

// Full wording, rendered in the footer (verbatim — do not edit).
// source: docs/dataroom/00-assumptions.md §C; 01-financial-model.md §5
export const QUALIFYING_PATH_NOTE =
  '* 0% commission applies on the qualifying path: an exclusive mandate for the agreed term, a qualifying ≥80% bond placed via our origination partner, and a panel conveyancer (with a fee discount passed to the seller). Otherwise a 1% facilitation fee applies.';

// The deal at a glance — the most important element on the page.
// source: docs/dataroom/README.md headlines; 01/02 dataroom docs
export const SUMMARY_STRIP = [
  { label: 'Raising', value: 'R5m for 20%', sub: 'R20m pre-money' },
  {
    label: 'Who pays us',
    value: 'The bank',
    sub: 'Bond origination, not commission',
  },
  { label: 'Status', value: 'Built & working', sub: 'WhatsApp loop live' },
  {
    label: 'Y5 revenue (base case)',
    value: 'R162m',
    sub: 'EBITDA-positive from Year 2',
  },
] satisfies Stat[];

// The concept in three beats. source: docs/dataroom/README.md (strategy)
export const CONCEPT_SECTION = {
  heading: 'The idea, in three parts.',
  cards: [
    {
      title: '1 · A listing is not a sale',
      body: 'The portals already sell private sellers a flat-fee listing. After the enquiry, the seller is alone with pricing, viewings, the offer, the bond, FICA and transfer. Full-service agents do all of that for 5–7% + VAT — a great choice for most people, and not what the self-service segment wants.',
    },
    {
      title: '2 · WhatsApp runs the sale',
      body: 'Sold Direct takes the seller from listing to registered transfer inside the chat they already use. Modern technology does the admin; our registered property practitioners (PPRA, Fidelity Fund Certificate) and a concierge stay in the loop on every deal.',
    },
    {
      title: '3 · The bank pays, not the seller',
      body: 'Every South African property deal already carries a bond origination fee paid by the bank. We capture it — via BetterBond in Year 1, in-house from Year 2 — so the sale is 0%* to the seller on the qualifying path and a disclosed 1% otherwise.',
    },
  ] satisfies Card[],
} as const;

// source: docs/dataroom/README.md (AI-lean strategy); founder-confirmed status
export const PRODUCT_DETAIL = {
  heading: 'More on the product',
  cards: [
    {
      title: 'Knows the SA transfer, end to end',
      body: 'Offers to purchase (OTPs), suspensive conditions, Financial Intelligence Centre Act (FICA) checks, rates clearance, the Deeds Office — South Africa’s central property registry — and bank credit patterns.',
    },
    {
      title: 'Streamlines the process at near-zero cost',
      body: 'Listing intake, buyer qualification, offer assembly, document chasing, "where is my deal?" — done through modern tech and WhatsApp, with people in the loop. The reason 0%* is sustainable, not a loss-leader.',
    },
    {
      title: 'People stay in the loop',
      body: 'Practitioners registered with the Property Practitioners Regulatory Authority (PPRA), holding Fidelity Fund Certificates, assist both parties. Registration and an FFC are a precondition to taking any mandate — see the risk register. Full-service agents remain a great choice for those who want them.',
    },
    {
      title: 'A structurally lean cost base',
      body: 'Modern tech handles the repetitive steps; four people in Year 1 — two founders, a principal practitioner and an agent — to a delivery-realistic 96 by Year 5, mostly practitioners and support. Reinvest the ~88% gross margin into brand.',
    },
  ] satisfies Card[],
} as const;

// source: docs/dataroom/01-financial-model.md §1–2
export const MODEL_DETAIL = {
  heading: 'How the revenue works',
  originationStep: {
    y1: {
      label: 'Year 1 — BetterBond referral',
      rate: '0.5% of the bond',
      body: 'Qualifying ≥80% bonds placed via BetterBond, a registered multi-bank originator. The buyer keeps full rate choice; the bank pays.',
    },
    y2: {
      label: 'Year 2+ — origination in-house',
      rate: '~1.5% of the bond',
      body: 'We become our own originator, direct with the banks — roughly 3× the referral.',
    },
  },
  revenueLines: [
    {
      title: 'Bond origination',
      body: 'The engine: R29k per qualifying deal in Year 1, ~R78k in Year 2 once in-house — paid by the bank.',
    },
    {
      title: 'Bank headline sponsorship',
      body: 'Annual platform sponsorship from a featured bank — advertising, not steering. R3m (Y1) → R8m (Y5).',
    },
    {
      title: 'Conveyancer panel advertising',
      body: 'Fixed annual subscriptions, R0.36m → R2.4m. No referral fees — the Legal Practice Council (LPC) prohibits them; sellers get a 30–40% fee discount.',
    },
    {
      title: '1% Flex fee',
      body: 'On cash, sub-80%-bond or non-partner deals — a fraction of what a full-service sale (5–7% + VAT) would have cost, disclosed up front.',
    },
  ] satisfies Card[],
  perDeal: {
    heading: 'Blended revenue per registered deal',
    rows: [
      { year: 'Y1', value: 'R55.7k', note: 'BetterBond referral' },
      { year: 'Y2', value: 'R70.6k', note: 'Origination in-house' },
      { year: 'Y5', value: 'R52.4k', note: 'Price taper' },
    ],
    // Why it dips: mix shift, not weakening economics.
    explainer:
      'It dips by Year 5 because the average transacting price deliberately tapers (R6.5m → R4.0m) as we broaden from prime into the wider upper-market — a mix shift, priced into the model.',
  },
} as const;

// source: docs/dataroom/03-market-sizing.md
export const MARKET_DETAIL = {
  heading: 'Market',
  intro:
    'A R6.25bn-a-year market. We land at prime Cape Town (average transacting price R6.5m), then broaden into the national upper-market — tapering to R4.0m by Year 5. Distributed through the portals as an agency-grade feed: a wholesale partner to the portals, not a competitor.',
  stats: [
    {
      label: 'TAM',
      value: 'R6.25bn/yr',
      sub: 'Addressable revenue across ~250,000 annual SA transfers',
    },
    {
      label: 'SAM',
      value: 'R1.8bn/yr',
      sub: 'Upper-market (>~R4m): ~35,000 transfers a year',
    },
    {
      label: 'SOM (base, Y5)',
      value: '8.3%',
      sub: 'Of upper-market transactions — 1.16% of all SA transfers',
    },
  ] satisfies Stat[],
  consumer:
    'By Year 5 our sellers keep ~R733m a year — ~R1.46bn cumulatively — that a full-service sale (6% + VAT benchmark) would have cost. Full-service agents keep serving the majority who want full service; we serve those who choose to sell themselves.',
} as const;

// source: docs/dataroom/01-financial-model.md §3 (base case, CA-reviewed)
export const REVENUE_RAMP = [
  { year: 'Y1', revenue: 6.14, deals: 50 },
  { year: 'Y2', revenue: 20.24, deals: 220, ebitdaPositive: true },
  { year: 'Y3', revenue: 46.83, deals: 650 },
  { year: 'Y4', revenue: 94.72, deals: 1500 },
  { year: 'Y5', revenue: 162.3, deals: 2900 },
] as const;

// source: docs/dataroom/01-financial-model.md, 02-capital-and-valuation.md
export const FIN_DETAIL = {
  heading: 'The numbers',
  intro:
    'The base case from the chartered-accountant-reviewed model: 27% tax, delivery-realistic headcount, LPC-prohibited revenue removed. Full workbook in the data room.',
  stats: [
    {
      label: 'EBITDA-positive',
      value: 'Year 2',
      sub: 'Four-person team until self-funding',
    },
    {
      label: 'Gross margin',
      value: '~88%',
      sub: 'COGS built bottom-up, ~12% of revenue',
    },
    {
      label: 'Y5 enterprise value',
      value: 'R649–974m',
      sub: 'At 4–6× revenue (SA-discounted proptech comps)',
    },
  ] satisfies Stat[],
  caveat:
    'Illustrative, model-grade projections (CA-reviewed workbook available in the data room under NDA) — not a forecast or guarantee. Key inputs, sources and reliability flags are documented per line.',
} as const;

// source: docs/PROGRESS.md; partnerships founder-confirmed
export const TRACTION_DETAIL = {
  heading: 'Traction & partners',
  intro:
    'The loop runs today — list, qualify, offer, transfer — and the launch partnerships are signed up or in motion.',
  shipped: [
    'WhatsApp journey end-to-end: listing → enquiry → consented bond pre-qualification → offer → transfer tracking',
    'Deal state machine for the SA transfer: offer to purchase (OTP) → bond → FICA → clearance → lodgement → registration',
    'Internal control-room dashboard; public marketing site with waitlist',
    'Typed end-to-end, automated tests, CI green; privacy-by-design under the Protection of Personal Information Act (POPIA)',
  ],
  partners: [
    { name: 'BetterBond', role: 'Bond origination (Y1 referral)' },
    { name: 'Loom', role: 'Property valuations' },
    { name: 'Capture Media', role: 'Listing video & photography' },
    { name: 'Paysoft', role: 'Technology partner (vesting equity)' },
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §3
export const TEAM_DETAIL = {
  heading: 'Team',
  intro:
    'Two working founders, a technology partner carrying the CTO function, and a reserved seat for strategic weight. Full cap table and terms are in the data room.',
  // photo: drop a headshot at public/team/<file>.jpg and set it here —
  // the card falls back to branded initials until then.
  people: [
    {
      name: 'Johannes le Roux',
      role: 'Co-founder · Marketing Director',
      initials: 'JR',
      bio: 'Property Studies at UCT. Built and sold three consumer brands, and now leads brand, growth and the seller funnel — the seed’s biggest spend, run by a founder who has done it with his own companies.',
    },
    {
      name: 'Dean',
      role: 'Co-founder · Managing Director',
      initials: 'D',
      bio: 'Architecture at UCT. A proven commercial architect — lead on the Babylonstoren development, one of the Cape’s landmark estates. Runs delivery, partnerships and the transfer operation.',
    },
    {
      name: 'Paysoft',
      role: 'Technology Partner · CTO function',
      initials: 'PS',
      bio: 'Carries the CTO role: engineering delivery of the WhatsApp platform and modern-tech backbone at preferred development rates, with equity vesting only as that value is delivered.',
    },
    {
      name: 'Board seat',
      role: 'Reserved · Non-executive',
      initials: '+',
      bio: 'A reserved allocation for a strategic non-executive director — property, banking or consumer-brand weight to open doors ahead of the Series A.',
    },
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §1–2 (Use of Funds tab)
export const ASK_SECTION = {
  heading: 'R5m for 20%.',
  intro:
    'A lean seed at a R20m pre-money valuation. Four people run the business until it is self-funding — the founders at R50k a month doing the marketing, management, dealmaking, bookkeeping and tech support themselves, a principal practitioner, and an agent — with no office and hires only against signed mandates. R5m clears the cash trough in every scenario with headroom; the rest is launch and growth capital.',
  useOfFunds: [
    'Cape Town launch + brand campaign',
    'Registered practitioners + concierge team',
    'In-house origination accreditation (FAIS/FSP + bank agreements)',
    'Platform integrations (WhatsApp BSP, BetterBond, conveyancers)',
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §2b — the seed models
// ~27× to the base-case exit (~R811m EV at 5× Y5 revenue, post-Series-A
// dilution). The calculator scales that per rand invested; post-money R25m.
export const CALCULATOR = {
  heading: 'What your ticket becomes',
  sub: 'Drag to your investment. Illustrative outcomes from the published base-case model.',
  postMoney: 25_000_000,
  postMoneyLabel: 'R25m',
  min: 500_000,
  max: 5_000_000,
  step: 250_000,
  initial: 1_000_000,
  exitMultiple: 27,
  exitLabel:
    'Modelled value at the base-case exit (~R811m EV, Y5, post-dilution)',
  caveat:
    'Illustrative only, from the model-grade base case (5× Y5 revenue exit multiple, post-optional-Series-A dilution). Not a forecast, guarantee or offer; early-stage investment carries risk, including loss of capital.',
} as const;

export const FAQ = [
  {
    q: 'Why is 0% commission sustainable?',
    a: 'Because the bank pays us, not the consumer. Origination earns 0.5% of the bond via BetterBond in Year 1 and ~1.5% in-house from Year 2, while modern tech streamlines the process at near-zero cost. Non-qualifying deals pay a disclosed 1% fee.',
  },
  {
    q: 'Are you against estate agents?',
    a: 'No — we are complementary, not adversarial. Full-service agents remain a great choice for the majority who want full service; we serve sellers who choose to do it themselves, assisted by PPRA-registered practitioners. The industry describes the same split: RE/MAX Southern Africa’s leadership says technology should take the admin, after-hours enquiries and buyer qualification while people keep the judgement and the relationship (Property Professional, October 2026). That is exactly how Sold Direct is built.',
  },
  {
    q: 'Is the conveyancer revenue line legal?',
    a: 'Yes — it is designed around Legal Practice Council (LPC) rules. Attorneys pay no referral fees; panel firms pay fixed annual advertising subscriptions, and sellers who use the panel get a 30–40% conveyancing fee discount.',
  },
  {
    q: 'What about Purplebricks?',
    a: 'It is the cautionary comp we manage against. Purplebricks died of marketing-led acquisition costs and over-expansion; we land at prime Cape Town where demand is referral-driven, broaden only as the brand earns trust, and run a lean cost base with modern tech and delivery-realistic headcount.',
  },
  {
    q: 'Is R5m enough?',
    a: 'Yes, in every modelled scenario. Year 1 runs on four people at R150k a month in total: a Managing Director and a Marketing Director (the founders, at R50k each, carrying all marketing, management, dealmaking, bookkeeping and tech support), a principal practitioner who also holds compliance (R30k) and an agent/admin (R20k). No office; hires beyond the four only against signed mandates; Paysoft carries the build. That takes ~R5m out of the pre-breakeven cost base without touching revenue, marketing or compliance, and brings EBITDA-positive forward to Year 2. On a monthly view the Year 1 cash trough is roughly −R2m to −R3m, so the R5m seed clears it in the base case with ~R2.5m to spare and in the conservative case with ~R1m. The capital is deployed against milestones in two tranches; the runway check is on the Scenarios tab of the model in the data room.',
  },
  {
    q: 'What are the main risks?',
    a: 'Three, flagged before you find them: the Year-2 in-house origination step-up needs FAIS/FSP accreditation and bank aggregation agreements (Year 1 via BetterBond is the runway); marketing-to-deals conversion is the central growth assumption, validated with a Cape Town pilot; and the ~35,000/yr upper-market pool estimate needs primary confirmation. All documented with sources in the data room.',
  },
  {
    q: 'What exactly am I buying?',
    a: '20% of Sold Direct for R5m at a R20m pre-money valuation — alongside two working founders (32.5% each), Paysoft as vesting technology partner (10%), a reserved option pool (4%) and a reserved non-executive board seat (1%). The seed models ~27× to the base-case exit. Full terms, the CA-reviewed model and the cap table are in the data room, under NDA.',
  },
] as const;

export const NEXT_STEPS = [
  'Request access — the data room opens under NDA',
  'Work through the CA-reviewed model and cap table',
  'Meet the founders; see the live WhatsApp product',
  'Reserve your allocation in the R5m round',
] as const;

export const DEMO_SECTION = {
  heading: 'See it work.',
  intro:
    'One Cape Town home from a tap on “What’s my home worth?” to registered sale — Quick Estimate, Property Report, tap-by-tap listing, buyer pre-qualification, offer and transfer — and every point where the financial ecosystem pays instead of the consumer. Press Play, or step through it.',
  // The standalone build of the real seller-intake flow, served from
  // content/try.html (regenerate with `pnpm --filter @sell-direct/api build:demo:fundraising`).
  tryHeading: 'Or try it yourself.',
  tryBody:
    'The seller flow below is the production code — the same listing-intake state machine and copy the WhatsApp service runs — bundled to run in your browser with no server behind it. Type “list” and sell a home.',
  tryCta: 'Try the live flow',
  tryHref: '/try',
  tryNote:
    'Opens in a new tab. Nothing you type is stored or sent anywhere; price guidance in the demo is illustrative.',
} as const;

export const DETAIL_SECTION = {
  heading: 'The detail, if you want it.',
  intro:
    'Everything below is a summary. The full model, assumptions with sources, cap table and partner terms are in the data room.',
} as const;

export const ACCESS_SECTION = {
  heading: 'Everything is in the data room.',
  intro:
    'The CA-reviewed model workbook, full assumptions with sources, cap table, scenarios and partner terms — shared under NDA.',
  reassurance:
    'We reply within one business day. NDA covers detailed financials, cap table and partner terms.',
} as const;

// Not an offer to the public; private placement only. (Verbatim — do not edit.)
export const DISCLAIMER =
  'This page is informational only. It is not an offer of securities to the public, nor a solicitation to invest, and any investment opportunity is available by private placement to selected investors only (Companies Act, 2008). Nothing here constitutes financial, legal or tax advice (FAIS). All projections are illustrative, model-grade and unaudited; actual results may differ materially. Detailed financials, the cap table and partner terms are shared under NDA. Personal information submitted via this page is processed in accordance with POPIA.';

export const NAV = [
  { href: '#concept', label: 'The idea' },
  { href: '#demo', label: 'See it work' },
  { href: '#ask', label: 'The raise' },
  { href: '#detail', label: 'Detail' },
] as const;
