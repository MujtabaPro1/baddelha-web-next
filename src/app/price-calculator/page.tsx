'use client'

import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Calculator, Car, ChevronDown, Calendar, Percent, CreditCard, Download, Share2 } from 'lucide-react';

// Sample car data
const carModels = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2026,
    basePrice: 88000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=640&auto=format&fit=crop'
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Accord',
    year: 2026,
    basePrice: 85000,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=640&auto=format&fit=crop'
  },
  {
    id: 3,
    make: 'Nissan',
    model: 'Altima',
    year: 2026,
    basePrice: 79000,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=640&auto=format&fit=crop'
  },
  {
    id: 4,
    make: 'Ford',
    model: 'Mustang',
    year: 2026,
    basePrice: 120000,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=640&auto=format&fit=crop'
  },
  {
    id: 5,
    make: 'BMW',
    model: 'X5',
    year: 2026,
    basePrice: 180000,
    image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=640&auto=format&fit=crop'
  },
  {
    id: 6,
    make: 'Tesla',
    model: 'Model Y',
    year: 2026,
    basePrice: 160000,
    image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=640&auto=format&fit=crop'
  }
];

// Features and options
const carFeatures = [
  { id: 'premium_audio', name: 'Premium Audio System', nameAr: 'نظام صوت متميز', price: 3500 },
  { id: 'leather_seats', name: 'Leather Seats', nameAr: 'مقاعد جلدية', price: 4200 },
  { id: 'navigation', name: 'Navigation System', nameAr: 'نظام ملاحة', price: 2800 },
  { id: 'sunroof', name: 'Panoramic Sunroof', nameAr: 'فتحة سقف بانورامية', price: 5000 },
  { id: 'safety_package', name: 'Advanced Safety Package', nameAr: 'حزمة السلامة المتقدمة', price: 6500 },
  { id: 'wheels', name: 'Premium Alloy Wheels', nameAr: 'عجلات سبائك متميزة', price: 4800 }
];

