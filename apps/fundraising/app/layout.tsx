import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

// Used for absolute OpenGraph URLs. Override with NEXT_PUBLIC_SITE_URL when
// the investor site's final domain is confirmed.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://invest.solddirect.co.za';

const TITLE = 'Sold Direct — Investor Overview · R5m Seed';
const DESCRIPTION =
  'Sold Direct manages private property sales over WhatsApp at 0% commission to the seller on the qualifying path, with registered practitioners involved and revenue from bond origination paid by the lender. Seed round: R5m for 20% at a R20m pre-money valuation.';

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
      <body className="min-h-screen bg-navy text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
