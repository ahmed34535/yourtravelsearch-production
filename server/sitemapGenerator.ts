import { storage } from "./storage";

interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: { hreflang: string; href: string }[];
}

// Comprehensive global flight routes for worldwide SEO coverage
const POPULAR_ROUTES = [
  // Major US domestic routes (high search volume)
  { from: 'LAX', to: 'JFK', fromCity: 'Los Angeles', toCity: 'New York' },
  { from: 'LAX', to: 'ORD', fromCity: 'Los Angeles', toCity: 'Chicago' },
  { from: 'LAX', to: 'MIA', fromCity: 'Los Angeles', toCity: 'Miami' },
  { from: 'LAX', to: 'DFW', fromCity: 'Los Angeles', toCity: 'Dallas' },
  { from: 'LAX', to: 'SEA', fromCity: 'Los Angeles', toCity: 'Seattle' },
  { from: 'LAX', to: 'SFO', fromCity: 'Los Angeles', toCity: 'San Francisco' },
  { from: 'LAX', to: 'DEN', fromCity: 'Los Angeles', toCity: 'Denver' },
  { from: 'LAX', to: 'ATL', fromCity: 'Los Angeles', toCity: 'Atlanta' },
  { from: 'LAX', to: 'BOS', fromCity: 'Los Angeles', toCity: 'Boston' },
  { from: 'LAX', to: 'LAS', fromCity: 'Los Angeles', toCity: 'Las Vegas' },
  { from: 'LAX', to: 'PHX', fromCity: 'Los Angeles', toCity: 'Phoenix' },
  { from: 'LAX', to: 'MSP', fromCity: 'Los Angeles', toCity: 'Minneapolis' },
  
  { from: 'JFK', to: 'LAX', fromCity: 'New York', toCity: 'Los Angeles' },
  { from: 'JFK', to: 'ORD', fromCity: 'New York', toCity: 'Chicago' },
  { from: 'JFK', to: 'MIA', fromCity: 'New York', toCity: 'Miami' },
  { from: 'JFK', to: 'SFO', fromCity: 'New York', toCity: 'San Francisco' },
  { from: 'JFK', to: 'DFW', fromCity: 'New York', toCity: 'Dallas' },
  { from: 'JFK', to: 'SEA', fromCity: 'New York', toCity: 'Seattle' },
  { from: 'JFK', to: 'DEN', fromCity: 'New York', toCity: 'Denver' },
  { from: 'JFK', to: 'ATL', fromCity: 'New York', toCity: 'Atlanta' },
  { from: 'JFK', to: 'BOS', fromCity: 'New York', toCity: 'Boston' },
  { from: 'JFK', to: 'LAS', fromCity: 'New York', toCity: 'Las Vegas' },
  { from: 'JFK', to: 'MCO', fromCity: 'New York', toCity: 'Orlando' },
  { from: 'JFK', to: 'TPA', fromCity: 'New York', toCity: 'Tampa' },
  
  { from: 'ORD', to: 'LAX', fromCity: 'Chicago', toCity: 'Los Angeles' },
  { from: 'ORD', to: 'JFK', fromCity: 'Chicago', toCity: 'New York' },
  { from: 'ORD', to: 'MIA', fromCity: 'Chicago', toCity: 'Miami' },
  { from: 'ORD', to: 'SFO', fromCity: 'Chicago', toCity: 'San Francisco' },
  { from: 'ORD', to: 'DEN', fromCity: 'Chicago', toCity: 'Denver' },
  { from: 'ORD', to: 'ATL', fromCity: 'Chicago', toCity: 'Atlanta' },
  { from: 'ORD', to: 'SEA', fromCity: 'Chicago', toCity: 'Seattle' },
  { from: 'ORD', to: 'BOS', fromCity: 'Chicago', toCity: 'Boston' },
  { from: 'ORD', to: 'DFW', fromCity: 'Chicago', toCity: 'Dallas' },
  { from: 'ORD', to: 'LAS', fromCity: 'Chicago', toCity: 'Las Vegas' },
  
  // US to Europe (major transatlantic routes)
  { from: 'JFK', to: 'LHR', fromCity: 'New York', toCity: 'London' },
  { from: 'JFK', to: 'CDG', fromCity: 'New York', toCity: 'Paris' },
  { from: 'JFK', to: 'FRA', fromCity: 'New York', toCity: 'Frankfurt' },
  { from: 'JFK', to: 'AMS', fromCity: 'New York', toCity: 'Amsterdam' },
  { from: 'JFK', to: 'FCO', fromCity: 'New York', toCity: 'Rome' },
  { from: 'JFK', to: 'MAD', fromCity: 'New York', toCity: 'Madrid' },
  { from: 'JFK', to: 'BCN', fromCity: 'New York', toCity: 'Barcelona' },
  { from: 'JFK', to: 'ZUR', fromCity: 'New York', toCity: 'Zurich' },
  { from: 'JFK', to: 'VIE', fromCity: 'New York', toCity: 'Vienna' },
  { from: 'JFK', to: 'MUC', fromCity: 'New York', toCity: 'Munich' },
  { from: 'JFK', to: 'DUB', fromCity: 'New York', toCity: 'Dublin' },
  { from: 'JFK', to: 'EDI', fromCity: 'New York', toCity: 'Edinburgh' },
  { from: 'JFK', to: 'MAN', fromCity: 'New York', toCity: 'Manchester' },
  { from: 'JFK', to: 'LIS', fromCity: 'New York', toCity: 'Lisbon' },
  { from: 'JFK', to: 'ATH', fromCity: 'New York', toCity: 'Athens' },
  { from: 'JFK', to: 'BRU', fromCity: 'New York', toCity: 'Brussels' },
  { from: 'JFK', to: 'CPH', fromCity: 'New York', toCity: 'Copenhagen' },
  { from: 'JFK', to: 'ARN', fromCity: 'New York', toCity: 'Stockholm' },
  { from: 'JFK', to: 'OSL', fromCity: 'New York', toCity: 'Oslo' },
  { from: 'JFK', to: 'HEL', fromCity: 'New York', toCity: 'Helsinki' },
  
  { from: 'LAX', to: 'LHR', fromCity: 'Los Angeles', toCity: 'London' },
  { from: 'LAX', to: 'CDG', fromCity: 'Los Angeles', toCity: 'Paris' },
  { from: 'LAX', to: 'FRA', fromCity: 'Los Angeles', toCity: 'Frankfurt' },
  { from: 'LAX', to: 'AMS', fromCity: 'Los Angeles', toCity: 'Amsterdam' },
  { from: 'LAX', to: 'FCO', fromCity: 'Los Angeles', toCity: 'Rome' },
  { from: 'LAX', to: 'MAD', fromCity: 'Los Angeles', toCity: 'Madrid' },
  { from: 'LAX', to: 'BCN', fromCity: 'Los Angeles', toCity: 'Barcelona' },
  { from: 'LAX', to: 'ZUR', fromCity: 'Los Angeles', toCity: 'Zurich' },
  { from: 'LAX', to: 'VIE', fromCity: 'Los Angeles', toCity: 'Vienna' },
  { from: 'LAX', to: 'MUC', fromCity: 'Los Angeles', toCity: 'Munich' },
  
  { from: 'ORD', to: 'LHR', fromCity: 'Chicago', toCity: 'London' },
  { from: 'ORD', to: 'CDG', fromCity: 'Chicago', toCity: 'Paris' },
  { from: 'ORD', to: 'FRA', fromCity: 'Chicago', toCity: 'Frankfurt' },
  { from: 'ORD', to: 'AMS', fromCity: 'Chicago', toCity: 'Amsterdam' },
  { from: 'ORD', to: 'FCO', fromCity: 'Chicago', toCity: 'Rome' },
  { from: 'ORD', to: 'MAD', fromCity: 'Chicago', toCity: 'Madrid' },
  { from: 'ORD', to: 'MUC', fromCity: 'Chicago', toCity: 'Munich' },
  { from: 'ORD', to: 'ZUR', fromCity: 'Chicago', toCity: 'Zurich' },
  
  { from: 'SFO', to: 'LHR', fromCity: 'San Francisco', toCity: 'London' },
  { from: 'SFO', to: 'CDG', fromCity: 'San Francisco', toCity: 'Paris' },
  { from: 'SFO', to: 'FRA', fromCity: 'San Francisco', toCity: 'Frankfurt' },
  { from: 'SFO', to: 'AMS', fromCity: 'San Francisco', toCity: 'Amsterdam' },
  { from: 'SFO', to: 'FCO', fromCity: 'San Francisco', toCity: 'Rome' },
  { from: 'SFO', to: 'ZUR', fromCity: 'San Francisco', toCity: 'Zurich' },
  
  { from: 'MIA', to: 'MAD', fromCity: 'Miami', toCity: 'Madrid' },
  { from: 'MIA', to: 'BCN', fromCity: 'Miami', toCity: 'Barcelona' },
  { from: 'MIA', to: 'LIS', fromCity: 'Miami', toCity: 'Lisbon' },
  { from: 'MIA', to: 'CDG', fromCity: 'Miami', toCity: 'Paris' },
  { from: 'MIA', to: 'LHR', fromCity: 'Miami', toCity: 'London' },
  { from: 'MIA', to: 'FCO', fromCity: 'Miami', toCity: 'Rome' },
  { from: 'MIA', to: 'FRA', fromCity: 'Miami', toCity: 'Frankfurt' },
  { from: 'MIA', to: 'ZUR', fromCity: 'Miami', toCity: 'Zurich' },
  
  { from: 'DFW', to: 'LHR', fromCity: 'Dallas', toCity: 'London' },
  { from: 'DFW', to: 'CDG', fromCity: 'Dallas', toCity: 'Paris' },
  { from: 'DFW', to: 'FRA', fromCity: 'Dallas', toCity: 'Frankfurt' },
  { from: 'DFW', to: 'AMS', fromCity: 'Dallas', toCity: 'Amsterdam' },
  { from: 'DFW', to: 'FCO', fromCity: 'Dallas', toCity: 'Rome' },
  
  { from: 'ATL', to: 'LHR', fromCity: 'Atlanta', toCity: 'London' },
  { from: 'ATL', to: 'CDG', fromCity: 'Atlanta', toCity: 'Paris' },
  { from: 'ATL', to: 'AMS', fromCity: 'Atlanta', toCity: 'Amsterdam' },
  { from: 'ATL', to: 'FCO', fromCity: 'Atlanta', toCity: 'Rome' },
  { from: 'ATL', to: 'FRA', fromCity: 'Atlanta', toCity: 'Frankfurt' },
  
  { from: 'BOS', to: 'LHR', fromCity: 'Boston', toCity: 'London' },
  { from: 'BOS', to: 'DUB', fromCity: 'Boston', toCity: 'Dublin' },
  { from: 'BOS', to: 'CDG', fromCity: 'Boston', toCity: 'Paris' },
  { from: 'BOS', to: 'EDI', fromCity: 'Boston', toCity: 'Edinburgh' },
  { from: 'BOS', to: 'FCO', fromCity: 'Boston', toCity: 'Rome' },
  { from: 'BOS', to: 'AMS', fromCity: 'Boston', toCity: 'Amsterdam' },
  
  { from: 'SEA', to: 'LHR', fromCity: 'Seattle', toCity: 'London' },
  { from: 'SEA', to: 'AMS', fromCity: 'Seattle', toCity: 'Amsterdam' },
  { from: 'SEA', to: 'FRA', fromCity: 'Seattle', toCity: 'Frankfurt' },
  { from: 'SEA', to: 'CDG', fromCity: 'Seattle', toCity: 'Paris' },
  
  { from: 'DEN', to: 'LHR', fromCity: 'Denver', toCity: 'London' },
  { from: 'DEN', to: 'AMS', fromCity: 'Denver', toCity: 'Amsterdam' },
  { from: 'DEN', to: 'FRA', fromCity: 'Denver', toCity: 'Frankfurt' },
  { from: 'DEN', to: 'CDG', fromCity: 'Denver', toCity: 'Paris' },
  
  // Europe to US (reverse routes)
  { from: 'LHR', to: 'JFK', fromCity: 'London', toCity: 'New York' },
  { from: 'LHR', to: 'LAX', fromCity: 'London', toCity: 'Los Angeles' },
  { from: 'LHR', to: 'ORD', fromCity: 'London', toCity: 'Chicago' },
  { from: 'LHR', to: 'SFO', fromCity: 'London', toCity: 'San Francisco' },
  { from: 'LHR', to: 'MIA', fromCity: 'London', toCity: 'Miami' },
  { from: 'LHR', to: 'BOS', fromCity: 'London', toCity: 'Boston' },
  { from: 'LHR', to: 'SEA', fromCity: 'London', toCity: 'Seattle' },
  { from: 'LHR', to: 'DFW', fromCity: 'London', toCity: 'Dallas' },
  { from: 'LHR', to: 'ATL', fromCity: 'London', toCity: 'Atlanta' },
  { from: 'LHR', to: 'DEN', fromCity: 'London', toCity: 'Denver' },
  
  { from: 'CDG', to: 'JFK', fromCity: 'Paris', toCity: 'New York' },
  { from: 'CDG', to: 'LAX', fromCity: 'Paris', toCity: 'Los Angeles' },
  { from: 'CDG', to: 'ORD', fromCity: 'Paris', toCity: 'Chicago' },
  { from: 'CDG', to: 'SFO', fromCity: 'Paris', toCity: 'San Francisco' },
  { from: 'CDG', to: 'MIA', fromCity: 'Paris', toCity: 'Miami' },
  { from: 'CDG', to: 'BOS', fromCity: 'Paris', toCity: 'Boston' },
  { from: 'CDG', to: 'ATL', fromCity: 'Paris', toCity: 'Atlanta' },
  
  { from: 'FRA', to: 'JFK', fromCity: 'Frankfurt', toCity: 'New York' },
  { from: 'FRA', to: 'LAX', fromCity: 'Frankfurt', toCity: 'Los Angeles' },
  { from: 'FRA', to: 'ORD', fromCity: 'Frankfurt', toCity: 'Chicago' },
  { from: 'FRA', to: 'SFO', fromCity: 'Frankfurt', toCity: 'San Francisco' },
  { from: 'FRA', to: 'MIA', fromCity: 'Frankfurt', toCity: 'Miami' },
  { from: 'FRA', to: 'DFW', fromCity: 'Frankfurt', toCity: 'Dallas' },
  
  { from: 'AMS', to: 'JFK', fromCity: 'Amsterdam', toCity: 'New York' },
  { from: 'AMS', to: 'LAX', fromCity: 'Amsterdam', toCity: 'Los Angeles' },
  { from: 'AMS', to: 'ORD', fromCity: 'Amsterdam', toCity: 'Chicago' },
  { from: 'AMS', to: 'SFO', fromCity: 'Amsterdam', toCity: 'San Francisco' },
  { from: 'AMS', to: 'ATL', fromCity: 'Amsterdam', toCity: 'Atlanta' },
  { from: 'AMS', to: 'SEA', fromCity: 'Amsterdam', toCity: 'Seattle' },
  
  // Major European internal routes
  { from: 'LHR', to: 'CDG', fromCity: 'London', toCity: 'Paris' },
  { from: 'LHR', to: 'FRA', fromCity: 'London', toCity: 'Frankfurt' },
  { from: 'LHR', to: 'AMS', fromCity: 'London', toCity: 'Amsterdam' },
  { from: 'LHR', to: 'FCO', fromCity: 'London', toCity: 'Rome' },
  { from: 'LHR', to: 'MAD', fromCity: 'London', toCity: 'Madrid' },
  { from: 'LHR', to: 'BCN', fromCity: 'London', toCity: 'Barcelona' },
  { from: 'LHR', to: 'MUC', fromCity: 'London', toCity: 'Munich' },
  { from: 'LHR', to: 'ZUR', fromCity: 'London', toCity: 'Zurich' },
  { from: 'LHR', to: 'VIE', fromCity: 'London', toCity: 'Vienna' },
  { from: 'LHR', to: 'DUB', fromCity: 'London', toCity: 'Dublin' },
  
  { from: 'CDG', to: 'LHR', fromCity: 'Paris', toCity: 'London' },
  { from: 'CDG', to: 'FRA', fromCity: 'Paris', toCity: 'Frankfurt' },
  { from: 'CDG', to: 'AMS', fromCity: 'Paris', toCity: 'Amsterdam' },
  { from: 'CDG', to: 'FCO', fromCity: 'Paris', toCity: 'Rome' },
  { from: 'CDG', to: 'MAD', fromCity: 'Paris', toCity: 'Madrid' },
  { from: 'CDG', to: 'BCN', fromCity: 'Paris', toCity: 'Barcelona' },
  { from: 'CDG', to: 'MUC', fromCity: 'Paris', toCity: 'Munich' },
  { from: 'CDG', to: 'ZUR', fromCity: 'Paris', toCity: 'Zurich' },
  
  { from: 'FRA', to: 'LHR', fromCity: 'Frankfurt', toCity: 'London' },
  { from: 'FRA', to: 'CDG', fromCity: 'Frankfurt', toCity: 'Paris' },
  { from: 'FRA', to: 'AMS', fromCity: 'Frankfurt', toCity: 'Amsterdam' },
  { from: 'FRA', to: 'FCO', fromCity: 'Frankfurt', toCity: 'Rome' },
  { from: 'FRA', to: 'MAD', fromCity: 'Frankfurt', toCity: 'Madrid' },
  { from: 'FRA', to: 'BCN', fromCity: 'Frankfurt', toCity: 'Barcelona' },
  { from: 'FRA', to: 'MUC', fromCity: 'Frankfurt', toCity: 'Munich' },
  { from: 'FRA', to: 'ZUR', fromCity: 'Frankfurt', toCity: 'Zurich' },
  
  // European Routes
  { from: 'LHR', to: 'CDG', fromCity: 'London', toCity: 'Paris' },
  { from: 'FRA', to: 'FCO', fromCity: 'Frankfurt', toCity: 'Rome' },
  { from: 'MAD', to: 'BCN', fromCity: 'Madrid', toCity: 'Barcelona' },
  { from: 'AMS', to: 'LHR', fromCity: 'Amsterdam', toCity: 'London' },
];

