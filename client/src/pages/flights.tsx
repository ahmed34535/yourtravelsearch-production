import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AirportSearch from "@/components/airport-search";
import { 
  Plane, 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  ArrowRightLeft,
  Plus,
  Minus,
  Info,
  Star,
  Clock,
  DollarSign,
  Filter,
  SortAsc
} from "lucide-react";
import { format, addDays } from "date-fns";
import { SEOHead } from "@/components/SEOHead";
import { useCurrency } from "@/hooks/useCurrency";
import { useLocalization } from "@/hooks/useLocalization";

export default function Flights() {
  const { selectedCurrency } = useCurrency();
  const { selectedLanguage } = useLocalization();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tripType, setTripType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [travelClass, setTravelClass] = useState("economy");
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [nearbyAirports, setNearbyAirports] = useState(false);

  const popularDestinations = [
    { code: "JFK", city: "New York", country: "USA" },
    { code: "LHR", city: "London", country: "UK" },
    { code: "CDG", city: "Paris", country: "France" },
    { code: "NRT", city: "Tokyo", country: "Japan" }
  ];

  const fromSuggestions = [
    { code: "LAX", city: "Los Angeles", country: "USA" },
    { code: "SFO", city: "San Francisco", country: "USA" },
    { code: "LAS", city: "Las Vegas", country: "USA" }
  ];

  const handlePassengerChange = (type: keyof typeof passengers, increment: boolean) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  const handleSaveSearch = () => {
    if (!from || !to || !departureDate) {
      toast({
        title: "Incomplete Search",
        description: "Please fill in origin, destination, and departure date to save this search.",
        variant: "destructive"
      });
      return;
    }

    // Create search object
    const searchData = {
      from,
      to,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : null,
      passengers,
      travelClass: travelClass || 'economy',
      tripType: tripType || 'oneway',
      savedAt: new Date().toISOString()
    };

    // Save to localStorage
    const savedSearches = JSON.parse(localStorage.getItem('savedFlightSearches') || '[]');
    savedSearches.push(searchData);
    localStorage.setItem('savedFlightSearches', JSON.stringify(savedSearches));

    toast({
      title: "Search Saved",
      description: `Saved search from ${from} to ${to} on ${format(departureDate, 'MMM dd, yyyy')}`,
    });
  };

  const handleSearch = () => {
    if (!from || !to || !departureDate) {
      alert('Please fill in origin, destination, and departure date');
      return;
    }

    // Prepare search data for API with proper date formatting
    const searchParams = new URLSearchParams({
      origin: from,
      destination: to,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      adults: passengers.adults.toString(),
      children: passengers.children.toString(),
      infants: passengers.infants.toString(),
      cabin_class: travelClass || 'economy'
    });

    // Add return date for round trip
    if (tripType === 'roundtrip' && returnDate) {
      searchParams.append('returnDate', format(returnDate, 'yyyy-MM-dd'));
    }
    
    // Navigate to flight results with search parameters
    setLocation(`/flight-results?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <SEOHead 
        title={`Flight Search - Find Cheap Flights | TravalSearch`}
        description={`Search and compare flights from thousands of airlines. Find the best deals on flights worldwide with price protection and instant booking confirmation.`}
        keywords={`flights, cheap flights, flight search, airline tickets, flight booking, travel deals, flight comparison`}
        canonicalUrl={`${window.location.origin}/flights`}
        page="flights"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Plane className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Search Flights</h1>
          </div>
          <p className="text-xl text-gray-600">Find and book your perfect flight</p>
        </div>

        {/* Main Search Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Flight Search</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Info className="w-4 h-4" />
                <span>Price protected for 24 hours</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Trip Type */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Trip Type</Label>
              <Tabs value={tripType} onValueChange={setTripType} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-96">
                  <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
                  <TabsTrigger value="oneway">One Way</TabsTrigger>
                  <TabsTrigger value="multicity">Multi-City</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* From/To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From */}
              <div className="space-y-2">
                <Label>From</Label>
                <AirportSearch
                  id="from"
                  label=""
                  placeholder="Enter departure city or airport"
                  value={from}
                  onChange={setFrom}
                />
              </div>

              {/* To */}
              <div className="space-y-2">
                <Label>To</Label>
                <AirportSearch
                  id="to"
                  label=""
                  placeholder="Enter destination city or airport"
                  value={to}
                  onChange={setTo}
                  onSelect={() => {
                    // Auto-trigger search when destination is selected
                    if (from && departureDate) {
                      setTimeout(() => handleSearch(), 100);
                    }
                  }}
                />
              </div>
            </div>

            {/* Date Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Departure Date */}
              <div className="space-y-2">
                <Label>Departure</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date */}
              {tripType === "roundtrip" && (
                <div className="space-y-2">
                  <Label>Return</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                        disabled={(date) => date < (departureDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Passengers & Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Passengers */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Passengers & Class</Label>
                
                <div className="space-y-3 p-4 border rounded-lg">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Adults</p>
                      <p className="text-sm text-gray-600">12+ years</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePassengerChange('adults', false)}
                        disabled={passengers.adults <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{passengers.adults}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePassengerChange('adults', true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Children</p>
                      <p className="text-sm text-gray-600">2-11 years</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePassengerChange('children', false)}
                        disabled={passengers.children <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{passengers.children}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePassengerChange('children', true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Infants</p>
                      <p className="text-sm text-gray-600">Under 2 years</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePassengerChange('infants', false)}
                        disabled={passengers.infants <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{passengers.infants}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePassengerChange('infants', true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Class */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Travel Class</Label>
                <Select value={travelClass} onValueChange={setTravelClass}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">
                      <div>
                        <p className="font-medium">Economy</p>
                        <p className="text-sm text-gray-600">Standard seating</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="premium">
                      <div>
                        <p className="font-medium">Premium Economy</p>
                        <p className="text-sm text-gray-600">Extra legroom</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="business">
                      <div>
                        <p className="font-medium">Business</p>
                        <p className="text-sm text-gray-600">Premium service</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="first">
                      <div>
                        <p className="font-medium">First Class</p>
                        <p className="text-sm text-gray-600">Luxury experience</p>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSaveSearch}
              >
                <Star className="w-4 h-4 mr-2" />
                Save Search
              </Button>
              <Button 
                onClick={handleSearch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                disabled={!from || !to || !departureDate}
              >
                Search {getTotalPassengers()} Passenger{getTotalPassengers() > 1 ? 's' : ''} • {tripType === 'roundtrip' ? 'Round Trip' : tripType === 'oneway' ? 'One Way' : 'Multi-City'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Best Booking Time</p>
                  <p className="text-sm text-blue-700">Book 2-8 weeks ahead for best prices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Cheapest Days</p>
                  <p className="text-sm text-green-700">Tuesday & Wednesday are cheapest</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-900">Price Protection</p>
                  <p className="text-sm text-purple-700">24-hour price hold available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}