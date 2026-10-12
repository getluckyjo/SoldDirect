import type { ReactNode } from 'react';

/**
 * WhatsApp's inline formatting, as the client renders it: *bold*, _italic_,
 * ~strike~, and line breaks. Deliberately minimal — the same text the real
 * app would show, nothing more.
 */
const TOKEN_RE = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~)/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const parts = text.split(TOKEN_RE);
  parts.forEach((part, i) => {
    if (!part) return;
    const key = `${keyPrefix}-${i}`;
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      out.push(<strong key={key}>{part.slice(1, -1)}</strong>);
    } else if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
      out.push(<em key={key}>{part.slice(1, -1)}</em>);
    } else if (part.length > 2 && part.startsWith('~') && part.endsWith('~')) {
      out.push(<s key={key}>{part.slice(1, -1)}</s>);
    } else {
      out.push(part);
    }
  });
  return out;
}

/** Rand amounts ("R5 900 000") must never wrap mid-number. */
const RAND_RE = /R\d[\d ]*\d/g;

function keepAmountsTogether(text: string): string {
  return text.replace(RAND_RE, (m) => m.replace(/ /g, '\u00a0'));
}

export function WaText({ text }: { text: string }) {
  const lines = keepAmountsTogether(text).split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {inline(line, `l${i}`)}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}
