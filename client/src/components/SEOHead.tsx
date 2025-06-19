import { useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocalization } from '@/hooks/useLocalization';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  page?: 'home' | 'flights' | 'hotels' | 'results' | 'booking';
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  structuredData,
  page = 'home'
}: SEOHeadProps) {
  const { selectedCurrency } = useCurrency();
  const { selectedLanguage } = useLocalization();

  useEffect(() => {
    // Get language-specific content
    const content = getLocalizedContent(selectedLanguage, selectedCurrency, page);
    
    // Update document title
    document.title = title || content.title;
    
    // Update meta tags
    updateMetaTag('description', description || content.description);
    updateMetaTag('keywords', keywords || content.keywords);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    updateMetaTag('language', selectedLanguage);
    updateMetaTag('currency', selectedCurrency);
    
    // Hreflang and canonical URLs
    updateCanonicalAndHreflang(canonicalUrl, selectedLanguage, selectedCurrency);
    
    // Open Graph tags
    updateOpenGraphTags(content, ogImage);
    
    // Twitter Card tags
    updateTwitterCardTags(content);
    
    // Structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    } else {
      updateStructuredData(getDefaultStructuredData(content, selectedCurrency, selectedLanguage));
    }
    
  }, [title, description, keywords, canonicalUrl, ogImage, structuredData, page, selectedCurrency, selectedLanguage]);

  return null;
}

function getLocalizedContent(language: string, currency: string, page: string) {
  const baseUrl = window.location.origin;
  const currencySymbol = getCurrencySymbol(currency);
  
  const contentMap: { [key: string]: any } = {
    en: {
      title: `YourTravelSearch - Cheap Flights, Hotels & Travel Deals in ${currency}`,
      description: `Find and book cheap flights, hotels, and travel packages worldwide. Best prices in ${currency} with 24/7 support. Compare 1,200+ airlines and 500K+ hotels.`,
      keywords: `cheap flights ${currency}, flight booking, hotel booking, travel deals, airline tickets, vacation packages, ${currency} flights`,
      companyName: 'YourTravelSearch',
      tagline: 'Your Journey Begins Here',
      flightSearchTitle: `Flight Search - Find Cheap Flights in ${currency}`,
      hotelSearchTitle: `Hotel Booking - Best Hotel Deals in ${currency}`,
      resultTitle: `Search Results - Flights from {origin} to {destination} in ${currency}`
    },
    'en-ca': {
      title: `YourTravelSearch Canada - Cheap Flights, Hotels & Travel Deals in ${currency}`,
      description: `Find and book cheap flights, hotels, and travel packages across Canada and worldwide. Best prices in ${currency} with bilingual support.`,
      keywords: `cheap flights canada ${currency}, flight booking canada, hotel booking, travel deals canada, airline tickets, vacation packages`,
      companyName: 'YourTravelSearch Canada',
      tagline: 'Your Canadian Travel Journey Begins Here'
    },
    'fr-ca': {
      title: `YourTravelSearch Canada - Vols Pas Chers, Hôtels et Offres de Voyage en ${currency}`,
      description: `Trouvez et réservez des vols pas chers, des hôtels et des forfaits voyage au Canada et dans le monde. Meilleurs prix en ${currency} avec support bilingue.`,
      keywords: `vols pas chers canada ${currency}, réservation vol, réservation hôtel, offres voyage canada, billets avion, forfaits vacances`,
      companyName: 'YourTravelSearch Canada',
      tagline: 'Votre Voyage Canadien Commence Ici'
    },
    de: {
      title: `YourTravelSearch Deutschland - Günstige Flüge, Hotels & Reiseangebote in ${currency}`,
      description: `Finden und buchen Sie günstige Flüge, Hotels und Reisepakete weltweit. Beste Preise in ${currency} mit 24/7 Support. Vergleichen Sie 1.200+ Fluggesellschaften.`,
      keywords: `günstige flüge ${currency}, flugbuchung, hotelbuchung, reiseangebote, flugtickets, urlaubspakete, ${currency} flüge`,
      companyName: 'YourTravelSearch Deutschland',
      tagline: 'Ihre Reise Beginnt Hier'
    },
    fr: {
      title: `YourTravelSearch France - Vols Pas Chers, Hôtels et Offres de Voyage en ${currency}`,
      description: `Trouvez et réservez des vols pas chers, des hôtels et des forfaits voyage dans le monde entier. Meilleurs prix en ${currency} avec support 24/7.`,
      keywords: `vols pas chers ${currency}, réservation vol, réservation hôtel, offres voyage, billets avion, forfaits vacances, vols ${currency}`,
      companyName: 'YourTravelSearch France',
      tagline: 'Votre Voyage Commence Ici'
    },
    es: {
      title: `YourTravelSearch España - Vuelos Baratos, Hoteles y Ofertas de Viaje en ${currency}`,
      description: `Encuentra y reserva vuelos baratos, hoteles y paquetes de viaje en todo el mundo. Mejores precios en ${currency} con soporte 24/7.`,
      keywords: `vuelos baratos ${currency}, reserva vuelos, reserva hoteles, ofertas viaje, billetes avión, paquetes vacaciones, vuelos ${currency}`,
      companyName: 'YourTravelSearch España',
      tagline: 'Tu Viaje Comienza Aquí'
    },
    it: {
      title: `YourTravelSearch Italia - Voli Economici, Hotel e Offerte Viaggio in ${currency}`,
      description: `Trova e prenota voli economici, hotel e pacchetti viaggio in tutto il mondo. Migliori prezzi in ${currency} con supporto 24/7.`,
      keywords: `voli economici ${currency}, prenotazione voli, prenotazione hotel, offerte viaggio, biglietti aerei, pacchetti vacanze`,
      companyName: 'YourTravelSearch Italia',
      tagline: 'Il Tuo Viaggio Inizia Qui'
    }
  };

  return contentMap[language] || contentMap['en'];
}

