import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Hotel as Bed, Car, MapPin, Calendar, Users, User, Search, Building } from 'lucide-react';
import AirportSearch from './airport-search';

interface FlightFormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  tripType: 'one-way' | 'round-trip';
}

interface HotelFormData {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

interface CarFormData {
  location: string;
  pickupDate: string;
  returnDate: string;
  driverAge: string;
}

function TravelSelector() {
  const [selectedTab, setSelectedTab] = useState('flights');
  const [, setLocation] = useLocation();

  const [flightForm, setFlightForm] = useState<FlightFormData>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'round-trip'
  });

  const [hotelForm, setHotelForm] = useState<HotelFormData>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });

  const [carForm, setCarForm] = useState<CarFormData>({
    location: '',
    pickupDate: '',
    returnDate: '',
    driverAge: '30-65'
  });

  const handleSearch = (type: 'flights' | 'hotels' | 'cars') => {
    if (type === 'flights' && flightForm.origin && flightForm.destination && flightForm.departureDate) {
      const params = new URLSearchParams({
        origin: flightForm.origin,
        destination: flightForm.destination,
        departureDate: flightForm.departureDate,
        returnDate: flightForm.returnDate || '',
        passengers: flightForm.passengers.toString(),
        tripType: flightForm.tripType
      });
      setLocation(`/flight-results?${params.toString()}`);
    } else {
      setLocation(`/${type}`);
    }
  };

  return (
    <div className="travel-selector w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full h-auto grid grid-cols-3 rounded-t-3xl bg-white/95 border-b border-gray-100 p-0 m-0">
          <TabsTrigger value="flights" className="flex items-center space-x-3 py-4 px-6 rounded-tl-3xl data-[state=active]:bg-white">
            <Plane className="w-6 h-6" />
            <span className="text-lg font-semibold">Flights</span>
          </TabsTrigger>
          <TabsTrigger value="hotels" className="flex items-center space-x-3 py-4 px-6 data-[state=active]:bg-white">
            <Bed className="w-6 h-6" />
            <span className="text-lg font-semibold">Hotels</span>
          </TabsTrigger>
          <TabsTrigger value="cars" className="flex items-center space-x-3 py-4 px-6 rounded-tr-3xl data-[state=active]:bg-white">
            <Car className="w-6 h-6" />
            <span className="text-lg font-semibold">Cars</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="h-[580px] overflow-hidden">
          <div className="p-6">
            <TabsContent value="flights" className="space-y-8 h-full overflow-y-auto mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="from" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">From</Label>
                  <AirportSearch
                    id="from"
                    placeholder="Departure city or airport"
                    value={flightForm.origin}
                    onChange={(value) => setFlightForm({...flightForm, origin: value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="to" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">To</Label>
                  <AirportSearch
                    id="to"
                    placeholder="Destination city or airport"
                    value={flightForm.destination}
                    onChange={(value) => setFlightForm({...flightForm, destination: value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="departure-date" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Departure Date
                  </Label>
                  <input
                    id="departure-date"
                    type="date"
                    value={flightForm.departureDate}
                    onChange={(e) => setFlightForm({...flightForm, departureDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  />
                </div>
                {flightForm.tripType === 'round-trip' && (
                  <div className="space-y-3">
                    <Label htmlFor="return-date" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Return Date
                    </Label>
                    <input
                      id="return-date"
                      type="date"
                      value={flightForm.returnDate}
                      onChange={(e) => setFlightForm({...flightForm, returnDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Users className="w-4 h-4 inline mr-2" />
                    Passengers
                  </Label>
                  <select
                    value={flightForm.passengers}
                    onChange={(e) => setFlightForm({...flightForm, passengers: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">Trip Type</Label>
                  <select
                    value={flightForm.tripType}
                    onChange={(e) => setFlightForm({...flightForm, tripType: e.target.value as 'one-way' | 'round-trip'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  >
                    <option value="round-trip">Round Trip</option>
                    <option value="one-way">One Way</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => handleSearch('flights')}
                  className="w-full bg-gradient-to-r from-travel-primary to-travel-secondary hover:from-travel-secondary hover:to-travel-primary text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 text-lg overflow-hidden"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Flights
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="hotels" className="space-y-8 h-full overflow-y-auto mt-0">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="hotel-location" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Destination
                  </Label>
                  <AirportSearch
                    id="hotel-location"
                    placeholder="Enter destination city or hotel name"
                    value={hotelForm.location}
                    onChange={(value) => setHotelForm({...hotelForm, location: value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="checkin-date" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Check-in Date
                  </Label>
                  <input
                    id="checkin-date"
                    type="date"
                    value={hotelForm.checkIn}
                    onChange={(e) => setHotelForm({...hotelForm, checkIn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="checkout-date" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Check-out Date
                  </Label>
                  <input
                    id="checkout-date"
                    type="date"
                    value={hotelForm.checkOut}
                    onChange={(e) => setHotelForm({...hotelForm, checkOut: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Users className="w-4 h-4 inline mr-2" />
                    Guests
                  </Label>
                  <select
                    value={hotelForm.guests}
                    onChange={(e) => setHotelForm({...hotelForm, guests: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Building className="w-4 h-4 inline mr-2" />
                    Rooms
                  </Label>
                  <select
                    value={hotelForm.rooms}
                    onChange={(e) => setHotelForm({...hotelForm, rooms: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => handleSearch('hotels')}
                  className="w-full bg-gradient-to-r from-travel-primary to-travel-secondary hover:from-travel-secondary hover:to-travel-primary text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 text-lg overflow-hidden"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Hotels
                </Button>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-travel-warning/20 to-travel-orange/20 text-travel-orange rounded-2xl border border-travel-orange/30">
                  <span className="text-body-medium font-bold">Hotel Booking - Coming Soon</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cars" className="space-y-8 h-full overflow-y-auto mt-0">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="car-location" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Pick-up Location
                  </Label>
                  <AirportSearch
                    id="car-location"
                    placeholder="Enter pick-up location"
                    value={carForm.location}
                    onChange={(value) => setCarForm({...carForm, location: value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="pickup-date" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Pick-up Date
                  </Label>
                  <input
                    id="pickup-date"
                    type="date"
                    value={carForm.pickupDate}
                    onChange={(e) => setCarForm({...carForm, pickupDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="return-date" className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Return Date
                  </Label>
                  <input
                    id="return-date"
                    type="date"
                    value={carForm.returnDate}
                    onChange={(e) => setCarForm({...carForm, returnDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-subheading text-sm font-bold text-travel-warm-gray uppercase tracking-wider">
                  <User className="w-4 h-4 inline mr-2" />
                  Driver Age
                </Label>
                <select
                  value={carForm.driverAge}
                  onChange={(e) => setCarForm({...carForm, driverAge: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-travel-primary bg-white text-body-medium"
                >
                  <option value="25-29">25-29 years</option>
                  <option value="30-65">30-65 years</option>
                  <option value="65+">65+ years</option>
                </select>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => handleSearch('cars')}
                  className="w-full bg-gradient-to-r from-travel-primary to-travel-secondary hover:from-travel-secondary hover:to-travel-primary text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 text-lg overflow-hidden"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Cars
                </Button>
              </div>

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