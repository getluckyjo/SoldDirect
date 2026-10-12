'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { ControlRoom } from './ControlRoom';
import {
  Phone,
  type MediaPicker,
  type PickedPhoto,
  type Starter,
} from './Phone';
import { useDemoSession } from './useDemoSession';

const STARTERS: Starter[] = [
  {
    label: 'What’s my home worth?',
    text: 'What’s my home worth?',
    replyId: 'PRICE',
  },
  { label: 'List my property', text: 'List my property', replyId: 'START' },
  { label: 'How does it work?', text: 'How does it work?', replyId: 'HOW' },
];

// A sample gallery of one home, the way a phone's camera roll looks after a
// walk-through: the rooms buyers want, plus one weak shot to leave out.
const SAMPLE_PHOTOS = [
  '/demo-photos/front.jpg',
  '/demo-photos/living-room.jpg',
  '/demo-photos/kitchen.jpg',
  '/demo-photos/bedroom.jpg',
  '/demo-photos/bathroom.jpg',
  '/demo-photos/garden.jpg',
  '/demo-photos/exterior.jpg',
  '/demo-photos/street.jpg',
  '/demo-photos/lounge-dark.jpg',
];

/** Downscale a photo in the browser so the upload stays small. */
async function toDataUrl(blob: Blob, max = 1280): Promise<string> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

export function LiveDemo() {
  const s = useDemoSession();
  const [picked, setPicked] = useState<PickedPhoto[]>([]);
  const [sending, setSending] = useState(false);

  const picker: MediaPicker = {
    items: picked,
    sending,
    add(files) {
      setPicked((prev) => [
        ...prev,
        ...files.slice(0, Math.max(0, 10 - prev.length)).map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: URL.createObjectURL(file),
          file,
          keep: true,
        })),
      ]);
    },
    toggle(id) {
      setPicked((prev) =>
        prev.map((p) => (p.id === id ? { ...p, keep: !p.keep } : p)),
      );
    },
    clear() {
      setPicked((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
    },
    async send() {
      const chosen = picked.filter((p) => p.keep);
      setSending(true);
      try {
        for (const p of chosen) {
          try {
            await s.sendPhoto(await toDataUrl(p.file));
          } catch {
            // A single bad file should not abort the rest.
          }
        }
      } finally {
        setSending(false);
        picker.clear();
      }
    },
  };

  /** Loads the sample home into the picker, like opening the camera roll. */
  async function openSampleGallery() {
    const files: File[] = [];
    for (const src of SAMPLE_PHOTOS) {
      try {
        const blob = await (await fetch(src)).blob();
        files.push(
          new File([blob], src.split('/').pop() ?? 'photo.jpg', {
            type: 'image/jpeg',
          }),
        );
      } catch {
        // keep going
      }
    }
    picker.add(files);
  }

  return (
    <div className="min-h-screen bg-navy text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-medium text-brand-300">
              Live demo
            </span>
          </div>
          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            ← Investor overview
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Sell a Cape Town home over WhatsApp.
          </h1>
          <p className="mt-2 text-slate-300">
            You are the seller. The phone is WhatsApp as the seller sees it; the
            panel beside it shows what the platform is doing underneath. Get a
            Quick Estimate, list the home, send photos, then let the market
            respond through to registration.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-10">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Phone
              messages={s.messages}
              dividers={s.dividers}
              liveOptions={s.liveOptions}
              busy={s.busy}
              starters={STARTERS}
              onSend={(text, replyId) => void s.send(text, replyId)}
              picker={picker}
            />
          </div>
          <ControlRoom
            state={s.state}
            issued={s.issued}
            busy={s.busy}
            loaded={s.loaded}
            error={s.error}
            phone={s.phone}
            hasMessages={s.messages.length > 0}
            onSend={(text, replyId) => void s.send(text, replyId)}
            onSamplePhotos={() => void openSampleGallery()}
            onJourney={(step) => void s.runJourney(step)}
            onReset={s.reset}
          />
        </div>
      </main>

      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 sm:px-6">
          Demonstration only. Price ranges are illustrative market guidance, not
          a valuation. Nothing entered here reaches a real seller or buyer. 0%
          commission applies on the qualifying path; otherwise a 1% facilitation
          fee applies.
        </div>
      </footer>
    </div>
  );
}
