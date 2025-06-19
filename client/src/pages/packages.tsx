import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  MapPin, 
  Calendar,
  Users,
  Star,
  Plane,
  Bed,
  Camera,
  Utensils,
  Search,
  Clock,
  DollarSign,
  Shield,
  Gift
} from "lucide-react";

export default function Packages() {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState("");

  const { data: packages, isLoading } = useQuery({
    queryKey: ["/api/packages"],
  });

  const packageTypes = [
    {
      name: "Romantic Getaway",
      description: "Perfect for couples seeking intimate experiences",
      icon: "💕",
      features: ["Luxury accommodations", "Romantic dinners", "Spa treatments", "Private transfers"],
      startingPrice: 1299,
      duration: "4-7 days"
    },
    {
      name: "Family Adventure",
      description: "Fun-filled activities for the whole family",
      icon: "👨‍👩‍👧‍👦",
      features: ["Family-friendly hotels", "Kid activities", "Group tours", "Flexible itinerary"],
      startingPrice: 899,
      duration: "5-10 days"
    },
    {
      name: "Cultural Explorer",
      description: "Immerse yourself in local culture and history",
      icon: "🏛️",
      features: ["Historic sites", "Cultural tours", "Local cuisine", "Museum visits"],
      startingPrice: 1099,
      duration: "7-12 days"
    },
    {
      name: "Beach Paradise",
      description: "Relax on pristine beaches with crystal clear waters",
      icon: "🏖️",
      features: ["Beachfront resorts", "Water activities", "Sunset cruises", "Spa services"],
      startingPrice: 1599,
      duration: "5-8 days"
    },
    {
      name: "Adventure Seeker",
      description: "Thrilling experiences for adrenaline junkies",
      icon: "🏔️",
      features: ["Extreme sports", "Hiking trails", "Adventure guides", "Outdoor gear"],
      startingPrice: 1399,
      duration: "6-9 days"
    },
    {
      name: "City Break",
      description: "Explore vibrant cities and urban attractions",
      icon: "🏙️",
      features: ["Central hotels", "City tours", "Shopping districts", "Nightlife access"],
      startingPrice: 799,
      duration: "3-5 days"
    }
  ];

  const popularDestinations = [
    { name: "Bali, Indonesia", packages: 45, image: "🏝️" },
    { name: "Paris, France", packages: 38, image: "🗼" },
    { name: "Tokyo, Japan", packages: 42, image: "🏯" },
    { name: "Santorini, Greece", packages: 29, image: "🏛️" },
    { name: "Maldives", packages: 31, image: "🏖️" },
    { name: "New York, USA", packages: 35, image: "🗽" }
  ];

  const handleSearch = () => {
    console.log("Searching packages...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vacation packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Vacation Packages</h1>
          </div>
          <p className="text-xl text-gray-600">All-inclusive travel experiences tailored for you</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Find Your Perfect Package</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="destination"
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 days</SelectItem>
                    <SelectItem value="6-8">6-8 days</SelectItem>
                    <SelectItem value="9-12">9-12 days</SelectItem>
                    <SelectItem value="13+">13+ days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelers">Travelers</Label>
                <Select value={travelers} onValueChange={setTravelers}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 traveler</SelectItem>
                    <SelectItem value="2">2 travelers</SelectItem>
                    <SelectItem value="3-4">3-4 travelers</SelectItem>
                    <SelectItem value="5+">5+ travelers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                    <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                    <SelectItem value="5000+">$5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Search Packages
            </Button>
          </CardContent>
        </Card>

        {/* Package Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packageTypes.map((packageType, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{packageType.icon}</div>
                    <h3 className="font-bold text-lg text-gray-900">{packageType.name}</h3>
                    <p className="text-sm text-gray-600">{packageType.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {packageType.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{packageType.duration}</p>
                      <p className="text-2xl font-bold text-blue-600">From ${packageType.startingPrice}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages && Array.isArray(packages) ? packages.slice(0, 6).map((pkg: any) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
                  <div className="w-full h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{pkg.title}</h3>
                    <Badge variant="secondary">{pkg.duration}</Badge>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.description}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">${pkg.price}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : null}
          </div>
        </div>

        {/* Popular Destinations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDestinations.map((dest, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-2">{dest.image}</div>
                  <h4 className="font-medium text-sm text-gray-900">{dest.name}</h4>
                  <p className="text-xs text-gray-600">{dest.packages} packages</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Package Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Best Value</p>
                  <p className="text-sm text-blue-700">Save up to 40% vs booking separately</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Protected</p>
                  <p className="text-sm text-green-700">ATOL protected holidays for peace of mind</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-900">24/7 Support</p>
                  <p className="text-sm text-purple-700">Expert assistance throughout your trip</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Gift className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="font-semibold text-orange-900">Extras Included</p>
                  <p className="text-sm text-orange-700">Meals, transfers, and activities included</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}