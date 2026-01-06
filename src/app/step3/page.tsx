'use client';
import React, { useState, useEffect } from 'react';
import { Check, Phone as PhoneIcon, X } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { useLanguage } from '../../contexts/LanguageContext';
import lang  from '../../locale';
import { useRouter } from 'next/navigation';
import { useToast } from '../../hooks/use-toast';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

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

    // Seller OTP authentication states
    const [showSellerOtpPopup, setShowSellerOtpPopup] = useState(false);
    const [sellerOtp, setSellerOtp] = useState('');
    const [sellerOtpError, setSellerOtpError] = useState('');
    const [sellerOtpSending, setSellerOtpSending] = useState(false);
    const [sellerOtpVerifying, setSellerOtpVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const [pendingBookingData, setPendingBookingData] = useState<any>(null);

    // State for branches from API
    const [branches, setBranches] = useState<{id: string; name: string; address: string, enName: string, arName: string, image?: string, location?: string, distance?: string}[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [branchError, setBranchError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [, setRecaptchaReady] = useState(false);
    const { toast } = useToast();

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

    // State for Step1 data (car details)
    const [step1Data, setStep1Data] = useState<{
        make: string;
        model: string;
        year: string;
    } | null>(null);

    // Load Step1 and Step2 data from sessionStorage
    useEffect(() => {
        const storedStep1Data = sessionStorage.getItem('carDetails');
        if (storedStep1Data) {
            setStep1Data(JSON.parse(storedStep1Data));
        }
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


        // Monitor reCAPTCHA availability
    useEffect(() => {
        if (executeRecaptcha) {
        console.log('reCAPTCHA is available');

        // Just mark as ready when the hook is available
        // We'll execute it only when the form is submitted
        setRecaptchaReady(true);
        }
    }, [executeRecaptcha]);

    

        // Resend timer countdown effect
    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    // Send OTP to seller
    const sendSellerOtp = async () => {
        if (sellerOtpSending) return; // Prevent multi-click
        
        setSellerOtpSending(true);
        setSellerOtpError('');
        
        try {
            await axiosInstance.post('/api/auth/seller/sign-up', {
                email: email.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim()
            });
            
            // Set resend timer: 120s for first resend, 240s thereafter
            const timerDuration = resendCount === 0 ? 120 : 240;
            setResendTimer(timerDuration);
            setResendCount((prev) => prev + 1);
            
        } catch (error: any) {
            console.error('Error sending OTP:', error);
            toast({
                title: 'Error',
                description: 'Error sending OTP',
                variant: 'destructive',
            });
            
            setSellerOtpError(error?.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setSellerOtpSending(false);
        }
    };

    // Verify OTP and proceed with booking
    const verifySellerOtp = async () => {
        if (sellerOtpVerifying || sellerOtp.length !== 6) return; // Prevent multi-click
        
        setSellerOtpVerifying(true);
        setSellerOtpError('');
        
        try {
            const response = await axiosInstance.post('/api/auth/verify-otp', {
                otp: sellerOtp,
                target: email.trim()
            });
            
            // OTP verified successfully, store tokens and user details
            const { access_token, refresh_token, id, firstName: resFirstName, lastName: resLastName, phone: resPhone, email: resEmail, avatar } = response.data;
            
            // Store tokens for axios interceptor
            localStorage.setItem('token', access_token);
            localStorage.setItem('authToken', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            
            // Store user details in localStorage
            localStorage.setItem('userDetails', JSON.stringify({
                id,
                firstName: resFirstName || firstName.trim(),
                lastName: resLastName || lastName.trim(),
                phone: resPhone || phone.trim(),
                email: resEmail || email.trim(),
                avatar
            }));
            
            // Dispatch event to notify Navbar of auth state change
            window.dispatchEvent(new Event('authStateChanged'));
            
            toast({
                title: 'Success',
                description: 'OTP verified successfully',
                variant: 'default',
            });
            setShowSellerOtpPopup(false);
            
            // Proceed with booking using pending data
            if (pendingBookingData) {
                await submitBooking(pendingBookingData);
            }
            
        } catch (error: any) {
            console.error('Error verifying OTP:', error);
            toast({
                title: 'Error',
                description: 'Error verifying OTP',
                variant: 'destructive',
            });
            setSellerOtpError(error?.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setSellerOtpVerifying(false);
        }
    };

    // Submit booking API call
    const submitBooking = async (bookingData: any) => {
     
             
        try {
        // Check if reCAPTCHA is available
        let recaptchaToken = '';
        if (!executeRecaptcha) {
            console.warn('reCAPTCHA not available, proceeding without verification');
            // Continue without reCAPTCHA for testing
        } else {
            try {
            // Try to execute reCAPTCHA
            recaptchaToken = await executeRecaptcha('book_appointment');
            console.log('reCAPTCHA token:', recaptchaToken);
            bookingData.recaptchaToken = recaptchaToken;
            } catch (recaptchaError) {
                toast({
                    title: 'Error',
                    description: 'reCAPTCHA execution error',
                    variant: 'destructive',
                });
            console.error('reCAPTCHA execution error:', recaptchaError);
            // Continue without reCAPTCHA for now
            }
            
        }

 
            const response = await axiosInstance.post('/api/1.0/book-appointment/', bookingData);
            
            // Store the response data in localStorage for the confirmation page
            localStorage.setItem('bookingDetails', JSON.stringify({
                branch: branches.find(b => b.id == branch)?.enName || '',
                date: bookingData.appointmentDate,
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
            const storedStep1Data = sessionStorage.getItem('carDetails');
            const step1Data = storedStep1Data ? JSON.parse(storedStep1Data) : {};
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
    
    }
    


    
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
                appointmentTime: selectedTimeSlot || '',
                firstName,
                lastName,
                phone,
                email,
                carDetail,
                status: 'Scheduled',
                type: 'sell'
            };

            // Check if user is logged in
            const userDetails = localStorage.getItem('userDetails');
            if (!userDetails) {
                // User not logged in, show OTP popup and send OTP
                setPendingBookingData(bookingData);
                setShowSellerOtpPopup(true);
                setSellerOtp('');
                setSellerOtpError('');
                setResendCount(0);
                // Send OTP immediately when popup opens
                await sendSellerOtp();
                return;
            }
            
            // User is logged in, proceed with booking directly
            await submitBooking(bookingData);
            
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('There was an error submitting your booking. Please try again.');
        }
    };

    const currentStep = 3;
    const totalSteps = 3;
    const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
    const progressSteps = [
        { key: 'select', label: lang[languageContent].select, state: currentStep > 1 ? 'done' : 'active' },
        { key: 'condition', label: lang[languageContent].condition, state: currentStep > 2 ? 'done' : 'upcoming' },
        { key: 'book', label: lang[languageContent].book, state: currentStep >= 3 ? 'active' : 'upcoming' },
    ];
    


    return (
        <div className="max-w-6xl mt-[120px] mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-8">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span className="font-semibold text-gray-800">Step {currentStep} / {totalSteps}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">In progress</span>
    </div>
    <div className="relative">
        <div className="absolute top-6 left-3 right-3 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div style={{ width: `${progressPercent}%` }} className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-300 shadow-[0_8px_20px_-10px_rgba(245,158,11,0.9)]" />
        </div>
        <div className="relative flex justify-between">
            {progressSteps.map((step, idx) => {
                const isDone = step.state === 'done';
                const isActive = step.state === 'active';
                return (
                    <div key={step.key} className="flex flex-col items-center gap-1 w-1/3 text-center">
                        <div className={`h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all ${isDone ? 'bg-gradient-to-r from-amber-500 to-amber-400 border-amber-300 shadow-md' : isActive ? 'bg-white border-amber-400 ring-4 ring-amber-100' : 'bg-white border-gray-200'}`}>
                            {isDone ? <Check className="h-5 w-5 text-white" /> : <span className={`text-sm font-semibold ${isActive ? 'text-amber-600' : 'text-gray-400'}`}>{idx + 1}</span>}
                        </div>
                        <span className={`text-sm font-semibold ${isActive ? 'text-gray-900' : isDone ? 'text-gray-700' : 'text-gray-500'}`}>{step.label}</span>
                        <span className="text-[11px] text-gray-500">{isDone ? 'Completed' : isActive ? 'Currently filling' : 'Up next'}</span>
                    </div>
                );
            })}
        </div>
    </div>
</div>
            </div>
            
        
            
            <h2 className="text-2xl font-bold text-center mb-8">{lang[languageContent].bookFreeCarInspection}</h2>
            
            {/* Car Summary Banner - Full Width */}
            <div className="mb-8 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Car Info */}
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            {carLogo && <img src={carLogo} alt="Car Logo" className="w-14 h-14 object-contain" />}
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-1">{language === "en" ? "Your Vehicle" : "سيارتك"}</p>
                            <h3 className="text-white text-xl font-bold">
                                {step1Data ? `${step1Data.make || '—'} ${step1Data.model || '—'} ${step1Data.year || ''}` : '—'}
                            </h3>
                            <div className="flex gap-4 mt-2">
                                {step2Data && (
                                    <>
                                        <span className="text-slate-300 text-xs bg-white/10 px-2 py-1 rounded">{step2Data.engineSizeName || '—'}</span>
                                        <span className="text-slate-300 text-xs bg-white/10 px-2 py-1 rounded">{step2Data.mileageName || '—'}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Price Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="text-slate-400 text-sm mb-1">{lang[languageContent].yourVehicleMarketPrice}</p>
                        {revealPrice && carPrice ? (
                            <div className="text-3xl font-bold text-amber-400">
                                SAR {carPrice ? carPrice.toLocaleString() : '—'}
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    try {
                                        setIsLoading(true);

                                        let recaptchaToken = '';
                                        if (executeRecaptcha) {
                                            try {
                                                recaptchaToken = await executeRecaptcha('evaluate');
                                            } catch (recaptchaError) {
                                            
                                                console.error('reCAPTCHA execution error:', recaptchaError);
                                            }
                                        }
                                        
                                        const carData = {
                                            make: step1Data?.make,
                                            model: step1Data?.model,
                                            year: Number(step1Data?.year),
                                            mileage: step2Data?.mileageName,
                                            bodyType: step2Data?.bodyType,
                                            engineType: 'Petrol',
                                            engineSize: step2Data?.engineSizeName,
                                            gearType: 'Automatic',
                                            specs: step2Data?.gccSpecs,
                                            recaptchaToken,
                                        };
                                        const response = await axiosInstance.post('/api/1.0/core/evaluate/car', carData);
                                        
                                        if (response.data) {
                                            setCarPrice(response.data.priceEstimate?.valueRange?.low);
                                        }
                                        setRevealPrice(true);
                                        setIsLoading(false);
                                    } catch (error: any) {
                                        console.error('Error fetching car price:', error);
                                        toast({
                                            title: 'Error',
                                            description: error.response?.data?.message || 'Error fetching car price',
                                            variant: 'destructive',
                                        });
                                        setRevealPrice(true);
                                        setIsLoading(false);
                                    }
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2"
                            >
                                {!isLoading ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        {lang[languageContent].revealPrice}
                                    </>
                                ) : (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Booking Form - Full Width */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <form id="appointmentForm" onSubmit={handleSubmit}>
                        {/* Branch Selection - Vertical List Style */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{lang[languageContent].branches}</h3>
                            </div>
                            <div className="md:ml-5 md:pl-8 md:border-l-2 border-slate-200">
                                {loadingBranches ? (
                                    <div className="py-6 px-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-2"></div>
                                        <div className="text-gray-500">{lang[languageContent].loadingBranches}</div>
                                    </div>
                                ) : branchError ? (
                                    <div className="py-3 px-4 text-red-500">{branchError}</div>
                                ) : (
                                    <div className="space-y-3">
                                        {branches.map((branchItem) => (
                                            <div 
                                                key={branchItem.id} 
                                                onClick={() => setBranch(branchItem.id)}
                                                className={`cursor-pointer p-3 md:p-4 rounded-xl transition-all duration-200 ${
                                                    branch === branchItem.id 
                                                        ? 'bg-slate-900 text-white shadow-lg' 
                                                        : 'bg-slate-50 hover:bg-slate-100 text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                                                        branch === branchItem.id 
                                                            ? 'border-amber-400 bg-amber-400' 
                                                            : 'border-gray-400'
                                                    }`}>
                                                        {branch === branchItem.id && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm md:text-base">
                                                            {language === "en" ? branchItem.enName : branchItem.arName}
                                                        </h4>
                                                        <p className={`text-xs md:text-sm truncate ${branch === branchItem.id ? 'text-slate-300' : 'text-gray-500'}`}>
                                                            {branchItem.location}
                                                        </p>
                                                        <a 
                                                            href={`https://maps.google.com/?q=${encodeURIComponent(branchItem.location || '')}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()} 
                                                            className={`inline-flex items-center gap-1 text-xs mt-2 px-2 py-1 rounded-md transition ${
                                                                branch === branchItem.id 
                                                                    ? 'bg-white/10 hover:bg-white/20 text-amber-400' 
                                                                    : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                                                            }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {language === "en" ? "View Map" : "الخريطة"}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Date and Time Selection - Step Style */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${branch ? 'bg-slate-900' : 'bg-slate-300'}`}>
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{lang[languageContent].selectDayTime}</h3>
                            </div>
                            <div className="md:ml-5 md:pl-8 md:border-l-2 border-slate-200">
                            {loadingTimings ? (
                                <div className="text-center py-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto"></div>
                                    <p className="mt-2 text-sm text-gray-600">{lang[languageContent].loadingTimeSlots}</p>
                                </div>
                            ) : timingsError ? (
                                <div className="text-red-500 text-sm py-2">{timingsError}</div>
                            ) : branchTimings.length === 0 && branch ? (
                                <div className="text-gray-500 text-sm py-2">{lang[languageContent].noTimeSlotsAvailable}</div>
                            ) : branch ? (
                                <div className="space-y-4">
                                    {/* Days selection - Calendar style */}
                                    <div className="bg-slate-50 rounded-xl p-3 md:p-4">
                                        <p className="text-sm text-gray-600 mb-3">{language === "en" ? "Select a date" : "اختر تاريخ"}</p>
                                        <div className="flex overflow-x-auto gap-2 pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
                                            {branchTimings.map((daySchedule, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDay(daySchedule.day);
                                                        setSelectedTimeSlot(null);
                                                    }}
                                                    className={`flex-shrink-0 w-16 md:w-auto p-2 md:p-3 rounded-xl text-center transition-all ${
                                                        selectedDay === daySchedule.day
                                                            ? 'bg-slate-900 text-white shadow-lg'
                                                            : 'bg-white text-gray-700 hover:bg-slate-100 border border-slate-200'
                                                    }`}
                                                >
                                                    <div className="text-[10px] md:text-xs font-medium opacity-70">{daySchedule.day.slice(0, 3)}</div>
                                                    <div className="text-base md:text-lg font-bold mt-0.5 md:mt-1">{daySchedule.date.split(' ')[1] || daySchedule.date}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Time slots - Chip style */}
                                    {selectedDay && (
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-600 mb-3">{lang[languageContent].availableTimeSlots}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {branchTimings
                                                    .find(day => day.day === selectedDay)
                                                    ?.slots.map((slot, index) => (
                                                        <button
                                                            key={index}
                                                            dir={'ltr'}
                                                            type="button"
                                                            onClick={() => setSelectedTimeSlot(slot.label)}
                                                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                                                                selectedTimeSlot === slot.label
                                                                    ? 'bg-amber-500 text-white shadow-md'
                                                                    : 'bg-white text-gray-700 border border-slate-200 hover:border-amber-400 hover:text-amber-600'
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
                                <div className="bg-slate-50 rounded-xl p-6 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-sm">{lang[languageContent].pleaseSelectBranchFirst}</p>
                                </div>
                            )}
                            </div>
                        </div>
                        
                        {/* Contact Details - Step Style */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTimeSlot ? 'bg-slate-900' : 'bg-slate-300'}`}>
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{language === "en" ? "Your Details" : "بياناتك"}</h3>
                            </div>
                            <div className="md:ml-5 md:pl-8 md:border-l-2 border-slate-200">
                                <div className="bg-slate-50 rounded-xl p-4 md:p-5 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].firstName}</label>
                                            <input
                                                type="text"
                                                disabled={autoFill}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder={lang[languageContent].firstName}
                                                className={`block w-full rounded-xl border-0 py-3 px-4 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-slate-900 ${autoFill ? 'bg-slate-100' : 'bg-white'}`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].lastName}</label>
                                            <input
                                                type="text"
                                                disabled={autoFill}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder={lang[languageContent].lastName}
                                                className={`block w-full rounded-xl border-0 py-3 px-4 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-slate-900 ${autoFill ? 'bg-slate-100' : 'bg-white'}`}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div dir="ltr">
                                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${languageContent === 'ar' ? 'text-right' : 'text-left'}`}>{lang[languageContent].mobile}</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 text-slate-700 bg-slate-200 rounded-l-xl border-0 font-medium">
                                                +966
                                            </span>
                                            <input
                                                type="tel"
                                                disabled={autoFill}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder={lang[languageContent].mobile}
                                                className={`block w-full rounded-r-xl border-0 py-3 px-4 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-slate-900 ${autoFill ? 'bg-slate-100' : 'bg-white'}`}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{lang[languageContent].email}</label>
                                        <input
                                            type="email"
                                            disabled={autoFill}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={lang[languageContent].email}
                                            className={`block w-full rounded-xl border-0 py-3 px-4 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-slate-900 ${autoFill ? 'bg-slate-100' : 'bg-white'}`}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 shadow-lg text-lg"
                        >
                            {lang[languageContent].bookAppointment}
                        </button>
                    </form>
                </div>
            
            {/* Expected Price Popup */}
            {showPricePopup && (
                <div className="fixed inset-0 bg-[#9797977d] bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <button 
                            onClick={() => setShowPricePopup(false)}
                            className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-4 text-gray-500 hover:text-gray-700`}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f78f37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">{lang[languageContent].expectedCarPrice}</h3>
                            <p className="text-gray-600 mt-1">
                                {lang[languageContent].enterExpectedPricePrompt}
                            </p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">{lang[languageContent].expectedPriceSAR}</label>
                            <input
                                type="number"
                                value={expectedPrice || ''}
                                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                                placeholder={lang[languageContent].enterExpectedPrice}
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
                            {lang[languageContent].continue}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Seller OTP Verification Modal */}
            {showSellerOtpPopup && (
                <div className="fixed inset-0 bg-[#9797977d] bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <button 
                            onClick={() => {
                                setShowSellerOtpPopup(false);
                                setPendingBookingData(null);
                            }}
                            className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-4 text-gray-500 hover:text-gray-700`}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f78f37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">
                                {language === 'en' ? 'Verify Your Email' : 'تحقق من بريدك الإلكتروني'}
                            </h3>
                            <p className="text-gray-600 mt-1">
                                {language === 'en' 
                                    ? `We sent a 6-digit code to ${email}` 
                                    : `لقد أرسلنا رمزًا مكونًا من 6 أرقام إلى ${email}`}
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 text-center">
                                {language === 'en' ? 'Enter the 6-digit code' : 'أدخل الرمز المكون من 6 أرقام'}
                            </label>
                            <InputOTP
                                maxLength={6}
                                value={sellerOtp}
                                onChange={(value: string) => setSellerOtp(value)}
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
                            {sellerOtpError && (
                                <p className="text-red-500 text-sm mt-2 text-center">{sellerOtpError}</p>
                            )}
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={verifySellerOtp}
                                disabled={sellerOtpVerifying || sellerOtp.length !== 6}
                                className={`w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:bg-[#e67d26] text-white font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#f78f37] focus:ring-opacity-50 shadow-md flex items-center justify-center ${
                                    (sellerOtpVerifying || sellerOtp.length !== 6) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {sellerOtpVerifying ? (
                                    <div className="w-5 h-5 border-2 border-white border-dashed rounded-full animate-spin"></div>
                                ) : (
                                    language === 'en' ? 'Verify & Book Appointment' : 'تحقق واحجز موعد'
                                )}
                            </button>
                            
                            <button
                                onClick={sendSellerOtp}
                                disabled={resendTimer > 0 || sellerOtpSending}
                                className={`text-[#f78f37] hover:text-[#e67d26] text-sm font-medium ${
                                    (resendTimer > 0 || sellerOtpSending) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {sellerOtpSending ? (
                                    language === 'en' ? 'Sending...' : 'جاري الإرسال...'
                                ) : resendTimer > 0 ? (
                                    language === 'en' 
                                        ? `Resend Code in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}` 
                                        : `إعادة إرسال الرمز في ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`
                                ) : (
                                    language === 'en' ? 'Resend Code' : 'إعادة إرسال الرمز'
                                )}
                            </button>
                        </div>
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
    )};


export default Step3;
