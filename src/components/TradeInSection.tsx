import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Car, 
  Building2, 
  User, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  CheckCircle, 
  Calculator,
  Shield,
  Zap,
  Calendar,
  Mail,
  Fuel,
  Settings,
  Eye
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';

interface DesiredVehicle {
  make: string;
  model: string;
  year: string;
  maxPrice: string;
  fuelType: string;
  transmission: string;
}

interface Dealership {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviews: number;
  image: string;
  specialties: string[];
  tradeInBonus: number;
  processingTime: string;
  services: string[];
}

interface DealerCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  features: string[];
  dealershipId: string;
}

interface TradeInVehicle {
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  estimatedValue: number;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  taxId: string;
  contactPerson: string;
  preferredContact: string;
}

interface AppointmentDetails {
  branch: string;
  date: string;
  time: string;
}

const TradeIn: React.FC = () => {
  const [clientType, setClientType] = useState<'individual' | 'corporate'>('individual');
  const [currentStep, setCurrentStep] = useState<'desired-car' | 'dealerships' | 'inventory' | 'trade-details' | 'confirmation'>('desired-car');

  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  
  const [desiredVehicle, setDesiredVehicle] = useState<DesiredVehicle>({
    make: '',
    model: '',
    year: '',
    maxPrice: '',
    fuelType: '',
    transmission: ''
  });

  const [selectedDealership, setSelectedDealership] = useState<string>('');
  const [selectedCar, setSelectedCar] = useState<DealerCar | null>(null);
  const [tradeInVehicle, setTradeInVehicle] = useState<TradeInVehicle>({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    estimatedValue: 0
  });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    taxId: '',
    contactPerson: '',
    preferredContact: 'email'
  });

  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    branch: '',
    date: '',
    time: ''
  });

  const dealerships: Dealership[] = [
    {
      id: '1',
      name: 'Premium Exchange',
      address: 'King Fahd Road, Riyadh 12345',
      phone: '+966 11 123 4567',
      email: 'tradein@premiumauto.com',
      rating: 4.8,
      reviews: 342,
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      specialties: ['Luxury Cars', 'SUVs', 'Electric Vehicles'],
      tradeInBonus: 5000,
      processingTime: '24 hours',
      services: ['Free Inspection', 'Instant Valuation', 'Same Day Payment', 'Document Handling']
    },
    {
      id: '2',
      name: 'Elite Motors Trading',
      address: 'Olaya Street, Riyadh 11564',
      phone: '+966 11 234 5678',
      email: 'info@elitemotors.com',
      rating: 4.6,
      reviews: 256,
      image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      specialties: ['German Cars', 'Sports Cars', 'Vintage Classics'],
      tradeInBonus: 3500,
      processingTime: '48 hours',
      services: ['Expert Appraisal', 'Market Analysis', 'Flexible Payment', 'Trade-In Guarantee']
    },
    {
      id: '3',
      name: 'Royal Car Center',
      address: 'Riyadh 12244',
      phone: '+966 11 345 6789',
      email: 'tradein@royalcars.com',
      rating: 4.9,
      reviews: 428,
      image: 'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      specialties: ['German Cars', 'Hybrid Vehicles', 'Commercial Fleet'],
      tradeInBonus: 4200,
      processingTime: '12 hours',
      services: ['Fleet Evaluation', 'Bulk Processing', 'Corporate Rates', 'Priority Service']
    }
  ];

  const dealerInventory: DealerCar[] = [
    {
      id: '1',
      make: 'BMW',
      model: 'X5',
      year: 2023,
      price: 285000,
      image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 15000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Excellent',
      features: ['Leather Seats', 'Sunroof', 'Navigation', 'Premium Sound'],
      dealershipId: '1'
    },
    {
      id: '2',
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      price: 195000,
      image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 25000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      condition: 'Excellent',
      features: ['AMG Package', 'Premium Sound', 'Heated Seats', 'Wireless Charging'],
      dealershipId: '1'
    },
    {
      id: '3',
      make: 'Audi',
      model: 'Q7',
      year: 2023,
      price: 320000,
      image: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 8000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Like New',
      features: ['Quattro AWD', 'Virtual Cockpit', 'Premium Plus', 'Panoramic Roof'],
      dealershipId: '2'
    },
    {
      id: '4',
      make: 'Lexus',
      model: 'ES',
      year: 2022,
      price: 165000,
      image: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 18000,
      fuelType: 'Hybrid',
      transmission: 'CVT',
      condition: 'Excellent',
      features: ['Lexus Safety+', 'Mark Levinson Audio', 'Heated/Cooled Seats', 'Wireless Charging'],
      dealershipId: '2'
    },
    {
      id: '5',
      make: 'Toyota',
      model: 'Land Cruiser',
      year: 2023,
      price: 425000,
      image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 5000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Like New',
      features: ['4WD', 'Off-Road Package', 'Premium Interior', 'Advanced Safety'],
      dealershipId: '3'
    },
    {
      id: '6',
      make: 'BMW',
      model: '3 Series',
      year: 2022,
      price: 175000,
      image: 'https://images.carswitch.com/674674hyundai/1834616745255781.jpeg?fit=crop&w=305&h=228&auto=format,compress&q=30',
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Good',
      features: ['Sport Package', 'Navigation', 'Heated Seats', 'Backup Camera'],
      dealershipId: '3'
    }
  ];

  const calculateTradeInValue = () => {
    if (!tradeInVehicle.make || !tradeInVehicle.model || !tradeInVehicle.year) return 0;
    
    const baseValue = 80000;
    const yearFactor = (2024 - parseInt(tradeInVehicle.year)) * 3000;
    const mileageFactor = parseInt(tradeInVehicle.mileage) * 0.15;
    const conditionMultiplier = {
      'excellent': 1.3,
      'good': 1.0,
      'fair': 0.8,
      'poor': 0.6
    }[tradeInVehicle.condition] || 1.0;
    
    const calculatedValue = Math.max(0, (baseValue - yearFactor - mileageFactor) * conditionMultiplier);
    return Math.round(calculatedValue);
  };

  const getFilteredInventory = () => {
    return dealerInventory.filter(car => car.dealershipId === selectedDealership);
  };

  const handleDesiredCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('dealerships');
  };

  const handleDealershipSelect = (dealershipId: string) => {
    setSelectedDealership(dealershipId);
    setCurrentStep('inventory');
  };

  const handleCarSelect = (car: DealerCar) => {
    setSelectedCar(car);
    setCurrentStep('trade-details');
  };

  const handleTradeDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estimatedValue = calculateTradeInValue();
    setTradeInVehicle(prev => ({ ...prev, estimatedValue }));
    setCurrentStep('confirmation');
  };

  // Confirmation Screen
  if (currentStep === 'confirmation') {
    const selectedDealer = dealerships.find(d => d.id === selectedDealership);
    const finalPrice = selectedCar ? selectedCar.price - tradeInVehicle.estimatedValue : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center animate-pulse mb-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🎉 Trade-In Appointment Confirmed!
                </h1>
                <p className="text-xl text-gray-600">
                  Your trade-in appointment has been scheduled with {selectedDealer?.name}
                </p>
              </div>

              {/* Car Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Your Trade-In Car */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Car className="h-6 w-6 mr-2 text-red-500" />
                    Your Trade-In Vehicle
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-semibold">{tradeInVehicle.year} {tradeInVehicle.make} {tradeInVehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-semibold">{parseInt(tradeInVehicle.mileage).toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className="font-semibold capitalize">{tradeInVehicle.condition}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Trade-In Value:</span>
                      <span className="font-bold text-green-600 text-lg">SAR {tradeInVehicle.estimatedValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Desired Car */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Car className="h-6 w-6 mr-2 text-blue-500" />
                    Your New Vehicle
                  </h3>
                  {selectedCar && (
                    <div className="space-y-3">
                      <img 
                        src={selectedCar.image} 
                        alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-semibold">{selectedCar.year} {selectedCar.make} {selectedCar.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mileage:</span>
                        <span className="font-semibold">{selectedCar.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-semibold">{selectedCar.condition}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600">Vehicle Price:</span>
                        <span className="font-bold text-blue-600 text-lg">SAR {selectedCar.price.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-[#3d3d40] text-white rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">SAR {selectedCar?.price.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Vehicle Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">- SAR {tradeInVehicle.estimatedValue.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Trade-In Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#f78f37]">SAR {finalPrice.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Amount to Pay</div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Appointment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 mr-3 text-[#f78f37]" />
                      <div>
                        <p className="font-medium">{selectedDealer?.name}</p>
                        <p className="text-gray-600 text-sm">{selectedDealer?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-[#f78f37]" />
                      <div>
                        <p className="font-medium">{new Date(appointmentDetails.date).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-sm">{appointmentDetails.time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-3 text-[#f78f37]" />
                      <span>{personalInfo.firstName} {personalInfo.lastName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-[#f78f37]" />
                      <span>{personalInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-[#f78f37]" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-yellow-800 mb-3">What Happens Next?</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                    <div>
                      <p className="font-medium text-yellow-800">Vehicle Inspection</p>
                      <p className="text-yellow-700 text-sm">We'll inspect your trade-in vehicle</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                    <div>
                      <p className="font-medium text-yellow-800">Final Valuation</p>
                      <p className="text-yellow-700 text-sm">Confirm the trade-in value</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                    <div>
                      <p className="font-medium text-yellow-800">Complete Transaction</p>
                      <p className="text-yellow-700 text-sm">Finalize paperwork and payment</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
                >
                  Return Home
                </button>
                <button
                  onClick={() => alert('Calendar integration coming soon!')}
                  className="border-2 border-[#f78f37] text-[#f78f37] hover:bg-gradient-to-r from-amber-500 to-amber-400 hover:text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Add to Calendar
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-8 text-center">
                Confirmation ID: #TI{Date.now().toString().slice(-6)} | A confirmation email has been sent to {personalInfo.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trade Details Form
  if (currentStep === 'trade-details') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Trade-In Details</h1>
              <p className="text-gray-600">Provide your vehicle information and personal details to finalize the trade-in</p>
            </div>

            {/* Selected Car Display */}
            {selectedCar && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Selected Vehicle</h2>
                <div className="flex items-center bg-blue-50 rounded-lg p-4">
                  <img 
                    src={selectedCar.image} 
                    alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
                    className="w-24 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {selectedCar.year} {selectedCar.make} {selectedCar.model}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {selectedCar.condition} • {selectedCar.mileage.toLocaleString()} km • {selectedCar.fuelType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-blue-600">SAR {selectedCar.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleTradeDetailsSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                      placeholder="+966 50 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Trade-In Vehicle Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Your Trade-In Vehicle</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                    <select
                      required
                      value={tradeInVehicle.make}
                      onChange={(e) => setTradeInVehicle({...tradeInVehicle, make: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    >
                      <option value="">Select Make</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="BMW">BMW</option>
                      <option value="Mercedes">Mercedes</option>
                      <option value="Audi">Audi</option>
                      <option value="Lexus">Lexus</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Hyundai">Hyundai</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <select
                      required
                      value={tradeInVehicle.model}
                      onChange={(e) => setTradeInVehicle({...tradeInVehicle, model: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    >
                      <option value="">Select Model</option>
                      <option value="Camry">Camry</option>
                      <option value="Corolla">Corolla</option>
                      <option value="Accord">Accord</option>
                      <option value="Civic">Civic</option>
                      <option value="3 Series">3 Series</option>
                      <option value="C-Class">C-Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <select
                      required
                      value={tradeInVehicle.year}
                      onChange={(e) => setTradeInVehicle({...tradeInVehicle, year: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    >
                      <option value="">Select Year</option>
                      {Array.from({ length: 20 }, (_, i) => (
                        <option key={i} value={2024 - i}>{2024 - i}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km) *</label>
                    <input
                      type="number"
                      required
                      value={tradeInVehicle.mileage}
                      onChange={(e) => setTradeInVehicle({...tradeInVehicle, mileage: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                      placeholder="Enter mileage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                    <select
                      required
                      value={tradeInVehicle.condition}
                      onChange={(e) => setTradeInVehicle({...tradeInVehicle, condition: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    >
                      <option value="">Select Condition</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>

                {tradeInVehicle.make && tradeInVehicle.model && tradeInVehicle.year && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Estimated Trade-In Value</span>
                      <span className="text-lg font-bold text-green-600">
                        SAR {calculateTradeInValue().toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Appointment Scheduling */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Schedule Appointment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={appointmentDetails.date}
                      onChange={(e) => setAppointmentDetails({...appointmentDetails, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                    <select
                      required
                      value={appointmentDetails.time}
                      onChange={(e) => setAppointmentDetails({...appointmentDetails, time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    >
                      <option value="">Select Time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('inventory')}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition"
                >
                  <ArrowLeft className="inline-block mr-2 h-5 w-5" />
                  Back to Inventory
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                >
                  Schedule Appointment
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dealer Inventory
  if (currentStep === 'inventory') {
    const selectedDealer = dealerships.find(d => d.id === selectedDealership);
    const inventory = getFilteredInventory();

    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedDealer?.name} - Available Inventory
              </h1>
              <p className="text-gray-600">Choose the vehicle you'd like to purchase with your trade-in</p>
            </div>

            {/* Dealer Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={selectedDealer?.image} 
                    alt={selectedDealer?.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedDealer?.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{selectedDealer?.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({selectedDealer?.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Trade-In Bonus: +SAR {selectedDealer?.tradeInBonus.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {inventory.map(car => (
                <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {car.condition}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {car.mileage.toLocaleString()} km • {car.fuelType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-[#3d3d40]">SAR {car.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-3 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>{car.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Fuel className="h-4 w-4 mr-2" />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Zap className="h-4 w-4 mr-2" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Car className="h-4 w-4 mr-2" />
                        <span>{car.condition}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 2 && (
                        <span className="text-gray-500 text-xs flex items-center">+{car.features.length - 2}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCarSelect(car)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
                      >
                        Select This Car
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {inventory.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles available</h3>
                <p className="text-gray-500">This dealership doesn't have any vehicles matching your criteria</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('dealerships')}
                className="text-gray-600 hover:text-gray-800 font-medium transition"
              >
                ← Back to Dealership Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dealership Selection
  if (currentStep === 'dealerships') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Preferred Dealership</h1>
              <p className="text-gray-600">Select the dealership where you'd like to complete your trade-in</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {dealerships.map(dealership => (
                <div key={dealership.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={dealership.image} 
                    alt={dealership.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{dealership.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{dealership.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({dealership.reviews})</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{dealership.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{dealership.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Processing: {dealership.processingTime}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {dealership.specialties.map((specialty, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">Trade-In Bonus</span>
                        <span className="text-lg font-bold text-green-600">
                          +SAR {dealership.tradeInBonus.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDealershipSelect(dealership.id)}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                    >
                      View Inventory
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('desired-car')}
                className="text-gray-600 hover:text-gray-800 font-medium transition"
              >
                ← Back to Car Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desired Car Form (Step 1)
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{lang[languageContent].tradeInTitleSection}</h1>
            <p className="text-xl text-gray-600">{lang[languageContent].tradeInDescSection}</p>
          </div>

          {/* Client Type Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{lang[languageContent].selectClientType}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setClientType('individual')}
                className={`p-6 border-2 rounded-lg transition ${
                  clientType === 'individual'
                    ? 'border-[#f78f37] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className={`h-8 w-8 mx-auto mb-3 ${
                  clientType === 'individual' ? 'text-[#f78f37]' : 'text-gray-400'
                }`} />
                <h3 className={`font-semibold text-lg ${
                  clientType === 'individual' ? 'text-[#f78f37]' : 'text-gray-700'
                }`}>
                  {lang[languageContent].individual}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {lang[languageContent].individualDesc}
                </p>
              </button>

              <button
                onClick={() => setClientType('corporate')}
                className={`p-6 border-2 rounded-lg transition ${
                  clientType === 'corporate'
                    ? 'border-[#f78f37] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className={`h-8 w-8 mx-auto mb-3 ${
                  clientType === 'corporate' ? 'text-[#f78f37]' : 'text-gray-400'
                }`} />
                <h3 className={`font-semibold text-lg ${
                  clientType === 'corporate' ? 'text-[#f78f37]' : 'text-gray-700'
                }`}>
                  {lang[languageContent].corporate}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {lang[languageContent].corporateDesc}
                </p>
              </button>
            </div>
          </div>

          {/* Desired Vehicle Form */}
          <form onSubmit={handleDesiredCarSubmit}>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">{lang[languageContent].whatCarAreYouLookingFor}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].make}</label>
                  <select
                    required
                    value={desiredVehicle.make}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, make: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">{lang[languageContent].selectMake}</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Audi">Audi</option>
                    <option value="Lexus">Lexus</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Hyundai">Hyundai</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].model}</label>
                  <select
                    required
                    value={desiredVehicle.model}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, model: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">{lang[languageContent].selectModel}</option>
                    <option value="X5">X5</option>
                    <option value="3 Series">3 Series</option>
                    <option value="C-Class">C-Class</option>
                    <option value="Q7">Q7</option>
                    <option value="ES">ES</option>
                    <option value="Land Cruiser">Land Cruiser</option>
                    <option value="Camry">Camry</option>
                    <option value="Accord">Accord</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].year}</label>
                  <select
                    required
                    value={desiredVehicle.year}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, year: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">{lang[languageContent].selectYear}</option>
                    {Array.from({ length: 5 }, (_, i) => (
                      <option key={i} value={2024 - i}>{2024 - i}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].maxPrice}</label>
                  <input
                    type="number"
                    value={desiredVehicle.maxPrice}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, maxPrice: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    placeholder="Enter max budget"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].fuel}</label>
                  <select
                    value={desiredVehicle.fuelType}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, fuelType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].transmission}</label>
                  <select
                    value={desiredVehicle.transmission}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, transmission: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-4 px-12 rounded-lg transition transform hover:scale-105 text-lg"
              >
                {lang[languageContent].findDealerships}
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Benefits Section */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-center mb-8">{lang[languageContent].whyChooseOurTradeInService}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{lang[languageContent].fairMarketValue}</h3>
                <p className="text-gray-600">{lang[languageContent].competitivePricing}</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{lang[languageContent].quickProcess}</h3>
                <p className="text-gray-600">{lang[languageContent].fastEvaluation}</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{lang[languageContent].hassleFree}</h3>
                <p className="text-gray-600">{lang[languageContent].paperworkDocumentation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeIn;