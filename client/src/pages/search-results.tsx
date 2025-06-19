import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plane, Clock, MapPin, Users, Calendar, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FlightOffer {
  id: string;
  total_amount: string;
  original_amount?: string;
  total_currency: string;
  markup_applied?: boolean;
  slices: Array<{
    origin: { iata_code: string; name: string };
    destination: { iata_code: string; name: string };
    departure_datetime: string;
    arrival_datetime: string;
    duration: string;
    segments: Array<{
      origin: { iata_code: string; name: string };
      destination: { iata_code: string; name: string };
      departing_at: string;
      arriving_at: string;
      marketing_carrier: { iata_code: string; name: string };
      flight_number: string;
      aircraft: { name: string };
    }>;
  }>;
}

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<any>(null);

  useEffect(() => {
    // Get search params from localStorage or URL params
    const storedParams = localStorage.getItem('flightSearchParams');
    if (storedParams) {
      setSearchParams(JSON.parse(storedParams));
    }
  }, []);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['/api/flight-search', searchParams],
    queryFn: () => searchParams ? apiRequest('POST', '/api/flight-search', searchParams) : null,
    enabled: !!searchParams,
  });

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (duration: string) => {
    // Convert PT4H15M to "4h 15m"
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  const handleSelectFlight = (offer: FlightOffer) => {
    // Store selected offer and navigate to checkout
    localStorage.setItem('selectedOffer', JSON.stringify(offer));
    setLocation('/checkout');
  };

  if (!searchParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No search results</h2>
          <Button onClick={() => setLocation('/flights')}>Search Flights</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Searching flights...</h2>
          <p className="text-gray-600">Finding the best deals for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h2>
          <p className="text-gray-600 mb-4">Unable to search flights. Please try again.</p>
          <Button onClick={() => setLocation('/flights')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const offers = searchResults?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Flight Results</h1>
          {searchParams && (
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{searchParams.origin} → {searchParams.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{searchParams.departure_date}</span>
                {searchParams.return_date && <span>- {searchParams.return_date}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{searchParams.adults} adult{searchParams.adults > 1 ? 's' : ''}</span>
                {searchParams.children > 0 && <span>, {searchParams.children} child{searchParams.children > 1 ? 'ren' : ''}</span>}
                {searchParams.infants > 0 && <span>, {searchParams.infants} infant{searchParams.infants > 1 ? 's' : ''}</span>}
              </div>
            </div>
          )}
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No flights found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <Button onClick={() => setLocation('/flights')}>Modify Search</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {offers.map((offer: FlightOffer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {offer.slices.map((slice, sliceIndex) => (
                    <div key={sliceIndex} className={sliceIndex > 0 ? "mt-6 pt-6 border-t" : ""}>
                      {slice.segments.map((segment, segmentIndex) => (
                        <div key={segmentIndex} className={segmentIndex > 0 ? "mt-4" : ""}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 flex-1">
                              {/* Departure */}
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatTime(segment.departing_at)}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                  {segment.origin.iata_code}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(segment.departing_at)}
                                </div>
                              </div>

                              {/* Flight Info */}
                              <div className="flex-1 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                  <div className="flex-1 h-0.5 bg-gray-300 relative">
                                    <Plane className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                                  </div>
                                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                </div>
                                <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatDuration(slice.duration)}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {segment.marketing_carrier.name} {segment.flight_number}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {segment.aircraft.name}
                                </div>
                              </div>

                              {/* Arrival */}
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatTime(segment.arriving_at)}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                  {segment.destination.iata_code}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(segment.arriving_at)}
                                </div>
                              </div>
                            </div>

                            {/* Price and Select Button */}
                            {segmentIndex === slice.segments.length - 1 && (
                              <div className="text-right ml-8">
                                <div className="mb-4">
                                  {offer.markup_applied && offer.original_amount && (
                                    <div className="text-sm text-gray-500 line-through">
                                      ${offer.original_amount}
                                    </div>
                                  )}
                                  <div className="text-3xl font-bold text-gray-900">
                                    ${offer.total_amount}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    per person
                                  </div>
                                  {offer.markup_applied && (
                                    <Badge variant="secondary" className="mt-1">
                                      Best Price
                                    </Badge>
                                  )}
                                </div>
                                <Button 
                                  onClick={() => handleSelectFlight(offer)}
                                  className="w-full"
                                >
                                  Select Flight
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modify Search */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setLocation('/flights')}>
            Modify Search
          </Button>
        </div>
      </div>
    </div>
  );
}