import { describe, expect, it, vi } from 'vitest';
import { createResendEmailSender } from './resend';
import { addressList, createEmailSender, emailConfigured } from './factory';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('Resend adapter', () => {
  it('posts the message to /emails and returns the provider id', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { id: 'em_1' }));
    const sender = createResendEmailSender({
      apiKey: 're_test',
      from: 'Sold Direct <hello@solddirect.co.za>',
      fetchImpl,
    });

    const result = await sender.send({
      to: 'thabo@example.co.za',
      subject: 'Hi',
      text: 'Hello',
      html: '<p>Hello</p>',
      replyTo: 'team@solddirect.co.za',
      headers: { 'List-Unsubscribe': '<mailto:team@solddirect.co.za>' },
      idempotencyKey: 'waitlist-confirmation/lead_1',
    });

    expect(result).toEqual({ id: 'em_1' });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      authorization: 'Bearer re_test',
      'content-type': 'application/json',
      'idempotency-key': 'waitlist-confirmation/lead_1',
    });
    expect(JSON.parse(init.body)).toEqual({
      from: 'Sold Direct <hello@solddirect.co.za>',
      to: ['thabo@example.co.za'],
      subject: 'Hi',
      text: 'Hello',
      html: '<p>Hello</p>',
      reply_to: 'team@solddirect.co.za',
      headers: { 'List-Unsubscribe': '<mailto:team@solddirect.co.za>' },
    });
  });

  it('sends one message to several recipients', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { id: 'em_2' }));
    const sender = createResendEmailSender({
      apiKey: 'k',
      from: 'f',
      fetchImpl,
    });
    await sender.send({
      to: ['a@x.co.za', 'b@x.co.za'],
      subject: 's',
      text: 't',
    });
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body).to).toEqual([
      'a@x.co.za',
      'b@x.co.za',
    ]);
  });

  it('throws with the status and error name — never the message, which can echo the address', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(422, {
        statusCode: 422,
        name: 'validation_error',
        message: 'Invalid `to` field: thabo@example',
      }),
    );
    const sender = createResendEmailSender({
      apiKey: 'k',
      from: 'f',
      fetchImpl,
    });
    const error = await sender
      .send({ to: 'thabo@example', subject: 's', text: 't' })
      .catch((e: Error) => e);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      'Resend responded 422 (validation_error)',
    );
    expect((error as Error).message).not.toContain('thabo');
  });

  it('surfaces a non-JSON error body by status alone', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('Bad gateway', { status: 502 }));
    const sender = createResendEmailSender({
      apiKey: 'k',
      from: 'f',
      fetchImpl,
    });
    await expect(
      sender.send({ to: 'a@x.co.za', subject: 's', text: 't' }),
    ).rejects.toThrow('Resend responded 502 (unknown_error)');
  });
});

describe('email factory', () => {
  it('is off unless both the key and a from-address are set', () => {
    expect(emailConfigured({})).toBe(false);
    expect(createEmailSender({ RESEND_API_KEY: 're_test' })).toBeNull();
    expect(
      createEmailSender({ EMAIL_FROM: 'hello@solddirect.co.za' }),
    ).toBeNull();
    const env = {
      RESEND_API_KEY: 're_test',
      EMAIL_FROM: 'hello@solddirect.co.za',
    };
    expect(emailConfigured(env)).toBe(true);
    expect(createEmailSender(env)).not.toBeNull();
  });

  it('parses a comma-separated address list', () => {
    expect(addressList(undefined)).toEqual([]);
    expect(addressList('')).toEqual([]);
    expect(addressList(' a@x.co.za , b@x.co.za,, ')).toEqual([
      'a@x.co.za',
      'b@x.co.za',
    ]);
  });
});
