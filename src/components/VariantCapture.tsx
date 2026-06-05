'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VariantCapture() {
    const searchParams: any = useSearchParams();

    useEffect(() => {
        const variant = searchParams?.get('variant');
        if (variant) {
            localStorage.setItem('ab_variant', variant);
        }
    }, [searchParams]);

    return null;
}