// Popular destinations for cheap flights pages
const POPULAR_DESTINATIONS = [
  { code: 'LHR', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', city: 'Paris', country: 'France' },
  { code: 'FCO', city: 'Rome', country: 'Italy' },
  { code: 'MAD', city: 'Madrid', country: 'Spain' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan' },
  { code: 'DXB', city: 'Dubai', country: 'UAE' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong' },
];

// Supported languages and their regions
const LANGUAGE_REGIONS = [
  { lang: 'en', region: 'US', domain: 'travalsearch.com' },
  { lang: 'en', region: 'GB', domain: 'travalsearch.com' },
  { lang: 'en', region: 'CA', domain: 'travalsearch.com' },
  { lang: 'en', region: 'AU', domain: 'travalsearch.com' },
  { lang: 'es', region: 'ES', domain: 'travalsearch.com' },
  { lang: 'fr', region: 'FR', domain: 'travalsearch.com' },
  { lang: 'de', region: 'DE', domain: 'travalsearch.com' },
  { lang: 'it', region: 'IT', domain: 'travalsearch.com' },
  { lang: 'pt', region: 'PT', domain: 'travalsearch.com' },
  { lang: 'nl', region: 'NL', domain: 'travalsearch.com' },
];

function createAlternateLinks(basePath: string): { hreflang: string; href: string }[] {
  return LANGUAGE_REGIONS.map(({ lang, region, domain }) => ({
    hreflang: `${lang}-${region}`,
    href: `https://${domain}${basePath}`
  }));
}

export function generateSitemap(): string {
  const urls: SitemapUrl[] = [];
  const baseUrl = 'https://travalsearch.com';
  const currentDate = new Date().toISOString().split('T')[0];

  // Homepage
  urls.push({
    url: `${baseUrl}/`,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: 1.0,
    alternates: createAlternateLinks('/')
  });

  // Main pages
  const mainPages = [
    { path: '/flights', priority: 0.9 },
    { path: '/hotels', priority: 0.8 },
    { path: '/about', priority: 0.6 },
    { path: '/support', priority: 0.7 },
    { path: '/privacy-policy', priority: 0.5 },
    { path: '/terms-of-service', priority: 0.5 },
  ];

  mainPages.forEach(page => {
    urls.push({
      url: `${baseUrl}${page.path}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: page.priority,
      alternates: createAlternateLinks(page.path)
    });
  });

  // Flight route pages (flights-from-X-to-Y)
  POPULAR_ROUTES.forEach(route => {
    const routePath = `/flights-from-${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`;
    urls.push({
      url: `${baseUrl}${routePath}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8,
      alternates: createAlternateLinks(routePath)
    });
  });

  // Cheap flights to destination pages
  POPULAR_DESTINATIONS.forEach(dest => {
    const destPath = `/cheap-flights-to-${dest.city.toLowerCase().replace(/\s+/g, '-')}`;
    urls.push({
      url: `${baseUrl}${destPath}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.7,
      alternates: createAlternateLinks(destPath)
    });
  });

  // Blog main page and high-quality articles
  urls.push({
    url: `${baseUrl}/blog`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8,
    alternates: createAlternateLinks('/blog')
  });

  // High-quality blog posts across all 6 categories
  const blogPosts = [
    // Flight Tips Category
    '/blog/how-to-score-cheapest-flight-every-time',
    '/blog/direct-vs-connecting-flights-what-saves-money',
    
    // Travel Deals Category  
    '/blog/top-5-cities-flight-discounts-this-month',
    '/blog/flash-sale-alerts-what-you-need-to-know',
    
    // Airport Guides Category
    '/blog/navigating-lax-insider-tips-frequent-flyers',
    '/blog/jfk-airport-best-terminals-lounges',
    
    // International Travel Category
    '/blog/what-to-pack-long-haul-flight-europe',
    '/blog/visa-free-destinations-us-passport-holders',
    
    // Booking Tips Category
    '/blog/should-you-book-flights-tuesday-investigation',
    '/blog/when-to-book-advance-vs-last-minute-flights',
    
    // Travel Tips Category
    '/blog/how-to-travel-only-carry-on',
    '/blog/best-travel-apps-2025',

    // Additional comprehensive blog content for global SEO
    '/blog/best-time-book-flights-2025',
    '/blog/cheap-flights-europe-guide',
    '/blog/travel-tips-first-time-international',
    '/blog/airline-baggage-fees-guide',
    '/blog/flight-booking-mistakes-avoid',
    '/blog/budget-travel-destinations-2025',
    '/blog/business-vs-economy-worth-upgrade',
    '/blog/travel-insurance-comprehensive-guide',
    '/blog/jet-lag-prevention-tips',
    '/blog/airport-security-fast-track-guide',
    '/blog/frequent-flyer-programs-comparison',
    '/blog/travel-credit-cards-best-rewards',
    '/blog/group-travel-booking-tips',
    '/blog/solo-travel-safety-guide',
    '/blog/family-travel-airport-tips',
    '/blog/sustainable-travel-eco-friendly-flights',
    '/blog/travel-during-holidays-booking-guide',
    '/blog/connecting-flights-layover-guide',
    '/blog/travel-documents-international-flights',
    '/blog/flight-cancellation-compensation-guide',
    
    // Route-specific content targeting high-value keywords
    '/blog/lax-to-jfk-complete-guide',
    '/blog/jfk-to-lhr-transatlantic-tips',
    '/blog/ord-to-cdg-chicago-paris-flights',
    '/blog/mia-to-mad-miami-madrid-route',
    '/blog/sfo-to-fra-san-francisco-frankfurt',
    '/blog/atl-to-fcr-atlanta-rome-flights',
    '/blog/bos-to-dub-boston-dublin-guide',
    '/blog/sea-to-ams-seattle-amsterdam',
    '/blog/den-to-zur-denver-zurich-flights',
    '/blog/lax-to-nrt-los-angeles-tokyo',
    
    // Destination-specific guides
    '/blog/flying-to-london-complete-guide',
    '/blog/paris-flight-deals-insider-tips',
    '/blog/frankfurt-airport-connection-guide',
    '/blog/amsterdam-layover-travel-tips',
    '/blog/rome-airport-transportation-guide',
    '/blog/madrid-flight-booking-secrets',
    '/blog/barcelona-budget-flight-tips',
    '/blog/zurich-airport-premium-experience',
    '/blog/vienna-travel-flight-guide',
    '/blog/munich-oktoberfest-flight-deals',
    
    // Spanish content for Hispanic markets
    '/blog/es/vuelos-baratos-europa-guia',
    '/blog/es/mejor-epoca-volar-ahorrar',
    '/blog/es/vuelos-madrid-nueva-york',
    '/blog/es/barcelona-vuelos-economicos',
    '/blog/es/consejos-viajar-europa',
    '/blog/es/vuelos-miami-madrid-guia',
    '/blog/es/equipaje-aeropuerto-tips',
    '/blog/es/vuelos-directos-europa-500',
    '/blog/es/comparar-precios-vuelos',
    '/blog/es/vuelos-familia-consejos',
    
    // French content for Francophone markets
    '/blog/fr/vols-pas-chers-europe',
    '/blog/fr/meilleur-moment-reserver-vol',
    '/blog/fr/paris-new-york-vols-directs',
    '/blog/fr/conseils-voyage-international',
    '/blog/fr/vols-famille-economiques',
    '/blog/fr/bagages-frais-compagnies',
    '/blog/fr/securite-aeroport-conseils',
    '/blog/fr/programmes-fidelite-comparaison',
    '/blog/fr/vols-affaires-vs-economique',
    '/blog/fr/assurance-voyage-guide',
    
    // German content for German-speaking markets
    '/blog/de/gunstige-fluge-europa',
    '/blog/de/beste-zeit-flug-buchen',
    '/blog/de/frankfurt-new-york-fluge',
    '/blog/de/munchen-los-angeles-route',
    '/blog/de/reise-tipps-international',
    '/blog/de/gepack-gebuhren-airlines',
    '/blog/de/flughafen-sicherheit-tipps',
    '/blog/de/business-class-lohnt-sich',
    '/blog/de/reiseversicherung-guide',
    '/blog/de/familienreise-flug-tipps',
    
    // Italian content for Italian market
    '/blog/it/voli-economici-europa',
    '/blog/it/quando-prenotare-voli',
    '/blog/it/roma-new-york-voli-diretti',
    '/blog/it/milano-los-angeles-guida',
    '/blog/it/consigli-viaggio-internazionale',
    '/blog/it/bagagli-tariffe-compagnie',
    '/blog/it/sicurezza-aeroporto-tips',
    '/blog/it/programmi-fedeltà-confronto',
    '/blog/it/business-vs-economy-classe',
    '/blog/it/assicurazione-viaggio-guida'
  ];

  blogPosts.forEach(blogPath => {
    urls.push({
      url: `${baseUrl}${blogPath}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6,
      alternates: createAlternateLinks(blogPath)
    });
  });

  // Enhanced regional destination pages with multi-language support
  const regionalPages = [
    // English regional pages
    '/destinations/europe',
    '/destinations/asia',
    '/destinations/north-america',
    '/destinations/south-america',
    '/destinations/africa',
    '/destinations/oceania',
    '/destinations/middle-east',
    '/destinations/caribbean',
    '/deals/europe-flight-deals',
    '/deals/asia-flight-deals',
    '/deals/africa-flight-deals',
    '/deals/last-minute-flights',
    '/deals/weekend-getaways',
    '/deals/business-class-deals',
    '/guides/travel-guides',
    '/guides/airport-guides',
    '/guides/city-guides',
    '/help/booking-assistance',
    '/help/travel-requirements',
    '/help/flight-changes-cancellations',
    
    // Spanish regional pages
    '/es/destinos/europa',
    '/es/destinos/asia', 
    '/es/destinos/america-norte',
    '/es/destinos/america-sur',
    '/es/destinos/africa',
    '/es/ofertas/vuelos-europa',
    '/es/ofertas/vuelos-ultima-hora',
    '/es/ofertas/fin-semana',
    '/es/guias/aeropuertos',
    '/es/guias/ciudades',
    '/es/ayuda/reservas',
    
    // French regional pages
    '/fr/destinations/europe',
    '/fr/destinations/asie',
    '/fr/destinations/amerique-nord',
    '/fr/destinations/amerique-sud',
    '/fr/destinations/afrique',
    '/fr/offres/vols-europe',
    '/fr/offres/derniere-minute',
    '/fr/offres/week-end',
    '/fr/guides/aeroports',
    '/fr/guides/villes',
    '/fr/aide/reservations',
    
    // German regional pages
    '/de/reiseziele/europa',
    '/de/reiseziele/asien',
    '/de/reiseziele/nordamerika',
    '/de/reiseziele/sudamerika',
    '/de/reiseziele/afrika',
    '/de/angebote/europa-fluge',
    '/de/angebote/last-minute',
    '/de/angebote/wochenende',
    '/de/ratgeber/flughafen',
    '/de/ratgeber/stadte',
    '/de/hilfe/buchung',
    
    // Italian regional pages
    '/it/destinazioni/europa',
    '/it/destinazioni/asia',
    '/it/destinazioni/nord-america',
    '/it/destinazioni/sud-america',
    '/it/destinazioni/africa',
    '/it/offerte/voli-europa',
    '/it/offerte/ultimo-minuto',
    '/it/offerte/weekend',
    '/it/guide/aeroporti',
    '/it/guide/citta',
    '/it/aiuto/prenotazioni',
    
    // Portuguese regional pages
    '/pt/destinos/europa',
    '/pt/destinos/asia',
    '/pt/destinos/america-norte',
    '/pt/destinos/america-sul',
    '/pt/destinos/africa',
    '/pt/ofertas/voos-europa',
    '/pt/ofertas/ultima-hora',
    '/pt/ofertas/fim-semana',
    '/pt/guias/aeroportos',
    '/pt/guias/cidades',
    '/pt/ajuda/reservas',
    
    // Route-specific FAQ and guide pages
    '/guides/lax-to-jfk-everything-you-need-know',
    '/guides/jfk-to-lhr-complete-travel-guide',
    '/guides/ord-to-cdg-chicago-paris-route',
    '/guides/mia-to-mad-miami-madrid-flights',
    '/guides/sfo-to-fra-business-travel-guide',
    '/guides/atl-to-fcr-atlanta-rome-complete',
    '/guides/bos-to-dub-boston-dublin-heritage',
    '/guides/sea-to-ams-seattle-amsterdam-tech',
    '/guides/den-to-zur-denver-zurich-skiing',
    '/guides/lax-nrt-pacific-crossing-guide',
    
    // Airport-specific comprehensive guides
    '/airport-guides/lax-los-angeles-complete',
    '/airport-guides/jfk-new-york-kennedy-guide',
    '/airport-guides/ord-chicago-ohare-hub',
    '/airport-guides/lhr-london-heathrow-complete',
    '/airport-guides/cdg-paris-charles-de-gaulle',
    '/airport-guides/fra-frankfurt-main-hub',
    '/airport-guides/ams-amsterdam-schiphol-guide',
    '/airport-guides/fco-rome-fiumicino-complete',
    '/airport-guides/mad-madrid-barajas-guide',
    '/airport-guides/bcn-barcelona-el-prat'
  ];

  regionalPages.forEach(regionPath => {
    urls.push({
      url: `${baseUrl}${regionPath}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6,
      alternates: createAlternateLinks(regionPath)
    });
  });

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  urls.forEach(urlObj => {
    xml += '  <url>\n';
    xml += `    <loc>${urlObj.url}</loc>\n`;
    if (urlObj.lastmod) xml += `    <lastmod>${urlObj.lastmod}</lastmod>\n`;
    if (urlObj.changefreq) xml += `    <changefreq>${urlObj.changefreq}</changefreq>\n`;
    if (urlObj.priority) xml += `    <priority>${urlObj.priority}</priority>\n`;
    
    // Add hreflang alternates for international SEO
    if (urlObj.alternates) {
      urlObj.alternates.forEach(alt => {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />\n`;
      });
    }
    
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

export function generateRobotsTxt(language?: string): string {
  // Comprehensive global sitemap references - accessible worldwide
  const globalSitemaps = [
    'https://travalsearch.com/sitemap.xml',
    'https://travalsearch.com/sitemap-es.xml',
    'https://travalsearch.com/sitemap-fr.xml',
    'https://travalsearch.com/sitemap-de.xml',
    'https://travalsearch.com/sitemap-it.xml',
    'https://travalsearch.com/sitemap-pt.xml',
    'https://travalsearch.com/sitemap-zh.xml',
    'https://travalsearch.com/sitemap-ja.xml',
    'https://travalsearch.com/sitemap-ko.xml',
    'https://travalsearch.com/sitemap-ar.xml',
    'https://travalsearch.com/sitemap-hi.xml',
    'https://travalsearch.com/sitemap-ru.xml'
  ];

  const translations = {
    en: {
      comment1: "# Welcome international travelers! Find cheap flights worldwide",
      comment2: "# Block admin and internal areas",
      comment3: "# Allow all search engines to crawl flight and hotel pages",
      comment4: "# Special pages for flight deals and booking",
      comment5: "# Blog content for travel tips and guides",
      comment6: "# Multi-language support available"
    },
    es: {
      comment1: "# ¡Bienvenidos viajeros internacionales! Encuentra vuelos baratos en todo el mundo",
      comment2: "# Bloquear áreas de administración e internas",
      comment3: "# Permitir que todos los motores de búsqueda rastreen páginas de vuelos y hoteles",
      comment4: "# Páginas especiales para ofertas de vuelos y reservas",
      comment5: "# Contenido del blog para consejos de viaje y guías",
      comment6: "# Soporte multiidioma disponible"
    },
    fr: {
      comment1: "# Bienvenue voyageurs internationaux ! Trouvez des vols pas chers dans le monde entier",
      comment2: "# Bloquer les zones d'administration et internes",
      comment3: "# Permettre à tous les moteurs de recherche d'explorer les pages de vols et d'hôtels",
      comment4: "# Pages spéciales pour les offres de vols et réservations",
      comment5: "# Contenu du blog pour conseils de voyage et guides",
      comment6: "# Support multilingue disponible"
    },
    de: {
      comment1: "# Willkommen internationale Reisende! Finden Sie günstige Flüge weltweit",
      comment2: "# Admin- und interne Bereiche blockieren",
      comment3: "# Allen Suchmaschinen erlauben, Flug- und Hotelseiten zu crawlen",
      comment4: "# Spezielle Seiten für Flugangebote und Buchungen",
      comment5: "# Blog-Inhalte für Reisetipps und Guides",
      comment6: "# Mehrsprachiger Support verfügbar"
    },
    it: {
      comment1: "# Benvenuti viaggiatori internazionali! Trova voli economici in tutto il mondo",
      comment2: "# Bloccare aree amministrative e interne",
      comment3: "# Consentire a tutti i motori di ricerca di scansionare pagine di voli e hotel",
      comment4: "# Pagine speciali per offerte voli e prenotazioni",
      comment5: "# Contenuti del blog per consigli di viaggio e guide",
      comment6: "# Supporto multilingua disponibile"
    },
    pt: {
      comment1: "# Bem-vindos viajantes internacionais! Encontre voos baratos em todo o mundo",
      comment2: "# Bloquear áreas administrativas e internas",
      comment3: "# Permitir que todos os mecanismos de busca rastreiem páginas de voos e hotéis",
      comment4: "# Páginas especiais para ofertas de voos e reservas",
      comment5: "# Conteúdo do blog para dicas de viagem e guias",
      comment6: "# Suporte multilíngue disponível"
    },
    zh: {
      comment1: "# 欢迎国际旅客！在全球范围内寻找便宜的航班",
      comment2: "# 阻止管理和内部区域",
      comment3: "# 允许所有搜索引擎抓取航班和酒店页面",
      comment4: "# 航班优惠和预订的特殊页面",
      comment5: "# 旅行提示和指南的博客内容",
      comment6: "# 提供多语言支持"
    },
    ja: {
      comment1: "# 国際的な旅行者の皆様、ようこそ！世界中で格安航空券を見つけよう",
      comment2: "# 管理および内部エリアをブロック",
      comment3: "# すべての検索エンジンがフライトとホテルページをクロールすることを許可",
      comment4: "# フライト取引と予約の特別ページ",
      comment5: "# 旅行のヒントとガイドのブログコンテンツ",
      comment6: "# 多言語サポート利用可能"
    },
    ko: {
      comment1: "# 국제 여행객 여러분, 환영합니다! 전 세계 저렴한 항공편을 찾아보세요",
      comment2: "# 관리 및 내부 영역 차단",
      comment3: "# 모든 검색 엔진이 항공편 및 호텔 페이지를 크롤링하도록 허용",
      comment4: "# 항공편 거래 및 예약을 위한 특별 페이지",
      comment5: "# 여행 팁 및 가이드 블로그 콘텐츠",
      comment6: "# 다국어 지원 가능"
    },
    ar: {
      comment1: "# أهلاً بالمسافرين الدوليين! ابحث عن رحلات طيران رخيصة في جميع أنحاء العالم",
      comment2: "# حظر المناطق الإدارية والداخلية",
      comment3: "# السماح لجميع محركات البحث بالزحف إلى صفحات الرحلات والفنادق",
      comment4: "# صفحات خاصة لعروض الطيران والحجوزات",
      comment5: "# محتوى المدونة لنصائح السفر والأدلة",
      comment6: "# دعم متعدد اللغات متاح"
    },
    hi: {
      comment1: "# अंतर्राष्ट्रीय यात्रियों का स्वागत है! दुनिया भर में सस्ती उड़ानें खोजें",
      comment2: "# व्यवस्थापक और आंतरिक क्षेत्रों को ब्लॉक करें",
      comment3: "# सभी खोज इंजनों को उड़ान और होटल पृष्ठों को क्रॉल करने की अनुमति दें",
      comment4: "# उड़ान सौदों और बुकिंग के लिए विशेष पृष्ठ",
      comment5: "# यात्रा युक्तियों और गाइड के लिए ब्लॉग सामग्री",
      comment6: "# बहुभाषी समर्थन उपलब्ध"
    },
    ru: {
      comment1: "# Добро пожаловать международные путешественники! Найдите дешевые авиабилеты по всему миру",
      comment2: "# Заблокировать административные и внутренние области",
      comment3: "# Разрешить всем поисковым системам сканировать страницы авиарейсов и отелей",
      comment4: "# Специальные страницы для предложений авиабилетов и бронирования",
      comment5: "# Контент блога для советов по путешествиям и руководств",
      comment6: "# Многоязычная поддержка доступна"
    }
  };

  const lang = language || 'en';
  const t = translations[lang as keyof typeof translations] || translations.en;

  return `User-agent: *
Allow: /

${t.comment1}
${t.comment2}
Disallow: /admin/
Disallow: /api/
Disallow: /dev/

${t.comment3}
Allow: /flights*
Allow: /hotels*
Allow: /cars*

${t.comment4}
Allow: /cheap-flights*
Allow: /flights-from*
Allow: /flights-to*
Allow: /booking*
Allow: /checkout*

${t.comment5}
Allow: /blog*
Allow: /travel-tips*
Allow: /guides*

${t.comment6}
Allow: /en/*
Allow: /es/*
Allow: /fr/*
Allow: /de/*
Allow: /it/*
Allow: /pt/*
Allow: /zh/*
Allow: /ja/*
Allow: /ko/*
Allow: /ar/*
Allow: /hi/*
Allow: /ru/*

# Crawl-delay for better server performance
Crawl-delay: 1

# Global sitemaps for all language versions and regions
${globalSitemaps.map(sitemap => `Sitemap: ${sitemap}`).join('\n')}`;
}

// Generate route-specific structured data
export function generateFlightRouteSchema(from: string, to: string, fromCity: string, toCity: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Flights from ${fromCity} to ${toCity}`,
    "description": `Find cheap flights from ${fromCity} (${from}) to ${toCity} (${to}). Compare prices and book with TravalSearch.`,
    "url": `https://travalsearch.com/flights-from-${from.toLowerCase()}-to-${to.toLowerCase()}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://travalsearch.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Flights",
          "item": "https://travalsearch.com/flights"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${fromCity} to ${toCity}`,
          "item": `https://travalsearch.com/flights-from-${from.toLowerCase()}-to-${to.toLowerCase()}`
        }
      ]
    },
    "mainEntity": {
      "@type": "Trip",
      "name": `Flight from ${fromCity} to ${toCity}`,
      "description": `Direct and connecting flights from ${fromCity} (${from}) to ${toCity} (${to})`,
      "tripOrigin": {
        "@type": "Airport",
        "name": `${fromCity} Airport`,
        "iataCode": from,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": fromCity
        }
      },
      "tripDestination": {
        "@type": "Airport",
        "name": `${toCity} Airport`,
        "iataCode": to,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": toCity
        }
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "TravalSearch",
      "url": "https://travalsearch.com",
      "logo": "https://travalsearch.com/logo.png"
    }
  };
}