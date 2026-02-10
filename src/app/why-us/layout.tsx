import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why BADDELHA',
  description:
    'Discover why BADDELHA is trusted for professional inspection, fair market valuation, and hassle-free car selling and trade-ins in Saudi Arabia.',
  alternates: {
    canonical: 'https://baddelha.com.sa/why-us',
  },
};

export default function WhyUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
