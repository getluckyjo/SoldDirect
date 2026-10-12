// All copy and numbers for the investor page live here so a designer restyle
// only touches components. Figures must match the data room — each block
// cites its source document. Copy follows the positioning guardrails in
// CLAUDE.md (never anti-agent; savings framed neutrally; every 0% resolves
// to the qualifying-path note) and is written as plain investor prose: state
// the proposition and the numbers, no sales language.
//
// The page presents the proposition. Anything an investor needs once they are
// interested (model detail, market sizing, team, status, questions) renders
// inside collapsibles, and the full detail lives in the data room.

export type Stat = { label: string; value: string; sub?: string };
export type Card = { title: string; body: string };
export type KeyPoint = { label: string; value: string };

// source: docs/dataroom/02-capital-and-valuation.md §1
export const RIBBON = 'Seed round: R5m for 20% at a R20m pre-money valuation';

// source: docs/dataroom/02-capital-and-valuation.md §1
export const ASK = {
  amount: 'R5m',
  stake: '20%',
  preMoney: 'R20m pre-money · R25m post-money',
  seriesA:
    'The round covers the modelled cash trough in all three scenarios. Operations run on a four-person team until the business is EBITDA-positive, modelled in Year 2. A Series A is modelled at Year 3 and is optional in the base case.',
} as const;

export const HERO = {
  eyebrow: 'Private placement · Cape Town · Seed round',
  title: 'Private property sales, on WhatsApp.',
  // The 0%* token is rendered between these two parts as a tap-to-resolve note.
  titleAccentPre: 'At ',
  titleAccentPost: ' commission to the seller.',
  sub: 'Sold Direct manages the private sale — listing, buyer enquiry, bond, offer and transfer — over WhatsApp, with registered property practitioners involved at each step. On the qualifying path the seller pays no commission. Revenue comes from bond origination, paid by the lender.',
  ctaPrimary: 'Request the data room',
  ctaSecondary: 'Product demonstration',
  ctaTry: 'Try the seller flow',
} as const;

// The one-sentence resolution behind every 0%* (tooltip copy).
export const QUALIFYING_TOOLTIP =
  '0% applies on the qualifying path: an exclusive mandate and a bond of 80% or more placed through our origination partner. Otherwise a 1% facilitation fee applies.';

// Full wording, rendered in the footer (verbatim — do not edit).
// source: docs/dataroom/00-assumptions.md §C; 01-financial-model.md §5
export const QUALIFYING_PATH_NOTE =
  '* 0% commission applies on the qualifying path: an exclusive mandate for the agreed term, a qualifying ≥80% bond placed via our origination partner, and a panel conveyancer (with a fee discount passed to the seller). Otherwise a 1% facilitation fee applies.';

// The round at a glance.
// source: docs/dataroom/README.md headlines; 01/02 dataroom docs
export const SUMMARY_STRIP = [
  { label: 'Raising', value: 'R5m for 20%', sub: 'R20m pre-money' },
  {
    label: 'Revenue source',
    value: 'Bond origination',
    sub: 'Paid by the lender, not the seller',
  },
  {
    label: 'Status',
    value: 'Product built',
    sub: 'End-to-end flow demonstrable; WhatsApp sender pending approval',
  },
  {
    label: 'Y5 revenue (base case)',
    value: 'R162m',
    sub: 'EBITDA-positive from Year 2',
  },
] satisfies Stat[];

