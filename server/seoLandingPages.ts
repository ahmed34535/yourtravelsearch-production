/**
 * SEO Landing Page Generator for Flight Routes
 * Creates hundreds of targeted pages for specific search phrases
 */

export interface FlightRoute {
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  country: string;
  region: string;
  popularity: number;
  averagePrice: number;
  keywords: string[];
}

export interface CheapFlightDestination {
  destination: string;
  city: string;
  country: string;
  region: string;
  popularFromCities: string[];
  averagePrice: number;
  keywords: string[];
}

// Popular flight routes for SEO landing pages
export const popularFlightRoutes: FlightRoute[] = [
  // US Domestic Routes
  { from: "LAX", to: "JFK", fromCity: "Los Angeles", toCity: "New York", country: "United States", region: "North America", popularity: 95, averagePrice: 350, keywords: ["flights from lax to jfk", "los angeles to new york flights", "lax jfk flights"] },
  { from: "LAX", to: "SFO", fromCity: "Los Angeles", toCity: "San Francisco", country: "United States", region: "North America", popularity: 90, averagePrice: 150, keywords: ["flights from lax to sfo", "los angeles to san francisco flights", "california flights"] },
  { from: "JFK", to: "LAX", fromCity: "New York", toCity: "Los Angeles", country: "United States", region: "North America", popularity: 95, averagePrice: 350, keywords: ["flights from jfk to lax", "new york to los angeles flights", "coast to coast flights"] },
  { from: "ORD", to: "LAX", fromCity: "Chicago", toCity: "Los Angeles", country: "United States", region: "North America", popularity: 85, averagePrice: 280, keywords: ["flights from chicago to los angeles", "ord to lax flights", "midwest to west coast"] },
  { from: "MIA", to: "JFK", fromCity: "Miami", toCity: "New York", country: "United States", region: "North America", popularity: 80, averagePrice: 200, keywords: ["flights from miami to new york", "mia to jfk flights", "florida to new york"] },
  { from: "DFW", to: "LAX", fromCity: "Dallas", toCity: "Los Angeles", country: "United States", region: "North America", popularity: 75, averagePrice: 250, keywords: ["flights from dallas to los angeles", "dfw to lax flights", "texas to california"] },
  { from: "ATL", to: "LAX", fromCity: "Atlanta", toCity: "Los Angeles", country: "United States", region: "North America", popularity: 75, averagePrice: 300, keywords: ["flights from atlanta to los angeles", "atl to lax flights", "south to west coast"] },
  { from: "BOS", to: "LAX", fromCity: "Boston", toCity: "Los Angeles", country: "United States", region: "North America", popularity: 70, averagePrice: 380, keywords: ["flights from boston to los angeles", "bos to lax flights", "east coast to west coast"] },
  { from: "SEA", to: "JFK", fromCity: "Seattle", toCity: "New York", country: "United States", region: "North America", popularity: 70, averagePrice: 400, keywords: ["flights from seattle to new york", "sea to jfk flights", "pacific northwest to east coast"] },
  { from: "LAS", to: "JFK", fromCity: "Las Vegas", toCity: "New York", country: "United States", region: "North America", popularity: 65, averagePrice: 320, keywords: ["flights from las vegas to new york", "las to jfk flights", "vegas to nyc"] },

  // US to Europe Routes
  { from: "JFK", to: "LHR", fromCity: "New York", toCity: "London", country: "United Kingdom", region: "Europe", popularity: 95, averagePrice: 600, keywords: ["flights from new york to london", "jfk to lhr flights", "transatlantic flights"] },
  { from: "LAX", to: "LHR", fromCity: "Los Angeles", toCity: "London", country: "United Kingdom", region: "Europe", popularity: 85, averagePrice: 700, keywords: ["flights from los angeles to london", "lax to lhr flights", "west coast to london"] },
  { from: "JFK", to: "CDG", fromCity: "New York", toCity: "Paris", country: "France", region: "Europe", popularity: 90, averagePrice: 650, keywords: ["flights from new york to paris", "jfk to cdg flights", "nyc to paris"] },
  { from: "LAX", to: "CDG", fromCity: "Los Angeles", toCity: "Paris", country: "France", region: "Europe", popularity: 80, averagePrice: 750, keywords: ["flights from los angeles to paris", "lax to cdg flights", "california to paris"] },
  { from: "JFK", to: "FRA", fromCity: "New York", toCity: "Frankfurt", country: "Germany", region: "Europe", popularity: 75, averagePrice: 680, keywords: ["flights from new york to frankfurt", "jfk to fra flights", "nyc to germany"] },
  { from: "JFK", to: "FCO", fromCity: "New York", toCity: "Rome", country: "Italy", region: "Europe", popularity: 70, averagePrice: 700, keywords: ["flights from new york to rome", "jfk to fco flights", "nyc to italy"] },
  { from: "JFK", to: "MAD", fromCity: "New York", toCity: "Madrid", country: "Spain", region: "Europe", popularity: 65, averagePrice: 650, keywords: ["flights from new york to madrid", "jfk to mad flights", "nyc to spain"] },
  { from: "JFK", to: "AMS", fromCity: "New York", toCity: "Amsterdam", country: "Netherlands", region: "Europe", popularity: 60, averagePrice: 620, keywords: ["flights from new york to amsterdam", "jfk to ams flights", "nyc to netherlands"] },

  // African Routes
  { from: "NBO", to: "DXB", fromCity: "Nairobi", toCity: "Dubai", country: "UAE", region: "Middle East", popularity: 85, averagePrice: 400, keywords: ["flights from nairobi to dubai", "nbo to dxb flights", "kenya to uae"] },
  { from: "NBO", to: "JFK", fromCity: "Nairobi", toCity: "New York", country: "United States", region: "North America", popularity: 70, averagePrice: 1200, keywords: ["flights from nairobi to new york", "nbo to jfk flights", "kenya to usa"] },
  { from: "CAI", to: "DXB", fromCity: "Cairo", toCity: "Dubai", country: "UAE", region: "Middle East", popularity: 80, averagePrice: 350, keywords: ["flights from cairo to dubai", "cai to dxb flights", "egypt to uae"] },
  { from: "LOS", to: "JFK", fromCity: "Lagos", toCity: "New York", country: "United States", region: "North America", popularity: 75, averagePrice: 1100, keywords: ["flights from lagos to new york", "los to jfk flights", "nigeria to usa"] },
  { from: "JNB", to: "LHR", fromCity: "Johannesburg", toCity: "London", country: "United Kingdom", region: "Europe", popularity: 80, averagePrice: 800, keywords: ["flights from johannesburg to london", "jnb to lhr flights", "south africa to uk"] },

  // Middle Eastern Routes
  { from: "DXB", to: "JFK", fromCity: "Dubai", toCity: "New York", country: "United States", region: "North America", popularity: 85, averagePrice: 900, keywords: ["flights from dubai to new york", "dxb to jfk flights", "uae to usa"] },
  { from: "DOH", to: "JFK", fromCity: "Doha", toCity: "New York", country: "United States", region: "North America", popularity: 75, averagePrice: 950, keywords: ["flights from doha to new york", "doh to jfk flights", "qatar to usa"] },
  { from: "DXB", to: "LHR", fromCity: "Dubai", toCity: "London", country: "United Kingdom", region: "Europe", popularity: 90, averagePrice: 500, keywords: ["flights from dubai to london", "dxb to lhr flights", "uae to uk"] },

  // Asian Routes
  { from: "NRT", to: "LAX", fromCity: "Tokyo", toCity: "Los Angeles", country: "United States", region: "North America", popularity: 90, averagePrice: 800, keywords: ["flights from tokyo to los angeles", "nrt to lax flights", "japan to usa"] },
  { from: "HKG", to: "JFK", fromCity: "Hong Kong", toCity: "New York", country: "United States", region: "North America", popularity: 80, averagePrice: 1000, keywords: ["flights from hong kong to new york", "hkg to jfk flights", "hong kong to usa"] },
  { from: "SIN", to: "JFK", fromCity: "Singapore", toCity: "New York", country: "United States", region: "North America", popularity: 75, averagePrice: 1100, keywords: ["flights from singapore to new york", "sin to jfk flights", "singapore to usa"] },

  // Canadian Routes
  { from: "YYZ", to: "JFK", fromCity: "Toronto", toCity: "New York", country: "United States", region: "North America", popularity: 85, averagePrice: 300, keywords: ["flights from toronto to new york", "yyz to jfk flights", "canada to usa"] },
  { from: "YVR", to: "LAX", fromCity: "Vancouver", toCity: "Los Angeles", country: "United States", region: "North America", popularity: 80, averagePrice: 350, keywords: ["flights from vancouver to los angeles", "yvr to lax flights", "canada to california"] }
];

