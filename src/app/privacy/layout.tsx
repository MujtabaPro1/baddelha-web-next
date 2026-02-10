import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read BADDELHA’s privacy policy to understand how we collect, use, and protect your data when you use our car marketplace services.',
  alternates: {
    canonical: 'https://baddelha.com.sa/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
