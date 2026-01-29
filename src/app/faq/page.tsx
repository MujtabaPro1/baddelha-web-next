'use client'
import { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

const FAQ = ({bgWhite}: {bgWhite?: boolean}) => {
    const [openItem, setOpenItem] = useState<number | null>(null);

    const faqItems = [
        {
            question: "What is Baddelha?",
            answer: "Baddelha is an all-in-one car platform that allows you to inspect, value, sell, exchange, or auction your car quickly and transparently."
        },
        {
            question: "Who can use Baddelha?",
            answer: "Anyone looking to sell, exchange, or evaluate a car. Our services are available for both individuals and businesses."
        }
    ];

    const inspectionItems = [
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-gray-600">Everything you need to know about Baddelha</p>
                </div>

                {/* General Questions */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">General</h2>
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
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">Inspection & Valuation</h2>
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
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
                    <p className="text-lg text-gray-600 mb-8">Still have questions?</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/contactus" 
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primaryBtn text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <Phone className="h-5 w-5" />
                            Contact Us
                        </a>
                    </div>
                    
                    <p className="text-gray-500 mt-6">Our team is happy to help.</p>
                </div>}
            </div>
        </div>
    )
}

export default FAQ;