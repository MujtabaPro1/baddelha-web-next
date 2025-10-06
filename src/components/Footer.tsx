'use client';
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import Image from 'next/image';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  return (
    <footer className="bg-[#3d3d40] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold">
                <Image 
                width={150}
                height={70}
                src="/logo-light.png" alt="Baddelha Logo" 
                className="w-[150px] h-[70px] object-cover"
                />
              </span>
            </div>
            <p className="text-white mb-6 max-w-md">
              {lang[languageContent].footerText}
            </p>
            <div className="flex space-x-4 mb-6">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="bg-[#3d3d40] p-2 rounded-full transition"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">{lang[languageContent].quickLinks}</h3>
            <ul className="space-y-3">
              {[lang[languageContent].buy, lang[languageContent].sell, lang[languageContent].tradeIn].map((link, index) => (
                <li key={index}>
                  <a href={index == 0 ? "/buy" : index == 1 ? "/" : "/tradein"} className="text-white hover:text-amber-500 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">{lang[languageContent].legal}</h3>
            <ul className="space-y-3">
              {[lang[languageContent].aboutUs, lang[languageContent].contactUs, lang[languageContent].privacyPolicy, lang[languageContent].termsOfService].map((link, index) => (
                <li key={index}>
                  <a href={index == 0 ? "/about" : index == 1 ? "/contactus" : index == 2 ? "/privacy" : "/terms"} className="text-white hover:text-amber-500 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">{lang[languageContent].contactUs}</h3>
            <address className="not-italic text-white space-y-3">
              <p>{lang[languageContent].address}</p>
              <p className="pt-2">
                <a dir="ltr" href="tel:+966920032590" className="hover:text-amber-500 transition">
                   920032590
                </a>
              </p>
              <p>
                <a href="mailto:info@baddelha.sa" className="hover:text-amber-500 transition flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@baddelha.sa
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} BADDELHA |
بدلها. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white">
              <a href="/terms" className="hover:text-amber-500 transition">{lang[languageContent].termsOfService}</a>
              <a href="/privacy" className="hover:text-amber-500 transition">{lang[languageContent].privacyPolicy}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;