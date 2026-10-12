'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { WaText } from './wa-text';
import type { DemoMessage, Divider, ReplyOption, ReplyOptions } from './types';

export interface Starter {
  label: string;
  text: string;
  replyId?: string;
}

/** A photo chosen from the gallery, waiting in the picker. */
export interface PickedPhoto {
  id: string;
  url: string;
  file: File;
  /** Unticked photos stay out of the send. */
  keep: boolean;
}

/** The gallery picker's state and actions, owned by the page. */
export interface MediaPicker {
  items: PickedPhoto[];
  sending: boolean;
  add: (files: File[]) => void;
  toggle: (id: string) => void;
  clear: () => void;
  send: () => void;
}

interface PhoneProps {
  messages: DemoMessage[];
  dividers: Divider[];
  liveOptions?: ReplyOptions;
  busy: boolean;
  starters: Starter[];
  onSend: (text: string, replyId?: string) => void;
  picker: MediaPicker;
}

/**
 * WhatsApp's multi-select media preview: pick several from the gallery,
 * flick through them, untick the weak ones, send the best. Sellers take
 * photos one at a time and choose later — the picker is that moment.
 */
function Picker({
  picker,
  onAddMore,
}: {
  picker: MediaPicker;
  onAddMore: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const items = picker.items;
  const shown = items[Math.min(current, items.length - 1)];
  const kept = items.filter((i) => i.keep).length;
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-[#0b141a] text-white">
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <button
          type="button"
          aria-label="Close"
          onClick={picker.clear}
          disabled={picker.sending}
          className="text-2xl leading-none"
        >
          ×
        </button>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold">
            Choose your best photos
          </div>
          <div className="text-[12px] text-white/60">
            {kept} of {items.length} selected · tap a photo to leave it out
          </div>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
        {shown ? (
          <button
            type="button"
            onClick={() => picker.toggle(shown.id)}
            className="h-full w-full"
            aria-label={
              shown.keep ? 'Leave this photo out' : 'Include this photo'
            }
          >
            <img
              src={shown.url}
              alt=""
              className={`h-full w-full object-contain ${shown.keep ? '' : 'opacity-35'}`}
            />
          </button>
        ) : null}
        {shown && !shown.keep ? (
          <span className="pointer-events-none absolute rounded-full bg-black/70 px-3 py-1 text-[13px] font-medium">
            Left out — tap to include
          </span>
        ) : null}
      </div>
      <div className="flex gap-2 overflow-x-auto px-3 py-3">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Photo ${i + 1}${it.keep ? '' : ', left out'}`}
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md ${
              it === shown ? 'ring-2 ring-[#00a884]' : ''
            }`}
          >
            <img
              src={it.url}
              alt=""
              className={`h-full w-full object-cover ${it.keep ? '' : 'opacity-35'}`}
            />
            <span
              className={`absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                it.keep ? 'bg-[#00a884] text-white' : 'border border-white/70'
              }`}
              aria-hidden
            >
              {it.keep ? '✓' : ''}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={onAddMore}
          disabled={picker.sending || items.length >= 10}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-dashed border-white/40 text-2xl text-white/70 disabled:opacity-40"
          aria-label="Add more photos"
        >
          +
        </button>
      </div>
      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        <span className="text-[12px] text-white/60">
          {items.length >= 10 ? 'Ten at a time' : 'Add up to ten'}
        </span>
        <button
          type="button"
          onClick={picker.send}
          disabled={picker.sending || kept === 0}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#00a884] text-white disabled:opacity-50"
          aria-label={`Send ${kept} photos`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path d="M3 11.5 21 3l-5 18-4-7-9-2.5Z" fill="currentColor" />
          </svg>
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-[#00a884]">
            {kept}
          </span>
        </button>
      </div>
    </div>
  );
}

function clock(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function nowClock(): string {
  return clock(new Date().toISOString());
}

/* ── Icons (24-unit, drawn to read like the WhatsApp client's) ─────────── */

function Ticks({ pending }: { pending?: boolean }) {
  if (pending) {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M8 4.5V8l2.3 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 18 12"
      className="h-3 w-[18px] text-[#53bdeb]"
      aria-hidden
    >
      <path
        d="M1.5 6.5 5 10l6.5-7M8 10l7.5-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M10 9V5l-7 7 7 7v-4c5 0 8.5 1.5 11 5-1-5-4-10-11-11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Verified() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="m12 1.5 2.4 1.9 3-.5 1.2 2.8 2.8 1.2-.5 3 1.9 2.4-1.9 2.4.5 3-2.8 1.2-1.2 2.8-3-.5L12 22.5l-2.4-1.9-3 .5-1.2-2.8-2.8-1.2.5-3L1.5 12l1.9-2.4-.5-3 2.8-1.2 1.2-2.8 3 .5Z"
        fill="#00a884"
      />
      <path
        d="m8.5 12.2 2.3 2.3 4.7-4.9"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────── */

function Pill({
  children,
  tone = 'grey',
}: {
  children: ReactNode;
  tone?: 'grey' | 'notice';
}) {
  return (
    <div className="my-2 flex justify-center px-6">
      <span
        className={`rounded-lg px-3 py-1.5 text-center text-[12.5px] leading-snug shadow-[0_1px_0.5px_rgba(11,20,26,.13)] ${
          tone === 'notice'
            ? 'bg-[#ffeecd] text-[#54656f]'
            : 'bg-white/95 text-[#54656f] uppercase tracking-wide'
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function Tail({ me }: { me: boolean }) {
  return (
    <svg
      viewBox="0 0 8 13"
      className={`absolute top-0 h-[13px] w-2 ${me ? '-right-2 text-[#d9fdd3]' : '-left-2 text-white'}`}
      aria-hidden
    >
      <path d={me ? 'M0 0h8L0 13V0Z' : 'M8 0H0l8 13V0Z'} fill="currentColor" />
    </svg>
  );
}

function Buttons({
  options,
  active,
  onPick,
}: {
  options: Extract<ReplyOptions, { kind: 'buttons' }>;
  active: boolean;
  onPick: (o: ReplyOption) => void;
}) {
  return (
    <div
      className={`mt-0.5 flex w-full flex-col gap-0.5 ${active ? '' : 'opacity-55'}`}
    >
      {options.options.map((o) => (
        <button
          key={o.id}
          type="button"
          disabled={!active}
          onClick={() => onPick(o)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-[14px] font-medium text-[#027eb5] shadow-[0_1px_0.5px_rgba(11,20,26,.13)] active:bg-[#f0f2f5]"
        >
          <ReplyIcon />
          {o.title}
        </button>
      ))}
    </div>
  );
}

function Sheet({
  options,
  onClose,
  onPick,
}: {
  options: Extract<ReplyOptions, { kind: 'list' }>;
  onClose: () => void;
  onPick: (o: ReplyOption) => void;
}) {
  const [selected, setSelected] = useState<ReplyOption | null>(null);
  return (
    <div
      className="absolute inset-0 z-20 flex items-end bg-black/45"
      onClick={onClose}
      role="dialog"
      aria-label={options.button ?? 'Choose'}
    >
      <div
        className="flex max-h-[82%] w-full flex-col rounded-t-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-3 pb-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-[#54656f]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="text-[16px] font-semibold text-[#111b21]">
            {options.button ?? 'Choose'}
          </span>
        </div>
        <div className="overflow-y-auto px-1 pb-2">
          {options.sections.map((section, si) => (
            <div key={si} className="mb-1">
              {section.title ? (
                <div className="px-4 pb-1 pt-3 text-[13px] font-semibold text-[#008069]">
                  {section.title}
                </div>
              ) : null}
              {section.rows.map((row) => {
                const on = selected?.id === row.id;
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelected(row)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#f0f2f5]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] text-[#111b21]">
                        {row.title}
                      </span>
                      {row.description ? (
                        <span className="block text-[13px] text-[#667781]">
                          {row.description}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        on ? 'border-[#00a884]' : 'border-[#8696a0]'
                      }`}
                    >
                      {on ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#00a884]" />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="border-t border-black/5 p-3">
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onPick(selected)}
            className="w-full rounded-full bg-[#00a884] py-2.5 text-[15px] font-semibold text-white disabled:bg-[#cfd8dc]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="mb-1 flex justify-start px-2">
      <div className="relative rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,.13)]">
        <Tail me={false} />
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-[#8696a0]"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ── The phone ────────────────────────────────────────────────────────── */

export function Phone({
  messages,
  dividers,
  liveOptions,
  busy,
  starters,
  onSend,
  picker,
}: PhoneProps) {
  const [draft, setDraft] = useState('');
  const [sheet, setSheet] = useState<Extract<
    ReplyOptions,
    { kind: 'list' }
  > | null>(null);
  // Set after mount: a server-rendered clock would never match the client's.
  const [time, setTime] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTime(nowClock());
    const t = setInterval(() => setTime(nowClock()), 15_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, dividers]);

  const lastOutbound = (() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].direction === 'outbound') return i;
    }
    return -1;
  })();

  function pick(o: ReplyOption) {
    setSheet(null);
    onSend(o.title, o.id);
  }

  function submit() {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft('');
    onSend(text);
  }

  const items: ReactNode[] = [];
  messages.forEach((m, i) => {
    const divider = dividers.find((d) => d.beforeIndex === i);
    if (i === 0) {
      items.push(
        <Pill key="today">{divider ? divider.label : 'Today'}</Pill>,
        <Pill key="e2e" tone="notice">
          🔒 Messages and calls are end-to-end encrypted. Only people in this
          chat can read, listen to or share them.
        </Pill>,
      );
    } else if (divider) {
      items.push(<Pill key={`div-${i}`}>{divider.label}</Pill>);
    }
    const me = m.direction === 'inbound';
    const first =
      i === 0 || messages[i - 1].direction !== m.direction || !!divider;
    const isImage = m.type === 'image';
    const liveHere = !me && i === lastOutbound && !!m.options && !busy;
    items.push(
      <div
        key={`m-${i}`}
        className={`flex flex-col px-2 ${me ? 'items-end' : 'items-start'} ${first ? 'mt-2' : 'mt-0.5'}`}
      >
        <div
          className={`relative max-w-[84%] rounded-lg text-[14.2px] leading-[19px] text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,.13)] ${
            me ? 'bg-[#d9fdd3]' : 'bg-white'
          } ${first ? (me ? 'rounded-tr-none' : 'rounded-tl-none') : ''} ${
            isImage ? 'p-1' : 'px-2 pb-1.5 pt-1.5'
          }`}
        >
          {first ? <Tail me={me} /> : null}
          {isImage ? (
            <div>
              {m.localSrc || m.mediaId ? (
                <img
                  src={
                    m.localSrc ??
                    `/api/demo/media/${encodeURIComponent(m.mediaId ?? '')}`
                  }
                  alt="Photo"
                  className="block max-h-64 w-56 rounded-md object-cover"
                  onError={(e) => {
                    e.currentTarget.replaceWith(
                      Object.assign(document.createElement('div'), {
                        className:
                          'flex h-32 w-56 items-center justify-center rounded-md bg-[#e9edef] text-[12px] text-[#667781]',
                        textContent: 'Photo no longer available',
                      }),
                    );
                  }}
                />
              ) : (
                <div className="flex h-32 w-56 items-center justify-center rounded-md bg-[#e9edef] text-[12px] text-[#667781]">
                  Photo
                </div>
              )}
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/35 px-1.5 py-0.5 text-[11px] text-white">
                {clock(m.createdAt)}
                {me ? <Ticks pending={m.pending} /> : null}
              </span>
            </div>
          ) : (
            <>
              {m.options?.header ? (
                <div className="mb-1 font-semibold">{m.options.header}</div>
              ) : null}
              <WaText text={m.body} />
              <span className="float-right ml-3 mt-1.5 flex items-center gap-1 text-[11px] text-[#667781]">
                {clock(m.createdAt)}
                {me ? <Ticks pending={m.pending} /> : null}
              </span>
              {m.options?.footer ? (
                <div className="clear-both pt-1 text-[12.5px] text-[#667781]">
                  {m.options.footer}
                </div>
              ) : null}
              {!me && m.options?.kind === 'list' ? (
                <div className="clear-both mt-2 border-t border-black/10 pt-1">
                  <button
                    type="button"
                    disabled={!liveHere}
                    onClick={() =>
                      m.options?.kind === 'list' ? setSheet(m.options) : null
                    }
                    className={`flex w-full items-center justify-center gap-1.5 py-1.5 text-[14px] font-medium text-[#027eb5] ${liveHere ? '' : 'opacity-55'}`}
                  >
                    <ListIcon />
                    {m.options.button ?? 'Choose'}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
        {!me && m.options?.kind === 'buttons' ? (
          <div className="w-[84%]">
            <Buttons options={m.options} active={liveHere} onPick={pick} />
          </div>
        ) : null}
      </div>,
    );
  });

  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[3rem] bg-[#0a0a0a] p-[10px] shadow-2xl ring-1 ring-white/10">
      <div className="relative flex h-[min(78vh,780px)] flex-col overflow-hidden rounded-[2.5rem] bg-[#efeae2] text-[#111b21]">
        {picker.items.length > 0 ? (
          <Picker picker={picker} onAddMore={() => fileRef.current?.click()} />
        ) : null}
        {/* status bar */}
        <div className="flex items-center justify-between bg-[#f6f6f6] px-7 pb-1 pt-3 text-[12px] font-semibold text-[#111b21]">
          <span>{time}</span>
          <span className="flex items-center gap-1.5" aria-hidden>
            <svg viewBox="0 0 16 12" className="h-3 w-4">
              <path
                d="M1 9h2v3H1zM5 6h2v6H5zM9 3h2v9H9zM13 0h2v12h-2z"
                fill="currentColor"
              />
            </svg>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
              <path
                d="M12 20 2 9a14 14 0 0 1 20 0L12 20Z"
                fill="currentColor"
              />
            </svg>
            <svg viewBox="0 0 26 12" className="h-3 w-6">
              <rect
                x="1"
                y="1"
                width="21"
                height="10"
                rx="2"
                fill="none"
                stroke="currentColor"
              />
              <rect
                x="2.5"
                y="2.5"
                width="16"
                height="7"
                rx="1"
                fill="currentColor"
              />
              <path d="M23.5 4v4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </div>

        {/* chat header */}
        <div className="flex items-center gap-2 border-b border-black/5 bg-[#f6f6f6] px-2 py-1.5">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-[#111b21]"
            aria-hidden
          >
            <path
              d="m15 5-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#36B44A] text-[13px] font-bold text-white">
            SD
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[16px] font-semibold leading-tight">
              Sold Direct <Verified />
            </div>
            <div className="text-[12.5px] leading-tight text-[#667781]">
              {busy ? 'typing…' : 'online'}
            </div>
          </div>
          <span
            className="flex items-center gap-4 pr-2 text-[#111b21]"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm13 3 5-3v10l-5-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <circle cx="12" cy="5" r="1.8" fill="currentColor" />
              <circle cx="12" cy="12" r="1.8" fill="currentColor" />
              <circle cx="12" cy="19" r="1.8" fill="currentColor" />
            </svg>
          </span>
        </div>

        {/* thread */}
        <div
          ref={threadRef}
          role="log"
          aria-live="polite"
          className="relative flex-1 overflow-y-auto pb-3"
          style={{
            backgroundImage:
              'radial-gradient(rgba(0,0,0,.045) 1px, transparent 1px), radial-gradient(rgba(0,0,0,.03) 1px, transparent 1px)',
            backgroundSize: '26px 26px, 26px 26px',
            backgroundPosition: '0 0, 13px 13px',
          }}
        >
          {messages.length === 0 ? (
            <>
              <Pill>Today</Pill>
              <Pill tone="notice">
                🔒 Messages and calls are end-to-end encrypted. Only people in
                this chat can read, listen to or share them.
              </Pill>
              <div className="mx-6 mt-8 rounded-xl bg-white/90 p-4 text-center text-[13px] leading-relaxed text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,.13)]">
                <div className="mb-1 text-[15px] font-semibold text-[#111b21]">
                  Sold Direct
                </div>
                Business account · Cape Town property, sold direct over
                WhatsApp. Say hi, or tap a quick start below.
              </div>
            </>
          ) : (
            items
          )}
          {busy ? <TypingBubble /> : null}
        </div>

        {/* quick starts on an empty thread */}
        {messages.length === 0 && starters.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto bg-[#efeae2] px-2 pb-1.5">
            {starters.map((s) => (
              <button
                key={s.label}
                type="button"
                disabled={busy}
                onClick={() => onSend(s.text, s.replyId)}
                className="shrink-0 rounded-full border border-[#00a884]/50 bg-white px-3 py-1.5 text-[13px] font-medium text-[#008069] shadow-sm active:bg-[#f0f2f5]"
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* composer */}
        <form
          className="flex items-end gap-1.5 bg-[#f0f2f5] px-1.5 py-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 text-[#8696a0]"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M8.5 14.5a4.5 4.5 0 0 0 7 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message"
              aria-label="Message"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#111b21] outline-none placeholder:text-[#8696a0]"
            />
            <button
              type="button"
              aria-label="Attach photos"
              onClick={() => fileRef.current?.click()}
              className="shrink-0 text-[#8696a0]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <path
                  d="m16.5 6.5-7.8 7.8a2.2 2.2 0 0 0 3.1 3.1l8.1-8.1a4.2 4.2 0 0 0-6-6L5.3 12a6.2 6.2 0 0 0 8.8 8.8l6.4-6.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Camera"
              onClick={() => fileRef.current?.click()}
              className="shrink-0 text-[#8696a0]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <path
                  d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="3.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            aria-label={draft.trim() ? 'Send' : 'Voice message'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white"
          >
            {draft.trim() ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path d="M3 11.5 21 3l-5 18-4-7-9-2.5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <rect
                  x="9"
                  y="3"
                  width="6"
                  height="11"
                  rx="3"
                  fill="currentColor"
                />
                <path
                  d="M6 11a6 6 0 0 0 12 0M12 17v4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                picker.add(Array.from(e.target.files));
              }
              e.target.value = '';
            }}
          />
        </form>

        {sheet ? (
          <Sheet options={sheet} onClose={() => setSheet(null)} onPick={pick} />
        ) : null}
        {liveOptions ? null : null}
      </div>
    </div>
  );
}
