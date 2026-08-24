'use client';
import React from 'react';
import Image from 'next/image';
import { Gavel, Bell, FileCheck2, Store } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.baddelha.dealer';
const APP_STORE_URL = 'https://apps.apple.com/us/app/baddelha-dealer/id6775514099';

const AppPromoSection: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const bullets = [
    {
      icon: Gavel,
      en: 'Live dealer auctions running now',
      ar: 'مزادات مباشرة للتجار الآن',
    },
    {
      icon: Bell,
      en: 'Real-time bid updates',
      ar: 'تحديثات فورية للمزايدات',
    },
    {
      icon: FileCheck2,
      en: 'Instant new-car alerts & inspection reports',
      ar: 'تنبيهات فورية وتقارير فحص كاملة',
    },
  ];

  return (
    <section
      className="relative overflow-hidden border-y border-slate-200 bg-gradient-to-br from-brand-100 via-white to-slate-100 py-14 sm:py-20"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(700px 300px at 20% -10%, var(--color-brand-500) 0%, transparent 60%), radial-gradient(600px 280px at 85% 10%, var(--color-by) 0%, transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Text content */}
          <div>
            <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
              {isAr ? 'تطبيق جديد كلياً • سجّل اليوم' : 'ALL-NEW APP · REGISTER TODAY'}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              {isAr ? 'سجّل كتاجر و' : 'Register As A Dealer &'}{' '}
              <span className="block text-brand-500">{isAr ? 'حمّل التطبيق' : 'Get The App'}</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-600">
              {isAr
                ? 'انضم إلى شبكة تجار السيارات، وزايد على السيارات مباشرة، واحصل على تنبيهات فورية وتقارير فحص كاملة من هاتفك.'
                : 'Join our dealer network, bid on live auctions, and get instant alerts and full inspection reports right from your phone.'}
            </p>

            <ul className="mt-6 space-y-3">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/60 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                    <b.icon className="h-4 w-4" />
                  </span>
                  {isAr ? b.ar : b.en}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:-translate-y-0.5"
                aria-label="Get it on Google Play"
              >
                <Image src="/images/google.png" alt="Get it on Google Play" width={180} height={54} className="h-auto w-[160px] sm:w-[180px]" />
              </a>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:-translate-y-0.5"
                aria-label="Download on the App Store"
              >
                <Image src="/images/apple.png" alt="Download on the App Store" width={180} height={54} className="h-auto w-[160px] sm:w-[180px]" />
              </a>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-[#2b2b2e] p-8 text-white shadow-soft sm:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(400px 200px at 90% 0%, rgba(238,60,72,0.55), transparent 60%), radial-gradient(400px 220px at 0% 100%, rgba(238,60,72,0.35), transparent 60%)',
              }}
            />
            <div className="relative flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <Store className="h-8 w-8 text-brand-400" />
              </span>
              <h3 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
                {isAr ? (
                  <>
                    زايد. اربح.
                    <span className="block text-brand-400 underline decoration-brand-400/60">بِع اليوم.</span>
                  </>
                ) : (
                  <>
                    Bid. Win.
                    <span className="block text-brand-400 underline decoration-brand-400/60">Sell Today.</span>
                  </>
                )}
              </h3>
              <p className="mt-3 max-w-xs text-sm text-slate-300">
                {isAr
                  ? 'كل ما يحتاجه التاجر لإدارة مزايداته وسياراته في مكان واحد.'
                  : 'Everything a dealer needs to manage bids and inventory in one place.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
