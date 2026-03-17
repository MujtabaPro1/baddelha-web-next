'use client';
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import RevealOnScroll from './ui/reveal-on-scroll';
import BlurText from './ui/blur-text';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  testimonial: string;
  testimonialAr?: string;
  image: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Khalid Al-Rashid",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    testimonial: "Excellent service! Sold my 2019 Camry here and the whole process was incredibly smooth. The staff was professional and gave me a fair price. Highly recommend Baddelha for anyone looking to sell their car quickly and hassle-free.",
    testimonialAr: "خدمة ممتازة! بعت كامري 2019 هنا والعملية كانت سلسة جداً. الموظفين محترفين وأعطوني سعر عادل. أنصح بشدة ببادلها لأي شخص يريد يبيع سيارته بسرعة وبدون تعب.",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Car Sale"
  },
  {
    id: 2,
    name: "Fatima Al-Zahra",
    location: "Jeddah, Saudi Arabia", 
    rating: 5,
    testimonial: "Amazing experience! The inspection was thorough and professional. They explained everything clearly and I felt confident in their assessment. Great location, easy parking, and friendly staff. Will definitely come back!",
    testimonialAr: "تجربة رائعة! الفحص كان شامل ومحترف. شرحوا لي كل شيء بوضوح وحسيت بالثقة في تقييمهم. موقع ممتاز، مواقف سهلة، وموظفين ودودين. أكيد راح أرجع مرة ثانية!",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Car Inspection"
  },
  {
    id: 3,
    name: "Omar Al-Mansouri",
    location: "Dammam, Saudi Arabia",
    rating: 5,
    testimonial: "Best car dealership in Riyadh! Traded in my old car and got a great deal on a newer model. The team was honest, transparent, and made the whole process stress-free. Couldn't be happier with the service.",
    testimonialAr: "أفضل معرض سيارات في الرياض! استبدلت سيارتي القديمة وحصلت على صفقة ممتازة لموديل أحدث. الفريق كان صادق وشفاف وخلى العملية بدون ضغط. ما أقدر أكون أسعد من كذا بالخدمة.",
    image: "https://images.pexels.com/photos/1183244/pexels-photo-1183244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Car Trade"
  },
  {
    id: 4,
    name: "Nora Al-Saud",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    testimonial: "Outstanding service from start to finish! Got my car evaluated and the price was very fair. The staff was knowledgeable and patient with all my questions. Clean facility and professional atmosphere. Highly recommended!",
    testimonialAr: "خدمة متميزة من البداية للنهاية! قيمت سيارتي والسعر كان عادل جداً. الموظفين كانوا خبراء وصبورين مع كل أسئلتي. المكان نظيف وجو مهني. أنصح فيه بقوة!",
    image: "https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Car Valuation"
  },
  {
    id: 5,
    name: "Abdullah Al-Otaibi",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    testimonial: "Fantastic experience! Quick, efficient, and professional service. The inspection was detailed and they provided a comprehensive report. Fair pricing and no hidden fees. This is how car dealerships should operate!",
    testimonialAr: "تجربة رائعة! خدمة سريعة وفعالة ومحترفة. الفحص كان مفصل وقدموا تقرير شامل. أسعار عادلة وما في رسوم مخفية. كذا لازم تشتغل معارض السيارات!",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Complete Service"
  },
  {
    id: 6,
    name: "Maha Al-Dosari",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    testimonial: "Excellent customer service! The team was very helpful and made me feel comfortable throughout the entire process. Great location on Al Khurais Road, easy to find. Will definitely recommend to friends and family.",
    testimonialAr: "خدمة عملاء ممتازة! الفريق كان متعاون جداً وخلاني مرتاحة طوال العملية. موقع ممتاز في طريق الخريص، سهل الوصول إليه. أكيد راح أنصح الأصدقاء والعائلة.",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Customer Service"
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-gray-500 text-sm">{testimonial.location}</p>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
          {testimonial.service}
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      
      <div className="flex-grow relative">
        <Quote className="absolute top-0 left-0 h-8 w-8 text-blue-100 -translate-x-2 -translate-y-2" />
        <p className={`text-gray-700 italic relative z-10 pl-3 ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic && testimonial.testimonialAr ? testimonial.testimonialAr : testimonial.testimonial}
        </p>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonialsPerView = 3;
  const totalViews = Math.ceil(testimonials.length / testimonialsPerView);
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  
  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalViews);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [totalViews]);
  
  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % totalViews);
  };
  
  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + totalViews) % totalViews);
  };
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">

          <div className="mb-12">
          <RevealOnScroll>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              {lang[languageContent].testimonials}
            </span>
           </RevealOnScroll>
          <BlurText
            text={lang[languageContent].hearFromOurHappyCustomers}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
            animateBy="words"
            direction="top"
            delay={60}
          />
          <BlurText
            text={`${lang[languageContent].thousandsOfCarOwnersTrustDriveMarketForBuyingSellingAndValuatingTheirVehicles} ${lang[languageContent].hereIsWhatSomeOfThemHaveToSay}`}
            className="text-gray-600 max-w-2xl"
            animateBy="words"
            direction="bottom"
            delay={26}
          />
        </div>
        
        <div className="relative">
          {/* Desktop view */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {testimonials
              .slice(
                activeIndex * testimonialsPerView, 
                Math.min((activeIndex + 1) * testimonialsPerView, testimonials.length)
              )
              .map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
          </div>
          
          {/* Mobile view */}
          <div className="md:hidden">
            <TestimonialCard testimonial={testimonials[activeIndex % testimonials.length]} />
          </div>
          
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 z-10 hidden md:block"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 z-10 hidden md:block"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <div className="flex justify-center space-x-2 mt-8">
          {[...Array(totalViews)].map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
              } transition-all duration-300`}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default TestimonialsSection;
