'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Car, Lock } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axiosInstance from '../../services/axiosInstance';

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    otp: '',
    rememberMe: false,
    userType: 'user', // 'user' or 'dealer'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOtpField, setShowOtpField] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!showOtpField) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.otp) {
        newErrors.otp = 'OTP is required';
      } else if (formData.otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFormPhone = () => {
    const newErrors: Record<string, string> = {};
    
    if (!showOtpField) {
      // Validate phone number format (Saudi Arabia)
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^5\d{8}$/.test(formData.phone)) {
        // Saudi mobile numbers start with 5 and are 9 digits total
        newErrors.phone = 'Please enter a valid Saudi mobile number (e.g., 5XXXXXXXX)';
      }
    } else {
      // Validate OTP
      if (!formData.otp) {
        newErrors.otp = 'OTP is required';
      } else if (!/^\d{6}$/.test(formData.otp)) {
        newErrors.otp = 'OTP must be 6 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if valid, false if errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isV1 = false;
    
    // If validation fails, stop form submission
    if (isV1 ? !validateForm() : !validateFormPhone()) return;
    
    setIsLoading(true);
    
    if (!showOtpField) {
    
      if(isV1){
      axiosInstance.post('/api/auth/seller/sign-in', {
        email: formData.email,
      }) 
      .then(response => {
        console.log('Login successful:', response.data);
        setTimeout(() => {
          setIsLoading(false);
          setShowOtpField(true);
          toast({
            title: "Success",
            description: "OTP sent to your email",
            variant: "default",
            className: "bg-green-50 border-green-200",
          });
          console.log('Email verification successful, showing OTP field');
        }, 1000);
      })
      .catch(error => {
        console.error('Login failed:', error);
        
        setIsLoading(false);
        setErrors({ email: error.response?.data?.message || 'Login failed' });
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to send OTP",
          variant: "destructive",
        });
      });

       }else{
         axiosInstance.post('/api/1.0/customer/sign-in', {
        phone: `+966${formData.phone}`,
      }) 
      .then(response => {
        console.log('Login successful:', response.data);
        setTimeout(() => {
          setIsLoading(false);
          setShowOtpField(true);
          // Initialize resend timer to 1m20s (80 seconds)
          setResendTimer(80);
          setResendDisabled(true);
          toast({
            title: "Success",
            description: "OTP sent to your phone",
            variant: "default",
            className: "bg-green-50 border-green-200",
          });
          console.log('Phone verification successful, showing OTP field');
        }, 1000);
      })
      .catch(error => {
        console.error('Login failed:', error);
        
        setIsLoading(false);
        setErrors({ email: error.response?.data?.message || 'Login failed' });
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to send OTP",
          variant: "destructive",
        });
      });

       }
      // First step: Email verification
 
    } else {
      // Second step: OTP verification
      setTimeout(() => {
        setIsLoading(false);

        axiosInstance.post('/api/1.0/customer/verify-otp', {
          target: `+966${formData.phone}`,
          otp: formData.otp,
        })
        .then(response => {
          toast({
            title: "Success",
            description: "Login successful",
            variant: "default",
            className: "bg-green-50 border-green-200",
          });

          // Store token in localStorage
          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('authToken', response.data.access_token);
          localStorage.setItem('userDetails', JSON.stringify({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            avatar: response.data.avatar,
            phone: response.data.phone,
          }));
          
          // Redirect after a short delay to allow the toast to be seen
          setTimeout(() => {
            if (formData.userType === 'dealer') {
              window.location.href = 'http://dealer.baddelha.com.sa/';
            } else {
              window.location.href = '/';
            }
          }, 1000);
        })
        .catch(error => {
          console.error('Login failed:', error);
          setErrors({ otp: error.response?.data?.message || 'Invalid OTP' });
          toast({
            title: "Error",
            description: error.response?.data?.message || "Invalid OTP",
            variant: "destructive",
          });
        });
     
      }, 1000);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendTimer, resendDisabled]);

  // Timer formatting is done inline in the JSX

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  // Resend OTP function
  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setResendDisabled(true);
    setIsLoading(true);
    
    try {
      await axiosInstance.post('/api/1.0/customer/sign-in', {
        phone: `+966${formData.phone}`,
      });
      
      // Set timer for 1 minute 20 seconds (80 seconds)
      setResendTimer(80);
      
      toast({
        title: "Success",
        description: "OTP resent successfully",
        variant: "default",
        className: "bg-green-50 border-green-200",
      });
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend OTP",
        variant: "destructive",
      });
      setResendDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-gradient-to-br from-amber-500 to-amber-400 p-3 rounded-full shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your BADDELHA account
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Sign in as
            </Label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => handleInputChange('userType', 'user')}
                className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.userType === 'user'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => {
                  handleInputChange('userType', 'dealer')
                  if(confirm("Are you sure you want to switch to dealer portal?")) {
                    window.location.href = 'https://dealer.baddelha.com.sa'
                    // User confirmed, do nothing
                  } else {
                    // User cancelled, revert to user mode
                    handleInputChange('userType', 'user')
                  }
                }}
                className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  formData.userType === 'dealer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dealer
              </button>
            </div>
          </div>
          
          {!showOtpField ? (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative flex">
                <div className="flex items-center justify-center bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 h-12 text-gray-600 text-sm font-medium select-none">
                  +966
                </div>
                <div className="relative flex-1">
                  <Input
                    id="phone"
                    type="text"
                    placeholder="5XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                      handleInputChange('phone', val);
                    }}
                    className={`h-12 rounded-l-none transition-all duration-200 ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    maxLength={9}
                  />
                </div>  
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                Enter OTP
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                  className={`pl-10 h-12 transition-all duration-200 ${
                    errors.otp 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  maxLength={6}
                />
              </div>
              {errors.otp && (
                <p className="text-sm text-red-600 mt-1">{errors.otp}</p>
              )}
              
              {/* Resend OTP button with timer */}
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Didn't receive the code?
                </p>
                {resendTimer > 0 ? (
                  <p className="text-xs text-amber-600 font-medium">
                    Resend in {Math.floor(resendTimer / 60)}:{resendTimer % 60 < 10 ? '0' : ''}{resendTimer % 60}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendDisabled || isLoading}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 disabled:text-gray-400 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label 
                htmlFor="remember" 
                className="text-sm text-gray-600 cursor-pointer select-none"
              >
                Remember me
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] bg-gradient-to-br from-amber-500 to-amber-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{showOtpField ? 'Verifying OTP...' : 'Sending OTP...'}</span>
              </div>
            ) : (
              showOtpField ? 'Verify OTP' : 'Continue'
            )}
          </Button>
        </form>

      </CardContent>
    </Card>
  );
}