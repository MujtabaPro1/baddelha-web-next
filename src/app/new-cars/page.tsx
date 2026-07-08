'use client';
import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Phone, 
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { useLanguage } from '../../contexts/LanguageContext';
import lang from '../../locale';
import Link from 'next/link';

interface DealershipLogo {
  id: string;
  url: string;
  caption: string;
  fileType: string;
}

interface Dealership {
  id: string;
  serialNo?: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  processingTime?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
  logo?: DealershipLogo;
}

interface CarImage {
  id: string;
  url: string;
  caption: string;
  fileType: string;
}

interface DealerCar {
  id: string;
  serialNo: number;
  make: string;
  model: string;
  year: number;
  exactModel?: string;
  sellingPrice: string;
  fuelType?: string | null;
  transmission?: string | null;
  dealershipId: string;
  createdAt: string;
  updatedAt: string;
  dealership?: Dealership;
  images: CarImage[];
}

const NewCars: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const t: any = lang[language === 'ar' ? 'ar' : 'en'].buy_page;

  const [cars, setCars] = useState<DealerCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCar, setSelectedCar] = useState<DealerCar | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch all new cars on mount
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/api/1.0/dealership-car/find-all');
        const carsData = response?.data?.data || [];
        setCars(carsData);
      } catch (err) {
        console.error('Error fetching new cars:', err);
        setError('Failed to load cars. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString();
  };

  const getCarImage = (car: DealerCar) => {
    if (car.images && car.images.length > 0) {
      return car.images[0].url;
    }
    return '/placeholder-car.jpg';
  };

  const openLightbox = (car: DealerCar, index: number = 0) => {
    setSelectedCar(car);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedCar(null);
    setLightboxIndex(0);
  };

  const nextImage = () => {
    if (selectedCar && selectedCar.images.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % selectedCar.images.length);
    }
  };

  const prevImage = () => {
    if (selectedCar && selectedCar.images.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + selectedCar.images.length) % selectedCar.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="bg-[#3d3d40] text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t.newCarsTitle}
            </h1>
            <p className="text-lg text-gray-300">
              {t.newCarsSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-amber-700 text-center">
            {t.stockDisclaimer}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
            <p className="text-gray-600">{t.loadingCars}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 bg-red-50 rounded-xl">
            <Car className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">{t.errorLoadingCars}</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cars.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{t.noCarsAvailable}</h3>
            <p className="text-gray-500">{t.noCarsDescription}</p>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && cars.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {cars.length} {t.carsFound}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <div 
                  key={car.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Car Image */}
                  <div 
                    className="relative h-48 cursor-pointer"
                    onClick={() => openLightbox(car, 0)}
                  >
                    <img 
                      src={getCarImage(car)}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    {car.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        +{car.images.length - 1} {t('photos', 'photos')}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.newLabel}
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <div className='flex justify-between items-center mt-2 mb-2'>
                      {car.exactModel && (
                        <p className="text-sm text-gray-500">{car.exactModel}</p>
                      )}
                        {/* Specs */}
                <div className="flex items-center">
                        <Calendar className={`h-4 w-4 ${isAr ? 'ml-2' : 'mr-2'} text-gray-400`} />
                        <span>{car.year}</span>
                      </div>
                      </div></div>


                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">{t.startingFrom} </span>
                      <p className="text-md text-dark"> 
                        SAR {formatPrice(car.sellingPrice)}
                      </p>
                    </div>

                  

                    {/* Dealership Info */}
                    {car.dealership && (
                      <div className="border-t pt-3 mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                         <img 
                         className='object-contain w-[150px]'
                         src="https://baddelha-production.s3.eu-west-1.amazonaws.com/Dealership/file-1782847559639-517822572.png?AWSAccessKeyId=ASIATAVAAUS6VAROF7RD&Expires=1783609047&Signature=%2Bko8avtBnvmcDCBOHbmBYNR6rZc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJIMEYCIQCkhHY5pZG5ib091lEiDJs8iVLfSvoT3uAEqWoI499%2FtwIhAPnBbN7Sdty4J3KSIjv0WU6lHwQjWkgGDeedEhixO1VQKsIFCIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjA3NTY3NzU4NTI1Igy%2B8%2B4DVpv9p7M6glMqlgUc4t8A48gvXjw278FsuXf7lRlu%2Bly8T1hzjw6OJof6N%2BXSnCZW9Nhna%2FO4P3b0JtOlIF0rdTCS6JBa%2B82LGtDzbZ4OIiVyzUnF5QpCKbw8biDzum4lzLT5Rauma5CYvrKNK2rqV9h95RCrndudLFXkN0CgnpQbiE2a6K6wVP%2F8CsIGYiZH6KcqlfGHWAkhIGRUP1H%2BGXYcfRoZutgsBFs3Oh4VSwN4BQXm09VkbtnSTCKgbO6LWwdE8FFH59tKxLcTa3Jh%2BbUbOf%2FMOM9o7eMCi%2By37fqSVpnaDs%2BN%2B99CA2Ews8DX2YyPa6Fw%2FMgD63Syh2QPas20NFyGSjKp%2B5ykYWscdi1o0%2FQQqiM0cJ4QQVMJFRmqnaYSZDvyn7hviyf92udOk749pXxEaR%2BVz3kkA8I3uCXBTm21y8bnVqOhq5bFy%2BZOkRZJU69L5NEufVaKJTq158TEo1aJnvttkia%2F7j4HB1Ab4ZSOj8wgbqcHOXnvCLRAXr7d95%2B6pdVtqrs6nMVddjRgLwRCk%2F7X44DSUmzEr%2Fb%2F5xxX9Jh5mMXbSvZG0unFgGwsNvvwzC1Xr%2BtAKKnDLWcu7D9TtHCDZU78iu6IxqtC5lCoy1uYPgj4rAHmi6Uz%2BEMRE8MvGVGba91gwSjRyqoAQQmbAdaZe%2B6bhlTP8JHYyprpvc7pnztYbiMIXCKMQcgAsrGXeNfYQbV7GSqTgNbT0ebd1G9yMPmcbZfOe3V7v3zuCu41m%2FYHlk3%2BBns1wV008EW0epKxjvX2T9K01kbo934ViaobOGVd12qj%2BQOWT%2Fokw0FhBDe1AHrVyhjihg47ABocVZ%2F20Ai%2FUOn1rMotq3WC%2BfRefFd38WNvj0x5bVDaXv02LQdJg642aq%2BD1DCg27jSBjqwARV%2FjZIlMGP8G0cXAilHc1JT0AYPi%2BRcxPQ%2FzVtvaq2hGWDwZZ5XV4Ho3zROJpfVR%2B8i%2Bz%2FBlzPX3YQG3hclJ6AB6o5CGYs5TZ3wWYTRikR62PEN%2B6w3O5%2BFVDmBEMq4O%2BWrbo9MxclpFdjqaTs7VmiMrwv2SIclNrzTSoe6ESAQkPNFUm0gbt45QoguyDq6XXSW%2B%2FQbQurhjTCH%2F4htsAG%2FPdtlhumena02XRv9L8ht"/>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <a 
                        href={`https://wa.me/966920032590?text=${encodeURIComponent(`Hi, I'm interested in reserving this car:\n\n🚗 ${car.year} ${car.make} ${car.model}${car.exactModel ? ` ${car.exactModel}` : ''}\n💰 Price: SAR ${formatPrice(car.sellingPrice)}\n🏢 Dealership: ${car.dealership?.name || 'N/A'}\n\nPlease provide more details.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primaryBtn hover:bg-primaryBtnHover text-white font-semibold py-2 px-4 rounded-lg transition text-center"
                      >
                        {t.reserve}
                      </a>
                      {car.dealership?.phone && (
                        <a 
                          href={`tel:966920032590`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition"
                        >
                          <Phone className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedCar && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>

          <div 
            className="relative w-[90%] md:w-[70%] lg:w-[40%] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {selectedCar.images.length > 0 ? (
                <img
                  src={selectedCar.images[lightboxIndex]?.url}
                  alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <Car className="h-20 w-20" />
                </div>
              )}

              {/* Navigation Arrows */}
              {selectedCar.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {selectedCar.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {selectedCar.images.length}
                </div>
              )}
            </div>

            {/* Car Info Panel */}
            <div className="bg-white rounded-lg mt-4 p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCar.make} {selectedCar.model}
                  </h2>
                  {selectedCar.exactModel && (
                    <p className="text-gray-600">{selectedCar.exactModel}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-amber-600">
                    SAR {formatPrice(selectedCar.sellingPrice)}
                  </p>
                </div>
              </div>

              {/* Dealership Info */}
              {selectedCar.dealership && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {(lang[language] as any).dealershipInfo || 'Dealership Information'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <img
                          className='object-contain w-[150px]'
                        src="https://baddelha-production.s3.eu-west-1.amazonaws.com/Dealership/file-1782847559639-517822572.png?AWSAccessKeyId=ASIATAVAAUS6VAROF7RD&Expires=1783609047&Signature=%2Bko8avtBnvmcDCBOHbmBYNR6rZc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJIMEYCIQCkhHY5pZG5ib091lEiDJs8iVLfSvoT3uAEqWoI499%2FtwIhAPnBbN7Sdty4J3KSIjv0WU6lHwQjWkgGDeedEhixO1VQKsIFCIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjA3NTY3NzU4NTI1Igy%2B8%2B4DVpv9p7M6glMqlgUc4t8A48gvXjw278FsuXf7lRlu%2Bly8T1hzjw6OJof6N%2BXSnCZW9Nhna%2FO4P3b0JtOlIF0rdTCS6JBa%2B82LGtDzbZ4OIiVyzUnF5QpCKbw8biDzum4lzLT5Rauma5CYvrKNK2rqV9h95RCrndudLFXkN0CgnpQbiE2a6K6wVP%2F8CsIGYiZH6KcqlfGHWAkhIGRUP1H%2BGXYcfRoZutgsBFs3Oh4VSwN4BQXm09VkbtnSTCKgbO6LWwdE8FFH59tKxLcTa3Jh%2BbUbOf%2FMOM9o7eMCi%2By37fqSVpnaDs%2BN%2B99CA2Ews8DX2YyPa6Fw%2FMgD63Syh2QPas20NFyGSjKp%2B5ykYWscdi1o0%2FQQqiM0cJ4QQVMJFRmqnaYSZDvyn7hviyf92udOk749pXxEaR%2BVz3kkA8I3uCXBTm21y8bnVqOhq5bFy%2BZOkRZJU69L5NEufVaKJTq158TEo1aJnvttkia%2F7j4HB1Ab4ZSOj8wgbqcHOXnvCLRAXr7d95%2B6pdVtqrs6nMVddjRgLwRCk%2F7X44DSUmzEr%2Fb%2F5xxX9Jh5mMXbSvZG0unFgGwsNvvwzC1Xr%2BtAKKnDLWcu7D9TtHCDZU78iu6IxqtC5lCoy1uYPgj4rAHmi6Uz%2BEMRE8MvGVGba91gwSjRyqoAQQmbAdaZe%2B6bhlTP8JHYyprpvc7pnztYbiMIXCKMQcgAsrGXeNfYQbV7GSqTgNbT0ebd1G9yMPmcbZfOe3V7v3zuCu41m%2FYHlk3%2BBns1wV008EW0epKxjvX2T9K01kbo934ViaobOGVd12qj%2BQOWT%2Fokw0FhBDe1AHrVyhjihg47ABocVZ%2F20Ai%2FUOn1rMotq3WC%2BfRefFd38WNvj0x5bVDaXv02LQdJg642aq%2BD1DCg27jSBjqwARV%2FjZIlMGP8G0cXAilHc1JT0AYPi%2BRcxPQ%2FzVtvaq2hGWDwZZ5XV4Ho3zROJpfVR%2B8i%2Bz%2FBlzPX3YQG3hclJ6AB6o5CGYs5TZ3wWYTRikR62PEN%2B6w3O5%2BFVDmBEMq4O%2BWrbo9MxclpFdjqaTs7VmiMrwv2SIclNrzTSoe6ESAQkPNFUm0gbt45QoguyDq6XXSW%2B%2FQbQurhjTCH%2F4htsAG%2FPdtlhumena02XRv9L8ht"/>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-amber-500" />
                      <div>
                        <a 
                          href={`tel:${selectedCar.dealership.phone}`}
                          className="font-medium text-amber-600 hover:underline"
                        >
                          {selectedCar.dealership.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {selectedCar.dealership.website && (
                    <a
                      href={selectedCar.dealership.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-4 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {(lang[language] as any).visitWebsite || 'Visit Website'}
                    </a>
                  )}
                </div>
              )}

              {/* Contact Button */}
              <div className="mt-6 flex gap-4">
                {selectedCar.dealership?.phone && (
                  <a
                    href={`tel:${selectedCar.dealership.phone}`}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
                  >
                    <Phone className="h-5 w-5 inline-block mr-2" />
                    {(lang[language] as any).callDealership || 'Call Dealership'}
                  </a>
                )}
                <Link
                  href="/tradein"
                  className="flex-1 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold py-3 px-6 rounded-lg transition text-center"
                >
                  {(lang[language] as any).tradeInYourCar || 'Trade-In Your Car'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCars;
