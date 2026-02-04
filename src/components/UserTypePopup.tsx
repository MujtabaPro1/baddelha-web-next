'use client';

import { useState } from 'react';
import { useUserType } from '../contexts/UserTypeContext';
import { X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axiosInstance from '../services/axiosInstance';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  location?: string;
  message?: string;
}

export default function UserTypePopup() {
  const { setUserType, setShowUserTypePopup, setHasSeenPopup } = useUserType();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'seller' | 'buyer' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    message: ''
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSelectType = (type: 'seller' | 'buyer') => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) return;
    
    setIsLoading(true);

    if (!executeRecaptcha) {
      console.log('Recaptcha not ready');
      return;
    }

    const recaptcha =  await executeRecaptcha('buyer_seller_lead');

    
    try {
      await axiosInstance.post('/api/1.0/buyer-seller-leads', {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: `+966${formData.phone}`,
        companyName: formData.company || '',
        location: formData.location || '',
        message: formData.message || '',
        isSeller: selectedType === 'seller',
        isBuyer: selectedType === 'buyer',
        recaptchaToken:recaptcha
      });
      
      // Save user type
      setUserType(selectedType);
      setHasSeenPopup(true);
      
      // Show success toast
      toast({
        title: "Thank you for your interest!",
        description: "We'll get back to you shortly with more information.",
        variant: "success",
      });
      
      // Show success screen
      setShowSuccess(true);
    } catch (error) {
      console.log('error',error);
      setIsLoading(false);
      toast({
        title: "Buyer Seller Lead",
        description: (error as any).response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setHasSeenPopup(true);
    setShowUserTypePopup(false);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedType(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      location: '',
      message: ''
    });
  };

  const handlePrimaryCTA = () => {
    if (selectedType === 'seller') {
      // Start Sell Process - redirect to step1
      window.location.href = '/step1';
    } else if (selectedType === 'buyer') {
      // Discover new Opportunity Cars
      window.location.href = '/cars';
    }
  };

  const handleSecondaryCTA = () => {
    if (selectedType === 'seller') {
      // Contact Us - could open modal or navigate
      window.location.href = '/contact';
    } else if (selectedType === 'buyer') {
      // Request New Listings
      window.location.href = '/request-listings';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              {showSuccess ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {showSuccess 
                  ? 'Thank You!' 
                  : showForm 
                    ? 'Complete Your Profile' 
                    : 'Welcome to BADDELHA'
                }
              </h2>
              <p className="text-slate-400 text-sm">
                {showSuccess 
                  ? `Welcome to BADDELHA, ${formData.name}!` 
                  : showForm 
                    ? `Tell us more about yourself as a ${selectedType}` 
                    : 'Tell us about yourself'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showForm && !showSuccess ? (
            // Selection Screen
            <>
              <p className="text-gray-600 mb-6">
                Are you looking to sell your car as an individual or are you a buyer?
              </p>

              {/* User Type Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSelectType('seller')}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedType === 'seller'
                      ? 'border-slate-900 bg-slate-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedType === 'seller'
                        ? 'border-slate-900 bg-slate-900'
                        : 'border-gray-400'
                    }`}>
                      {selectedType === 'seller' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">I'm a Seller</h3>
                      <p className="text-sm text-gray-500">Selling my personal car</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectType('buyer')}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedType === 'buyer'
                      ? 'border-slate-900 bg-slate-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedType === 'buyer'
                        ? 'border-slate-900 bg-slate-900'
                        : 'border-gray-400'
                    }`}>
                      {selectedType === 'buyer' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">I'm a Buyer</h3>
                      <p className="text-sm text-gray-500">Buying cars</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Skip
                </button>
              </div>
            </>
          ) : showSuccess ? (
            // Success Screen with CTAs
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedType === 'seller' 
                    ? 'Ready to sell your car?' 
                    : 'Discover amazing cars!'
                  }
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedType === 'seller' 
                    ? 'Start your selling journey with us today.' 
                    : 'Browse our curated selection of premium vehicles.'
                  }
                </p>
              </div>

              {/* CTAs based on user type */}
              <div className="space-y-3">
                <button
                  onClick={handlePrimaryCTA}
                  className="w-full px-6 py-3 bg-primaryBtn hover:bg-red-600 text-white font-semibold rounded-xl transition-colors shadow-lg"
                >
                  {selectedType === 'seller' ? 'Start Sell Process' : 'Discover New Opportunity Cars'}
                </button>
                
                <button
                  onClick={handleSecondaryCTA}
                  className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                >
                  {selectedType === 'seller' ? 'Contact Us' : 'Request New Listings'}
                </button>
              </div>

              <button
                onClick={() => setShowUserTypePopup(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          ) : (
            // Form Screen
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-700 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
                    +966
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                      setFormData(prev => ({ ...prev, phone: value }));
                    }}
                    required
                    maxLength={9}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="5XXXXXXXX"
                  />
                </div>
              </div>

              {(selectedType === 'buyer' || selectedType === 'seller') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  placeholder="Tell us more about what you're looking for..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          )}

          {!showSuccess && (
            <p className="text-xs text-gray-500 text-center mt-4">
              You can change this later in your settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
