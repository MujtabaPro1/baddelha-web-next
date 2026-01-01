'use client';
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Car, Mail, Lock } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axiosInstance from '../../services/axiosInstance';

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOtpField, setShowOtpField] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    if (!showOtpField) {
    
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

      // First step: Email verification
 
    } else {
      // Second step: OTP verification
      setTimeout(() => {
        setIsLoading(false);

        axiosInstance.post('/api/auth/verify-otp', {
          target: formData.email,
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
            phone: '+966' + response.data.phone,
          }));
          
          // Redirect after a short delay to allow the toast to be seen
          setTimeout(() => {
            window.location.href = '/';
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          {!showOtpField ? (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 h-12 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
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