'use client';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedCars from '../components/FeaturedCars';
import CtaSection from '../components/CtaSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { ClipboardCheck, CalendarCheck, HandCoins } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function Steps() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const steps = [
    {
      title: isAr ? 'أدخل معلومات سيارتك' : 'Share your car details',
      description: isAr
        ? 'اختر الماركة والموديل والحالة للحصول على تقدير سريع ومجاني.'
        : 'Select the make, model, and condition to get a fast free estimate.',
      icon: ClipboardCheck,
      number: 1
    },
    {
      title: isAr ? 'احجز موعد فحص' : 'Book an inspection slot',
      description: isAr
        ? 'اختر الوقت المناسب وسنقوم بتأكيد الموعد خلال دقائق.'
        : 'Pick a convenient time and we’ll confirm your appointment quickly.',
      icon: CalendarCheck,
      number: 2
    },
    {
      title: isAr ? 'استلم عرضك واختر' : 'Receive your offer and decide',
      description: isAr
        ? 'استلم عرضاً واضحاً—يمكنك البيع الآن أو المتابعة بخيارات أخرى.'
        : 'Get a clear offer—sell now or explore the next option that suits you.',
      icon: HandCoins,
      number: 3
    }
  ];

  return (
    <section className={`bg-white py-14 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isAr ? 'كل شيء في 3 خطوات بسيطة' : 'Everything in 3 simple steps'}
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {isAr
              ? 'مسار واضح من التقدير إلى العرض—بدون تعقيد.'
              : 'A clear path from estimate to offer—no unnecessary complexity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white ring-1 ring-black/5">
                      <Icon className="h-6 w-6 text-primaryBtn" />
                    </div>
                    <div className="text-5xl font-extrabold leading-none text-gray-200">{step.number}</div>
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function App() {

  return (
    <div className="min-h-screen bg-white">
        <HeroSection />
        <Steps />
        <ServicesSection />
        <FeaturedCars />
        <TestimonialsSection />
        <CtaSection />
    </div>
  );
}

export default App;