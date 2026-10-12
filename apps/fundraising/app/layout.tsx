import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

// Used for absolute OpenGraph URLs. Override with NEXT_PUBLIC_SITE_URL when
// the investor site's final domain is confirmed.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://invest.solddirect.co.za';

const TITLE = 'Sold Direct — Investor Overview · R5m Seed';
const DESCRIPTION =
  'Sold Direct runs 0%-commission private property sales on WhatsApp (qualifying path), with registered practitioners in the loop and the bank paying us as bond originator. Raising a R5m seed for 20% at a R20m pre-money valuation.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Sold Direct',
    images: [
      {
        url: '/cape-town-hero.jpg',
        width: 1920,
        height: 1280,
        alt: 'Homes above the bay in Camps Bay, Cape Town',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/cape-town-hero.jpg'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZA">
      <body className="min-h-screen bg-navy text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
