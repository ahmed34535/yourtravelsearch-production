import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bed, 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils,
  Dumbbell,
  Waves,
  Calendar,
  Users,
  Filter,
  Search
} from "lucide-react";

export default function Hotels() {
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ["/api/hotels"],
  });

  // Force hotels to render using authentic API data only
  const hotelList = Array.isArray(hotels) ? hotels : [];
  
  // Use API data when available
  const displayHotels = hotelList;

  // City database for autocomplete suggestions
  const availableCities = [
    "New York", "Manhattan", "Brooklyn", "Queens",
    "Miami", "Miami Beach", "South Beach", "Key Biscayne",
    "Los Angeles", "Hollywood", "Beverly Hills", "Santa Monica",
    "Chicago", "Downtown Chicago", "Navy Pier",
    "Las Vegas", "The Strip", "Downtown Las Vegas",
    "San Francisco", "Nob Hill", "Union Square",
    "Boston", "Back Bay", "Cambridge",
    "Denver", "Downtown Denver", "Capitol Hill",
    "Aspen", "Snowmass", "Vail",
    "Savannah", "Historic District", "River Street",
    "Scottsdale", "Old Town Scottsdale", "Phoenix",
    "Orlando", "Disney World", "Universal Studios",
    "Nashville", "Music Row", "Downtown Nashville",
    "Seattle", "Pike Place", "Capitol Hill",
    "Portland", "Pearl District", "Hawthorne",
    "Austin", "South by Southwest", "Sixth Street"
  ];

  const handleLocationChange = (value: string) => {
    setSearchLocation(value);
    
    if (value.length > 0) {
      const suggestions = availableCities
        .filter(city => city.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setCitySuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    setShowComingSoon(true);
  };

  // Remove the loading check that prevents rendering - same fix as flights
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading hotels...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bed className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Find Your Perfect Hotel</h1>
          </div>
          <p className="text-xl text-gray-600">Book from millions of properties worldwide</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Hotel Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="location">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="location"
                    placeholder="Where are you going?"
                    value={searchLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => searchLocation && setShowSuggestions(citySuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="pl-10"
                    autoComplete="off"
                  />
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1">
                      {citySuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            {suggestion}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkin">Check-in</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="checkin"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout">Check-out</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="checkout"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="guests"
                    type="number"
                    min="1"
                    max="20"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Search Hotels
            </Button>
            
            {/* Coming Soon Message */}
            {showComingSoon && (
              <div className="mt-4 text-center">
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 inline-block">
                  <p className="text-orange-600 font-semibold">Coming Soon</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hotels Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {hasSearched ? 
              `Search Results (${searchResults.length} hotels found)` : 
              'Featured Hotels'
            }
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(hasSearched ? searchResults : displayHotels).slice(0, 6).map((hotel: any) => (
              <Card key={hotel.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
                  <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg flex items-center justify-center">
                    <Bed className="w-12 h-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center">
                      {[...Array(Math.floor(Number(hotel.rating) || 0))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities?.slice(0, 3).map((amenity: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">${hotel.pricePerNight}</p>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show coming soon message */}
          {displayHotels.length === 0 && (
            <Card className="p-8 text-center bg-white border-gray-200">
              <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hotel Booking</h3>
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 inline-block">
                <p className="text-orange-600 font-semibold text-lg">Coming Soon</p>
              </div>
            </Card>
          )}
        </div>

        {/* Hotel Amenities Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Popular Hotel Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Wifi className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Free WiFi</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <Car className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Free Parking</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <Coffee className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium">Breakfast</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                <Dumbbell className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Fitness Center</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                <Utensils className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium">Restaurant</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-indigo-50 rounded-lg">
                <Waves className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium">Swimming Pool</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Best Booking Time</p>
                  <p className="text-sm text-blue-700">Book 2-3 weeks ahead for best rates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Guest Reviews</p>
                  <p className="text-sm text-green-700">Check recent reviews for the best experience</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Filter className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-900">Filter Options</p>
                  <p className="text-sm text-purple-700">Use filters to find exactly what you need</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}