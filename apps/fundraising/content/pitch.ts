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
    'The round covers the modelled cash trough in all three scenarios. Operations run on a four-person team until the business is EBITDA-positive, modelled in Year 3. A Series A is modelled at Year 3 and is optional in the base case.',
} as const;

export const HERO = {
  eyebrow: 'Private placement · Cape Town · Seed round',
  title: 'Invest in the future of property sales',
  // The detail (practitioners, revenue source) is carried by the summary
  // strip and the proposition cards directly below, so the lede stays short.
  sub: 'Private property sales, on WhatsApp.',
  // The 0%* token is rendered between these two parts as a tap-to-resolve note.
  subAccentPre: 'At ',
  subAccentPost: ' commission to the seller.',
  ctaPrimary: 'Enter the data room',
  ctaTry: 'Sell a home on the live demo',
} as const;

// The one-sentence resolution behind every 0%* (tooltip copy).
export const QUALIFYING_TOOLTIP =
  '0% applies on the qualifying path: a 90-day (or longer) exclusive mandate and a bond of 80% or more placed through our origination partner. Otherwise a 1% facilitation fee applies.';

// Full wording, rendered in the footer (verbatim — do not edit).
// source: docs/dataroom/00-assumptions.md §C; 01-financial-model.md §5
export const QUALIFYING_PATH_NOTE =
  '* 0% commission applies on the qualifying path: an exclusive mandate of 90 days or longer, a qualifying ≥80% bond placed via our origination partner, and a panel conveyancer (with a fee discount passed to the seller). Otherwise a 1% facilitation fee applies.';

// The round at a glance.
// source: docs/dataroom/README.md headlines; 01/02 dataroom docs
export const SUMMARY_STRIP = [
  { label: 'Raising', value: 'R5m for 20%', sub: 'R20m pre-money' },
  {
    label: 'Revenue source',
    value: 'Bond origination',
    sub: 'Paid by the lender',
  },
  {
    label: 'Status',
    value: 'Product built',
    sub: 'Ready to go live with Meta',
  },
  {
    label: 'Y5 revenue (base)',
    value: 'R86m',
    sub: 'EBITDA-positive from Y3',
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
    { label: 'People', value: 'PPRA practitioners + WhatsApp estate agent' },
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
      body: 'Four people in Year 1 — two founders, a principal practitioner and an agent — rising to 48 by Year 5 in the model, mostly practitioners and support staff. Gross margin is modelled at about 88%, with the surplus directed to marketing.',
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
    { label: 'Y5 share', value: '4.1% of upper market' },
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
      value: '4.1%',
      sub: 'Of upper-market transactions; 0.58% of all SA transfers',
    },
  ] satisfies Stat[],
  consumer:
    'In the base case, sellers using the platform retain about R367m a year by Year 5, and about R743m cumulatively, that a full-service sale at the 6% plus VAT benchmark would have cost. Full-service agents continue to serve the majority of sellers; Sold Direct serves those who choose to sell direct.',
} as const;

// source: docs/dataroom/01-financial-model.md §3 (base case, CA-reviewed)
export const REVENUE_RAMP = [
  { year: 'Y1', revenue: 6.14, deals: 50 },
  { year: 'Y2', revenue: 12.48, deals: 110 },
  { year: 'Y3', revenue: 26.51, deals: 325, ebitdaPositive: true },
  { year: 'Y4', revenue: 51.51, deals: 750 },
  { year: 'Y5', revenue: 86.35, deals: 1450 },
] as const;

// source: docs/dataroom/01-financial-model.md, 02-capital-and-valuation.md
export const FIN_DETAIL = {
  heading: 'Financial summary',
  keyPoints: [
    { label: 'Revenue, Y1 → Y5', value: 'R6.1m → R86m' },
    { label: 'EBITDA-positive', value: 'Year 3' },
    { label: 'Y5 EBITDA margin', value: '~14%' },
  ] satisfies KeyPoint[],
  intro:
    'Base case from the model reviewed by a chartered accountant: 27% corporate tax, headcount sized for delivery, no revenue the Legal Practice Council prohibits. The full workbook is in the data room.',
  stats: [
    {
      label: 'EBITDA-positive',
      value: 'Year 3',
      sub: 'Four-person team until self-funding',
    },
    {
      label: 'Gross margin',
      value: '~88%',
      sub: 'Cost of sales built bottom-up at about 12% of revenue',
    },
    {
      label: 'Y5 enterprise value',
      value: 'R345–518m',
      sub: 'At 4–6× revenue, discounted from global proptech comparables',
    },
  ] satisfies Stat[],
  caveat:
    'Projections are illustrative and unaudited, not a forecast or guarantee. The reviewed workbook, with inputs and sources per line, is available in the data room under NDA.',
} as const;

