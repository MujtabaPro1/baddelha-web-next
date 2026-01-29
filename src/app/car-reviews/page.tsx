'use client'

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Filter, Star, ChevronRight, ThumbsUp, BarChart2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

// Sample data for car reviews
const carReviews = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2026,
    title: 'Toyota Camry 2026 Review: The Perfect Family Sedan',
    titleAr: 'مراجعة تويوتا كامري 2026: سيدان العائلة المثالية',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=640&auto=format&fit=crop',
    rating: 4.8,
    pros: ['Excellent fuel economy', 'Spacious interior', 'Advanced safety features'],
    prosAr: ['اقتصاد ممتاز في استهلاك الوقود', 'مساحة داخلية واسعة', 'ميزات أمان متقدمة'],
    cons: ['Average acceleration', 'Basic infotainment system'],
    consAr: ['تسارع متوسط', 'نظام ترفيهي أساسي'],
    excerpt: 'The 2026 Toyota Camry continues to impress with its reliability, comfort, and value for money.',
    excerptAr: 'تستمر تويوتا كامري 2026 في إثارة الإعجاب بموثوقيتها وراحتها وقيمتها مقابل المال.',
    category: 'Sedan',
    categoryAr: 'سيدان',
    date: 'Jan 20, 2026',
    dateAr: '20 يناير 2026',
    featured: true
  },
  {
    id: 2,
    make: 'Tesla',
    model: 'Model Y',
    year: 2026,
    title: 'Tesla Model Y 2026: The Electric SUV Redefined',
    titleAr: 'تسلا موديل Y 2026: إعادة تعريف سيارات الدفع الرباعي الكهربائية',
    image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=640&auto=format&fit=crop',
    rating: 4.7,
    pros: ['Impressive range', 'Fast charging', 'Cutting-edge technology'],
    prosAr: ['نطاق مثير للإعجاب', 'شحن سريع', 'تكنولوجيا متطورة'],
    cons: ['Premium price', 'Build quality inconsistencies'],
    consAr: ['سعر مرتفع', 'عدم اتساق جودة البناء'],
    excerpt: 'The 2026 Tesla Model Y continues to lead the electric SUV market with impressive performance and technology.',
    excerptAr: 'تستمر تسلا موديل Y 2026 في قيادة سوق سيارات الدفع الرباعي الكهربائية بأداء وتكنولوجيا مثيرة للإعجاب.',
    category: 'Electric SUV',
    categoryAr: 'دفع رباعي كهربائي',
    date: 'Jan 15, 2026',
    dateAr: '15 يناير 2026',
    featured: true
  },
  {
    id: 3,
    make: 'BMW',
    model: 'X5',
    year: 2026,
    title: 'BMW X5 2026: Luxury and Performance Combined',
    titleAr: 'بي إم دبليو X5 2026: مزيج من الفخامة والأداء',
    image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=640&auto=format&fit=crop',
    rating: 4.6,
    pros: ['Powerful engine options', 'Premium interior', 'Excellent handling'],
    prosAr: ['خيارات محرك قوية', 'مقصورة فاخرة', 'تحكم ممتاز'],
    cons: ['High maintenance cost', 'Expensive options'],
    consAr: ['تكلفة صيانة عالية', 'خيارات مكلفة'],
    excerpt: 'The 2026 BMW X5 delivers a perfect blend of luxury, technology, and driving dynamics.',
    excerptAr: 'تقدم بي إم دبليو X5 2026 مزيجًا مثاليًا من الفخامة والتكنولوجيا وديناميكيات القيادة.',
    category: 'Luxury SUV',
    categoryAr: 'دفع رباعي فاخر',
    date: 'Dec 28, 2025',
    dateAr: '28 ديسمبر 2025',
    featured: false
  },
  {
    id: 4,
    make: 'Honda',
    model: 'Civic',
    year: 2026,
    title: 'Honda Civic 2026: The Compact Car Champion',
    titleAr: 'هوندا سيفيك 2026: بطل السيارات المدمجة',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=640&auto=format&fit=crop',
    rating: 4.5,
    pros: ['Fuel efficiency', 'Reliable performance', 'Modern features'],
    prosAr: ['كفاءة استهلاك الوقود', 'أداء موثوق', 'ميزات حديثة'],
    cons: ['Limited rear headroom', 'Road noise at high speeds'],
    consAr: ['مساحة رأس محدودة في الخلف', 'ضوضاء الطريق عند السرعات العالية'],
    excerpt: 'The 2026 Honda Civic continues its legacy as one of the best compact cars on the market.',
    excerptAr: 'تواصل هوندا سيفيك 2026 إرثها كواحدة من أفضل السيارات المدمجة في السوق.',
    category: 'Compact',
    categoryAr: 'مدمجة',
    date: 'Dec 20, 2025',
    dateAr: '20 ديسمبر 2025',
    featured: false
  },
  {
    id: 5,
    make: 'Ford',
    model: 'F-150',
    year: 2026,
    title: 'Ford F-150 2026: The Ultimate Workhorse',
    titleAr: 'فورد F-150 2026: الحصان الأمثل للعمل',
    image: 'https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?q=80&w=640&auto=format&fit=crop',
    rating: 4.7,
    pros: ['Impressive towing capacity', 'Versatile bed options', 'Comfortable cabin'],
    prosAr: ['قدرة سحب مثيرة للإعجاب', 'خيارات سرير متعددة الاستخدامات', 'مقصورة مريحة'],
    cons: ['Fuel economy could be better', 'Large turning radius'],
    consAr: ['يمكن أن يكون اقتصاد الوقود أفضل', 'نصف قطر دوران كبير'],
    excerpt: 'The 2026 Ford F-150 remains the king of pickup trucks with its capability, technology, and versatility.',
    excerptAr: 'تظل فورد F-150 2026 ملك الشاحنات الصغيرة بقدرتها وتكنولوجيتها وتعدد استخداماتها.',
    category: 'Truck',
    categoryAr: 'شاحنة',
    date: 'Dec 15, 2025',
    dateAr: '15 ديسمبر 2025',
    featured: false
  },
  {
    id: 6,
    make: 'Hyundai',
    model: 'Tucson',
    year: 2026,
    title: 'Hyundai Tucson 2026: Value-Packed Crossover',
    titleAr: 'هيونداي توسان 2026: كروس أوفر ذات قيمة عالية',
    image: 'https://images.unsplash.com/photo-1633708640808-c3648c350be4?q=80&w=640&auto=format&fit=crop',
    rating: 4.4,
    pros: ['Great warranty', 'Feature-rich at every trim', 'Stylish design'],
    prosAr: ['ضمان رائع', 'غنية بالميزات في كل مستوى', 'تصميم أنيق'],
    cons: ['Average performance', 'So-so fuel economy'],
    consAr: ['أداء متوسط', 'اقتصاد متوسط في استهلاك الوقود'],
    excerpt: 'The 2026 Hyundai Tucson offers tremendous value with its combination of features, warranty, and design.',
    excerptAr: 'توفر هيونداي توسان 2026 قيمة هائلة بمزيجها من الميزات والضمان والتصميم.',
    category: 'Crossover',
    categoryAr: 'كروس أوفر',
    date: 'Dec 10, 2025',
    dateAr: '10 ديسمبر 2025',
    featured: false
  }
];

