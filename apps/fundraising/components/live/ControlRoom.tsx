'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconTile } from '@/components/pitch/Icon';
import {
  JOURNEY,
  completedFromServer,
  listingIsLive,
  nextJourneyStep,
  statusRank,
  type JourneyStepId,
} from './journey-plan';
import type { DemoState } from './types';

interface ControlRoomProps {
  state: DemoState | null;
  issued: readonly JourneyStepId[];
  busy: boolean;
  loaded: boolean;
  error: string | null;
  phone: string | null;
  hasMessages: boolean;
  onSend: (text: string, replyId?: string) => void;
  onSamplePhotos: () => void;
  onJourney: (step: JourneyStepId) => void;
  onReset: () => void;
}

function zar(n: number): string {
  return `R${Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
}

const TYPE_LABEL: Record<string, string> = {
  house: 'House',
  apartment: 'Apartment',
  townhouse: 'Townhouse',
  estate: 'Secure estate',
  land: 'Vacant land',
  other: 'Property',
};

const STEP_LABEL: Record<string, string> = {
  awaiting_property_type: 'property type',
  awaiting_title: 'headline',
  awaiting_suburb: 'suburb',
  awaiting_suburb_pick: 'suburb',
  awaiting_address: 'street address (optional)',
  awaiting_price: 'asking price',
  awaiting_bedrooms: 'bedrooms',
  awaiting_bathrooms: 'bathrooms',
  awaiting_exclusivity: 'exclusive term',
  awaiting_confirm: 'confirmation',
  awaiting_edit_choice: 'what to change',
};

const DEAL_LABEL: Record<string, string> = {
  enquiry: 'Enquiry',
  offer_otp: 'Offer to Purchase',
  bond_application: 'Bond application',
  bond_granted: 'Bond granted',
  documents_fica: 'FICA documents',
  clearance: 'Clearance and certificates',
  lodgement: 'Lodged at the Deeds Office',
  registered: 'Registered',
  cancelled: 'Cancelled',
};

const ERROR_TEXT: Record<string, string> = {
  demo_not_configured:
    'The live demo is not configured on this deployment (DEMO_ACCESS_TOKEN is missing).',
  upstream_unavailable:
    'The API is unreachable at the moment. Try again shortly.',
  rate_limited:
    'Too many requests from this connection. Pause for a few minutes.',
  network: 'Lost the connection to the demo. Check your network and try again.',
  invalid_transition:
    'That step is out of order for this sale. Reply in the chat first, then continue.',
  no_listing: 'List a home first — the market needs something to respond to.',
};

function Card({
  icon,
  title,
  aside,
  children,
}: {
  icon: Parameters<typeof IconTile>[0]['name'];
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-navy p-5">
      <div className="flex items-center gap-3">
        <IconTile name={icon} size="sm" />
        <h2 className="flex-1 text-base font-semibold text-white">{title}</h2>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Action({
  children,
  onClick,
  primary,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        primary
          ? 'bg-brand-500 text-navy hover:bg-brand-400'
          : 'border border-slate-700 text-slate-200 hover:border-brand-500/60'
      }`}
    >
      {children}
    </button>
  );
}

