'use client';
import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  featured?: boolean;
}

const cars: Car[] = [
  {
    id: 1,
    make: 'JAECO',
    model: 'J5',
    year: 2025,
    price: 79900,
    image: 'https://omodajaecoo-dubai.ae/wp-content/uploads/2025/08/jaecoo-j5_alpine_green_front_view_canyon_black_01.webp',
    mileage: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic',
  },
  {
    id: 2,
    make: 'JAECO',
    model: 'J7',
    year: 2025,
    price: 82900,
    image: 'https://omodajaecoo-dubai.ae/wp-content/uploads/2025/05/Jaecoo-J7-comfort-front-white-523x432-1.webp',
    mileage: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic',
  },
  {
    id: 3,
    make: 'JAECO',
    model: 'J8',
    year: 2025,
    price: 121900,
    image: 'https://omodajaecoo-dubai.ae/wp-content/uploads/2025/05/jaecoo-j8-product-pic-black-size.webp',
    mileage: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic'
  },
  {
    id: 4,
    make: 'OMODO',
    model: 'C5',
    year: 2025,
    price: 88500,
    image: 'https://omodajaecoo-dubai.ae/wp-content/uploads/2025/06/product-omoda-c5-prermuim-size.webp',
    mileage: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic'
  },
];

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      {/* Image with 16:9 aspect ratio */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={car.image} 
          alt={`${car.year} ${car.make} ${car.model}`} 
          className="w-full h-full object-contain"
          loading="lazy"
        />
        
        {/* Badge: New or Used */}
        <div className="absolute top-4 left-4 bg-primaryBtn text-white text-xs font-bold px-3 py-1 rounded-full">
          {car.mileage === 0 ? (languageContent === 'ar' ? 'جديد' : 'New') : (languageContent === 'ar' ? 'مستعمل' : 'Used')}
        </div>
        
        {/* Favorite button */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="p-5">
        {/* Title: Make + Model + Year */}
        <div className="mb-2">
          <h3 className="font-bold text-lg">{car.make} {car.model} {car.year}</h3>
        </div>
        
        {/* Price (SAR) - large */}
        <div className="mb-4">
          <p className="font-bold text-xl text-primaryBtn">SAR {car.price.toLocaleString()}</p>
        </div>
        
        {/* Meta row: mileage, fuel, transmission */}
        <div className="flex flex-wrap gap-3 mb-5 text-sm text-gray-600">
          <div className="flex items-center">
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center">
            <span>•</span>
          </div>
          <div className="flex items-center">
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center">
            <span>•</span>
          </div>
          <div className="flex items-center">
            <span>{car.transmission}</span>
          </div>
        </div>
        
        {/* CTAs: Explore (primary) + Favorite (icon) + Compare (icon) */}
        <div className="flex gap-2 mt-5">
          <button  
            onClick={() => window.location.href = '/'}
            className="bg-primaryBtn hover:bg-primaryBtn-600 text-white font-medium py-2 px-4 rounded-lg flex-grow transition"
            aria-label={`Explore ${car.make} ${car.model}`}
          >
            Explore
          </button>
          
          <button 
            onClick={() => setIsCompared(!isCompared)}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium p-2 rounded-lg transition flex items-center justify-center"
            aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isCompared ? "text-primaryBtn" : "text-gray-500"}>
              <path d="M16 3h5v5"></path><path d="M8 3H3v5"></path>
              <path d="M21 3l-7 7"></path><path d="M3 3l7 7"></path>
              <path d="M8 21h5v-5"></path><path d="M16 21h5v-5"></path>
              <path d="M3 21l7-7"></path><path d="M21 21l-7-7"></path>
            </svg>
          </button>
        </div>
        
        {/* CTA: Get New Car button */}
        <div className="mt-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition text-center"
          >
            Get New Car
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedCars: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const cardsToShow = 3;
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + cardsToShow >= cars.length ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, cars.length - cardsToShow) : prevIndex - 1
    );
  };

  const nextMobileSlide = () => {
    setMobileIndex((prevIndex) => 
      prevIndex >= cars.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevMobileSlide = () => {
    setMobileIndex((prevIndex) => 
      prevIndex === 0 ? cars.length - 1 : prevIndex - 1
    );
  };
  
  const visibleCars = cars.slice(currentIndex, currentIndex + cardsToShow);
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <span className="text-[#F7AF37] font-semibold text-sm uppercase tracking-wider">{lang[languageContent].featuredCars}</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">{lang[languageContent].findYourPerfectMatch}</h2>
          </div>
          
          <div className="hidden lg:flex space-x-2">
            <button 
              onClick={prevSlide}
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition"
              aria-label="Previous cars"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button 
              onClick={nextSlide}
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition"
              aria-label="Next cars"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
        
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        
        {/* For mobile */}
        <div className="lg:hidden">
          <div className="relative">
            <CarCard key={cars[mobileIndex].id} car={cars[mobileIndex]} />
            
            <div className="flex justify-center items-center gap-4 mt-4">
              <button 
                onClick={prevMobileSlide}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition"
                aria-label="Previous car"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <div className="flex gap-2">
                {cars.map((_, index) => (
                  <span 
                    key={index} 
                    className={`w-2 h-2 rounded-full transition ${index === mobileIndex ? 'bg-amber-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextMobileSlide}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition"
                aria-label="Next car"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
        
        {/* <div className="text-center mt-10">
          <button
          onClick={()=>{
             window.location.href = '/buy';
          }}
          className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-semibold py-3 px-6 rounded-lg transition"
          aria-label={lang[languageContent].viewAllCars}>
            {lang[languageContent].viewAllCars}
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default FeaturedCars;