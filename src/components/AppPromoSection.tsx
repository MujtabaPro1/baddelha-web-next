'use client';
import React from 'react';
import Image from 'next/image';
import { Smartphone, Zap, TrendingUp, Bell } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.baddelha.dealer';
const APP_STORE_URL = 'https://apps.apple.com/us/app/baddelha-dealer/id6775514099';

const AppPromoSection: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <section className="py-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-[#fdeceb] to-[#fff5f5] border border-[#f5d5d3]">
          <div className="flex flex-col md:flex-row items-center gap-6 px-6 py-8 md:py-10">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[#ee3c48] flex items-center justify-center shadow-lg">
              <Smartphone className="w-10 h-10 text-white" />
            </div>

            <div className="flex-1 text-center md:text-left rtl:md:text-right">
              <Badge className="bg-[#fbdada] text-[#ee3c48] hover:bg-[#fbdada] mb-2">
                {isAr ? 'للتجار فقط • تطبيق جديد كلياً' : 'FOR DEALERS · ALL-NEW APP'}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-2">
                {isAr ? (
                  <>سجّل كـ<span className="text-[#ee3c48]">تاجر</span> وحمّل التطبيق</>
                ) : (
                  <>Register As A <span className="text-[#ee3c48]">Dealer</span> &amp; Get The App</>
                )}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-[#7f8c8d]">
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#ee3c48]" />{isAr ? 'مزادات مباشرة' : 'Live dealer auctions'}</span>
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-[#ee3c48]" />{isAr ? 'مزايدة فورية' : 'Real-time bidding'}</span>
                <span className="flex items-center gap-1.5"><Bell className="w-4 h-4 text-[#ee3c48]" />{isAr ? 'تنبيهات فورية' : 'Instant alerts'}</span>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:-translate-y-0.5"
                aria-label="Get it on Google Play"
              >
                <Image src="/images/google.png" alt="Get it on Google Play" width={180} height={54} className="h-auto w-[150px]" />
              </a>

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:-translate-y-0.5"
                aria-label="Download on the App Store"
              >
                <Image src="/images/apple.png" alt="Download on the App Store" width={180} height={54} className="h-auto w-[150px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
