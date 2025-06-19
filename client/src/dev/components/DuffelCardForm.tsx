/**
 * Duffel Card Form Component
 * 
 * PCI-compliant card capture component using Duffel's card component system.
 * This simulates the @duffel/components DuffelCardForm for development testing.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface TestBooking {
  id: string;
  type: 'flight' | 'hotel' | 'package';
  amount: number;
  currency: string;
  description: string;
}

interface DuffelCardFormProps {
  booking: TestBooking;
  onCardCaptured: (cardId: string) => void;
  onError: (error: any) => void;
}

interface CardFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  cardholderName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
}

const TEST_CARDS = {
  visa_challenge: '4242424242424242',
  visa_no_challenge: '4111110116638870',
  mastercard_challenge: '5555555555554444',
  mastercard_no_challenge: '5555550130659057',
  amex_challenge: '378282246310005'
};

export function DuffelCardForm({ booking, onCardCaptured, onError }: DuffelCardFormProps) {
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardholderName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: 'GB'
  });

  const [isValid, setIsValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTestCard, setSelectedTestCard] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (month: string, year: string): boolean => {
    if (!month || !year) return false;
    const now = new Date();
    const expiry = new Date(parseInt(`20${year}`), parseInt(month) - 1);
    return expiry > now;
  };

  const validateCVC = (cvc: string, cardNumber: string): boolean => {
    const isAmex = cardNumber.startsWith('34') || cardNumber.startsWith('37');
    return isAmex ? cvc.length === 4 : cvc.length === 3;
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'amex';
    return 'unknown';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!validateCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }

    if (!validateExpiry(formData.expiryMonth, formData.expiryYear)) {
      errors.expiry = 'Invalid expiry date';
    }

    if (!validateCVC(formData.cvc, formData.cardNumber)) {
      errors.cvc = 'Invalid CVC';
    }

    if (!formData.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.postcode.trim()) {
      errors.postcode = 'Postcode is required';
    }

    setValidationErrors(errors);
    const isFormValid = Object.keys(errors).length === 0;
    setIsValid(isFormValid);
    return isFormValid;
  };

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    let processedValue = value;

    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (field === 'cvc') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'expiryMonth' || field === 'expiryYear') {
      processedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const useTestCard = (cardType: string) => {
    const testCard = TEST_CARDS[cardType as keyof typeof TEST_CARDS];
    setFormData(prev => ({
      ...prev,
      cardNumber: formatCardNumber(testCard),
      expiryMonth: '12',
      expiryYear: '25',
      cvc: cardType.includes('amex') ? '1234' : '123',
      cardholderName: 'Test Customer',
      addressLine1: '123 Test Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'GB'
    }));
    setSelectedTestCard(cardType);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      onError(new Error('Form validation failed'));
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Duffel card creation API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock card ID
      const cardId = `tcd_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
      
      onCardCaptured(cardId);
    } catch (error) {
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  const cardBrand = detectCardBrand(formData.cardNumber);

  return (
    <div className="space-y-6">
      {/* Test Card Shortcuts */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-800">Test Card Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(TEST_CARDS).map(([key, number]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => useTestCard(key)}
                className={`text-xs ${selectedTestCard === key ? 'bg-blue-100' : ''}`}
              >
                {key.replace('_', ' ').toUpperCase()}
              </Button>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Click to auto-fill test card data. Challenge cards require 3DS authentication.
          </p>
        </CardContent>
      </Card>

      {/* Main Card Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">PCI Compliant</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{booking.description}</p>
                <p className="text-sm text-gray-600 capitalize">{booking.type} booking</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatAmount(booking.amount, booking.currency)}</p>
                <Badge variant="outline">{booking.currency}</Badge>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={validationErrors.cardNumber ? 'border-red-500' : ''}
                />
                {cardBrand !== 'unknown' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Badge variant="outline" className="text-xs">
                      {cardBrand.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>
              {validationErrors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expiryMonth">Month</Label>
                <Select 
                  value={formData.expiryMonth} 
                  onValueChange={(value) => handleInputChange('expiryMonth', value)}
                >
                  <SelectTrigger className={validationErrors.expiry ? 'border-red-500' : ''}>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiryYear">Year</Label>
                <Select 
                  value={formData.expiryYear} 
                  onValueChange={(value) => handleInputChange('expiryYear', value)}
                >
                  <SelectTrigger className={validationErrors.expiry ? 'border-red-500' : ''}>
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString().slice(-2);
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  placeholder={cardBrand === 'amex' ? '1234' : '123'}
                  maxLength={cardBrand === 'amex' ? 4 : 3}
                  className={validationErrors.cvc ? 'border-red-500' : ''}
                />
                {validationErrors.cvc && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.cvc}</p>
                )}
              </div>
            </div>

            {validationErrors.expiry && (
              <p className="text-red-500 text-sm">{validationErrors.expiry}</p>
            )}

            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                placeholder="John Smith"
                className={validationErrors.cardholderName ? 'border-red-500' : ''}
              />
              {validationErrors.cardholderName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.cardholderName}</p>
              )}
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Billing Address</h4>
            
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="123 Main Street"
                className={validationErrors.addressLine1 ? 'border-red-500' : ''}
              />
              {validationErrors.addressLine1 && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.addressLine1}</p>
              )}
            </div>

            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="London"
                  className={validationErrors.city ? 'border-red-500' : ''}
                />
                {validationErrors.city && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                )}
              </div>

              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange('postcode', e.target.value)}
                  placeholder="SW1A 1AA"
                  className={validationErrors.postcode ? 'border-red-500' : ''}
                />
                {validationErrors.postcode && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.postcode}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Form Status */}
          {isValid && !isProcessing && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Card details are valid and ready for processing
              </AlertDescription>
            </Alert>
          )}

          {!isValid && Object.keys(validationErrors).length > 0 && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Please correct the errors above to continue
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? 'Processing...' : 'Capture Card Details'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}