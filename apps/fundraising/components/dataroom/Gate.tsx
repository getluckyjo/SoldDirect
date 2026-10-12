import Link from 'next/link';
import { Logo } from '@/components/Logo';

const ERRORS: Record<string, string> = {
  password: 'That password is not right. Check the one in your NDA pack.',
  rate: 'Too many attempts. Wait fifteen minutes and try again.',
};

/** The password screen for the data room. Plain form, no JavaScript needed. */
export function Gate({
  next,
  error,
  configured,
}: {
  next: string;
  error?: string;
  configured: boolean;
}) {
  const message = error ? ERRORS[error] : undefined;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <Logo className="text-2xl" />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
        Investor data room
      </h1>
      <p className="mt-3 text-slate-300">
        Confidential. For prospective investors under NDA. Enter the password
        from your NDA pack.
      </p>
      {configured ? (
        <form
          method="post"
          action="/api/dataroom/session"
          className="mt-8 grid gap-4"
        >
          <input type="hidden" name="next" value={next} />
          <label className="grid gap-1.5 text-sm font-medium text-slate-200">
            Password
            <input
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="rounded-lg border border-slate-600 bg-navy-950 px-3 py-2.5 text-base text-white outline-none ring-brand-500 focus:border-brand-500 focus:ring-1"
            />
          </label>
          {message ? (
            <p role="alert" className="text-sm text-amber-300">
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-brand-400"
          >
            Open the data room
          </button>
        </form>
      ) : (
        <p className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          The data room is closed on this deployment.
        </p>
      )}
      <p className="mt-8 text-sm text-slate-400">
        No password yet?{' '}
        <Link
          href="/#access"
          className="font-medium text-brand-400 hover:text-brand-300"
        >
          Request access
        </Link>{' '}
        and one of the founders will send the NDA.
      </p>
    </div>
  );
}
