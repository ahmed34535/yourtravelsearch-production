// SEO utility functions for flight search engine optimization

export interface FlightRouteData {
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  price?: number;
  currency?: string;
  airline?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
}

export function generateFlightStructuredData(flightData: FlightRouteData) {
  const baseStructure = {
    "@context": "https://schema.org",
    "@type": "Flight",
    "departureAirport": {
      "@type": "Airport",
      "name": flightData.origin,
      "iataCode": flightData.originCode
    },
    "arrivalAirport": {
      "@type": "Airport", 
      "name": flightData.destination,
      "iataCode": flightData.destinationCode
    }
  };

  // Add optional flight details if available
  const enrichedStructure: any = { ...baseStructure };

  if (flightData.airline) {
    enrichedStructure.airline = {
      "@type": "Airline",
      "name": flightData.airline
    };
  }

  if (flightData.departureTime) {
    enrichedStructure.departureTime = flightData.departureTime;
  }

  if (flightData.arrivalTime) {
    enrichedStructure.arrivalTime = flightData.arrivalTime;
  }

  if (flightData.price && flightData.currency) {
    enrichedStructure.offers = {
      "@type": "Offer",
      "price": flightData.price.toString(),
      "priceCurrency": flightData.currency,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "TravalSearch"
      }
    };
  }

  return enrichedStructure;
}

export function generateAggregateOfferStructuredData(routeData: FlightRouteData, offers: Array<{price: number, airline: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "lowPrice": Math.min(...offers.map(o => o.price)),
    "highPrice": Math.max(...offers.map(o => o.price)),
    "priceCurrency": routeData.currency || "USD",
    "offerCount": offers.length,
    "offers": offers.map(offer => ({
      "@type": "Offer",
      "price": offer.price.toString(),
      "priceCurrency": routeData.currency || "USD",
      "seller": {
        "@type": "Organization", 
        "name": offer.airline
      }
    }))
  };
}

export function generateFlightPageTitle(origin: string, destination: string, originCode: string, destinationCode: string): string {
  return `Cheap Flights from ${origin} (${originCode}) to ${destination} (${destinationCode}) | TravalSearch`;
}

export function generateFlightPageDescription(origin: string, destination: string, originCode: string, destinationCode: string, startingPrice?: number): string {
  const baseDescription = `Find and book cheap flights from ${origin} to ${destination}. Compare prices from major airlines and save on your ${originCode} to ${destinationCode} flight.`;
  
  if (startingPrice) {
    return `${baseDescription} Flights starting from $${startingPrice}.`;
  }
  
  return baseDescription;
}

export const popularFlightRoutes = [
  {
    origin: "Los Angeles",
    destination: "New York", 
    originCode: "LAX",
    destinationCode: "JFK",
    slug: "lax-to-jfk"
  },
  {
    origin: "Los Angeles",
    destination: "London",
    originCode: "LAX", 
    destinationCode: "LHR",
    slug: "lax-to-lhr"
  },
  {
    origin: "New York",
    destination: "London",
    originCode: "JFK",
    destinationCode: "LHR", 
    slug: "jfk-to-lhr"
  },
  {
    origin: "Chicago",
    destination: "Los Angeles",
    originCode: "ORD",
    destinationCode: "LAX",
    slug: "ord-to-lax"
  },
  {
    origin: "Miami",
    destination: "London", 
    originCode: "MIA",
    destinationCode: "LHR",
    slug: "mia-to-lhr"
  },
  {
    origin: "San Francisco",
    destination: "Tokyo",
    originCode: "SFO",
    destinationCode: "NRT",
    slug: "sfo-to-nrt"
  },
  {
    origin: "Los Angeles", 
    destination: "Paris",
    originCode: "LAX",
    destinationCode: "CDG",
    slug: "lax-to-cdg"
  },
  {
    origin: "Dallas",
    destination: "Frankfurt",
    originCode: "DFW", 
    destinationCode: "FRA",
    slug: "dfw-to-fra"
  }
];

export const popularDestinations = [
  {
    city: "London",
    country: "United Kingdom",
    code: "LHR",
    slug: "cheap-flights-to-london"
  },
  {
    city: "Dubai", 
    country: "United Arab Emirates",
    code: "DXB",
    slug: "cheap-flights-to-dubai"
  },
  {
    city: "Tokyo",
    country: "Japan",
    code: "NRT",
    slug: "cheap-flights-to-tokyo"
  },
  {
    city: "Paris",
    country: "France", 
    code: "CDG",
    slug: "cheap-flights-to-paris"
  }
];