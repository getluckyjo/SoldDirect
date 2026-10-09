# Dev workshop outcome — Sold Direct × Lava Lamp Lab

_Minutes of the first discovery meeting, 8 October 2026 (1h 27m), as circulated on 9 October, followed by a reading of them against the prep sheet (`DEV-WORKSHOP-PREP-2026-10-08.md`) and the repo on `main`._

**Attendance.** Rika Kruger and Dave Moller (PaySoft); Johannes le Roux and Dean Kruger (Sold Direct); Gary Irwin, Rayne Falkenberg (Developer Manager), Leandra Scheepers (Agile Project Manager), Ruan Briers (Software Developer) and Jordan Kruger (UI/UX Designer) of Lava Lamp Lab.

---

## Part A — The minutes as circulated

### 1. Key discussions

**Product vision and customer experience**

- Sold Direct is intended to empower property buyers and sellers to transact directly through a streamlined, technology-enabled process, rather than operate as a conventional estate agency.
- WhatsApp will be the primary customer interface, supporting the journey from marketing and valuation through listing, viewings, offers and transaction updates.
- The experience must be simple, dependable and intuitive. The group warned that errors during a customer's first interaction could materially undermine trust and adoption.

**MVP scope and customer journey**

- The first release should deliver a complete, usable journey rather than a broad set of unfinished features: attract users, initiate a WhatsApp conversation, provide a valuation route, capture property information and progress suitable sellers towards a mandate and listing.
- The two main funnel entry points are "What is my home worth?" and "List my property". The valuation route is expected to generate higher volume and build a longer-term lead pipeline.
- The team distinguished between a quick estimate using limited information and a full branded property report requiring photos, video, ownership confirmation and potentially additional verification.
- A property profile or data room could consolidate plans, certificates and property details, reduce repeated requests and improve buyer decision-making.

**Partners and platform approach**

- Loom was identified as the valuation partner. Its service can use street-level data, photos and video to generate white-labelled reports. A cost of R7,50 per full report was discussed.
- Property24 is expected to be the principal listing channel. The technical route (direct API or PropControl) still requires confirmation.
- BetterBond was discussed as a likely bond-origination and possible identity/KYC partner. The preferred model is to pass minimal prequalification data, redirect the user to a secure pre-populated journey and receive status callbacks.
- Gary presented HaloDesk, an existing WhatsApp Business and Facebook messaging platform with configurable bot flows, API integration, AI-assisted responses and human hand-off. It may remove the need to build the messaging foundation from scratch.
- The agreed principle was to reuse partner capabilities and position Sold Direct as the orchestration layer, while retaining the customer relationship and avoiding duplicate data capture.

**Commercial model and launch approach**

- The proposed model is 0% seller commission when the buyer uses Sold Direct's bond-origination and conveyancing route. Cash or non-qualifying transactions may attract a 1% seller charge.
- Revenue is expected primarily from bond-origination economics and conveyancing-related arrangements, with optional paid add-ons such as professional photography.
- A 90-day mandate was discussed as important for securing listing stock.
- Cape Town is the intended launch market, with potential expansion into the wider Western Cape.
- A January soft launch was discussed as a target, subject to review of the prototype, source material, integrations and technical complexity.

**Security, compliance and trust**

- Fraud prevention, ownership verification, identity checks, privacy and bank-detail verification were identified as essential controls.
- The responsible party for KYC/FICA obligations (bond originator, bank, conveyancer or agent) remains unclear and must be confirmed.
- Buyer and seller details should be shared only with consent. Direct contact may be enabled after a viewing, but details should not be disclosed automatically.
- WhatsApp template requirements, opt-outs and per-message pricing must be reflected in the operating and financial model. Twilio was viewed as potentially expensive at scale.

### 2. Decisions made

1. Use WhatsApp as the primary customer-facing channel for the initial Sold Direct experience.
2. Prioritise business needs, critical-path functionality and an end-to-end MVP journey before adding non-essential features or finalising the broader technology stack.
3. Deliver in phases, beginning with acquisition, valuation, profile capture, mandate progression and the core listing journey.
4. Reuse existing partner systems and integrations wherever practical rather than rebuilding established capabilities.
5. Use the existing prototype, scope document and meeting material as the principal inputs to the product and technical assessment.
6. Launch initially in Cape Town before considering wider geographic expansion.
7. Share buyer and seller contact details only with consent; Sold Direct does not need to mediate all communication after contact is established.
8. Work towards a January soft launch, with the date remaining provisional until discovery and development estimates are complete.

### 3. Action items

