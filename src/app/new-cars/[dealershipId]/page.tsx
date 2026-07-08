'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Car,
  MapPin,
  Phone,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance';
import { useLanguage } from '../../../contexts/LanguageContext';
import lang from '../../../locale';
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

const DealershipCars: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  const t: any = lang[language === 'ar' ? 'ar' : 'en'].buy_page;

  const params = useParams();
  const dealershipId = params?.dealershipId as string;

  const [cars, setCars] = useState<DealerCar[]>([]);
  const [dealership, setDealership] = useState<Dealership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCar, setSelectedCar] = useState<DealerCar | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!dealershipId) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [carsResponse, dealershipsResponse] = await Promise.all([
          axiosInstance.get('/api/1.0/dealership-car/find-all', { params: { dealershipId } }),
          axiosInstance.get('/api/1.0/dealership/find-all'),
        ]);

        const allCars: DealerCar[] = carsResponse?.data?.data || [];
        const dealerCars = allCars.filter((car) => car.dealershipId === dealershipId);
        setCars(dealerCars);

        const allDealerships: Dealership[] = dealershipsResponse?.data?.data || [];
        const currentDealership =
          allDealerships.find((d) => d.id === dealershipId) ||
          dealerCars[0]?.dealership ||
          null;
        setDealership(currentDealership);
      } catch (err) {
        console.error('Error fetching dealership cars:', err);
        setError('Failed to load cars. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dealershipId]);

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
      <div className="relative overflow-hidden bg-[#2b2b2e] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(238,60,72,0.55), transparent 45%), radial-gradient(circle at 85% 0%, rgba(238,60,72,0.35), transparent 40%)',
          }}
        />
        <div className="relative container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/dealerships"
              className="group inline-flex items-center text-gray-300 hover:text-white mb-8 transition text-sm font-medium"
            >
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/10 group-hover:bg-white/20 transition">
                <BackArrow className="h-3.5 w-3.5" />
              </span>
              <span className={isAr ? 'mr-2' : 'ml-2'}>{t.backToDealerships}</span>
            </Link>

            <div className="flex flex-col md:flex-row items-center md:items-center gap-6 text-center md:text-left rtl:md:text-right">
              <div className="bg-white rounded-2xl p-4 shrink-0 shadow-xl ring-1 ring-black/5">
                {dealership?.logo?.url ? (
                  <img
                    src={dealership.logo.url}
                    alt={dealership.name}
                    className="h-16 md:h-20 w-auto max-w-[180px] object-contain"
                  />
                ) : (
                  <div className="h-16 md:h-20 w-20 flex items-center justify-center text-gray-300">
                    <Car className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">
                  {dealership?.name || t.newCarsTitle}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                  {!loading && (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5 font-medium">
                      <Car className="h-3.5 w-3.5 text-primary" />
                      {cars.length} {t.carsFound}
                    </span>
                  )}
                  {dealership?.location && (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5 text-gray-200">
                      <MapPin className="h-3.5 w-3.5" />
                      {dealership.location}
                    </span>
                  )}
               
                </div>
              </div>
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-9 bg-gray-200 rounded-lg w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
              <Car className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.errorLoadingCars}</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primaryBtn hover:bg-primaryBtn-600 text-white font-medium py-2.5 px-6 rounded-lg transition"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cars.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.noCarsAvailable}</h3>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="group bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Car Image */}
                  <div
                    className="relative h-52 cursor-pointer overflow-hidden bg-gray-100"
                    onClick={() => openLightbox(car, 0)}
                  >
                    <img
                      src={getCarImage(car)}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {car.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 rtl:right-auto rtl:left-2 bg-black/60 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        +{car.images.length - 1} {t.photos}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {t.newLabel}
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-4">
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-xl text-gray-900 leading-tight">
                          {car.make} {car.model}
                        </h3>
                        <div className="flex items-center shrink-0 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                          <Calendar className={`h-3.5 w-3.5 ${isAr ? 'ml-1' : 'mr-1'}`} />
                          {car.year}
                        </div>
                      </div>
                      {car.exactModel && (
                        <p className="text-sm text-gray-500 mt-1">{car.exactModel}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-4 pt-3 border-t border-gray-100 flex items-baseline gap-1.5">
                      <span className="text-xs text-gray-400">{t.startingFrom}</span>
                      <p className="text-sm font-semibold text-gray-700">
                        SAR {formatPrice(car.sellingPrice)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/966920032590?text=${encodeURIComponent(`Hi, I'm interested in reserving this car:\n\n🚗 ${car.year} ${car.make} ${car.model}${car.exactModel ? ` ${car.exactModel}` : ''}\n💰 Price: SAR ${formatPrice(car.sellingPrice)}\n🏢 Dealership: ${dealership?.name || 'N/A'}\n\nPlease provide more details.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primaryBtn hover:bg-primaryBtn-600 text-white font-semibold py-2.5 px-4 rounded-lg transition text-center shadow-sm hover:shadow-md"
                      >
                        {t.reserve}
                      </a>
                      {dealership?.phone && (
                        <a
                          href={`tel:${dealership.phone}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-lg transition"
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
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-10 transition"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative w-[90%] md:w-[70%] lg:w-[40%] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
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
                <div className="text-right rtl:text-left">
                  <span className="text-xs text-gray-400 block">{t.startingFrom}</span>
                  <p className="text-2xl font-bold text-gray-800">
                    SAR {formatPrice(selectedCar.sellingPrice)}
                  </p>
                </div>
              </div>

              {/* Dealership Info */}
              {dealership && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {t.dealershipInfo}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dealership.logo?.url && (
                      <div className="flex items-center">
                        <img
                          className="object-contain w-[150px]"
                          src={dealership.logo.url}
                          alt={dealership.name}
                        />
                      </div>
                    )}
                    {dealership.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-amber-500" />
                        <a
                          href={`tel:${dealership.phone}`}
                          className="font-medium text-amber-600 hover:underline"
                        >
                          {dealership.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {dealership.website && (
                    <a
                      href={dealership.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-4 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t.visitWebsite}
                    </a>
                  )}
                </div>
              )}

              {/* Contact Button */}
              <div className="mt-6 flex gap-4">
                {dealership?.phone && (
                  <a
                    href={`tel:${dealership.phone}`}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
                  >
                    <Phone className="h-5 w-5 inline-block mr-2" />
                    {t.callDealership}
                  </a>
                )}
                <Link
                  href="/tradein"
                  className="flex-1 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold py-3 px-6 rounded-lg transition text-center"
                >
                  {t.tradeInYourCar}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealershipCars;
