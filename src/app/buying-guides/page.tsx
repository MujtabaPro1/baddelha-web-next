'use client'

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, ChevronRight, Clock, Calendar, ArrowRight, Filter } from 'lucide-react';
import { useState } from 'react';

// Sample data for guides
const guides = [
  {
    id: 1,
    title: 'Complete Guide to Buying Your First Car in UAE',
    titleAr: 'دليل شامل لشراء سيارتك الأولى في الإمارات',
    excerpt: 'Everything you need to know about purchasing your first vehicle in the UAE market.',
    excerptAr: 'كل ما تحتاج لمعرفته حول شراء سيارتك الأولى في سوق الإمارات.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=640&auto=format&fit=crop',
    category: 'First-time buyers',
    categoryAr: 'المشترون لأول مرة',
    readTime: '8 min read',
    readTimeAr: '8 دقائق للقراءة',
    date: 'Jan 15, 2026',
    dateAr: '15 يناير 2026',
    featured: true
  },
  {
    id: 2,
    title: 'How to Finance Your Dream Car',
    titleAr: 'كيفية تمويل سيارة أحلامك',
    excerpt: 'Explore financing options, interest rates, and payment plans to make your dream car affordable.',
    excerptAr: 'استكشف خيارات التمويل وأسعار الفائدة وخطط الدفع لجعل سيارة أحلامك بأسعار معقولة.',
    image: 'https://images.unsplash.com/photo-1589262804704-c5aa9e6def89?q=80&w=640&auto=format&fit=crop',
    category: 'Financing',
    categoryAr: 'التمويل',
    readTime: '6 min read',
    readTimeAr: '6 دقائق للقراءة',
    date: 'Jan 10, 2026',
    dateAr: '10 يناير 2026',
    featured: true
  },
  {
    id: 3,
    title: 'Electric vs. Gasoline: Which is Right for You?',
    titleAr: 'السيارات الكهربائية مقابل البنزين: أيهما مناسب لك؟',
    excerpt: 'Compare the pros and cons of electric and gasoline vehicles in the UAE environment.',
    excerptAr: 'قارن بين إيجابيات وسلبيات السيارات الكهربائية والبنزين في بيئة الإمارات.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=640&auto=format&fit=crop',
    category: 'Comparison',
    categoryAr: 'مقارنة',
    readTime: '10 min read',
    readTimeAr: '10 دقائق للقراءة',
    date: 'Dec 28, 2025',
    dateAr: '28 ديسمبر 2025',
    featured: false
  },
  {
    id: 4,
    title: 'Understanding Car Insurance in UAE',
    titleAr: 'فهم تأمين السيارات في الإمارات',
    excerpt: 'Learn about the different types of car insurance and what coverage is best for your needs.',
    excerptAr: 'تعرف على أنواع مختلفة من تأمين السيارات وما هي التغطية الأفضل لاحتياجاتك.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=640&auto=format&fit=crop',
    category: 'Insurance',
    categoryAr: 'التأمين',
    readTime: '7 min read',
    readTimeAr: '7 دقائق للقراءة',
    date: 'Dec 20, 2025',
    dateAr: '20 ديسمبر 2025',
    featured: false
  },
  {
    id: 5,
    title: 'Top 10 SUVs for Families in 2026',
    titleAr: 'أفضل 10 سيارات دفع رباعي للعائلات في 2026',
    excerpt: 'Discover the best family-friendly SUVs with top safety ratings and comfort features.',
    excerptAr: 'اكتشف أفضل سيارات الدفع الرباعي المناسبة للعائلات مع أعلى تصنيفات السلامة وميزات الراحة.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=640&auto=format&fit=crop',
    category: 'Family Cars',
    categoryAr: 'سيارات العائلة',
    readTime: '9 min read',
    readTimeAr: '9 دقائق للقراءة',
    date: 'Dec 15, 2025',
    dateAr: '15 ديسمبر 2025',
    featured: false
  },
  {
    id: 6,
    title: 'How to Negotiate the Best Price When Buying a Car',
    titleAr: 'كيفية التفاوض على أفضل سعر عند شراء سيارة',
    excerpt: 'Expert tips and strategies to help you get the best deal on your next car purchase.',
    excerptAr: 'نصائح واستراتيجيات الخبراء لمساعدتك في الحصول على أفضل صفقة عند شراء سيارتك التالية.',
    image: 'https://images.unsplash.com/photo-1560250056-07ba64664864?q=80&w=640&auto=format&fit=crop',
    category: 'Negotiation',
    categoryAr: 'التفاوض',
    readTime: '8 min read',
    readTimeAr: '8 دقائق للقراءة',
    date: 'Dec 5, 2025',
    dateAr: '5 ديسمبر 2025',
    featured: false
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Guides', nameAr: 'جميع الأدلة' },
  { id: 'first-time', name: 'First-Time Buyers', nameAr: 'المشترون لأول مرة' },
  { id: 'financing', name: 'Financing', nameAr: 'التمويل' },
  { id: 'comparison', name: 'Car Comparison', nameAr: 'مقارنة السيارات' },
  { id: 'insurance', name: 'Insurance', nameAr: 'التأمين' },
  { id: 'family', name: 'Family Cars', nameAr: 'سيارات العائلة' },
  { id: 'negotiation', name: 'Negotiation', nameAr: 'التفاوض' }
];

const BuyingGuides = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const featuredGuides = guides.filter(guide => guide.featured);
  const regularGuides = guides.filter(guide => !guide.featured);

  return (
    <div className={`min-h-screen bg-gray-50 pt-[120px] pb-16 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 mb-4">
            <span className="font-medium text-gray-900">Baddelha</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{isAr ? 'أدلة الشراء' : 'Buying Guides'}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{isAr ? 'أدلة الشراء والنصائح' : 'Car Buying Guides & Tips'}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isAr ? 'اكتشف نصائح الخبراء ودليلنا الشامل لمساعدتك في اتخاذ قرارات مستنيرة عند شراء سيارتك التالية.' : 
            'Discover expert tips and our comprehensive guide to help you make informed decisions when purchasing your next car.'}
          </p>
        </header>

        {/* Valuation Process Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">{isAr ? 'عملية تقييم السيارة' : 'Car Valuation Process'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primaryBtn rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">{isAr ? 'احصل على تقييم مجاني عبر الإنترنت' : 'Get a Free Online Valuation'}</h3>
              <p className="text-gray-600 text-sm">{isAr ? 'قيّم سيارتك مجانًا في دقائق معدودة وابدأ العملية فورًا.' : 'Evaluate your car for free in just a few minutes and get started instantly.'}</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primaryBtn rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">{isAr ? 'احجز موعد فحص مجاني' : 'Book a Free Inspection Appointment'}</h3>
              <p className="text-gray-600 text-sm">{isAr ? 'اختر الوقت المناسب لإجراء فحص احترافي لسيارتك بدون أي رسوم.' : 'Choose a convenient time for a professional inspection at no cost.'}</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primaryBtn rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">{isAr ? 'استلم تقييمك في 30 دقيقة' : 'Receive Your Valuation in 30 Minutes'}</h3>
              <p className="text-gray-600 text-sm">{isAr ? 'بعد الفحص، احصل على سعر عادل مبني على بيانات السوق — وأكمل العملية في 30 دقيقة.' : 'After the inspection, get a fair market-based price — and complete the process in just 30 minutes.'}</p>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
};

export default BuyingGuides;