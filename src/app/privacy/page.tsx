'use client';
import React, { useEffect, useState } from 'react';
import { fetchPageContent } from '../../services/pageContentService';
import { useLanguage } from '../../contexts/LanguageContext';

const Privacy: React.FC = () => {
  const [contentEn, setContentEn] = useState<string>('');
  const [contentAr, setContentAr] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  useEffect(() => {
    const getPrivacyPolicy = async () => {
      try {
        setIsLoading(true);   
        const response: any = await fetchPageContent('privacy-policy');
        
        if (response) {
          setContentEn(response.content_en || '');
          setContentAr(response.content_ar || '');
          setLastUpdated(response.updatedAt || '');
        } else {
          setError(response.message || 'Failed to load Privacy Policy content');
        }
      } catch (err) {
        setError('An error occurred while fetching the Privacy Policy');
        console.error('Privacy Policy fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getPrivacyPolicy();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 mt-[60px] max-w-5xl overflow-y-auto">
   <div className="p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
                    {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6 text-gray-600">
            {lastUpdated && (
              <p className="mb-6 text-gray-500 italic">
                Last updated: {lastUpdated}
              </p>
            )}
            
            <div dangerouslySetInnerHTML={{ __html: language === 'ar' ? contentAr : contentEn }} />
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} BADDELHA. All rights reserved.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Privacy;