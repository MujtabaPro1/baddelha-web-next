import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ValuationWidget from './ValuationWidget';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import { useRouter } from 'next/navigation';

// Array of car images for the slider
const carImages = [
  '/images/banner/1.webp',
  '/images/banner/2.webp',
  // '/images/banner/3.webp',
  // '/images/banner/4.webp',
  // '/images/banner/5.webp',
];

const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const router = useRouter();
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const isAutoPlaying = true; // Always auto-playing
  
  // Valuation widget animation state
  const [isVisible, setIsVisible] = useState(false);
  const valuationRef = useRef<HTMLDivElement>(null);
  const sliderInterval = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer for valuation widget animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (valuationRef.current) {
      observer.observe(valuationRef.current);
    }

    return () => {
      if (valuationRef.current) {
        observer.unobserve(valuationRef.current);
      }
    };
  }, []);
  
  // Auto-rotate slider
  useEffect(() => {
    if (isAutoPlaying) {
      sliderInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carImages.length);
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (sliderInterval.current) {
        clearInterval(sliderInterval.current);
      }
    };
  }, [isAutoPlaying]);
  
  // Navigation functions
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carImages.length);
    resetAutoPlayTimer();
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carImages.length - 1 : prev - 1));
    resetAutoPlayTimer();
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetAutoPlayTimer();
  };
  
  const resetAutoPlayTimer = () => {
    if (sliderInterval.current) {
      clearInterval(sliderInterval.current);
    }
    
    if (isAutoPlaying) {
      sliderInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carImages.length);
      }, 5000);
    }
  };
  
  return (
    <div className="relative pt-16">
      {/* Background image slider */}
      <div className="absolute inset-0 overflow-hidden">
        {carImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Using div with background image for better control */}
            <div 
              className="absolute inset-0 bg-cover bg-no-repeat transform scale-105"
              style={{ backgroundImage: `url(${image})` }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-[#00000078]"></div>
          </div>
        ))}
      </div>
      
      {/* Slider navigation */}
      <div className="absolute z-10 inset-x-0 bottom-20 flex justify-center space-x-2">
        {carImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Arrow navigation */}
      <div className="hidden md:block">
        <button 
          onClick={goToPrevSlide}
          className="absolute z-10 left-4 top-[45%] -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={goToNextSlide}
          className="absolute z-10 right-4 top-[45%] -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
      {/* Single section with hero content and valuation widget */}
      <div className="relative container mx-auto px-4 pt-24 pb-32 md:pt-32 md:pb-40">
        {/* Hero content */}
        <div className="text-white max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
            <br />{lang[languageContent].buySellTrade}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl">
            {lang[languageContent].premiumServices}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
            onClick={() => {
              document.scrollingElement?.scrollTo({
                top: document.getElementById('valuation')?.offsetTop || 0,
                behavior: 'smooth'
              });
            }}
            className="bg-primaryBtn text-[#FFF] font-semibold px-6 py-3 rounded-lg transition transform hover:scale-105 flex items-center"
            aria-label={lang[languageContent].getStarted}>
              {lang[languageContent].getStarted} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
            onClick={() => {
             router.push('/about');
            }}
            className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition"
            aria-label={lang[languageContent].learnMore}>
              {lang[languageContent].learnMore}
            </button>
          </div>
    
        </div>
        
        {/* Valuation widget - aligned with content */}
        <div 
          ref={valuationRef}
          id="valuation" 
          className={`transition-all duration-700 ease-out w-full md:w-auto md:max-w-md mx-auto md:mx-0 lg:absolute lg:right-0 lg:top-20 ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-16'
          }`}
        >
          <ValuationWidget />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;