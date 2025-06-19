import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Users, Wifi, Car, Coffee, Dumbbell } from "lucide-react";
import type { Hotel } from "@shared/schema";

export default function HotelDetails() {
  const [, params] = useRoute("/hotels/:id");
  const [, setLocation] = useLocation();
  const hotelId = params?.id;

  const { data: hotel, isLoading, error } = useQuery<Hotel>({
    queryKey: ["/api/hotels", hotelId],
    queryFn: async () => {
      const response = await fetch(`/api/hotels/${hotelId}`);
      if (!response.ok) throw new Error("Failed to fetch hotel details");
      return response.json();
    },
    enabled: !!hotelId
  });

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < fullStars ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold text-gray-700">{rating}</span>
      </div>
    );
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes("gym") || amenityLower.includes("fitness")) return <Dumbbell className="w-4 h-4" />;
    if (amenityLower.includes("parking") || amenityLower.includes("car")) return <Car className="w-4 h-4" />;
    if (amenityLower.includes("restaurant") || amenityLower.includes("dining")) return <Coffee className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading hotel details...</div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h2>
                <p className="text-gray-600">The requested hotel could not be found.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
          <div className="flex items-center space-x-4">
            {renderStars(hotel.rating)}
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{hotel.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Overview */}
            <Card>
              <CardContent className="p-0">
                <img 
                  src={hotel.imageUrl} 
                  alt={hotel.name}
                  className="w-full h-64 md:h-80 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About This Hotel</h3>
                  <p className="text-gray-700">{hotel.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Hotel Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-travel-blue">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{hotel.location}</p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    This hotel is conveniently located in the heart of the city, 
                    providing easy access to major attractions, shopping, and dining.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-travel-blue">${hotel.pricePerNight}</p>
                  <p className="text-gray-600">per night</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Check-in</span>
                    </div>
                    <span className="text-sm font-semibold">Today</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Check-out</span>
                    </div>
                    <span className="text-sm font-semibold">Tomorrow</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Guests</span>
                    </div>
                    <span className="text-sm font-semibold">2 Adults</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold ml-1">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 py-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>1 night × ${hotel.pricePerNight}</span>
                    <span>${hotel.pricePerNight}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees</span>
                    <span>$25</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${(parseFloat(hotel.pricePerNight) + 25).toFixed(0)}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation(`/checkout/hotel/${hotel.id}`)}
                  className="w-full bg-travel-blue hover:bg-travel-blue-dark text-lg py-6"
                >
                  Book Now
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Free cancellation before 6 PM today
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
