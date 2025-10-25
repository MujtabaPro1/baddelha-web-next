'use client';
import React, { useState, useEffect } from 'react';
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
import axiosInstance from '../../services/axiosInstance';
import { useLanguage } from '../../contexts/LanguageContext';
import lang from '../../locale';

interface DesiredVehicle {
  make: string;
  model: string;
  year: string;
  maxPrice: string;
  fuelType: string;
  transmission: string;
  makeName: string;
  modelName: string;
  fuelTypeName: string;
  transmissionName: string;
}

interface DealershipLogo {
  id: string;
  url: string;
  caption: string;
  fileType: string;
}

interface Dealership {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  logo: DealershipLogo;
  // Keep these fields for UI compatibility
  address?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  specialties?: string[];
  tradeInBonus?: number;
  processingTime?: string;
  services?: string[];
}

interface CarImage {
  id: string;
  url: string;
  caption: string;
  fileType: string;
}

interface DealerCar {
  id: string;
  make: string;
  model: string;
  year: number;
  exactModel?: string;
  sellingPrice: string;
  dealershipId: string;
  createdAt: string;
  updatedAt: string;
  dealership?: Dealership;
  images: CarImage[];
  // Keep these fields for UI compatibility
  price?: number;
  image?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  features?: string[];
}

interface CarMake {
  id: string;
  name: string;
}

interface CarModel {
  id: string;
  name: string;
}

interface TradeInVehicle {
  make: string;
  makeId: string;
  model: string;
  modelId: string;
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
  const [currentStep, setCurrentStep] = useState<'desired-car' | 'dealerships' | 'inventory' | 'trade-details' | 'confirmation'>('trade-details');
  const { language } = useLanguage();
  
  const [desiredVehicle, setDesiredVehicle] = useState<DesiredVehicle>({
    makeName: '',
    modelName: '',
    fuelTypeName: '',
    transmissionName: '',
    make: '',
    model: '',
    year: '',
    maxPrice: '',
    fuelType: '',
    transmission: ''
  });

  const [selectedDealership, setSelectedDealership] = useState<string>('');
  const [selectedCar, setSelectedCar]: any = useState<DealerCar | null>(null);
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState({
    makes: false,
    models: false,
    dealerships: false,
    dealerCars: false
  });
  const [error, setError] = useState({
    makes: '',
    models: '',
    dealerships: '',
    dealerCars: ''
  });
  
  const [tradeInVehicle, setTradeInVehicle] = useState<TradeInVehicle>({
    make: '',
    makeId: '',
    model: '',
    modelId: '',
    year: '',
    mileage: '',
    condition: '',
    estimatedValue: 0
  });

  // Fetch car makes on component mount
  useEffect(() => {
    const fetchCarMakes = async () => {
      setLoading(prev => ({ ...prev, makes: true }));
      setError(prev => ({ ...prev, makes: '' }));
      
      try {
        const response = await axiosInstance.get('/api/1.0/car-options/car-make');
        setMakes(response?.data?.data);
      } catch (err) {
        console.error('Error fetching car makes:', err);
        setError(prev => ({ ...prev, makes: 'Failed to load car makes' }));
      } finally {
        setLoading(prev => ({ ...prev, makes: false }));
      }
    };
    
    fetchCarMakes();
  }, []);
  
  // Fetch car models when make changes
  useEffect(() => {
    if (!tradeInVehicle.makeId) {
      setModels([]);
      return;
    }
    
    
    fetchCarModels();
  }, [tradeInVehicle.makeId]);

  const fetchCarModels = async () => {
    setLoading(prev => ({ ...prev, models: true }));
    setError(prev => ({ ...prev, models: '' }));
    
    try {
      const response = await axiosInstance.get(`/api/1.0/car-options/car-model/${tradeInVehicle.makeId || desiredVehicle.make}`);
      setModels(response?.data);
    } catch (err) {
      console.error('Error fetching car models:', err);
      setError(prev => ({ ...prev, models: 'Failed to load car models' }));
    } finally {
      setLoading(prev => ({ ...prev, models: false }));
    }
  };

