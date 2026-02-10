import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About BADDELHA',
  description:
    'Learn about BADDELHA and how we make buying, selling, and trading cars in Saudi Arabia faster, smarter, and more transparent.',
  alternates: {
    canonical: 'https://baddelha.com.sa/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
