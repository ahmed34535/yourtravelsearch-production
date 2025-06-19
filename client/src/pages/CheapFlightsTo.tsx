import { useParams } from 'wouter';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import FlightSearch from '@/components/search/flight-search';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MapPin, Star, Globe, Calendar } from 'lucide-react';
import { popularDestinations } from '@/utils/seoHelpers';

interface DestinationInfo {
  city: string;
  country: string;
  code: string;
  slug: string;
}

export default function CheapFlightsTo() {
  const { destination } = useParams();
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo | null>(null);

  useEffect(() => {
    const found = popularDestinations.find(d => d.slug === `cheap-flights-to-${destination}`);
    if (found) {
      setDestinationInfo(found);
    }
  }, [destination]);

  if (!destinationInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Destination Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">The requested destination could not be found.</p>
        </div>
      </div>
    );
  }

  const title = `Cheap Flights to ${destinationInfo.city}, ${destinationInfo.country} | TravalSearch`;
  const description = `Find and book cheap flights to ${destinationInfo.city}. Compare prices from major airlines and save on your trip to ${destinationInfo.country}. Best deals guaranteed.`;
  const canonical = `https://travalsearch.com/cheap-flights-to-${destination}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    "target": {
      "@type": "Place",
      "name": `${destinationInfo.city}, ${destinationInfo.country}`,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": destinationInfo.country
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "TravalSearch",
      "url": "https://travalsearch.com"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SEOHead
        title={title}
        description={description}
        canonicalUrl={canonical}
        structuredData={structuredData}
        ogImage="https://yourtravelsearch.com/og-destination.jpg"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cheap Flights to {destinationInfo.city}
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Discover the best flight deals to {destinationInfo.city}, {destinationInfo.country}
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <Globe className="w-5 h-5" />
              <span>{destinationInfo.country}</span>
              <MapPin className="w-5 h-5" />
              <span>{destinationInfo.city} ({destinationInfo.code})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Search Widget */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="w-5 h-5 text-blue-600" />
              <span>Search Flights to {destinationInfo.city}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FlightSearch />
          </CardContent>
        </Card>

        {/* Destination Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>About {destinationInfo.city}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold">{destinationInfo.city}, {destinationInfo.country}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Destination</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Plane className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Airport Code: {destinationInfo.code}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Main Airport</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-semibold">Best Time to Visit</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getBestTimeToVisit(destinationInfo.city)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Routes to {destinationInfo.city}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getPopularRoutesToDestination(destinationInfo.code).map((route, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <Plane className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{route.from} → {destinationInfo.city}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{route.duration}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Travel Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Travel Tips for {destinationInfo.city}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                When is the best time to book flights to {destinationInfo.city}?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                For the best deals to {destinationInfo.city}, book your flights 2-3 months in advance for international routes. Tuesday and Wednesday departures typically offer the lowest prices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                How to find cheap flights to {destinationInfo.city}?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use our flexible date search, compare multiple airlines, and consider flying on weekdays. Sign up for price alerts to track deals to {destinationInfo.city}.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What airlines fly to {destinationInfo.city}?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Multiple airlines operate flights to {destinationInfo.city} including major international carriers and budget airlines. Compare all options using our search tool above.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose TravalSearch */}
        <Card>
          <CardHeader>
            <CardTitle>Why Book with YourTravelSearch?</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Best price guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Live pricing updates</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getBestTimeToVisit(city: string): string {
  const bestTimes: Record<string, string> = {
    'London': 'May to September',
    'Dubai': 'November to March',
    'Tokyo': 'March to May, September to November',
    'Paris': 'April to June, September to October'
  };
  return bestTimes[city] || 'Year round';
}

function getPopularRoutesToDestination(destinationCode: string) {
  const routes: Record<string, Array<{from: string, duration: string}>> = {
    'LHR': [
      { from: 'New York (JFK)', duration: '7h 15m' },
      { from: 'Los Angeles (LAX)', duration: '11h 20m' },
      { from: 'Chicago (ORD)', duration: '8h 30m' },
      { from: 'Miami (MIA)', duration: '8h 45m' }
    ],
    'DXB': [
      { from: 'New York (JFK)', duration: '12h 30m' },
      { from: 'Los Angeles (LAX)', duration: '16h 20m' },
      { from: 'London (LHR)', duration: '7h 15m' },
      { from: 'Frankfurt (FRA)', duration: '6h 30m' }
    ],
    'NRT': [
      { from: 'San Francisco (SFO)', duration: '11h 15m' },
      { from: 'Los Angeles (LAX)', duration: '11h 30m' },
      { from: 'New York (JFK)', duration: '14h 20m' },
      { from: 'Chicago (ORD)', duration: '13h 15m' }
    ],
    'CDG': [
      { from: 'New York (JFK)', duration: '7h 30m' },
      { from: 'Los Angeles (LAX)', duration: '11h 40m' },
      { from: 'Chicago (ORD)', duration: '8h 45m' },
      { from: 'Miami (MIA)', duration: '8h 50m' }
    ]
  };
  
  return routes[destinationCode] || [
    { from: 'New York', duration: '8h 00m' },
    { from: 'Los Angeles', duration: '12h 00m' },
    { from: 'Chicago', duration: '9h 00m' }
  ];
}