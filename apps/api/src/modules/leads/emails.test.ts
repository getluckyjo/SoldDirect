import { describe, expect, it, vi } from 'vitest';
import type { EmailMessage } from '../email';
import {
  createLeadEmails,
  waitlistConfirmation,
  waitlistTeamAlert,
} from './emails';
import type { LeadInput } from './types';

const signup: LeadInput = {
  kind: 'waitlist',
  email: 'thabo@example.co.za',
  name: 'Thabo M.',
  phone: '+27820000000',
  role: 'seller',
  source: 'marketing:waitlist',
  consent: true,
  whatsappConsent: true,
};
const newLead = { id: 'lead_1', duplicate: false };

function setup(
  overrides: Partial<Parameters<typeof createLeadEmails>[0]> = {},
) {
  const sent: EmailMessage[] = [];
  const sender = {
    send: vi.fn(async (message: EmailMessage) => {
      sent.push(message);
      return { id: `em_${sent.length}` };
    }),
  };
  const log = vi.fn();
  const emails = createLeadEmails({
    sender,
    notifyTo: ['team@solddirect.co.za'],
    replyTo: 'hello@solddirect.co.za',
    dashboardUrl: 'https://dashboard.example/',
    log,
    now: () => new Date('2026-10-03T13:16:00Z'),
    ...overrides,
  });
  return { emails, sender, sent, log };
}

describe('waitlist emails', () => {
  it('confirms to the person and alerts the team on a new sign-up', async () => {
    const { emails, sent } = setup();
    await emails.onLeadCreated(newLead, signup);

    expect(sent).toHaveLength(2);
    const [confirmation, alert] = sent;
    expect(confirmation.to).toBe('thabo@example.co.za');
    expect(confirmation.replyTo).toBe('hello@solddirect.co.za');
    expect(alert.to).toEqual(['team@solddirect.co.za']);
    // Hitting reply on the alert answers the sign-up directly.
    expect(alert.replyTo).toBe('thabo@example.co.za');
  });

  it('sends nothing for a repeat sign-up — no duplicate mail, no inbox bombing', async () => {
    const { emails, sender } = setup();
    await emails.onLeadCreated({ id: 'lead_2', duplicate: true }, signup);
    expect(sender.send).not.toHaveBeenCalled();
  });

  it('leaves investor requests alone', async () => {
    const { emails, sender } = setup();
    await emails.onLeadCreated(newLead, { ...signup, kind: 'investor' });
    expect(sender.send).not.toHaveBeenCalled();
  });

  it('skips the team alert when no team inbox is configured', async () => {
    const { emails, sent } = setup({ notifyTo: [] });
    await emails.onLeadCreated(newLead, signup);
    expect(sent.map((m) => m.subject)).toEqual([
      "You're on the Sold Direct waitlist",
    ]);
  });

  it('one failed send neither throws nor stops the other — and logs no address', async () => {
    const { emails, sender, log } = setup();
    sender.send.mockRejectedValueOnce(new Error('Resend responded 500'));
    await expect(
      emails.onLeadCreated(newLead, signup),
    ).resolves.toBeUndefined();
    expect(sender.send).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenCalledWith(
      '[lead-email] confirmation failed for lead lead_1',
      expect.any(Error),
    );
    expect(JSON.stringify(log.mock.calls)).not.toContain('thabo@');
  });

  it('stops sending at the hourly cap, and starts again an hour later', async () => {
    let clock = new Date('2026-10-03T13:00:00Z').getTime();
    const { emails, sender, log } = setup({
      hourlyCap: 3,
      now: () => new Date(clock),
    });
    await emails.onLeadCreated({ id: 'a', duplicate: false }, signup);
    await emails.onLeadCreated({ id: 'b', duplicate: false }, signup);
    expect(sender.send).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenCalledWith(
      '[lead-email] hourly cap of 3 reached — team alert not sent for lead b',
    );

    clock += 61 * 60 * 1000;
    await emails.onLeadCreated({ id: 'c', duplicate: false }, signup);
    expect(sender.send).toHaveBeenCalledTimes(5);
  });
});

describe('the confirmation', () => {
  it('greets by name, speaks to the role, and carries an unsubscribe route', () => {
    const message = waitlistConfirmation(
      newLead,
      signup,
      'hello@solddirect.co.za',
    );
    expect(message.subject).toBe("You're on the Sold Direct waitlist");
    expect(message.text).toContain('Hi Thabo M.,');
    expect(message.text).toContain('list your home on WhatsApp');
    expect(message.text).toContain('reply "unsubscribe"');
    expect(message.text).toContain('https://www.solddirect.co.za/privacy');
    expect(message.headers).toEqual({
      'List-Unsubscribe': '<mailto:hello@solddirect.co.za?subject=unsubscribe>',
    });
    expect(message.idempotencyKey).toBe('waitlist-confirmation/lead_1');
  });

  it('falls back to a neutral greeting and no role line', () => {
    const message = waitlistConfirmation(newLead, {
      ...signup,
      name: '  ',
      role: 'other',
    });
    expect(message.text).toContain('Hi there,');
    expect(message.text).not.toContain('When we open');
    expect(message.headers).toBeUndefined();
  });

  it('has a buyer line for buyers', () => {
    const message = waitlistConfirmation(newLead, { ...signup, role: 'buyer' });
    expect(message.text).toContain('bond pre-qualified');
  });

  it('escapes the name in HTML — it is user input', () => {
    const message = waitlistConfirmation(newLead, {
      ...signup,
      name: '<script>alert(1)</script>',
    });
    expect(message.html).not.toContain('<script>');
    expect(message.html).toContain('&lt;script&gt;');
  });

  it('keeps to the positioning guardrails', () => {
    const { text } = waitlistConfirmation(newLead, signup);
    expect(text).not.toMatch(/no agents|obsolete|commission/i);
  });
});

describe('the team alert', () => {
  it('lists what you need to reply, in SA time, and links the waitlist page', () => {
    const message = waitlistTeamAlert(newLead, signup, {
      to: ['team@solddirect.co.za'],
      dashboardUrl: 'https://dashboard.example/',
      at: new Date('2026-10-03T13:16:00Z'),
    });
    expect(message.subject).toBe('New waitlist sign-up (seller)');
    expect(message.text).toContain('Name: Thabo M.');
    expect(message.text).toContain('Email: thabo@example.co.za');
    expect(message.text).toContain('Wants to: sell a property');
    expect(message.text).toContain('WhatsApp opt-in: yes');
    expect(message.text).toContain('When: 03/10/2026 15:16 SAST');
    expect(message.text).toContain('https://dashboard.example/waitlist');
    expect(message.idempotencyKey).toBe('waitlist-alert/lead_1');
  });

  it('leaves the phone number on the dashboard (data minimisation)', () => {
    const message = waitlistTeamAlert(newLead, signup, {
      to: ['team@solddirect.co.za'],
      at: new Date(),
    });
    expect(message.text).not.toContain('+27820000000');
    expect(message.text).toContain("the dashboard's Waitlist page");
  });
});
