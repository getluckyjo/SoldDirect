import type { EmailMessage, EmailSender } from '../email';
import type { CreatedLead, LeadInput, LeadRole } from './types';

const SITE_URL = 'https://www.solddirect.co.za';
const LOGO_URL = `${SITE_URL}/email/signature-logo.png`;

/**
 * Abuse brake. POST /api/leads is public, so without a ceiling anyone could
 * make us email thousands of made-up addresses and wreck the sending domain's
 * reputation. Each new sign-up costs two emails, so this allows ~60 sign-ups
 * an hour — far above launch traffic. Past it the lead is still stored.
 */
export const DEFAULT_HOURLY_CAP = 120;

export interface LeadEmailDeps {
  sender: EmailSender;
  /** Team inbox(es) alerted on each new sign-up. Empty = no alert. */
  notifyTo: string[];
  /** Monitored inbox for replies (and unsubscribe requests) to the confirmation. */
  replyTo?: string;
  /** Dashboard base URL, so the alert links straight to the waitlist page. */
  dashboardUrl?: string;
  hourlyCap?: number;
  log: (message: string, error?: unknown) => void;
  now?: () => Date;
}

export interface LeadEmails {
  /** Never throws: a failed email must not fail a sign-up that is stored. */
  onLeadCreated(lead: CreatedLead, input: LeadInput): Promise<void>;
}

/**
 * The two waitlist emails: a confirmation to the person who signed up, and an
 * alert to the team. Sent once per address — a repeat sign-up is stored but
 * gets neither, which also stops the form being used to bomb someone's inbox.
 * POPIA: logs carry the lead id only, never the address.
 */
export function createLeadEmails(deps: LeadEmailDeps): LeadEmails {
  const now = deps.now ?? (() => new Date());
  const cap = deps.hourlyCap ?? DEFAULT_HOURLY_CAP;
  let sentAt: number[] = [];

  function takeSlot(): boolean {
    const t = now().getTime();
    sentAt = sentAt.filter((s) => s > t - 60 * 60 * 1000);
    if (sentAt.length >= cap) return false;
    sentAt.push(t);
    return true;
  }

  async function attempt(label: string, leadId: string, message: EmailMessage) {
    if (!takeSlot()) {
      deps.log(
        `[lead-email] hourly cap of ${cap} reached — ${label} not sent for lead ${leadId}`,
      );
      return;
    }
    try {
      await deps.sender.send(message);
    } catch (error) {
      deps.log(`[lead-email] ${label} failed for lead ${leadId}`, error);
    }
  }

  return {
    async onLeadCreated(lead, input) {
      // Investor data-room requests are answered by hand; waitlist only.
      if (input.kind !== 'waitlist' || lead.duplicate) return;
      const sends = [
        attempt(
          'confirmation',
          lead.id,
          waitlistConfirmation(lead, input, deps.replyTo),
        ),
      ];
      if (deps.notifyTo.length > 0) {
        sends.push(
          attempt(
            'team alert',
            lead.id,
            waitlistTeamAlert(lead, input, {
              to: deps.notifyTo,
              dashboardUrl: deps.dashboardUrl,
              at: now(),
            }),
          ),
        );
      }
      await Promise.all(sends);
    },
  };
}

// ── The confirmation (to the person who signed up) ─────────────────────────

const ROLE_LINE: Partial<Record<LeadRole, string>> = {
  seller:
    "When we open, you'll list your home on WhatsApp in a few guided steps — " +
    'with our concierge and registered practitioners behind you.',
  buyer:
    "When we open, you'll be able to enquire on homes and get bond " +
    'pre-qualified without leaving WhatsApp.',
};