| Task | Responsible | Deadline |
|---|---|---|
| Review the prototype, scope document, meeting artefacts and supporting material; define the MVP and later phases | Lava Lamp team | Findings in approximately two weeks |
| Assess the feasibility of a January soft launch; identify the critical path, dependencies and exclusions | Lava Lamp team | As part of the two-week assessment |
| Provide access to the existing prototype, working materials and original link | Johannes le Roux | Done |
| Share brand guidelines and available design assets | Johannes le Roux | As soon as possible |
| Confirm Loom integration mechanics, report retention rules, white-labelling and controls on repeat free valuations | Lava Lamp team | During solution design |
| Investigate Property24 integration options (direct API vs PropControl) and confirm ownership-verification requirements | Lava Lamp team | During discovery |
| Engage BetterBond to confirm prequalification, KYC/identity verification, redirect, pre-population and callback/API capabilities | Johannes le Roux | As soon as possible |
| Confirm KYC/FICA ownership across the transaction and document compliance hand-offs | Johannes le Roux | Before workflow sign-off |
| Define anti-fraud, privacy, consent and bank-detail verification controls | Lava Lamp team | During discovery |
| Update the financial model with current WhatsApp pricing and expected message volumes; compare HaloDesk with third-party providers such as Twilio | Johannes le Roux / Gary Irwin | During discovery and budgeting |
| Set up a collaboration channel for questions and document sharing | Leandra Scheepers | Immediate |

### 4. Questions and open issues

- **MVP boundary.** Which capabilities are mandatory for the January soft launch, and which move to later phases?
- **Launch feasibility.** Can the existing prototype and HaloDesk foundation support the target date once the code and integrations have been assessed?
- **Property24 integration.** Is direct API access available, or must Sold Direct use PropControl? What information and verification evidence are compulsory?
- **KYC/FICA accountability.** Which party carries each legal obligation, particularly for cash transactions where no bank or bond originator is involved?
- **Conveyancing updates.** How will status information be obtained where a seller selects a conveyancer outside the preferred partner network?
- **Valuation controls.** How long should reports be retained, and what limits should apply by phone number, property or time period to prevent duplicate cost or abuse?
- **Buyer hand-off.** What should Sold Direct collect before redirecting a buyer to the bond originator, and what should remain solely in the partner's secure environment?
- **Data exposure.** What property information may be shown to prospective buyers, and at which verification stage, without creating fraud or personal-security risk?
- **Consent.** At what point should buyer and seller details be exchanged, and how will explicit consent be recorded?
- **Commercial rules.** The qualifying criteria for the 0% and 1% routes, including alternative conveyancers, need formal definition in the customer journey and legal terms.
- **Messaging economics.** WhatsApp pricing, template restrictions, opt-out handling and high-volume assumptions require validation.

---

## Part B — Reading the minutes against the prep sheet and the repo

### B1. What is new or different from what we walked in with

**1. HaloDesk is now on the table as the messaging foundation.** This is the one item that cuts against the prep sheet. The prep sheet's guardrail was: Postgres is the system of record, business logic stays in the monolith, every provider sits behind an adapter, and *conversation logic does not move into a bot builder*. Decision 4 ("reuse existing partner systems") can be read as an endorsement of HaloDesk for the flows themselves. The position to take before the 19 October presentation:

