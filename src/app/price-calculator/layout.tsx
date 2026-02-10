import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Car Price Calculator',
  description:
    'Estimate your car price and financing options with BADDELHA’s price calculator. Explore costs, features, and monthly payments in Saudi Arabia.',
  alternates: {
    canonical: 'https://baddelha.com.sa/price-calculator',
  },
};

export default function PriceCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
