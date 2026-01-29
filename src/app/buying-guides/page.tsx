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

        {/* Search and Filter */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder={isAr ? 'ابحث عن أدلة الشراء...' : 'Search buying guides...'}
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryBtn"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                dir={isAr ? 'rtl' : 'ltr'}
              />
              <Search className="absolute top-3 right-3 text-gray-400" size={20} />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg md:hidden"
            >
              <Filter size={18} />
              <span>{isAr ? 'تصفية' : 'Filter'}</span>
            </button>
          </div>
          
          {/* Categories - Desktop */}
          <div className="hidden md:flex flex-wrap gap-2 mt-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-primaryBtn text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {isAr ? category.nameAr : category.name}
              </button>
            ))}
          </div>
          
          {/* Categories - Mobile */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-4 md:hidden">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-primaryBtn text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {isAr ? category.nameAr : category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Featured Guides */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{isAr ? 'أدلة مميزة' : 'Featured Guides'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGuides.map(guide => (
              <div key={guide.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/buying-guides/${guide.id}`)}>
                <div className="relative h-64 overflow-hidden">
                  <img src={guide.image} alt={isAr ? guide.titleAr : guide.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-primaryBtn text-white text-xs font-bold px-3 py-1 rounded-full">
                    {isAr ? 'مميز' : 'Featured'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{isAr ? guide.categoryAr : guide.category}</span>
                    <div className="flex items-center mx-4">
                      <Clock size={14} className="mr-1" />
                      <span>{isAr ? guide.readTimeAr : guide.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{isAr ? guide.dateAr : guide.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{isAr ? guide.titleAr : guide.title}</h3>
                  <p className="text-gray-600 mb-4">{isAr ? guide.excerptAr : guide.excerpt}</p>
                  <div className="flex items-center text-primaryBtn font-medium">
                    <span>{isAr ? 'اقرأ المزيد' : 'Read more'}</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Guides */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{isAr ? 'جميع الأدلة' : 'All Guides'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularGuides.map(guide => (
              <div key={guide.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/buying-guides/${guide.id}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={guide.image} alt={isAr ? guide.titleAr : guide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{isAr ? guide.categoryAr : guide.category}</span>
                    <div className="flex items-center mx-3">
                      <Clock size={12} className="mr-1" />
                      <span>{isAr ? guide.readTimeAr : guide.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{isAr ? guide.titleAr : guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{isAr ? guide.excerptAr : guide.excerpt}</p>
                  <div className="flex items-center text-primaryBtn font-medium text-sm">
                    <span>{isAr ? 'اقرأ المزيد' : 'Read more'}</span>
                    <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="bg-[#3d3d40] rounded-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {isAr ? 'احصل على أحدث أدلة الشراء' : 'Get the Latest Buying Guides'}
              </h3>
              <p className="text-blue-100">
                {isAr ? 'اشترك في نشرتنا الإخبارية للحصول على أحدث النصائح والأدلة مباشرة إلى بريدك الوارد.' : 
                'Subscribe to our newsletter to receive the latest tips and guides directly to your inbox.'}
              </p>
            </div>
            <div className="md:w-1/3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} 
                  className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none bg-white" 
                  dir={isAr ? 'rtl' : 'ltr'}
                />
                <button className="bg-primaryBtn hover:bg-primaryBtn-600 text-white px-4 py-3 rounded-r-lg transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
              <p className="text-xs text-blue-200 mt-2">
                {isAr ? 'لن نرسل لك أي بريد عشوائي. اطلع على سياسة الخصوصية الخاصة بنا.' : 
                'We won\'t send you spam. Check our privacy policy.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BuyingGuides;