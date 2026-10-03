import type { EmailMessage, EmailSender } from './types';

export interface ResendConfig {
  apiKey: string;
  /** "Name <address>" on a domain verified in Resend. */
  from: string;
  /** Test seam. */
  fetchImpl?: typeof fetch;
  /** Override only for tests. */
  apiBase?: string;
}

/**
 * Resend adapter (resend.com) — plain fetch, no SDK, same pattern as the LOOM
 * and Supabase adapters.
 *
 * A failed send throws with the HTTP status and Resend's error *name* only:
 * the error message can echo the recipient, and addresses never reach logs.
 */
export function createResendEmailSender(config: ResendConfig): EmailSender {
  const doFetch = config.fetchImpl ?? fetch;
  const base = (config.apiBase ?? 'https://api.resend.com').replace(/\/$/, '');

  return {
    async send(message: EmailMessage) {
      const headers: Record<string, string> = {
        authorization: `Bearer ${config.apiKey}`,
        'content-type': 'application/json',
        'user-agent': 'sold-direct-api',
      };
      if (message.idempotencyKey) {
        headers['idempotency-key'] = message.idempotencyKey;
      }

      const response = await doFetch(`${base}/emails`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from: config.from,
          to: Array.isArray(message.to) ? message.to : [message.to],
          subject: message.subject,
          text: message.text,
          html: message.html,
          reply_to: message.replyTo,
          headers: message.headers,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        let name = 'unknown_error';
        try {
          const body = (await response.json()) as { name?: unknown };
          if (typeof body.name === 'string') name = body.name;
        } catch {
          // Non-JSON error body — the status is enough.
        }
        throw new Error(`Resend responded ${response.status} (${name})`);
      }

      const body = (await response.json()) as { id?: unknown };
      return { id: typeof body.id === 'string' ? body.id : null };
    },
  };
}
