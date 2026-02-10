import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buying Guides',
  description:
    'Learn about BADDELHA and how we make buying, selling, and trading cars in Saudi Arabia faster, smarter, and more transparent.',
  alternates: {
    canonical: 'https://baddelha.com.sa/buying-guides',
  },
};

export default function BuyingGuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
