import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact BADDELHA',
  description:
    'Contact BADDELHA for car valuation, inspection, selling, and trade-in support in Saudi Arabia. We are ready to help.',
  alternates: {
    canonical: 'https://baddelha.com.sa/contactus',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
