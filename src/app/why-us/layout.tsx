import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why BADDELHA',
  description:
    'Discover why BADDELHA is trusted for professional inspection, fair market valuation, and hassle-free car selling and trade-ins in Saudi Arabia.',
  openGraph: {
    title: 'Why BADDELHA',
    description:
      'Discover why BADDELHA is trusted for professional inspection, fair market valuation, and hassle-free car selling and trade-ins in Saudi Arabia.',
    url: 'https://baddelha.com.sa/why-us',
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
    title: 'Why BADDELHA',
    description:
      'Discover why BADDELHA is trusted for professional inspection, fair market valuation, and hassle-free car selling and trade-ins in Saudi Arabia.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/why-us',
  },
};

export default function WhyUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
