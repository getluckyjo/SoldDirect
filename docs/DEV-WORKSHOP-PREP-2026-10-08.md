# Dev workshop prep — Sold Direct × tech partner

_8 October 2026. Prepared from the Developer Scoping Brief v1.0 (21 Aug), the journey sketch and the repo on `main`. The product decisions taken on the morning of 8 October are written in as requirements. Shared as a branded page: https://claude.ai/artifact/7GcAdg1hXSffeyPnntMyna_

---

## 1. What this meeting has to produce

Their roadmap (appended to the brief) says: 4-hour BA workshop this week → two weeks of flow and development diagrams → presentation week of 19 Oct → ~8-week build → soft launch January 2027 → MOU after 19 Oct.

So the flows they draw over the next two weeks are built from **today's conversation**. Walk out with:

1. The product in section 2 understood and accepted as the scope, including the parts the brief does not yet cover.
2. One agreed end-to-end journey, step by step, with the inputs, outputs and rules for each step (section 4), and the phone screens that go with it (section 5).
3. Answers to the two open points in section 3, or a named owner and date for each.
4. The integration list with a route chosen for each one (section 6).
5. A clear line between the January pilot and the rest of the brief (section 7).

---

## 2. The product we are scoping

These are requirements, not options. The brief of 21 August does not cover the estimate path, the report or the callback queue, so they are new work and must appear in the 19 October presentation.

**Two entry points, one funnel.** The welcome menu offers **"What's my home worth?"** and **"List my property"** side by side, with "Talk to our team" always present. A seller who only wants a number gets the Quick Estimate, can opt into the Property Report, and is nurtured towards listing later. A seller who wants to sell now goes straight into intake, with the estimate shown inline at the price step. Neither path gates the other.

**Quick Estimate and Property Report.** Those are the product names. The word "valuation" appears on no screen, message, report or portal listing: under the Property Valuers Profession Act only a registered valuer may perform one, and the asking price is always the seller's. Counsel confirms the wording before launch; until then it is the rule for every flow the devs draw.

**The report is free to the seller.** Sold Direct pays **R7.50 per report**, booked as a marketing cost. There is no payment step and no payment provider, and payments stay out of scope as the brief has it.

**Identity in three tiers.**

| Stage | What we ask | Why |
|---|---|---|
| Quick Estimate | WhatsApp number, name, POPIA consent, address, basic description | Enough for LOOM; minimal PII |
| Property Report | Add photos or video; confirm you are the owner or authorised | Report quality; a soft ownership claim |
| Listing | Ownership proof (municipal account or title deed), ID, mandate signature | Property24 requires a mandate per listing; the FFC obligations |

Two things the repo does not do yet become required at the listing tier: seller consent as its own timestamped record, and private storage for documents.

**Menu-driven, with a human exit on every screen.** Flows are scripted for the pilot. The AI concierge runs in shadow mode, drafting replies for a person to approve. **"Schedule a callback" is in scope:** a slot-capture step in WhatsApp and a callback queue in the console, neither of which exists today.

**Viewings booked in the chat, buyer to seller direct.** No practitioner in the loop for a routine viewing. The seller sets viewing availability at listing time by tapping slots, and can change it any time with one word. When a buyer enquires, the system offers the open slots for that listing; the buyer taps one; both sides get a confirmation at once and a reminder the evening before; either can reschedule or cancel by tap. One buyer per slot. Each viewing is a record on the deal, with the outcome captured afterwards and no-shows flagged. The console shows the viewings list and only exceptions reach a person. Our own booking logic behind our API; calendar sync comes later. The seller sees the buyer's name, consent status and pre-qualification state before the visit, and gets the five-point viewing prep checklist.

**Two commercial paths.** 0% on the qualifying path: an exclusive mandate, the bond through BetterBond, a panel conveyancer. A 1% facilitation fee on cash or third-party-financed deals. Both paths produce a Property24 listing. No mandate is taken before the FFC is in place, so a January launch with mandates needs the FFC by December.

