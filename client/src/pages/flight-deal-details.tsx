import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, Calendar, MapPin, Users, Wifi, Utensils, TrendingDown, ArrowLeft } from "lucide-react";
import { format, parse } from "date-fns";

interface FlightDealDetails {
  id: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  airline: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  stops?: string;
}

export default function FlightDealDetails() {
  const [, setLocation] = useLocation();
  const [dealDetails, setDealDetails] = useState<FlightDealDetails | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const details: FlightDealDetails = {
      id: urlParams.get('dealId') || '',
      origin: urlParams.get('origin') || '',
      destination: urlParams.get('destination') || '',
      originCity: urlParams.get('originCity') || '',
      destinationCity: urlParams.get('destinationCity') || '',
      airline: urlParams.get('airline') || '',
      price: urlParams.get('price') || '',
      originalPrice: urlParams.get('originalPrice') || '',
      discount: urlParams.get('discount') || '',
      departureTime: urlParams.get('departureTime') || '',
      arrivalTime: urlParams.get('arrivalTime') || '',
      departureDate: urlParams.get('departureDate') || '',
      arrivalDate: urlParams.get('arrivalDate') || '',
      duration: urlParams.get('duration') || '',
      stops: urlParams.get('stops') || '0'
    };
    
    setDealDetails(details);
  }, []);

  if (!dealDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    // Navigate to flight search with pre-filled data
    const searchParams = new URLSearchParams({
      origin: dealDetails.origin,
      destination: dealDetails.destination,
      departureDate: new Date().toISOString().split('T')[0], // Today's date for search
      passengers: '1'
    });
    setLocation(`/flight-results?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Deals</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Flight Deal Details</h1>
                <p className="text-gray-600">{dealDetails.airline} • {dealDetails.origin} to {dealDetails.destination}</p>
              </div>
            </div>
            <div className="text-right">
              {dealDetails.originalPrice && (
                <p className="text-lg line-through text-gray-400">${dealDetails.originalPrice}</p>
              )}
              <p className="text-3xl font-bold text-blue-600">${dealDetails.price}</p>
              <p className="text-sm text-gray-600">per person</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Flight Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Flight Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Departure Calendar */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-blue-800 mb-2">Departure</h3>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-gray-900">{dealDetails.departureDate.split(', ')[0]}</div>
                        <div className="text-lg font-semibold text-blue-600">{dealDetails.departureDate.split(', ')[1]}</div>
                        <div className="text-2xl font-bold text-gray-800 mt-2">{dealDetails.departureTime}</div>
                        <div className="text-sm text-gray-600 mt-1">{dealDetails.originCity} ({dealDetails.origin})</div>
                      </div>
                    </div>
                  </div>

                  {/* Arrival Calendar */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-green-800 mb-2">Arrival</h3>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-gray-900">{dealDetails.arrivalDate.split(', ')[0]}</div>
                        <div className="text-lg font-semibold text-green-600">{dealDetails.arrivalDate.split(', ')[1]}</div>
                        <div className="text-2xl font-bold text-gray-800 mt-2">{dealDetails.arrivalTime}</div>
                        <div className="text-sm text-gray-600 mt-1">{dealDetails.destinationCity} ({dealDetails.destination})</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flight Duration */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Flight Duration: {dealDetails.duration}</span>
                  </div>
                  <div className="mt-2">
                    {parseInt(dealDetails.stops || '0') === 0 ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Direct Flight
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {dealDetails.stops} Stop{parseInt(dealDetails.stops || '0') > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span>Flight Summary</span>
                  {dealDetails.discount && (
                    <Badge variant="destructive" className="ml-auto">
                      {dealDetails.discount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="mb-2">
                      <p className="text-3xl font-bold text-gray-900">{dealDetails.departureTime}</p>
                      <p className="text-lg font-semibold text-gray-700">{dealDetails.origin}</p>
                      <p className="text-sm text-gray-600">{dealDetails.originCity}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{dealDetails.departureDate}</span>
                    </div>
                  </div>

                  {/* Flight Path */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-blue-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <Plane className="text-blue-600 bg-gray-50 px-2 w-8 h-8" />
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-600 flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {dealDetails.duration}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {parseInt(dealDetails.stops || '0') === 0 ? (
                          <span className="text-green-600 font-medium">Direct Flight</span>
                        ) : (
                          <span className="text-orange-600">{dealDetails.stops} Stop{parseInt(dealDetails.stops || '0') > 1 ? 's' : ''}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="mb-2">
                      <p className="text-3xl font-bold text-gray-900">{dealDetails.arrivalTime}</p>
                      <p className="text-lg font-semibold text-gray-700">{dealDetails.destination}</p>
                      <p className="text-sm text-gray-600">{dealDetails.destinationCity}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{dealDetails.arrivalDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Airline Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Airline Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{dealDetails.airline}</h3>
                    <p className="text-gray-600 mb-4">Premium airline service with excellent safety record and customer satisfaction ratings.</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Complimentary Wi-Fi</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Utensils className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Meal & Beverage Service</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Personal Entertainment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Baggage Policy</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>• Carry-on: 1 bag up to 22 lbs</p>
                      <p>• Personal item: 1 small bag</p>
                      <p>• Checked bag: Additional fees apply</p>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 mt-4">Aircraft Type</h4>
                    <p className="text-sm text-gray-600">Boeing 737-800 or similar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span>Why This Deal is Great</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Significant Savings</h4>
                      <p className="text-sm text-gray-600">Save {dealDetails.discount || '35%'} compared to regular prices</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Optimal Travel Time</h4>
                      <p className="text-sm text-gray-600">Convenient departure and arrival times</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Reliable Airline</h4>
                      <p className="text-sm text-gray-600">Excellent on-time performance record</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Flexible Booking</h4>
                      <p className="text-sm text-gray-600">24-hour free cancellation policy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold">${dealDetails.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  {dealDetails.originalPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Regular Price</span>
                      <span className="line-through text-gray-400">${dealDetails.originalPrice}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-blue-600">${dealDetails.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Price per person</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBookNow}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  size="lg"
                >
                  Book This Flight
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Secure booking • No hidden fees • 24/7 support
                </p>
              </CardContent>
            </Card>

            {/* Travel Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">Check-in</h4>
                    <p className="text-gray-600">Online check-in opens 24 hours before departure</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Arrival Time</h4>
                    <p className="text-gray-600">Arrive at airport 2 hours before domestic flights</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Documentation</h4>
                    <p className="text-gray-600">Valid ID required for all passengers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}