/**
 * Payment Utility Functions
 * 
 * Helper functions for payment processing, validation, and formatting
 * following enterprise security standards.
 */

import { PaymentMethod, BillingAddress, PaymentError } from '../types';

/**
 * Validate credit card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Detect card brand from card number
 */
export function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  if (/^(?:2131|1800|35)/.test(cleaned)) return 'jcb';
  if (/^3[0689]/.test(cleaned)) return 'diners';
  
  return 'unknown';
}

/**
 * Format card number with appropriate spacing
 */
export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const brand = detectCardBrand(cleaned);
  
  if (brand === 'amex') {
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }
  
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Mask card number for display
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 4) {
    return cleaned;
  }
  
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  
  return formatCardNumber(masked + lastFour);
}

/**
 * Validate expiry date
 */
export function validateExpiryDate(expiry: string): boolean {
  const cleaned = expiry.replace(/\D/g, '');
  
  if (cleaned.length !== 4) {
    return false;
  }
  
  const month = parseInt(cleaned.substring(0, 2));
  const year = parseInt('20' + cleaned.substring(2, 4));
  
  if (month < 1 || month > 12) {
    return false;
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiryDate(expiry: string): string {
  const cleaned = expiry.replace(/\D/g, '');
  
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + (cleaned.length > 2 ? '/' + cleaned.substring(2, 4) : '');
  }
  
  return cleaned;
}

/**
 * Validate CVC/CVV code
 */
export function validateCVC(cvc: string, cardBrand?: string): boolean {
  const cleaned = cvc.replace(/\D/g, '');
  
  if (cardBrand === 'amex') {
    return cleaned.length === 4;
  }
  
  return cleaned.length === 3;
}

/**
 * Validate billing address
 */
export function validateBillingAddress(address: BillingAddress): PaymentError | null {
  if (!address.line1?.trim()) {
    return {
      code: 'invalid_address',
      message: 'Address line 1 is required',
      type: 'validation_error',
      param: 'billing_address.line1'
    };
  }
  
  if (!address.city?.trim()) {
    return {
      code: 'invalid_address',
      message: 'City is required',
      type: 'validation_error',
      param: 'billing_address.city'
    };
  }
  
  if (!address.postal_code?.trim()) {
    return {
      code: 'invalid_address',
      message: 'Postal code is required',
      type: 'validation_error',
      param: 'billing_address.postal_code'
    };
  }
  
  if (!address.country?.trim() || address.country.length !== 2) {
    return {
      code: 'invalid_address',
      message: 'Valid country code is required',
      type: 'validation_error',
      param: 'billing_address.country'
    };
  }
  
  return null;
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount / 100); // Convert from cents
  } catch (error) {
    return `${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`;
  }
}

/**
 * Convert amount to smallest currency unit (cents)
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert amount from smallest currency unit
 */
export function fromCents(amount: number): number {
  return amount / 100;
}

/**
 * Generate secure payment reference
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `PAY_${timestamp}_${random}`.toUpperCase();
}

/**
 * Validate payment amount
 */
export function validateAmount(amount: number, currency: string): PaymentError | null {
  if (!amount || amount <= 0) {
    return {
      code: 'invalid_amount',
      message: 'Amount must be greater than zero',
      type: 'validation_error',
      param: 'amount'
    };
  }
  
  // Minimum amounts by currency (in cents)
  const minimumAmounts: Record<string, number> = {
    'USD': 50,  // $0.50
    'EUR': 50,  // €0.50
    'GBP': 30,  // £0.30
    'CAD': 50,  // C$0.50
    'AUD': 50,  // A$0.50
  };
  
  const minimum = minimumAmounts[currency.toUpperCase()] || 50;
  
  if (amount < minimum) {
    return {
      code: 'amount_too_small',
      message: `Minimum amount is ${formatCurrency(minimum, currency)}`,
      type: 'validation_error',
      param: 'amount'
    };
  }
  
  // Maximum amount check (10,000 USD equivalent)
  const maximumAmount = 1000000; // $10,000 in cents
  
  if (amount > maximumAmount) {
    return {
      code: 'amount_too_large',
      message: `Maximum amount is ${formatCurrency(maximumAmount, currency)}`,
      type: 'validation_error',
      param: 'amount'
    };
  }
  
  return null;
}

/**
 * Sanitize payment method for logging
 */
export function sanitizePaymentMethod(paymentMethod: PaymentMethod): Record<string, any> {
  return {
    id: paymentMethod.id,
    type: paymentMethod.type,
    brand: paymentMethod.brand,
    last4: paymentMethod.last4,
    isDefault: paymentMethod.isDefault
    // Explicitly exclude sensitive data
  };
}

/**
 * Check if payment method supports 3D Secure
 */
export function supports3DSecure(paymentMethod: PaymentMethod): boolean {
  return paymentMethod.type === 'card' && 
         ['visa', 'mastercard', 'amex'].includes(paymentMethod.brand || '');
}

/**
 * Generate return URL for payment flows
 */
export function generateReturnUrl(baseUrl: string, paymentIntentId: string): string {
  const url = new URL('/payment/complete', baseUrl);
  url.searchParams.set('payment_intent', paymentIntentId);
  return url.toString();
}

/**
 * Validate currency code
 */
export function validateCurrency(currency: string): boolean {
  const supportedCurrencies = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
  ];
  
  return supportedCurrencies.includes(currency.toUpperCase());
}

/**
 * Calculate processing fee (example implementation)
 */
export function calculateProcessingFee(amount: number, currency: string): number {
  // Example: 2.9% + 30 cents
  const percentageFee = Math.round(amount * 0.029);
  const fixedFee = currency.toUpperCase() === 'USD' ? 30 : 35; // Varies by currency
  
  return percentageFee + fixedFee;
}

/**
 * Check if payment requires Strong Customer Authentication (SCA)
 */
export function requiresSCA(amount: number, currency: string, region: string): boolean {
  // EU regulation requires SCA for payments over €30
  if (region === 'EU' && currency.toUpperCase() === 'EUR' && amount > 3000) {
    return true;
  }
  
  // UK regulation similar to EU
  if (region === 'UK' && currency.toUpperCase() === 'GBP' && amount > 3000) {
    return true;
  }
  
  return false;
}