const PriceCalculator = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  // State for calculator
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [downPayment, setDownPayment] = useState<number>(20);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  
  // Calculated values
  const [basePrice, setBasePrice] = useState<number>(0);
  const [featuresPrice, setFeaturesPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  
  // Update calculations when inputs change
  useEffect(() => {
    // Calculate base price
    const selectedCarData = carModels.find(car => car.id === selectedCar);
    const newBasePrice = selectedCarData ? selectedCarData.basePrice : 0;
    setBasePrice(newBasePrice);
    
    // Calculate features price
    const newFeaturesPrice = selectedFeatures.reduce((total, featureId) => {
      const feature = carFeatures.find(f => f.id === featureId);
      return total + (feature ? feature.price : 0);
    }, 0);
    setFeaturesPrice(newFeaturesPrice);
    
    // Calculate total price
    const newTotalPrice = newBasePrice + newFeaturesPrice;
    setTotalPrice(newTotalPrice);
    
    // Calculate monthly payment
    if (newTotalPrice > 0) {
      const loanAmount = newTotalPrice * (1 - (downPayment / 100));
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = loanTerm;
      
      if (monthlyRate === 0) {
        setMonthlyPayment(loanAmount / numPayments);
      } else {
        const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                       (Math.pow(1 + monthlyRate, numPayments) - 1);
        setMonthlyPayment(payment);
      }
    } else {
      setMonthlyPayment(0);
    }
  }, [selectedCar, selectedFeatures, downPayment, loanTerm, interestRate]);
  
  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 pt-[120px] pb-16 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 mb-4">
            <span className="font-medium text-gray-900">Baddelha</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{isAr ? 'حاسبة السعر' : 'Price Calculator'}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{isAr ? 'حاسبة سعر السيارة' : 'Car Price Calculator'}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isAr ? 'احسب سعر سيارتك المثالية مع الميزات والتمويل المخصص لاحتياجاتك.' : 
            'Calculate the price of your ideal car with features and financing tailored to your needs.'}
          </p>
        </header>

        {/* Professional Inspection Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">{isAr ? 'فحص سيارة احترافي' : 'Professional Car Inspection'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{isAr ? 'فحص احترافي للسيارة' : 'Professional Car Inspection'}</h3>
                  <p className="text-gray-600 text-sm">{isAr ? 'بعد حجز الموعد، سيقوم مهندسونا الخبراء بفحص سيارتك بدقة لضمان تقييم عادل ودقيق.' : 'Once you book an appointment, our expert engineers will thoroughly inspect your car to ensure an accurate evaluation.'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{isAr ? 'استلم سعرًا عادلاً – الخيار لك' : 'Receive a Fair Price – Your Choice'}</h3>
                  <p className="text-gray-600 text-sm mb-3">{isAr ? 'احصل على سعر عادل وشفاف لسيارتك. يمكنك:' : 'Get a fair and transparent price for your car. You can:'}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">●</span>
                      <span>{isAr ? 'استلام المبلغ نقدًا' : 'Take the amount in cash'}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">●</span>
                      <span>{isAr ? 'استخدامه كدفعة أولى لشراء سيارة جديدة من JAECOO أو OMODA' : 'Use it as a down payment for a new JAECOO or OMODA car'}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">●</span>
                      <span>{isAr ? 'أو رفض العرض – الخيار متروك لك بالكامل' : 'Or decline the offer – the choice is entirely yours'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Car className="mr-2" size={20} />
                {isAr ? 'اختر السيارة' : 'Select Your Car'}
              </h2>
              
              {/* Car Selection */}
              <div className="relative mb-6">
                <button 
                  className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-white"
                  onClick={() => setShowCarDropdown(!showCarDropdown)}
                >
                  {selectedCar ? (
                    <div className="flex items-center">
                      <img 
                        src={carModels.find(car => car.id === selectedCar)?.image} 
                        alt={`${carModels.find(car => car.id === selectedCar)?.make} ${carModels.find(car => car.id === selectedCar)?.model}`}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <span>
                        {carModels.find(car => car.id === selectedCar)?.make} {carModels.find(car => car.id === selectedCar)?.model} {carModels.find(car => car.id === selectedCar)?.year}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">{isAr ? 'اختر سيارة' : 'Select a car'}</span>
                  )}
                  <ChevronDown size={20} className={`transition-transform ${showCarDropdown ? 'transform rotate-180' : ''}`} />
                </button>
                
                {showCarDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {carModels.map(car => (
                      <div 
                        key={car.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSelectedCar(car.id);
                          setShowCarDropdown(false);
                        }}
                      >
                        <img 
                          src={car.image} 
                          alt={`${car.make} ${car.model}`}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                        />
                        <div>
                          <div className="font-medium">{car.make} {car.model} {car.year}</div>
                          <div className="text-sm text-gray-500">{isAr ? 'السعر الأساسي' : 'Base Price'}: SAR {car.basePrice.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Features Selection */}
              {selectedCar && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">{isAr ? 'اختر الميزات' : 'Select Features'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {carFeatures.map(feature => (
                      <div 
                        key={feature.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedFeatures.includes(feature.id) ? 'border-primaryBtn bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => toggleFeature(feature.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{isAr ? feature.nameAr : feature.name}</span>
                          <span className="text-sm font-semibold text-primaryBtn">SAR {feature.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <input 
                            type="checkbox" 
                            checked={selectedFeatures.includes(feature.id)}
                            onChange={() => {}} // Handled by the div click
                            className="h-4 w-4 text-primaryBtn rounded focus:ring-primaryBtn"
                          />
                          <span className="ml-2 text-sm text-gray-500">{isAr ? 'إضافة' : 'Add'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Financing Options */}
              {selectedCar && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    {isAr ? 'خيارات التمويل' : 'Financing Options'}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Down Payment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isAr ? 'الدفعة الأولى (%)' : 'Down Payment (%)'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={downPayment}
                          onChange={(e) => setDownPayment(Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBtn"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Loan Term */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isAr ? 'مدة القرض (شهور)' : 'Loan Term (months)'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="12"
                          max="84"
                          step="12"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBtn"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Interest Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isAr ? 'معدل الفائدة (%)' : 'Interest Rate (%)'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBtn"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Percent size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-[120px]">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Calculator className="mr-2" size={20} />
                {isAr ? 'ملخص السعر' : 'Price Summary'}
              </h2>
              
              {selectedCar ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isAr ? 'السعر الأساسي' : 'Base Price'}</span>
                      <span className="font-medium">SAR {basePrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isAr ? 'الميزات المختارة' : 'Selected Features'}</span>
                      <span className="font-medium">SAR {featuresPrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="font-bold">{isAr ? 'السعر الإجمالي' : 'Total Price'}</span>
                      <span className="font-bold text-lg">SAR {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-800">{isAr ? 'الدفعة الشهرية' : 'Monthly Payment'}</span>
                      <span className="font-bold text-xl text-blue-800">SAR {monthlyPayment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {isAr ? `بناءً على ${downPayment}% دفعة أولى، ${loanTerm} شهر، ${interestRate}% معدل فائدة` : 
                      `Based on ${downPayment}% down, ${loanTerm} months, ${interestRate}% interest`}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-primaryBtn hover:bg-primaryBtn-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center">
                      <Download size={18} className="mr-2" />
                      {isAr ? 'تحميل التفاصيل' : 'Download Details'}
                    </button>
                    
                    <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center">
                      <Share2 size={18} className="mr-2" />
                      {isAr ? 'مشاركة التفاصيل' : 'Share Details'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car size={48} className="mx-auto mb-3 opacity-30" />
                  <p>{isAr ? 'الرجاء اختيار سيارة لعرض التفاصيل' : 'Please select a car to view details'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;