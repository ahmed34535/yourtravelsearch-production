import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface LocalizationDetection {
  country: string;
  language: string;
  currency: string;
  timezone: string;
}

interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export function useLocalization() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);

  // Supported languages with focus on European countries Duffel supports
  const languages: LanguageInfo[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'en-ca', name: 'English (Canada)', nativeName: 'English (Canada)', flag: '🇨🇦' },
    { code: 'fr-ca', name: 'French (Canada)', nativeName: 'Français (Canada)', flag: '🇨🇦' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
    { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  ];

  // Country to language mapping for auto-detection
  const countryLanguageMap: { [country: string]: string } = {
    // Major markets
    'US': 'en',
    'CA': 'en-ca', // Canada - English primary, French available
    'GB': 'en',
    'AU': 'en', // Australia - limited Duffel coverage
    'NZ': 'en', // New Zealand - limited Duffel coverage
    
    // European countries (Duffel supported)
    'DE': 'de', // Germany
    'AT': 'de', // Austria (German)
    'CH': 'de', // Switzerland (German as default)
    'FR': 'fr', // France
    'BE': 'fr', // Belgium (French as default)
    'LU': 'fr', // Luxembourg (French as default)
    'ES': 'es', // Spain
    'IT': 'it', // Italy
    'NL': 'nl', // Netherlands
    'PT': 'pt', // Portugal
    'PL': 'pl', // Poland
    'CZ': 'cs', // Czech Republic
    'HU': 'hu', // Hungary
    'RO': 'ro', // Romania
    'BG': 'bg', // Bulgaria
    'HR': 'hr', // Croatia
    'SK': 'sk', // Slovakia
    'SI': 'sl', // Slovenia
    'EE': 'et', // Estonia
    'LV': 'lv', // Latvia
    'LT': 'lt', // Lithuania
    'FI': 'fi', // Finland
    'SE': 'sv', // Sweden
    'NO': 'no', // Norway
    'DK': 'da', // Denmark
    'IS': 'is', // Iceland
    'GR': 'el', // Greece
    'CY': 'el', // Cyprus (Greek)
    'MT': 'en', // Malta (English)
    'IE': 'en', // Ireland
    'TR': 'tr', // Turkey
    
    // Balkans
    'RS': 'en', // Serbia (fallback to English)
    'BA': 'en', // Bosnia and Herzegovina
    'ME': 'en', // Montenegro
    'MK': 'en', // North Macedonia
    'AL': 'en', // Albania
    'XK': 'en', // Kosovo
  };

  // Auto-detect user's location and preferred language
  const { data: detectedLocalization } = useQuery<LocalizationDetection>({
    queryKey: ['/api/detect-localization'],
    retry: false,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Auto-set language when detected
  useEffect(() => {
    if (detectedLocalization?.country && !isAutoDetected) {
      const storedLanguage = localStorage.getItem('preferredLanguage');
      
      // Only auto-set if user hasn't manually selected a language
      if (!storedLanguage) {
        const detectedLanguage = countryLanguageMap[detectedLocalization.country] || 'en';
        setSelectedLanguage(detectedLanguage);
        setIsAutoDetected(true);
      } else {
        setSelectedLanguage(storedLanguage);
      }
    }
  }, [detectedLocalization, isAutoDetected]);

  // Save language preference when changed
  const setLanguage = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    setIsAutoDetected(false);
  };

  // Get language info
  const getLanguageInfo = (code?: string): LanguageInfo => {
    const languageCode = code || selectedLanguage;
    return languages.find(l => l.code === languageCode) || languages[0];
  };

  // Simple translation function (placeholder for actual translation system)
  const translate = (key: string, fallback?: string): string => {
    // In production, this would integrate with a translation service
    // like i18next, react-intl, or a custom translation API
    return fallback || key;
  };

  // Get current country detection
  const detectedCountry = detectedLocalization?.country;
  const detectedLanguage = detectedCountry ? countryLanguageMap[detectedCountry] : undefined;

  return {
    selectedLanguage,
    languages,
    detectedLanguage,
    detectedCountry,
    isAutoDetected,
    setLanguage,
    getLanguageInfo,
    translate,
  };
}