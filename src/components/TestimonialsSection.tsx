import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';

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
    name: "Mohammed Otaibi",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    testimonial: "My inspection experience with Baddelha was smooth and fast. Everything was clear and professional. I truly appreciate the team for their excellent work and support.",
    testimonialAr: "تجربتي في فحص السيارة مع بدلها كانت سهلة وسريعة جدًا. كل شيء كان واضح واحترافي، وأشكر فريق العمل على تعاونهم وجهودهم المميزة.",
    image: "https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Car Inspection"
  },
  {
    id: 2,
    name: "Laila Shehry",
    location: "Jeddah, Saudi Arabia",
    rating: 5,
    testimonial: "Baddelha did an amazing job for me. I sold my old car and got a new J7 in just 30 minutes — an incredible and hassle-free experience.",
    testimonialAr: "بدلها قدموا لي خدمة رائعة. بعت سيارتي القديمة واستلمت سيارة J7 جديدة خلال 30 دقيقة فقط — تجربة سريعة وسلسة بدون أي تعب.",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Selling & Exchange"
  },
  {
    id: 3,
    name: "Sara Al-Mutairi",
    location: "Dammam, Saudi Arabia",
    rating: 5,
    testimonial: "The team was very professional and honest. I felt confident throughout the process, and everything was completed faster than I expected.",
    testimonialAr: "الفريق كان قمة في الاحترافية والمصداقية. حسّيت بالثقة طوال العملية، وكل شيء تم أسرع مما توقعت.",
    image: "https://images.pexels.com/photos/1183244/pexels-photo-1183244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Car Valuation"
  },
  {
    id: 4,
    name: "Ahmed Al-Harbi",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    testimonial: "From inspection to valuation, the whole process was quick and transparent. Baddelha saved me time and gave me a great deal.",
    testimonialAr: "من الفحص إلى التقييم، كل الإجراءات كانت سريعة وواضحة. بدلها وفروا علي الوقت وحصلت على عرض ممتاز.",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    service: "Complete Service"
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
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
        <p className="text-gray-700 italic relative z-10 pl-3">{testimonial.testimonial}</p>
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
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{lang[languageContent].testimonials}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{lang[languageContent].hearFromOurHappyCustomers}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {lang[languageContent].thousandsOfCarOwnersTrustDriveMarketForBuyingSellingAndValuatingTheirVehicles}
            {lang[languageContent].hereIsWhatSomeOfThemHaveToSay}
          </p>
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