// Popular cheap flight destinations
export const cheapFlightDestinations: CheapFlightDestination[] = [
  { destination: "paris", city: "Paris", country: "France", region: "Europe", popularFromCities: ["New York", "Los Angeles", "Chicago", "Miami"], averagePrice: 650, keywords: ["cheap flights to paris", "paris flight deals", "discount flights paris"] },
  { destination: "london", city: "London", country: "United Kingdom", region: "Europe", popularFromCities: ["New York", "Los Angeles", "Boston", "Chicago"], averagePrice: 600, keywords: ["cheap flights to london", "london flight deals", "discount flights london"] },
  { destination: "tokyo", city: "Tokyo", country: "Japan", region: "Asia", popularFromCities: ["Los Angeles", "San Francisco", "Seattle", "New York"], averagePrice: 800, keywords: ["cheap flights to tokyo", "tokyo flight deals", "discount flights japan"] },
  { destination: "dubai", city: "Dubai", country: "UAE", region: "Middle East", popularFromCities: ["New York", "Los Angeles", "London", "Nairobi"], averagePrice: 700, keywords: ["cheap flights to dubai", "dubai flight deals", "discount flights uae"] },
  { destination: "rome", city: "Rome", country: "Italy", region: "Europe", popularFromCities: ["New York", "Chicago", "Boston", "Miami"], averagePrice: 700, keywords: ["cheap flights to rome", "rome flight deals", "discount flights italy"] },
  { destination: "barcelona", city: "Barcelona", country: "Spain", region: "Europe", popularFromCities: ["New York", "Miami", "Los Angeles", "Boston"], averagePrice: 600, keywords: ["cheap flights to barcelona", "barcelona flight deals", "discount flights spain"] },
  { destination: "amsterdam", city: "Amsterdam", country: "Netherlands", region: "Europe", popularFromCities: ["New York", "Chicago", "Los Angeles", "Boston"], averagePrice: 620, keywords: ["cheap flights to amsterdam", "amsterdam flight deals", "discount flights netherlands"] },
  { destination: "istanbul", city: "Istanbul", country: "Turkey", region: "Europe", popularFromCities: ["New York", "Los Angeles", "Chicago", "Miami"], averagePrice: 650, keywords: ["cheap flights to istanbul", "istanbul flight deals", "discount flights turkey"] },
  { destination: "bangkok", city: "Bangkok", country: "Thailand", region: "Asia", popularFromCities: ["Los Angeles", "San Francisco", "New York", "Seattle"], averagePrice: 900, keywords: ["cheap flights to bangkok", "bangkok flight deals", "discount flights thailand"] },
  { destination: "singapore", city: "Singapore", country: "Singapore", region: "Asia", popularFromCities: ["Los Angeles", "San Francisco", "New York", "Chicago"], averagePrice: 1000, keywords: ["cheap flights to singapore", "singapore flight deals", "discount flights singapore"] }
];

