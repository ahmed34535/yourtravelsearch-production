import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { MapPin, Star, Calendar, Users, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Destination, Hotel, Flight } from "@shared/schema";

export default function DestinationDetails() {
  const [match, params] = useRoute("/destinations/:id");
  const destinationId = params?.id;

  const { data: destination, isLoading: destinationLoading } = useQuery<Destination>({
    queryKey: ["/api/destinations", destinationId],
    queryFn: async () => {
      const response = await fetch(`/api/destinations/${destinationId}`);
      if (!response.ok) throw new Error("Failed to fetch destination");
      return response.json();
    },
    enabled: !!destinationId,
  });

  const { data: hotels } = useQuery<Hotel[]>({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const response = await fetch("/api/hotels");
      if (!response.ok) throw new Error("Failed to fetch hotels");
      return response.json();
    },
  });

  const { data: flights } = useQuery<Flight[]>({
    queryKey: ["/api/flights"],
    queryFn: async () => {
      const response = await fetch("/api/flights");
      if (!response.ok) throw new Error("Failed to fetch flights");
      return response.json();
    },
  });

  if (destinationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600">The destination you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Filter hotels and flights for this destination
  const destinationHotels = hotels?.filter(hotel => 
    hotel.location.toLowerCase().includes(destination.name.toLowerCase())
  ) || [];

  const destinationFlights = flights?.filter(flight => 
    flight.destination.toLowerCase().includes(destination.name.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{destination.name}</h1>
            <p className="text-xl mb-2">{destination.country}</p>
            <p className="text-lg max-w-2xl mx-auto">{destination.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  About {destination.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {destination.description} Experience the rich culture, stunning architecture, 
                  and world-class attractions that make this destination unforgettable. 
                  From historic landmarks to modern entertainment, there's something for every traveler.
                </p>
              </CardContent>
            </Card>

            {/* Hotels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-600" />
                  Hotels in {destination.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {destinationHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destinationHotels.slice(0, 4).map((hotel) => (
                      <div key={hotel.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img 
                          src={hotel.imageUrl} 
                          alt={hotel.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h4 className="font-semibold">{hotel.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{hotel.rating}</span>
                          </div>
                          <span className="font-bold text-blue-600">${hotel.pricePerNight}/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No hotels found for this destination.</p>
                )}
              </CardContent>
            </Card>

            {/* Flights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="w-5 h-5 mr-2 text-blue-600" />
                  Flights to {destination.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {destinationFlights.length > 0 ? (
                  <div className="space-y-4">
                    {destinationFlights.slice(0, 3).map((flight) => (
                      <div key={flight.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{flight.airline}</h4>
                            <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                            <p className="text-sm">{flight.origin} → {flight.destination}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">${flight.price}</p>
                            <p className="text-sm text-gray-600">{flight.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No flights found for this destination.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <Plane className="w-4 h-4 mr-2" />
                  Book Flight
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Star className="w-4 h-4 mr-2" />
                  Find Hotels
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Plan Trip
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Starting from:</span>
                  <span className="font-semibold">${destination.priceFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">{destination.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best time to visit:</span>
                  <span className="font-semibold">Year-round</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}