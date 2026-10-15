// Copy shared by the page and its link previews (layout metadata). Follows
// the positioning guardrails in CLAUDE.md; every 0%* resolves to the
// qualifying-path note. The hero mirrors the investor site's lede.

export const HERO = {
  eyebrow: 'Cape Town • For private sellers',
  title: 'Sell your home direct',
  sub: 'Private property sales, on WhatsApp.',
  // The 0%* token is rendered between these two parts as a tap-to-resolve note.
  subAccentPre: 'At ',
  subAccentPost: ' commission to the seller.',
} as const;

// The one-sentence resolution behind every 0%* (tooltip copy).
export const QUALIFYING_TOOLTIP =
  '0% applies on the qualifying path: a 90-day (or longer) exclusive mandate, your buyer’s bond of 80% or more placed through our origination partner, and a panel conveyancer. Otherwise a 1% facilitation fee applies.';
