

'use client'
import { Check, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import lang  from '../../locale';

const WhyUs = () => {
    const router = useRouter();
    const { language } = useLanguage();
    const languageContent = language === 'ar' ? 'ar' : 'en';
    const t = lang[languageContent].whyUs;

    return (
        <div className="min-h-screen bg-gray-50 pt-[120px] pb-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">{t.title}</h1>
                    <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">{t.whatMakesUsDifferent}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {t.features.map((feature: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-6 h-6 bg-primaryBtn rounded-full flex items-center justify-center mt-1">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t.ctaTitle}</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t.ctaDescription}
                    </p>
                    
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primaryBtn text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                    >
                        {t.getStarted}
                        <ArrowRight className="h-5 w-5" />
                    </button>
                    
                    <div className="mt-12">
                        <p className="text-2xl font-bold text-gray-900">
                            {t.tagline} <span className="text-primaryBtn">{t.faster}</span> <span className="text-primaryBtn">{t.smarter}</span> <span className="text-primaryBtn">{t.trusted}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyUs