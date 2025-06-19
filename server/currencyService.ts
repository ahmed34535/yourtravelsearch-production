/**
 * Currency Service - Live exchange rates and geo-based currency detection
 */

interface ExchangeRates {
  [currency: string]: number;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export class CurrencyService {
  private static instance: CurrencyService;
  private rates: ExchangeRates = {};
  private lastUpdate: Date | null = null;
  private updateInterval: number = 3600000; // 1 hour

  // Country to currency mapping - focused on Duffel-supported European countries
  private countryCurrencyMap: { [country: string]: string } = {
    // Major markets (Duffel supported)
    'US': 'USD',
    'CA': 'CAD',  // Canada - major Duffel market
    'GB': 'GBP',
    'JP': 'JPY',
    'AU': 'AUD',  // Australia - limited Duffel coverage
    'NZ': 'NZD',  // New Zealand - limited Duffel coverage
    'CN': 'CNY',
    'IN': 'INR',
    'BR': 'BRL',
    
    // Eurozone countries (all Duffel supported)
    'DE': 'EUR', // Germany
    'FR': 'EUR', // France
    'IT': 'EUR', // Italy
    'ES': 'EUR', // Spain
    'NL': 'EUR', // Netherlands
    'BE': 'EUR', // Belgium
    'AT': 'EUR', // Austria
    'PT': 'EUR', // Portugal
    'IE': 'EUR', // Ireland
    'FI': 'EUR', // Finland
    'GR': 'EUR', // Greece
    'LU': 'EUR', // Luxembourg
    'MT': 'EUR', // Malta
    'CY': 'EUR', // Cyprus
    'SK': 'EUR', // Slovakia
    'SI': 'EUR', // Slovenia
    'EE': 'EUR', // Estonia
    'LV': 'EUR', // Latvia
    'LT': 'EUR', // Lithuania
    'HR': 'EUR', // Croatia
    
    // European non-Eurozone (Duffel supported)
    'CH': 'CHF', // Switzerland
    'NO': 'USD', // Norway
    'SE': 'USD', // Sweden
    'DK': 'USD', // Denmark
    'PL': 'USD', // Poland
    'CZ': 'USD', // Czech Republic
    'HU': 'USD', // Hungary
    'RO': 'USD', // Romania
    'BG': 'USD', // Bulgaria
    'IS': 'USD', // Iceland
    
    // Additional European countries
    'TR': 'USD', // Turkey
    'RS': 'USD', // Serbia
    'BA': 'USD', // Bosnia and Herzegovina
    'ME': 'EUR', // Montenegro
    'MK': 'USD', // North Macedonia
    'AL': 'USD', // Albania
    'XK': 'EUR', // Kosovo
  };

  private supportedCurrencies: CurrencyInfo[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5 },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 20.0 },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35 },
  ];

  private constructor() {
    this.updateRates();
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  /**
   * Get currency based on user's country/IP
   */
  public getCurrencyByCountry(countryCode: string): string {
    return this.countryCurrencyMap[countryCode?.toUpperCase()] || 'USD';
  }

  /**
   * Detect currency from request headers/IP
   */
  public async detectCurrencyFromRequest(req: any): Promise<string> {
    // Try to get country from various headers
    const country = 
      req.headers['cloudflare-ipcountry'] ||
      req.headers['cf-ipcountry'] ||
      req.headers['x-country-code'] ||
      req.headers['x-forwarded-country'] ||
      'US'; // Default to US

    return this.getCurrencyByCountry(country);
  }

  /**
   * Convert amount from USD to target currency
   */
  public convertFromUSD(amount: number, targetCurrency: string): number {
    if (targetCurrency === 'USD') return amount;
    
    const currency = this.supportedCurrencies.find(c => c.code === targetCurrency);
    if (!currency) return amount;
    
    return amount * currency.rate;
  }

  /**
   * Convert amount between currencies
   */
  public convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = fromCurrency === 'USD' ? amount : amount / this.getRate(fromCurrency);
    return this.convertFromUSD(usdAmount, toCurrency);
  }

  /**
   * Get exchange rate for currency
   */
  public getRate(currency: string): number {
    const currencyInfo = this.supportedCurrencies.find(c => c.code === currency);
    return currencyInfo?.rate || 1.0;
  }

  /**
   * Format price in specific currency
   */
  public formatPrice(amount: number, currency: string): string {
    const currencyInfo = this.supportedCurrencies.find(c => c.code === currency);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(amount);
  }

  /**
   * Get all supported currencies
   */
  public getSupportedCurrencies(): CurrencyInfo[] {
    return this.supportedCurrencies;
  }

  /**
   * Update exchange rates (placeholder for live API integration)
   */
  private async updateRates(): Promise<void> {
    try {
      // In production, integrate with live exchange rate API like:
      // - Fixer.io
      // - ExchangeRates-API
      // - CurrencyAPI
      
      this.lastUpdate = new Date();
      
      // Schedule next update
      setTimeout(() => this.updateRates(), this.updateInterval);
      
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      // Retry in 5 minutes on error
      setTimeout(() => this.updateRates(), 300000);
    }
  }

  /**
   * Get currency info by code
   */
  public getCurrencyInfo(code: string): CurrencyInfo | undefined {
    return this.supportedCurrencies.find(c => c.code === code);
  }

  /**
   * Check if currency is supported
   */
  public isSupported(currency: string): boolean {
    return this.supportedCurrencies.some(c => c.code === currency);
  }
}

export const currencyService = CurrencyService.getInstance();