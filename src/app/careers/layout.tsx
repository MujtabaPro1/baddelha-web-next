import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers at BADDELHA',
  description:
    'Explore open positions at BADDELHA and join the team building the future of car buying, selling, and trading in Saudi Arabia.',
  openGraph: {
    title: 'Careers at BADDELHA',
    description:
      'Explore open positions at BADDELHA and join the team building the future of car buying, selling, and trading in Saudi Arabia.',
    url: 'https://www.baddelha.com.sa/careers',
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
    title: 'Careers at BADDELHA',
    description:
      'Explore open positions at BADDELHA and join the team building the future of car buying, selling, and trading in Saudi Arabia.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://www.baddelha.com.sa/careers',
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
