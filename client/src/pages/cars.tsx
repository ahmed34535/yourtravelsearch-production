import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  MapPin, 
  Calendar,
  Users,
  Fuel,
  Settings,
  Shield,
  Star,
  Search,
  Clock,
  CreditCard,
  CheckCircle
} from "lucide-react";

export default function Cars() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [driverAge, setDriverAge] = useState("30");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const carCategories = [
    {
      name: "Economy",
      example: "Nissan Versa or similar",
      passengers: 5,
      bags: 2,
      features: ["Manual transmission", "Air conditioning", "Fuel efficient"],
      pricePerDay: 35,
      image: "🚗"
    },
    {
      name: "Compact",
      example: "Hyundai Elantra or similar", 
      passengers: 5,
      bags: 2,
      features: ["Automatic transmission", "Air conditioning", "Bluetooth"],
      pricePerDay: 45,
      image: "🚘"
    },
    {
      name: "Mid-size",
      example: "Toyota Camry or similar",
      passengers: 5,
      bags: 3,
      features: ["Automatic transmission", "Air conditioning", "Cruise control"],
      pricePerDay: 55,
      image: "🚙"
    },
    {
      name: "Full-size",
      example: "Chevrolet Malibu or similar",
      passengers: 5,
      bags: 4,
      features: ["Automatic transmission", "Premium audio", "GPS navigation"],
      pricePerDay: 65,
      image: "🚗"
    },
    {
      name: "SUV",
      example: "Ford Explorer or similar",
      passengers: 7,
      bags: 5,
      features: ["4WD capability", "Premium interior", "Roof rails"],
      pricePerDay: 85,
      image: "🚙"
    },
    {
      name: "Luxury",
      example: "BMW 3 Series or similar",
      passengers: 5,
      bags: 3,
      features: ["Leather seats", "Premium audio", "Advanced safety"],
      pricePerDay: 120,
      image: "🏎️"
    }
  ];

  const rentalTips = [
    {
      icon: Clock,
      title: "Book in Advance",
      description: "Reserve 2-4 weeks ahead for better rates and availability",
      color: "blue"
    },
    {
      icon: CreditCard,
      title: "Check Insurance",
      description: "Review your coverage before purchasing additional insurance",
      color: "green"
    },
    {
      icon: Fuel,
      title: "Fuel Policy",
      description: "Understand the fuel policy - full-to-full is usually best",
      color: "yellow"
    },
    {
      icon: Shield,
      title: "Inspect Vehicle",
      description: "Document any existing damage before driving off the lot",
      color: "purple"
    }
  ];

  const handleSearch = () => {
    setShowComingSoon(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Car Rental</h1>
          </div>
          <p className="text-xl text-gray-600">Find the perfect car for your journey</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Car Rental Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="pickup-location">Pick-up Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="pickup-location"
                    placeholder="City, airport, or address"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver-age">Driver Age</Label>
                <Select value={driverAge} onValueChange={setDriverAge}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24 years</SelectItem>
                    <SelectItem value="25-29">25-29 years</SelectItem>
                    <SelectItem value="30">30+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Pick-up Date & Time</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Input 
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Drop-off Date & Time</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Input 
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Search Cars
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

        {/* Coming Soon Message */}
        <Card className="p-8 text-center bg-white border-gray-200 mb-8">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Car Rental Booking</h3>
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 inline-block">
            <p className="text-orange-600 font-semibold text-lg">Coming Soon</p>
          </div>
        </Card>

        {/* Car Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Car Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{category.image}</div>
                    <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.example}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        <span>Passengers</span>
                      </div>
                      <span className="font-medium">{category.passengers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-1 text-gray-400" />
                        <span>Bags</span>
                      </div>
                      <span className="font-medium">{category.bags}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">${category.pricePerDay}</p>
                      <p className="text-xs text-gray-500">per day</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Rental Locations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Popular Rental Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Los Angeles Airport (LAX)",
                "New York JFK Airport",
                "Miami International",
                "Las Vegas McCarran",
                "Orlando International", 
                "Chicago O'Hare",
                "San Francisco Airport",
                "Denver International"
              ].map((location, index) => (
                <Button key={index} variant="ghost" className="justify-start h-auto p-3 text-left">
                  <div>
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{location}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rental Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rentalTips.map((tip, index) => (
            <Card key={index} className={`bg-${tip.color}-50 border-${tip.color}-200`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <tip.icon className={`w-6 h-6 text-${tip.color}-600`} />
                  <div>
                    <p className={`font-semibold text-${tip.color}-900`}>{tip.title}</p>
                    <p className={`text-sm text-${tip.color}-700`}>{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}