  // Fetch car years when model changes
  useEffect(() => {
    if (!desiredVehicle.make) {
      setModels([]);
      return;
    }

    fetchCarModels();
  
  }, [desiredVehicle.make]);

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

  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  

  const fetchDealerships = async () => {
    setLoading(prev => ({ ...prev, dealerships: true }));
    setError(prev => ({ ...prev, dealerships: '' }));
    
    try {
      // First try to get filtered dealerships based on desired vehicle
      let dealershipData: any[] = [];
      let response;
      
      if (desiredVehicle.make && desiredVehicle.model) {
        // Build query parameters for filtered search
        const queryParams = new URLSearchParams();
        console.log('Desired vehicle:', desiredVehicle);
        if (desiredVehicle.makeName) queryParams.append('make', desiredVehicle.makeName);
        if (desiredVehicle.modelName) queryParams.append('model', desiredVehicle.modelName);
        if (desiredVehicle.year) queryParams.append('year', desiredVehicle.year);
        if (desiredVehicle.maxPrice) queryParams.append('maxPrice', desiredVehicle.maxPrice);
        if (desiredVehicle.fuelTypeName) queryParams.append('fuelType', desiredVehicle.fuelTypeName);
        if (desiredVehicle.transmissionName) queryParams.append('transmission', desiredVehicle.transmissionName);
        
        // Try filtered endpoint first
        try {
          response = await axiosInstance.get(`/api/1.0/trade/filtered-dealership?${queryParams.toString()}`);
          dealershipData = response?.data?.data || [];
          console.log('Filtered dealerships:', dealershipData);
        } catch (filterErr) {
          console.error('Error fetching filtered dealerships:', filterErr);
          // If filtered search fails, we'll continue to the fallback
        }
      }
      
      // If no results from filtered search, fall back to getting all dealerships
      if (dealershipData.length === 0) {
        response = await axiosInstance.get('/api/1.0/dealership/find-all');
        dealershipData = response?.data?.data || [];
        console.log('All dealerships:', dealershipData);
      }
      
      // Map API response to include UI compatibility fields
      const mappedDealerships = dealershipData.map((dealer: Dealership) => ({
        ...dealer,
        address: dealer.location || '',
        image: dealer.logo?.url || 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 4.8,
        reviews: 300,
        specialties: ['Luxury Cars', 'SUVs', 'Electric Vehicles'],
        tradeInBonus: 5000,
        processingTime: '24 hours',
        services: ['Free Inspection', 'Instant Valuation', 'Same Day Payment', 'Document Handling']
      }));
      
      setDealerships(mappedDealerships);
      setCurrentStep('dealerships');  
    } catch (err) {
      console.error('Error fetching dealerships:', err);
      setError(prev => ({ ...prev, dealerships: 'Failed to load dealerships' }));
      
      // Fallback to default dealerships if API fails
      setDealerships([
        {
          id: '1',
          name: 'Premium Exchange',
          location: 'Riyadh',
          address: 'King Fahd Road, Riyadh 12345',
          phone: '+966 11 123 4567',
          email: 'tradein@premiumauto.com',
          website: 'www.example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          logo: {
            id: '1',
            url: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            caption: 'logo',
            fileType: 'image/jpeg'
          },
          rating: 4.8,
          reviews: 342,
          image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          specialties: ['Luxury Cars', 'SUVs', 'Electric Vehicles'],
          tradeInBonus: 5000,
          processingTime: '24 hours',
          services: ['Free Inspection', 'Instant Valuation', 'Same Day Payment', 'Document Handling']
        }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, dealerships: false }));
    }
  };


  const [dealerCars, setDealerCars] = useState<DealerCar[]>([]);
  
  // Fallback inventory in case API fails
  const dealerInventory: DealerCar[] = [
    {
      id: '1',
      make: 'BMW',
      model: 'X5',
      year: 2023,
      sellingPrice: '285000',
      dealershipId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [{
        id: '1',
        url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'BMW X5',
        fileType: 'image/jpeg'
      }],
      // UI compatibility fields
      price: 285000,
      image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 15000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Excellent',
      features: ['Leather Seats', 'Sunroof', 'Navigation', 'Premium Sound']
    },
    {
      id: '2',
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      sellingPrice: '195000',
      dealershipId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [{
        id: '2',
        url: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Mercedes C-Class',
        fileType: 'image/jpeg'
      }],
      // UI compatibility fields
      price: 195000,
      image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 25000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      condition: 'Excellent',
      features: ['AMG Package', 'Premium Sound', 'Heated Seats', 'Wireless Charging']
    },
    {
      id: '3',
      make: 'Audi',
      model: 'Q7',
      year: 2023,
      sellingPrice: '320000',
      dealershipId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [{
        id: '3',
        url: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Audi Q7',
        fileType: 'image/jpeg'
      }],
      // UI compatibility fields
      price: 320000,
      image: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 8000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Like New',
      features: ['Quattro AWD', 'Virtual Cockpit', 'Premium Plus', 'Panoramic Roof']
    },
    {
      id: '4',
      make: 'Lexus',
      model: 'ES',
      year: 2022,
      sellingPrice: '165000',
      dealershipId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [{
        id: '4',
        url: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Lexus ES',
        fileType: 'image/jpeg'
      }],
      // UI compatibility fields
      price: 165000,
      image: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 18000,
      fuelType: 'Hybrid',
      transmission: 'CVT',
      condition: 'Excellent',
      features: ['Lexus Safety+', 'Mark Levinson Audio', 'Heated/Cooled Seats', 'Wireless Charging']
    },
    {
      id: '5',
      make: 'Toyota',
      model: 'Land Cruiser',
      year: 2023,
      sellingPrice: '425000',
      dealershipId: '3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [{
        id: '5',
        url: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        caption: 'Toyota Land Cruiser',
        fileType: 'image/jpeg'
      }],
      // UI compatibility fields
      price: 425000,
      image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      mileage: 5000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Like New',
      features: ['4WD', 'Off-Road Package', 'Premium Interior', 'Advanced Safety']
    },
    {
      id: '6',
      make: 'BMW',
      model: '3 Series',
      year: 2022,
      sellingPrice: '175000',
      dealershipId: '3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [{
        id: '6',
        url: 'https://images.carswitch.com/674674hyundai/1834616745255781.jpeg?fit=crop&w=305&h=228&auto=format,compress&q=30',
        caption: 'BMW 3 Series',
        fileType: 'image/jpeg'
      }],
      // UI compatibility fields
      price: 175000,
      image: 'https://images.carswitch.com/674674hyundai/1834616745255781.jpeg?fit=crop&w=305&h=228&auto=format,compress&q=30',
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      condition: 'Good',
      features: ['Sport Package', 'Navigation', 'Heated Seats', 'Backup Camera']
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
    // If we have fetched cars from API, use those, otherwise use fallback
    if (dealerCars.length > 0) {
      return dealerCars;
    }
    return dealerInventory.filter(car => car.dealershipId === selectedDealership);
  };

  const handleDesiredCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDealerships();
  };

  const handleDealershipSelect = async (dealershipId: string) => {
    setSelectedDealership(dealershipId);
    setLoading(prev => ({ ...prev, dealerCars: true }));
    setError(prev => ({ ...prev, dealerCars: '' }));
    setDealerCars([]);
    
    try {
      // First try to get filtered dealership cars based on desired vehicle
      let carsData: any[] = [];
      let response;
      
      if (desiredVehicle.make || desiredVehicle.model) {
        // Build query parameters for filtered search
        const queryParams = new URLSearchParams();
        if (desiredVehicle.make) queryParams.append('make', desiredVehicle.make);
        if (desiredVehicle.model) queryParams.append('model', desiredVehicle.model);
        if (desiredVehicle.year) queryParams.append('year', desiredVehicle.year);
        if (desiredVehicle.maxPrice) queryParams.append('maxPrice', desiredVehicle.maxPrice);
        if (desiredVehicle.fuelType) queryParams.append('fuelType', desiredVehicle.fuelType);
        if (desiredVehicle.transmission) queryParams.append('transmission', desiredVehicle.transmission);
        queryParams.append('dealershipId', dealershipId);
        
        // Try filtered endpoint first
        try {
          response = await axiosInstance.get(`/api/1.0/trade/filtered-dealership-cars?${queryParams.toString()}`);
          carsData = response?.data?.data || [];
          console.log('Filtered dealership cars:', carsData);
        } catch (filterErr) {
          console.error('Error fetching filtered dealership cars:', filterErr);
          // If filtered search fails, we'll continue to the fallback
        }
      }
      
      // If no results from filtered search, fall back to getting all cars from the dealership
      if (carsData.length === 0) {
        response = await axiosInstance.get(`/api/1.0/dealership-car/find-all?dealershipId=${dealershipId}`);
        carsData = response?.data?.data || [];
        console.log('All dealership cars:', carsData);
      }
      
      // Map API response to include UI compatibility fields
      const mappedCars = carsData.map((car: any) => ({
        ...car,
        price: parseInt(car.sellingPrice) || 0,
        image: car.images && car.images.length > 0 ? car.images[0].url : 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        mileage: 15000, // Default value as it's not in the API
        fuelType: 'Gasoline', // Default value as it's not in the API
        transmission: 'Automatic', // Default value as it's not in the API
        condition: 'Excellent', // Default value as it's not in the API
        features: ['Leather Seats', 'Navigation', 'Bluetooth'] // Default value as it's not in the API
      }));
      
      setDealerCars(mappedCars);
    } catch (err) {
      console.error('Error fetching dealership cars:', err);
      setError(prev => ({ ...prev, dealerCars: 'Failed to load dealership cars' }));
      // We'll use the fallback inventory in getFilteredInventory
    } finally {
      setLoading(prev => ({ ...prev, dealerCars: false }));
      setCurrentStep('inventory');
    }
  };

  const handleCarSelect = (car: DealerCar) => {
    setSelectedCar(car);
    setCurrentStep('trade-details');
  };

  const [appointmentStatus, setAppointmentStatus] = useState<{
    loading: boolean;
    error: string;
    success: boolean;
  }>({
    loading: false,
    error: '',
    success: false
  });

  const createAppointment = async () => {
    setAppointmentStatus({ loading: true, error: '', success: false });
    
    try {
      if (!selectedCar) {
        throw new Error('No car selected for trade-in');
      }
      
      // Format the appointment time as ISO 8601 date string
      const formatTimeToISO = (dateStr: string, timeStr: string) => {
        // Parse the time string (e.g., "9:00 AM")
        const [hourMinute, period] = timeStr.split(' ');
        let [hours] = hourMinute.split(':').map(Number);
        const minutes = hourMinute.split(':').map(Number)[1];
        
        // Convert to 24-hour format if PM
        if (period === 'PM' && hours < 12) {
          hours += 12;
        }
        // Convert 12 AM to 0 hours
        if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        // Create a new date with the combined date and time
        const date = new Date(dateStr);
        date.setHours(hours, minutes, 0, 0);
        
        // Return ISO string
        return date.toISOString();
      };
      
      // Format the data according to API requirements
      const appointmentData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone:'+' + personalInfo.phone,
        carDetails: {
          dealershipCarId: selectedCar.id,
          make: selectedCar.make,
          model: selectedCar.model,
          year: selectedCar.year,
          sellingPrice: selectedCar.sellingPrice,
          dealership: dealerships.find(d => d.id === selectedDealership)?.id,
          tradeInVehicle: {
            ...tradeInVehicle,
            // estimatedValue: calculateTradeInValue()
          }
        },
        appointmentDate: formatTimeToISO(appointmentDetails.date, appointmentDetails.time),
        appointmentTime: formatTimeToISO(appointmentDetails.date, appointmentDetails.time)
      };
      
      // Call the API to create the appointment
      const response = await axiosInstance.post('/api/1.0/trade/appointment/create', appointmentData);
      console.log('Appointment created successfully:', response.data);
      setAppointmentStatus({ loading: false, error: '', success: true });
      return true;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      setAppointmentStatus({
        loading: false, 
        error: error.response?.data?.message || error.message || 'Failed to create appointment', 
        success: false
      });
      return false;
    }
  };

  const handleTradeDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const estimatedValue = calculateTradeInValue();
    setTradeInVehicle(prev => ({ ...prev, estimatedValue }));
    
    // Create the appointment
    const appointmentCreated = await createAppointment();
    if (appointmentCreated) {
      setCurrentStep('confirmation');
    }
    // Error handling is now managed by appointmentStatus state
  };

  // Confirmation Screen
  if (currentStep === 'confirmation') {
    const selectedDealer = dealerships.find(d => d.id === selectedDealership);
   
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
                  🎉 {lang[language].tradeInConfirmed}
                </h1>
                <p className="text-xl text-gray-600">
                  {lang[language].tradeInConfirmedMessage}
                </p>
              </div>

              {/* Car Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Your Trade-In Car */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Car className="h-6 w-6 mr-2 text-red-500" />
                    {lang[language].yourTradeInVehicle}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang[language].vehicle}</span>
                      <span className="font-semibold">{tradeInVehicle.year} {tradeInVehicle.make} {tradeInVehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang[language].mileage}</span>
                      <span className="font-semibold">{parseInt(tradeInVehicle.mileage || '0').toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang[language].condition}</span>
                      <span className="font-semibold capitalize">{tradeInVehicle.condition}</span>
                    </div>
                  </div>
                </div>

                {/* Desired Car */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Car className="h-6 w-6 mr-2 text-blue-500" />
                    {lang[language].yourNewVehicle}
                  </h3>
                  {selectedCar && (
                    <div className="space-y-3">
                      <img 
                        src={selectedCar.image} 
                        alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
                        className="w-[120px] h-[120px] m-auto  object-cover rounded-lg mb-3"
                      />
                      <div className="flex justify-between">
                        <span className="text-gray-600">{lang[language].vehicle}</span>
                        <span className="font-semibold">{selectedCar.year} {selectedCar.make} {selectedCar.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{lang[language].mileage}</span>
                        <span className="font-semibold">{selectedCar.mileage?.toLocaleString() || '0'} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{lang[language].condition}</span>
                        <span className="font-semibold">{selectedCar.condition}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600">{lang[language].vehiclePrice}</span>
                        <span className="font-bold text-blue-600 text-lg">SAR {selectedCar.price?.toLocaleString() || parseInt(selectedCar.sellingPrice || '0').toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">{lang[language].appointmentDetails}</h3>
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
                  <h3 className="text-xl font-bold mb-4">{lang[language].contactInformation}</h3>
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
                <h4 className="font-semibold text-yellow-800 mb-3">{lang[language].whatHappensNext}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                    <div>
                      <p className="font-medium text-yellow-800">{lang[language].vehicleInspection}</p>
                      <p className="text-yellow-700 text-sm">{lang[language].vehicleInspectionDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                    <div>
                      <p className="font-medium text-yellow-800">{lang[language].finalValuation}</p>
                      <p className="text-yellow-700 text-sm">{lang[language].finalValuationDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                    <div>
                      <p className="font-medium text-yellow-800">{lang[language].completeTransaction}</p>
                      <p className="text-yellow-700 text-sm">{lang[language].completeTransactionDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
                >
                  {lang[language].returnHome}
                </button>
                <button
                  onClick={() => alert('Calendar integration coming soon!')}
                  className="border-2 border-[#f78f37] text-[#f78f37] hover:bg-gradient-to-r from-amber-500 to-amber-400 hover:text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  {lang[language].addToCalendar}
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-8 text-center">
                {lang[language].confirmationId}: #TI{Date.now().toString().slice(-6)} | {lang[language].confirmationEmail}: {personalInfo.email}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{lang[language].completeTradeInDetails}</h1>
              <p className="text-gray-600">{lang[language].provideVehicleInfo}</p>
            </div>

            {/* Selected Car Display */}
            {selectedCar && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">{lang[language].selectedVehicle}</h2>
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
            <form onSubmit={(e)=>{
                    if(!desiredVehicle.make || !desiredVehicle.model || !desiredVehicle.year || !desiredVehicle.maxPrice || !desiredVehicle.fuelType || !desiredVehicle.transmission){
                      e.preventDefault();
                      setCurrentStep('desired-car');                      
                    }else{
                      e.preventDefault();
                      handleTradeDetailsSubmit(e);
                    }

            }} className="space-y-8">
              {/* Appointment Status Messages */}
              {appointmentStatus.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{appointmentStatus.error}</p>
                </div>
              )}
              
              {appointmentStatus.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">{lang[language].success}</p>
                  <p className="text-sm">{lang[language].appointmentCreatedSuccessfully}</p>
                </div>
              )}
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">{lang[language].personalInformation}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].firstName}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].lastName}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].emailAddress}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].phoneNumber}</label>
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
                <h2 className="text-xl font-semibold mb-6">{lang[language].yourTradeInVehicle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].make}</label>
                    <div className="relative">
                      <select
                        required
                        value={tradeInVehicle.makeId}
                        onChange={(e) => {
                          setTradeInVehicle({
                            ...tradeInVehicle, 
                            makeId: e.target.value,
                            make: e.target.options[e.target.selectedIndex].text,
                            model: '',
                            modelId: ''
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent appearance-none"
                        disabled={loading.makes}
                      >
                        <option value="">{lang[language].selectMake}</option>
                        {makes?.map(makeItem => (
                          <option key={makeItem.id} value={makeItem.id}>{makeItem.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {loading.makes ? (
                          <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                        ) : (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {error.makes && (
                      <p className="mt-1 text-sm text-red-600">{error.makes}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].model}</label>
                    <div className="relative">
                      <select
                        required
                        value={tradeInVehicle.modelId}
                        onChange={(e) => {
                          setTradeInVehicle({
                            ...tradeInVehicle, 
                            modelId: e.target.value,
                            model: e.target.options[e.target.selectedIndex].text
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent appearance-none"
                        disabled={loading.models || !tradeInVehicle.makeId}
                      >
                        <option value="">{lang[language].selectModel}</option>
                        {models.map(modelItem => (
                          <option key={modelItem.id} value={modelItem.id}>{modelItem.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {loading.models ? (
                          <span className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></span>
                        ) : (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {error.models && (
                      <p className="mt-1 text-sm text-red-600">{error.models}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].year}</label>
                    <div className="relative">
                      <select
                        required
                        value={tradeInVehicle.year}
                        onChange={(e) => setTradeInVehicle({...tradeInVehicle, year: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent appearance-none"
                      >
                        <option value="">{lang[language].selectYear}</option>
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={i} value={2024 - i}>{2024 - i}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].mileage}</label>
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
                      <option value="">{lang[language].selectCondition}</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>

                {tradeInVehicle.make && tradeInVehicle.model && tradeInVehicle.year && tradeInVehicle.mileage && tradeInVehicle.condition && (
                  <div className="mt-4">
                      <div 
                        className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Calculator className="h-5 w-5 mr-2" />
                          <span className="font-medium">{lang[language].enterYourTradeInValue}</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            placeholder="Enter car price"
                            required
                            value={tradeInVehicle.estimatedValue}
                            style={{
                              color: 'black'
                            }}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-dark"
                            onChange={(e) => setTradeInVehicle({...tradeInVehicle, estimatedValue: parseInt(e.target.value) || 0})}
                          />
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </div>
                      </div>
                  </div>
                )}
              </div>

              {/* Appointment Scheduling */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">{lang[language].scheduleAppointment}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].preferredDate}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].preferredTime}</label>
                    <select
                      required
                      value={appointmentDetails.time}
                      onChange={(e) => setAppointmentDetails({...appointmentDetails, time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    >
                      <option value="">{lang[language].selectTime}</option>
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
                  {lang[language].backToInventory}
                </button>
                <button
                  type="submit"
                  disabled={appointmentStatus.loading}
                  className={`flex-1 ${appointmentStatus.loading ? 'bg-[#f7a96b] cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] transform hover:scale-105'} text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center`}
                >
                  {appointmentStatus.loading ? (
                    <>
                      <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
                      {lang[language].creatingAppointment}
                    </>
                  ) : (
                    <>
                      {lang[language].scheduleAppointment}
                      <ArrowRight className="inline-block ml-2 h-5 w-5" />
                    </>
                  )}
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
                {selectedDealer?.name} - {lang[language].availableInventory}
              </h1>
              <p className="text-gray-600">{lang[language].chooseVehicle}</p>
            </div>

            {/* Dealer Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={selectedDealer?.image || selectedDealer?.logo?.url} 
                    alt={selectedDealer?.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedDealer?.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{selectedDealer?.rating || 4.5}</span>
                      <span className="text-sm text-gray-500 ml-1">({selectedDealer?.reviews || 0} {lang[language].reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Trade-In Bonus: +SAR {selectedDealer?.tradeInBonus?.toLocaleString() || '5,000'}
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            {loading.dealerCars ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f78f37]"></div>
                <span className="ml-3 text-lg text-gray-600">{lang[language].loadingInventory}</span>
              </div>
            ) : error.dealerCars ? (
              <div className="text-center py-12 bg-red-50 rounded-xl">
                <Car className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">{lang[language].failedToLoadInventory}</h3>
                <p className="text-gray-600">{error.dealerCars}</p>
                <button 
                  onClick={() => handleDealershipSelect(selectedDealership)}
                  className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition"
                >
                  Try Again
                </button>
              </div>
            ) : (
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
                          {car.mileage?.toLocaleString() || '0'} km • {car.fuelType || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-[#3d3d40]">SAR {car.price?.toLocaleString() || parseInt(car.sellingPrice || '0').toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-3 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>{car.mileage?.toLocaleString() || '0'} km</span>
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
                      {car.features?.slice(0, 2).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {car.features && car.features.length > 2 && (
                        <span className="text-gray-500 text-xs flex items-center">+{car.features.length - 2}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCarSelect(car)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
                      >
                        {lang[language].selectThisCar}
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}

            {inventory.length === 0 && !loading.dealerCars && !error.dealerCars && (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{lang[language].noVehiclesAvailable}</h3>
                <p className="text-gray-500">{lang[language].noVehiclesAvailableDescription}</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('dealerships')}
                className="text-gray-600 hover:text-gray-800 font-medium transition"
              >
                {lang[language].backToDealershipSelection}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{lang[language].chooseYourPreferredDealership}</h1>
              <p className="text-gray-600">{lang[language].selectTheDealershipWhereYoudLikeToCompleteYourTradeIn}</p>
            </div>

            {loading.dealerships ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f78f37]"></div>
                <span className="ml-3 text-lg text-gray-600">{lang[language].loadingDealerships}</span>
              </div>
            ) : error.dealerships ? (
              <div className="text-center py-12 bg-red-50 rounded-xl">
                <Building2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">{lang[language].failedToLoadDealerships}</h3>
                <p className="text-gray-600">{error.dealerships}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition"
                >
                  Try Again
                </button>
              </div>
            ) : dealerships.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{lang[language].noDealershipsAvailable}</h3>
                <p className="text-gray-500">{lang[language].noDealershipsAvailableDescription}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {dealerships.map(dealership => (
                <div key={dealership.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={dealership.image || dealership.logo?.url} 
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
                        <span>{dealership.address || dealership.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{dealership.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{lang[language].processingTime}: {dealership.processingTime}</span>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-sm text-gray-600">
                        <span className="font-semibold text-green-600">{lang[language].tradeInBonus}: SAR {dealership.tradeInBonus}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">{lang[language].specialties}:</h4>
                      <div className="flex flex-wrap gap-1">
                        {dealership.specialties?.map((specialty, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {specialty}
                          </span>
                        )) || (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {lang[language].luxuryCars}
                          </span>
                        )}
                      </div>
                    </div>

                
                    <button
                      onClick={() => handleDealershipSelect(dealership.id)}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
                    >
                      {lang[language].viewInventory}
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('desired-car')}
                className="text-gray-600 hover:text-gray-800 font-medium transition"
              >
                {lang[language].backToCarSelection}
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{lang[language].tradeInYourVehicle}</h1>
            <p className="text-xl text-gray-600">{lang[language].tradeInYourVehicleDescription}</p>
          </div>

          {/* Client Type Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{lang[language].selectClientType}</h2>
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
                  {lang[language].individual}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {lang[language].personalVehicleTradeInForIndividualCustomers}
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
                  {lang[language].corporate}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {lang[language].personalVehicleTradeInForCorporateCustomers}
                </p>
              </button>
            </div>
          </div>

          {/* Desired Vehicle Form */}
          <form onSubmit={handleDesiredCarSubmit}>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">{lang[language].whatCarAreYouLookingFor}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].make}</label>
                  <select
                    required
                    value={desiredVehicle.make}
                    onChange={(e) => {
                      setDesiredVehicle({...desiredVehicle, make: e.target.value,
                        makeName: e.target.options[e.target.selectedIndex].text
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">{lang[language].selectMake}</option>
                    {makes?.map(make => (
                      <option key={make.id} value={make.id}>{make.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].model}</label>
                  <select
                    required
                    value={desiredVehicle.model}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, model: e.target.value,
                      modelName: e.target.options[e.target.selectedIndex].text
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">{lang[language].selectModel}</option>
                    {models?.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
      
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].year}</label>
                  <select
                    required
                    value={desiredVehicle.year}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, year: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">{lang[language].selectYear}</option>
                    {Array.from({ length: 50 }, (_, i) => (
                      <option key={i} value={2024 - i}>{2024 - i}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{lang[language].maxPrice}</label>
                  <input
                    type="number"
                    value={desiredVehicle.maxPrice}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, maxPrice: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                    placeholder="Enter max budget"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={desiredVehicle.fuelType}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, fuelType: e.target.value,
                      fuelTypeName: e.target.options[e.target.selectedIndex].text})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f78f37] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select
                    value={desiredVehicle.transmission}
                    onChange={(e) => setDesiredVehicle({...desiredVehicle, transmission: e.target.value,
                      transmissionName: e.target.options[e.target.selectedIndex].text
                    })}
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
                {lang[language].findDealerships}
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Benefits Section */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-center mb-8">{lang[language].whyChooseOurTradeInService}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{lang[language].fairMarketValue}</h3>
                <p className="text-gray-600">{lang[language].getCompetitivePricing}</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{lang[language].quickProcess}</h3>
                <p className="text-gray-600">{lang[language].quickProcessDescription}</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{lang[language].hassleFree}</h3>
                <p className="text-gray-600">{lang[language].hassleFreeDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeIn;