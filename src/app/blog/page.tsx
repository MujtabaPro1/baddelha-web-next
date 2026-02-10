'use client'

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';

type FeaturedArticle = {
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
};

const Blog = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const categoriesEn = [
    'Car Valuation',
    'Selling Your Car',
    'Vehicle Inspection',
    'Saudi Car Market',
    'Baddelha Guides',
  ];

  const categoriesAr = [
    'تقييم السيارات',
    'بيع السيارة',
    'فحص المركبات',
    'سوق السيارات في السعودية',
    'أدلة بدّلها',
  ];

  const featured: FeaturedArticle[] = [
    {
      titleEn: 'How Is Your Car Really Valued in Saudi Arabia?',
      titleAr: 'كيف يتم تقييم سيارتك فعليًا في السعودية؟',
      excerptEn:
        'Many car owners rely on random online prices. Learn how real car valuation works in the Saudi market and what factors actually affect your car’s selling price.',
      excerptAr:
        'كثير من المالكين يعتمدون على أسعار عشوائية من الإنترنت. تعرّف كيف يتم تقييم السيارة فعليًا في السوق السعودي وما العوامل التي تؤثر على سعر البيع.',
    },
    {
      titleEn: '5 Mistakes That Lower Your Car Price Before Selling',
      titleAr: '5 أخطاء تقلل سعر سيارتك قبل البيع',
      excerptEn:
        'From accident history to poor inspection timing, discover common mistakes that reduce your car’s value — and how to avoid them before selling.',
      excerptAr:
        'من سجل الحوادث إلى توقيت الفحص، اكتشف الأخطاء الشائعة التي تقلل قيمة سيارتك وكيف تتجنبها قبل البيع.',
    },
    {
      titleEn: 'Why Online Car Prices Are Often Misleading',
      titleAr: 'لماذا أسعار السيارات على الإنترنت قد تكون مضللة؟',
      excerptEn:
        'Not all car listings reflect real market value. Here’s why advertised prices differ from what buyers actually pay in Saudi Arabia.',
      excerptAr:
        'ليست كل الإعلانات تعكس القيمة الحقيقية. إليك لماذا تختلف الأسعار المعروضة عن الأسعار التي يدفعها المشترون فعليًا في السعودية.',
    },
    {
      titleEn: 'What Happens During a Professional Car Inspection?',
      titleAr: 'ماذا يحدث أثناء فحص السيارة الاحترافي؟',
      excerptEn:
        'We explain step by step how a professional car inspection works and how it protects both sellers and buyers.',
      excerptAr: 'نشرح لك خطوة بخطوة كيف يتم فحص السيارة بشكل احترافي وكيف يحمي البائع والمشتري.',
    },
    {
      titleEn: 'When Is the Best Time to Sell Your Car in Saudi Arabia?',
      titleAr: 'ما هو أفضل وقت لبيع سيارتك في السعودية؟',
      excerptEn:
        'Seasonality matters. Learn which months and market conditions help you sell your car faster and at a better price.',
      excerptAr: 'الموسمية تفرق. تعرّف على الأشهر والظروف التي تساعدك تبيع أسرع وبسعر أفضل.',
    },
    {
      titleEn: 'How Baddelha Gives You a Fair Car Price',
      titleAr: 'كيف تمنحك بدّلها سعرًا عادلًا لسيارتك',
      excerptEn:
        'Our pricing model is built on real Saudi market data, professional inspections, and transparency — here’s how it works.',
      excerptAr: 'نموذج التسعير لدينا مبني على بيانات سوق سعودية حقيقية وفحص احترافي وشفافية — تعرّف كيف يعمل.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
            <span className="font-medium text-gray-900">Baddelha Blog</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{isAr ? 'مقالات ونصائح' : 'Insights & guides'}</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
            {isAr ? 'بيع سيارتك في السعودية… بوضوح وثقة' : 'Car Selling Made Clear in Saudi Arabia'}
          </h1>
          <p className={`mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto ${isAr ? 'text-right' : ''}`}>
            {isAr
              ? 'محتوى ونصائح من خبراء تساعدك تعرف القيمة الحقيقية لسيارتك، وتتجنب الأخطاء الشائعة، وتبيع بسرعة وبسعر عادل مع بدّلها.'
              : 'Expert insights, accurate pricing tips, and professional inspection guides to help you sell your car faster, smarter, and with confidence using Baddelha.'}
          </p>
          <p className={`mt-4 text-sm text-gray-500 max-w-3xl mx-auto ${isAr ? 'text-right' : ''}`}>
            {isAr
              ? 'اكتشف مقالات عن تقييم السيارات، فحص المركبات، وسوق السيارات في السعودية. بدّلها تساعدك تبيع سيارتك بثقة وسعر عادل.'
              : 'Discover expert articles on car valuation, inspections, and the Saudi car market. Learn how to get a fair price and sell your car easily with Baddelha.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primaryBtn text-white px-6 py-3 font-semibold hover:bg-primaryBtn-600 transition-colors"
            >
              {isAr ? 'ابدأ القراءة' : 'Start Reading'}
              <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 text-gray-900 px-6 py-3 font-semibold hover:bg-gray-50 transition-colors"
            >
              {isAr ? 'احسب سعر سيارتك الآن' : 'Get Your Car Price Now'}
            </button>
          </div>
        </header>

        <section className="mb-14">
          <h2 className={`text-2xl font-semibold text-gray-900 ${isAr ? 'text-right' : ''}`}>{isAr ? 'التصنيفات' : 'Categories'}</h2>
          <p className={`mt-2 text-gray-600 ${isAr ? 'text-right' : ''}`}>{isAr ? 'اختر موضوعًا يهمك.' : 'Pick a topic you care about.'}</p>

          <div className={`mt-6 flex flex-wrap gap-2 ${isAr ? 'justify-end' : ''}`}>
            {(isAr ? categoriesAr : categoriesEn).map((c) => (
              <span key={c} className="inline-flex items-center rounded-full bg-white border border-gray-200 px-4 py-2 text-sm text-gray-700">
                {c}
              </span>
            ))}
          </div>
        </section>

        <section id="featured" className="mb-14">
          <h2 className={`text-2xl font-semibold text-gray-900 ${isAr ? 'text-right' : ''}`}>{isAr ? 'مقالات مميزة' : 'Featured Articles'}</h2>
          <p className={`mt-2 text-gray-600 ${isAr ? 'text-right' : ''}`}>{isAr ? 'جاهزة للنشر — ابدأ من هنا.' : 'Ready to publish — start here.'}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((a) => (
              <article key={a.titleEn} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className={`text-lg font-semibold text-gray-900 ${isAr ? 'text-right' : ''}`}>{isAr ? a.titleAr : a.titleEn}</h3>
                <p className={`mt-3 text-gray-600 leading-relaxed ${isAr ? 'text-right' : ''}`}>{isAr ? a.excerptAr : a.excerptEn}</p>
                <div className={`mt-5 ${isAr ? 'text-right' : ''}`}>
                  <span className="text-sm font-semibold text-primaryBtn">{isAr ? 'اقرأ المزيد (قريبًا)' : 'Read more (soon)'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10">
            <h2 className={`text-2xl font-semibold text-gray-900 ${isAr ? 'text-right' : ''}`}>{isAr ? 'مقال نموذجي (مختصر)' : 'Sample Short Article'}</h2>
            <p className={`mt-2 text-gray-600 ${isAr ? 'text-right' : ''}`}>{isAr ? 'محتوى جاهز للنسخ والاستخدام في CMS.' : 'Copy-ready content for CMS.'}</p>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">How Baddelha Calculates Your Car Price</h3>
                <div className="mt-3 space-y-3 text-gray-700 leading-relaxed">
                  <p>At Baddelha, car valuation is never based on guesswork.</p>
                  <p>
                    We analyze real Saudi market data, vehicle condition, accident history, and professional inspection results to determine a fair and accurate price.
                  </p>
                  <p>
                    Unlike random online listings, our pricing reflects what cars actually sell for — not inflated expectations.
                  </p>
                  <p>
                    This transparent approach is why thousands of car owners trust Baddelha to sell their cars quickly and confidently.
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/step1')}
                    className="inline-flex items-center gap-2 rounded-lg bg-primaryBtn text-white px-6 py-3 font-semibold hover:bg-primaryBtn-600 transition-colors"
                  >
                    Get your car price in minutes
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold text-gray-900 ${isAr ? 'text-right' : ''}`}>{isAr ? 'كيف تحسب بدّلها سعر سيارتك' : 'Arabic Version'}</h3>
                <div className={`mt-3 space-y-3 text-gray-700 leading-relaxed ${isAr ? 'text-right' : ''}`}>
                  <p>في بدّلها، تقييم السيارة ما يعتمد على التخمين.</p>
                  <p>
                    نحلل بيانات حقيقية من سوق السيارات في السعودية، بالإضافة إلى حالة السيارة وسجل الحوادث ونتائج الفحص، لنحدد لك سعرًا عادلًا وواضحًا.
                  </p>
                  <p>على عكس الإعلانات المبالغ فيها، نحن نعطيك سعر يعكس قيمة سيارتك الفعلية في السوق.</p>
                </div>
                <div className={`mt-6 ${isAr ? 'text-right' : ''}`}>
                  <button
                    onClick={() => router.push('/step1')}
                    className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 text-gray-900 px-6 py-3 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {isAr ? 'احسب سعر سيارتك الآن' : 'Calculate your price'}
                    <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-secondary rounded-xl p-8 md:p-10 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className={`text-2xl font-bold ${isAr ? 'text-right' : ''}`}>{isAr ? 'جاهز تبدأ؟' : 'Ready to start?'}</h2>
                <p className={`mt-2 text-white/80 max-w-2xl ${isAr ? 'text-right' : ''}`}>
                  {isAr
                    ? 'احصل على تقييم عادل وفحص احترافي وخطوات واضحة — كلها في مكان واحد.'
                    : 'Get a fair valuation, professional inspection, and clear next steps — all in one place.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primaryBtn text-white px-6 py-3 font-semibold hover:bg-primaryBtn-600 transition-colors"
                >
                  {isAr ? 'احسب سعر سيارتك الآن' : 'Get Your Car Price Now'}
                  <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => router.push('/locations')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 text-white px-6 py-3 font-semibold hover:bg-white/15 transition-colors"
                >
                  {isAr ? 'زيارة الفروع' : 'Visit Locations'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;