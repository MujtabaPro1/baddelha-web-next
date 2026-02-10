import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Review BADDELHA terms and conditions for using our website and services, including car inspection, valuation, and marketplace processes.',
  alternates: {
    canonical: 'https://baddelha.com.sa/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
