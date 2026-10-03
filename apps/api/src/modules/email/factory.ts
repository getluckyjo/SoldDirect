import { createResendEmailSender } from './resend';
import type { EmailSender } from './types';

/** True when outbound email is configured (shown on /health). */
export function emailConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return !!(env.RESEND_API_KEY && env.EMAIL_FROM);
}

/**
 * Resend when both RESEND_API_KEY and EMAIL_FROM are set, otherwise null —
 * callers skip email entirely. Sign-ups are stored either way, so the app
 * works before the sending domain is verified.
 */
export function createEmailSender(
  env: NodeJS.ProcessEnv = process.env,
): EmailSender | null {
  if (!emailConfigured(env)) return null;
  return createResendEmailSender({
    apiKey: env.RESEND_API_KEY!,
    from: env.EMAIL_FROM!,
  });
}

/** A comma-separated address list from env ("a@x.co.za, b@x.co.za"). */
export function addressList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
}
