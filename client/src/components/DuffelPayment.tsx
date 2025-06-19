import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface DuffelPaymentProps {
  amount: string;
  currency: string;
  offerId: string;
  passengers: any[];
  onPaymentSuccess: (booking: any) => void;
  onPaymentError: (error: string) => void;
}

export default function DuffelPayment({ 
  amount, 
  currency, 
  offerId, 
  passengers, 
  onPaymentSuccess, 
  onPaymentError 
}: DuffelPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      city: '',
      postalCode: '',
      countryCode: 'US',
      region: ''
    }
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billing.')) {
      const billingField = field.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [billingField]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setPaymentData(prev => ({
        ...prev,
        cardNumber: formatted
      }));
    }
  };

  const validatePaymentData = () => {
    const cardNumberClean = paymentData.cardNumber.replace(/\s/g, '');
    
    if (!cardNumberClean || cardNumberClean.length < 13) {
      throw new Error('Please enter a valid card number');
    }
    if (!paymentData.expiryMonth || !paymentData.expiryYear) {
      throw new Error('Please enter the card expiry date');
    }
    if (!paymentData.cvc || paymentData.cvc.length < 3) {
      throw new Error('Please enter a valid CVC');
    }
    if (!paymentData.cardholderName.trim()) {
      throw new Error('Please enter the cardholder name');
    }
    if (!paymentData.billingAddress.line1.trim()) {
      throw new Error('Please enter billing address');
    }
    if (!paymentData.billingAddress.city.trim()) {
      throw new Error('Please enter billing city');
    }
    if (!paymentData.billingAddress.postalCode.trim()) {
      throw new Error('Please enter postal code');
    }
  };

  const processPayment = async () => {
    try {
      setIsProcessing(true);
      validatePaymentData();

      // Step 1: Create payment intent
      const paymentIntent = await apiRequest('POST', '/api/payment/create-intent', {
        amount,
        currency
      });

      // Step 2: Create payment method
      const cardData = {
        card_number: paymentData.cardNumber.replace(/\s/g, ''),
        cvc: paymentData.cvc,
        exp_month: parseInt(paymentData.expiryMonth),
        exp_year: parseInt(paymentData.expiryYear),
        cardholder_name: paymentData.cardholderName
      };

      const billingDetails = {
        name: paymentData.cardholderName,
        email: passengers[0]?.email || 'customer@example.com',
        address: {
          line_1: paymentData.billingAddress.line1,
          city: paymentData.billingAddress.city,
          postal_code: paymentData.billingAddress.postalCode,
          country_code: paymentData.billingAddress.countryCode,
          region: paymentData.billingAddress.region
        }
      };

      const paymentMethod = await apiRequest('POST', '/api/payment/create-method', {
        cardData,
        billingDetails
      });

      // Step 3: Confirm payment intent
      const confirmedPayment = await apiRequest('POST', '/api/payment/confirm-intent', {
        paymentIntentId: paymentIntent.data.id,
        paymentMethodId: paymentMethod.data.id
      });

      // Step 4: Complete booking with confirmed payment
      const booking = await apiRequest('POST', '/api/booking/complete-payment', {
        offerId,
        passengers,
        paymentIntentId: confirmedPayment.data.id,
        amount,
        currency
      });

      toast({
        title: "Payment Successful",
        description: `Booking confirmed! Reference: ${booking.booking.booking_reference}`,
      });

      onPaymentSuccess(booking);
    } catch (error: any) {
      console.error('Payment processing error:', error);
      const errorMessage = error.message || 'Payment processing failed. Please try again.';
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Secure Payment
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Protected by Duffel Payment Processing</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">
              {currency} {parseFloat(amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Month</Label>
              <Select onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expiryYear">Year</Label>
              <Select onValueChange={(value) => handleInputChange('expiryYear', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={paymentData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={paymentData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            />
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h3 className="font-medium">Billing Address</h3>
          
          <div>
            <Label htmlFor="billingLine1">Address Line 1</Label>
            <Input
              id="billingLine1"
              placeholder="123 Main Street"
              value={paymentData.billingAddress.line1}
              onChange={(e) => handleInputChange('billing.line1', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                placeholder="New York"
                value={paymentData.billingAddress.city}
                onChange={(e) => handleInputChange('billing.city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="billingPostal">Postal Code</Label>
              <Input
                id="billingPostal"
                placeholder="10001"
                value={paymentData.billingAddress.postalCode}
                onChange={(e) => handleInputChange('billing.postalCode', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billingCountry">Country</Label>
              <Select onValueChange={(value) => handleInputChange('billing.countryCode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="billingRegion">State/Region</Label>
              <Input
                id="billingRegion"
                placeholder="NY"
                value={paymentData.billingAddress.region}
                onChange={(e) => handleInputChange('billing.region', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={processPayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Pay {currency} {parseFloat(amount).toFixed(2)}
            </div>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Your payment is secured with 256-bit SSL encryption
          </div>
        </div>
      </CardContent>
    </Card>
  );
}