import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buying Guides',
  description:
    'Learn about BADDELHA and how we make buying, selling, and trading cars in Saudi Arabia faster, smarter, and more transparent.',
  openGraph: {
    title: 'Buying Guides',
    description:
      'Learn about BADDELHA and how we make buying, selling, and trading cars in Saudi Arabia faster, smarter, and more transparent.',
    url: 'https://baddelha.com.sa/buying-guides',
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
      'Learn about BADDELHA and how we make buying, selling, and trading cars in Saudi Arabia faster, smarter, and more transparent.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/buying-guides',
  },
};

export default function BuyingGuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