**Property24 by direct API.** Syndication goes through Property24's own API as a technology partner, covering create, update, photo order, pause, under offer, sold, withdraw and a reconciliation job. It depends on Property24 granting feed access, a spec and a sandbox. Sync or PropCtrl is the stopgap if that access is slow.

**Built on the existing repo.** The TypeScript, Fastify, Prisma and Next.js code on `main` is the baseline, and the brief's guardrail holds: Postgres stays the system of record, business logic stays in the modular monolith, and every provider sits behind an adapter. Conversation logic does not move into Twilio Studio, a bot builder or the e-sign provider.

**Sized for 70 live listings in year one, built for the year-five plan.** Year one is about 17 concurrent listings and 1,400 Property Reports converting at 5% to the 70 listings. Staff, price and review capacity for that. Design for the base case below, so nothing is re-architected between now and year five.

**Volume to design for.** The first four rows are the data room base case; the rest are derived with the assumptions stated underneath.

| Per year unless stated | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---:|---:|---:|---:|---:|
| Registered sales (model) | 50 | 220 | 650 | 1,500 | **2,900** |
| Listings taken on (model) | ~70 | ~310 | ~930 | ~2,100 | **~4,100** |
| Average transacting price (model) | R6.5m | R5.75m | R5.0m | R4.5m | **R4.0m** |
| Team, half of it AI agents (model) | 8 | 14 | 22 | 50 | **96** |
| Property Reports (derived) | ~1,400 | ~6,200 | ~18,600 | ~42,000 | **~82,000** |
| Listings live at any time (derived) | ~17 | ~80 | ~230 | ~525 | **~1,025** |
| Buyer enquiries a month (derived) | ~90 | ~390 | ~1,160 | ~2,600 | **~5,100** |
| Deals in transfer at any time (derived) | ~17 | ~75 | ~215 | ~500 | **~965** |
| WhatsApp messages a month (rough) | ~4,000 | ~17,000 | ~50,000 | ~115,000 | **~225,000** |
| Report cost at R7.50 (derived) | ~R10.5k | ~R46.5k | ~R140k | ~R315k | **~R615k** |

Assumptions: twenty Property Reports per listing taken on, a 5% conversion; about three months on the market, so listings live at once is a quarter of the year's intake; five enquiries per live listing a month, the launch-plan target; about four months from offer to registration; messages at roughly 12 per report, 15 per enquiry, 60 per listing, 100 per deal and 3 per nurture sequence. The aggressive scenario is 4,800 sales in year five, about 1.7 times every row.

What that means for the build: the brief's engineering sizing baseline (one million messaging events a month, bursts of 250 concurrent webhooks, 100 concurrent internal users, 100,000 listings and 50,000 deals) covers the year-five base case with headroom and still covers the aggressive case. The shape can stay as it is, but the pieces that let it scale have to exist from the start: the durable outbound queue, per-provider rate limits, idempotent callbacks and the portal reconciliation job. By year three the console is a work queue for a few hundred live listings and a couple of hundred deals in transfer, run by a team of twenty; by year five it is a thousand of each, which is the practitioner-console package the brief describes, not a bigger read-only dashboard. Property24's published tiers climb with lead volume, from R7,153 a month in year one to the top of the rate card by year five, so the wholesale conversation with them matters from year three.

---

## 3. Open points for the room

### 3.1 Eight weeks versus the brief

Section 12 of the brief sizes the remaining work at seven full-time technical people for 20 to 24 weeks, which with overlap between work packages is about **100 to 125 technical person-weeks**. That covers the whole scope: console, documents and e-signature, syndication, durable workers and hardening. The brief's own "narrow pilot" option is 12 to 14 weeks with five or six people, for one portal, one e-sign provider and a basic console.

Their roadmap is eight weeks of build in November and December, with December written off. Eight weeks with seven people is about 56 person-weeks, roughly half the benchmark, and section 2 adds work the brief did not price.

Ask them to map the eight weeks to the brief's work packages. If they cannot, the January launch scope needs cutting explicitly (section 7), not quietly.

