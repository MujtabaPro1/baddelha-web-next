'use client';
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Car, 
  Shield, 
  Truck, 
  FileText, 
  CreditCard, 
  Lock, 
  Check, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Calendar,
  Zap,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CarData {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  vin: string;
  mileage: number;
  condition: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  included: boolean;
  popular?: boolean;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface AddressData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Purchase: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'review' | 'details' | 'payment' | 'success'>('review');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(['warranty', 'delivery']));
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'installment'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [addressData, setAddressData] = useState<AddressData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Saudi Arabia'
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Sample car data - in real app this would come from props/API
  const carData: CarData = {
    id: 1,
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    price: 185000,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    vin: 'WBA8E9G50KNU12345',
    mileage: 5000,
    condition: 'Certified Pre-Owned'
  };

  const services: Service[] = [
    {
      id: 'warranty',
      name: 'Extended Warranty',
      description: '3 years comprehensive coverage for peace of mind',
      price: 8500,
      icon: <Shield className="h-6 w-6" />,
      included: true,
      popular: true
    },
    {
      id: 'delivery',
      name: 'Home Delivery',
      description: 'Free delivery to your doorstep within 48 hours',
      price: 0,
      icon: <Truck className="h-6 w-6" />,
      included: true
    },
    {
      id: 'inspection',
      name: 'Pre-Delivery Inspection',
      description: 'Comprehensive 150-point inspection report',
      price: 1200,
      icon: <FileText className="h-6 w-6" />,
      included: true
    },
    {
      id: 'detailing',
      name: 'Premium Detailing',
      description: 'Professional interior and exterior detailing',
      price: 800,
      icon: <Sparkles className="h-6 w-6" />,
      included: false
    },
    {
      id: 'insurance',
      name: 'First Year Insurance',
      description: 'Comprehensive insurance coverage for 12 months',
      price: 4500,
      icon: <Award className="h-6 w-6" />,
      included: false
    },
    {
      id: 'maintenance',
      name: 'Maintenance Package',
      description: '2 years of scheduled maintenance included',
      price: 3200,
      icon: <Zap className="h-6 w-6" />,
      included: false
    }
  ];

  const calculateTotal = () => {
    const serviceTotal = services
      .filter(service => selectedServices.has(service.id))
      .reduce((total, service) => total + service.price, 0);
    return carData.price + serviceTotal;
  };

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('success');
      setShowConfetti(true);
      
      // Stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    }, 3000);
  };

  // Confetti animation component
  const ConfettiAnimation = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <div
              className={`w-3 h-3 ${
                ['bg-yellow-400', 'bg-blue-400', 'bg-red-400', 'bg-green-400', 'bg-purple-400'][
                  Math.floor(Math.random() * 5)
                ]
              } transform rotate-45`}
            />
          </div>
        ))}
      </div>
    );
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 relative">
        <ConfettiAnimation />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-2xl p-12 relative overflow-hidden">
              {/* Success Animation */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                  <Check className="h-12 w-12 text-white" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full mx-auto animate-ping opacity-75"></div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🎉 Congratulations!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your {carData.year} {carData.make} {carData.model} purchase is complete!
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Order Number:</span>
                    <p className="font-semibold">#BDL{Date.now().toString().slice(-6)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Paid:</span>
                    <p className="font-semibold text-green-600">SAR {calculateTotal().toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Delivery Date:</span>
                    <p className="font-semibold">{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">VIN:</span>
                    <p className="font-semibold font-mono text-xs">{carData.vin}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Payment processed successfully</span>
                </div>
                <div className="flex items-center justify-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Delivery scheduled</span>
                </div>
                <div className="flex items-center justify-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Documentation in progress</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
                >
                  Return Home
                </button>
                <button className="border-2 border-[#f78f37] text-[#f78f37] hover:bg-gradient-to-r from-amber-500 to-amber-400 hover:text-white font-semibold py-3 px-8 rounded-lg transition">
                  Track Order
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-8">
                A confirmation email has been sent to {addressData.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { id: 'review', label: 'Review', icon: Car },
              { id: 'details', label: 'Details', icon: User },
              { id: 'payment', label: 'Payment', icon: CreditCard }
            ].map(({ id, label, icon: Icon }, index) => (
              <div key={id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition ${
                  currentStep === id 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 border-[#f78f37] text-white' 
                    : index < ['review', 'details', 'payment'].indexOf(currentStep)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < ['review', 'details', 'payment'].indexOf(currentStep) ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep === id ? 'text-[#f78f37]' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {index < 2 && (
                  <ChevronRight className="h-5 w-5 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
                
                {/* Car Summary */}
                <div className="flex items-center bg-gray-50 rounded-lg p-4 mb-6">
                  <img 
                    src={carData.image} 
                    alt={`${carData.year} ${carData.make} ${carData.model}`}
                    className="w-24 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {carData.year} {carData.make} {carData.model}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {carData.condition} • {carData.mileage.toLocaleString()} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">SAR {carData.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Services</h3>
                  <div className="space-y-3">
                    {services.map(service => (
                      <div 
                        key={service.id}
                        className={`border rounded-lg p-4 cursor-pointer transition ${
                          selectedServices.has(service.id)
                            ? 'border-[#f78f37] bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => !service.included && toggleService(service.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-4 ${
                              selectedServices.has(service.id) ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {service.icon}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-semibold">{service.name}</h4>
                                {service.popular && (
                                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Popular
                                  </span>
                                )}
                                {service.included && (
                                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Included
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {service.price === 0 ? 'Free' : `SAR ${service.price.toLocaleString()}`}
                            </p>
                            {!service.included && (
                              <div className={`w-5 h-5 rounded border-2 mt-1 ml-auto ${
                                selectedServices.has(service.id)
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 border-[#f78f37]'
                                  : 'border-gray-300'
                              }`}>
                                {selectedServices.has(service.id) && (
                                  <Check className="h-3 w-3 text-white m-0.5" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('details')}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                >
                  Continue to Details
                </button>
              </div>
            )}

            {/* Details Step */}
            {currentStep === 'details' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Delivery & Contact Information</h2>
                
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          required
                          value={addressData.firstName}
                          onChange={(e) => setAddressData({...addressData, firstName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                          placeholder="Enter first name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          required
                          value={addressData.lastName}
                          onChange={(e) => setAddressData({...addressData, lastName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          required
                          value={addressData.email}
                          onChange={(e) => setAddressData({...addressData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          required
                          value={addressData.phone}
                          onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                          placeholder="+966 50 123 4567"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                      <textarea
                        required
                        value={addressData.address}
                        onChange={(e) => setAddressData({...addressData, address: e.target.value})}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                        placeholder="Enter full delivery address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressData.city}
                        onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressData.state}
                        onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                        placeholder="State/Province"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressData.zipCode}
                        onChange={(e) => setAddressData({...addressData, zipCode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('review')}
                      className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'bank', label: 'Bank Transfer', icon: FileText },
                      { id: 'installment', label: 'Installments', icon: Calendar }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id as "card" | "bank" | "installment")}
                        className={`p-4 border-2 rounded-lg transition ${
                          paymentMethod === id
                            ? 'border-[#f78f37] bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${
                          paymentMethod === id ? 'text-[#f78f37]' : 'text-gray-400'
                        }`} />
                        <p className={`font-medium ${
                          paymentMethod === id ? 'text-[#f78f37]' : 'text-gray-700'
                        }`}>
                          {label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                        placeholder="Name on card"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          required
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            required
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Lock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800">Secure Payment</h4>
                          <p className="text-sm text-blue-700">
                            Your payment information is encrypted and secure. We never store your card details.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('details')}
                        className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
                        disabled={isProcessing}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </div>
                        ) : (
                          `Pay SAR ${calculateTotal().toLocaleString()}`
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Other payment methods placeholder */}
                {paymentMethod !== 'card' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {paymentMethod === 'bank' ? 'Bank Transfer' : 'Installment'} payment option coming soon!
                    </p>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className="text-[#f78f37] hover:underline"
                    >
                      Use Credit/Debit Card instead
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Car */}
              <div className="flex items-center mb-4 pb-4 border-b">
                <img 
                  src={carData.image} 
                  alt={`${carData.year} ${carData.make} ${carData.model}`}
                  className="w-16 h-12 object-cover rounded-lg mr-3"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">
                    {carData.year} {carData.make} {carData.model}
                  </h4>
                  <p className="text-gray-500 text-xs">{carData.condition}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Vehicle Price</span>
                  <span className="font-semibold">SAR {carData.price.toLocaleString()}</span>
                </div>
                
                {services
                  .filter(service => selectedServices.has(service.id))
                  .map(service => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{service.name}</span>
                      <span>
                        {service.price === 0 ? 'Free' : `SAR ${service.price.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#f78f37]">SAR {calculateTotal().toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Including all taxes and fees
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Free delivery within 48 hours</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-2 text-purple-500" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;