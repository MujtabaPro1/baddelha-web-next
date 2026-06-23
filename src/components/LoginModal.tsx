'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Car, Lock, User, Mail } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axiosInstance from '../services/axiosInstance';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!open) {
      setPhone('');
      setOtp('');
      setError('');
      setShowOtpField(false);
      setResendTimer(0);
      setResendDisabled(false);
      setResendCount(0);
      setIsSignUp(false);
      setFirstName('');
      setLastName('');
      setEmail('');
    }
  }, [open]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendTimer, resendDisabled]);

  const sendOtp = async () => {
    if (!/^5\d{8}$/.test(phone)) {
      setError('Please enter a valid Saudi mobile number (e.g., 5XXXXXXXX)');
      return;
    }

    // Validate sign-up fields
    if (isSignUp) {
      if (!firstName.trim()) {
        setError('Please enter your first name');
        return;
      }
      if (!lastName.trim()) {
        setError('Please enter your last name');
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setError('');
    setIsLoading(true);

    const onOtpSuccess = () => {
      setShowOtpField(true);
      const timerDuration = 120;
      setResendTimer(timerDuration);
      setResendCount((prev) => prev + 1);
      setResendDisabled(true);
      toast({
        title: 'Success',
        description: 'OTP sent to your phone',
        variant: 'default',
        className: 'bg-green-50 border-green-200',
      });
    };

    try {
      if (isSignUp) {
        // Sign-up with full details
        await axiosInstance.post('/api/1.0/customer/sign-up', {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: `+966${phone}`,
        });
        onOtpSuccess();
      } else {
        // Sign-in flow: try sign-up first, if 403 then sign-in
        try {
          await axiosInstance.post('/api/1.0/customer/sign-up', {
            phone: `+966${phone}`,
          });
          onOtpSuccess();
        } catch (err: any) {
          if (err?.response?.status === 403) {
            // User exists, try sign-in
            await axiosInstance.post('/api/1.0/customer/sign-in', { phone: `+966${phone}` });
            onOtpSuccess();
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/api/1.0/customer/verify-otp', {
        target: `+966${phone}`,
        otp,
      });

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
      window.dispatchEvent(new Event('authStateChanged'));

      toast({
        title: 'Success',
        description: 'Login successful',
        variant: 'default',
        className: 'bg-green-50 border-green-200',
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Invalid OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    setResendDisabled(true);
    setIsLoading(true);

    const onResendSuccess = () => {
      const timerDuration = 120;
      setResendTimer(timerDuration);
      setResendCount((prev) => prev + 1);
      toast({
        title: 'Success',
        description: 'OTP resent successfully',
        variant: 'default',
        className: 'bg-green-50 border-green-200',
      });
    };

    try {
      if (isSignUp) {
        // Resend for sign-up
        await axiosInstance.post('/api/1.0/customer/sign-up', {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: `+966${phone}`,
        });
        onResendSuccess();
      } else {
        // Resend: try sign-up first, if 403 then sign-in
        try {
          await axiosInstance.post('/api/1.0/customer/sign-up', {
            phone: `+966${phone}`,
          });
          onResendSuccess();
        } catch (err: any) {
          if (err?.response?.status === 403) {
            await axiosInstance.post('/api/1.0/customer/sign-in', { phone: `+966${phone}` });
            onResendSuccess();
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to resend OTP',
        variant: 'destructive',
      });
      setResendDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showOtpField) {
      verifyOtp();
    } else {
      sendOtp();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="bg-gradient-to-br from-amber-500 to-amber-400 p-3 rounded-full shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center">{isSignUp ? 'Create an account' : 'Sign in to continue'}</DialogTitle>
          <DialogDescription className="text-center">
            {isSignUp ? 'Sign up to access all features' : 'Sign in to view the inspection report'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {!showOtpField ? (
            <div className="space-y-3">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="login-modal-firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="login-modal-firstName"
                          type="text"
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 h-11 focus-visible:ring-amber-400 focus-visible:border-amber-400"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="login-modal-lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="login-modal-lastName"
                          type="text"
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10 h-11 focus-visible:ring-amber-400 focus-visible:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="login-modal-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-modal-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 focus-visible:ring-amber-400 focus-visible:border-amber-400"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-1">
                <Label htmlFor="login-modal-phone">Phone Number</Label>
                <div className="relative flex">
                  <div className="flex items-center justify-center bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 h-11 text-gray-600 text-sm font-medium select-none">
                    +966
                  </div>
                  <Input
                    id="login-modal-phone"
                    type="text"
                    placeholder="5XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className="h-11 rounded-l-none focus-visible:ring-amber-400 focus-visible:border-amber-400"
                    maxLength={9}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="login-modal-otp">Enter OTP</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="login-modal-otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-10 h-11 focus-visible:ring-amber-400 focus-visible:border-amber-400"
                  maxLength={6}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Didn't receive the code?</p>
                {resendTimer > 0 ? (
                  <p className="text-xs text-amber-600 font-medium">
                    Resend in {Math.floor(resendTimer / 60)}:{resendTimer % 60 < 10 ? '0' : ''}{resendTimer % 60}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendDisabled || isLoading}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 disabled:text-gray-400"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full h-11 text-base font-semibold bg-gradient-to-br from-amber-500 to-amber-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{showOtpField ? 'Verifying...' : 'Sending OTP...'}</span>
              </div>
            ) : showOtpField ? (
              'Verify OTP'
            ) : isSignUp ? (
              'Sign Up'
            ) : (
              'Continue'
            )}
          </Button>

          {!showOtpField && (
            <div className="text-center text-sm text-gray-600">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setError(''); }}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setError(''); }}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