// source: docs/PROGRESS.md; partnerships founder-confirmed
export const TRACTION_DETAIL = {
  heading: 'Status and partners',
  keyPoints: [
    { label: 'Product', value: 'Built, demonstrable' },
    { label: 'WhatsApp sender', value: 'Ready to go live with Meta' },
    { label: 'Partners', value: 'Secured' },
  ] satisfies KeyPoint[],
  intro:
    'The end-to-end flow is built and can be demonstrated. The WhatsApp sender is ready to go live with Meta. Launch partnerships are in progress.',
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
    {
      name: 'Lava Lamp Lab',
      role: 'WhatsApp development, engaged through Paysoft',
    },
    { name: 'Property24', role: 'Listing distribution (in negotiation)' },
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §3
export const TEAM_DETAIL = {
  heading: 'Team',
  keyPoints: [
    { label: 'Founders', value: '2, fully-focussed' },
    { label: 'Technology', value: 'Paysoft, 10% vesting' },
    { label: 'Board', value: '1 non-executive seat reserved' },
  ] satisfies KeyPoint[],
  intro:
    'Two founders, fully-focussed, a technology partner providing the CTO function, and a reserved non-executive seat. The cap table and terms are in the data room.',
  // photo: drop a headshot at public/team/<file>.jpg and set it here —
  // the card falls back to branded initials until then.
  people: [
    {
      name: 'Johannes le Roux',
      role: 'Co-founder · Marketing Director',
      initials: 'JR',
      photo: '/team/johannes.jpg',
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
      logo: '/partners/paysoft.png',
      bio: 'Provides the CTO function and engineering delivery of the platform at preferred development rates, with Lava Lamp Lab engaged for the WhatsApp build. Its equity vests as that development is delivered.',
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
    'R5m at a R20m pre-money valuation, deployed in two tranches. The round covers the modelled cash trough in every scenario; the balance funds the Cape Town launch.',
  // source: Use of Funds tab of the model
  useOfFunds: [
    { item: 'Cape Town launch and brand campaign', amount: 'R2.0m' },
    { item: 'Four-person team to breakeven', amount: 'R1.2m' },
    { item: 'Product, technology and integrations', amount: 'R0.5m' },
    {
      item: 'Compliance and licensing: PPRA, FFC, POPIA, FAIS/FSP',
      amount: 'R0.5m',
    },
    {
      item: 'Partnerships: BetterBond, conveyancers, bank sponsor, Property24',
      amount: 'R0.4m',
    },
    { item: 'Working capital and contingency', amount: 'R0.4m' },
  ],
  // source: docs/dataroom/04-indicative-term-sheet.md
  terms: [
    'Preference shares, 1× non-participating',
    'Two tranches: R2.5m at closing, R2.5m on milestones',
    'Lead investor takes the board seat',
    'Founder shares reverse-vest over 36 months',
  ],
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §2b — the seed models
// ~14× to the base-case exit (~R432m EV at 5× Y5 revenue, post-Series-A
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
  exitMultiple: 14.4,
  exitLabel:
    'Modelled value at the base-case exit (about R432m enterprise value in Year 5, after Series A dilution)',
  caveat:
    'Illustrative only, from the base case (exit at 5× Year 5 revenue, after an optional Series A). Not a forecast, guarantee or offer. Early-stage investment carries risk, including loss of capital.',
} as const;

export const FAQ = [
  {
    q: 'Why is 0% commission sustainable?',
    a: 'Because the revenue comes from the lender rather than the seller. Origination earns 0.5% of the bond through BetterBond in Year 1 and about 1.5% in-house from Year 2, and the platform keeps the cost of handling each transaction low. Non-qualifying transactions pay a disclosed 1% fee.',
  },
  {
    q: 'What is the position on estate agents?',
    a: 'Sold Direct is complementary to full-service agents, not opposed to them. Full-service remains the right choice for the majority of sellers; Sold Direct serves sellers who choose to sell direct, assisted by PPRA-registered practitioners.',
  },
  {
    q: 'Is the conveyancer revenue line permitted?',
    a: 'Yes. It is structured around Legal Practice Council rules: attorneys pay no referral fees. Panel firms pay fixed annual advertising subscriptions, and sellers who use the panel receive a 30–40% conveyancing fee discount.',
  },
] as const;

// Four hooks: what brings a seller in and keeps the sale on the platform.
// "Estimate", never "valuation" (Property Valuers Profession Act).
export const HOOKS_SECTION = {
  heading: 'The hooks.',
  intro:
    'Four features that bring sellers in and keep the whole sale on the platform.',
  hooks: [
    {
      icon: 'bolt',
      title: 'Complimentary instant property estimate',
      line: 'A free price range on WhatsApp in minutes: the entry point for every seller.',
    },
    {
      icon: 'chat',
      title: 'Always-on WhatsApp estate agent advisory',
      line: 'Pricing, viewings, offers, bond and transfer, answered in the same thread, day or night.',
    },
    {
      icon: 'key',
      title: 'Cornering supply with 90-day mandates',
      line: 'The 0%* path needs an exclusive term, so stock builds and every enquiry stays on the platform.',
    },
    {
      icon: 'handshake',
      title: 'Relationships that carry into post-sale services',
      line: 'Removals, painting, leasing, gardening and recycling through partners, at no acquisition cost.',
    },
  ],
} as const;

// The go-to-market: the campaigns in sequence. source: docs/LAUNCH-PLAN.md and
// docs/dataroom/src/marketing-deck.html (the deck PDF is in the data room).
export const CAMPAIGNS_SECTION = {
  heading: 'Earn the first twenty, prove the loop, then buy reach.',
  intro:
    'Marketing is the largest use of the seed: R2.5m in Year 1 rising to R25m in Year 5, reinvesting an ~88% gross margin into brand. Every above-the-line rand is released only against conversion data from the founding cohort.',
  campaigns: [
    {
      icon: 'home',
      when: 'Weeks 1–4',
      title: 'Property24 and Ask Ash: the launch burst',
      body: 'Four weeks of paid reach on Property24, where every Cape Town seller already looks, paired with Ask Ash, the property media house with over 100,000 followers and columns in the national press. One message, the whole sale run for you at 0%*, in short video, articles and WhatsApp. Every Cape Town homeowner sees the brand eight times before the Founding Twenty opens.',
    },
    {
      icon: 'key',
      when: 'Weeks 4–10',
      title: 'The Founding Twenty',
      body: 'Twenty founding listings across the Atlantic Seaboard, City Bowl, Southern Suburbs and Constantia, white-glove, live on Property24 within 48 hours of mandate. Each one becomes a case study.',
    },
    {
      icon: 'bolt',
      when: 'From week 4, always on',
      title: 'What is my home worth?',
      body: 'The Quick Estimate as the advertisement: targeted social to homeowners in the launch suburbs, QR codes on boards and flyers, suburb WhatsApp and community groups. A price range in minutes.',
    },
    {
      icon: 'people',
      when: 'From the first board, always on',
      title: 'Neighbours next',
      body: 'Every live listing advertises to the street. A referral reward for the seller who brings the next mandate, and the after-sale community thread that keeps the number in the household’s pocket.',
    },
    {
      icon: 'chat',
      when: 'From week 10',
      title: 'Sold direct, the story',
      body: 'PR on a useful consumer question, what a R6m private sale actually takes, then the first sold-direct stories, with consent, street by street.',
    },
    {
      icon: 'growth',
      when: 'Month 5 onward',
      title: 'Brand, above the line',
      body: 'Outdoor on the Atlantic Seaboard and Southern Suburbs commutes, Cape Town radio and digital video, co-funded by the bank headline sponsor. Unlocked once the founding cohort’s conversion data holds.',
    },
    {
      icon: 'chart',
      when: 'Every week',
      title: 'The numbers we act on',
      body: 'Twenty founding listings by week 10, five leads per listing a month, 60% sell-through within six months, acquisition cost under R3,000 per listing before any brand spend. The full plan and targets are in the data room.',
    },
  ],
} as const;

// A low-key aside after the partners: the WhatsApp number stays useful
// after transfer, which keeps the relationship warm at almost no cost.
export const COMMUNITY_NOTE = {
  eyebrow: 'And afterwards',
  heading: 'The relationship continues after the sale.',
  body: 'Once the transfer is registered the same WhatsApp thread connects the household to its new neighbourhood. It costs little to run and keeps the relationship warm for the next bond, the next sale and the services around them.',
  items: [
    'Local security groups',
    'Moms\u2019 groups',
    'Pet sitters',
    'New restaurants',
    'Schools and sport',
    'Ultra-local tips',
  ],
} as const;

// Partner logos shown under the demonstration. White-on-transparent PNGs in
// public/partners/, generated from the originals in the repo root.
// source: TRACTION_DETAIL.partners and docs/LAUNCH-PLAN.md (Property24)
export const PARTNER_LOGOS = {
  heading: 'Our Partners',
  logos: [
    {
      name: 'BetterBond',
      src: '/partners/betterbond.png',
      width: 911,
      height: 160,
    },
    { name: 'LOOM', src: '/partners/loom.png', width: 489, height: 160 },
    { name: 'Paysoft', src: '/partners/paysoft.png', width: 564, height: 160 },
    {
      name: 'Property24',
      src: '/partners/property24.png',
      width: 911,
      height: 160,
    },
    {
      name: 'Lava Lamp Lab',
      src: '/partners/lava-lamp-lab.png',
      width: 389,
      height: 160,
    },
  ],
} as const;

export const DEMO_SECTION = {
  heading: 'The WhatsApp Estate Agent, step by step.',
  intro:
    'Sell a Cape Town home yourself, on the live pipeline: Quick Estimate, Property Report, listing and photos, then a pre-qualified buyer, an offer, the bond and the transfer to registration.',
  // The live demo at /try: the API's demo simulator behind the site's own
  // proxy route (see DEPLOYMENT.md, "The live demo on the investor site").
  tryHeading: 'Try it: sell a home on the live demo.',
  tryBody:
    'You are the seller. Get a Quick Estimate, list the home, send photos, then watch a buyer, an offer and the bond carry it through to registration. It is the real platform, running live.',
  tryCta: 'Open the live demo',
  tryHref: '/try',
  tryNote:
    'Opens in a new tab. Demo conversations use a reserved number range and never reach a real seller or buyer. The buyer is simulated; price data is illustrative until the LOOM feed is connected.',
} as const;

// Why now: four conditions that make the wedge open today.
// source: docs/LAUNCH-PLAN.md, docs/dataroom/00-assumptions.md §C–D
export const WHY_NOW = {
  heading: 'The perfect timing.',
  items: [
    {
      icon: 'gap',
      title: 'Demand is proven',
      body: 'Cape Town property is booming, about R81bn of sales a year. Property24 already sells private sellers flat-fee listings from R499 to R4,999; the sale after the enquiry is unserved.',
    },
    {
      icon: 'map',
      title: 'Distribution is open',
      body: 'The Competition Commission ruled that the portals must accept listings from any registered agency, with no feed fee. Our listings appear on Property24 like any agency’s.',
    },
    {
      icon: 'chat',
      title: 'WhatsApp is the channel',
      body: 'About 29 million South Africans use WhatsApp, 96% of everyone online. Its business platform is mature enough to carry a whole sale in one thread.',
    },
    {
      icon: 'people',
      title: 'No incentive to change',
      body: 'Agencies earn 5–7% plus VAT on each sale, a model that serves most sellers well. A sale paid for by the lender rather than the seller does not fit it, and franchise networks change office by office, so the segment that wants to sell direct stays open.',
    },
  ],
} as const;

// Market and unit economics in the open. source: docs/dataroom/03-market-sizing.md,
// 01-financial-model.md §2–3 (base case).
export const ECONOMICS_SECTION = {
  heading: 'The market, and what each sale earns.',
  intro:
    'Base case. The sizing and the per-transaction build are in the data room.',
  market: [
    {
      label: 'SA transfers a year',
      value: '~250,000',
      sub: 'Lightstone, 2024',
    },
    {
      label: 'Upper-market pool',
      value: '~35,000',
      sub: 'Transfers above about R4m a year',
    },
    {
      label: 'Entry price, tapering',
      value: 'R6.5m → R4.0m',
      sub: 'Average transacting price, Year 1 to Year 5',
    },
    {
      label: 'Share at Year 5',
      value: '4.1%',
      sub: 'Of upper-market transactions',
    },
  ] satisfies Stat[],
  unit: [
    {
      label: 'Revenue per sale',
      value: 'R56k → R71k',
      sub: 'Year 1 referral; Year 2 origination in-house',
    },
    {
      label: 'Marketing per sale',
      value: 'R50k → R17k',
      sub: 'Year 1 to Year 5',
    },
    {
      label: 'Gross margin',
      value: '~88%',
      sub: 'Built up from per-transaction costs',
    },
    {
      label: 'EBITDA-positive',
      value: 'Year 3',
      sub: 'About 14% margin by Year 5',
    },
  ] satisfies Stat[],
} as const;

export const DETAIL_SECTION = {
  heading: 'The Business Plan.',
  intro:
    'Each section opens to the detail. The full model, assumptions with sources, cap table and partner terms are in the data room.',
} as const;

// source: docs/dataroom/02-capital-and-valuation.md §2 (VC method); Scenarios
// tab. Seed 20% at inception, 16.7% after the optional Series A (R25m at
// R125m pre, Year 3). IRR assumes a single exit at the end of Year 5.
export const RETURN_SECTION = {
  heading: 'Return on the R5m.',
  intro:
    'The base-case model values the seed stake at about R72m at a Year 5 exit: about 14 times the investment, an IRR of about 70% over five years. The table shows the same calculation across the three scenarios and the comparable-multiple range.',
  tiles: [
    { label: 'Invested', value: 'R5m', sub: '20% at inception' },
    {
      label: 'Value at exit',
      value: '~R72m',
      sub: 'Base case, Year 5, after Series A',
    },
    { label: 'Multiple', value: '~14×', sub: 'On R5m' },
    { label: 'IRR', value: '~70%', sub: 'Five-year hold' },
  ] satisfies Stat[],
  columns: ['4× revenue', '5× revenue', '6× revenue'],
  rows: [
    {
      scenario: 'Conservative',
      revenue: 'Y5 revenue R56m',
      cells: ['7.5× · 50%', '9.4× · 56%', '11.2× · 62%'],
    },
    {
      scenario: 'Base',
      revenue: 'Y5 revenue R86m',
      cells: ['11.5× · 63%', '14.4× · 70%', '17.3× · 77%'],
      highlight: true,
    },
    {
      scenario: 'Aggressive',
      revenue: 'Y5 revenue R149m',
      cells: ['19.8× · 82%', '24.8× · 90%', '29.7× · 97%'],
    },
  ],
  cellNote: 'Multiple on R5m · IRR, per cell',
  notes: [
    'Exit at the end of Year 5 at the stated multiple of Year 5 revenue. 4–6× is the range the model applies to South African early-stage proptech, discounted from global comparables.',
    'The seed holds 20% at inception and 16.7% after the optional Series A modelled at Year 3. Without a Series A the figures above are 20% higher.',
    'Likely exit routes: a trade sale to a bank or bond originator, a property portal, or a national agency group.',
    'Illustrative, from the base case, unaudited; not a forecast, guarantee or offer. Early-stage investment carries risk, including loss of capital.',
  ],
} as const;

export const ACCESS_SECTION = {
  heading: 'Data room.',
  intro:
    'The reviewed model workbook, assumptions with sources, cap table, scenarios and partner terms, shared under NDA.',
  cta: 'Sign the NDA and enter',
  reassurance:
    'The NDA is signed online in a minute and your personal link arrives by email. From there: the model, the founders, allocation.',
  formPrompt: 'Prefer an introduction first? Leave your details.',
} as const;

// Not an offer to the public; private placement only. (Verbatim — do not edit.)
export const DISCLAIMER =
  'This page is informational only. It is not an offer of securities to the public, nor a solicitation to invest, and any investment opportunity is available by private placement to selected investors only (Companies Act, 2008). Nothing here constitutes financial, legal or tax advice (FAIS). All projections are illustrative and unaudited; actual results may differ materially. Detailed financials, the cap table and partner terms are shared under NDA. Personal information submitted via this page is processed in accordance with POPIA.';

export const NAV = [
  { href: '#concept', label: 'Concept' },
  { href: '#demo', label: 'Demonstration' },
  { href: '#team', label: 'Team' },
  { href: '#hooks', label: 'Hooks' },
  { href: '#campaigns', label: 'Campaigns' },
  { href: '#ask', label: 'The round' },
  { href: '#detail', label: 'The numbers' },
  { href: '#returns', label: 'IRR' },
] as const;