export function ControlRoom({
  state,
  issued,
  busy,
  loaded,
  error,
  phone,
  hasMessages,
  onSend,
  onSamplePhotos,
  onJourney,
  onReset,
}: ControlRoomProps) {
  const listing = state?.listing ?? null;
  const deal = state?.deal ?? null;
  const intake = state?.intake ?? null;
  const estimate = state?.estimate ?? null;
  const done = completedFromServer(deal, issued);
  const { step: next, awaiting } = nextJourneyStep(done, issued);
  const live = listingIsLive(listing);
  const sold = deal?.status === 'registered';
  const ai = state?.ai;
  const aiOn =
    !!ai && ai.concierge && (ai.key === 'ok' || ai.key === 'unverified');
  const aiReason = !ai
    ? 'Checking…'
    : !ai.concierge
      ? 'AGENT_ENABLED is off on the API'
      : ai.key === 'invalid'
        ? 'The Anthropic API key on the API is rejected (401)'
        : ai.key === 'missing'
          ? 'No ANTHROPIC_API_KEY on the API'
          : 'The Anthropic API could not be reached';

  /* ── "Now": what to do next, in context ─────────────────────────────── */
  let now: ReactNode;
  if (sold) {
    now = (
      <>
        <p className="text-lg font-semibold text-white">
          Sold. Registered at the Deeds Office, 0% commission to the seller.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Every message you received came from the production pipeline: the
          listing flow, the deal state machine and its stage notifications. The
          buyer was simulated; nothing else was.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/#access"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-navy hover:bg-brand-400"
          >
            Request the data room
          </Link>
          <Action onClick={onReset}>Sell another home</Action>
        </div>
      </>
    );
  } else if (live && (next || awaiting)) {
    now = awaiting ? (
      <>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-300">
          Reply in the chat
        </p>
        <p className="mt-1 text-lg font-semibold text-white">
          {awaiting.awaitsReply === 'viewing'
            ? 'Tap a viewing slot in the chat.'
            : 'Respond to the offer in the chat.'}
        </p>
        <p className="mt-2 text-sm text-slate-300">{awaiting.detail}</p>
      </>
    ) : next ? (
      <>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-300">
          Your listing is live · day {next.day}
        </p>
        <p className="mt-1 text-lg font-semibold text-white">{next.title}</p>
        <p className="mt-2 text-sm text-slate-300">{next.detail}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Action primary disabled={busy} onClick={() => onJourney(next.id)}>
            {busy ? 'Working…' : `Continue: ${next.title.toLowerCase()}`}
          </Action>
        </div>
      </>
    ) : null;
  } else if (listing && listing.status === 'awaiting_photos') {
    now = (
      <>
        <p className="text-lg font-semibold text-white">
          Listing confirmed. It goes live with the first photo.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Attach your own with the paperclip, or send three sample photos. The
          photo is stored, the listing is activated and syndication is queued,
          exactly as in production.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Action primary disabled={busy} onClick={onSamplePhotos}>
            Send 3 sample photos
          </Action>
        </div>
      </>
    );
  } else if (intake) {
    now = (
      <>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-300">
          Building the listing
        </p>
        <p className="mt-1 text-lg font-semibold text-white">
          Next: {STEP_LABEL[intake.step] ?? intake.step.replace(/_/g, ' ')}
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Each tap is a WhatsApp reply button. The listing record fills in below
          as the conversation progresses. Ask anything mid-flow; the concierge
          answers and the step is re-asked.
        </p>
      </>
    );
  } else if (estimate && estimate.step === 'estimated') {
    now = (
      <>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-300">
          Quick Estimate done
        </p>
        <p className="mt-1 text-lg font-semibold text-white">
          {estimate.reportSentAt
            ? 'Property Report sent. Ready to list?'
            : 'Get the Property Report, or list the home.'}
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Listing from here carries the suburb, type and bedrooms over, and the
          price step shows the same guidance as tap-able amounts.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {!estimate.reportSentAt ? (
            <Action
              primary
              disabled={busy}
              onClick={() => onSend('📄 Property Report', 'REPORT')}
            >
              Property Report
            </Action>
          ) : null}
          <Action
            primary={!!estimate.reportSentAt}
            disabled={busy}
            onClick={() => onSend('List my property', 'START')}
          >
            List my property
          </Action>
        </div>
      </>
    );
  } else if (estimate) {
    now = (
      <>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-300">
          Quick Estimate
        </p>
        <p className="mt-1 text-lg font-semibold text-white">
          Three taps in the chat.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Region, suburb, type and bedrooms. The band comes from the data
          partner adapter; in this demo the figures are illustrative.
        </p>
      </>
    );
  } else {
    now = (
      <>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-300">
          You are the seller
        </p>
        <p className="mt-1 text-lg font-semibold text-white">
          Start where a seller starts.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Ask what the home is worth, list it straight away, or ask the
          concierge anything about selling in Cape Town.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Action
            primary
            disabled={busy || !loaded}
            onClick={() => onSend('What’s my home worth?', 'PRICE')}
          >
            What’s my home worth?
          </Action>
          <Action
            disabled={busy || !loaded}
            onClick={() => onSend('List my property', 'START')}
          >
            List my property
          </Action>
          <Action
            disabled={busy || !loaded}
            onClick={() =>
              onSend(
                'How long does a transfer take in Cape Town, and who pays what?',
              )
            }
          >
            Ask the concierge
          </Action>
        </div>
      </>
    );
  }

  /* ── Listing record ─────────────────────────────────────────────────── */
  const draft = intake?.data ?? {};
  const record: { label: string; value: string | null }[] = listing
    ? [
        { label: 'Headline', value: listing.title },
        {
          label: 'Type',
          value: listing.propertyType
            ? (TYPE_LABEL[listing.propertyType] ?? listing.propertyType)
            : null,
        },
        { label: 'Suburb', value: listing.suburb },
        { label: 'Asking price', value: zar(listing.priceZar) },
        {
          label: 'Bed · bath',
          value:
            listing.bedrooms !== null && listing.bathrooms !== null
              ? `${listing.bedrooms} · ${listing.bathrooms}`
              : null,
        },
        {
          label: 'Exclusive term',
          value: `${listing.exclusivityTermDays} days`,
        },
        {
          label: 'Path',
          value: listing.tier === 'free' ? '0% qualifying path' : 'Flex 1%',
        },
        {
          label: 'Guidance shown',
          value:
            listing.estimateLowZar && listing.estimateHighZar
              ? `${zar(listing.estimateLowZar)} – ${zar(listing.estimateHighZar)}`
              : null,
        },
        { label: 'Photos', value: String(listing.photoCount) },
        { label: 'Description', value: listing.description ? 'Saved' : null },
      ]
    : [
        { label: 'Headline', value: draft.title ?? null },
        {
          label: 'Type',
          value: draft.propertyType
            ? (TYPE_LABEL[draft.propertyType] ?? draft.propertyType)
            : (estimate?.facts.propertyType ?? null),
        },
        {
          label: 'Suburb',
          value: draft.suburb ?? estimate?.facts.suburb ?? null,
        },
        {
          label: 'Address (private)',
          value: draft.address === null ? 'Skipped' : (draft.address ?? null),
        },
        {
          label: 'Asking price',
          value: draft.priceZar !== undefined ? zar(draft.priceZar) : null,
        },
        {
          label: 'Bed · bath',
          value:
            draft.bedrooms !== undefined ||
            estimate?.facts.bedrooms !== undefined
              ? `${draft.bedrooms ?? estimate?.facts.bedrooms ?? '—'} · ${draft.bathrooms ?? '—'}`
              : null,
        },
        {
          label: 'Exclusive term',
          value:
            draft.exclusivityTermDays !== undefined
              ? `${draft.exclusivityTermDays} days`
              : null,
        },
        {
          label: 'Guidance shown',
          value: intake?.estimate
            ? `${zar(intake.estimate.lowZar)} – ${zar(intake.estimate.highZar)}`
            : estimate?.estimate
              ? `${zar(estimate.estimate.lowZar)} – ${zar(estimate.estimate.highZar)}`
              : null,
        },
      ];

  const statusChip = listing
    ? listing.status === 'active'
      ? { text: 'Live', tone: 'bg-brand-500/15 text-brand-300' }
      : listing.status === 'awaiting_photos'
        ? { text: 'Pending photos', tone: 'bg-amber-500/15 text-amber-300' }
        : { text: listing.status, tone: 'bg-slate-700 text-slate-200' }
    : intake
      ? { text: 'Draft', tone: 'bg-slate-700 text-slate-200' }
      : estimate
        ? { text: 'Estimate', tone: 'bg-slate-700 text-slate-200' }
        : { text: 'Nothing yet', tone: 'bg-slate-800 text-slate-400' };

  /* ── Transfer journey ───────────────────────────────────────────────── */
  const dealRank = statusRank(deal?.status);

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {ERROR_TEXT[error] ?? `Something went wrong (${error}).`}
        </div>
      ) : null}

      <Card
        icon="bolt"
        title="Now"
        aside={
          aiOn ? (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              Live pipeline · concierge on
            </span>
          ) : (
            <span
              className="flex items-center gap-1.5 text-xs text-amber-300"
              title={aiReason}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Live pipeline · concierge off
            </span>
          )
        }
      >
        {now}
      </Card>

      <Card
        icon="home"
        title="Listing record"
        aside={
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusChip.tone}`}
          >
            {statusChip.text}
          </span>
        }
      >
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
          {record.map((r) => (
            <div key={r.label}>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {r.label}
              </dt>
              <dd
                className={`mt-0.5 ${r.value ? 'text-white' : 'text-slate-600'}`}
              >
                {r.value ?? '—'}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-500">
          The typed record the state machine builds from the chat. The dashboard
          and the portal feed read these rows.
        </p>
      </Card>

      <Card
        icon="steps"
        title="The sale"
        aside={
          deal ? (
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
              {DEAL_LABEL[deal.status] ?? deal.status}
            </span>
          ) : null
        }
      >
        <ol className="space-y-2">
          {JOURNEY.map((s) => {
            const isDone = done.has(s.id);
            const isAwaiting = awaiting?.id === s.id;
            const isNext = next?.id === s.id && live;
            return (
              <li key={s.id} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isDone
                      ? 'bg-brand-500 text-navy'
                      : isAwaiting
                        ? 'bg-amber-400 text-navy'
                        : isNext
                          ? 'border border-brand-400 text-brand-300'
                          : 'border border-slate-700 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : isAwaiting ? '!' : ''}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm ${
                      isDone || isNext || isAwaiting
                        ? 'text-white'
                        : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                    <span className="ml-2 text-xs text-slate-500">
                      day {s.day}
                    </span>
                  </span>
                  {isAwaiting ? (
                    <span className="block text-xs text-amber-300">
                      Awaiting your reply in the chat
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
        {deal && deal.events.length > 0 ? (
          <details className="mt-4 text-xs text-slate-400">
            <summary className="cursor-pointer text-slate-300">
              Audit log ({deal.events.length})
            </summary>
            <ul className="mt-2 space-y-1">
              {deal.events.map((e, i) => (
                <li key={i}>
                  <span className="text-slate-500">
                    {e.fromStatus && e.fromStatus !== e.toStatus
                      ? `${DEAL_LABEL[e.fromStatus] ?? e.fromStatus} → ${DEAL_LABEL[e.toStatus] ?? e.toStatus}`
                      : (DEAL_LABEL[e.toStatus] ?? e.toStatus)}
                  </span>
                  {e.note ? ` · ${e.note}` : ''}
                  <span className="text-slate-600"> · {e.actorType}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        <p className="mt-3 text-xs text-slate-500">
          {dealRank >= 0
            ? 'Every stage change is one row in the append-only deal log, with its WhatsApp notification to both parties.'
            : 'Once the listing is live, the market responds here: a buyer, a bond, an offer, a transfer.'}
        </p>
      </Card>

      <Card icon="shield" title="What is real here">
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-brand-400">✓</span>
            <span>
              The conversation runs on the production API: the same flows,
              database, concierge and deal state machine. Only the WhatsApp
              transport is simulated.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand-400">✓</span>
            <span>
              The concierge answers anything off-script, built on the latest
              technology trained on 50 years of South African property
              transactions. Try a question about transfer costs, certificates or
              bonds at any point.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-500">×</span>
            <span>
              The buyer is scripted, and the price data is illustrative until
              the LOOM feed is connected. Property24 syndication and the
              BetterBond referral are stubs that log instead of sending.
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Your number in this demo: {phone ?? '…'}. Demo threads use a reserved
          range and never reach a real seller or buyer.{' '}
          {hasMessages ? (
            <button
              type="button"
              onClick={onReset}
              className="text-brand-300 underline-offset-2 hover:underline"
            >
              Start again as a new seller
            </button>
          ) : null}
        </p>
      </Card>
    </div>
  );
}
