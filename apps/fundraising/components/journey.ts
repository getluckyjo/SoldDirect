// The Sold Direct consumer journey, scripted as a WhatsApp conversation.
// Used by the interactive demo to show investors the full South African
// flow as the product is now scoped (docs/DEV-WORKSHOP-PREP-2026-10-08.md):
// front door → Quick Estimate → Property Report → nurture → tap-by-tap
// listing → enquiry → bond pre-qual → offer → conveyancing → registration.
// All names, prices and figures are illustrative.
//
// Naming is load-bearing: the product says "Quick Estimate" and "Property
// Report", never "valuation" — under the Property Valuers Profession Act only
// a registered valuer may perform one, and the asking price is always the
// seller's.

export type TrackerStage = { key: string; label: string };

// Mirrors the deal state machine in apps/api (modules/deals), with a "Listing"
// phase prepended for the pre-enquiry seller steps.
export const TRACKER: TrackerStage[] = [
  { key: 'listing', label: 'Listing' },
  { key: 'enquiry', label: 'Enquiry' },
  { key: 'offer', label: 'Offer (OTP)' },
  { key: 'bond', label: 'Bond' },
  { key: 'documents', label: 'Docs & FICA' },
  { key: 'clearance', label: 'Clearance' },
  { key: 'lodgement', label: 'Lodgement' },
  { key: 'registered', label: 'Registered' },
];

export type Chapter = { n: number; title: string; participant: string };

export const CHAPTERS: Chapter[] = [
  { n: 1, title: 'Estimate, report & list', participant: 'Maria · Seller' },
  { n: 2, title: 'Enquire & get bond-ready', participant: 'John · Buyer' },
  { n: 3, title: 'Offer to Purchase', participant: 'John · Buyer' },
  { n: 4, title: 'Bond, legal & transfer', participant: 'Conveyancing' },
];

export type Tag = 'POPIA' | 'Finance' | 'Legal' | 'Revenue' | 'Product';

export type Note = { tag: Tag; title: string; body: string };

export type ChecklistItem = { label: string; sub?: string; role?: string };

/**
 * Quick selects: the tappable replies WhatsApp shows under a message (reply
 * buttons or a list menu). `picked` is the one the person taps next, so the
 * demo can show the choice without a typed reply.
 */
export type Options = { items: string[]; picked?: string; footer?: string };

export type ListingData = {
  photo: string;
  address: string;
  suburb: string;
  price: string;
  beds: number;
  baths: number;
  erf: string;
  type: string;
};

export type EstimateData = {
  home: string;
  low: string;
  high: string;
  comparables: string;
  source: string;
};

export type ReportData = {
  title: string;
  address: string;
  pages: string[];
  delivery: string;
};

export type PrequalData = {
  amount: string;
  rate: string;
  deposit: string;
  monthly: string;
  term: string;
};

export type OtpData = {
  price: string;
  deposit: string;
  bondRequired: string;
  occupation: string;
  conditions: string[];
};

export type StatusData = {
  title: string;
  lines: string[];
  tone: 'good' | 'info' | 'win';
};

export type From = 'bot' | 'seller' | 'buyer' | 'system';
export type Kind =
  | 'text'
  | 'system'
  | 'image'
  | 'listing'
  | 'estimate'
  | 'report'
  | 'prequal'
  | 'otp'
  | 'status'
  | 'checklist';

export type Scene = {
  chapter: number;
  track: number; // index into TRACKER
  from: From;
  kind: Kind;
  text?: string;
  src?: string;
  caption?: string;
  options?: Options;
  listing?: ListingData;
  estimate?: EstimateData;
  report?: ReportData;
  prequal?: PrequalData;
  otp?: OtpData;
  status?: StatusData;
  checklistTitle?: string;
  checklist?: ChecklistItem[];
  note?: Note;
};

