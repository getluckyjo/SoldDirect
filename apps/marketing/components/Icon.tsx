/**
 * The brand icon set from the investor site (components/pitch/Icon.tsx),
 * trimmed to the glyphs this page uses: 24-unit stroke glyphs drawn to the
 * logo bubble's rules (rounded caps, 1.75 stroke). The tile is the
 * light-surface version: brand-700 glyph on a brand-50 disc.
 */
export type IconName = 'bolt' | 'chat' | 'handshake' | 'map';

const PATHS: Record<IconName, React.ReactNode> = {
  // Instant: the free estimate.
  bolt: <path d="M13 3 5 13.5h6L10 21l9-11h-6l1-7Z" />,
  // The WhatsApp-style bubble with a tail.
  chat: (
    <>
      <path d="M12 4a8 7 0 0 0-6.6 11.2L4.5 19.5l4.4-1.1A8 7 0 1 0 12 4Z" />
      <circle cx="9" cy="11" r=".6" fill="currentColor" />
      <circle cx="12" cy="11" r=".6" fill="currentColor" />
      <circle cx="15" cy="11" r=".6" fill="currentColor" />
    </>
  ),
  // Partners and services after the sale.
  handshake: (
    <>
      <path d="M2.5 9h3.5l3.5 3.5a2 2 0 0 0 2.8 0L15 10" />
      <path d="M21.5 9H18l-3-3H11L8 9" />
      <path d="m6 9 4.5 4.5M18 9l-4 4.5a1.5 1.5 0 0 1-2.2 0" />
      <path d="M2.5 9v6.5h3l3 3 1.5-1.5" />
      <path d="M21.5 9v6.5h-3l-2.5 2.5" />
    </>
  ),
  // A map pin: the new neighbourhood.
  map: (
    <>
      <path d="M12 21s-6-5.5-6-10.5a6 6 0 0 1 12 0C18 15.5 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2" />
    </>
  ),
};

export function IconTile({ name }: { name: IconName }) {
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-5 w-5"
      >
        {PATHS[name]}
      </svg>
    </span>
  );
}