// Generate SEO metadata for flight routes
export function generateFlightRouteMetadata(route: FlightRoute) {
  return {
    title: `Cheap Flights from ${route.fromCity} to ${route.toCity} | Compare & Book | TravalSearch`,
    description: `Find and book cheap flights from ${route.fromCity} (${route.from}) to ${route.toCity} (${route.to}). Compare prices from multiple airlines and save up to 40%. Book now with TravalSearch.`,
    canonicalUrl: `https://travalsearch.com/flights-from-${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`,
    keywords: route.keywords.join(', '),
    ogImage: `https://travalsearch.com/og/flights-${route.from.toLowerCase()}-${route.to.toLowerCase()}.jpg`
  };
}

// Generate SEO metadata for cheap flight destinations
export function generateCheapFlightMetadata(destination: CheapFlightDestination) {
  return {
    title: `Cheap Flights to ${destination.city} | Best Deals & Discounts | TravalSearch`,
    description: `Find the cheapest flights to ${destination.city}, ${destination.country}. Compare prices from ${destination.popularFromCities.join(', ')} and more. Save up to 50% on flight bookings.`,
    canonicalUrl: `https://travalsearch.com/cheap-flights-to-${destination.destination}`,
    keywords: destination.keywords.join(', '),
    ogImage: `https://travalsearch.com/og/cheap-flights-${destination.destination}.jpg`
  };
}

