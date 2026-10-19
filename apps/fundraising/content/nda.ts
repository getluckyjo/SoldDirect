// The investor non-disclosure agreement behind the data room. Signed online:
// the investor types their name, ticks the box and submits; the API keeps the
// name, email, firm, version, time, IP and user agent as the record of
// signature. Bump NDA_VERSION whenever the wording changes, so every stored
// signature can be matched to the exact text it accepted.
export const NDA_VERSION = '2026-10';
export const NDA_DISCLOSER = 'Sold Direct';
export const NDA_TERM_YEARS = 3;

export const NDA_TITLE = 'Investor non-disclosure agreement';

export const NDA_PREAMBLE = `This agreement is between ${NDA_DISCLOSER}, Cape Town, South Africa (the Discloser) and the person named in the signature below, acting for themselves and, where stated, for the firm they name (the Recipient). It governs the confidential information the Discloser makes available to the Recipient so that the Recipient can evaluate a possible investment in ${NDA_DISCLOSER} (the Purpose).`;

export const NDA_CLAUSES: { heading: string; body: string }[] = [
  {
    heading: '1. Confidential information',
    body: 'Confidential Information means everything made available through the investor data room or otherwise disclosed in connection with the Purpose, in any form, whether or not marked confidential: the financial model and its assumptions, the cap table, the terms of the round, partner and supplier terms, the product, technology and roadmap, customer, seller and buyer information, and the fact and content of the discussions between the parties.',
  },
  {
    heading: '2. What is not covered',
    body: 'Information is not Confidential Information to the extent the Recipient can show it is or becomes public other than through a breach of this agreement; was lawfully known to the Recipient before disclosure; is received from a third party entitled to disclose it; or is developed independently without use of the Confidential Information. Disclosure required by law, a court or a regulator is permitted, provided the Recipient gives the Discloser prompt notice where lawful and discloses only what is required.',
  },
  {
    heading: '3. What the Recipient agrees to',
    body: 'The Recipient will use the Confidential Information only for the Purpose; keep it confidential with at least the care applied to their own confidential information, and no less than reasonable care; not copy, download, forward or share it, including the personal data-room link, except as this agreement allows; and not approach the Discloser’s partners, suppliers, staff, sellers or buyers about it without the Discloser’s written consent.',
  },
  {
    heading: '4. Advisers and colleagues',
    body: 'The Recipient may share Confidential Information with their directors, partners, employees and professional advisers who need it for the Purpose and are bound by confidentiality obligations at least as strict as these. The Recipient is responsible for their compliance.',
  },
  {
    heading: '5. No commitment, no warranty, no licence',
    body: 'Nothing in this agreement obliges either party to proceed with any investment or transaction. The Confidential Information is provided as is. Projections are illustrative and unaudited, and the Discloser gives no warranty as to accuracy or completeness, save that it has not knowingly misstated anything. No licence or other right in the Confidential Information is granted.',
  },
  {
    heading: '6. Return and deletion',
    body: 'On the Discloser’s request, or when the Recipient stops evaluating the Purpose, the Recipient will delete or return all Confidential Information and confirm this in writing, keeping only what law or a bona fide compliance policy requires, which stays subject to this agreement.',
  },
  {
    heading: '7. Duration',
    body: `This agreement takes effect on signature and the obligations in it last for ${NDA_TERM_YEARS} years from that date, or for as long as the information remains confidential if that is shorter.`,
  },
  {
    heading: '8. Remedies',
    body: 'A breach may cause the Discloser harm that damages alone cannot repair. The Discloser may seek an interdict or other urgent relief, in addition to any other remedy, without having to prove that damages would be inadequate.',
  },
  {
    heading: '9. Personal information',
    body: 'The Discloser processes the Recipient’s name, email address, firm, the time and version of this signature, the IP address and the browser used, to record the agreement and to administer data-room access, in terms of the Protection of Personal Information Act, 2013 and the privacy notice on this site.',
  },
  {
    heading: '10. General',
    body: 'This is the whole agreement on its subject and can only be changed in writing. If any part is unenforceable the rest stands. South African law governs it and the parties submit to the jurisdiction of the Western Cape Division of the High Court, Cape Town.',
  },
  {
    heading: '11. Electronic signature',
    body: 'Typing a full name, ticking the agreement box and submitting the form is the Recipient’s electronic signature under section 13 of the Electronic Communications and Transactions Act, 2002, and binds the Recipient as a signature in ink would. The record the Discloser keeps of the signature, and the confirmation sent to the Recipient’s email address, are evidence of it.',
  },
];
