'use client';
import { MessageCircle, Car, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SellCarWidget = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const whatsappNumber = '966920032590'; // Replace with your actual WhatsApp business number
  const whatsappMessage = isArabic 
    ? 'مرحباً، أنا مهتم ببيع سيارتي'
    : 'Hello, I am interested in selling my car';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
        {/* Service Notice Banner */}
        <div className="bg-amber-100 border-b border-amber-200 px-6 py-3">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              {isArabic 
                ? 'خدمة التقييم الآلي غير متاحة مؤقتاً بسبب صيانة الخادم'
                : 'Automated valuation service temporarily unavailable due to server maintenance'}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <Car className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isArabic ? 'مهتم ببيع سيارتك؟' : 'Interested in Selling Your Car?'}
            </h2>
            
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {isArabic 
                ? 'تواصل معنا مباشرة عبر واتساب وسيساعدك فريقنا في الحصول على أفضل عرض لسيارتك'
                : 'Connect with us directly on WhatsApp and our team will help you get the best offer for your car'}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                {isArabic ? 'استجابة سريعة' : 'Quick Response'}
              </h3>
              <p className="text-sm text-gray-600">
                {isArabic ? 'رد فوري من فريقنا المتخصص' : 'Instant reply from our expert team'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                {isArabic ? 'أفضل الأسعار' : 'Best Prices'}
              </h3>
              <p className="text-sm text-gray-600">
                {isArabic ? 'عروض تنافسية لسيارتك' : 'Competitive offers for your vehicle'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                {isArabic ? 'عملية سهلة' : 'Easy Process'}
              </h3>
              <p className="text-sm text-gray-600">
                {isArabic ? 'إجراءات بسيطة وسريعة' : 'Simple and fast procedures'}
              </p>
            </div>
          </div>

          {/* WhatsApp CTA Button */}
          <div className="text-center">
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-lg">
                {isArabic ? 'تواصل معنا عبر واتساب' : 'Contact Us on WhatsApp'}
              </span>
            </button>
            
            <p className="text-sm text-gray-600 mt-4">
              {isArabic 
                ? 'متاح من السبت إلى الخميس، 9 صباحاً - 6 مساءً'
                : 'Available Saturday to Thursday, 9 AM - 6 PM'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCarWidget;
