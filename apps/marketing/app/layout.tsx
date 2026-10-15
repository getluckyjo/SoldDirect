import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { HERO } from '@/content/site';
import './globals.css';

// Used for absolute OpenGraph URLs. Override with NEXT_PUBLIC_SITE_URL when
// the production domain is confirmed.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.solddirect.co.za';

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
        url: '/cape-town-aerial-hero.jpg',
        width: 2400,
        height: 1800,
        alt: 'Aerial view of Green Point and the Atlantic coast beneath a tablecloth cloud on Table Mountain, Cape Town',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/cape-town-aerial-hero.jpg'],
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
