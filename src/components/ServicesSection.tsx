import React from 'react';
import { 
  Repeat, 
  FileText, 
  Clock, 
  Sparkles, 
  ThumbsUp, 
  Heart 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import RiyalIcon from './icons/RiyalIcon';
import SteeringIcon from './icons/SteeringIcon';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  btnColor: string;
  btnText: string;
  btnLink: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, 
  title, 
  description, 
  bgColor, 
  textColor,
  btnColor,
  btnText,
  btnLink
}) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 transition-transform hover:scale-105 shadow-md`}>
      <div className={`${textColor} p-3 rounded-full inline-block bg-white/10 mb-4`}>
        {icon}
      </div>
      <h3 className={`text-xl font-semibold mb-3 ${textColor}`}>{title}</h3>
      <p className={`mb-5 ${textColor} opacity-90`}>{description}</p>
      <button onClick={() => window.location.href = btnLink} className={`${btnColor} font-medium py-2 px-4 rounded-lg transition hover:opacity-90`}>
        {btnText}
      </button>
    </div>
  );
};



const ServicesSection: React.FC = () => {

  const { language } = useLanguage();

  const languageContent = language === 'ar' ? 'ar' : 'en';


  const services = [
    {
      icon: <SteeringIcon className="h-6 w-6" />,
      title: lang[languageContent].buyTitle,
      description: lang[languageContent].buyDesc,
      bgColor: "bg-gradient-to-r from-blue-800 to-blue-700",
      textColor: "text-white",
      btnColor: "bg-gradient-to-r from-amber-500 to-amber-400 text-white",
      btnLink: "/buy",
      btnText: lang[languageContent].browseCarsBtnText
    },
    {
      icon: <RiyalIcon className="h-6 w-6" />,
      title: lang[languageContent].sellTitle,
      description: lang[languageContent].sellDesc,
      bgColor: "bg-gradient-to-r from-blue-800 to-blue-700",
      textColor: "text-white",
      btnColor: "bg-gradient-to-r from-amber-500 to-amber-400 text-white",
      btnLink: "/",
      btnText: lang[languageContent].getOfferBtnText
    },
    {
      icon: <Repeat className="h-6 w-6" />,
      title: lang[languageContent].tradeInTitle,
      description: lang[languageContent].tradeInDesc,
      bgColor: "bg-gradient-to-r from-blue-800 to-blue-700",
      textColor: "text-white",
      btnColor: "bg-gradient-to-r from-amber-500 to-amber-400 text-white",
      btnLink: "/tradein",
      btnText: lang[languageContent].tradeNowBtnText
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: lang[languageContent].bankValuationTitle,
      description: lang[languageContent].bankValuationDesc,
      bgColor: "bg-gradient-to-r from-blue-800 to-blue-700",
      textColor: "text-white",
      btnColor: "bg-gradient-to-r from-amber-500 to-amber-400 text-white",
      btnLink: "/bank-valuation",
      btnText: lang[languageContent].getValuationBtnText
    }
  ];
  
  const features = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: lang[languageContent].fastProcess,    
      description: lang[languageContent].completeTransactions
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: lang[languageContent].premiumService,
      description: lang[languageContent].dedicatedConcierge
    },
    {
      icon: <ThumbsUp className="h-5 w-5" />,
      title: lang[languageContent].bestValue,
      description: lang[languageContent].premiumServicesDesc
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: lang[languageContent].satisfaction,
      description: lang[languageContent].premiumServices
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#F7AF37] font-semibold text-sm uppercase tracking-wider">{lang[languageContent].ourServices}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{lang[languageContent].everythingYouNeedForYourCar}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {lang[languageContent].driveMarketProvidesComprehensiveAutomotiveServicesToMakeYourCarBuyingSellingAndOwnershipExperienceSeamlessAndEnjoyable}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold">{lang[languageContent].whyChooseDriveMarket}</h3>
            <p className="text-gray-600 mt-2">{lang[languageContent].experienceTheDifferenceWithOurPremiumCarServices}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-800 to-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;