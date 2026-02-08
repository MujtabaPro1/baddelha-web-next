
import { LanguageProvider } from '../contexts/LanguageContext';
import { UserTypeProvider } from '../contexts/UserTypeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from '../components/ui/toaster';
import UserTypePopupWrapper from '../components/UserTypePopupWrapper';
import type { Metadata } from 'next';
import './globals.scss';
import ReCaptchaProvider from '../components/ReCaptchaProvider'

// Preload critical fonts
const fontPreload = [
  { rel: 'preload', href: '/fonts/sf-pro-display.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const },
];

export const metadata: Metadata = {
  title: {
    default: 'BADDELHA - Buy, Sell & Trade Cars in Saudi Arabia',
    template: '%s | BADDELHA',
  },
  description: 'BADDELHA is Saudi Arabia\'s premier car marketplace. Get instant car valuations, competitive trade-in offers, and hassle-free buying and selling experience. Bank-approved valuations available.',
  keywords: ['car marketplace', 'buy cars Saudi Arabia', 'sell cars', 'trade-in cars', 'car valuation', 'used cars', 'new cars', 'BADDELHA', 'بدلها', 'سيارات للبيع', 'تقييم السيارات'],
  authors: [{ name: 'BADDELHA' }],
  creator: 'BADDELHA',
  publisher: 'BADDELHA',
  metadataBase: new URL('https://baddelha.com.sa'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ar': '/ar',
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  },
  openGraph: {
    title: 'BADDELHA - Buy, Sell & Trade Cars in Saudi Arabia',
    description: 'Saudi Arabia\'s premier car marketplace. Get instant valuations, competitive trade-in offers, and hassle-free car buying and selling.',
    url: 'https://baddelha.com.sa',
    siteName: 'BADDELHA',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    type: 'website',
    images: [{
      url: '/logo_whatsapp.png',
      width: 1200,
      height: 630,
      alt: 'BADDELHA - Premium Car Marketplace in Saudi Arabia',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BADDELHA - Buy, Sell & Trade Cars in Saudi Arabia',
    description: 'Saudi Arabia\'s premier car marketplace. Get instant valuations and hassle-free car trading.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BADDELHA',
  alternateName: 'بدلها',
  url: 'https://baddelha.com.sa',
  logo: 'https://baddelha.com.sa/logo.png',
  sameAs: [
    'https://www.facebook.com/baddelha',
    'https://www.instagram.com/baddelha',
    'https://www.linkedin.com/company/baddelha',
    'https://www.tiktok.com/@baddelha',
    'https://www.snapchat.com/add/baddelha',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+966-92-00-32590',
    contactType: 'customer service',
    areaServed: 'SA',
    availableLanguage: ['English', 'Arabic'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SA',
    addressLocality: 'Riyadh',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BADDELHA',
  alternateName: 'بدلها',
  url: 'https://baddelha.com.sa',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://baddelha.com.sa/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'BADDELHA',
  image: 'https://baddelha.com.sa/logo.png',
  '@id': 'https://baddelha.com.sa',
  url: 'https://baddelha.com.sa',
  telephone: '+966-92-00-32590',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SA',
    addressLocality: 'Riyadh',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.7136,
    longitude: 46.6753,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '09:00',
    closes: '18:00',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Saudi Arabia',
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
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F0ETQSCQCZ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F0ETQSCQCZ');`
          }}
        />
        {/* End Google tag */}
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
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
          <UserTypeProvider>
            <div className="min-h-screen bg-white">
              <Navbar />
              <ReCaptchaProvider>
                <main>{children}</main>
              </ReCaptchaProvider>
              <Footer />
              <Toaster />
              <UserTypePopupWrapper />
            </div>
          </UserTypeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}