'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JOURNEY, virtualDateLabel, type JourneyStepId } from './journey-plan';
import type { DemoMessage, DemoState, Divider, ThreadResponse } from './types';

const LS_PHONE = 'sd_try_phone';
const metaKey = (phone: string) => `sd_try_meta:${phone}`;

interface SessionMeta {
  startedAt: string;
  dividers: Divider[];
  issued: JourneyStepId[];
}

function newPhone(): string {
  return `+2700${String(Math.floor(Math.random() * 1e7)).padStart(7, '0')}`;
}

function readMeta(phone: string): SessionMeta {
  try {
    const raw = localStorage.getItem(metaKey(phone));
    if (raw) return JSON.parse(raw) as SessionMeta;
  } catch {
    // Browser storage can be unavailable; a fresh meta is fine.
  }
  return { startedAt: new Date().toISOString(), dividers: [], issued: [] };
}

function writeMeta(phone: string, meta: SessionMeta): void {
  try {
    localStorage.setItem(metaKey(phone), JSON.stringify(meta));
  } catch {
    // Ignore: the session still works for this page load.
  }
}

export class DemoApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/demo/${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let code = `http_${res.status}`;
    try {
      code = ((await res.json()) as { error?: string }).error ?? code;
    } catch {
      // non-JSON error body
    }
    throw new DemoApiError(code, res.status);
  }
  return (await res.json()) as T;
}

/**
 * One investor's session with the live simulator: the thread, the server's
 * view of the seller (estimate, draft, listing, deal), and the local
 * bookkeeping that makes the journey legible (virtual-date pills, which
 * journey steps were issued).
 */
export function useDemoSession() {
  const [phone, setPhone] = useState<string | null>(null);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [state, setState] = useState<DemoState | null>(null);
  const [meta, setMeta] = useState<SessionMeta | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const busyRef = useRef(false);

  // Boot: resume the stored number or mint one.
  useEffect(() => {
    let p: string | null = null;
    try {
      p = localStorage.getItem(LS_PHONE);
    } catch {
      p = null;
    }
    if (!p) {
      p = newPhone();
      try {
        localStorage.setItem(LS_PHONE, p);
      } catch {
        // fine
      }
    }
    setPhone(p);
    setMeta(readMeta(p));
  }, []);

  const updateMeta = useCallback(
    (fn: (m: SessionMeta) => SessionMeta) => {
      if (!phone) return;
      setMeta((prev) => {
        const next = fn(prev ?? readMeta(phone));
        writeMeta(phone, next);
        return next;
      });
    },
    [phone],
  );

  const refresh = useCallback(async () => {
    if (!phone) return;
    const q = `?phone=${encodeURIComponent(phone)}`;
    const [thread, s] = await Promise.all([
      call<ThreadResponse>(`conversation${q}`),
      call<DemoState>(`state${q}`),
    ]);
    setMessages(thread.messages);
    setState(s);
    setError(null);
  }, [phone]);

  // First load + a gentle poll while idle (the API answers synchronously,
  // so this only catches anything that landed out of band).
  useEffect(() => {
    if (!phone) return;
    let cancelled = false;
    refresh()
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof DemoApiError ? e.code : 'network');
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    const timer = setInterval(() => {
      if (!busyRef.current) refresh().catch(() => {});
    }, 8000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [phone, refresh]);

  const run = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      if (busyRef.current) return undefined;
      busyRef.current = true;
      setBusy(true);
      try {
        const out = await fn();
        setError(null);
        return out;
      } catch (e: unknown) {
        setError(e instanceof DemoApiError ? e.code : 'network');
        return undefined;
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [],
  );

  /** Send a typed message, or a tapped option (label shown, id routed). */
  const send = useCallback(
    (text: string, replyId?: string) =>
      run(async () => {
        if (!phone) return;
        const body = text.trim();
        if (!body) return;
        setMessages((m) => [
          ...m,
          {
            direction: 'inbound',
            body,
            type: replyId ? 'interactive' : 'text',
            createdAt: new Date().toISOString(),
            pending: true,
          },
        ]);
        const thread = await call<ThreadResponse>('messages', {
          method: 'POST',
          body: JSON.stringify({ phone, text: body, replyId }),
        });
        setMessages(thread.messages);
        setState(
          await call<DemoState>(`state?phone=${encodeURIComponent(phone)}`),
        );
      }),
    [phone, run],
  );

  /** Send one photo (a data URL, already downscaled by the caller). */
  const sendPhoto = useCallback(
    (dataUrl: string) =>
      run(async () => {
        if (!phone) return;
        setMessages((m) => [
          ...m,
          {
            direction: 'inbound',
            body: '',
            type: 'image',
            createdAt: new Date().toISOString(),
            pending: true,
            localSrc: dataUrl,
          },
        ]);
        const thread = await call<ThreadResponse>('photo', {
          method: 'POST',
          body: JSON.stringify({ phone, dataUrl }),
        });
        setMessages(thread.messages);
        setState(
          await call<DemoState>(`state?phone=${encodeURIComponent(phone)}`),
        );
      }),
    [phone, run],
  );

  /** Let the market move: the next step of the sale lands in the chat. */
  const runJourney = useCallback(
    (step: JourneyStepId) =>
      run(async () => {
        if (!phone || !meta) return;
        const plan = JOURNEY.find((s) => s.id === step);
        const before = messages.length;
        const result = await call<ThreadResponse & { ok: boolean }>('journey', {
          method: 'POST',
          body: JSON.stringify({ phone, step }),
        });
        if (plan && result.messages.length > before) {
          const label = virtualDateLabel(new Date(meta.startedAt), plan.day);
          updateMeta((m) => ({
            ...m,
            issued: m.issued.includes(step) ? m.issued : [...m.issued, step],
            dividers:
              m.dividers.at(-1)?.label === label
                ? m.dividers
                : [...m.dividers, { beforeIndex: before, label }],
          }));
        } else {
          updateMeta((m) => ({
            ...m,
            issued: m.issued.includes(step) ? m.issued : [...m.issued, step],
          }));
        }
        setMessages(result.messages);
        setState(
          await call<DemoState>(`state?phone=${encodeURIComponent(phone)}`),
        );
      }),
    [phone, meta, messages.length, run, updateMeta],
  );

  /** A fresh number: a new seller, an empty thread. */
  const reset = useCallback(() => {
    const p = newPhone();
    try {
      localStorage.setItem(LS_PHONE, p);
    } catch {
      // fine
    }
    setMessages([]);
    setState(null);
    setError(null);
    setPhone(p);
    setMeta(readMeta(p));
  }, []);

  const liveOptions = useMemo(() => {
    const last = messages[messages.length - 1];
    return last && last.direction === 'outbound' ? last.options : undefined;
  }, [messages]);

  return {
    phone,
    messages,
    state,
    dividers: meta?.dividers ?? [],
    issued: meta?.issued ?? [],
    liveOptions,
    busy,
    error,
    loaded,
    send,
    sendPhoto,
    runJourney,
    reset,
  };
}
