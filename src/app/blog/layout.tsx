import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Read BADDELHA insights on car valuation, inspections, and the Saudi car market. Tips to sell your car faster and get a fair price.',
  alternates: {
    canonical: 'https://baddelha.com.sa/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
