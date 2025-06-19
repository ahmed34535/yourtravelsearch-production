import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plane, Clock, MapPin, Info, Luggage, CreditCard, Shield, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';


interface FlightOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  base_amount?: string;
  markup_amount?: string;
  owner?: {
    name: string;
    iata_code: string;
  };
  slices: Array<{
    id: string;
    origin: { 
      iata_code: string; 
      name: string;
      city_name?: string;
    };
    destination: { 
      iata_code: string; 
      name: string;
      city_name?: string;
    };
    departure_datetime?: string;
    arrival_datetime?: string;
    duration: string;
    segments: Array<{
      id: string;
      origin: { iata_code: string; name: string };
      destination: { iata_code: string; name: string };
      departing_at: string;
      arriving_at: string;
      marketing_carrier: { 
        iata_code: string; 
        name: string;
      };
      flight_number?: string;
      aircraft?: { name?: string };
    }>;
  }>;
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: { adults: number; children: number; infants: number };
  cabinClass: string;
}

export default function FlightResults() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Parse search parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check if this is a flight deal view
  const dealId = urlParams.get('dealId');
  const isDealView = !!dealId;
  
  const searchData: FlightSearchParams = {
    origin: urlParams.get('origin') || '',
    destination: urlParams.get('destination') || '',
    departureDate: urlParams.get('departureDate') || '',
    returnDate: urlParams.get('returnDate') || '',
    passengers: {
      adults: parseInt(urlParams.get('adults') || '1'),
      children: parseInt(urlParams.get('children') || '0'),
      infants: parseInt(urlParams.get('infants') || '0')
    },
    cabinClass: urlParams.get('cabin_class') || 'economy'
  };

  // Deal data from URL parameters
  const dealData = isDealView ? {
    id: dealId,
    airline: urlParams.get('airline') || '',
    price: parseFloat(urlParams.get('price') || '0'),
    departureTime: urlParams.get('departureTime') || '',
    arrivalTime: urlParams.get('arrivalTime') || '',
    duration: urlParams.get('duration') || ''
  } : null;

  console.log("Flight Results - URL params:", Object.fromEntries(urlParams.entries()));
  console.log("[Flight Results] Component loaded with searchData:", searchData);
  console.log("[Flight Results] Query enabled?", !!(searchData.origin && searchData.destination && searchData.departureDate));

  // Fetch flight search results
  const { data: searchResult, isLoading, error, status } = useQuery({
    queryKey: ['/api/flight-search', searchData],
    queryFn: async () => {
      const response = await fetch('/api/flight-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: searchData.origin,
          destination: searchData.destination,
          departure_date: searchData.departureDate,
          return_date: searchData.returnDate,
          passengers: {
            adults: searchData.passengers.adults,
            children: searchData.passengers.children,
            infants: searchData.passengers.infants
          },
          cabin_class: searchData.cabinClass
        })
      });

      if (!response.ok) {
        console.error("[Flight Results] API error:", response.status, response.statusText);
        throw new Error(`Flight search failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("[Flight Results] API response received:", {
        hasData: !!result?.data,
        flightCount: result?.data?.length || 0,
        firstFlightId: result?.data?.[0]?.id || 'none',
        firstFlightPrice: result?.data?.[0]?.total_amount || 'none'
      });
      return result;
    },
    enabled: !!(searchData.origin && searchData.destination && searchData.departureDate),
    retry: 2,
    retryDelay: 1000
  });

  const flightOffers = searchResult?.data || [];
  
  console.log("[Flight Results] React Query status:", { status, isLoading, hasData: !!searchResult, hasError: !!error });
  console.log("[Flight Results] Raw searchResult:", searchResult);
  console.log("[Flight Results] Extracted flightOffers:", flightOffers);
  console.log("[Flight Results] Flight display check:", { 
    flightCount: flightOffers.length,
    willShowResults: !isLoading && !error && flightOffers.length > 0,
    samplePrice: flightOffers[0]?.total_amount ? `${flightOffers[0].total_currency} ${flightOffers[0].total_amount}` : 'none',
    conditionCheck: {
      isLoading,
      hasError: !!error,
      hasFlights: flightOffers.length > 0,
      searchResultStructure: Object.keys(searchResult || {})
    }
  });

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  const handleBookFlight = (offer: FlightOffer) => {
    // Check if user is authenticated before allowing booking
    if (!isAuthenticated) {
      // Store the flight details in localStorage for after authentication
      const bookingData = {
        offerId: offer.id,
        price: offer.total_amount,
        currency: offer.total_currency,
        returnUrl: `/booking?offerId=${offer.id}&price=${offer.total_amount}&currency=${offer.total_currency}`
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Redirect to login page with message about signing up to book
      setLocation('/login?message=signup-to-book');
      return;
    }
    
    // User is authenticated, proceed to passenger information step
    const passengerParams = new URLSearchParams({
      offerId: offer.id,
      price: offer.total_amount,
      currency: offer.total_currency,
      type: 'flight'
    });
    setLocation(`/passenger-details?${passengerParams.toString()}`);
  };

  const handleHoldFlight = async (offer: any) => {
    if (!user) {
      // Store the selected offer for hold order after login
      const holdData = {
        type: 'hold',
        offerId: offer.id,
        price: offer.total_amount,
        currency: offer.total_currency,
        returnUrl: `/hold-confirmation?offer_id=${offer.id}`
      };
      localStorage.setItem('pendingHoldOrder', JSON.stringify(holdData));
      
      // Redirect to login page with message about signing up to hold
      setLocation('/login?message=signup-to-hold');
      return;
    }

    try {
      // Create 24-hour hold order
      const holdOrder = await apiRequest('POST', '/api/hold-orders', {
        offer_id: offer.id,
        passengers: [{
          given_name: user.firstName,
          family_name: user.lastName,
          title: 'mr',
          born_on: '1990-01-01',
          email: user.email
        }],
        payment_method: 'hold'
      });

      // Store hold order details
      localStorage.setItem('holdOrder', JSON.stringify(holdOrder));
      
      // Navigate to hold order confirmation
      setLocation(`/hold-confirmation?hold_id=${holdOrder.data.id}`);
    } catch (error) {
      console.error('Failed to create hold order:', error);
      alert('Failed to create hold order. Please try again.');
    }
  };

  const handleViewPolicies = (offer: any) => {
    // Store the selected offer for policy viewing
    localStorage.setItem('selectedOfferForPolicies', JSON.stringify(offer));
    setLocation(`/policies?offer_id=${offer.id}`);
  };
  
  // If this is a deal view, show deal details instead of searching
  if (isDealView && dealData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Flight Deal Details</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {searchData.origin} → {searchData.destination}
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{dealData.airline}</span>
                <Badge variant="destructive">Limited Time Deal</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{dealData.departureTime}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{searchData.origin}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{dealData.duration}</div>
                  <div className="text-xs text-green-600">Direct Flight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{dealData.arrivalTime}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{searchData.destination}</div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">${dealData.price}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">per person</div>
                </div>
                <div className="space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/flights')}
                  >
                    Search More Flights
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const offerId = `deal_${dealData.id}`;
                      window.location.href = `/booking?offerId=${offerId}&price=${dealData.price}&currency=USD`;
                    }}
                  >
                    Book This Deal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          

        </div>
      </div>
    );
  }

  // Show loading while query is pending or when no search result yet
  if (isLoading || !searchResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    const isGeographicLimitation = error.message?.includes('requires additional API credentials') || 
                                   error.message?.includes('primarily covers US, Canada, and major European routes');
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">
                {isGeographicLimitation ? 'Route Not Available' : 'Search Error'}
              </h2>
              
              {isGeographicLimitation ? (
                <div className="space-y-4 text-left">
                  <p className="text-gray-700 text-center mb-4">
                    This route requires additional flight data providers. Currently supported regions:
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-3 text-center">Available Flight Routes</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-700">
                      <div>
                        <strong>North America:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>United States domestic flights</li>
                          <li>US ↔ Canada routes</li>
                        </ul>
                      </div>
                      <div>
                        <strong>International:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>US ↔ Europe routes</li>
                          <li>Canada ↔ Europe routes</li>
                          <li>Major European routes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm text-center">
                    For routes to Asia, Africa, South America, or other regions, please contact support to enable additional flight data providers.
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">Unable to search for flights. Please try again.</p>
              )}
              
              <Button onClick={() => setLocation('/')} className="mt-6">
                Back to Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show no results only if we have a successful response with empty array
  if (!isLoading && !error && searchResult && flightOffers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Flight Results</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{searchData.origin} → {searchData.destination}</span>
            <span>{new Date(searchData.departureDate).toLocaleDateString()}</span>
            <span>1 adult</span>
          </div>
        </div>
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No flights found</p>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your search criteria</p>
            <Button onClick={() => setLocation('/')}>
              Modify Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPassengers = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants;

  // Debug display conditions
  console.log("[Flight Results] Final render check:", {
    hasSearchResult: !!searchResult,
    flightOffersCount: flightOffers.length,
    willRenderFlights: !isLoading && !error && searchResult && flightOffers.length > 0,
    renderConditions: {
      notLoading: !isLoading,
      noError: !error, 
      hasSearchResult: !!searchResult,
      hasFlights: flightOffers.length > 0
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Flight Results</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{searchData.origin} → {searchData.destination}</span>
          <span>{new Date(searchData.departureDate).toLocaleDateString()}</span>
          <span>{totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}</span>
          <Badge variant="secondary" className="capitalize">{searchData.cabinClass}</Badge>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          Found {flightOffers.length} flights available
        </p>
      </div>

      <div className="space-y-4">
        {flightOffers.map((offer: FlightOffer, index: number) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                {/* Flight Information */}
                <div className="flex-1">
                  {offer.slices.map((slice, sliceIndex) => (
                    <div key={slice.id} className="mb-4 last:mb-0">
                      {/* Route Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {slice.origin.iata_code} → {slice.destination.iata_code}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {slice.segments.length === 1 ? 'Direct' : `${slice.segments.length - 1} stop${slice.segments.length > 2 ? 's' : ''}`}
                        </Badge>
                      </div>

                      {/* Segments */}
                      <div className="space-y-2">
                        {slice.segments.map((segment, segmentIndex) => (
                          <div key={segment.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Plane className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-600">
                                {segment.marketing_carrier?.iata_code || offer.owner?.iata_code || 'Airline'} {segment.flight_number || ''}
                              </span>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-between">
                              <div className="text-center">
                                <div className="font-medium">{segment.origin.iata_code}</div>
                                <div className="text-xs text-gray-500">
                                  {formatDateTime(segment.departing_at)}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 px-4">
                                <div className="w-8 h-px bg-gray-300"></div>
                                <Clock className="h-3 w-3 text-gray-400" />
                                <div className="w-8 h-px bg-gray-300"></div>
                              </div>
                              
                              <div className="text-center">
                                <div className="font-medium">{segment.destination.iata_code}</div>
                                <div className="text-xs text-gray-500">
                                  {formatDateTime(segment.arriving_at)}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {segment.marketing_carrier?.name || 'Airline'}
                              </div>
                              {segment.aircraft?.name && (
                                <div className="text-xs text-gray-500">{segment.aircraft.name}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Duration */}
                      <div className="mt-2 text-sm text-gray-600">
                        Total duration: {formatDuration(slice.duration)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price and Book Section */}
                <div className="ml-6 text-right">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {offer.total_currency} {offer.total_amount}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                    {offer.owner && (
                      <div className="flex items-center justify-end gap-2 mt-2">
                        {offer.owner.logo_symbol_url && (
                          <img 
                            src={offer.owner.logo_symbol_url} 
                            alt={`${offer.owner.name} logo`}
                            className="h-4 w-4 object-contain"
                          />
                        )}
                        <div className="text-xs text-gray-500">
                          via {offer.owner.name}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleBookFlight(offer)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Book Flight
                    </Button>
                    <Button 
                      onClick={() => handleHoldFlight(offer)}
                      variant="outline"
                      className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Reserve
                    </Button>
                    
                    {/* View Details Modal */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="w-full"
                        >
                          <Info className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Plane className="h-5 w-5 text-blue-600" />
                            Flight Details - {offer.owner?.name || 'Airline'}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Flight Overview */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-semibold text-lg">Flight Overview</h3>
                              <Badge variant="secondary" className="text-lg px-3 py-1">
                                {offer.total_currency} {offer.total_amount}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Route:</span> {offer.slices[0]?.origin.iata_code} → {offer.slices[0]?.destination.iata_code}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {formatDuration(offer.slices[0]?.duration)}
                              </div>
                              <div>
                                <span className="font-medium">Stops:</span> {offer.slices[0]?.segments.length === 1 ? 'Direct' : `${offer.slices[0]?.segments.length - 1} stop(s)`}
                              </div>
                              <div>
                                <span className="font-medium">Airline:</span> {offer.owner?.name || 'Multiple Airlines'}
                              </div>
                            </div>
                          </div>

                          {/* Detailed Segments */}
                          {offer.slices.map((slice, sliceIndex) => (
                            <div key={slice.id} className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {slice.origin.name} → {slice.destination.name}
                              </h4>
                              
                              <div className="space-y-4">
                                {slice.segments.map((segment, segmentIndex) => (
                                  <div key={segment.id} className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <div className="font-medium text-lg">
                                          {segment.marketing_carrier?.iata_code || offer.owner?.iata_code} {segment.flight_number}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {segment.marketing_carrier?.name || offer.owner?.name}
                                        </div>
                                        {segment.aircraft?.name && (
                                          <div className="text-xs text-gray-500">
                                            Aircraft: {segment.aircraft.name}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6 mt-3">
                                      <div>
                                        <div className="text-sm text-gray-500">Departure</div>
                                        <div className="font-medium">{segment.origin.iata_code} - {segment.origin.name}</div>
                                        <div className="text-sm">{formatDateTime(segment.departing_at)}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Arrival</div>
                                        <div className="font-medium">{segment.destination.iata_code} - {segment.destination.name}</div>
                                        <div className="text-sm">{formatDateTime(segment.arriving_at)}</div>
                                      </div>
                                    </div>
                                    
                                    {segmentIndex < slice.segments.length - 1 && (
                                      <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
                                        <span className="font-medium">Connection:</span> Layover at {segment.destination.iata_code}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                          {/* Pricing Breakdown */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Pricing Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              {offer.base_amount && (
                                <div className="flex justify-between">
                                  <span>Base Fare:</span>
                                  <span>{offer.total_currency} {offer.base_amount}</span>
                                </div>
                              )}
                              {offer.markup_amount && (
                                <div className="flex justify-between">
                                  <span>Service Fee:</span>
                                  <span>{offer.total_currency} {offer.markup_amount}</span>
                                </div>
                              )}
                              <Separator />
                              <div className="flex justify-between font-semibold">
                                <span>Total Amount:</span>
                                <span>{offer.total_currency} {offer.total_amount}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">
                                Price per person • Taxes and fees included
                              </div>
                            </div>
                          </div>

                          {/* Baggage and Services */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Luggage className="h-4 w-4" />
                              Baggage & Services
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="font-medium text-green-600 mb-1">✓ Included</div>
                                <ul className="space-y-1 text-gray-600">
                                  <li>• Personal item</li>
                                  <li>• Standard seat selection</li>
                                  <li>• Basic customer service</li>
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium text-orange-600 mb-1">⚡ Available for Purchase</div>
                                <ul className="space-y-1 text-gray-600">
                                  <li>• Checked baggage</li>
                                  <li>• Priority boarding</li>
                                  <li>• Extra legroom seats</li>
                                  <li>• In-flight meals</li>
                                </ul>
                              </div>
                            </div>
                          </div>



                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t">
                            <Button 
                              onClick={() => handleBookFlight(offer)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Book This Flight
                            </Button>
                            <Button 
                              onClick={() => handleHoldFlight(offer)}
                              variant="outline"
                              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Reserve for 24 Hours
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



      {/* Modify Search */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => setLocation('/')}
          className="px-8"
        >
          Modify Search
        </Button>
      </div>
    </div>
  );
}

