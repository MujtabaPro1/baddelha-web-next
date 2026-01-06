
import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from '../components/ui/toaster';
import type { Metadata } from 'next';
import './globals.css';
import ReCaptchaProvider from '../components/ReCaptchaProvider'

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
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K45BSKB5');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K45BSKB5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <LanguageProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <ReCaptchaProvider>
              <main>{children}</main>
            </ReCaptchaProvider>
            <Footer />
            <Toaster />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}