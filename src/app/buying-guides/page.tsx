'use client'

import { useLanguage } from '../../contexts/LanguageContext';


const BuyingGuides = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';


  return (
    <div className={`min-h-screen bg-gray-50 pt-[120px] pb-16 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 mb-4">
            <span className="font-medium text-gray-900">Baddelha</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{isAr ? 'أدلة الشراء' : 'Buying Guides'}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{isAr ? 'أدلة الشراء والنصائح' : 'Car Buying Guides & Tips'}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isAr ? 'اكتشف نصائح الخبراء ودليلنا الشامل لمساعدتك في اتخاذ قرارات مستنيرة عند شراء سيارتك التالية.' : 
            'Discover expert tips and our comprehensive guide to help you make informed decisions when purchasing your next car.'}
          </p>
        </header>

        {/* Valuation Process Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">{isAr ? 'عملية تقييم السيارة' : 'Car Valuation Process'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primaryBtn rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">{isAr ? 'احصل على تقييم مجاني عبر الإنترنت' : 'Get a Free Online Valuation'}</h3>
              <p className="text-gray-600 text-sm">{isAr ? 'قيّم سيارتك مجانًا في دقائق معدودة وابدأ العملية فورًا.' : 'Evaluate your car for free in just a few minutes and get started instantly.'}</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primaryBtn rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">{isAr ? 'احجز موعد فحص مجاني' : 'Book a Free Inspection Appointment'}</h3>
              <p className="text-gray-600 text-sm">{isAr ? 'اختر الوقت المناسب لإجراء فحص احترافي لسيارتك بدون أي رسوم.' : 'Choose a convenient time for a professional inspection at no cost.'}</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primaryBtn rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">{isAr ? 'استلم تقييمك في 30 دقيقة' : 'Receive Your Valuation in 30 Minutes'}</h3>
              <p className="text-gray-600 text-sm">{isAr ? 'بعد الفحص، احصل على سعر عادل مبني على بيانات السوق — وأكمل العملية في 30 دقيقة.' : 'After the inspection, get a fair market-based price — and complete the process in just 30 minutes.'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BuyingGuides;