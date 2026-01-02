'use client';
import React from 'react';
import { Phone, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import { useRouter } from 'next/navigation';

const CtaSection: React.FC = () => {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const router = useRouter();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {lang[languageContent].readyToGetStarted}
              </h2>
              <p className="text-blue-100 mb-8 max-w-lg">
                {lang[languageContent].whetherYouAreLookingToBuySellOrTradeInOurTeamIsHereToHelpYouEveryStepOfTheWay}
                {lang[languageContent].contactUsTodayToGetTheProcessStarted}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <a href="tel:+966920032590" className="flex items-center bg-white/10 rounded-lg p-4 hover:bg-white/20 transition">
                  <Phone className="h-5 w-5 text-amber-400 mr-3 ml-2" />
                  <span dir="ltr" className="text-white font-medium">92 00 32590</span>
                </a>
                <a href="mailto:info@baddelha.sa" className="flex items-center bg-white/10 rounded-lg p-4 hover:bg-white/20 transition">
                  <Mail className="h-5 w-5 text-amber-400 mr-3 ml-2" />
                  <span className="text-white font-medium">info@baddelha.sa</span>
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                onClick={()=>{
                  document.scrollingElement?.scrollTo({
                    top: document.getElementById('valuation')?.offsetTop || 0,
                    behavior: 'smooth'
                  });
                }}
                className="bg-amber-500 hover:bg-amber-400 text-blue-900 font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 flex items-center justify-center">
                  {lang[languageContent].scheduleAppointment} {language == 'en' ? <ArrowRight className="ml-2 h-5 w-5" /> : <ArrowLeft className="mr-2 h-5 w-5" />}
                </button>
                <button 
                onClick={()=>{
                  router.push('/about');
                }}
                className="bg-transparent cursor-pointer border-2 border-white hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-lg transition">
                  {lang[languageContent].learnMore}
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-url bg-cover bg-center min-h-[300px] md:min-h-0">
              <div className="h-full w-full bg-blue-900/30 backdrop-blur-sm p-10 md:p-12 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{lang[languageContent].getFreeCarValuation}</h3>
                  <p className="text-blue-100 mb-6">
                    {lang[languageContent].getFreeCarValuationDesc}
                  </p>
                  <button
                  onClick={() => {
                    document.scrollingElement?.scrollTo({
                      top: document.getElementById('valuation')?.offsetTop || 0,
                      behavior: 'smooth'
                    });
                  }}
                  className="w-full bg-white hover:bg-gray-100 text-blue-800 font-semibold py-3 px-6 rounded-lg transition">
                    {lang[languageContent].startFreeValuation}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;