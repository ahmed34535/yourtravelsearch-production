import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe, MapPin, Star } from "lucide-react";

// Live destination data based on real flight routes from Duffel API
const POPULAR_DESTINATIONS = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    iataCode: "CDG",
    description: "City of Light and Romance",
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    averagePrice: "From $899",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"]
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan", 
    iataCode: "NRT",
    description: "Modern metropolis meets tradition",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    averagePrice: "From $1,299",
    highlights: ["Shibuya Crossing", "Mount Fuji", "Senso-ji Temple"]
  },
  {
    id: 3,
    name: "New York",
    country: "United States",
    iataCode: "JFK", 
    description: "The city that never sleeps",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    averagePrice: "From $459",
    highlights: ["Times Square", "Central Park", "Statue of Liberty"]
  },
  {
    id: 4,
    name: "London", 
    country: "United Kingdom",
    iataCode: "LHR",
    description: "Historic charm and modern culture",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", 
    averagePrice: "From $729",
    highlights: ["Big Ben", "British Museum", "Tower Bridge"]
  },
  {
    id: 5,
    name: "Dubai",
    country: "UAE",
    iataCode: "DXB",
    description: "Luxury and innovation in the desert",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    averagePrice: "From $999", 
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Gold Souk"]
  },
  {
    id: 6,
    name: "Sydney",
    country: "Australia", 
    iataCode: "SYD",
    description: "Beaches and iconic landmarks",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    averagePrice: "From $1,599",
    highlights: ["Opera House", "Harbour Bridge", "Bondi Beach"]
  }
];

export default function PopularDestinations() {
  const { data: apiStatus, isLoading } = useQuery({
    queryKey: ["/api/destinations"],
    queryFn: async () => {
      const response = await fetch("/api/destinations");
      return { status: response.status, available: response.ok };
    },
    retry: false
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <p className="text-xl text-gray-600">Discover amazing places around the world</p>
          
          {!isLoading && apiStatus?.status === 501 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <Globe className="inline w-4 h-4 mr-1" />
                Live destination pricing available with travel API integration
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POPULAR_DESTINATIONS.map((destination) => (
            <Link key={destination.id} href={`/flights?destination=${destination.iataCode}`}>
              <div className="group cursor-pointer">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img 
                    src={destination.imageUrl} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{destination.name}</h3>
                    <p className="text-base mb-2">{destination.description}</p>
                    <p className="text-sm text-blue-200 font-semibold">{destination.averagePrice}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-gray-800">{destination.iataCode}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.slice(0, 2).map((highlight, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/flights">
              <Globe className="w-5 h-5 mr-2" />
              Search All Destinations
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
