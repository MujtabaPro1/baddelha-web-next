import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Read BADDELHA insights on car valuation, inspections, and the Saudi car market. Tips to sell your car faster and get a fair price.',
  openGraph: {
    title: 'Blog',
    description:
      'Read BADDELHA insights on car valuation, inspections, and the Saudi car market. Tips to sell your car faster and get a fair price.',
    url: 'https://baddelha.com.sa/blog',
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
    title: 'Blog',
    description:
      'Read BADDELHA insights on car valuation, inspections, and the Saudi car market. Tips to sell your car faster and get a fair price.',
    images: ['/logo_whatsapp.png'],
  },
  alternates: {
    canonical: 'https://baddelha.com.sa/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
