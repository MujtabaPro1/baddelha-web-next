
import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from '../components/ui/toaster';
import type { Metadata } from 'next';
import './globals.css';

// Preload critical fonts
const fontPreload = [
  { rel: 'preload', href: '/fonts/sf-pro-display.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const },
];

export const metadata: Metadata = {
  title: 'BADDELHA - Premium Car Marketplace',
  description: 'Find premium cars for sale in Saudi Arabia',
  metadataBase: new URL('https://baddelha-web-next.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  openGraph: {
    title: 'BADDELHA - Premium Car Marketplace',
    description: 'Find premium cars for sale in Saudi Arabia',
    url: 'https://baddelha-web-next.vercel.app',
    siteName: 'BADDELHA',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: '/logo.png',
      width: 800,
      height: 600,
      alt: 'BADDELHA Logo',
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical assets */}
        <link rel="preload" href="/bg.jpeg" as="image" />
        {fontPreload.map((attrs, i) => (
          <link key={i} {...attrs} />
        ))}
        {/* Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LanguageProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}