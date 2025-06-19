import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

interface LocalizationDetection {
  country: string;
  language: string;
  currency: string;
  timezone: string;
}

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);

  // Supported currencies with focus on European countries Duffel supports
  const currencies: CurrencyInfo[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.89 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.35 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.62 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.25 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.15 },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.02 },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.85 },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.95 },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 6.85 },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', rate: 4.25 },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rate: 23.50 },
  ];

  // Auto-detect user's location and preferred currency
  const { data: detectedLocalization } = useQuery<LocalizationDetection>({
    queryKey: ['/api/detect-localization'],
    retry: false,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Auto-set currency when detected
  useEffect(() => {
    if (detectedLocalization?.currency && !isAutoDetected) {
      const storedCurrency = localStorage.getItem('preferredCurrency');
      
      // Only auto-set if user hasn't manually selected a currency
      if (!storedCurrency) {
        setSelectedCurrency(detectedLocalization.currency);
        setIsAutoDetected(true);
      } else {
        setSelectedCurrency(storedCurrency);
      }
    }
  }, [detectedLocalization, isAutoDetected]);

  // Save currency preference when changed
  const setCurrency = (currency: string) => {
    setSelectedCurrency(currency);
    localStorage.setItem('preferredCurrency', currency);
    setIsAutoDetected(false);
  };

  // Get currency symbol
  const getCurrencySymbol = (code?: string): string => {
    const currencyCode = code || selectedCurrency;
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || '$';
  };

  // Get currency info
  const getCurrencyInfo = (code?: string): CurrencyInfo => {
    const currencyCode = code || selectedCurrency;
    return currencies.find(c => c.code === currencyCode) || currencies[0];
  };

  // Convert price between currencies
  const convertPrice = (amount: number, fromCurrency: string = 'USD', toCurrency?: string): number => {
    const targetCurrency = toCurrency || selectedCurrency;
    
    if (fromCurrency === targetCurrency) return amount;
    
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === targetCurrency)?.rate || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  // Format price with currency symbol
  const formatPrice = (amount: number, currency?: string): string => {
    const currencyCode = currency || selectedCurrency;
    const symbol = getCurrencySymbol(currencyCode);
    
    // Format with appropriate decimal places
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    // Handle different symbol positions
    if (currencyCode === 'EUR') {
      return `${formatted} ${symbol}`;
    } else {
      return `${symbol}${formatted}`;
    }
  };

  return {
    selectedCurrency,
    currencies,
    detectedCurrency: detectedLocalization?.currency,
    isAutoDetected,
    setCurrency,
    getCurrencySymbol,
    getCurrencyInfo,
    convertPrice,
    formatPrice,
  };
}