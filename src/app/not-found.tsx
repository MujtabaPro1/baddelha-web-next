'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Note: Next.js automatically sets the status code to 404 for this page

export default function NotFound() {
  const { language } = useLanguage();

  // Log 404 errors for analytics (optional)
  useEffect(() => {
    // You could implement analytics tracking here
    console.log('404 page visited:', window.location.pathname);
  }, []);

  const translations = {
    en: {
      title: 'Page Not Found',
      description: 'The page you are looking for doesn\'t exist or has been moved.',
      goHome: 'Go to Homepage',
      exploreCars: 'Explore Cars',
      contactUs: 'Contact Us',
    },
    ar: {
      title: 'الصفحة غير موجودة',
      description: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      goHome: 'الذهاب إلى الصفحة الرئيسية',
      exploreCars: 'استكشاف السيارات',
      contactUs: 'اتصل بنا',
    },
  };

  const content = translations[language as keyof typeof translations];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-4 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">{content.title}</h2>
          <p className="text-gray-600">{content.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            {content.goHome}
          </Link>
          <Link 
            href="/buy" 
            className="px-6 py-3 border border-black text-black rounded-md hover:bg-gray-100 transition-colors"
          >
            {content.exploreCars}
          </Link>
          <Link 
            href="/contactus" 
            className="px-6 py-3 border border-black text-black rounded-md hover:bg-gray-100 transition-colors"
          >
            {content.contactUs}
          </Link>
        </div>
      </div>
    </div>
  );
}
