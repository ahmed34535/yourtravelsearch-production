import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  Bed, 
  Car,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AirportSearch from "./airport-search";

function TravelSelector() {
  const [selectedTab, setSelectedTab] = useState("flights");
  const [, setLocation] = useLocation();
  
  // Flight search state
  const [flightForm, setFlightForm] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy'
  });

  // Airport suggestions for common searches
  const getAirportSuggestion = (input: string): string => {
    const suggestions: Record<string, string> = {
      'minnesota': 'MSP',
      'minneapolis': 'MSP',
      'twin cities': 'MSP',
      'los angeles': 'LAX',
      'la': 'LAX',
      'new york': 'JFK',
      'nyc': 'JFK',
      'chicago': 'ORD',
      'miami': 'MIA',
      'boston': 'BOS',
      'seattle': 'SEA',
      'san francisco': 'SFO',
      'denver': 'DEN',
      'atlanta': 'ATL',
      'dallas': 'DFW',
      'phoenix': 'PHX',
      'las vegas': 'LAS',
      'orlando': 'MCO',
      'washington': 'DCA',
      'dc': 'DCA'
    };
    
    const normalized = input.toLowerCase().trim();
    return suggestions[normalized as keyof typeof suggestions] || input.toUpperCase();
  };

  const handleFlightSearch = () => {
    if (!flightForm.origin || !flightForm.destination || !flightForm.departureDate) {
      alert('Please fill in origin, destination, and departure date');
      return;
    }
    
    const params = new URLSearchParams({
      origin: flightForm.origin,
      destination: flightForm.destination,
      departureDate: flightForm.departureDate,
      adults: flightForm.adults.toString(),
      children: flightForm.children.toString(),
      infants: flightForm.infants.toString(),
      cabin_class: flightForm.cabinClass
    });
    
    if (flightForm.returnDate) {
      params.append('returnDate', flightForm.returnDate);
    }
    
    setLocation(`/flight-results?${params.toString()}`);
  };

  const handleSearch = (type: string) => {
    if (type === 'flights') {
      handleFlightSearch();
    } else {
      setLocation(`/${type}`);
    }
  };

  return (
    <div className="travel-selector w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-0 bg-white/95 rounded-t-3xl border-b border-gray-100 px-0">
          <TabsTrigger value="flights" className="flex items-center space-x-2">
            <Plane className="w-4 h-4" />
            <span>Flights</span>
          </TabsTrigger>
          <TabsTrigger value="hotels" className="flex items-center space-x-2">
            <Bed className="w-4 h-4" />
            <span>Hotels</span>
          </TabsTrigger>
          <TabsTrigger value="cars" className="flex items-center space-x-2">
            <Car className="w-4 h-4" />
            <span>Cars</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Fixed height container for all tab content with padding only for forms */}
        <div className="h-[580px] overflow-hidden">
          <div className="p-6">
            <TabsContent value="flights" className="space-y-8 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="from" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">From</Label>
                <AirportSearch
                  id="from"
                  placeholder="Enter departure city or airport"
                  value={flightForm.origin}
                  onChange={(value) => setFlightForm({...flightForm, origin: value})}
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="to" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">To</Label>
                <AirportSearch
                  id="to"
                  placeholder="Enter destination city or airport"
                  value={flightForm.destination}
                  onChange={(value) => setFlightForm({...flightForm, destination: value})}
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="departure" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Departure</Label>
                <Input 
                  id="departure" 
                  type="date" 
                  value={flightForm.departureDate}
                  onChange={(e) => setFlightForm({...flightForm, departureDate: e.target.value})}
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="return" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Return (Optional)</Label>
                <Input 
                  id="return" 
                  type="date" 
                  value={flightForm.returnDate}
                  onChange={(e) => setFlightForm({...flightForm, returnDate: e.target.value})}
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
            </div>
            
            {/* Passengers and Class Section */}
            <div className="bg-travel-sand/30 rounded-2xl p-6 space-y-6">
              <h3 className="text-subheading text-lg font-bold text-travel-warm-gray">Passengers & Class</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults" className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Adults</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    max="9"
                    value={flightForm.adults}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                    className="input-premium h-12 rounded-xl text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children" className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Children</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    max="9"
                    value={flightForm.children}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                    className="input-premium h-12 rounded-xl text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="infants" className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Infants</Label>
                  <Input
                    id="infants"
                    type="number"
                    min="0"
                    max="9"
                    value={flightForm.infants}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, infants: parseInt(e.target.value) || 0 }))}
                    className="input-premium h-12 rounded-xl text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cabin-class" className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Class</Label>
                  <select
                    id="cabin-class"
                    value={flightForm.cabinClass}
                    onChange={(e) => setFlightForm(prev => ({ ...prev, cabinClass: e.target.value }))}
                    className="input-premium w-full h-12 px-4 py-3 bg-background rounded-xl text-sm font-semibold"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium_economy">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSearch('flights')} 
              className="btn-premium w-full h-16 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              disabled={!flightForm.origin || !flightForm.destination || !flightForm.departureDate}
            >
              Search Flights
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </TabsContent>

            <TabsContent value="hotels" className="space-y-8 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="destination" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Destination</Label>
                <Input 
                  id="destination" 
                  placeholder="Where are you going?" 
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="checkin" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Check-in</Label>
                <Input 
                  id="checkin" 
                  type="date" 
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="checkout" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Check-out</Label>
                <Input 
                  id="checkout" 
                  type="date" 
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
            </div>
            
            {/* Guests Section */}
            <div className="bg-travel-sand/30 rounded-2xl p-6 space-y-6">
              <h3 className="text-subheading text-lg font-bold text-travel-warm-gray">Guests & Rooms</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Adults</Label>
                  <Input
                    type="number"
                    min="1"
                    max="9"
                    defaultValue="2"
                    className="input-premium h-12 rounded-xl text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Children</Label>
                  <Input
                    type="number"
                    min="0"
                    max="9"
                    defaultValue="0"
                    className="input-premium h-12 rounded-xl text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Rooms</Label>
                  <Input
                    type="number"
                    min="1"
                    max="9"
                    defaultValue="1"
                    className="input-premium h-12 rounded-xl text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Type</Label>
                  <select
                    className="input-premium w-full h-12 px-4 py-3 bg-background rounded-xl text-sm font-semibold"
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSearch('hotels')} 
              className="btn-premium w-full h-16 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
            >
              Search Hotels
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-travel-warning/20 to-travel-orange/20 text-travel-orange rounded-2xl border border-travel-orange/30">
                <span className="text-body-medium font-bold">Hotel Booking - Coming Soon</span>
              </div>
            </div>
          </TabsContent>

            <TabsContent value="cars" className="space-y-8 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="pickup" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Pick-up Location</Label>
                <Input 
                  id="pickup" 
                  placeholder="City or airport" 
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="pickupdate" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Pick-up Date</Label>
                <Input 
                  id="pickupdate" 
                  type="date" 
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="dropoffdate" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Drop-off Date</Label>
                <Input 
                  id="dropoffdate" 
                  type="date" 
                  className="input-premium h-14 rounded-2xl text-base font-medium"
                />
              </div>
            </div>
            
            {/* Driver & Preferences Section */}
            <div className="bg-travel-sand/30 rounded-2xl p-6 space-y-6">
              <h3 className="text-subheading text-lg font-bold text-travel-warm-gray">Driver & Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Driver Age</Label>
                  <Input
                    type="number"
                    min="18"
                    max="99"
                    defaultValue="25"
                    className="input-premium h-12 rounded-xl text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Fuel Type</Label>
                  <select
                    className="input-premium w-full h-12 px-4 py-3 bg-background rounded-xl text-sm font-semibold"
                  >
                    <option value="any">Any</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Transmission</Label>
                  <select
                    className="input-premium w-full h-12 px-4 py-3 bg-background rounded-xl text-sm font-semibold"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-subheading text-xs font-bold text-travel-warm-gray uppercase tracking-wide">Size</Label>
                  <select
                    className="input-premium w-full h-12 px-4 py-3 bg-background rounded-xl text-sm font-semibold"
                  >
                    <option value="compact">Compact</option>
                    <option value="economy">Economy</option>
                    <option value="standard">Standard</option>
                    <option value="fullsize">Full Size</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSearch('cars')} 
              className="btn-premium w-full h-16 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
            >
              Search Cars
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-travel-warning/20 to-travel-orange/20 text-travel-orange rounded-2xl border border-travel-orange/30">
                <span className="text-body-medium font-bold">Car Rental - Coming Soon</span>
              </div>
            </div>
            </TabsContent>
          </div>
        </div>
        
      </Tabs>
    </div>
  );
}

export default TravelSelector;