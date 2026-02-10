import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Find answers to common questions about BADDELHA services, car inspection, valuation process, selling, exchanging, and auctions in Saudi Arabia.',
  alternates: {
    canonical: 'https://baddelha.com.sa/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