export function waitlistConfirmation(
  lead: CreatedLead,
  input: LeadInput,
  replyTo?: string,
): EmailMessage {
  const name = input.name?.trim();
  const paragraphs = [
    `Hi ${name || 'there'},`,
    "Thanks for joining the Sold Direct waitlist — you're one of the first in Cape Town.",
    input.role ? ROLE_LINE[input.role] : undefined,
    "We'll be in touch as we go live. Questions in the meantime? Just reply to this email.",
  ].filter((p): p is string => !!p);
  const signOff = 'The Sold Direct team';
  const footer =
    "You're receiving this because you joined the waitlist at solddirect.co.za. " +
    'To stop hearing from us, reply "unsubscribe" and we\'ll remove your details.';

  const text = [
    ...paragraphs,
    `${signOff}\n${SITE_URL}`,
    `—\n${footer}\nPrivacy notice: ${SITE_URL}/privacy`,
  ].join('\n\n');

  const p = (content: string, style = '') =>
    `<p style="margin:0 0 16px;${style}">${content}</p>`;
  const html = `<!doctype html>
<html lang="en-ZA">
<body style="margin:0;padding:0;background:#f8fafc;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;">
<a href="${SITE_URL}" style="text-decoration:none;"><img src="${LOGO_URL}" width="220" height="64" alt="SoldDirect." style="display:block;border:0;margin:0 0 24px;" /></a>
${paragraphs.map((para) => p(escapeHtml(para))).join('\n')}
${p(`${signOff}<br /><a href="${SITE_URL}" style="color:#27873A;text-decoration:none;">solddirect.co.za</a>`)}
${p(`${escapeHtml(footer)} <a href="${SITE_URL}/privacy" style="color:#64748b;">Privacy notice</a>.`, 'margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.5;color:#64748b;')}
</div>
</body>
</html>`;

  return {
    to: input.email,
    subject: "You're on the Sold Direct waitlist",
    text,
    html,
    replyTo,
    headers: replyTo
      ? { 'List-Unsubscribe': `<mailto:${replyTo}?subject=unsubscribe>` }
      : undefined,
    idempotencyKey: `waitlist-confirmation/${lead.id}`,
  };
}

// ── The team alert ─────────────────────────────────────────────────────────

const ROLE_LABEL: Record<LeadRole, string> = {
  seller: 'sell a property',
  buyer: 'buy a property',
  investor: 'invest',
  other: 'keep an eye out',
};

export function waitlistTeamAlert(
  lead: CreatedLead,
  input: LeadInput,
  opts: { to: string[]; dashboardUrl?: string; at: Date },
): EmailMessage {
  // Data minimisation: the phone number and consent record stay on the
  // dashboard — the alert carries only what you need to reply.
  const waitlistUrl = opts.dashboardUrl
    ? `${opts.dashboardUrl.replace(/\/$/, '')}/waitlist`
    : null;
  const text = [
    'New waitlist sign-up.',
    [
      `Name: ${input.name?.trim() || '—'}`,
      `Email: ${input.email}`,
      `Wants to: ${input.role ? ROLE_LABEL[input.role] : '—'}`,
      `WhatsApp opt-in: ${input.whatsappConsent ? 'yes' : 'no'}`,
      `Source: ${input.source ?? '—'}`,
      `When: ${sast(opts.at)}`,
    ].join('\n'),
    waitlistUrl
      ? `Phone number and consent record: ${waitlistUrl}`
      : "Phone number and consent record: the dashboard's Waitlist page.",
    'Reply to this email to answer them directly.',
  ].join('\n\n');

  return {
    to: opts.to,
    subject: `New waitlist sign-up (${input.role ?? 'no role given'})`,
    text,
    replyTo: input.email,
    idempotencyKey: `waitlist-alert/${lead.id}`,
  };
}

/** DD/MM/YYYY HH:mm in South African time (UTC+2 all year — no DST). */
function sast(date: Date): string {
  const t = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${pad(t.getUTCDate())}/${pad(t.getUTCMonth() + 1)}/${t.getUTCFullYear()} ` +
    `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())} SAST`
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
