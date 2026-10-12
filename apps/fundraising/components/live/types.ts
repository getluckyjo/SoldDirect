/** Wire types for the live demo, mirroring apps/api/src/modules/demo. */

export interface ReplyOption {
  id: string;
  title: string;
  description?: string;
}

export type ReplyOptions =
  | {
      kind: 'buttons';
      options: ReplyOption[];
      header?: string;
      footer?: string;
    }
  | {
      kind: 'list';
      button?: string;
      sections: { title?: string; rows: ReplyOption[] }[];
      header?: string;
      footer?: string;
    };

export interface DemoMessage {
  direction: 'inbound' | 'outbound';
  body: string;
  type: string;
  mediaId?: string;
  options?: ReplyOptions;
  createdAt: string;
  /** Client-only: an optimistic echo not yet confirmed by the API. */
  pending?: boolean;
  /** Client-only: a local photo preview while the upload is in flight. */
  localSrc?: string;
}

export interface DemoListing {
  id: string;
  title: string;
  propertyType: string | null;
  suburb: string | null;
  priceZar: number;
  bedrooms: number | null;
  bathrooms: number | null;
  exclusivityTermDays: number;
  tier: string;
  status: string;
  description: string | null;
  estimateLowZar: number | null;
  estimateHighZar: number | null;
  photoCount: number;
  createdAt: string;
}

export interface DemoDealEvent {
  fromStatus: string | null;
  toStatus: string;
  actorType: string;
  note: string | null;
  createdAt: string;
}

export interface DemoDeal {
  id: string;
  status: string;
  listingId: string;
  buyerPrequalified: boolean;
  createdAt: string;
  events: DemoDealEvent[];
}

export interface DemoIntake {
  step: string;
  data: {
    title?: string;
    propertyType?: string;
    suburb?: string;
    address?: string | null;
    priceZar?: number;
    bedrooms?: number;
    bathrooms?: number;
    exclusivityTermDays?: number;
    tier?: string;
  };
  estimate?: { lowZar: number; highZar: number; source: string } | null;
}

export interface DemoEstimate {
  step: string;
  facts: { suburb?: string; propertyType?: string; bedrooms?: number };
  estimate?: {
    lowZar: number;
    highZar: number;
    source: string;
    comparablesCount?: number;
  } | null;
  reportSentAt?: string;
}

export interface DemoState {
  phone: string;
  /** Whether the concierge is live and its key accepted. */
  ai?: { concierge: boolean; key: string };
  estimate: DemoEstimate | null;
  intake: DemoIntake | null;
  listing: DemoListing | null;
  deal: DemoDeal | null;
}

export interface ThreadResponse {
  messages: DemoMessage[];
  drafts: unknown[];
}

/** A date pill inserted before message `beforeIndex` (virtual time). */
export interface Divider {
  beforeIndex: number;
  label: string;
}
