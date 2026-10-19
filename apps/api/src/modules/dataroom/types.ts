/** What the investor site sends when someone signs the NDA online. */
export interface NdaSignatureInput {
  name: string;
  email: string;
  firm?: string;
  /** The NDA version the form displayed (e.g. "2026-10"). */
  ndaVersion: string;
  /** Evidence of signing, captured by the investor site's server. */
  ip?: string;
  userAgent?: string;
}

/** A stored signature as the dashboard sees it. */
export interface NdaRow {
  id: string;
  name: string;
  email: string;
  firm: string | null;
  ndaVersion: string;
  signedAt: Date;
  firstOpenedAt: Date | null;
  lastOpenedAt: Date | null;
  openCount: number;
  revokedAt: Date | null;
}

/** The identity handed back when a personal link is redeemed. */
export interface NdaViewer {
  id: string;
  name: string;
  email: string;
  firm: string | null;
  ndaVersion: string;
  signedAt: Date;
}
