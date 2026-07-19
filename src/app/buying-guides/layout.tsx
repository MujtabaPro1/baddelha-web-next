import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buying Guides',
  description:
    'Expert tips and a step-by-step guide to buying a car in Saudi Arabia with BADDELHA: get a free online valuation, book a free inspection, and receive your offer in 30 minutes.',
  openGraph: {
    title: 'Buying Guides',
    description:
      'Expert tips and a step-by-step guide to buying a car in Saudi Arabia with BADDELHA: get a free online valuation, book a free inspection, and receive your offer in 30 minutes.',
    url: 'https://www.baddelha.com.sa/buying-guides',
    siteName: 'BADDELHA',
    type: 'article',
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
    title: 'Buying Guides',
    description:
      'Expert tips and a step-by-step guide to buying a car in Saudi Arabia with BADDELHA: get a free online valuation, book a free inspection, and receive your offer in 30 minutes.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://www.baddelha.com.sa/buying-guides',
  },
};

export default function BuyingGuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
