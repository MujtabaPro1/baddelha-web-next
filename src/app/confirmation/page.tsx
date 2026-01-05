'use client';
import { useEffect, useState } from 'react';
import { Check, Calendar, MapPin, Clock, Phone, Mail, User } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '../../services/axiosInstance';
import { useLanguage } from '../../contexts/LanguageContext';
import lang  from '../../locale';

interface BookingDetails {
    branch: string;
    date: string;
    time: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    bookingId?: string;
}

interface CarDetails {
    make: string;
    model: string;
    year: string;
    price: string;
    image: string;
}

interface ApiBookingResponse {
    id: string;
    branch: string;
    appointmentDate: string;
    appointmentTime: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    price?: string;
    status: string;
}

const numberWithCommas = (x: string) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const Confirmation = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
        branch: '',
        date: '',
        time: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        bookingId: ''
    });

    const [carDetails, setCarDetails] = useState<CarDetails>({
        make: '',
        model: '',
        year: '',
        price: '',
        image: ''
    });

    const { language }: any = useLanguage();
    const languageContent: any = language === 'ar' ? 'ar' : 'en';


    useEffect(() => {
        const fetchBookingData = async () => {
            setLoading(true);
            setError('');
            
            try {
                // Get data from localStorage first
                const storedBookingDetails = localStorage.getItem('bookingDetails');
                const storedCarDetails = localStorage.getItem('carDetails');
                
                if (storedBookingDetails) {
                    const parsedBookingDetails = JSON.parse(storedBookingDetails);
                    setBookingDetails(parsedBookingDetails);
                    
                    // If we have a booking ID, try to fetch the latest details from API
                    if (parsedBookingDetails.bookingId) {
                        try {
                            const response = await axiosInstance.get(`/api/1.0/book-appointment/${parsedBookingDetails.bookingId}`);
                            const apiData: ApiBookingResponse = response.data;
                            
                            // Update with the latest data from API
                            setBookingDetails(prev => ({
                                ...prev,
                                branch: apiData.branch || prev.branch,
                                date: apiData.appointmentDate || prev.date,
                                time: apiData.appointmentTime || prev.time,
                                firstName: apiData.firstName || prev.firstName,
                                lastName: apiData.lastName || prev.lastName,
                                phone: apiData.phone || prev.phone,
                                email: apiData.email || prev.email
                            }));
                            
                            // Update car price if available from API
                            if (apiData.price && storedCarDetails) {
                                const parsedCarDetails = JSON.parse(storedCarDetails);
                                setCarDetails({
                                    ...parsedCarDetails,
                                    price: apiData.price
                                });
                            }
                        } catch (apiError) {
                            console.warn('Could not fetch latest booking details from API:', apiError);
                            // Continue with localStorage data
                        }
                    }
                } else {
                    setError('Booking details not found. Please try booking again.');
                }
                
                if (storedCarDetails && !error) {
                    setCarDetails(JSON.parse(storedCarDetails));
                }
            } catch (err) {
                console.error('Error loading confirmation data:', err);
                setError('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };
        
        fetchBookingData();
    }, []);

    // Format date for display
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

  
    return (
        <div className="max-w-4xl mt-[120px] mx-auto px-4 py-8">
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{lang[languageContent].loadingBookingDetails}</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <div className="mt-4">
                        <Link href="/" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl transition">
                            Return to Home
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{lang[languageContent].bookingConfirmed}</h1>
                        <p className="text-gray-600">{lang[languageContent].bookingConfirmedDesc}</p>
                        {bookingDetails.bookingId && (
                            <p className="text-sm text-gray-500 mt-2 font-mono bg-gray-100 inline-block px-3 py-1 rounded-lg">
                                {lang[languageContent].bookingId}: {bookingDetails.bookingId}
                            </p>
                        )}
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        {/* Car & Price Banner */}
                        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-slate-400 text-sm">{language === "en" ? "Your Vehicle" : "سيارتك"}</p>
                                    <h3 className="text-white text-xl font-bold">
                                        {carDetails.year ? `${carDetails.year} ` : ''}
                                        {carDetails.make ? `${carDetails.make} ` : ''}
                                        {carDetails.model || 'Vehicle'}
                                    </h3>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                                    <p className="text-slate-400 text-xs">{lang[languageContent].yourVehicleMarketPrice}</p>
                                    <p className="text-2xl font-bold text-amber-400">
                                        SAR {carDetails.price && carDetails.price != '0' ? numberWithCommas(carDetails.price) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{lang[languageContent].appointmentDetails}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <span className="text-sm text-gray-500">{lang[languageContent].branch}</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{bookingDetails.branch || 'Not specified'}</p>
                                </div>
                                
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                            <Calendar className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <span className="text-sm text-gray-500">{lang[languageContent].date}</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        {bookingDetails.date ? formatDate(bookingDetails.date) : 'Not specified'}
                                    </p>
                                </div>
                                
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                            <Clock className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <span className="text-sm text-gray-500">{lang[languageContent].time}</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        {bookingDetails.time && !bookingDetails.time.includes('T') 
                                            ? bookingDetails.time 
                                            : bookingDetails.time 
                                                ? new Date(bookingDetails.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                                : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Personal Information */}
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{lang[languageContent].personalInformation}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                                    <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                        <User className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{lang[languageContent].name}</p>
                                        <p className="font-semibold text-gray-900">
                                            {bookingDetails.firstName || ''} {bookingDetails.lastName || ''}
                                            {!bookingDetails.firstName && !bookingDetails.lastName && 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                                    <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                        <Phone className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{lang[languageContent].phoneNumber}</p>
                                        <p className="font-semibold text-gray-900">{bookingDetails.phone || 'Not specified'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 sm:col-span-2">
                                    <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{lang[languageContent].email}</p>
                                        <p className="font-semibold text-gray-900">{bookingDetails.email || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email Confirmation Note */}
                    <p className="text-sm text-gray-500 text-center mb-6">{lang[languageContent].confirmationEmailSent}</p>

                    {/* What to Expect Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">{lang[languageContent].whatToExpect}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <h4 className="font-bold mb-2">{lang[languageContent].arrival}</h4>
                                <p className="text-sm text-gray-600">{lang[languageContent].pleaseArrive10MinutesBeforeYourScheduledAppointmentBringYourVehicleRegistrationAndID}</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <h4 className="font-bold mb-2">{lang[languageContent].inspection}</h4>
                                <p className="text-sm text-gray-600">{lang[languageContent].ourExpertsWillConductAComprehensiveInspectionOfYourVehicleWhichTakesApproximately3045Minutes}</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <h4 className="font-bold mb-2">{lang[languageContent].results}</h4>
                                <p className="text-sm text-gray-600">{lang[languageContent].youllReceiveADetailedReportAndOurFinalOfferForYourVehicleWithNoObligationToSell}</p>
                            </div>
                        </div>
                    </div>

                    {/* Return Button */}
                    <div className="text-center">
                        <Link href="/" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition shadow-lg">
                            {lang[languageContent].returnToHome}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );    
};

export default Confirmation;
