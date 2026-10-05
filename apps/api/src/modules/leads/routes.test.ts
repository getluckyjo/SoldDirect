import { describe, expect, it, vi } from 'vitest';
import { CONSENT_FORM_VERSION } from '@sell-direct/shared';
import { buildServer } from '../../app';
import type { LeadRepository } from './repository';

function fakeLeadRepository(): LeadRepository & {
  create: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
} {
  return {
    create: vi.fn().mockResolvedValue({ id: 'lead_1', duplicate: false }),
    list: vi
      .fn()
      .mockResolvedValue([
        { id: 'lead_1', kind: 'waitlist', email: 'thabo@example.co.za' },
      ]),
  };
}

async function post(repository: LeadRepository, payload: unknown) {
  const app = buildServer({ leadRepository: repository, emailSender: null });
  const res = await app.inject({
    method: 'POST',
    url: '/api/leads',
    headers: { 'content-type': 'application/json' },
    payload: JSON.stringify(payload),
  });
  await app.close();
  return res;
}

describe('POST /api/leads', () => {
  it('accepts a valid waitlist signup', async () => {
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      role: 'seller',
      source: 'marketing:hero',
      consent: true,
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({ id: 'lead_1' });
    expect(repository.create).toHaveBeenCalledOnce();
    expect(repository.create.mock.calls[0][0]).toMatchObject({
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      role: 'seller',
    });
  });

  it('passes the separate WhatsApp opt-in and form version through', async () => {
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      consent: true,
      whatsappConsent: true,
      consentFormVersion: CONSENT_FORM_VERSION,
    });

    expect(res.statusCode).toBe(201);
    expect(repository.create.mock.calls[0][0]).toMatchObject({
      whatsappConsent: true,
      consentFormVersion: CONSENT_FORM_VERSION,
    });
  });

  it('accepts the POPIA consent while WhatsApp is declined', async () => {
    // Meta requires the channel named separately; declining WhatsApp must
    // never block the form, or the consent is not freely given.
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      consent: true,
      whatsappConsent: false,
      consentFormVersion: CONSENT_FORM_VERSION,
    });

    expect(res.statusCode).toBe(201);
    expect(repository.create.mock.calls[0][0]).toMatchObject({
      whatsappConsent: false,
    });
  });

  it('rejects an unknown consent version (400) rather than storing unprovable consent', async () => {
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      consent: true,
      consentFormVersion: '1999-01-01.9',
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ error: 'unknown_consent_version' });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects a missing consent (400) and stores nothing', async () => {
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'waitlist',
      email: 'thabo@example.co.za',
    });
    expect(res.statusCode).toBe(400);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects consent=false (400)', async () => {
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      consent: false,
    });
    expect(res.statusCode).toBe(400);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects a malformed email (400)', async () => {
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'waitlist',
      email: 'not-an-email',
      consent: true,
    });
    expect(res.statusCode).toBe(400);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects an unknown kind (400)', async () => {
    const repository = fakeLeadRepository();
    const res = await post(repository, {
      kind: 'spam',
      email: 'thabo@example.co.za',
      consent: true,
    });
    expect(res.statusCode).toBe(400);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('POST /api/leads — waitlist emails', () => {
  async function postWithEmail(payload: unknown) {
    const repository = fakeLeadRepository();
    const sender = { send: vi.fn().mockResolvedValue({ id: 'email_1' }) };
    const app = buildServer({
      leadRepository: repository,
      emailSender: sender,
    });
    const res = await app.inject({
      method: 'POST',
      url: '/api/leads',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify(payload),
    });
    // The hook is fire-and-forget; let it settle before asserting.
    await new Promise((resolve) => setImmediate(resolve));
    await app.close();
    return { res, sender, repository };
  }

  it('emails the person who signed up once the lead is stored', async () => {
    const { res, sender } = await postWithEmail({
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      consent: true,
    });
    expect(res.statusCode).toBe(201);
    expect(sender.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'thabo@example.co.za' }),
    );
  });

  it('a failing email never fails the sign-up', async () => {
    const repository = fakeLeadRepository();
    const sender = { send: vi.fn().mockRejectedValue(new Error('down')) };
    const app = buildServer({
      leadRepository: repository,
      emailSender: sender,
    });
    const res = await app.inject({
      method: 'POST',
      url: '/api/leads',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify({
        kind: 'waitlist',
        email: 'thabo@example.co.za',
        consent: true,
      }),
    });
    await new Promise((resolve) => setImmediate(resolve));
    await app.close();
    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({ id: 'lead_1' });
  });

  it('sends nothing for a rejected submission', async () => {
    const { res, sender } = await postWithEmail({
      kind: 'waitlist',
      email: 'thabo@example.co.za',
      consent: false,
    });
    expect(res.statusCode).toBe(400);
    expect(sender.send).not.toHaveBeenCalled();
  });
});

describe('GET /api/leads (dashboard)', () => {
  function build(internalToken?: string) {
    const repository = fakeLeadRepository();
    const app = buildServer({
      leadRepository: repository,
      emailSender: null,
      internalToken,
    });
    return { app, repository };
  }

  it('lists leads, filtered by kind', async () => {
    const { app, repository } = build();
    const res = await app.inject({
      method: 'GET',
      url: '/api/leads?kind=waitlist',
    });
    await app.close();
    expect(res.statusCode).toBe(200);
    expect(res.json().leads).toHaveLength(1);
    expect(repository.list).toHaveBeenCalledWith('waitlist');
  });

  it('rejects an unknown kind', async () => {
    const { app } = build();
    const res = await app.inject({
      method: 'GET',
      url: '/api/leads?kind=spam',
    });
    await app.close();
    expect(res.statusCode).toBe(400);
  });

  it('enforces the internal token when configured — the list is PII', async () => {
    const { app, repository } = build('secret-token');
    const none = await app.inject({ method: 'GET', url: '/api/leads' });
    const wrong = await app.inject({
      method: 'GET',
      url: '/api/leads',
      headers: { 'x-internal-token': 'wrong' },
    });
    const ok = await app.inject({
      method: 'GET',
      url: '/api/leads',
      headers: { 'x-internal-token': 'secret-token' },
    });
    await app.close();
    expect(none.statusCode).toBe(401);
    expect(wrong.statusCode).toBe(401);
    expect(ok.statusCode).toBe(200);
    expect(repository.list).toHaveBeenCalledTimes(1);
  });

  it('keeps the public sign-up open while the list is guarded', async () => {
    const { app } = build('secret-token');
    const res = await app.inject({
      method: 'POST',
      url: '/api/leads',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify({
        kind: 'waitlist',
        email: 'thabo@example.co.za',
        consent: true,
      }),
    });
    await app.close();
    expect(res.statusCode).toBe(201);
  });
});
