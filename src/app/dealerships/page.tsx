'use client';
import React, { useState, useEffect } from 'react';
import {
  Building2,
  ChevronRight,
  Lock
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { useLanguage } from '../../contexts/LanguageContext';
import lang from '../../locale';
import Link from 'next/link';
import LoginModal from '../../components/LoginModal';

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
  displayId?: string;
}

const Dealerships: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const t: any = lang[language === 'ar' ? 'ar' : 'en'].buy_page;

  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check auth state
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    setIsAuthenticated(!!authToken);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchDealerships = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/api/1.0/dealership/find-all');
        const dealershipsData = response?.data?.data || [];
        setDealerships(dealershipsData);
      } catch (err) {
        console.error('Error fetching dealerships:', err);
        setError('Failed to load dealerships. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDealerships();
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAuthenticated(true);
  };

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm p-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 mb-6">
              <Lock className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {t.loginRequired || 'Login Required'}
            </h1>
            <p className="text-gray-500 mb-6">
              {t.loginRequiredDescription || 'Please sign in to view our dealership partners and browse new cars.'}
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-primaryBtn hover:bg-primaryBtnHover text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {t.signIn || 'Sign In'}
            </button>
          </div>
        </div>
        <LoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

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
        <div className="relative container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              {t.dealershipsTitle}
            </h1>
            <p className="text-lg text-gray-300">
              {t.dealershipsSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse flex flex-col">
                <div className="h-32 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
              <Building2 className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.errorLoadingDealerships}</h3>
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
        {!loading && !error && dealerships.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.noDealershipsAvailable}</h3>
            <p className="text-gray-500">{t.noDealershipsDescription}</p>
          </div>
        )}

        {/* Dealerships Grid */}
        {!loading && !error && dealerships.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {dealerships.length} {t.dealershipsFound}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dealerships.map((dealership) => (
                <Link
                  key={dealership.id}
                  href={`/dealership/${dealership.id}`}
                  className="group bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Logo */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 h-full w-full flex items-center justify-center p-3">
                      {dealership.logo?.url ? (
                        <img
                          src={dealership.logo.url}
                          alt={dealership.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-gray-300" />
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {dealership.name}
                    </h3>

                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-primaryBtn font-semibold group-hover:text-primaryBtn-600 transition-colors">
                      <span>{t.viewCars}</span>
                      <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 ${isAr ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dealerships;
