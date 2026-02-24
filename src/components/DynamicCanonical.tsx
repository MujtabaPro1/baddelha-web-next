'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function DynamicCanonical() {
  const pathname = usePathname();
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    const baseUrl = 'https://badelha.com.sa';
    const path = pathname === '/' ? '' : pathname;
    setCanonicalUrl(`${baseUrl}${path}`);
  }, [pathname]);

  return canonicalUrl ? (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <Script id="update-canonical" strategy="afterInteractive">
        {`
          // Ensure canonical is in head, not body
          if (document.querySelector('link[rel="canonical"]')?.parentElement?.tagName !== 'HEAD') {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = '${canonicalUrl}';
            document.head.appendChild(canonical);
          }
        `}
      </Script>
    </>
  ) : null;
}
