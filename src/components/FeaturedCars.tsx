import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Info } from 'lucide-react';
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
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="relative">
        <img 
          src={car.image} 
          alt={`${car.year} ${car.make} ${car.model}`} 
          className="w-full h-56 object-contain"
        />
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        
        {car.featured && (
          <div className="absolute top-4 left-4 bg-amber-500 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
            {lang[languageContent].featured}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
            <p className="text-gray-500 text-sm">{car.year}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-blue-800">SAR {car.price.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Est. SAR 499/mo</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="flex items-center text-gray-700">
            <span className="font-medium">{lang[languageContent].mileage}:</span>
            <span className="ml-1">{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium">{lang[languageContent].fuel}:</span>
            <span className="ml-1">{car.fuelType}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium">{lang[languageContent].transmission}:</span>
            <span className="ml-1">{car.transmission}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-5 hidden">
          <button  
            
            className="bg-gradient-to-r from-amber-500 to-amber-400 text-white font-medium py-2 px-4 rounded-lg w-full transition"
            aria-label={`${lang[languageContent].viewDetails} ${car.make} ${car.model}`}
          >
            {lang[languageContent].viewDetails}
          </button>
          <button 
            className="border border-blue-800 text-blue-800 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
            aria-label={`More information about ${car.make} ${car.model}`}
          >
            <Info className="h-4 w-4" />
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