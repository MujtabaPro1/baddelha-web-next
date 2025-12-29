
'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const { language, setLanguage } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const pathname = usePathname();
  const router = useRouter();

  // Function to check auth state from localStorage
  const checkAuthState = () => {
    const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    setIsAuthenticated(!!authToken);
    
    const userDetailsStr = localStorage.getItem('userDetails');
    if (userDetailsStr) {
      try {
        setUserDetails(JSON.parse(userDetailsStr));
      } catch (e) {
        console.error('Error parsing user details', e);
      }
    } else {
      setUserDetails({});
    }
  };

  // Client-side only code to handle localStorage
  useEffect(() => {
    checkAuthState();
    
    // Listen for auth state changes
    const handleAuthChange = () => checkAuthState();
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    // Handle logout on client-side only
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userDetails');
      setIsAuthenticated(false);
      setUserDetails({});
      router.push('/');
    }
  };

  const profileView = () => {
    return (
      <div className='relative'>
        <div 
          className='flex items-center gap-2 cursor-pointer' 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img 
            className='w-12 h-12 rounded-full'
            src="data:image/jpeg;base64,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" 
            alt="Profile" 
          />
          <div>
            <p className={`font-medium ${isScrolled ? 'text-[#000]' : 'text-white'}`}>{userDetails.firstName || 'User'}</p>
          </div>
        </div>
        

        {showProfileMenu && (
          <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
            <a 
              href="/appointments" 
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              aria-label={language === 'ar' ? 'المواعيد' : 'My Appointments'}
            >
             {language === 'ar' ? 'المواعيد' : 'My Appointments'}
            </a>
            <button 
              onClick={handleLogout}
              className='w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
             {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : pathname !== '/' ? 'bg-[#3d3d40] py-4' :  'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <span
              onClick={() => router.push('/')}
              className={`ml-2 text-xl font-bold ${isScrolled ? 'text-[#3d3d40]' : 'text-white'} cursor-pointer`}
              role="button"
              aria-label="Go to homepage">
               <Image
                src={!isScrolled ? '/logo-light.png' : '/logo.png'} 
                alt="Baddelha Logo" 
                width={150}
                height={50}
                style={{objectFit: 'cover',
                  width: '150px',
                  height: '50px'
                }}
                className="object-cover"
              />
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
            
              {/* <Link href={pathname?.includes('buy') ? '/' : '/buy'} className={`transition ${isScrolled ? 'text-[#3d3d40]' : 'text-white'} ml-2 mr-2`}>{pathname?.includes('buy') ? lang[languageContent].sell : lang[languageContent].buy}</Link>
              <Link href="/tradein" className={`transition ${isScrolled ? 'text-[#3d3d40]' : 'text-white'} ml-2 mr-2`}>{lang[languageContent].tradeIn}</Link> */}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div 
            onClick={() => router.push('tel:920032590')}
           dir="ltr"
            className={`flex items-center ${isScrolled ? 'text-[#3d3d40]' : 'text-white'}`}
            role="button"
            aria-label="Call 920032590">
              <Phone className="h-4 w-4  ml-2 mr-2" />
              <span className="font-medium ml-2 mr-2">+92 00 32590</span>
            </div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className={`flex items-center ${isScrolled ? 'text-[#3d3d40]' : 'text-white'} hover:text-[#f78f37] transition`}
              aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'} language`}
            >
              <Globe className="h-4 w-4 mr-1" />&nbsp;
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            {!isAuthenticated ? <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-gradient-to-r from-amber-500 to-amber-400 text-white px-5 py-2 rounded-full transition transform hover:scale-105">
              {lang[languageContent].signIn}
            </button> : profileView()}
          </div>
          
          <button 
            className={`md:hidden ${isScrolled ? 'text-[#3d3d40]' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4 transition-transform`}>
          <nav className="flex flex-col space-y-4 py-4">
            {/* <Link href="/buy" className="transition hover:text-blue-600 ml-2 mr-2">{language === 'ar' ? 'شراء' : 'Buy'}</Link>
            <Link href="/tradein" className="transition hover:text-blue-600 ml-2 mr-2">{language === 'ar' ? 'استبدال' : 'Trade-In'}</Link> */}
          </nav>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div 
            dir="ltr"
            onClick={() => router.push('tel:920032590')}
            className="flex items-center text-[#3d3d40] hover:text-[#f78f37] mt-4 cursor-pointer"
            role="button"
            aria-label="Call 920032590">
              <Phone className="h-4 w-4 mr-2" />
              <span className="font-medium ml-2 mr-2">920032590</span>
            </div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="mt-4 w-full flex items-center justify-center text-[#3d3d40] hover:text-[#f78f37] border border-gray-300 px-5 py-2 rounded-full transition"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            {!isAuthenticated && <button onClick={() => router.push('/login')} className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-gradient-to-r from-amber-500 to-amber-400 text-white px-5 py-2 rounded-full transition transform hover:scale-105">
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>}
            {isAuthenticated && <button onClick={handleLogout} className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-gradient-to-r from-amber-500 to-amber-400 text-white px-5 py-2 rounded-full transition transform hover:scale-105">
              {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </button>}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;