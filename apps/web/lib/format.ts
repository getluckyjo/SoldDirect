export function zar(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

/**
 * DD/MM/YYYY in South African time (UTC+2 all year — no DST).
 *
 * Deliberately NOT `toLocaleDateString('en-ZA')`: CLDR's en-ZA short date is
 * YYYY/MM/DD, and the output also shifts with the host's ICU build and time
 * zone (Vercel runs in UTC, so a late-evening date would land a day early).
 */
export function dmy(iso: string): string {
  const t = new Date(new Date(iso).getTime() + 2 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(t.getUTCDate())}/${pad(t.getUTCMonth() + 1)}/${t.getUTCFullYear()}`;
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}
