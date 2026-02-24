'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import {Button} from './ui/button';

// Array of car images for the slider
const carImages = [
  '/images/banner/1.webp',
  '/images/banner/2.webp',
  '/images/banner/3.webp',
  // '/images/banner/4.webp',
  // '/images/banner/5.webp',
];

const brandLogos = [
  { label: 'Toyota', src: '/images/car-logos/toyota.png' },
  { label: 'Nissan', src: '/images/car-logos/nissan.jpg' },
  { label: 'Hyundai', src: '/images/car-logos/hyundai.png' },
  { label: 'Ford', src: '/images/car-logos/ford.png' },
  { label: 'BMW', src: '/images/car-logos/bmw.png' },
  { label: 'Brand', src: '/images/car-logos/generic.webp' },
];


const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const hero: any = lang[languageContent].hero;
  
  
  // Slider state
  const [currentSlide,setCurrentSlide] = useState(0);
  const isAutoPlaying = true; // Always auto-playing
  const sliderInterval = useRef<NodeJS.Timeout | null>(null);

   const [, setActiveSlide] = useState(0);
  const [showBrandLogos, setShowBrandLogos] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');

  const scrollToValuation = useCallback(() => {
    document.getElementById('valuation-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleBrandClick = useCallback(
    (brand: any) => {
      setSelectedBrand(brand);
      scrollToValuation();
    },
    [scrollToValuation],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carImages.length);
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
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
  

  

  return (
     <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-slate-100 py-[120px] sm:py-[120px]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
              {hero.badge}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-slate-900 sm:text-6xl lg:text-7xl">
              {hero.title}
              <span className="block text-brand-500 text-6xl font-black leading-none sm:text-7xl lg:text-8xl">
                {hero.titleHighlight}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600">{hero.description}</p>

            {showBrandLogos ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {brandLogos.map((brand) => (
                  <button
                    type="button"
                    key={brand.label}
                    onClick={() => {
                      handleBrandClick(brand.label);
                    }}
                    className={`flex items-center justify-center rounded-xl bg-white/80 px-3 py-3 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-soft ${
                      selectedBrand === brand.label ? 'ring-2 ring-brand-400' : ''
                    }`}
                    aria-label={`${hero.selectBrand} ${brand.label}`}
                  >
                    <img src={brand.src} alt={brand.label} className="h-10 w-auto object-contain" loading="lazy" />
                  </button>
                ))}
              </div>
            ) : (
              <ul className="mt-5 space-y-2">
                {hero.quickSteps.map((step: any) => (
                  <li
                    key={step}
                    className="rounded-xl border border-white/60 bg-white/35 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md ring-1 ring-white/50 transition duration-300 hover:-translate-y-0.5 hover:bg-white/50 hover:shadow-[0_12px_28px_rgba(15,23,42,0.14)]"
                  >
                    {step}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="default"
                onClick={() => {
                  scrollToValuation();
                }}
              >
                {hero.ctaEvaluation}
              </Button>
              <Button onClick={() => scrollToValuation()} variant="ghost">
                {hero.ctaBooking}
              </Button>
              <Button
                onClick={() => {
                  setShowBrandLogos((current) => !current);
                }}
                variant="ghost"
                className={showBrandLogos ? 'border border-brand-300 bg-brand-50 text-brand-700' : ''}
              >
                {hero.selectBrand}
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/40 shadow-soft backdrop-blur">
            <div className="relative aspect-[16/11] sm:aspect-[16/10]">
              {carImages.map((slide, index) => (
                <img
                  key={slide}
                  src={slide}
                  alt={slide}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ))}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent px-4 pb-4 pt-10 text-white">
                <h2 className="text-lg font-extrabold">{hero.sliderTitle}</h2>
                <p className="mt-1 text-sm text-slate-100">{hero.sliderSubtitle}</p>
                <div className="mt-3 flex gap-2">
                  {carImages.map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 w-2 rounded-full ${index === currentSlide ? 'bg-brand-400' : 'bg-white/60'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;