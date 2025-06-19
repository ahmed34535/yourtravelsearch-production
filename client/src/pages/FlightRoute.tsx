import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, MapPin, TrendingDown, Shield, Headphones } from "lucide-react";
import { generateFlightRouteSchema } from "../../../server/sitemapGenerator";

export default function FlightRoute() {
  const [, params] = useRoute("/flights-from-:from-to-:to");
  const from = (params as any)?.from?.toUpperCase() || "";
  const to = (params as any)?.to?.toUpperCase() || "";

  // Airport data mapping for display
  const airportData: Record<string, { city: string; country: string; name: string }> = {
    LAX: { city: "Los Angeles", country: "United States", name: "Los Angeles International Airport" },
    JFK: { city: "New York", country: "United States", name: "John F. Kennedy International Airport" },
    LHR: { city: "London", country: "United Kingdom", name: "Heathrow Airport" },
    CDG: { city: "Paris", country: "France", name: "Charles de Gaulle Airport" },
    FRA: { city: "Frankfurt", country: "Germany", name: "Frankfurt Airport" },
    FCO: { city: "Rome", country: "Italy", name: "Leonardo da Vinci Airport" },
    MAD: { city: "Madrid", country: "Spain", name: "Madrid-Barajas Airport" },
    AMS: { city: "Amsterdam", country: "Netherlands", name: "Amsterdam Schiphol Airport" },
    NRT: { city: "Tokyo", country: "Japan", name: "Narita International Airport" },
    DXB: { city: "Dubai", country: "UAE", name: "Dubai International Airport" },
    SIN: { city: "Singapore", country: "Singapore", name: "Singapore Changi Airport" },
    HKG: { city: "Hong Kong", country: "Hong Kong", name: "Hong Kong International Airport" },
    SFO: { city: "San Francisco", country: "United States", name: "San Francisco International Airport" },
    ORD: { city: "Chicago", country: "United States", name: "O'Hare International Airport" },
    DFW: { city: "Dallas", country: "United States", name: "Dallas/Fort Worth International Airport" },
    ATL: { city: "Atlanta", country: "United States", name: "Hartsfield-Jackson Atlanta International Airport" },
    MIA: { city: "Miami", country: "United States", name: "Miami International Airport" },
    LAS: { city: "Las Vegas", country: "United States", name: "McCarran International Airport" },
    BCN: { city: "Barcelona", country: "Spain", name: "Barcelona–El Prat Airport" }
  };

  const fromAirport = airportData[from];
  const toAirport = airportData[to];

  // Live flight search
  const { data: flightData, isLoading } = useQuery({
    queryKey: ['/api/flight-search', from, to],
    enabled: !!from && !!to && !!fromAirport && !!toAirport,
  });

  if (!fromAirport || !toAirport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Route Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The flight route {from} to {to} is not available. Please try a different route.
            </p>
            <Button onClick={() => window.location.href = '/flights'}>
              Search Flights
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const routeName = `${fromAirport.city} to ${toAirport.city}`;
  const structuredData = generateFlightRouteSchema(from, to, fromAirport.city, toAirport.city);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SEOHead
        title={`Cheap Flights from ${fromAirport.city} to ${toAirport.city} | TravalSearch`}
        description={`Find and book cheap flights from ${fromAirport.city} (${from}) to ${toAirport.city} (${to}). Compare prices from multiple airlines and save with TravalSearch.`}
        canonicalUrl={`https://travalsearch.com/flights-from-${from.toLowerCase()}-to-${to.toLowerCase()}`}
        structuredData={structuredData}
        ogImage={`https://travalsearch.com/og/flight-route-${from.toLowerCase()}-${to.toLowerCase()}.jpg`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Flights from {fromAirport.city} to {toAirport.city}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Compare and book cheap flights from {from} to {to} with TravalSearch
          </p>
          
          {/* Route Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Departure: {fromAirport.city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">{fromAirport.name}</p>
                <p className="text-sm text-gray-500">{fromAirport.country}</p>
                <Badge variant="secondary" className="mt-2">{from}</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Arrival: {toAirport.city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">{toAirport.name}</p>
                <p className="text-sm text-gray-500">{toAirport.country}</p>
                <Badge variant="secondary" className="mt-2">{to}</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Flight Results */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Searching live flights...</p>
          </div>
        )}

        {(flightData as any)?.data && (flightData as any).data.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Available Flights ({(flightData as any).data.length} options found)
            </h2>
            <div className="grid gap-4">
              {(flightData as any).data.slice(0, 3).map((flight: any) => (
                <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img 
                          src={flight.owner?.logo_symbol_url} 
                          alt={flight.owner?.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <p className="font-semibold text-lg">{flight.owner?.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {flight.slices?.[0]?.duration || 'Duration varies'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {flight.total_currency} {flight.total_amount}
                        </p>
                        <Button className="mt-2">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Route Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Flight Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Typical flight time from {fromAirport.city} to {toAirport.city} ranges from 5-15 hours depending on connections.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                Best Time to Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Book 6-8 weeks in advance for the best deals on {routeName} flights. Tuesday and Wednesday departures are often cheaper.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-purple-600" />
                Popular Airlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Major airlines operating {routeName} routes include American Airlines, Delta, United, and international carriers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose TravalSearch */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Choose TravalSearch for {routeName} Flights?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <TrendingDown className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We compare prices from hundreds of airlines to ensure you get the lowest fare for {routeName} flights.
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your payment and personal information are protected with enterprise-grade security.
              </p>
            </div>
            <div className="text-center">
              <Headphones className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our customer support team is available around the clock to help with your {routeName} travel.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions - {routeName} Flights
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long is the flight from {fromAirport.city} to {toAirport.city}?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Direct flights from {from} to {to} typically take 5-15 hours. Connecting flights may take longer depending on layover duration.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What airlines fly from {fromAirport.city} to {toAirport.city}?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Major airlines operating this route include American Airlines, Delta, United, and various international carriers depending on the specific route.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">When is the cheapest time to fly from {fromAirport.city} to {toAirport.city}?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Generally, booking 6-8 weeks in advance offers the best prices. Flying on Tuesday or Wednesday often provides lower fares than weekend departures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your {routeName} Flight?</h2>
          <p className="text-xl mb-8">
            Search and compare flights now to find the best deals for your travel dates.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => window.location.href = '/flights'}
          >
            Search Flights Now
          </Button>
        </div>
      </div>
    </div>
  );
}