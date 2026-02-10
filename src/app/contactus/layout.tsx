import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact BADDELHA',
  description:
    'Contact BADDELHA for car valuation, inspection, selling, and trade-in support in Saudi Arabia. We are ready to help.',
  openGraph: {
    title: 'Contact BADDELHA',
    description:
      'Contact BADDELHA for car valuation, inspection, selling, and trade-in support in Saudi Arabia. We are ready to help.',
    url: 'https://baddelha.com.sa/contactus',
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
    title: 'Contact BADDELHA',
    description:
      'Contact BADDELHA for car valuation, inspection, selling, and trade-in support in Saudi Arabia. We are ready to help.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/contactus',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