// The proposition in three parts. source: docs/dataroom/README.md (strategy)
export const CONCEPT_SECTION = {
  heading: 'The proposition.',
  cards: [
    {
      icon: 'gap',
      title: 'The gap',
      lead: 'Private sellers can buy a listing, but not a sale.',
      points: [
        'The portals sell a flat-fee listing; after the enquiry the seller handles pricing, viewings, the offer, the bond, FICA and transfer alone.',
        'Full-service agents provide all of this for 5–7% plus VAT, which suits most sellers.',
        'A segment prefers to sell direct and is not served between those two options.',
      ],
    },
    {
      icon: 'chat',
      title: 'The product',
      lead: 'The whole sale, listing to registered transfer, inside WhatsApp.',
      points: [
        'Menu-driven steps: Quick Estimate, Property Report, listing, buyer pre-qualification, offer, transfer tracking.',
        'The platform handles the administration.',
        'Registered property practitioners (PPRA, Fidelity Fund Certificate) and a concierge are involved on every transaction.',
      ],
    },
    {
      icon: 'bank',
      title: 'The revenue model',
      lead: 'The lender pays. The seller pays 0%* on the qualifying path.',
      points: [
        'A bonded purchase carries an origination fee paid by the lender; Sold Direct earns it.',
        'Through BetterBond in Year 1; as an originator in its own right from Year 2, at about three times the rate.',
        'Cash or non-partner transactions pay a disclosed 1% facilitation fee.',
      ],
    },
  ],
} as const;

// source: docs/dataroom/README.md; founder-confirmed status
export const PRODUCT_DETAIL = {
  heading: 'Product',
  keyPoints: [
    { label: 'Channel', value: 'WhatsApp, menu-driven' },
    { label: 'Scope', value: 'Listing to registration' },
    { label: 'People', value: 'PPRA practitioners + concierge' },
  ] satisfies KeyPoint[],
  cards: [
    {
      title: 'Scope',
      body: 'The flow covers the South African transfer process: offer to purchase, suspensive conditions, Financial Intelligence Centre Act (FICA) checks, rates clearance, lodgement and registration at the Deeds Office, and bond pre-qualification.',
    },
    {
      title: 'Cost of delivery',
      body: 'Listing intake, buyer qualification, offer assembly, document collection and status updates run through the platform over WhatsApp, with people reviewing each transaction. This is what allows a 0%* price on the qualifying path.',
    },
    {
      title: 'Registered practitioners',
      body: 'Practitioners registered with the Property Practitioners Regulatory Authority (PPRA) and holding Fidelity Fund Certificates assist both parties. Registration and an FFC are a precondition to taking any mandate; the status is set out in the data room. Full-service agents remain the right choice for sellers who want one.',
    },
    {
      title: 'Cost base',
      body: 'Four people in Year 1 — two founders, a principal practitioner and an agent — rising to 96 by Year 5 in the model, mostly practitioners and support staff. Gross margin is modelled at about 88%, with the surplus directed to marketing.',
    },
  ] satisfies Card[],
} as const;

// source: docs/dataroom/01-financial-model.md §1–2
export const MODEL_DETAIL = {
  heading: 'Revenue lines',
  keyPoints: [
    { label: 'Origination, Y1', value: '0.5% of the bond' },
    { label: 'Origination, Y2+', value: '~1.5% of the bond' },
    { label: 'Per transaction, Y2', value: 'R70.6k blended' },
  ] satisfies KeyPoint[],
  originationStep: {
    y1: {
      label: 'Year 1 — BetterBond referral',
      rate: '0.5% of the bond',
      body: 'Qualifying bonds of 80% or more are placed through BetterBond, a registered multi-bank originator. The buyer retains full choice of lender; the lender pays the fee.',
    },
    y2: {
      label: 'Year 2 onward — origination in-house',
      rate: '~1.5% of the bond',
      body: 'Sold Direct becomes an originator in its own right, dealing directly with the banks, at about three times the referral rate.',
    },
  },
  revenueLines: [
    {
      title: 'Bond origination',
      body: 'The principal line: about R29k per qualifying transaction in Year 1 and about R78k in Year 2 once in-house, paid by the lender.',
    },
    {
      title: 'Bank headline sponsorship',
      body: 'An annual platform sponsorship from one featured bank. Advertising only, with no steering of buyers. R3m in Year 1 rising to R8m in Year 5.',
    },
    {
      title: 'Conveyancer panel advertising',
      body: 'Fixed annual subscriptions, R0.36m rising to R2.4m. No referral fees, which the Legal Practice Council prohibits. Sellers using the panel receive a 30–40% fee discount.',
    },
    {
      title: '1% facilitation fee',
      body: 'On cash, sub-80%-bond or non-partner transactions, disclosed up front. For reference, a full-service sale is typically 5–7% plus VAT.',
    },
  ] satisfies Card[],
  perDeal: {
    heading: 'Blended revenue per registered transaction',
    rows: [
      { year: 'Y1', value: 'R55.7k', note: 'BetterBond referral' },
      { year: 'Y2', value: 'R70.6k', note: 'Origination in-house' },
      { year: 'Y5', value: 'R52.4k', note: 'Price taper' },
    ],
    explainer:
      'The Year 5 figure is lower because the average transacting price in the model tapers from R6.5m to R4.0m as the business broadens from prime Cape Town into the wider upper market. This is a mix change and is built into the model.',
  },
} as const;

