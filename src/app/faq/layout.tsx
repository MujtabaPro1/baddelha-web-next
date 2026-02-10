import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Find answers to common questions about BADDELHA services, car inspection, valuation process, selling, exchanging, and auctions in Saudi Arabia.',
  openGraph: {
    title: 'FAQ',
    description:
      'Find answers to common questions about BADDELHA services, car inspection, valuation process, selling, exchanging, and auctions in Saudi Arabia.',
    url: 'https://baddelha.com.sa/faq',
    siteName: 'BADDELHA',
    type: 'website',
    images: [
      {
        url: '/logo_whatsapp.png',
        width: 1200,
        height: 630,
        alt: 'BADDELHA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ',
    description:
      'Find answers to common questions about BADDELHA services, car inspection, valuation process, selling, exchanging, and auctions in Saudi Arabia.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
