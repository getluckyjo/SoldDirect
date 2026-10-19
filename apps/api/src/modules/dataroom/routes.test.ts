import { describe, expect, it, vi } from 'vitest';
import { buildServer } from '../../app';
import type { EmailMessage } from '../email';
import type { NdaRepository } from './repository';

function fakeRepository(): NdaRepository & {
  create: ReturnType<typeof vi.fn>;
  redeem: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
} {
  return {
    create: vi
      .fn()
      .mockResolvedValue({ id: 'nda_1', token: 'tok_'.padEnd(40, 'x') }),
    redeem: vi.fn().mockResolvedValue({
      id: 'nda_1',
      name: 'Rika Kruger',
      email: 'rika@example.co.za',
      firm: null,
      ndaVersion: '2026-10',
      signedAt: new Date('2026-10-19T10:00:00Z'),
    }),
    list: vi.fn().mockResolvedValue([{ id: 'nda_1', name: 'Rika Kruger' }]),
  };
}

function fakeSender() {
  const sent: EmailMessage[] = [];
  return {
    sent,
    send: vi.fn(async (m: EmailMessage) => {
      sent.push(m);
      return { id: 'msg' };
    }),
  };
}

const signature = {
  name: 'Rika Kruger',
  email: 'rika@example.co.za',
  firm: 'Kruger Capital',
  ndaVersion: '2026-10',
  ip: '196.0.0.1',
  userAgent: 'Mozilla/5.0',
};

describe('POST /api/dataroom/nda', () => {
  it('stores the signature and emails the personal link plus the team alert', async () => {
    const repository = fakeRepository();
    const sender = fakeSender();
    process.env.WAITLIST_NOTIFY_TO = 'founders@example.co.za';
    const app = buildServer({ ndaRepository: repository, emailSender: sender });
    const res = await app.inject({
      method: 'POST',
      url: '/api/dataroom/nda',
      payload: signature,
    });
    await app.close();
    delete process.env.WAITLIST_NOTIFY_TO;

    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({ id: 'nda_1', emailed: true });
    expect(repository.create).toHaveBeenCalledWith(signature);
    expect(sender.sent).toHaveLength(2);
    const [toInvestor, toTeam] = sender.sent;
    expect(toInvestor.to).toBe('rika@example.co.za');
    expect(toInvestor.text).toContain(
      '/dataroom/enter?t=tok_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    );
    expect(toTeam.to).toEqual(['founders@example.co.za']);
    expect(toTeam.subject).toBe('NDA signed: Rika Kruger (Kruger Capital)');
  });

  it('still stores the signature when email is off', async () => {
    const repository = fakeRepository();
    const app = buildServer({ ndaRepository: repository, emailSender: null });
    const res = await app.inject({
      method: 'POST',
      url: '/api/dataroom/nda',
      payload: signature,
    });
    await app.close();
    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({ id: 'nda_1', emailed: false });
  });

  it('rejects a signature without a name or a malformed email', async () => {
    const app = buildServer({
      ndaRepository: fakeRepository(),
      emailSender: null,
    });
    const noName = await app.inject({
      method: 'POST',
      url: '/api/dataroom/nda',
      payload: { ...signature, name: '' },
    });
    const badEmail = await app.inject({
      method: 'POST',
      url: '/api/dataroom/nda',
      payload: { ...signature, email: 'not-an-email' },
    });
    await app.close();
    expect(noName.statusCode).toBe(400);
    expect(badEmail.statusCode).toBe(400);
  });
});

describe('POST /api/dataroom/nda/redeem', () => {
  it('returns the viewer for a valid link and 404 otherwise', async () => {
    const repository = fakeRepository();
    const app = buildServer({ ndaRepository: repository, emailSender: null });
    const ok = await app.inject({
      method: 'POST',
      url: '/api/dataroom/nda/redeem',
      payload: { token: 'tok_'.padEnd(40, 'x') },
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().viewer.name).toBe('Rika Kruger');

    repository.redeem.mockResolvedValueOnce(null);
    const bad = await app.inject({
      method: 'POST',
      url: '/api/dataroom/nda/redeem',
      payload: { token: 'tok_'.padEnd(40, 'y') },
    });
    await app.close();
    expect(bad.statusCode).toBe(404);
  });
});

describe('GET /api/dataroom/nda', () => {
  it('requires the internal token', async () => {
    const app = buildServer({
      ndaRepository: fakeRepository(),
      emailSender: null,
      internalToken: 'secret',
    });
    const denied = await app.inject({
      method: 'GET',
      url: '/api/dataroom/nda',
    });
    const allowed = await app.inject({
      method: 'GET',
      url: '/api/dataroom/nda',
      headers: { 'x-internal-token': 'secret' },
    });
    await app.close();
    expect(denied.statusCode).toBe(401);
    expect(allowed.statusCode).toBe(200);
    expect(allowed.json().signatures).toHaveLength(1);
  });
});