// source: docs/dataroom/03-market-sizing.md
export const MARKET_DETAIL = {
  heading: 'Market',
  keyPoints: [
    { label: 'Addressable', value: 'R6.25bn a year' },
    { label: 'Entry', value: 'Prime Cape Town, R6.5m avg' },
    { label: 'Y5 share', value: '8.3% of upper market' },
  ] satisfies KeyPoint[],
  intro:
    'An addressable market of about R6.25bn a year. Entry is at prime Cape Town, where the average transacting price is R6.5m, broadening into the national upper market with the average tapering to R4.0m by Year 5. Listings are distributed through the existing portals as an agency-grade feed; Sold Direct is a customer of the portals rather than a competitor to them.',
  stats: [
    {
      label: 'TAM',
      value: 'R6.25bn/yr',
      sub: 'Addressable revenue across about 250,000 annual SA transfers',
    },
    {
      label: 'SAM',
      value: 'R1.8bn/yr',
      sub: 'Upper market (above about R4m): about 35,000 transfers a year',
    },
    {
      label: 'SOM (base case, Y5)',
      value: '8.3%',
      sub: 'Of upper-market transactions; 1.16% of all SA transfers',
    },
  ] satisfies Stat[],
  consumer:
    'In the base case, sellers using the platform retain about R733m a year by Year 5, and about R1.46bn cumulatively, that a full-service sale at the 6% plus VAT benchmark would have cost. Full-service agents continue to serve the majority of sellers; Sold Direct serves those who choose to sell direct.',
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
  heading: 'Financial summary',
  keyPoints: [
    { label: 'Revenue, Y1 → Y5', value: 'R6.1m → R162m' },
    { label: 'EBITDA-positive', value: 'Year 2' },
    { label: 'Y5 EBITDA margin', value: '~17%' },
  ] satisfies KeyPoint[],
  intro:
    'Base case from the model reviewed by a chartered accountant: 27% corporate tax, headcount sized for delivery, and revenue the Legal Practice Council prohibits removed. The full workbook is in the data room.',
  stats: [
    {
      label: 'EBITDA-positive',
      value: 'Year 2',
      sub: 'Four-person team until self-funding',
    },
    {
      label: 'Gross margin',
      value: '~88%',
      sub: 'Cost of sales built bottom-up at about 12% of revenue',
    },
    {
      label: 'Y5 enterprise value',
      value: 'R649–974m',
      sub: 'At 4–6× revenue, discounted from global proptech comparables',
    },
  ] satisfies Stat[],
  caveat:
    'Projections are illustrative and model-grade, not a forecast or guarantee. The reviewed workbook, with inputs, sources and reliability flags per line, is available in the data room under NDA.',
} as const;

