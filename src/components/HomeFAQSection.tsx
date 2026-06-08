interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  isAr: boolean;
}

export default function HomeFAQSection({ isAr }: Props) {
  const faqItems: FAQItem[] = isAr
    ? [
        {
          question: "ما هي بادلها؟",
          answer:
            "بادلها هي منصة متكاملة للسيارات تتيح لك فحص سيارتك وتقييمها وبيعها أو استبدالها أو عرضها في المزاد بسرعة وشفافية.",
        },
        {
          question: "من يمكنه استخدام بادلها؟",
          answer:
            "يمكن لأي شخص يرغب في بيع سيارته أو استبدالها أو تقييمها استخدام خدماتنا. خدماتنا متاحة للأفراد والشركات.",
        },
      ]
    : [
        {
          question: "What is Baddelha?",
          answer:
            "Baddelha is an all-in-one car platform that allows you to inspect, value, sell, exchange, or auction your car quickly and transparently.",
        },
        {
          question: "Who can use Baddelha?",
          answer:
            "Anyone looking to sell, exchange, or evaluate a car. Our services are available for both individuals and businesses.",
        },
      ];

  const inspectionItems: FAQItem[] = isAr
    ? [
        {
          question: "كم يستغرق وقت الفحص؟",
          answer:
            "عادةً ما يستغرق الفحص من 15 إلى 30 دقيقة حسب حالة السيارة.",
        },
        {
          question: "هل يمكنني بيع سيارتي مباشرة بعد الفحص؟",
          answer: "نعم، بعد استلام التقييم يمكنك اختيار بيع سيارتك فوراً.",
        },
        {
          question: "هل يمكنني استبدال سيارتي بسيارة جديدة؟",
          answer:
            "بالتأكيد، يمكنك استخدام قيمة سيارتك لاستبدالها بسيارة جديدة متاحة مع دفع الفرق.",
        },
        {
          question: "هل يجب علي بيع سيارتي بعد الفحص؟",
          answer: "لا، الفحص والتقييم لا يلزمانك ببيع سيارتك.",
        },
        {
          question: "لماذا يجب أن أثق في بادلها؟",
          answer:
            "نحن نعمل بشفافية واحترافية مع التركيز على رضا العملاء. ثقتكم هي أولويتنا.",
        },
      ]
    : [
        {
          question: "How long does the inspection take?",
          answer:
            "The inspection usually takes 15–30 minutes, depending on the vehicle.",
        },
        {
          question: "Can I sell my car immediately after inspection?",
          answer:
            "Yes. Once you receive the valuation, you can choose to sell your car instantly.",
        },
        {
          question: "Can I exchange my car for another new vehicle?",
          answer:
            "Absolutely. You can use your car's value to exchange it for another new available vehicle and paying the difference.",
        },
        {
          question: "Do I have to sell my car after inspection?",
          answer:
            "No. The inspection and valuation do not obligate you to sell.",
        },
        {
          question: "Why should I trust Baddelha?",
          answer:
            "We operate with transparency, professionalism, and a customer-first approach. Your trust is our priority.",
        },
      ];

  const allItems = [...faqItems, ...inspectionItems];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const heading = isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section
        dir={isAr ? "rtl" : "ltr"}
        className="py-16 px-4 max-w-4xl mx-auto"
        aria-label={heading}
      >
        <h2 className="text-3xl font-bold text-center mb-10">{heading}</h2>
        <div className="space-y-4">
          {allItems.map((item, i) => (
            <details key={i} className="border border-gray-200 rounded-lg p-4 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {item.question}
                <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
