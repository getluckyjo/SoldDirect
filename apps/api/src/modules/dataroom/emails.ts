import type { EmailMessage } from '../email';
import type { NdaSignatureInput } from './types';

const INVEST_URL = 'https://invest.solddirect.co.za';
const LOGO_URL = 'https://www.solddirect.co.za/email/signature-logo.png';
const FOUNDERS = 'Johannes le Roux and Dean Kruger';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function dmy(at: Date): string {
  return at.toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Africa/Johannesburg',
  });
}

function hm(at: Date): string {
  return at.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Johannesburg',
  });
}

function wrap(bodyHtml: string): string {
  return `<!doctype html>
<html lang="en-ZA">
<body style="margin:0;padding:0;background:#f8fafc;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;">
<a href="${INVEST_URL}" style="text-decoration:none;"><img src="${LOGO_URL}" width="220" height="64" alt="SoldDirect." style="display:block;border:0;margin:0 0 24px;" /></a>
${bodyHtml}
</div>
</body>
</html>`;
}

const p = (content: string, style = '') =>
  `<p style="margin:0 0 16px;${style}">${content}</p>`;

/**
 * To the investor: confirmation that the NDA is signed, their personal link
 * (which also verifies the address), and where to read the NDA they signed.
 */
export function ndaSignedEmail(
  input: NdaSignatureInput,
  link: string,
  signedAt: Date,
  replyTo?: string,
): EmailMessage {
  const first = input.name.trim().split(/\s+/)[0] || 'there';
  const ndaUrl = `${INVEST_URL}/dataroom/nda`;
  const when = `${dmy(signedAt)} at ${hm(signedAt)}`;
  const text = [
    `Hi ${first},`,
    `Thank you. Your non-disclosure agreement with Sold Direct was signed on ${when} (version ${input.ndaVersion}). A copy of its terms is at ${ndaUrl}.`,
    `Your personal data-room link:\n${link}`,
    'The link is yours alone: it is tied to the NDA you signed and stays valid for 30 days. Please do not forward it. If you need it again, open the data room and sign in with the same email.',
    'Start with the overview, then the financial model and the term sheet. Questions? Reply to this email.',
    `${FOUNDERS}\nSold Direct\n${INVEST_URL}`,
    `—\nYou are receiving this because you signed the investor NDA at invest.solddirect.co.za.\nPrivacy notice: ${INVEST_URL}/privacy`,
  ].join('\n\n');

  const html = wrap(
    [
      p(`Hi ${escapeHtml(first)},`),
      p(
        `Thank you. Your non-disclosure agreement with Sold Direct was signed on ${escapeHtml(when)} (version ${escapeHtml(input.ndaVersion)}). A copy of its terms is at <a href="${ndaUrl}" style="color:#27873A;">${ndaUrl.replace('https://', '')}</a>.`,
      ),
      p(
        `<a href="${link}" style="display:inline-block;background:#27873A;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;">Open your data room</a>`,
        'margin:8px 0 20px;',
      ),
      p(
        'The link is yours alone: it is tied to the NDA you signed and stays valid for 30 days. Please do not forward it. If you need it again, open the data room and sign in with the same email.',
        'font-size:14px;color:#475569;',
      ),
      p(
        'Start with the overview, then the financial model and the term sheet. Questions? Reply to this email.',
      ),
      p(
        `${escapeHtml(FOUNDERS)}<br />Sold Direct<br /><a href="${INVEST_URL}" style="color:#27873A;text-decoration:none;">invest.solddirect.co.za</a>`,
      ),
      p(
        `You are receiving this because you signed the investor NDA at invest.solddirect.co.za. <a href="${INVEST_URL}/privacy" style="color:#64748b;">Privacy notice</a>.`,
        'margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.5;color:#64748b;',
      ),
    ].join('\n'),
  );

  return {
    to: input.email,
    subject: 'Sold Direct — your NDA is signed, here is your data-room link',
    text,
    html,
    replyTo,
  };
}

/** To the founders: who signed, when, and from where. */
export function ndaTeamAlert(
  input: NdaSignatureInput,
  opts: { to: string[]; signedAt: Date; dashboardUrl?: string },
): EmailMessage {
  const rows: [string, string][] = [
    ['Name', input.name],
    ['Email', input.email],
    ['Firm', input.firm || '—'],
    ['Signed', `${dmy(opts.signedAt)} ${hm(opts.signedAt)} (SAST)`],
    ['NDA version', input.ndaVersion],
    ['IP', input.ip || '—'],
  ];
  const list = opts.dashboardUrl
    ? `${opts.dashboardUrl.replace(/\/$/, '')}/waitlist`
    : undefined;
  const text = [
    `${input.name} signed the investor NDA and received a personal data-room link.`,
    rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    list ? `All signatures: ${list}` : null,
  ]
    .filter(Boolean)
    .join('\n\n');
  const html = wrap(
    [
      p(
        `<b>${escapeHtml(input.name)}</b> signed the investor NDA and received a personal data-room link.`,
      ),
      `<table style="border-collapse:collapse;font-size:15px;">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#64748b;">${escapeHtml(k)}</td><td style="padding:4px 0;">${escapeHtml(v)}</td></tr>`,
        )
        .join('')}</table>`,
      list
        ? p(
            `<a href="${list}" style="color:#27873A;">All signatures in the dashboard</a>`,
            'margin-top:16px;',
          )
        : '',
    ].join('\n'),
  );
  return {
    to: opts.to,
    subject: `NDA signed: ${input.name}${input.firm ? ` (${input.firm})` : ''}`,
    text,
    html,
    replyTo: input.email,
  };
}
