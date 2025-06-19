import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight, Calendar, Users } from "lucide-react";
import type { Flight } from "@shared/schema";

export default function FlightDetails() {
  const [, params] = useRoute("/flights/:id");
  const [, setLocation] = useLocation();
  const flightId = params?.id;

  const { data: flight, isLoading, error } = useQuery<Flight>({
    queryKey: ["/api/flights", flightId],
    queryFn: async () => {
      const response = await fetch(`/api/flights/${flightId}`);
      if (!response.ok) throw new Error("Failed to fetch flight details");
      return response.json();
    },
    enabled: !!flightId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading flight details...</div>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Flight Not Found</h2>
                <p className="text-gray-600">The requested flight could not be found.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Details</h1>
          <p className="text-gray-600">{flight.airline} {flight.flightNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="w-5 h-5 mr-2" />
                  Flight Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={flight.imageUrl} 
                      alt={flight.airline}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Airline</p>
                      <p className="font-semibold text-gray-900">{flight.airline}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Flight Number</p>
                      <p className="font-semibold text-gray-900">{flight.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">{flight.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stops</p>
                      <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
                        {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight Route */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Flight Route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{flight.departureTime}</p>
                    <p className="text-lg font-semibold text-gray-700">{flight.origin}</p>
                    <p className="text-sm text-gray-600">Departure</p>
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <Plane className="text-travel-blue bg-white px-2 w-12 h-12" />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">{flight.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{flight.arrivalTime}</p>
                    <p className="text-lg font-semibold text-gray-700">{flight.destination}</p>
                    <p className="text-sm text-gray-600">Arrival</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Book This Flight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-travel-blue">${flight.price}</p>
                  <p className="text-gray-600">per person</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Departure Date</span>
                    </div>
                    <span className="text-sm font-semibold">Today</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Passengers</span>
                    </div>
                    <span className="text-sm font-semibold">1 Adult</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Flight Type</span>
                    </div>
                    <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
                      {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation(`/checkout/flight/${flight.id}`)}
                  className="w-full bg-travel-blue hover:bg-travel-blue-dark text-lg py-6"
                >
                  Book Now - ${flight.price}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Free cancellation within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