// source: docs/PROGRESS.md; partnerships founder-confirmed
export const TRACTION_DETAIL = {
  heading: 'Status and partners',
  keyPoints: [
    { label: 'Product', value: 'Built, demonstrable' },
    { label: 'WhatsApp sender', value: 'Pending Meta approval' },
    { label: 'Partners', value: '4 in progress' },
  ] satisfies KeyPoint[],
  intro:
    'The end-to-end flow is built and can be demonstrated. The WhatsApp sender is pending Meta approval. Launch partnerships are in progress.',
  shipped: [
    'WhatsApp journey end to end: listing, enquiry, consented bond pre-qualification, offer, transfer tracking',
    'Deal state machine for the SA transfer: offer to purchase, bond, FICA, clearance, lodgement, registration',
    'Internal dashboard; public marketing site with waitlist',
    'Typed end to end, automated tests, continuous integration; privacy by design under the Protection of Personal Information Act (POPIA)',
  ],
  partners: [
    { name: 'BetterBond', role: 'Bond origination (Year 1 referral)' },
    { name: 'LOOM', role: 'Property data for estimates and reports' },
    { name: 'Capture Media', role: 'Listing photography and video' },
    { name: 'Paysoft', role: 'Technology partner (vesting equity)' },
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §3
export const TEAM_DETAIL = {
  heading: 'Team',
  keyPoints: [
    { label: 'Founders', value: '2, full-time, 32.5% each' },
    { label: 'Technology', value: 'Paysoft, 10% vesting' },
    { label: 'Board', value: '1 non-executive seat reserved' },
  ] satisfies KeyPoint[],
  intro:
    'Two full-time founders, a technology partner providing the CTO function, and a reserved non-executive seat. The cap table and terms are in the data room.',
  // photo: drop a headshot at public/team/<file>.jpg and set it here —
  // the card falls back to branded initials until then.
  people: [
    {
      name: 'Johannes le Roux',
      role: 'Co-founder · Marketing Director',
      initials: 'JR',
      bio: 'Property Studies, UCT. Founded and sold three consumer brands. Responsible for brand, marketing and the seller funnel, which is the largest use of the seed capital.',
    },
    {
      name: 'Dean Kruger',
      role: 'Co-founder · Managing Director',
      initials: 'DK',
      bio: 'Architecture, UCT. Commercial architect; lead on the Babylonstoren development. Responsible for delivery, partnerships and the transfer operation.',
    },
    {
      name: 'Paysoft',
      role: 'Technology partner · CTO function',
      initials: 'PS',
      bio: 'Provides the CTO function and engineering delivery of the platform at preferred development rates. Its equity vests as that development is delivered.',
    },
    {
      name: 'Board seat',
      role: 'Reserved · Non-executive',
      initials: '+',
      bio: 'A reserved allocation for a non-executive director with property, banking or consumer-brand experience, to be appointed before the Series A.',
    },
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §1–2 (Use of Funds tab)
export const ASK_SECTION = {
  heading: 'R5m for 20%.',
  intro:
    'R5m at a R20m pre-money valuation. Until the business is self-funding it runs on four people: the two founders, a principal practitioner who also holds compliance, and an agent. There is no office, and hires beyond the four are made only against signed mandates. The round covers the modelled cash trough in every scenario; the balance funds the Cape Town launch.',
  useOfFunds: [
    'Cape Town launch and brand campaign',
    'Four-person team: founders, principal practitioner, agent',
    'Product and technology; partner integrations (WhatsApp, BetterBond, conveyancers)',
    'Compliance and licensing: PPRA and FFC, POPIA programme, FAIS/FSP groundwork for in-house origination',
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §2b — the seed models
// ~27× to the base-case exit (~R811m EV at 5× Y5 revenue, post-Series-A
// dilution). The calculator scales that per rand invested; post-money R25m.
export const CALCULATOR = {
  heading: 'Illustrative return',
  sub: 'Select an investment amount. Figures derive from the base-case model.',
  postMoney: 25_000_000,
  postMoneyLabel: 'R25m',
  min: 500_000,
  max: 5_000_000,
  step: 250_000,
  initial: 1_000_000,
  exitMultiple: 27,
  exitLabel:
    'Modelled value at the base-case exit (about R811m enterprise value in Year 5, after Series A dilution)',
  caveat:
    'Illustrative only, from the model-grade base case (exit at 5× Year 5 revenue, after an optional Series A). Not a forecast, guarantee or offer. Early-stage investment carries risk, including loss of capital.',
} as const;

export const FAQ = [
  {
    q: 'Why is 0% commission sustainable?',
    a: 'Because the revenue comes from the lender rather than the seller. Origination earns 0.5% of the bond through BetterBond in Year 1 and about 1.5% in-house from Year 2, and the platform keeps the cost of handling each transaction low. Non-qualifying transactions pay a disclosed 1% fee.',
  },
  {
    q: 'What is the position on estate agents?',
    a: 'Sold Direct is complementary to full-service agents, not opposed to them. Full-service remains the right choice for the majority of sellers; Sold Direct serves sellers who choose to sell direct, assisted by PPRA-registered practitioners. The industry describes a similar division of work: RE/MAX Southern Africa’s leadership has said technology should handle administration, after-hours enquiries and buyer qualification while people provide judgement and the relationship (Property Professional, October 2026).',
  },
  {
    q: 'Is the conveyancer revenue line permitted?',
    a: 'Yes. It is structured around Legal Practice Council rules: attorneys pay no referral fees. Panel firms pay fixed annual advertising subscriptions, and sellers who use the panel receive a 30–40% conveyancing fee discount.',
  },
  {
    q: 'What is the relevance of Purplebricks?',
    a: 'It is the comparable the plan is managed against. Purplebricks failed on marketing-led customer acquisition cost and over-expansion. Sold Direct enters at prime Cape Town, where demand is largely referral-driven, broadens only as the brand establishes itself, and runs a small cost base with headcount sized for delivery.',
  },
  {
    q: 'Is R5m sufficient?',
    a: 'In every modelled scenario, yes. Year 1 runs on four people: the two founders, a principal practitioner who also holds compliance, and an agent. There is no office, hires beyond the four are made only against signed mandates, and Paysoft carries the build. That keeps the pre-breakeven cost base about R5m lower than the earlier plan without reducing revenue, marketing or compliance spend, and brings EBITDA-positive forward to Year 2. On a monthly view the Year 1 cash trough is about R2m to R3m, which the round covers with about R2.5m to spare in the base case and about R1m in the conservative case. Capital is released in two tranches against milestones. The runway check is on the Scenarios tab of the model.',
  },
  {
    q: 'What are the principal risks?',
    a: 'Three. The Year 2 move to in-house origination requires FAIS/FSP accreditation and bank aggregation agreements, with Year 1 through BetterBond as the bridge. Marketing-to-transaction conversion is the central growth assumption and is validated in a Cape Town pilot. The estimate of about 35,000 upper-market transfers a year requires primary confirmation. Each is documented with sources in the data room.',
  },
  {
    q: 'What is on offer?',
    a: '20% of Sold Direct for R5m at a R20m pre-money valuation, alongside the two founders at 32.5% each, Paysoft at 10% vesting, a reserved option pool of 4% and a reserved non-executive board seat of 1%. The base-case model gives the seed about 27× at exit. Full terms, the reviewed model and the cap table are in the data room under NDA.',
  },
] as const;

export const NEXT_STEPS = [
  'Request access; the data room opens under NDA',
  'Review the model, assumptions and cap table',
  'Meet the founders and see the product',
  'Confirm allocation and subscription terms',
] as const;

export const DEMO_SECTION = {
  heading: 'The WhatsApp Estate Agent, step by step.',
  intro:
    'One Cape Town home from the first message to registered transfer: Quick Estimate, Property Report, listing, buyer pre-qualification, offer and transfer, with each point at which revenue arises marked. Press Play, or step through it.',
  // The standalone build of the real seller-intake flow, served from
  // content/try.html (regenerate with `pnpm --filter @sell-direct/api build:demo:fundraising`).
  tryHeading: 'Try the seller flow.',
  tryBody:
    'The seller flow below runs the production conversation code — the same listing-intake state machine and copy as the WhatsApp service — in your browser, with no server behind it. Type “list” to begin.',
  tryCta: 'Open the seller flow',
  tryHref: '/try',
  tryNote:
    'Opens in a new tab. Nothing entered is stored or transmitted. Price guidance in the demonstration is illustrative.',
} as const;

export const DETAIL_SECTION = {
  heading: 'The Business Plan.',
  intro:
    'Each section opens to the detail. The full model, assumptions with sources, cap table and partner terms are in the data room.',
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §2 (VC method); Scenarios
// tab. Seed 20% at inception, 16.7% after the optional Series A (R50m at
// R250m pre, Year 3). IRR assumes a single exit at the end of Year 5.
export const RETURN_SECTION = {
  heading: 'Return on the R5m.',
  intro:
    'The base-case model values the seed stake at about R135m at a Year 5 exit: 27 times the investment, an IRR of about 93% over five years. The table shows the same calculation across the three scenarios and the comparable-multiple range.',
  tiles: [
    { label: 'Invested', value: 'R5m', sub: '20% at inception' },
    {
      label: 'Value at exit',
      value: '~R135m',
      sub: 'Base case, Year 5, after Series A',
    },
    { label: 'Multiple', value: '27×', sub: 'On R5m' },
    { label: 'IRR', value: '~93%', sub: 'Five-year hold' },
  ] satisfies Stat[],
  columns: ['4× revenue', '5× revenue', '6× revenue'],
  rows: [
    {
      scenario: 'Conservative',
      revenue: 'Y5 revenue R102m',
      cells: ['13.6× · 69%', '17.0× · 76%', '20.4× · 83%'],
    },
    {
      scenario: 'Base',
      revenue: 'Y5 revenue R162m',
      cells: ['21.6× · 85%', '27.1× · 93%', '32.5× · 101%'],
      highlight: true,
    },
    {
      scenario: 'Aggressive',
      revenue: 'Y5 revenue R287m',
      cells: ['38.3× · 107%', '47.8× · 117%', '57.4× · 125%'],
    },
  ],
  cellNote: 'Multiple on R5m · IRR, per cell',
  notes: [
    'Exit at the end of Year 5 at the stated multiple of Year 5 revenue. 4–6× is the range the model applies to South African early-stage proptech, discounted from global comparables.',
    'The seed holds 20% at inception and 16.7% after the optional Series A modelled at Year 3. Without a Series A the figures above are 20% higher.',
    'Illustrative, from the model-grade base case; not a forecast, guarantee or offer. Early-stage investment carries risk, including loss of capital.',
  ],
} as const;

export const ACCESS_SECTION = {
  heading: 'Data room.',
  intro:
    'The reviewed model workbook, assumptions with sources, cap table, scenarios and partner terms, shared under NDA.',
  reassurance:
    'We reply within one business day. The NDA covers detailed financials, the cap table and partner terms.',
} as const;

// Not an offer to the public; private placement only. (Verbatim — do not edit.)
export const DISCLAIMER =
  'This page is informational only. It is not an offer of securities to the public, nor a solicitation to invest, and any investment opportunity is available by private placement to selected investors only (Companies Act, 2008). Nothing here constitutes financial, legal or tax advice (FAIS). All projections are illustrative, model-grade and unaudited; actual results may differ materially. Detailed financials, the cap table and partner terms are shared under NDA. Personal information submitted via this page is processed in accordance with POPIA.';

export const NAV = [
  { href: '#concept', label: 'Concept' },
  { href: '#demo', label: 'Demonstration' },
  { href: '#ask', label: 'The round' },
  { href: '#returns', label: 'IRR' },
  { href: '#detail', label: 'The numbers' },
] as const;
