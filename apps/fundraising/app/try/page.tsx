import type { Metadata } from 'next';
import { LiveDemo } from '@/components/live/LiveDemo';

export const metadata: Metadata = {
  title: 'Sold Direct — Live demo',
  description:
    'Sell a Cape Town home over WhatsApp on the live Sold Direct pipeline: Quick Estimate, Property Report, listing, buyer, bond, offer and transfer.',
  robots: { index: false, follow: false },
};

export default function TryPage() {
  return <LiveDemo />;
}
