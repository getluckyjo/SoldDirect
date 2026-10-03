export type LeadKind = 'waitlist' | 'investor';
export type LeadRole = 'seller' | 'buyer' | 'investor' | 'other';

/** A lead captured from one of the public sites (marketing / fundraising). */
export interface LeadInput {
  kind: LeadKind;
  email: string;
  name?: string;
  phone?: string;
  role?: LeadRole;
  message?: string;
  /** Free-text origin, e.g. "marketing:hero" or "fundraising:data-room". */
  source?: string;
  /** Must be true — explicit POPIA consent given on the form. */
  consent: boolean;
  /**
   * Separate, optional WhatsApp channel opt-in. Meta requires the channel to
   * be named explicitly in the opt-in, so this is never folded into
   * `consent` — a lead may accept contact and decline WhatsApp.
   */
  whatsappConsent?: boolean;
  /**
   * Version of the consent copy the form displayed
   * (`CONSENT_FORM_VERSION`). The wording itself is resolved server-side
   * from this version and stored as proof — the client never sends text.
   */
  consentFormVersion?: string;
}

/** A stored lead as the internal dashboard sees it (no consent wording). */
export interface LeadRow {
  id: string;
  kind: LeadKind;
  name: string | null;
  email: string;
  phone: string | null;
  role: LeadRole | null;
  source: string | null;
  consentAt: Date;
  whatsappConsentAt: Date | null;
  createdAt: Date;
}

export interface CreatedLead {
  id: string;
  /**
   * This address was already on the list for this kind (case-insensitive).
   * A repeat sign-up is still stored, but gets no second round of emails.
   */
  duplicate: boolean;
}