// Generate FAQ content for flight routes
export function generateFlightRouteFAQs(route: FlightRoute) {
  return [
    {
      question: `How long is the flight from ${route.fromCity} to ${route.toCity}?`,
      answer: `Direct flights from ${route.from} to ${route.to} typically take between 5-15 hours depending on the route. Connecting flights may take longer based on layover duration.`
    },
    {
      question: `What airlines fly from ${route.fromCity} to ${route.toCity}?`,
      answer: `Major airlines operating this route include American Airlines, Delta, United, and various international carriers. Use our search to compare all available options.`
    },
    {
      question: `When is the cheapest time to fly from ${route.fromCity} to ${route.toCity}?`,
      answer: `Generally, booking 6-8 weeks in advance offers the best prices. Flying on Tuesday or Wednesday often provides lower fares than weekend departures.`
    },
    {
      question: `What is the average price for flights from ${route.fromCity} to ${route.toCity}?`,
      answer: `Average prices range from $${route.averagePrice - 100} to $${route.averagePrice + 200} depending on the season and booking time. Use our price alerts to track deals.`
    },
    {
      question: `Are there direct flights from ${route.fromCity} to ${route.toCity}?`,
      answer: `Yes, several airlines offer direct flights on this route. Our search will show you both direct and connecting flight options with clear duration information.`
    }
  ];
}

// Generate travel tips for destinations
export function generateTravelTips(route: FlightRoute) {
  const tips = [
    `Book your ${route.fromCity} to ${route.toCity} flight 6-8 weeks in advance for the best deals`,
    `Consider flying on Tuesday or Wednesday for lower fares`,
    `Use price comparison tools to find the cheapest options`,
    `Sign up for price alerts to track fare changes`,
    `Check both direct and connecting flights for savings`,
    `Consider nearby airports for potentially cheaper options`,
    `Book during off-peak seasons for significant savings`,
    `Clear your browser cookies before booking to avoid price increases`,
    `Consider booking one-way tickets separately for better deals`,
    `Use flexible date search to find the cheapest travel dates`
  ];

  return tips.slice(0, 5); // Return 5 random tips
}

export function generateBlogPostTopics() {
  return [
    {
      title: "Best Time to Fly from LAX to JFK (and Save Money)",
      slug: "best-time-fly-lax-jfk-save-money",
      category: "Flight Tips",
      keywords: ["lax to jfk", "best time to fly", "cheap flights", "save money flights"],
      metaDescription: "Discover the best times to book flights from LAX to JFK and save up to 40% on your travel costs. Expert tips for finding cheap flights."
    },
    {
      title: "How to Find Direct Flights to Europe Under $500",
      slug: "find-direct-flights-europe-under-500",
      category: "Travel Deals",
      keywords: ["cheap flights europe", "direct flights", "flight deals", "budget travel"],
      metaDescription: "Learn insider secrets to finding direct flights to Europe for under $500. Complete guide with booking strategies and best airlines."
    },
    {
      title: "LAX vs Burbank: Which Airport is Cheaper for Flights?",
      slug: "lax-vs-burbank-airport-cheaper-flights",
      category: "Airport Guides",
      keywords: ["lax vs burbank", "cheaper airport", "los angeles airports", "flight comparison"],
      metaDescription: "Compare LAX and Burbank airports for flight prices, convenience, and overall value. Find out which airport saves you more money."
    },
    {
      title: "Ultimate Guide to Booking Flights from Africa to USA",
      slug: "booking-flights-africa-usa-guide",
      category: "International Travel",
      keywords: ["flights africa usa", "international flights", "long haul flights", "visa requirements"],
      metaDescription: "Complete guide to booking flights from Africa to USA. Tips on visas, best routes, airlines, and saving money on international travel."
    },
    {
      title: "Best Days to Book International Flights in 2025",
      slug: "best-days-book-international-flights-2025",
      category: "Booking Tips",
      keywords: ["when to book flights", "international flights", "flight booking tips", "cheap airfare"],
      metaDescription: "Discover the best days and times to book international flights in 2025. Data-driven insights to help you save hundreds on airfare."
    }
  ];
}