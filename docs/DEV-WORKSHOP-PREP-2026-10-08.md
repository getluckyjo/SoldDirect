# Dev workshop prep — Sold Direct × tech partner

_8 October 2026. Prepared from the Developer Scoping Brief v1.0 (21 Aug), the hand-drawn journey sketch, and the current repo on `main`. Seven of the eleven decisions in section 2 were taken on the morning of 8 October and are marked **Decided**._

---

## 1. What this meeting has to produce

Their roadmap (appended to the brief) says: 4-hour BA workshop this week → two weeks of flow and development diagrams → presentation week of 19 Oct → ~8-week build → soft launch January 2027 → MOU after 19 Oct.

So the flows they draw over the next two weeks are built from **today's conversation**. Walk out with:

1. One agreed end-to-end journey, step by step, with the inputs, outputs and rules for each step (section 3).
2. Answers to the four decisions still open in section 2 (seven were taken this morning), or a named owner and date for each.
3. The integration list with a route chosen for each one (section 4).
4. A clear line between the January pilot and the rest of the brief (section 5).
5. Their questions answered on the commercial side without letting it eat the scoping time (section 7).

---

## 2. The big things to settle first

These are the places where the sketch, the brief and the repo disagree. If they are not resolved today, the devs will diagram the wrong product.

### 2.1 The sketch has a different front door from the brief — **Decided 08/10**

**The sketch** is valuation-led: Intro + menu → quick estimate or detailed report → KYC/account → property data (location, images, video) → Sold Direct-branded report built on LOOM data, with a payment invoice → 5,000 reports in year one → 500 listings → publish to Property24.

**The brief and the repo** are listing-led: a seller taps LIST, runs the guided intake, sends photos, the listing goes active. A "What's my home worth?" menu row exists and the price step shows a LOOM range, but there is no report product, no account step, no payment, no nurture from report to listing.

The brief (21 Aug) does not mention the report funnel at all, so it is a new work package and must be in their 19 Oct presentation.

**Decided:** both paths are first-class. The welcome menu offers "What's my home worth?" and "List my property" side by side. A seller who only wants a number gets the Quick Estimate, can opt into the Property Report, and is nurtured towards listing later. A seller who wants to sell now goes straight into intake, with the estimate shown inline at the price step as it is today. Neither path gates the other, and the devs should present them to Property24 and in the 19 Oct deck as two entry points into one funnel.

### 2.2 The word "valuation" is legally loaded — **Decided 08/10**

The repo deliberately never says "valuation". Under the Property Valuers Profession Act only a registered valuer may perform a valuation, so all copy says "price guidance" and "estimate", with the asking price always the seller's. The sketch says "valuation", "quick valuation" and "valuation report" throughout.

LOOM's own products are called "Property Report", "Area & Street Report" and "LOOMinate".

**Decided:** the products are called **Quick Estimate** and **Property Report**. The word "valuation" appears on no screen, message, report or portal listing. Counsel confirms the wording before launch; until then this is the working rule for every flow the devs draw.

### 2.3 "Payment invoice": who pays for the report? — **Decided 08/10**

Three readings of the sketch:

- The seller pays for the detailed report. This is a new revenue line and needs a payment provider. The brief explicitly excludes payments unless separately quoted.
- Quick estimate free, detailed report paid.
- The "invoice" is LOOM invoicing Sold Direct per report, so it is a cost line, not revenue.

**Decided:** Sold Direct pays for the report, **R7.50 per report**, booked as a marketing cost. The seller pays nothing, so no payment provider is needed and payments stay out of scope as the brief has it. The "invoice" on the sketch is LOOM's bill to us. Tell the devs the report is free to the seller so the consent copy and the flow carry no payment step.

### 2.4 Where identity verification sits — **Decided 08/10**

The sketch has "KYC / Account — UX?" before the valuation, and "verification (municipal bill / KYC)" at the listing step. Full KYC before a free estimate will collapse the 5,000 funnel.

**Suggested tiers:**

| Stage | What we ask | Why |
|---|---|---|
| Quick estimate | WhatsApp number, name, POPIA consent, address, basic description | Enough for LOOM; minimal PII |
| Detailed report | Add photos or video, confirm you are the owner or authorised | Report quality; a soft ownership claim |
| Listing | Ownership proof upload (municipal account or title deed), ID, mandate signature | Property24 requires a mandate per listing; the FFC obligations |

Two repo gaps the brief already flags: seller consent is not a separate timestamped record, and there is no private storage for documents. Both become required by the listing tier.

**Decided:** the tiers above stand. At the estimate we ask only number, name, consent and address. Ownership proof and ID come at the listing, where Property24's mandate rule makes them necessary anyway.

