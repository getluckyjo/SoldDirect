/**
 * Brand icon set for the investor page: 24-unit stroke glyphs in the
 * SoldDirect green on navy. Hand-drawn to the same rules as the logo
 * bubble (rounded caps, 1.75 stroke, no fills except the bubble dot) so
 * they read as one family at 20–28px.
 */
export type IconName =
  | 'gap'
  | 'chat'
  | 'bank'
  | 'chart'
  | 'coins'
  | 'phone'
  | 'map'
  | 'check'
  | 'people'
  | 'question'
  | 'steps'
  | 'growth'
  | 'home'
  | 'shield';

const PATHS: Record<IconName, React.ReactNode> = {
  // A house outline with a gap in the roofline: the unserved segment.
  gap: (
    <>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6 10.5V19h5" />
      <path d="M18 10.5V19h-3" />
      <path d="M12 21v-4" />
    </>
  ),
  // The WhatsApp-style bubble with a tail, the product's front door.
  chat: (
    <>
      <path d="M12 4a8 7 0 0 0-6.6 11.2L4.5 19.5l4.4-1.1A8 7 0 1 0 12 4Z" />
      <circle cx="9" cy="11" r=".6" fill="currentColor" />
      <circle cx="12" cy="11" r=".6" fill="currentColor" />
      <circle cx="15" cy="11" r=".6" fill="currentColor" />
    </>
  ),
  // A bank portico: the lender pays.
  bank: (
    <>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v8M10 10v8M14 10v8M19 10v8" />
      <path d="M3 18h18" />
      <path d="M3 21h18" />
    </>
  ),
  // Rising bars.
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M6 16v-4M11 16V8M16 16V5" />
      <path d="M20 16v-6" />
    </>
  ),
  // Two coins.
  coins: (
    <>
      <ellipse cx="9" cy="8" rx="5.5" ry="2.5" />
      <path d="M3.5 8v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V8" />
      <path d="M9 14.5c-3 0-5.5 1.1-5.5 2.5s2.5 2.5 5.5 2.5 5.5-1.1 5.5-2.5" />
      <path d="M14.5 10c3 0 5.5 1.1 5.5 2.5s-2.5 2.5-5.5 2.5" />
      <path d="M20 12.5v4c0 1.4-2.5 2.5-5.5 2.5" />
    </>
  ),
  // A phone.
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 17.5h2" />
    </>
  ),
  // A map pin.
  map: (
    <>
      <path d="M12 21s-6-5.5-6-10.5a6 6 0 0 1 12 0C18 15.5 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2" />
    </>
  ),
  // A check in a circle.
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </>
  ),
  // Two people.
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.5a3 3 0 0 1 0 5.5" />
      <path d="M16.5 14a5.5 5.5 0 0 1 4 5" />
    </>
  ),
  // A question mark in a circle.
  question: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.5" />
      <circle cx="12" cy="16.8" r=".6" fill="currentColor" />
    </>
  ),
  // Numbered steps.
  steps: (
    <>
      <path d="M5 6h2M10 6h9" />
      <path d="M5 12h2M10 12h9" />
      <path d="M5 18h2M10 18h9" />
    </>
  ),
  // A rising line with an arrowhead: return.
  growth: (
    <>
      <path d="M4 18 10 12l3.5 3.5L20 9" />
      <path d="M15.5 9H20v4.5" />
    </>
  ),
  // A house.
  home: (
    <>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6 10.5V19h12v-8.5" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  // A shield with a check: compliance.
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.2 3 7.3 7 9 4-1.7 7-4.8 7-9V6l-7-2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

export function Icon({
  name,
  className = 'h-6 w-6',
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}

/** The icon in its brand tile: green glyph on a translucent green disc. */
export function IconTile({
  name,
  size = 'md',
}: {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
}) {
  const box =
    size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const glyph =
    size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-500/30 ${box}`}
    >
      <Icon name={name} className={glyph} />
    </span>
  );
}
