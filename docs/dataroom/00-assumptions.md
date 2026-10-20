# Sold Direct — Model Assumptions (sourced)

> **How to read this.** Every input the model runs on, with the source we took it from and
> the weight we put on it. The Cape Town price and volume anchors are verified against primary
> data (Lightstone, Property24). Where a figure rests on a single source or an industry proxy we
> say so and weight it lower; those are the inputs we are confirming against the primary
> documents (LSSA tariff, oobarometer, Lightstone, Meta pricing) before close. The structure of
> every assumption stands; a few exact numbers will sharpen.

Weight key: **High** = verified / multi-source. **Medium** = single credible source.
**Low** = global proxy, weak SA fit, or dated.

---

## A. Market size & prices

| Input | Value used | Source / note | Weight |
|---|---|---|---|
| SA annual residential transfers (addressable pool) | **~250,000/yr** (range 207k arms-length sales – 277k transfers) | Lightstone 2024; broader transfer series | High |
| Cape Town metro — annual sales value | **~R81bn (2024)** | Lightstone 2024 | Medium |
| Cape Town metro — implied transaction count | **~38,000/yr** (R81bn ÷ ~R2.1m avg) | Derived | Medium |
| Western Cape — annual transactions | **~55,000/yr** (estimate; discrete count not found) | Estimate | Low |
| **CT median price** | **~R3.4m** | Lightstone/Property24 | Medium |
| **CT average selling price** | **~R2.1m** | Property24 / Africanvestor | Medium |
| CT freehold-house average | **~R6.8m** (this is the "R6m" band — **prime, not average**) | Africanvestor 2026 | Medium |
| National average price | **~R1.4m** (Q1 2024) | Lightstone | High |
| First-time-buyer avg purchase | **R1,247,810** (Q1 2025) | oobarometer | Medium |

**A note on the R6m figure:** ~R6m is **prime** Cape Town (freehold houses), **not** the average
(median ~R3.4m, average ~R2.1m). **Strategy decision:** Sold Direct deliberately **lands in the
prime segment** (Atlantic Seaboard, City Bowl, Southern Suburbs, Constantia; then prime
JHB-north / Umhlanga), where **R6–7m transacting prices are normal**. This makes the R6m figure
used on the marketing site consistent with the launch customer.

**Price taper (de-risks market share).** Rather than hold a flat prime price, the model **tapers the
average transacting price from R6.5m (Y1) to R4.0m (Y5)** — landing at prime and **broadening into
the upper-market (>~R4m)** as the brand scales. This lowers revenue/deal but expands the
addressable pool from ~14k prime (>R5m) to ~35k upper-market, cutting the implied Y5 share from
**~21% to ~4.1%** (see Market sizing). Bonded share is held at **~40–42%** (upper-market
skews cash). Price/bonded inputs are live on the Assumptions tab (C15:G15 / C16:G16).

## B. Bond financing (the revenue multiplier)

| Input | Value used | Source | Weight |
|---|---|---|---|
| Share of purchases bonded (vs cash) | **~50%** | Lightstone 2024 | Medium |
| Bank approval rate | **~83% national, ~87% Western Cape** | oobarometer | Medium |
| Deposit / LTV | **~10% deposit (90% LTV)** | oobarometer (FTB ~9.9%) | Medium |
| Average bond size | **~0.9 × purchase price** of bonded deals | Derived | Medium |

## C. Revenue rates per deal

**Monetisation policy (legally clean — no bank exclusivity).** The free 0% tier requires a
**qualifying ≥80% bond**; the **seller appoints a conveyancer from our panel** (a 30–40% fee
discount is passed to the consumer) — the buyer keeps **full rate-choice across banks**. **In Year 1** the bond is placed via our multi-bank originator (**BetterBond**) and we earn the
**origination referral (~0.5% of bond)**. **From Year 2 we bring origination in-house, working
directly with the banks** under our own aggregation agreements, capturing the **full origination
commission (~1.5% of bond)** — roughly **3× the referral**. **Otherwise a 1% facilitation fee**
applies on the price (cash, sub-80%, or buyers who won't use our partners) — **~6× less than a
typical full-service commission (5–7% + VAT)**, stated as a neutral benchmark. Separately, a bank
pays a **headline-sponsorship fee** to be the featured brand on the platform (advertising, not
steering).

> **Segment positioning:** Sold Direct is **complementary to, not competing with, full-service
> agents** — we serve sellers who choose to sell privately and do the work themselves, assisted by
> **registered property practitioners (PPRA/FFC)** and a WhatsApp concierge. No anti-agent
> marketing; zero friction with the PPRA by design. Registration and the FFC are **not yet
> held**; see Regulatory status.

> **Why not a single-bank prerequisite:** making one bank a condition of the 0% is legally grey
> (consumer-steering, competition, PPRA), so the model uses the bank-agnostic referral/origination
> above plus the sponsorship line below.
>
> **In-house origination is a regulatory step-up.** Operating as an originator direct with banks
> needs **bank aggregation agreements** and **FAIS/FSP accreditation**. **Year 1 via BetterBond is
> the runway** to secure the agreements and accreditation before the Year-2 switch. Modelled with
> an explicit origination cost line + a one-off Y2 setup (see §D). We will confirm the rate and
> terms against a bank term sheet before the switch.

| Line | Rate used | Source | Weight |
|---|---|---|---|
| Bank origination commission (banks pay originators) | **1.0%–1.9% of loan** | ooba / realestateinsights | Medium |
| **Origination referral share — Y1** (Sold Direct via BetterBond, multi-bank) | **~0.5% of bond** | ooba / IOL (originator norms) | Medium |
| **In-house origination — Y2+** (direct with banks, full commission) | **~1.5% of bond** (mid of 1.0–1.9%) | Assumption / bank norms | Low |
| **Facilitation fee** on non-partner deals | **1.0% of price** (Sold Direct policy) | Policy | n/a |
| → Origination-or-fee per deal, blended | Y1 `bonded%×0.5%×bond + (1−bonded%)×1%×price`; **Y2+ uses 1.5%** on the bonded portion | Derived | Medium |
| Conveyancing referral per deal | **R0 — the Legal Practice Council (LPC) prohibits attorneys paying referral fees** | LPC rules | High |
| **Conveyancer panel advertising** (annual, fixed subscriptions — volume-independent) | **R0.36m (Y1) → R2.4m (Y5)**; seller appoints a panel conveyancer, 30–40% fee discount passed to the consumer | Assumption | Low |
| Add-ons (premium photography / compliance / insurance), blended | **~R5,000–6,500** | Estimate | Low |
| **Bank headline sponsorship** (annual, platform-wide) | **R3.0m (Y1) → R8.0m (Y5)** — scales with audience/reach | Assumption | Low |

> **Revenue per registered deal ≈ R55.7k (Y1) → R70.6k (Y2) → R52.4k (Y5)** — steps up in Y2 as
> origination goes in-house, then eases with the price taper — plus the **annual sponsorship and
> panel-advertising subscriptions**.

**In-house origination cost inputs (from Y2 — new cost line).**

| Input | Value used | Note | Weight |
|---|---|---|---|
| Cost per bonded deal (bond-consultant time / admin) | **~R6,000** | scales with bonded deals | Low |
| Bank-aggregation / origination licensing base (annual) | **R0.8m (Y2) → R1.5m (Y5)** | fixed compliance/relationship cost | Low |
| One-off setup / licensing (Y2 only) | **~R1.5m** | accreditation, systems, bank onboarding | Low |

> Net effect (base): the Year-2 origination uplift outweighs the added cost + setup; with the
> no conveyancing referral income and tax applied, **Y5 revenue is ~R86.4m** and the cumulative after-tax cash low-point is **~−R1.5m
> (Y2, annual proxy)** on the launch team (§D), with EBITDA-positive in **Y3**.

**Reinvest-for-growth stance.** The base case **reinvests the high gross margin into above-the-line
(brand) marketing** — R2.5m (Y1) rising to **R25m (Y5)**, ~40% of revenue early easing to ~29% —
to drive the deal ramp (50 → 1,450 registered deals by Y5). This trades margin for scale and
tests as a deliberate growth choice. We
validate the ATL→deals conversion in the Cape Town pilot before scaling the spend.

**Ancillary / ecosystem revenue (optional — the database value).** Owning the homeowner
relationship unlocks a referral menu worth **~R50,000 per customer** (homeowners & contents
insurance, solar, moving, fibre, security, life cover, estate planning, etc. — full table on the
workbook's Ancillary Revenue tab). Per-stream **attach rates are our illustrative
assumptions (Low weight)**, to be validated. Modelled **optional (default off)**: ~R5,000 additional
captured per deal at ~10% blended capture; conveyancing & compliance certs are excluded here as
they already sit in the core model.

## D. Cost inputs

**From the chartered-accountant review:** SA **corporate tax at 27%** applied to positive EBITDA (no loss
carry-forward modelled — conservative) and a delivery-realistic **total headcount of 48 by Y5**
(half the roles automated). The cash-runway check that sizes the seed against the trough in
every scenario is in Capital and valuation, §1.

**The launch team (Y1–Y2).** Four people at R170k/month (R2.04m/yr + ~R0.05m statutory),
remote-first with no office lease (co-working passes; viewings at the property); Y2 adds one
practitioner and one agent/admin against signed mandates (six people, R2.53m). Paysoft's
free-development allocation and cloud/BSP startup credits carry the build and tooling. Y1–Y2
opex: **R6.09m / R11.84m**. Statutory on-costs (UIF, SDL, COIDA) are small at this payroll size;
no 13th cheque or benefits are modelled for Y1–Y2. Roles, salaries and what each carries are in
the Financial model, §3.

**COGS — bottom-up (the ~12% is built up, so gross margin is *derived*).** Rather than assume a flat
margin, COGS is built up from the direct, per-deal cost of delivering a transaction (full table on
the workbook's **COGS Build** tab). It blends to **~12% of revenue (~88% gross margin)**, trending
**7.8% (Y1) → 12.7% (Y5)** — sponsorship carries no COGS so early years are lighter; add-on & media
fulfilment lift later years.

| COGS line (per registered deal) | Y1 | Y5 | Note | Weight |
|---|---:|---:|---|---|
| Platform & messaging (WhatsApp/BSP, funnel-loaded) | R400 | R300 | Meta conversation fees + BSP markup across the enquiry funnel | Medium |
| FICA / KYC / AML + affordability checks | R250 | R220 | ID, bank & credit-bureau checks (multi-party) | Low |
| E-signature & digital documents | R180 | R150 | mandate, OTP, FICA, disclosures | Low |
| Property data / AVM / deeds / CMA | R300 | R250 | valuation & pricing data, deeds searches | Low |
| **Listing media & portal syndication** (amortised incl. unsold) | R3,600 | R2,900 | photo/video/floorplan + Property24/PP fees | Low |
| **Add-on / compliance-cert fulfilment** (resold services) | R3,900 | R3,500 | cost side of the CoC + photography add-ons | Low |
| Other / contingency & per-deal SaaS | R600 | R500 | buffer + minor tooling | Low |
| **COGS per deal** | **~R9,230** | **~R7,820** | + payment processing **~0.7%** of transactional revenue | — |

> **Excludes** the in-house bond-origination consultant cost (its own opex line) and the concierge
> team (payroll). The two biggest lines — **media/syndication** and **add-on/cert fulfilment** — are
> the ones we are firming up against supplier quotes (photographer, CoC inspectors, portal rates, BSP).

### Portal syndication — Property24 (2026 rate card and subscription agreement in hand)

| Finding | Detail | Source | Weight |
|---|---|---|---|
| Agency pricing model | Monthly **sale-listing subscription**, a matrix of **monthly leads** (1–10 … >3000) × **median listing price band** (<R1.3m … >R15m). All ex VAT. | P24 Detailed Rate Card 2026 (primary) | High |
| Key cells — R6m–R8m band (our launch band) | 1–10 leads **R989** · 11–30 **R2,868** · 31–50 **R4,480** · **51–150 R7,153** · 151–250 R9,320 · 251–500 R13,251 · 1001–1500 R28,020 · 2001–3000 R47,790 /month | Rate card 2026 | High |
| Key cells — R4m–R6m band (post-taper) | 51–150 **R6,355** · 151–250 R8,560 · 251–500 R12,366 · 1501–2000 R31,775 · **2001–3000 R44,492** · >3000 R73,360 /month | Rate card 2026 | High |
| SIBP (CompCom-mandated small-user package) | Sale listing subscription **R656/month**; branded listings from R108 | Rate card 2026 | High |
| Structural note | Pricing rises with the **median price band** — our prime launch sits in one of the most expensive columns, and the **price taper (R6.5m→R4.0m) moves us into cheaper bands** as volumes grow. | Rate card 2026 | High |
| Feed / interoperability fee | Historically **R500/month per office** for third-party feeds; the Competition Commission ordered interoperability **at no fee**. | CompCom OIPMI 2023 / IOL | High |
| Regulatory context | CompCom Online Intermediation Platforms Market Inquiry (Jul 2023) found **“exorbitant” fee increases** and volume-based price discrimination — small agencies paid **>300% more per listing** than large ones. Remedy: an **SIBP** for ≤30-lead users priced within **15% (later 10%) of the average per-listing/lead across all users**, expected to roughly **halve SME fees**. Volume-fair pricing is now the mandated norm. | CompCom final report / OnlineMarketplaces / Property Professional | High |
| Pay-per-success precedent | Property24’s own **SBF model: R199 per sale registered at the Deeds Office**, no subscription (introductory rate, older source). | GhostDigest | Low |
| Private-listing offering | P24 sells a flat-fee private-listing suite, all with a **6-month listing**, unlimited photos, lead notifications, a virtual phone number and **OTP assistance (free template + no-obligation help from Snymans Attorneys)**; no refunds on early sale. Tiers: **Self Service Lite R499 (properties ≤R500,000 only)** · **Self Service R2,299 (all prices; "most popular")** · **Assisted R3,999 (pros build the listing: aerial/walkthrough video, photography, description help, floorplans)** · **Featured R4,999 (Assisted + top-of-results placement, larger lead image, 7 days)**. What P24 sells is a *listing plus an OTP template*; pricing, viewings, buyer qualification, negotiation, bond, FICA and transfer stay on the seller. Sold Direct's wedge is that **service gap**: a practitioner-run journey at 0% on the qualifying path, syndicated as a normal agency-grade feed. | property24.com/private-listing/sell-my-property — page captured 24 Aug 2026 | High |
| Negotiation anchors | Retail per-listing prices are the **ceiling (R2,299–R4,999)**, SIBP is the **floor (R656/m)**; the COGS syndication line (~R2,900–R3,600/deal) already sits inside that band. Wholesale/volume rates are a **negotiation target, not signed terms**; the case we put to Property24 is the Property24 brief. | Rate card 2026 | n/a — positioning |
| Subscription terms (2026) | Clause 2(a) permits **unlimited** listings *"provided the Subscriber possesses a mandate to market each property"* — our model is contractually permitted, no special deal required. Pricing is **per Portal Lead × median price bracket**, monthly in advance, ex VAT; fees adjust each 1 April; either party may terminate on one month's notice. The open commercial points (one subscription per entity, Annexure P, opening bracket, API feed) and our position on them are in Regulatory status, §2. | Property24 Subscription Agreement 2026 + annexures, received 26 Aug 2026 | High |

**Reconciliation with the model (against the actual 2026 card).** At ~70% sell-through the
listing pool is ~70 (Y1) → ~2,070 (Y5); with ~90-day time-on-market and ~5 leads/listing/month,
the lead tiers work out roughly: **Y1 ≈ 51–150 leads → R7,153/m (R6m–R8m band) ≈ R86k/yr ≈
R1,700 per registered deal**; Y2 ≈ 151–250 leads in the R4m–R6m band → R8,560/m ≈ R103k/yr ≈
R930/deal; **Y5 ≈ 2,001–3,000 leads → R44,492/m ≈ R534k/yr ≈ R370/deal**. The COGS envelope (*Listing media & portal
syndication*, R3,600 → R2,900/deal) holds comfortably from Y2; **Y1 runs ~R1.4k/deal hot at
full standard rates once photography (~R2.9k/deal amortised) is added — ≈R0.07m in total,
immaterial to the P&L and closed entirely if we enter on the SIBP (R656/m) or land a launch
rate.** Under the mandated **R0 feed fee** (OIPMI) the R500/office feed charge no longer applies. **Negotiation
targets** (see the Property24 brief): SIBP-level entry stepping up the published
tiers at agreed lead milestones, and optionally a success-based component on the SBF precedent.

| Input | Value used | Source | Weight |
|---|---|---|---|
| WhatsApp messaging | **Service/utility in 24h window = free; marketing templates = main paid line** (~$0.025–$0.14/msg); modelled inside the COGS build | Meta pricing Jul 2025 | Medium |
| **Gross margin** | **~88% — DERIVED** from the bottom-up COGS build above (not an input) | Bottom-up | Medium |
| Fully-loaded cost per **human** FTE (blended) | **~R700k–780k/yr** (eng intermediate ~R48k/mo, senior ~R100k/mo, ops ~R25–35k/mo, +13th cheque/benefits/payroll ≈ ×1.3) | OfferZen 2025 | Medium |
| **Automated-role run cost** (each, replaces a human worker) | **~R0.15m/yr** (~R12.5k/mo: model API + tooling + human oversight) | Assumption | Low |
| **Automated share of headcount** | **50%** (concierge/coordination/ops); ~halves people-cost | Assumption / design choice | Low |
| CAC | **Assumption with wide bands** — there is no published SA property/mortgage CAC benchmark; WhatsApp free-window + portal syndication + referral pulls effective CAC below paid-search proxies (~$84 B2B CPL global) | HubSpot 2025 (global proxy) | Low |

## E. Valuation & funding context

| Input | Value used | Source | Weight |
|---|---|---|---|
| Proptech revenue multiple (global avg 2025) | **~8.8× EV/revenue** — **discount to ~4–6× for SA early-stage** | Finro 2025 | Medium |
| African seed ticket (avg) | **~$1.6m** | Partech 2024 | Medium |
| African Series A | **$3m–$10m** | Partech 2024 | Medium |
| SA VC market (2024) | **R13.35bn, 1,325 deals** | CNBC Africa | Medium |
| Cautionary comp | **Purplebricks**: AIM IPO £240m → peak >£1bn → **sold for £1 (2023)** on CAC/over-expansion | Wikipedia | High |

## F. Inputs we are confirming against primary documents

1. Western Cape / Cape Town **transfer counts** (only CT rand-value recovered).
2. Conveyancing fee at **R3.5m & R6m**, and the **exact panel referral-share %**.
3. **SA-specific CAC** for property/mortgage leads.
4. **Exact SA WhatsApp ZAR rates** and BSP/Twilio markup %.
5. **BetterBond referral terms** (the 0.5% Y1 share); originator market volumes /
   penetration figures are dated (ooba-published data).
6. Ops/sales **salary** benchmarks; PropertyFox/ooba **valuation multiples**.
7. **In-house origination:** the **~1.5% commission we can capture direct**, the **bank
   aggregation terms**, and the **FAIS/FSP accreditation cost/timeline** — confirm against a real
   bank term sheet before relying on the Y2 switch.