### 2.5 The tiers on the sketch

The sketch says "exclusive mandate vs 1% — cash sale or third party". That matches the model: 0% on the qualifying path (exclusive mandate, bond through BetterBond, panel conveyancer); 1% facilitation fee on cash or third-party-financed deals. Confirm the devs model exactly these two paths, and that the 1% path still produces a listing on Property24.

Hard dependency: **no mandate can be taken until the FFC is in place.** A January soft launch with mandates needs the FFC by December. Put the date on the dependency list.

### 2.6 Intro + menu: deterministic, not a chatbot — **Decided 08/10**

The sketch says no generic responses, a limited menu, and always a "talk to a person / schedule a callback" exit. The repo already has a five-row welcome menu (List, How it works, What it costs, What's my home worth, Talk to our team) and an AI concierge that can run in shadow or live mode.

**Decided:** scripted and menu-driven for the pilot, with the concierge in shadow mode drafting replies for a human to approve. **"Schedule a callback" is in scope:** a slot-capture step in WhatsApp and a callback queue in the console, neither of which exists today. Put both in the January build.

### 2.7 Volume: 500 listings or 70? — **Decided 08/10**

The sketch targets 5,000 estimates and 500 listings in year one. The data room base case has ~70 live listings and 50 registered sales in year one. The gap matters for Property24 tier cost, LOOM pricing, and how many people review listings within 24 hours and return callbacks.

**Decided:** size for **70 live listings** in year one, as in the data room. That is roughly 17 concurrent listings, which puts Property24 in the 51 to 150 leads tier at R7,153 a month, and about 700 reports a year if one in ten converts. The 5,000-report figure is the upside case, not the plan. Tell the devs to design so the bigger number needs no re-architecture, but to staff and price for 70.

### 2.8 Eight weeks versus the brief

The brief benchmarks 100 to 125 person-weeks, or 20 to 24 weeks with seven people. The brief's own "narrow pilot" option is 12 to 14 weeks with five or six people, for one portal, one e-sign provider and a basic console. Their roadmap is eight weeks of build in November and December, with December written off.

**What 100 to 125 means.** Section 12 of the brief sizes the remaining work at seven full-time technical people for 20 to 24 weeks. Seven people times 20 to 24 weeks, with overlap between work packages, is about 100 to 125 technical person-weeks. It is the brief's own benchmark for the whole scope, including the console, documents and e-signature, syndication, durable workers and hardening. Eight weeks with the same seven people is about 56 person-weeks, roughly half.

Ask them to map the eight weeks to the brief's work packages. If they cannot, the January launch scope needs cutting explicitly (section 5), not quietly.

### 2.9 Property24 feed route — **Decided 08/10**

Three ways to get listings onto Property24, with very different build effort:

- **PropCtrl**, Property24's own listing system, around R672 per month. Fastest, but it is a second system the team keys listings into, or a sync to it.
- **A syndication layer such as Entegral Sync.** One feed to Property24, Private Property and others, with status callbacks, portal references and error reporting. Around R499 setup per portal plus a monthly fee. Cuts most of WP3's 12 to 16 person-weeks.
- **Direct Property24 API as a technology partner.** The cleanest long-term, but the open commercial point with Property24 and the slowest to certify.

**Decided:** the direct Property24 API. That is the full WP3 build, 12 to 16 person-weeks in the brief, and it depends on Property24 granting technology-partner feed access with a feed spec and a sandbox, which is open commercial point four in the subscription paperwork. Ask the devs for the certification lead time, and keep Sync or PropCtrl as the stopgap if access is slow. The agreement itself is unsigned and Annexure D needs the FFC number.

### 2.10 How a Property24 enquiry becomes a WhatsApp conversation

The whole model depends on the buyer landing in WhatsApp with a listing ID. Property24 delivers leads by email and phone and may strip links from descriptions. Ask the devs to design the lead-ingestion path: Property24 lead email or webhook → parse → create the buyer and enquiry deal → send the buyer a WhatsApp template with the listing. That template needs approval lead time.

### 2.11 Keep the architecture

The brief's guardrail: Postgres stays the system of record, business logic stays in the modular monolith, providers stay behind adapters. Watch for a proposal to rebuild in their stack, or to move conversation logic into Twilio Studio, a bot builder, or the e-sign provider. Ask directly what stack they intend to use and whether the existing TypeScript, Fastify, Prisma and Next.js code is the baseline.

---

## 3. The journey, step by step

Use this as the agenda for the UX part. For each step: goal, what we ask, what gets stored, rules, repo status, and the question to settle.

| # | Step | Goal | Inputs | Record | Rules | Repo status | Settle today |
|---|---|---|---|---|---|---|---|
| 0 | Entry | Land in WhatsApp with context | Deep link from site, ads, Property24, or a cold "hi" | Message log | Entry words LIST and PRICE both stay live; every CTA deep-links one of them | Built | Both entry points are decided. Which one the site headline leads with |
| 1 | Intro + menu | Orient, then one tap | Menu row | Conversation state | "What's my home worth?" and "List my property" side by side; no free-text chatter; always a human exit | Built (5 rows) | Final menu rows. Scripted + shadow is decided; add the callback slot step |
| 2 | Quick estimate | A range in under a minute | Name, consent, suburb or address, type, beds, baths | Seller, consent timestamp, estimate | Estimate wording, never "valuation"; never show a fabricated range | Built at the price step; LOOM endpoint is a placeholder | Free to the seller (decided). What the flow does when LOOM returns nothing |
| 3 | Detailed report | Branded report worth converting on | Photos or video, confirm ownership, email for the PDF | Report record, media | Who renders the PDF: us from LOOM data, or LOOM white-label | Not built | Free, R7.50 to us (decided). Format and delivery channel |
| 4 | Nurture to listing | Turn 10% of reports into listings | Follow-ups at day 3, 14, 30 | Marketing consent, opt-out | Outside 24h needs an approved marketing template; opt-out already built | Opt-out built; re-engagement partly | Cadence and copy |
| 5 | Account and verification | Know the seller is the owner | Ownership proof, ID | Private document, review status | Private storage, 24h human review, encrypted at rest | Not built | Manual review for January |
| 6 | Tier choice and mandate | 0% exclusive vs 1% | Tap a tier; e-sign the mandate | Listing tier, mandate envelope | No mandate before the FFC | Tier stored; no e-sign | E-sign provider; mandate text from attorney |
| 7 | Listing intake | Clean listing record | Type, suburb, address, price, beds, baths, term | Listing | Address mandatory for the portal; sectional-title fields | Built | Add levies and erf; pro photography option |
| 8 | Photos and description | Portal-grade listing | Seller photos, optional pro shoot, AI draft description | Photos, description | First photo activates; seller approves the draft | Built | Capture Media booking step? |
| 9 | Owner review → Sold Direct review | Publish only what is checked | Owner confirms; staff approve within 24h | Approval event | Nothing publishes unreviewed | Not built; console is read-only | Who reviews, SLA, what blocks |
| 10 | Publish | Live on Property24 and Private Property | Approved listing | Portal reference, publish timestamp | Create, update, photo order, under offer, sold, withdraw | Stub | Direct API (decided); Property24 access date |
| 11 | Enquiry in | Buyer in WhatsApp against the listing | Portal lead or shareable link | Buyer, deal at enquiry | Consent before any finance talk | Built for the link; not for portal leads | Lead ingestion (2.10) |
| 12 | Pre-qual and offer | Real BetterBond result; OTP | Consent, income, deposit; offer terms | Referral state, OTP versions | "Pre-qualified" only after a partner result | Stub; wrong semantics today | What BetterBond actually exposes |
| 13 | Transfer journey | Track to registration | Stage updates from attorney and bank | Deal events, deadlines | Every change timestamped with an actor | Built, with reminders | How attorneys report status |

---

## 4. Integrations: what to ask about each

### LOOM Property Insights
- The repo has an adapter with a guessed endpoint and a response mapper; only those two things change once the real docs arrive.
- LOOM sells a Property Report, an Area & Street Report, LOOMinate (AI condition-adjusted valuation) and an API Gateway. Decide which product the report is built on.
- Ask LOOM for: API documentation and sandbox credentials now, per-call or per-report pricing at ~5,000 a year, consumer-display rights, and confirmation of what personal data comes back. Their responses can include owner names and numbers; the adapter never reads them and that must stay true.
- Cost is settled at R7.50 per report, paid by Sold Direct as marketing. Confirm that price covers the API report rather than the portal product, and that it holds at a few hundred reports a year.
- Decide who renders the branded PDF.
- One estimate is cached per listing already; keep that so repeat lookups cost nothing.

### Property24
- Decided: the direct API (2.9). Ask Property24 for technology-partner feed access, the feed spec and a sandbox; ask the devs for the certification lead time; keep Sync or PropCtrl as the stopgap.
- Design the lead-ingestion path (2.10).
- The agreement is received, unsigned, and gated on the FFC. Open points: single subscription across suburbs, the missing Annexure P, the opening price bracket, and API feed-in instead of PropCtrl.
- At 70 live listings, roughly 17 concurrent, Property24 prices the launch profile at R7,153 a month ex VAT in the R6m–R8m column. Worth having in your head if they ask about running costs.
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

### Payments
- Not needed. Sold Direct pays for the report (2.3), so payments stay out of scope as the brief has it.

### Photography
- Capture Media is the listing-media partner. Decide whether a booking step lives in the WhatsApp flow or stays a concierge task.

---

## 5. A January pilot you can defend

If the eight weeks are real, propose this cut and let them push back:

**In:**
- Two entry points on one menu: the estimate path (Quick Estimate, Property Report, nurture templates) and the listing path straight into intake.
- Listing intake as built, plus tier choice, ownership-proof upload with manual review, and the 24h publish queue.
- Property24 via the direct API, with Sync or PropCtrl as the stopgap; lead ingestion into WhatsApp.
- Schedule a callback: slot capture in WhatsApp and a callback queue in the console.
- Mandate e-sign with one provider.
- Console: login with roles, the review queue, the callback queue, deal stage controls, document view. Not the full WP5.
- Durable outbound queue for WhatsApp sends and portal publishes. Not the full WP1.
- Logging with PII redaction, error tracking, funnel metrics for the numbers in 2.7.
- Fix the pre-qualified semantics and the seller-consent record.

**After January:**
- Private Property as the second portal, full OTP document generation and versioning, attorney inbound integration, automated KYC, and the full observability and load-testing programme.

---

## 6. Client-side dependencies with an owner and a date

These sit with Sold Direct, not the devs, and each one can stall the build. Agree a date for every line.

| Dependency | Why it blocks | Target date |
|---|---|---|
| FFC and principal practitioner | No mandate, no Property24 Annexure D | before mandates in January |
| Property24 agreement signed | Feed certification | |
| Property24 technology-partner API access, feed spec and sandbox | Direct-API syndication (2.9) | |
| LOOM API subscription, docs, sandbox | Report funnel | |
| BetterBond referral letter and technical contact | Pre-qual path | |
| Panel conveyancer signed | Transfer journey, FICA hand-off | |
| E-sign provider account | Mandate | |
| Mandate, OTP, privacy and consent wording from counsel | Every signed document | |
| Attorney view on "valuation" naming and the conditional-0% tie | Copy on every screen | |
| Meta Business Portfolio owned by Sold Direct; sender number applied for | Everything on WhatsApp | |
| Information Officer appointed; retention and erasure policy | POPIA before real customer data | |
| Pilot cohort and a practitioner available for UAT | Acceptance | |

---

## 7. Questions for them

**Delivery**
- Who is the named technical lead, and who else is on the team? Seniority mix?
- Which of the brief's work packages fit in the eight weeks? Which are deferred?
- Have they shipped on the WhatsApp Business Platform before? Ask for a reference you can call.
- How do they run staging, UAT and release? Who hosts: the current Railway, Vercel and Supabase, or their infrastructure?
- Which stack? Is the existing repo the baseline or a reference?
- How do they handle POPIA as an operator: DPA, data residency, access to production data?
- Support and SLA after the soft launch, and the warranty period.

**Commercial**
- They want shareholding and to fund development, maintenance and integrations, with an MOU after 19 Oct. Ask how scope changes are priced under a fixed monthly amount, how new integrations are costed, and what happens to the team if the relationship ends.
- The code and the repo stay Sold Direct's IP, including anything they write. Say it today so it is in the MOU.
- Ask what BFI is and whether you can speak to them.
- Keep the equity conversation short today. The number depends on the 19 Oct cost projection they themselves propose to produce.

---

## 8. Numbers to have in your head

| Figure | Value | Source |
|---|---|---|
| Brief benchmark | 100–125 person-weeks, 20–24 weeks, 7 people | Brief §12 |
| Narrow pilot option | 12–14 weeks, 5–6 people | Brief §12 |
| Their build | ~8 weeks, Nov–Dec; ~56 person-weeks with 7 people | Their roadmap |
| Year-one plan (decided) | ~70 live listings, 50 registered sales | Data room |
| Sketch upside case | 5,000 estimates → 500 listings | Sketch |
| Report cost (decided) | R7.50 per report; ~R5,250 a year at 700, R37,500 at 5,000 | Marketing cost |
| Property24, 51–150 leads, R6m–R8m | R7,153 per month ex VAT, the 70-listing profile | 2026 rate card |
| LOOM basic subscription | ~R724.50 per month; API tier unknown | Roadmap note |
| Tests passing in the repo | 26 files, 298 tests | Brief verification note |