- HaloDesk as **transport** (the thing that owns the WhatsApp sender, sends and receives messages, submits templates) is compatible with the repo: it becomes a third adapter next to Meta Cloud and Twilio, selected by one env var.
- HaloDesk as the **place the flows live** is not: the intake state machine, consent timestamps, the message log, opt-outs, the deal state machine and the AI shadow mode all live in the repo today and are tested. Moving them into a configurable bot builder means a second system of record, a harder POPIA audit trail, and lock-in to Lava Lamp's platform.
- Questions for Gary before the comparison in the action list: Is HaloDesk a Meta BSP in its own right, or does it resell Twilio/360dialog? Who owns the WABA and the sender number (it must be Sold Direct's)? What is the per-message margin over Meta's conversation price? Does it expose an inbound webhook and an outbound send API so our dispatcher can drive it? Where is message data stored (POPIA cross-border rules)? What is the exit path if the relationship ends?

**2. The word "valuation" is everywhere in the minutes.** The prep sheet's rule is that "valuation" appears on no screen, message, report or portal listing, because under the Property Valuers Profession Act only a registered valuer performs one. Internal minutes can say what they like, but the flows Lava Lamp draws over the next two weeks must say **Quick Estimate** and **Property Report**. Worth a one-line note to Leandra on the new collaboration channel.

**3. BetterBond as identity/KYC partner, with redirect and callbacks.** New, and a good answer to the "buyer hand-off" question: Sold Direct collects consent, name, number and the listing or price context, redirects into BetterBond's own secure journey, and never holds income, payslips or ID documents. The repo's finance adapter already has the shape for this (a referral goes out and a reference id comes back); what it lacks is an inbound status-callback endpoint and the correct semantics, since today a buyer is marked pre-qualified at the moment of consent. Both are build items for the January cut regardless of who builds.

**4. Contact details are shared after a viewing, with consent, and Sold Direct need not mediate thereafter.** This is simpler than an anonymised relay and it is what the repo should build towards: a *viewing* event on the deal, a *contact-release* consent recorded with a timestamp for each side, and nothing disclosed before that. None of the three exists today; the enquiry module stores the buyer and the deal but has no viewing or release step.

**5. The 90-day mandate.** Matches the repo: intake offers 60, 90 or 120 days with 90 as the starred default.

**6. 1% on cash or non-qualifying deals.** Matches the prep sheet and the tier the repo stores on the listing.

**7. A property profile or data room.** New idea, sensible, and a later phase. It overlaps with the private document storage and ownership-proof upload the prep sheet already puts at the listing tier, so it can grow out of that rather than be a separate feature.

**8. Twilio "potentially expensive at scale".** The repo defaults to Meta's Cloud API directly, with Twilio as the alternative. Meta's conversation pricing is the floor whichever route is chosen; a BSP (Twilio, HaloDesk or anyone else) adds a per-message margin on top. The financial-model action should compare all three on the same volume assumptions, not just HaloDesk against Twilio.

**9. Timeline.** Lava Lamp's two-week assessment lands around 22 October, which matches the "presentation week of 19 October" in their roadmap. January stays provisional.

### B2. What the prep sheet wanted settled that the minutes do not mention

These are not lost, but they are not in the record, so they need raising on the collaboration channel or at the 19 October presentation.

- **Eight weeks versus the brief's 100 to 125 person-weeks.** Partly covered by the feasibility action. Ask that the assessment maps the eight weeks to the brief's work packages, so any cut is explicit.
- **How a Property24 enquiry becomes a WhatsApp conversation.** The lead-ingestion path (portal lead by email or webhook, then a template invite into WhatsApp) was not discussed, and the whole buyer side depends on it.
- **E-signature for the mandate and the OTP.** No provider discussed. On the critical path for any mandate in January.
- **Schedule a callback.** Slot capture plus a console callback queue was a requirement in the prep sheet; not mentioned.
- **The FFC before any mandate is taken.** Not mentioned. A January launch with mandates needs the Fidelity Fund Certificate by December.
- **The template list.** The minutes note that template rules must be in the model; no list was agreed. The repo already has nine templates drafted (`docs/whatsapp-templates.md`) that can be the starting list, but the nurture messages for the Property Report path are not among them yet.
- **Meta or Twilio for production.** Now a three-way choice with HaloDesk; see B1.1.

### B3. Johannes's action items, with what already exists

| Action | What is already in hand |
|---|---|
| Share brand guidelines and design assets | `docs/brand/brand-pillars.pdf`, `docs/brand/design-brief.pdf`, the root `Sold_Direct_Design_Brief.pdf`, email signatures under `docs/brand/email-signatures/`, and the positioning guardrails in `CLAUDE.md` (never anti-agent, savings framed neutrally). |
| Engage BetterBond | The prep sheet's BetterBond questions (§6) plus the new ones from the minutes: identity/KYC, redirect with pre-population, status callbacks or API, and who their technical contact is. |
| Confirm KYC/FICA ownership | Worth checking with counsel, but the premise that this is "unclear" deserves a challenge: estate agencies are listed accountable institutions under FICA, so Sold Direct, operating as or under a registered practitioner, carries its own client-due-diligence duties on both parties, independent of what the bank, originator or conveyancer does. On a cash deal that leaves Sold Direct and the conveyancer. |
| Financial model with WhatsApp pricing | Volume assumptions to use: about 70 live listings and about 700 reports in year one (prep sheet §9). The model needs a per-journey message count, the share of messages outside the 24-hour window (those are template conversations and are billed), and three transport columns: Meta direct, Twilio, HaloDesk. |

### B4. Suggested next steps in the repo

In rough priority, and all of them useful whoever ends up building:

1. Write the HaloDesk position (B1.1) into the roadmap so it is a stated requirement, not something rediscovered at the presentation.
2. Add the viewing event and the contact-release consent to the deal model, since the minutes have now decided the rule.
3. Fix the pre-qualified semantics and add a referral-status callback endpoint in the finance module.
4. Draft the Property Report nurture templates (day 3, 14, 30) so template submissions can start this month.
5. Build the message-volume model for the WhatsApp pricing action.
