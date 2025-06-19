import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plane, CheckCircle, AlertCircle, Clock, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FlightOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  base_amount: string;
  display_price: number;
  slices: Array<{
    origin: { iata_code: string; name: string };
    destination: { iata_code: string; name: string };
    departure_datetime: string;
    arrival_datetime: string;
    duration: string;
    segments: Array<{
      marketing_carrier: { name: string; iata_code: string };
      flight_number: string;
      aircraft: { name: string };
    }>;
  }>;
}

export default function LiveAPITest() {
  const [searchParams, setSearchParams] = useState({
    origin: "LHR",
    destination: "JFK",
    departureDate: "2025-07-15",
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: "economy"
  });
  
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const checkAPIStatus = async () => {
    try {
      const status = await apiRequest('GET', '/api/duffel/status');
      setApiStatus(status);
    } catch (err: any) {
      setError("Failed to check API status: " + err.message);
    }
  };

  const searchFlights = async () => {
    setIsLoading(true);
    setError("");
    setSearchResults(null);
    
    try {
      const results = await apiRequest('POST', '/api/flights/search', searchParams);
      setSearchResults(results);
    } catch (err: any) {
      setError("Flight search failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Duffel API Test</h1>
          <p className="text-lg text-gray-600">Test your live flight booking integration</p>
        </div>

        {/* API Status Check */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Button onClick={checkAPIStatus} variant="outline">
                Check API Status
              </Button>
              {apiStatus && (
                <div className="flex items-center gap-2">
                  <Badge variant={apiStatus.mode === 'live' ? 'default' : 'secondary'}>
                    {apiStatus.mode === 'live' ? 'Live API' : 'Test Mode'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Status: {apiStatus.status}
                  </span>
                </div>
              )}
            </div>
            
            {apiStatus && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Mode:</strong> {apiStatus.mode}
                  </div>
                  <div>
                    <strong>Status:</strong> {apiStatus.status}
                  </div>
                  <div>
                    <strong>API Base:</strong> {apiStatus.api_base}
                  </div>
                  <div>
                    <strong>Token:</strong> {apiStatus.token_type}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flight Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Live Flight Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                  placeholder="LHR"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                  placeholder="JFK"
                />
              </div>
              <div>
                <Label htmlFor="departure">Departure Date</Label>
                <Input
                  id="departure"
                  type="date"
                  value={searchParams.departureDate}
                  onChange={(e) => setSearchParams({...searchParams, departureDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="adults">Adults</Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.passengers.adults}
                  onChange={(e) => setSearchParams({
                    ...searchParams, 
                    passengers: {...searchParams.passengers, adults: parseInt(e.target.value)}
                  })}
                />
              </div>
            </div>
            
            <Button 
              onClick={searchFlights} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Searching Live Flights...
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4 mr-2" />
                  Search Live Flights
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Results */}
        {searchResults && (
          <Card>
            <CardHeader>
              <CardTitle>Live Flight Results</CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.data && searchResults.data.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.data.slice(0, 5).map((offer: FlightOffer) => (
                    <div key={offer.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {offer.slices[0]?.segments[0]?.marketing_carrier?.name || 'Airline'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {offer.slices[0]?.segments[0]?.flight_number}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ${offer.display_price || offer.total_amount} {offer.total_currency}
                          </div>
                          <div className="text-sm text-gray-500">
                            Base: ${offer.base_amount} {offer.total_currency}
                          </div>
                        </div>
                      </div>
                      
                      {offer.slices.map((slice, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="font-semibold">
                                {formatTime(slice.departure_datetime)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {slice.origin.iata_code}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(slice.departure_datetime)}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-400">
                              <div className="text-xs">{slice.duration}</div>
                              <div className="w-16 h-px bg-gray-300"></div>
                              <Plane className="w-4 h-4" />
                            </div>
                            
                            <div className="text-center">
                              <div className="font-semibold">
                                {formatTime(slice.arrival_datetime)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {slice.destination.iata_code}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(slice.arrival_datetime)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {slice.segments[0]?.aircraft?.name || 'Aircraft TBD'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <strong>Live API Integration Successful!</strong>
                    </div>
                    <p className="text-green-700 mt-2">
                      Found {searchResults.data.length} real flight offers from Duffel API.
                      Your platform is now connected to live flight data with automatic pricing markup.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No flights found for this search. Try different airports or dates.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}