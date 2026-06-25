'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import axiosInstance from '../services/axiosInstance';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import { numberWithCommas } from '../lib/utils';

const FALLBACK_IMAGE =
  'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=';

interface BuyerQueryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: any;
  image?: string;
}

export default function BuyerQueryModal({ open, onOpenChange, car, image }: BuyerQueryModalProps) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = lang[language].contactUsPage;
  const tl = lang[language];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const carDetails = `${car?.modelYear || ''} ${car?.make || ''} ${car?.model || ''}`.trim();
  const carPrice = `SAR ${numberWithCommas(car?.sellingPrice || car?.bookValue)}`;
  const carImage = image || FALLBACK_IMAGE;


  const whatsappMessage = `Hello, I'm interested in the ${carDetails} (${carPrice}) that I found on your website. Can I schedule a test drive?`;

  useEffect(() => {
    if (open) {
      try {
        const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        setFullName([userDetails.firstName, userDetails.lastName].filter(Boolean).join(' '));
        setEmail(userDetails.email || '');
        setPhone((userDetails.phone || '').replace(/^\+?966/, ''));
      } catch {
        // localStorage may be empty/invalid for guests, prefill is best-effort
      }
      setIsImageError(false);
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid =
      fullName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^\d{9}$/.test(phone);

    if (!isValid) {
      toast({
        title: t.errorTitle,
        description: t.errorFixForm,
        variant: 'destructive',
        className: 'bg-red-100 border-0 shadow-none',
      });
      return;
    }

    setIsLoading(true);
    const currentUrl = window.location.href;
    const fullMessage = `${whatsappMessage} Here's the car link: ${currentUrl}`;

    try {
      await axiosInstance.post('api/1.0/contact', {
        fullName,
        email,
        phoneNumber: '966' + phone,
        subject: 'Buyer Query',
        message: fullMessage,
      });

      toast({
        title: t.successTitle,
        description: t.successMessage,
        variant: 'default',
        className: 'bg-green-50 border-0 shadow-none',
      });

      onOpenChange(false);
//      window.location.href = `whatsapp://send?phone=+966920032590&text=${encodeURIComponent(fullMessage)}`;
    } catch (error) {
      toast({
        title: t.errorTitle,
        description: error instanceof Error ? error.message : t.errorSubmit,
        variant: 'destructive',
        className: 'bg-red-100 border-0 shadow-none',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tl.buyerQueryTitle}</DialogTitle>
          <DialogDescription>{tl.buyerQuerySubtitle}</DialogDescription>
        </DialogHeader>

        {car && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <img
              src={isImageError ? FALLBACK_IMAGE : carImage}
              alt={carDetails}
              onError={() => setIsImageError(true)}
              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm">{carDetails}</p>
              <p className="text-[#f78f37] font-bold text-sm">{carPrice}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="buyer-query-fullName">{t.fullName}</Label>
            <Input
              id="buyer-query-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.yourName}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="buyer-query-email">{t.email}</Label>
            <Input
              id="buyer-query-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="buyer-query-phone">{t.phone}</Label>
            <div className="relative flex">
              <div className="flex items-center justify-center bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 h-10 text-gray-600 text-sm font-medium select-none">
                +966
              </div>
              <Input
                id="buyer-query-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="5XXXXXXXX"
                className="rounded-l-none"
                maxLength={9}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="buyer-query-message">{t.message}</Label>
            <textarea
              id="buyer-query-message"
              value={whatsappMessage}
              readOnly
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-md text-sm resize-none cursor-default focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full h-11 text-base font-semibold bg-[#f78f37] hover:bg-[#e67d26]"
            disabled={isLoading}
          >
            {isLoading ? t.sending : tl.buyerQuerySubmit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