### 3.2 How a Property24 enquiry becomes a WhatsApp conversation

The whole model depends on the buyer landing in WhatsApp with a listing ID. Property24 delivers leads by email and phone and may strip links from descriptions. Ask the devs to design the lead-ingestion path: Property24 lead email or webhook → parse → create the buyer and the enquiry deal → send the buyer a WhatsApp template with the listing. That template needs approval lead time.

---

## 4. The journey, step by step

Use this as the agenda for the UX part. For each step: goal, what we ask, what gets stored, rules, repo status, and what is still open.

| # | Step | Goal | Inputs | Record | Rules | Repo status | Open |
|---|---|---|---|---|---|---|---|
| 0 | Entry | Land in WhatsApp with context | Deep link from site, ads, Property24, or a cold "hi" | Message log | Entry words LIST and PRICE both stay live; every CTA deep-links one of them | Built | Which entry point the site headline leads with |
| 1 | Intro + menu | Orient, then one tap | Menu row | Conversation state | "What's my home worth?" and "List my property" side by side; no free-text chatter; always a human exit | Built (5 rows) | Final menu rows; the callback slot step |
| 2 | Quick Estimate | A range in under a minute | Name, consent, suburb or address, type, beds, baths | Seller, consent timestamp, estimate | Estimate wording only; never show a fabricated range | Partial: at the price step; LOOM endpoint is a placeholder | What the flow does when LOOM returns nothing |
| 3 | Property Report | Branded report worth converting on | Photos or video, confirm ownership, email for the PDF | Report record, media | Free to the seller; R7.50 cost to us; no payment step | Not built | Format; who renders the PDF; delivery channel |
| 4 | Nurture to listing | Turn one in twenty reports into a listing | Follow-ups at day 3, 14, 30 | Marketing consent, opt-out | Outside 24h needs an approved marketing template; opt-out already built | Partial: opt-out built; re-engagement partly | Cadence and copy |
| 5 | Account and verification | Know the seller is the owner | Ownership proof, ID | Private document, review status | Private storage, 24h human review, encrypted at rest | Not built | Manual review for January |
| 6 | Tier choice and mandate | 0% exclusive vs 1% | Tap a tier; e-sign the mandate | Listing tier, mandate envelope | No mandate before the FFC | Partial: tier stored; no e-sign | E-sign provider; mandate text from attorney |
| 7 | Listing intake | Clean listing record | Type, suburb, address, price, beds, baths, term | Listing | Address mandatory for the portal; sectional-title fields | Built | Levies and erf fields; viewing availability slots; pro photography option |
| 8 | Photos and description | Portal-grade listing | Seller photos, optional pro shoot, AI draft description | Photos, description | First photo activates; seller approves the draft | Built | Capture Media booking step? |
| 9 | Owner review → Sold Direct review | Publish only what is checked | Owner confirms; staff approve within 24h | Approval event | Nothing publishes unreviewed | Not built; console is read-only | Who reviews, SLA, what blocks |
| 10 | Publish | Live on Property24 | Approved listing | Portal reference, publish timestamp | Direct API: create, update, photo order, under offer, sold, withdraw | Stub | Property24 access date; certification lead time |
| 11 | Enquiry in | Buyer in WhatsApp against the listing | Portal lead or shareable link | Buyer, deal at enquiry | Consent before any finance talk | Partial: built for the link; not for portal leads | Lead ingestion (3.2) |
| 11b | Viewing | A confirmed viewing with no person in the loop | Seller's availability set at listing; the buyer's slot tap | Viewing on the deal; reminders; outcome | One buyer per slot; confirmation to both; reminder the evening before; reschedule by tap; outcome captured after | Not built; the buyer mock shows it | Slot granularity; how the seller edits availability; no-show handling; calendar sync later |
| 12 | Pre-qual and offer | Real BetterBond result; OTP | Consent, income, deposit; offer terms | Referral state, OTP versions | "Pre-qualified" only after a partner result | Stub; wrong semantics today | What BetterBond actually exposes |
| 13 | Transfer journey | Track to registration | Stage updates from attorney and bank | Deal events, deadlines | Every change timestamped with an actor | Built, with reminders | How attorneys report status |