// Vehicle categories for filtering
const categories = [
  { id: 'all', name: 'All Vehicles', nameAr: 'جميع المركبات' },
  { id: 'sedan', name: 'Sedans', nameAr: 'سيدان' },
  { id: 'suv', name: 'SUVs', nameAr: 'دفع رباعي' },
  { id: 'electric', name: 'Electric', nameAr: 'كهربائية' },
  { id: 'luxury', name: 'Luxury', nameAr: 'فاخرة' },
  { id: 'compact', name: 'Compact', nameAr: 'مدمجة' },
  { id: 'truck', name: 'Trucks', nameAr: 'شاحنات' }
];

const CarReviews = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const featuredReviews = carReviews.filter(review => review.featured);
  const regularReviews = carReviews.filter(review => !review.featured);

  // Function to render star rating
  const renderStars = (rating: number) => {
    const stars: any [] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={16} />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300" size={16} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={16} />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className={`min-h-screen bg-gray-50 pt-[120px] pb-16 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 mb-4">
            <span className="font-medium text-gray-900">Baddelha</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{isAr ? 'مراجعات السيارات' : 'Car Reviews'}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{isAr ? 'مراجعات السيارات الشاملة' : 'Expert Car Reviews'}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isAr ? 'مراجعات مفصلة وتقييمات صادقة لأحدث السيارات في السوق لمساعدتك في اتخاذ قرار شراء مستنير.' : 
            'Detailed reviews and honest ratings of the latest cars on the market to help you make an informed purchase decision.'}
          </p>
        </header>

        {/* Search and Filter */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder={isAr ? 'ابحث عن مراجعات السيارات...' : 'Search car reviews...'}
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

        {/* Featured Reviews */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{isAr ? 'مراجعات مميزة' : 'Featured Reviews'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredReviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/car-reviews/${review.id}`)}>
                <div className="relative h-64 overflow-hidden">
                  <img src={review.image} alt={`${review.make} ${review.model} ${review.year}`} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-primaryBtn text-white text-xs font-bold px-3 py-1 rounded-full">
                    {isAr ? 'مراجعة مميزة' : 'Featured Review'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{isAr ? review.categoryAr : review.category}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium ml-1">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{isAr ? review.titleAr : review.title}</h3>
                  <p className="text-gray-600 mb-4">{isAr ? review.excerptAr : review.excerpt}</p>
                  
                  {/* Pros and Cons */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-2 flex items-center">
                        <ThumbsUp size={16} className="mr-1" />
                        {isAr ? 'الإيجابيات' : 'Pros'}
                      </h4>
                      <ul className="text-sm text-gray-600">
                        {(isAr ? review.prosAr : review.pros).map((pro, index) => (
                          <li key={index} className="mb-1">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-600 mb-2 flex items-center">
                        <ThumbsUp size={16} className="mr-1 transform rotate-180" />
                        {isAr ? 'السلبيات' : 'Cons'}
                      </h4>
                      <ul className="text-sm text-gray-600">
                        {(isAr ? review.consAr : review.cons).map((con, index) => (
                          <li key={index} className="mb-1">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primaryBtn font-medium">
                    <span>{isAr ? 'اقرأ المراجعة الكاملة' : 'Read full review'}</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Reviews */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{isAr ? 'جميع المراجعات' : 'All Reviews'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularReviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/car-reviews/${review.id}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={review.image} alt={`${review.make} ${review.model} ${review.year}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{isAr ? review.categoryAr : review.category}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-xs font-medium ml-1">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{isAr ? review.titleAr : review.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{isAr ? review.excerptAr : review.excerpt}</p>
                  <div className="flex items-center text-primaryBtn font-medium text-sm">
                    <span>{isAr ? 'اقرأ المراجعة' : 'Read review'}</span>
                    <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compare Cars Section */}
        <section className="bg-[#3d3d40] rounded-2xl p-8 md:p-10 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {isAr ? 'قارن بين السيارات' : 'Compare Cars Side by Side'}
              </h3>
              <p className="text-blue-100">
                {isAr ? 'قارن بين المواصفات والأسعار والميزات لمساعدتك في اتخاذ القرار الصحيح.' : 
                'Compare specifications, prices, and features to help you make the right decision.'}
              </p>
            </div>
            <div>
              <button className="bg-primaryBtn hover:bg-primaryBtn-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center">
                {isAr ? 'ابدأ المقارنة' : 'Start Comparing'}
                <BarChart2 size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </section>

        {/* Trending Reviews */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{isAr ? 'المراجعات الرائجة' : 'Trending Reviews'}</h2>
            <div className="flex items-center text-primaryBtn">
              <TrendingUp size={18} className="mr-1" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {carReviews.slice(0, 4).map(review => (
              <div key={review.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/car-reviews/${review.id}`)}>
                <div className="relative h-40 overflow-hidden">
                  <img src={review.image} alt={`${review.make} ${review.model} ${review.year}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{review.make} {review.model}</span>
                    <div className="flex items-center">
                      <Star className="fill-yellow-400 text-yellow-400" size={12} />
                      <span className="text-xs font-medium ml-1">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold line-clamp-2">{isAr ? review.titleAr : review.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CarReviews;