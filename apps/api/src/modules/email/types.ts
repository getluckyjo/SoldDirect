/** One outbound email. Plain text is required; HTML is the optional upgrade. */
export interface EmailMessage {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  /** Where a reply goes — a monitored inbox, or the sign-up on a team alert. */
  replyTo?: string;
  /** Extra headers, e.g. `List-Unsubscribe`. */
  headers?: Record<string, string>;
  /** Provider-side dedupe key, so a retried send never delivers twice. */
  idempotencyKey?: string;
}

/**
 * Outbound email seam. Business logic depends only on this interface; the
 * provider (Resend today) lives behind it in its own file, so swapping it is
 * one new adapter and a factory change.
 */
export interface EmailSender {
  /** Resolves with the provider's message id; throws when the send fails. */
  send(message: EmailMessage): Promise<{ id: string | null }>;
}