---

## 5. The journeys on a phone

Illustrative WhatsApp screens, one per journey, mapped to the steps in section 4. They live on the branded page (https://claude.ai/artifact/7GcAdg1hXSffeyPnntMyna#mockups); names, prices and figures are examples.

| Screen | Steps | What it shows |
|---|---|---|
| The front door | 0–1 | One menu, two entry points side by side, "Talk to our team" always present |
| Quick Estimate | 2 | Consent, address, type and size, then the LOOM-based range framed as guidance |
| Property Report, then nurture | 3–4 | Photos and ownership confirmation, the PDF, the day-3 follow-up with STOP opt-out |
| List my property | 6–7 | Tier choice, tap-by-tap intake with price guidance inline, the summary card |
| Verify, sign, review, live | 5, 8–10 | Ownership proof, mandate e-sign, photos, 24h review, live on Property24 |
| Buyer from Property24 | 11–12 | Portal lead into WhatsApp, consent, BetterBond pre-qual invite, a viewing booked straight into the seller's availability |
| Schedule a callback | any | Slot capture and confirmation; the console callback queue behind it |
| Tracked to registration | 13 | Bond approved, FICA checklist, deadline countdown, registration message |

---

## 6. Integrations: what to ask about each

### LOOM Property Insights
- The repo has an adapter with a guessed endpoint and a response mapper; only those two things change once the real docs arrive.
- LOOM sells a Property Report, an Area & Street Report, LOOMinate (AI condition-adjusted valuation) and an API Gateway. Decide which product the report is built on.
- Ask LOOM for API documentation and sandbox credentials now, consumer-display rights, and confirmation of what personal data comes back. Their responses can include owner names and numbers; the adapter never reads them and that must stay true.
- Confirm the R7.50 price covers the API report rather than the portal product, and that it holds at a few hundred reports a year.
- Decide who renders the branded PDF.
- One estimate is cached per listing already; keep that so repeat lookups cost nothing.

### Property24
- Ask Property24 for technology-partner feed access, the feed spec and a sandbox. Ask the devs for the certification lead time. Keep Sync or PropCtrl as the stopgap.
- Design the lead-ingestion path (3.2).
- The agreement is received, unsigned, and gated on the FFC. Open points: single subscription across suburbs, the missing Annexure P, the opening price bracket, and API feed-in instead of PropCtrl.
- At 70 live listings, roughly 17 concurrent, Property24 prices the launch profile at R7,153 a month ex VAT in the R6m–R8m column.
- Lifecycle operations the adapter must support: create, update, photo order, pause, under offer, sold, withdraw, and a reconciliation job that catches drift.

### Conveyancers
- Not an API integration for January. It is a party model, a consented document hand-off and a way for the attorney to report stage changes.
- The LPC prohibits attorneys paying referral fees, so the relationship is a panel with flat platform fees, never a percentage. The devs should not build any referral-fee logic.
- Simplest January version: a practitioner updates the stage in the console from the attorney's email or call; FICA documents go to the attorney by a secure expiring link. Ask the panel attorney what their conveyancing software can emit before anyone builds an inbound integration.
- Ask the devs to model actor types for originator, bank and conveyancer on deal events now, so the audit trail is right from the first real deal.

### BetterBond
- Stub today, and the brief flags that a buyer is marked pre-qualified the moment they consent. That has to be fixed before launch regardless.
- Find out what BetterBond exposes: an API, a web referral form, or just an email to a consultant. Design for "referral sent → consultant assigned → result received", with manual result entry in the console as the fallback.

### WhatsApp transport
- Both the Meta Cloud adapter and the Twilio adapter are built. Pick one for production.
- The long lead times are the sender number approval and the template approvals. Every message sent outside the 24-hour window needs an approved template, including the report-nurture messages and the portal-lead invite. Get the template list agreed today so submissions start this month.
- The Meta Business Portfolio and the WhatsApp Business Account must be Sold Direct's own, not the agency's.

### E-signature
- Needed for the mandate and the OTP. Provider is a client-supplied dependency in the brief. SA-based options with ECTA-compliant advanced signatures exist; DocuSign and SignNow are the global fallbacks.
- The mandate and OTP wording come from the attorney and are on the critical path. Ask when a draft can exist.

### Ownership verification
- For January: upload a municipal account or title deed, human review. Later: automated checks against deeds data.

### Photography
- Capture Media is the listing-media partner. Decide whether a booking step lives in the WhatsApp flow or stays a concierge task.

---

## 7. A January pilot you can defend

If the eight weeks are real, propose this cut and let them push back:

**In:**
- Two entry points on one menu: the estimate path (Quick Estimate, Property Report, nurture templates) and the listing path straight into intake.
- Listing intake as built, plus tier choice, ownership-proof upload with manual review, and the 24h publish queue.
- Property24 via the direct API, with Sync or PropCtrl as the stopgap; lead ingestion into WhatsApp.
- Schedule a callback: slot capture in WhatsApp and a callback queue in the console.
- Viewings booked in the chat: seller availability at listing, the buyer picks a slot, confirmations and reminders to both, outcomes captured, a viewings list in the console.
- Mandate e-sign with one provider.
- Console: login with roles, the review queue, the callback queue, deal stage controls, document view. Not the full WP5.
- Durable outbound queue for WhatsApp sends and portal publishes. Not the full WP1.
- Logging with PII redaction, error tracking, and funnel metrics against the 70-listing plan.
- Fix the pre-qualified semantics and the seller-consent record.

**After January:**
- Private Property as the second portal, full OTP document generation and versioning, attorney inbound integration, automated KYC, and the full observability and load-testing programme.

---

## 8. Client-side dependencies with an owner and a date

These sit with Sold Direct, not the devs, and each one can stall the build. Agree a date for every line.

| Dependency | Why it blocks | Target date |
|---|---|---|
| FFC and principal practitioner | No mandate, no Property24 Annexure D | before mandates in January |
| Property24 agreement signed | Feed certification | |
| Property24 technology-partner API access, feed spec and sandbox | Direct-API syndication | |
| LOOM API subscription, docs, sandbox | Estimate and report path | |
| BetterBond referral letter and technical contact | Pre-qual path | |
| Panel conveyancer signed | Transfer journey, FICA hand-off | |
| E-sign provider account | Mandate | |
| Mandate, OTP, privacy and consent wording from counsel | Every signed document | |
| Counsel's confirmation of the Quick Estimate and Property Report wording, and the conditional-0% tie | Copy on every screen | |
| Meta Business Portfolio owned by Sold Direct; sender number applied for | Everything on WhatsApp | |
| Information Officer appointed; retention and erasure policy | POPIA before real customer data | |
| Pilot cohort and a practitioner available for UAT | Acceptance | |

---

## 9. Numbers to have in your head

| Figure | Value | Source |
|---|---|---|
| Brief benchmark | 100–125 person-weeks, 20–24 weeks, 7 people | Brief §12 |
| Narrow pilot option | 12–14 weeks, 5–6 people | Brief §12 |
| Their build | ~8 weeks, Nov–Dec; ~56 person-weeks with 7 people | Their roadmap |
| Year-one plan | ~70 live listings, 50 registered sales, ~1,400 reports at 5% | Data room |
| Year-five base case | ~4,100 listings, 2,900 registered sales, ~82,000 reports | Data room |
| Year-five aggressive case | 4,800 registered sales, ~1.7× every volume row | Data room |
| Report cost | R7.50 per report; ~R5,250 a year at 700 | Marketing cost |
| Property24, 51–150 leads, R6m–R8m | R7,153 per month ex VAT, the 70-listing profile | 2026 rate card |
| LOOM basic subscription | ~R724.50 per month; API tier to confirm | Roadmap note |
| Tests passing in the repo | 26 files, 298 tests | Brief verification note |