const LISTING: ListingData = {
  photo: '/cape-town-hero.jpg',
  address: '23 Vredehoek Avenue',
  suburb: 'Vredehoek, Cape Town',
  price: 'R6 250 000',
  beds: 3,
  baths: 2,
  erf: '495 m²',
  type: 'House',
};

const ESTIMATE: EstimateData = {
  home: '3-bed house · Vredehoek',
  low: 'R5 900 000',
  high: 'R6 500 000',
  comparables: '14 confirmed sales nearby, last 12 months',
  source: 'LOOM Property Insights',
};

export const SCENES: Scene[] = [
  // ─────────────── Chapter 1 — Front door, Quick Estimate, Property Report, listing ───────────────
  {
    chapter: 1,
    track: 0,
    from: 'system',
    kind: 'system',
    text: 'Maria taps “What’s my home worth?” on solddirect.co.za — it opens WhatsApp with PRICE pre-filled. No app to install.',
    note: {
      tag: 'Product',
      title: 'Two entry points',
      body: 'Every advertisement, portal listing and site button opens WhatsApp with LIST or PRICE pre-filled. A seller who wants only a price and a seller ready to list arrive at the same menu; neither path depends on the other.',
    },
  },
  { chapter: 1, track: 0, from: 'seller', kind: 'text', text: 'PRICE' },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: '👋 Welcome to Sold Direct — sell your Cape Town home with 0% commission.\n\nWhat would you like to do?',
    options: {
      items: [
        'What’s my home worth?',
        'List my property',
        'How it works',
        'What it costs',
        'Talk to our team',
      ],
      picked: 'What’s my home worth?',
    },
    note: {
      tag: 'Product',
      title: 'Menu-driven steps',
      body: 'Every step is a menu or a row of reply buttons, the WhatsApp controls the production flow sends. There is no free text to interpret, and “Talk to our team” is on every screen.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: 'What’s my home worth? 📊',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Happy to help. One quick thing first: may we process your details under POPIA to give you price guidance? Tap to confirm.',
    options: {
      items: [
        '✅ Yes, I consent',
        'Read the privacy notice',
        'Talk to our team',
      ],
      picked: '✅ Yes, I consent',
    },
    note: {
      tag: 'POPIA',
      title: 'Consent is its own timestamped record',
      body: 'Identity is asked for in three tiers. The Quick Estimate needs only a WhatsApp number, a name, consent, an address and a basic description — the minimum the data partner needs, and the minimum personal information held.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: '✅ Yes, I consent — Maria Adams',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Thanks Maria. Which part of Cape Town is the home in?',
    options: {
      items: [
        'Atlantic Seaboard',
        'City Bowl',
        'Southern Suburbs',
        'Northern Suburbs',
        'False Bay & South',
        'West Coast',
        'Other — type it',
      ],
      picked: 'City Bowl',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: 'City Bowl → Vredehoek',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'And the street address? It makes the guidance far more accurate — or skip for now.',
    options: { items: ['Skip — not now'] },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: '23 Vredehoek Avenue',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'What type of home is it?',
    options: {
      items: ['House', 'Apartment / flat', 'Townhouse', 'Plot / vacant land'],
      picked: 'House',
    },
  },
  { chapter: 1, track: 0, from: 'seller', kind: 'text', text: 'House 🏡' },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Bedrooms? (Then bathrooms.)',
    options: {
      items: [
        'Studio',
        '1 bedroom',
        '2 bedrooms',
        '3 bedrooms',
        '4 bedrooms',
        '5 bedrooms',
        '7 or more',
      ],
      picked: '3 bedrooms',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: '3 bedrooms · 2 bathrooms',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'estimate',
    estimate: ESTIMATE,
    note: {
      tag: 'Legal',
      title: 'Quick Estimate — guidance, never a “valuation”',
      body: 'Under the Property Valuers Profession Act only a registered valuer may perform a valuation, so the product shows what comparable homes actually sold for and says so. If the data partner returns nothing, no range is shown — a fabricated number never reaches a seller.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Want the full picture? A free *Property Report* for 23 Vredehoek Avenue — comparable sales mapped, street and area trends, and a branded PDF you can keep. Add a few photos and confirm you’re the owner.',
    options: {
      items: ['📄 Yes, get my report', 'Not now', 'Talk to our team'],
      picked: '📄 Yes, get my report',
    },
    note: {
      tag: 'Revenue',
      title: 'The Property Report as a lead',
      body: 'Free to the seller. The data cost is about R7.50 per report, booked as marketing; there is no payment step in the product. The plan assumes one report in ten becomes a listing.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'image',
    src: '/cape-town-hero.jpg',
    caption: 'Maria adds 6 photos 📸',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Lovely. Are you the registered owner, or authorised to sell? And an email for the PDF.',
    options: {
      items: ['✅ I’m the owner', 'I’m authorised', 'Just curious'],
      picked: '✅ I’m the owner',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: '✅ I’m the owner — maria@example.co.za',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'report',
    report: {
      title: 'Property Report',
      address: '23 Vredehoek Avenue, Vredehoek',
      pages: [
        'Quick Estimate range, and how it was built',
        '14 comparable sales, mapped',
        'Street & area trend, five years',
        'What a 0% sale keeps in your pocket',
      ],
      delivery: 'PDF in this chat and by email',
    },
    note: {
      tag: 'Product',
      title: 'The Property Report',
      body: 'Built from the data partner’s comparables and the Sold Direct template, delivered in the chat and by email as a PDF that carries the brand when forwarded.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'system',
    kind: 'system',
    text: 'Three days later.',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Hi Maria, it’s Sold Direct. Still thinking about selling 23 Vredehoek Avenue? Your report range was R5.9m–R6.5m. When you’re ready, listing takes a few taps.',
    options: {
      items: ['List my property', 'Remind me in 2 weeks', 'STOP'],
      picked: 'List my property',
    },
    note: {
      tag: 'POPIA',
      title: 'Follow-up within the rules',
      body: 'Outside WhatsApp’s 24-hour window only an approved marketing template may be sent. Follow-ups go out at day 3, 14 and 30, every one carries STOP, and an opt-out is honoured immediately.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: 'List my property 🙌',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Two ways to sell, Maria:\n\n🟢 0% — an exclusive mandate for the term you choose; the buyer’s bond goes through our origination partner and a panel conveyancer handles the transfer. The bank pays us, not you.\n🔵 Flex — 1% of the sale price, no exclusivity.',
    options: {
      items: ['🟢 0% — exclusive', '🔵 Flex — 1%'],
      picked: '🟢 0% — exclusive',
    },
    note: {
      tag: 'Revenue',
      title: 'The 0% path',
      body: 'The lender on the buyer’s bond pays an origination fee, so the seller pays nothing when they list exclusively and transact through the partners. Cash or third-party-financed transactions pay a disclosed 1%. Both paths produce a Property24 listing.',
    },
  },
  { chapter: 1, track: 0, from: 'seller', kind: 'text', text: '🟢 0% please' },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Exclusive term?',
    options: {
      items: ['60 days', '90 days ★', '120 days'],
      picked: '90 days ★',
      footer: '★ recommended',
    },
  },
  { chapter: 1, track: 0, from: 'seller', kind: 'text', text: '90 days' },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'text',
    text: 'Asking price? Your Quick Estimate was R5.9m–R6.5m — tap one, or type your own. The price is always yours.',
    options: {
      items: ['R5 900 000', 'R6 200 000', 'R6 500 000'],
      footer: 'Or type any amount',
    },
    note: {
      tag: 'Product',
      title: 'The estimate, inline at the price step',
      body: 'The listing path shows the same guidance where it matters. The buttons are the low, mid and high of the band; the seller can always type a different number — and here Maria does.',
    },
  },
  { chapter: 1, track: 0, from: 'seller', kind: 'text', text: 'R6 250 000' },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'listing',
    listing: LISTING,
    options: {
      items: ['✅ Publish now', 'Change something', 'Cancel listing'],
      picked: '✅ Publish now',
    },
    note: {
      tag: 'Product',
      title: 'Structured listing record',
      body: 'A few taps produced a typed listing record — price in ZAR, type, beds, baths, term, tier. It is the same record the dashboard reads and the Property24 feed is built from.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'seller',
    kind: 'text',
    text: '✅ Publish now',
  },
  {
    chapter: 1,
    track: 0,
    from: 'bot',
    kind: 'checklist',
    checklistTitle: 'Before it goes live',
    checklist: [
      {
        label: 'Ownership proof',
        sub: 'Municipal account or title deed',
        role: 'Private storage · 24h review',
      },
      { label: 'ID document', sub: 'Encrypted at rest' },
      {
        label: 'Sole mandate e-signed',
        sub: 'Held by a registered property practitioner (PPRA, FFC)',
        role: 'No mandate before the FFC',
      },
      {
        label: 'Photos & description',
        sub: 'First photo activates; optional pro shoot; drafted copy Maria approves',
      },
    ],
    note: {
      tag: 'Legal',
      title: 'Verify, sign, review — then publish',
      body: 'Nothing publishes unreviewed. Ownership proof and ID go to private, encrypted storage with a 24-hour human review, and the mandate is signed only once the firm’s Fidelity Fund Certificate is in place.',
    },
  },
  {
    chapter: 1,
    track: 0,
    from: 'system',
    kind: 'status',
    status: {
      title: '✅ Listing live',
      lines: [
        'Reviewed by our team within 24 hours',
        'Published to Property24 by direct API',
        'Shareable WhatsApp listing link generated',
      ],
      tone: 'good',
    },
    note: {
      tag: 'Product',
      title: 'Distribution through existing portals',
      body: 'Listings are published to the portals buyers already use (create, update, under offer, sold, withdraw, all by API), and each carries a WhatsApp enquiry link.',
    },
  },

  // ──────────────────── Chapter 2 — Buyer enquiry + finance ────────────────────
  {
    chapter: 2,
    track: 1,
    from: 'system',
    kind: 'system',
    text: 'John sees the listing on Property24 and taps “Enquire on WhatsApp”.',
    note: {
      tag: 'Product',
      title: 'Buyer enters the same channel',
      body: 'The buyer also arrives in WhatsApp. One conversation now links a buyer to a listing and creates a deal record at “Enquiry”.',
    },
  },
  {
    chapter: 2,
    track: 1,
    from: 'buyer',
    kind: 'text',
    text: 'Hi! Is 23 Vredehoek Ave still available? Could I view it? 😊',
  },
  {
    chapter: 2,
    track: 1,
    from: 'bot',
    kind: 'text',
    text: 'Hi John! Yes, it’s available. Quick POPIA consent to handle your details, then I’ll book a viewing.',
    options: {
      items: ['✅ Yes, I consent', 'Talk to our team'],
      picked: '✅ Yes, I consent',
    },
    note: {
      tag: 'POPIA',
      title: 'Consent — buyer side too',
      body: 'The same consent step applies to buyers before any details are captured and before any discussion of finance. Consent and timestamp are logged.',
    },
  },
  { chapter: 2, track: 1, from: 'buyer', kind: 'text', text: 'Agreed ✅' },
  {
    chapter: 2,
    track: 1,
    from: 'bot',
    kind: 'text',
    text: 'Want to know exactly what you can afford — and make a stronger offer? Our origination partner can pre-qualify you for a home loan in about two minutes. Free, no obligation.',
    options: {
      items: ['Yes, pre-qualify me', 'Just book a viewing', 'Talk to our team'],
      picked: 'Yes, pre-qualify me',
    },
    note: {
      tag: 'Finance',
      title: 'Buyer pre-qualification',
      body: 'Pre-qualifying buyers in the chat is central to the model: it qualifies serious buyers and opens the bond-origination referral. “Pre-qualified” is shown only after a result from the partner.',
    },
  },
  { chapter: 2, track: 1, from: 'buyer', kind: 'text', text: 'Yes please!' },
  {
    chapter: 2,
    track: 1,
    from: 'bot',
    kind: 'text',
    text: 'Great — this is handled securely by our bond origination partner. A few questions on income, expenses and deposit, plus consent for a credit check.',
    note: {
      tag: 'Revenue',
      title: 'Bond origination referral',
      body: 'A consented hand-off to the origination partner. The lender pays an origination share on a successful bond, at no cost to the buyer or seller. This is the principal revenue line.',
    },
  },
  {
    chapter: 2,
    track: 1,
    from: 'bot',
    kind: 'prequal',
    prequal: {
      amount: 'R6 200 000',
      rate: 'Prime −0.50%',
      deposit: 'R600 000',
      monthly: '≈ R56 800 / month',
      term: '20 years',
    },
    note: {
      tag: 'Finance',
      title: 'Buyer is now bond-ready',
      body: 'An indicative pre-qualification (illustrative figures). The buyer knows their budget; the seller only deals with qualified offers.',
    },
  },
  {
    chapter: 2,
    track: 1,
    from: 'bot',
    kind: 'text',
    text: 'You’re bond-ready 💪 Pick a viewing slot:',
    options: {
      items: ['Sat 10:00', 'Sat 11:30', 'Sun 14:00'],
      picked: 'Sat 10:00',
    },
  },
  {
    chapter: 2,
    track: 1,
    from: 'system',
    kind: 'system',
    text: 'John views the home on Saturday — and loves it.',
  },

  // ───────────────────────── Chapter 3 — Offer to Purchase ─────────────────────
  {
    chapter: 3,
    track: 2,
    from: 'buyer',
    kind: 'text',
    text: 'I’d like to make an offer 🖊️',
  },
  {
    chapter: 3,
    track: 2,
    from: 'bot',
    kind: 'text',
    text: 'Let’s build your Offer to Purchase (OTP). It becomes a legally binding agreement once both parties sign — so we’ll capture the price, deposit, conditions and dates carefully.',
    note: {
      tag: 'Legal',
      title: 'The OTP is binding',
      body: 'In South Africa the signed Offer to Purchase IS the sale agreement. Suspensive conditions (e.g. “subject to bond approval”) must be met for it to become unconditional.',
    },
  },
  {
    chapter: 3,
    track: 2,
    from: 'buyer',
    kind: 'otp',
    otp: {
      price: 'R5 900 000',
      deposit: 'R600 000',
      bondRequired: 'R5 300 000',
      occupation: '1 September 2026',
      conditions: [
        'Subject to bond approval within 21 days',
        'Seller to provide compliance certificates',
        'Voetstoots, with disclosed defects',
      ],
    },
    note: {
      tag: 'Legal',
      title: 'Structured, not free-text',
      body: 'The offer is captured as structured terms with the standard suspensive conditions — reducing disputes and making the deal trackable end-to-end.',
    },
  },
  {
    chapter: 3,
    track: 2,
    from: 'bot',
    kind: 'text',
    text: 'Sent to Maria for review ✍️',
    options: { items: ['Accept', 'Counter', 'Decline'], picked: 'Counter' },
  },
  {
    chapter: 3,
    track: 2,
    from: 'seller',
    kind: 'text',
    text: 'Close! I’ll counter at R6 000 000 — everything else fine.',
  },
  {
    chapter: 3,
    track: 2,
    from: 'buyer',
    kind: 'text',
    text: 'Accepted at R6 000 000 ✅',
  },
  {
    chapter: 3,
    track: 2,
    from: 'system',
    kind: 'status',
    status: {
      title: '📄 Offer to Purchase signed',
      lines: [
        'Sale price R6 000 000',
        'Both parties e-signed',
        'Sale agreed — subject to bond approval',
      ],
      tone: 'good',
    },
    note: {
      tag: 'Legal',
      title: 'A valid sale exists',
      body: 'The deal record moves to “Offer (OTP)”. Every status change is timestamped with an actor — the audit trail conveyancers and partners can rely on.',
    },
  },

  // ─────────────────── Chapter 4 — Bond, conveyancing, transfer ────────────────
  {
    chapter: 4,
    track: 3,
    from: 'bot',
    kind: 'text',
    text: 'Now I’ll submit John’s bond application to several banks at once via our origination partner, to secure the best rate.',
    note: {
      tag: 'Finance',
      title: 'Multi-bank bond application',
      body: 'Our origination partner submits to several banks at once and negotiates the rate, which has historically produced better terms than a single-bank application.',
    },
  },
  {
    chapter: 4,
    track: 3,
    from: 'system',
    kind: 'status',
    status: {
      title: '🏦 Bond approved',
      lines: [
        'Standard Bank — R5 400 000',
        'Prime −0.50% over 20 years',
        'Suspensive condition met ✅',
      ],
      tone: 'good',
    },
    note: {
      tag: 'Revenue',
      title: 'Revenue realised',
      body: 'On the granted bond, the lender pays an origination share to the partner, which is shared with Sold Direct. The consumer pays nothing. The deal moves to “Bond”.',
    },
  },
  {
    chapter: 4,
    track: 4,
    from: 'bot',
    kind: 'checklist',
    checklistTitle: 'Conveyancers appointed (3 attorneys)',
    checklist: [
      {
        label: 'Transferring attorney',
        sub: 'Transfers ownership to the buyer',
        role: 'Seller · our panel',
      },
      {
        label: 'Bond attorney',
        sub: 'Registers the buyer’s new bond',
        role: 'Buyer’s bank',
      },
      {
        label: 'Cancellation attorney',
        sub: 'Cancels the seller’s existing bond',
        role: 'Seller’s bank',
      },
    ],
    note: {
      tag: 'Revenue',
      title: 'Panel conveyancing',
      body: 'The transferring attorney comes from the panel; the seller receives a fee discount, and panel firms pay fixed advertising subscriptions (no referral fees, per Legal Practice Council rules).',
    },
  },
  {
    chapter: 4,
    track: 4,
    from: 'bot',
    kind: 'checklist',
    checklistTitle: 'FICA verification (both parties)',
    checklist: [
      { label: 'ID document' },
      { label: 'Proof of residence', sub: 'less than 3 months old' },
      { label: 'Source of funds & SARS tax number' },
    ],
    note: {
      tag: 'Legal',
      title: 'FICA & encrypted PII',
      body: 'Attorneys are legally required to FICA both parties. Sensitive documents are encrypted at rest and never logged — POPIA throughout.',
    },
  },
  {
    chapter: 4,
    track: 4,
    from: 'system',
    kind: 'checklist',
    checklistTitle: 'Transferring attorney gathers',
    checklist: [
      { label: 'Title deed & cancellation figures', sub: 'from seller’s bank' },
      { label: 'Rates clearance figures', sub: 'from the City of Cape Town' },
      { label: 'Transfer duty', sub: 'paid to SARS' },
    ],
    note: {
      tag: 'Legal',
      title: 'The transfer process',
      body: 'The attorney coordinates the bank, the municipality and SARS. Each step is reported in the buyer and seller chat, so both parties know the status of the transaction.',
    },
  },
  {
    chapter: 4,
    track: 4,
    from: 'system',
    kind: 'status',
    status: {
      title: '💰 Transfer costs (illustrative)',
      lines: [
        'Transfer duty to SARS ≈ R458 000',
        'Conveyancing & bond registration fees',
        'Payable by the buyer',
      ],
      tone: 'info',
    },
    note: {
      tag: 'Legal',
      title: 'Transfer costs disclosed',
      body: 'Transfer duty is a sliding SARS tax on the purchase price. It is shown up front so that it does not surprise the buyer later in the transaction.',
    },
  },
  {
    chapter: 4,
    track: 4,
    from: 'bot',
    kind: 'checklist',
    checklistTitle: 'Compliance certificates ordered',
    checklist: [
      { label: 'Electrical Compliance Certificate' },
      {
        label: 'Plumbing / water certificate',
        sub: 'City of Cape Town requirement',
      },
      { label: 'Gas Certificate of Conformity', sub: 'if gas installed' },
      { label: 'Electric fence certificate', sub: 'if applicable' },
      { label: 'Beetle clearance', sub: 'where required' },
    ],
    note: {
      tag: 'Legal',
      title: 'Seller’s compliance obligations',
      body: 'The seller must deliver valid certificates before transfer. Sold Direct coordinates the inspections, which is also an optional add-on revenue line.',
    },
  },
  {
    chapter: 4,
    track: 5,
    from: 'system',
    kind: 'status',
    status: {
      title: '📑 Clearance & guarantees',
      lines: [
        'Rates Clearance Certificate issued',
        'Bank guarantees delivered to the attorney',
        'Buyer & seller sign transfer documents',
      ],
      tone: 'info',
    },
    note: {
      tag: 'Legal',
      title: 'Clearance stage',
      body: 'No transfer can be lodged without a municipal rates clearance and the bank guarantees. Deal moves to “Clearance”.',
    },
  },
  {
    chapter: 4,
    track: 6,
    from: 'system',
    kind: 'status',
    status: {
      title: '🏛️ Lodged at the Deeds Office',
      lines: [
        'Transfer + new bond + bond cancellation',
        'Lodged simultaneously by the attorneys',
        'Examination ≈ 7–10 working days',
      ],
      tone: 'info',
    },
    note: {
      tag: 'Legal',
      title: 'Simultaneous lodgement',
      body: 'The three matters must lodge together at the Deeds Office. The deal moves to “Lodgement”.',
    },
  },
  {
    chapter: 4,
    track: 7,
    from: 'system',
    kind: 'status',
    status: {
      title: '🎉 Registered in the Deeds Office',
      lines: [
        'Ownership transferred to John',
        'Proceeds paid to Maria',
        'Bond settled · keys handed over',
      ],
      tone: 'win',
    },
    note: {
      tag: 'Legal',
      title: 'Registration',
      body: 'On registration, ownership legally passes and funds are disbursed. The deal record reaches its final state, “Registered”.',
    },
  },
  {
    chapter: 4,
    track: 7,
    from: 'system',
    kind: 'status',
    status: {
      title: '🟢 0% commission',
      lines: [
        'Maria paid R0 commission',
        'Kept ≈ R414 000 a full-service sale (6% + VAT) would have cost',
        'Sold Direct earned from partners — not the seller',
      ],
      tone: 'win',
    },
    note: {
      tag: 'Revenue',
      title: 'The model in one transaction',
      body: 'The consumer paid nothing. Sold Direct earned from the bond origination share and partner advertising, paid by the financial parties already present in every transaction.',
    },
  },
  {
    chapter: 4,
    track: 7,
    from: 'bot',
    kind: 'text',
    text: 'That’s the Sold Direct journey: estimate → report → list → enquire → finance → offer → transfer → registered. All inside WhatsApp, with 0% commission. 🏡',
    note: {
      tag: 'Product',
      title: 'One thread, start to finish',
      body: 'Every step took place in a single WhatsApp conversation, tracked by the deal state machine and visible in the internal dashboard.',
    },
  },
];
