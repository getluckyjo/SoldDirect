import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { NdaText } from '@/components/dataroom/NdaText';
import { NDA_VERSION } from '@/content/nda';

const ERRORS: Record<string, string> = {
  fields: 'Please give your full name and a valid email address.',
  agree: 'Please confirm you agree to the NDA before signing.',
  rate: 'Too many attempts from this connection. Wait an hour and try again.',
  upstream:
    'We could not record the signature just now. Please try again in a minute, or email johannes@solddirect.co.za.',
  email:
    'Your signature is recorded, but the link could not be emailed. We will send it by hand shortly.',
  link: 'That link is not valid any more. Sign below and a fresh one is sent to you.',
  closed: 'The data room is closed on this deployment.',
  password: 'That password is not right.',
};

const field =
  'rounded-lg border border-slate-600 bg-navy-950 px-3 py-2.5 text-base text-white outline-none ring-brand-500 placeholder:text-slate-500 focus:border-brand-500 focus:ring-1';

/**
 * The door to the data room: sign the NDA online and a personal link is
 * emailed. Plain forms, no JavaScript needed. The founders' partners use the
 * shared password, tucked away below.
 */
export function Gate({
  next,
  error,
  sent,
  ndaOpen,
  passwordOpen,
}: {
  next: string;
  error?: string;
  sent?: boolean;
  ndaOpen: boolean;
  passwordOpen: boolean;
}) {
  const message = error ? ERRORS[error] : undefined;

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <Logo className="text-2xl" />
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
          Check your inbox
        </h1>
        <p className="mt-3 text-slate-300">
          Your NDA is signed and your personal data-room link is on its way. It
          arrives within a minute; look in spam if it does not.
        </p>
        <p className="mt-6 text-sm text-slate-400">
          The link is tied to your signature and stays valid for 30 days.
          Questions? Email{' '}
          <a
            href="mailto:johannes@solddirect.co.za"
            className="font-medium text-brand-400 hover:text-brand-300"
          >
            johannes@solddirect.co.za
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <Logo className="text-2xl" />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
        Investor data room
      </h1>
      <p className="mt-3 text-slate-300">
        Confidential. Sign the NDA below and your personal link is emailed to
        you straight away.
      </p>

      {ndaOpen ? (
        <form
          method="post"
          action="/api/dataroom/nda"
          className="mt-8 grid gap-4"
        >
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="ndaVersion" value={NDA_VERSION} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium text-slate-200">
              Full name
              <input
                name="name"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                className={field}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-200">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={field}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-200 sm:col-span-2">
              Firm or fund{' '}
              <span className="font-normal text-slate-400">(optional)</span>
              <input
                name="firm"
                type="text"
                autoComplete="organization"
                className={field}
              />
            </label>
          </div>

          {/* Honeypot: invisible to humans, tempting to bots. */}
          <div aria-hidden className="absolute left-[-9999px] top-[-9999px]">
            <label>
              Website
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-navy-950/60 p-5">
            <NdaText compact />
          </div>
          <p className="text-xs text-slate-400">
            <Link
              href="/dataroom/nda"
              target="_blank"
              className="font-medium text-brand-400 hover:text-brand-300"
            >
              Open the NDA on its own page
            </Link>{' '}
            to read or print it in full.
          </p>

          <label className="flex items-start gap-3 text-sm text-slate-200">
            <input
              name="agree"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-slate-600 bg-navy-950 text-brand-500 focus:ring-brand-500/30"
            />
            <span>
              I have read the agreement and sign it as the person named above.
              Submitting this form is my electronic signature. My details are
              processed per the{' '}
              <Link
                href="/privacy"
                target="_blank"
                className="font-medium text-brand-400 hover:text-brand-300"
              >
                privacy notice
              </Link>
              .
            </span>
          </label>

          {message ? (
            <p role="alert" className="text-sm text-amber-300">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-navy transition hover:bg-brand-400"
          >
            Sign the NDA and send my link
          </button>
          <p className="text-xs text-slate-400">
            Already signed? Enter the same details and a fresh link is sent.
          </p>
        </form>
      ) : (
        <p className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          {ERRORS.closed}
        </p>
      )}

      {passwordOpen ? (
        <details
          className="mt-10 border-t border-white/10 pt-6"
          open={error === 'password'}
        >
          <summary className="cursor-pointer text-sm font-medium text-slate-400 hover:text-slate-200">
            Partner with a password?
          </summary>
          <form
            method="post"
            action="/api/dataroom/session"
            className="mt-4 flex flex-wrap items-end gap-3"
          >
            <input type="hidden" name="next" value={next} />
            <label className="grid flex-1 gap-1.5 text-sm font-medium text-slate-200">
              Password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className={field}
              />
            </label>
            <button
              type="submit"
              className="rounded-lg border border-brand-500/60 bg-brand-500/10 px-4 py-2.5 text-sm font-semibold text-brand-200 transition hover:bg-brand-500/20"
            >
              Open
            </button>
            {error === 'password' ? (
              <p role="alert" className="w-full text-sm text-amber-300">
                {ERRORS.password}
              </p>
            ) : null}
          </form>
        </details>
      ) : null}
    </div>
  );
}
