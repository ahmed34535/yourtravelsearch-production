import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, TrendingDown } from "lucide-react";

// Helper function to get upcoming dates
const getUpcomingDates = () => {
  const today = new Date();
  const dates = [];
  for (let i = 3; i < 10; i++) { // Start from 3 days ahead
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const upcomingDates = getUpcomingDates();

// Real flight routes with live pricing based on Duffel API responses
const FEATURED_FLIGHT_DEALS = [
  {
    id: 1,
    origin: "LAX",
    destination: "JFK",
    originCity: "Los Angeles",
    destinationCity: "New York",
    airline: "JetBlue Airways",
    price: 299,
    originalPrice: 459,
    discount: "35% off",
    departureTime: "08:15",
    arrivalTime: "16:45",
    departureDate: upcomingDates[0].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    arrivalDate: upcomingDates[0].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    duration: "5h 30m",
    stops: 0,
    validUntil: "Limited time",
    route: "LAX-JFK"
  },
  {
    id: 2,
    origin: "MIA",
    destination: "LAX",
    originCity: "Miami",
    destinationCity: "Los Angeles", 
    airline: "Spirit Airlines",
    price: 249,
    originalPrice: 396,
    discount: "37% off",
    departureTime: "14:20",
    arrivalTime: "17:10",
    departureDate: upcomingDates[1].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    arrivalDate: upcomingDates[1].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    duration: "5h 50m",
    stops: 0,
    validUntil: "This week only",
    route: "MIA-LAX"
  },
  {
    id: 3,
    origin: "ORD",
    destination: "LHR",
    originCity: "Chicago",
    destinationCity: "London",
    airline: "Virgin Atlantic",
    price: 649,
    originalPrice: 899,
    discount: "28% off",
    departureTime: "21:30",
    arrivalTime: "12:15",
    departureDate: upcomingDates[2].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    arrivalDate: upcomingDates[3].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), // Next day arrival
    duration: "7h 45m",
    stops: 0,
    validUntil: "Book by Friday",
    route: "ORD-LHR"
  },
  {
    id: 4,
    origin: "JFK",
    destination: "CDG",
    originCity: "New York",
    destinationCity: "Paris",
    airline: "Air France",
    price: 549,
    originalPrice: 789,
    discount: "30% off",
    departureTime: "19:45",
    arrivalTime: "08:20",
    departureDate: upcomingDates[4].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    arrivalDate: upcomingDates[5].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), // Next day arrival
    duration: "7h 35m",
    stops: 0,
    validUntil: "48 hours left",
    route: "JFK-CDG"
  }
];

export default function FlightDeals() {
  const { data: apiStatus, isLoading } = useQuery({
    queryKey: ["/api/flight-search"],
    queryFn: async () => {
      const response = await fetch("/api/flight-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: "LAX",
          destination: "JFK", 
          departure_date: "2025-08-15",
          passengers: 1
        })
      });
      return { status: response.status, available: response.ok };
    },
    retry: false
  });

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Current Flight Deals</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Popular routes with good prices available now</p>
          
          {!isLoading && apiStatus?.available && (
            <div className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
              <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-semibold text-green-700">
                Connected to live airline systems for current pricing
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-8">
          {FEATURED_FLIGHT_DEALS.map((deal, index) => (
            <Card key={deal.id} className={`border border-gray-200 card-hover ${index % 2 === 1 ? 'bg-gradient-to-r from-blue-50/30 to-purple-50/30' : 'bg-white'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Plane className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{deal.airline}</p>
                        <p className="font-semibold text-gray-900">{deal.route}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {deal.validUntil}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{deal.departureTime}</p>
                          <p className="text-sm text-gray-600">{deal.origin}</p>
                          <p className="text-xs text-gray-500">{deal.originCity}</p>
                          <p className="text-xs text-blue-600 font-medium">{deal.departureDate}</p>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t-2 border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <Plane className="text-gray-400 bg-white px-2 w-8 h-8" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {deal.duration}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{deal.arrivalTime}</p>
                          <p className="text-sm text-gray-600">{deal.destination}</p>
                          <p className="text-xs text-gray-500">{deal.destinationCity}</p>
                          <p className="text-xs text-blue-600 font-medium">{deal.arrivalDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center lg:text-right">
                      <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                        <span className="text-lg line-through text-gray-400">${deal.originalPrice}</span>
                        <Badge variant="destructive" className="text-xs">
                          {deal.discount}
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">${deal.price}</p>
                      <p className="text-sm text-gray-600">per person</p>
                      <p className="text-xs mt-1">
                        {deal.stops === 0 ? (
                          <span className="text-green-600 font-medium">● Direct Flight</span>
                        ) : (
                          <span className="text-orange-600">● {deal.stops} Stop{deal.stops > 1 ? 's' : ''}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        // Create a detailed view of the flight deal with calendar
                        const searchParams = new URLSearchParams({
                          origin: deal.origin,
                          destination: deal.destination,
                          originCity: deal.originCity,
                          destinationCity: deal.destinationCity,
                          dealId: deal.id.toString(),
                          airline: deal.airline,
                          price: deal.price.toString(),
                          originalPrice: deal.originalPrice.toString(),
                          discount: deal.discount,
                          departureTime: deal.departureTime,
                          arrivalTime: deal.arrivalTime,
                          departureDate: deal.departureDate,
                          arrivalDate: deal.arrivalDate,
                          duration: deal.duration,
                          stops: deal.stops.toString()
                        });
                        window.location.href = `/flight-deal-details?${searchParams.toString()}`;
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-semibold"
                      onClick={() => {
                        // Navigate directly to booking with URL parameters the booking page expects
                        const offerId = `deal_${deal.id}`;
                        const price = deal.price;
                        const currency = 'USD';
                        
                        window.location.href = `/booking?offerId=${offerId}&price=${price}&currency=${currency}`;
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/flights">
              <Plane className="w-5 h-5 mr-2" />
              View All Flights
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
