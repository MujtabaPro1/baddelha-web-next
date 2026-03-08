'use client'
import { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import lang  from '../../locale';

const FAQ = ({bgWhite}: {bgWhite?: boolean}) => {
    const [openItem, setOpenItem] = useState<number | null>(null);

    const { language } = useLanguage();
    const isAr = language === 'ar';

    const languageContent = language === 'ar' ? 'ar' : 'en';

    const faqItems =  isAr? [
  {
    question: "ما هي بادلها؟",
    answer: "بادلها هي منصة متكاملة للسيارات تتيح لك فحص سيارتك وتقييمها وبيعها أو استبدالها أو عرضها في المزاد بسرعة وشفافية."
  },
  {
    question: "من يمكنه استخدام بادلها؟",
    answer: "يمكن لأي شخص يرغب في بيع سيارته أو استبدالها أو تقييمها استخدام خدماتنا. خدماتنا متاحة للأفراد والشركات."
  }
]:  [
        {
            question: "What is Baddelha?",
            answer: "Baddelha is an all-in-one car platform that allows you to inspect, value, sell, exchange, or auction your car quickly and transparently."
        },
        {
            question: "Who can use Baddelha?",
            answer: "Anyone looking to sell, exchange, or evaluate a car. Our services are available for both individuals and businesses."
        }
    ];

    const inspectionItems = isAr ? [
  {
    question: "كم يستغرق وقت الفحص؟",
    answer: "عادةً ما يستغرق الفحص من 15 إلى 30 دقيقة حسب حالة السيارة."
  },
  {
    question: "هل يمكنني بيع سيارتي مباشرة بعد الفحص؟",
    answer: "نعم، بعد استلام التقييم يمكنك اختيار بيع سيارتك فوراً."
  },
  {
    question: "هل يمكنني استبدال سيارتي بسيارة جديدة؟",
    answer: "بالتأكيد، يمكنك استخدام قيمة سيارتك لاستبدالها بسيارة جديدة متاحة مع دفع الفرق."
  },
  {
    question: "هل يجب علي بيع سيارتي بعد الفحص؟",
    answer: "لا، الفحص والتقييم لا يلزمانك ببيع سيارتك."
  },
  {
    question: "لماذا يجب أن أثق في بادلها؟",
    answer: "نحن نعمل بشفافية واحترافية مع التركيز على رضا العملاء. ثقتكم هي أولويتنا."
  }
]:  [
        {
            question: "How long does the inspection take?",
            answer: "The inspection usually takes 15–30 minutes, depending on the vehicle."
        },
        {
            question: "Can I sell my car immediately after inspection?",
            answer: "Yes. Once you receive the valuation, you can choose to sell your car instantly."
        },
        {
            question: "Can I exchange my car for another new vehicle?",
            answer: "Absolutely. You can use your car's value to exchange it for another new available vehicle and paying the difference."
        },
        {
            question: "Do I have to sell my car after inspection?",
            answer: "No. The inspection and valuation do not obligate you to sell."
        },
        {
            question: "Why should I trust Baddelha?",
            answer: "We operate with transparency, professionalism, and a customer-first approach. Your trust is our priority."
        }
    ];



    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index);
    };

    return (
        <div className={bgWhite ? "min-h-screen bg-white mt-[24px] pt-[120px] pb-16" : "min-h-screen bg-white pt-[120px] pb-16"}>
            <div className={bgWhite ? "max-w-5xl mx-auto px-4" : "max-w-4xl mx-auto px-4"}>
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{lang[languageContent].frequently}</h1>
                    <p className="text-lg text-gray-600">{lang[languageContent].everythingYouNeeed}</p>
                </div>

                {/* General Questions */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">{lang[languageContent].general}</h2>
                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">{item.question}</span>
                                    <ChevronDown 
                                        className={`h-5 w-5 text-gray-500 transition-transform ${
                                            openItem === index ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {openItem === index && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-600">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inspection & Valuation */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">{lang[languageContent].inspectionAndValuations}</h2>
                    <div className="space-y-4">
                        {inspectionItems.map((item, index) => (
                            <div key={index + faqItems.length} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleItem(index + faqItems.length)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">{item.question}</span>
                                    <ChevronDown 
                                        className={`h-5 w-5 text-gray-500 transition-transform ${
                                            openItem === index + faqItems.length ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {openItem === index + faqItems.length && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-600">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Need More Help */}
                {!bgWhite && <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{lang[languageContent].needMoreHelp}</h2>
                    <p className="text-lg text-gray-600 mb-8">{lang[languageContent].stillHaveQuestions}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/contactus" 
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primaryBtn text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <Phone className="h-5 w-5" />
                            {lang[languageContent].contact}
                        </a>
                    </div>
                    
                    <p className="text-gray-500 mt-6">{lang[languageContent].ourTeam}</p>
                </div>}
            </div>
        </div>
    )
}

export default FAQ;