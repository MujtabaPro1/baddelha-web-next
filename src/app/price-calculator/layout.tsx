import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Car Price Calculator',
  description:
    'Estimate your car price and financing options with BADDELHA’s price calculator. Explore costs, features, and monthly payments in Saudi Arabia.',
  openGraph: {
    title: 'Car Price Calculator',
    description:
      'Estimate your car price and financing options with BADDELHA’s price calculator. Explore costs, features, and monthly payments in Saudi Arabia.',
    url: 'https://baddelha.com.sa/price-calculator',
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
    title: 'Car Price Calculator',
    description:
      'Estimate your car price and financing options with BADDELHA’s price calculator. Explore costs, features, and monthly payments in Saudi Arabia.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/price-calculator',
  },
};

export default function PriceCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
