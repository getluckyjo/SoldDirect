import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { HERO } from '@/content/site';
import './globals.css';

// Used for absolute OpenGraph URLs. Override with NEXT_PUBLIC_SITE_URL when
// the production domain is confirmed.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.solddirect.co.za';

// The preview image (public/og-image.jpg) is a static 1200×900 card: logo,
// hero heading and the 0% line over the hero photo, with the text kept in
// the middle band so LinkedIn's 1.91:1 crop keeps all of it. Regenerate it
// when the heading changes.
// Link previews (WhatsApp, LinkedIn, email) mirror the hero. Previews cannot
// show the 0%* tooltip, so the qualifying path is stated inline.
const TITLE = `Sold Direct — ${HERO.title}`;
const DESCRIPTION =
  'Private property sales, on WhatsApp, at 0% commission to the seller on the qualifying path. Built for Cape Town, from the first listing to registration.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Sold Direct',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 900,
        alt: 'Sold Direct: Sell your home direct. Private property sales, on WhatsApp, at 0% commission to the seller.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZA">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
