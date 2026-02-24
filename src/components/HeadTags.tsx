'use client';

import { usePathname } from 'next/navigation';


interface HeadTagsProps {
  title?: string;
  description?: string;
}

export default function HeadTags({ title, description }: HeadTagsProps) {
  const pathname = usePathname();
  const baseUrl = 'https://badelha.com.sa';
  const canonicalUrl = `${baseUrl}${pathname === '/' ? '' : pathname}`;
  
  const pageTitle = title || 'BADDELHA - Buy, Sell & Trade Cars in Saudi Arabia';
  const pageDescription = description || 'BADDELHA is Saudi Arabia\'s premier car marketplace. Get instant car valuations, competitive trade-in offers, and hassle-free buying and selling experience.';

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />
    </>
  );
}
