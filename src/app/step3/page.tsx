'use client';
import React, { useState, useEffect } from 'react';
import { Check, Phone as PhoneIcon, X } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { useLanguage } from '../../contexts/LanguageContext';
import lang  from '../../locale';
import { useRouter } from 'next/navigation';

const Step3 = () => {
    const [branch, setBranch] = useState('');
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [revealPrice, setRevealPrice] = useState(false);
    const [carPrice, setCarPrice] = useState<number | null>(null);
    const [showPhoneVerification, setShowPhoneVerification] = useState(false);
    const [verificationPhone, setVerificationPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [autoFill, setAutoFill] = useState(false);
    const [showPricePopup, setShowPricePopup] = useState(false);
    const [expectedPrice, setExpectedPrice] = useState<number | null>(null);
    const router = useRouter();
    const [carLogo,setCarLogo] = useState<string | null>(null);

    // State for branches from API
    const [branches, setBranches] = useState<{id: string; name: string; address: string, enName: string, arName: string, image?: string, location?: string, distance?: string}[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [branchError, setBranchError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { language } = useLanguage();
    const languageContent = language === 'ar' ? 'ar' : 'en';
    

    
    // State for branch timing slots
    type TimeSlot = {
        label: string;
    };
    
    type DaySchedule = {
        day: string;
        date: string;
        slots: TimeSlot[];
    };
    
    const [branchTimings, setBranchTimings] = useState<DaySchedule[]>([]);
    const [loadingTimings, setLoadingTimings] = useState<boolean | null>(null);
    const [timingsError, setTimingsError] = useState('');
    
    // State for Step2 data
    const [step2Data, setStep2Data] = useState<{
        bodyType: string;
        engineSize: string;
        engineSizeName: string;
        mileage: string;
        mileageName: string;
        option: string;
        paint: string;
        gccSpecs: string;
    } | null>(null);

    // Load Step2 data from sessionStorage
    useEffect(() => {
        const storedStep2Data = sessionStorage.getItem('step2Data');
        if (storedStep2Data) {
            setStep2Data(JSON.parse(storedStep2Data));
        }
        
    }, []);

    useEffect(()=>{
              prefilUserData();
    },[])

    const prefilUserData = async () => {
        let user: any = localStorage.getItem('userDetails');
        if (user) {
            user = JSON.parse(user);
            if(user.firstName){
            setFirstName(user.firstName);
            }
            if(user.lastName){
            setLastName(user.lastName);
            }
            if(user.phone){
            setPhone(user.phone);
            }
            if(user.email){
            setEmail(user.email);
            }
            setAutoFill(true);
        }

        
    };

    
    // Fetch branches from API
    useEffect(() => {
        const fetchBranches = async () => {
            setLoadingBranches(true);
            setBranchError('');
            
            try {
                const response = await axiosInstance.get('/api/1.0/branch');
                // Add mock images, locations and distances to branches
                const branches: any [] = response?.data.filter((r: any)=> r.is_active);
                const branchesWithImages = (branches || []).map((branch: any, index: number) => ({
                    ...branch,
                    image: `https://source.unsplash.com/random/300x200?kiosk,mall,${index}`,
                    location: branch.address || `${language === 'en' ? 'Mall' : 'مول'} ${index + 1}`,
                    distance: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9)}${language === 'en' ? ' km away' : ' كم'}`
                }));
                setBranches(branchesWithImages);
                if (branchesWithImages.length > 0) {
                    // Don't auto-select a branch, let user choose
                }
            } catch (err) {
                console.error('Error fetching branches:', err);
                setBranchError('Failed to load branches');
            } finally {
                setLoadingBranches(false);
            }
        };
        
        fetchBranches();

        fetchLogo();
      

    }, []);
    

    const fetchLogo = async () => {
        const storedStep1Data = sessionStorage.getItem('carDetails');
        const step1Data = storedStep1Data ? JSON.parse(storedStep1Data) : {};
        const response = await axiosInstance.get(
            `/api/1.0/car/logo/${step1Data.make.toLowerCase()}`,
            { responseType: "blob" } // 👈 important for binary data
          );
  
        const imageUrl = URL.createObjectURL(response.data);
        setCarLogo(imageUrl);
    }

    // Fetch branch timings from API
    useEffect(() => {
        const fetchBranchTimings = async () => {
            if (!branch) return;
            
            setLoadingTimings(true);
            setTimingsError('');
            setSelectedDay(null);
            setSelectedTimeSlot(null);
            
            try {
                const response = await axiosInstance.get('/api/1.0/branch-timing');
                setBranchTimings(response?.data || []);
                if (response?.data?.length > 0) {
                    // Don't auto-select a day/time, let user choose
                }
            } catch (err) {
                console.error('Error fetching branch timings:', err);
                setTimingsError('Failed to load available time slots');
            } finally {
                setLoadingTimings(false);
            }
        };
        
        fetchBranchTimings();
    }, [branch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Validate all required fields
            const validationErrors: any [] = [];
            
            if (!branch) {
                validationErrors.push('Please select a branch');
            }
            
            // Validate day and time slot
            const selectedDayObj = branchTimings.find(day => day.day === selectedDay);
            if (!selectedDayObj) {
                validationErrors.push('Please select a day');
            }
            
            if (!selectedTimeSlot) {
                validationErrors.push('Please select a time slot');
            }
            
            // Validate personal information
            if (!firstName.trim()) {
                validationErrors.push('Please enter your first name');
            }
            
            if (!lastName.trim()) {
                validationErrors.push('Please enter your last name');
            }
            
            if (!phone.trim()) {
                validationErrors.push('Please enter your phone number');
            }
            
            if (!email.trim()) {
                validationErrors.push('Please enter your email address');
            } else if (!/^\S+@\S+\.\S+$/.test(email)) {
                validationErrors.push('Please enter a valid email address');
            }
            
            // If there are validation errors, show them and stop form submission
            if (validationErrors.length > 0) {
                alert(validationErrors.join('\n'));
                return;
            }
            
            // Check if car price is null, if so show the price popup
            if (carPrice === null) {
                setShowPricePopup(true);
                return;
            }
            
            // Get step1 data from sessionStorage if available
            const storedStep1Data = sessionStorage.getItem('carDetails');
            const step1Data = storedStep1Data ? JSON.parse(storedStep1Data) : {};
            
            // Format the appointment date and time
            // Extract date parts from the selectedDayObj.date (format: "Jun 30")
            // We've already validated selectedDayObj exists above, but add a safety check
            const [month, day] = selectedDayObj?.date?.split(' ') || [];
            const currentYear = new Date().getFullYear();
            
            // Create a date string in ISO format
            // Make sure we have valid date parts before creating the date
            if (!month || !day) {
                throw new Error('Invalid date format');
            }
            const appointmentDate = new Date(`${month} ${day}, ${currentYear}`).toISOString();
            
            // Combine all car details from step1 and step2
            const carDetail = JSON.stringify({
                ...step1Data,
                ...step2Data,
                engineSize: step2Data?.engineSizeName,
                mileage: step2Data?.mileageName,
                carPrice: carPrice ? carPrice : 0,
            });
            
            // Prepare the request body
            const bookingData = {
                branchId: Number(branch),
                appointmentDate: appointmentDate,
                appointmentTime: appointmentDate, // Using the same date for now, would need proper time parsing
                firstName,
                lastName,
                phone,
                email,
                carDetail,
                status: 'Scheduled',
                type: 'sell'
            };

       
            
            // Make the API call
     
            const response = await axiosInstance.post('/api/1.0/book-appointment/', bookingData);
            
            // Store the response data in localStorage for the confirmation page
            localStorage.setItem('bookingDetails', JSON.stringify({
                branch: branches.find(b => b.id == branch)?.enName || '',
                date: appointmentDate,
                time: selectedTimeSlot,
                firstName,
                lastName,
                phone,
                email,
                bookingId: response.data?.uid || '',
                carPrice: carPrice,
                id: response.data?.uid || '',
            }));
            
            // Store car details in localStorage
            if (step1Data && step2Data) {
                localStorage.setItem('carDetails', JSON.stringify({
                    make: step1Data.make || '',
                    model: step1Data.model || '',
                    year: step1Data.year || '',
                    price: carPrice,
                    image: step1Data.image || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb'
                }));
            }

            
            // Redirect to confirmation page
            router.push('/confirmation');
            
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('There was an error submitting your booking. Please try again.');
        }
    };

    return (
        <div className="max-w-5xl mt-[120px] mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="relative">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div style={{ width: '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-amber-400"></div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                            <div className="mt-2 font-medium text-[#f78f37]">{lang[languageContent].select}</div>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                            <div className="mt-2 font-medium text-[#f78f37]">{lang[languageContent].condition}</div>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center">
                                <div className="h-3 w-3 bg-white rounded-full"></div>
                            </div>
                            <div className="mt-2 font-medium text-[#f78f37]">{lang[languageContent].book}</div>
                        </div>
                    </div>
                </div>
            </div>
            
        
            
            <h2 className="text-2xl font-bold text-center mb-6">{lang[languageContent].bookFreeCarInspection}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Car Image & Price */}
                <div className="md:col-span-1">
                    <div className="bg-[#3d3d40] text-white p-4 rounded-t-lg">
                        <div className="flex justify-between items-center">
                            <div className="w-full">
                                <p className="text-sm">{lang[languageContent].yourVehicleMarketPrice}</p>
                                <h3 className="text-3xl font-bold flex items-center animate-pulse w-full flex justify-between">SAR
                                {revealPrice ? (carPrice ? ` ${carPrice.toLocaleString()}` : '') : 
                                  <button
                                    onClick={async ()=>{
                                        try {
                                            setIsLoading(true);
                                            // Sample car data - in a real app, you would get this from form inputs or state
                                            const storedStep1Data = sessionStorage.getItem('carDetails');
                                            const step1Data = storedStep1Data ? JSON.parse(storedStep1Data) : {};
                                            const step2 = sessionStorage.getItem('step2Data');
                                            const step2Data = step2 ? JSON.parse(step2) : {};
                                            const carData = {
                                                make: step1Data.make,
                                                model: step1Data.model,
                                                year: Number(step1Data.year),
                                                mileage: step2Data.mileageName,
                                                bodyType: step2Data.bodyTypeName,
                                                engineType: 'Petrol',
                                                engineSize: step2Data.engineSizeName,
                                                gearType: 'Automatic',
                                                specs: step2Data.gccSpecs,
                                            };
                                            const response = await axiosInstance.post('/api/1.0/core/evaluate/car', carData);
                                            
                                            if (response.data) {
                                                setCarPrice(response.data.priceEstimate?.valueRange?.low);
                                            }
                                            setRevealPrice(true);
                                            setIsLoading(false);
                                        } catch (error) {
                                            console.error('Error fetching car price:', error);
                                            setRevealPrice(true); // Still reveal the UI section even if API fails
                                            setIsLoading(false);
                                        }
                                    
                                    }}
                                    className="bg-gradient-to-r from-amber-500 to-amber-400 ml-2 mr-2 text-xs px-3 py-1 rounded hover:bg-yellow-600 transition w-[140px] mt-2 h-[40px] flex items-center justify-center">
                                        {!isLoading? 'REVEAL PRICE': 
                                        
                                        <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>

                                        }
                                    </button>
                                }
                                </h3>
                            </div>
                           
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-b-lg shadow-md">
                        {/* Car Details Summary - Cart-like section */}
                        <div className="border border-gray-200 rounded-lg p-3 mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">{language === "en" ? "Your Car Details" : "تفاصيل سيارتك"}</h4>
                            <div className="flex items-center">
                                <div className="w-1/4 mr-3">
                                    <div className="rounded-lg h-20 flex items-center justify-center">
                                        {carLogo && <img src={carLogo} alt="Car Logo" className="w-16 h-16 object-contain" />}
                                    </div>
                                </div>
                                <div className="w-3/4">
                                    {step2Data && (
                                        <>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs text-gray-500">{language === "en" ? "Car" : "سيارة"}</span>
                                                <span className="text-xs font-medium">
                                                    {(() => {
                                                        const storedStep1Data = sessionStorage.getItem('carDetails');
                                                        const step1Data = storedStep1Data ? JSON.parse(storedStep1Data) : {};
                                                        return `${step1Data.make || '—'} ${step1Data.model || '—'} ${step1Data.year || '—'}`;
                                                    })()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs text-gray-500">{language === "en" ? "Engine" : "المحرك"}</span>
                                                <span className="text-xs font-medium">{step2Data.engineSizeName || '—'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">{language === "en" ? "Mileage" : "المسافة المقطوعة"}</span>
                                                <span className="text-xs font-medium">{step2Data.mileageName || '—'}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                   
                    </div>
                </div>
                
                {/* Right Column - Booking Form */}
                <div className="md:col-span-2 bg-[#eaeaea] p-6 rounded-lg">
                    <form id="appointmentForm" onSubmit={handleSubmit}>
                        {/* Branch Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3">{lang[languageContent].branches}</label>
                            <div>
                                {loadingBranches ? (
                                    <div className="py-6 px-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f78f37] mx-auto mb-2"></div>
                                        <div className="text-gray-500">{lang[languageContent].loadingBranches}</div>
                                    </div>
                                ) : branchError ? (
                                    <div className="py-3 px-4 text-red-500">{branchError}</div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {branches.map((branchItem) => (
                                            <div 
                                                key={branchItem.id} 
                                                onClick={() => setBranch(branchItem.id)}
                                                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${branch === branchItem.id ? 'border-[#f78f37] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div className="flex h-full">
                                                    {/* Left side - smaller image */}
                                                    <div className="relative w-1/3 h-full">
                                                        <img 
                                                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsSHkHJo3lDVYKlenp1sGYGzgfnPwzstj9AA&s'} 
                                                            alt={language === "en" ? branchItem.enName : branchItem.arName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {branch === branchItem.id && (
                                                            <div className="absolute top-2 right-2 bg-[#f78f37] text-white rounded-full p-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Right side - branch details */}
                                                    <div className="p-3 bg-white w-2/3">
                                                        <h3 className="font-medium text-gray-900">
                                                            {language === "en" ? branchItem.enName : branchItem.arName}
                                                        </h3>
                                                        
                                                        {/* Location with link */}
                                                        <a 
                                                            href={`https://maps.google.com/?q=${encodeURIComponent(branchItem.location || '')}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()} 
                                                            className="text-sm text-gray-500 mt-1 flex items-center hover:text-[#f78f37]"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {branchItem.location}
                                                        </a>
                                                        
                                                        {/* Distance indicator */}
                                                        <p className="text-sm text-[#f78f37] mt-1 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                            </svg>
                                                            {branchItem.distance}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {branch && (
                                <div className="mt-2 text-sm text-green-600 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {lang[languageContent].branchSelected || 'Branch selected successfully'}
                                </div>
                            )}
                        </div>
                        
                        {/* Date and Time Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">{lang[languageContent].selectDayTime}</label>
                            
                            {loadingTimings ? (
                                <div className="text-center py-4" >
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f78f37] mx-auto"></div>
                                    <p 
                                    className="mt-2 text-sm text-gray-600">{lang[languageContent].loadingTimeSlots}</p>
                                </div>
                            ) : timingsError ? (
                                <div className="text-red-500 text-sm py-2">{timingsError}</div>
                            ) : branchTimings.length === 0 && branch ? (
                                <div className="text-gray-500 text-sm py-2">{lang[languageContent].noTimeSlotsAvailable}</div>
                            ) : branch ? (
                                <div>
                                    {/* Days selection */}
                                    <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
                                        {branchTimings.map((daySchedule, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDay(daySchedule.day);
                                                    setSelectedTimeSlot(null);
                                                }}
                                                className={`flex-shrink-0 px-4 py-2 rounded-lg border ${
                                                    selectedDay === daySchedule.day
                                                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white border-[#f78f37]'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#f78f37]'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <div className="font-medium">{daySchedule.day}</div>
                                                    <div className="text-xs">{daySchedule.date}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Time slots */}
                                    {selectedDay && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">{lang[languageContent].availableTimeSlots}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                {branchTimings
                                                    .find(day => day.day === selectedDay)
                                                    ?.slots.map((slot, index) => (
                                                        <button
                                                            key={index}
                                                            dir={'ltr'}
                                                            type="button"
                                                            onClick={() => setSelectedTimeSlot(slot.label)}
                                                            className={`px-3 py-2 text-sm rounded-lg border ${
                                                                selectedTimeSlot === slot.label
                                                                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white border-[#f78f37]'
                                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#f78f37]'
                                                            }`}
                                                        >
                                                            {slot.label}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm py-2">{lang[languageContent].pleaseSelectBranchFirst}</div>
                            )}
                        </div>
                        
                        {/* Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{lang[languageContent].firstName}</label>
                                <input
                                    type="text"
                                    disabled={autoFill}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder={lang[languageContent].firstName}
                                    className={`block w-full rounded-lg border-gray-300 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 ${autoFill ? 'bg-gray-100' : 'bg-white'}`}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{lang[languageContent].lastName}</label>
                                <input
                                    type="text"
                                    disabled={autoFill}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder={lang[languageContent].lastName}
                                    className={`block w-full rounded-lg border-gray-300 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 ${autoFill ? 'bg-gray-100' : 'bg-white'}`}
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Mobile */}
                        <div dir="ltr" className="mb-4">
                            <label className={`block text-sm font-medium mb-1 ${languageContent === 'ar' ? 'text-right' : 'text-left'}`}>{lang[languageContent].mobile}</label>
                            <div className="flex">
                                <span className={`inline-flex items-center px-3 text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300`}>
                                    +966
                                </span>
                                <input
                                    type="tel"
                                    disabled={autoFill}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={lang[languageContent].mobile}
                                    className={`block w-full rounded-r-lg border-gray-300 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 ${autoFill ? 'bg-gray-100' : 'bg-white'}`}
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">{lang[languageContent].email}</label>
                            <input
                                type="email"
                                disabled={autoFill}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={lang[languageContent].email}
                                className={`block w-full rounded-lg border-gray-300 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 ${autoFill ? 'bg-gray-100' : 'bg-white'}`}
                                required
                            />
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md mt-4"
                        >
                            {lang[languageContent].bookAppointment}
                        </button>
                    </form>
                    

                </div>
            </div>
            
            {/* Expected Price Popup */}
            {showPricePopup && (
                <div className="fixed inset-0 bg-[#9797977d] bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => setShowPricePopup(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f78f37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Expected Car Price</h3>
                            <p className="text-gray-600 mt-1">
                                Please enter your expected price for the car to continue with the appointment.
                            </p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Expected Price (SAR)</label>
                            <input
                                type="number"
                                value={expectedPrice || ''}
                                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                                placeholder="Enter expected price"
                                className="block w-full rounded-lg border-gray-300 border-2 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                required
                            />
                        </div>
                        
                        <button
                            onClick={() => {
                                if (expectedPrice && expectedPrice > 0) {
                                    setCarPrice(expectedPrice);
                                    setShowPricePopup(false);
                                    // Submit the form after setting the price
                                    setTimeout(() => {
                                        document.getElementById('appointmentForm')?.dispatchEvent(
                                            new Event('submit', { bubbles: true, cancelable: true })
                                        );
                                    }, 100);
                                }
                            }}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#f78f37] focus:ring-opacity-50 shadow-md"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
            
            {/* Phone Verification Modal */}
            {showPhoneVerification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => setShowPhoneVerification(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <PhoneIcon className="h-8 w-8 text-[#f78f37]" />
                            </div>
                            <h3 className="text-xl font-bold">{otpVerified ? 'Verification Successful!' : (otpSent ? 'Enter Verification Code' : 'Verify Your Phone Number')}</h3>
                            <p className="text-gray-600 mt-1">
                                {otpVerified ? 'Thank you for verifying your phone number.' : 
                                 (otpSent ? 'We sent a 6-digit code to your phone.' : 'To reveal your vehicle price, please verify your phone number.')}
                            </p>
                        </div>
                        
                        {!otpVerified && (
                            <div>
                                {!otpSent ? (
                                    <div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-1">Mobile Number</label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
                                                    +966
                                                </span>
                                                <input
                                                    type="tel"
                                                    value={verificationPhone}
                                                    onChange={(e) => setVerificationPhone(e.target.value)}
                                                    placeholder="Phone Number"
                                                    className="block w-full border-2 rounded-r-lg border-gray-300 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (verificationPhone.trim()) {
                                                    // Simulate sending OTP
                                                    setOtpSent(true);
                                                    setOtpError('');
                                                    // In a real app, you would call an API to send the OTP
                                                }
                                            }}
                                            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#f78f37] focus:ring-opacity-50 shadow-md"
                                        >
                                            Send Verification Code
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium mb-3 text-center">Enter the 6-digit code</label>
                                            <InputOTP
                                                maxLength={6}
                                                value={otp}
                                                onChange={(value: string) => setOtp(value)}
                                                containerClassName="justify-center gap-2"
                                            >
                                                <InputOTPGroup className="gap-2">
                                                    <InputOTPSlot index={0} className="rounded-md border-gray-300" />
                                                    <InputOTPSlot index={1} className="rounded-md border-gray-300" />
                                                    <InputOTPSlot index={2} className="rounded-md border-gray-300" />
                                                    <InputOTPSlot index={3} className="rounded-md border-gray-300" />
                                                    <InputOTPSlot index={4} className="rounded-md border-gray-300" />
                                                    <InputOTPSlot index={5} className="rounded-md border-gray-300" />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
                                        </div>
                                        
                                        <div className="flex flex-col space-y-3">
                                            <button
                                                onClick={() => {
                                                    // Simulate OTP verification
                                                    if (otp.length === 6) {
                                                        // For demo, we'll accept any 6-digit code
                                                        // In a real app, you would verify this with your backend
                                                        setOtpVerified(true);
                                                        setOtpError('');
                                                        // Set the phone number for the booking form
                                                        setPhone(verificationPhone);
                                                    } else {
                                                        setOtpError('Please enter a valid 6-digit code');
                                                    }
                                                }}
                                                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#f78f37] focus:ring-opacity-50 shadow-md"
                                            >
                                                Verify Code
                                            </button>
                                            
                                            <button
                                                onClick={() => {
                                                    // Resend OTP logic would go here
                                                    setOtp('');
                                                    setOtpError('');
                                                }}
                                                className="text-[#f78f37] hover:text-[#e67d26] text-sm font-medium"
                                            >
                                                Resend Code
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {otpVerified && (
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setShowPhoneVerification(false);
                                        setRevealPrice(true);
                                    }}
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#f78f37] focus:ring-opacity-50 shadow-md"
                                >
                                    View Your Vehicle Price
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Disclaimer */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-sm text-gray-600">
                <h3 className="font-bold mb-2">{lang[languageContent].disclaimer}</h3>
                <p className="mb-2">{lang[languageContent].assumptions}</p>
                <ol className="list-decimal pl-5 space-y-1">
                    <li>{lang[languageContent].assumption1}</li>
                    <li>{lang[languageContent].assumption2}</li>
                    <li>{lang[languageContent].assumption3}</li>
                    <li>{lang[languageContent].assumption4}</li>
                </ol>
                <p className="mt-2">{lang[languageContent].assumption5}</p>
            </div>
        </div>
    );
};

export default Step3;
