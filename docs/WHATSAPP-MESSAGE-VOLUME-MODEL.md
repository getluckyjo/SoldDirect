# WhatsApp message volume and cost model

_9 October 2026. Answers the workshop action "update the financial model with current WhatsApp pricing and expected message volumes; compare HaloDesk with third-party providers such as Twilio". The live workbook is `docs/whatsapp-message-volume-model.xlsx` (Inputs, Journeys, Summary, Scale Y1-Y5, Sources). Edit the yellow cells; the orange ones wait on HaloDesk's answers._

## The answer in one paragraph

At pilot volume WhatsApp is a rounding error. Year one generates roughly 49,000 outbound and 33,000 inbound messages across the estimate, listing, enquiry and transfer journeys. Meta's own charges come to about R6,800 a year excluding VAT. Going through Twilio doubles that, because Twilio bills US$0.005 on every message in both directions on top of Meta. Going through HaloDesk adds whatever its platform fee is, and any platform fee above about R570 a month makes HaloDesk the most expensive of the three at pilot volume. Per registered deal the messaging cost is about R156, or 0.3% of the R55,700 revenue per deal in the data room model. The transport decision should therefore be made on ownership, control and lock-in, not on per-message price.

## Pricing facts the model uses

Meta moved to per-message billing on 1 July 2025 and, from 1 October 2026, charges for the free-form "service" replies that used to be free inside the 24-hour window. The rules that matter for us:

| Rule | Effect on Sold Direct |
|---|---|
| Every delivered business-to-user message is billed by category and country | Every scripted prompt, every photo acknowledgement and every concierge reply costs money |
| Service messages: 1,000 free per business phone number per month, then US$0.0095 each in South Africa | The pilot sits at about 3,400 service messages a month, so roughly two thirds are billable |
| Utility templates: US$0.0095, charged inside and outside the window since 1 October 2026 | Status updates, reminders and lead invites always cost |
| Marketing templates: US$0.0379 | The report-nurture messages and the re-engagement nudge are the expensive ones, four times a utility message |
| Inbound messages are never charged by Meta | Twilio charges for them anyway |
| Free entry point: a conversation started from a Click-to-WhatsApp ad is free in every category for 72 hours | Worth routing paid acquisition through Meta ads once they run; the model has an input for the share |

Rates in rand move with the exchange rate. The workbook uses R16.50 to the dollar and adds 15% VAT.

## Where the messages come from

Per-unit counts were taken from the flows in the repo: the intake prompts, the per-photo acknowledgement, the stalled-draft nudge, the consent and hand-off replies in the enquiry module, the templates sent per deal stage, and the 7/3/1-day deadline reminders. Journeys that are not built yet (Property Report, viewings, contact release) follow the same patterns.

| Journey (year one) | Units | Outbound per unit | Category |
|---|---|---|---|
| Quick Estimate | 1,500 | 10 | service |
| Property Report | 700 | 7 + 1 | service + utility (PDF delivery) |
| Report nurture, day 3/14/30 | 700 | 3 | marketing |
| Listing intake started | 117 | 10 | service |
| Listing published | 70 | 15 + 3 | service + utility |
| Buyer enquiry | 840 | 4 + 2 | service + utility |
| Pre-qualification hand-off | 336 | 1 + 2 | service + utility |
| Viewing | 350 | 3 + 4 | service + utility |
| Deal, OTP to registration | 60 | 10 + 29 | service + utility |
| Concierge replies | per contact | 2 / 12 / 3 | service |

Every scripted service count carries a 15% overhead for re-asks and corrections.

## Year-one result

| | Meta direct | Twilio | HaloDesk |
|---|---|---|---|
| Meta per-message charges | R6,782 | R6,782 | R6,782 |
| Transport per-message fee | 0 | R6,788 | unknown |
| Platform fee | 0 | 0 | unknown |
| Total incl. VAT | R7,799 | R15,605 | R7,799 + fees |
| Per month incl. VAT | R650 | R1,300 | |

Unit economics via Meta direct: R5.20 per Quick Estimate contact, R111 per published listing, R156 per registered deal.

## Scaling to the five-year plan

Volumes scale with registered deals (50, 220, 650, 1,500, 2,900). The free tier does not scale, and Meta's high-volume discounts on utility messages are not modelled, so these are conservative.

| | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---|---|---|---|---|
| Total via Meta direct, incl. VAT | R7,800 | R41,700 | R127,300 | R296,700 | R575,600 |
| Total via Twilio, incl. VAT | R15,600 | R76,000 | R228,800 | R530,900 | R1,028,400 |
| Per registered deal, Meta direct | R156 | R189 | R196 | R198 | R199 |

By year five the Twilio surcharge alone is about R450,000 a year. That is the number to weigh against the convenience of a BSP.

## What this means for the transport decision

- **Meta Cloud API direct** is the cheapest at every scale and is the repo's default. The cost is operational: Sold Direct owns the Meta Business Portfolio, the WhatsApp Business Account and the sender number, and submits its own templates. All of that is already documented in `docs/META-ONBOARDING.md`.
- **Twilio** costs twice as much and buys a nicer console, the Content Template Builder and sandbox tooling. At pilot volume the difference is R650 a month, which is not worth arguing about; at year five it is not nothing.
- **HaloDesk** cannot be placed until Gary answers: per-message markup over Meta, monthly platform or seat fee, whether inbound messages are billed, who owns the WABA and sender number, where message data is stored, and the exit path. The break-even row in the Summary sheet turns those answers into a verdict. Whatever the price, the position from the workshop outcome doc still holds: HaloDesk as transport is fine behind the adapter interface, HaloDesk as the home of the flows is not.

## Things that would move the numbers

- **Message design.** The intake flow sends one prompt per field and one acknowledgement per photo. Bundling two fields into one prompt, or acknowledging photos in batches, cuts the biggest service line directly. That is now a cost lever, not just a UX choice.
- **Marketing templates are four times the price.** Keep the nurture to three touches and make each one count; a fourth touch across 700 reports costs about R440 a year, which is small, but the pattern scales.
- **A second business number** doubles the free tier for the cost of a second sender approval. Not worth it at pilot volume, worth it from year two.
- **Paid acquisition through Click-to-WhatsApp ads** makes the first 72 hours of every new contact free, which covers the whole Quick Estimate journey. Set the free-entry share in the Inputs sheet when ads start.

## Not in this model

LOOM reports (R7.50 each, about R5,250 a year), the Property24 subscription (R7,153 a month ex VAT at the launch profile), AI concierge inference, e-signature envelopes, SMS fallback and Meta ads spend. Those belong in the financial model's own lines.