function getCurrencySymbol(currency: string): string {
  const symbols: { [key: string]: string } = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'CHF': 'CHF', 'JPY': '¥',
    'CAD': 'C$', 'AUD': 'A$', 'NZD': 'NZ$', 'SEK': 'kr', 'NOK': 'kr',
    'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'RON': 'lei'
  };
  return symbols[currency] || currency;
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonicalAndHreflang(canonicalUrl?: string, language?: string, currency?: string) {
  const baseUrl = window.location.origin;
  const currentPath = window.location.pathname;
  
  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl || `${baseUrl}${currentPath}`);
  
  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  
  // Add hreflang tags for supported languages
  const hreflangs = [
    { lang: 'en', country: 'us', currency: 'USD' },
    { lang: 'en', country: 'ca', currency: 'CAD' },
    { lang: 'fr', country: 'ca', currency: 'CAD' },
    { lang: 'en', country: 'gb', currency: 'GBP' },
    { lang: 'de', country: 'de', currency: 'EUR' },
    { lang: 'fr', country: 'fr', currency: 'EUR' },
    { lang: 'es', country: 'es', currency: 'EUR' },
    { lang: 'it', country: 'it', currency: 'EUR' },
    { lang: 'en', country: 'au', currency: 'AUD' },
    { lang: 'en', country: 'nz', currency: 'NZD' },
    { lang: 'sv', country: 'se', currency: 'SEK' },
    { lang: 'no', country: 'no', currency: 'NOK' },
    { lang: 'da', country: 'dk', currency: 'DKK' },
    { lang: 'pl', country: 'pl', currency: 'PLN' },
    { lang: 'cs', country: 'cz', currency: 'CZK' }
  ];
  
  hreflangs.forEach(({ lang, country, currency: curr }) => {
    const hreflang = document.createElement('link');
    hreflang.setAttribute('rel', 'alternate');
    hreflang.setAttribute('hreflang', `${lang}-${country}`);
    hreflang.setAttribute('href', `${baseUrl}${currentPath}?lang=${lang}&currency=${curr}`);
    document.head.appendChild(hreflang);
  });
  
  // Add x-default
  const xDefault = document.createElement('link');
  xDefault.setAttribute('rel', 'alternate');
  xDefault.setAttribute('hreflang', 'x-default');
  xDefault.setAttribute('href', `${baseUrl}${currentPath}`);
  document.head.appendChild(xDefault);
}

function updateOpenGraphTags(content: any, ogImage?: string) {
  const ogTags = [
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: content.title },
    { property: 'og:description', content: content.description },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: content.companyName },
    { property: 'og:image', content: ogImage || `${window.location.origin}/og-image.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: content.language || 'en_US' }
  ];
  
  ogTags.forEach(({ property, content: tagContent }) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', tagContent);
  });
}

function updateTwitterCardTags(content: any) {
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: content.title },
    { name: 'twitter:description', content: content.description },
    { name: 'twitter:image', content: `${window.location.origin}/twitter-image.jpg` },
    { name: 'twitter:site', content: '@YourTravelSearch' },
    { name: 'twitter:creator', content: '@YourTravelSearch' }
  ];
  
  twitterTags.forEach(({ name, content: tagContent }) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', tagContent);
  });
}

function updateStructuredData(data: object) {
  // Remove existing structured data
  document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
  
  // Add new structured data
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function getDefaultStructuredData(content: any, selectedCurrency: string, selectedLanguage: string) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": content.companyName,
    "description": content.description,
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "sameAs": [
      "https://twitter.com/YourTravelSearch",
      "https://facebook.com/YourTravelSearch",
      "https://instagram.com/YourTravelSearch"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Global",
      "addressCountry": "Worldwide"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-TRAVAL-1",
      "contactType": "customer service",
      "availableLanguage": [selectedLanguage],
      "areaServed": "Worldwide"
    },
    "priceRange": selectedCurrency,
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Flight",
          "name": "Flight Booking Services"
        },
        "priceCurrency": selectedCurrency
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "LodgingBusiness",
          "name": "Hotel Booking Services"
        },
        "priceCurrency": selectedCurrency
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "50000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": selectedCurrency,
      "lowPrice": "99",
      "highPrice": "2999",
      "offerCount": "1000000"
    }
  };
}