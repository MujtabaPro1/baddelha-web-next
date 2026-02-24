'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CanonicalTag() {
  const pathname = usePathname();
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    // Create the canonical URL based on the current path
    const baseUrl = 'https://badelha.com.sa';
    const path = pathname === '/' ? '' : pathname;
    setCanonicalUrl(`${baseUrl}${path}`);
  }, [pathname]);

  return canonicalUrl ? (
    <link rel="canonical" href={canonicalUrl} />
  ) : null;
}
