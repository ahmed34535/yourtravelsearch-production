import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Building2, Wifi, Car, Coffee } from "lucide-react";

// Curated hotel destinations based on major travel hubs
const FEATURED_HOTELS = [
  {
    id: 1,
    name: "The Ritz-Carlton New York",
    location: "Central Park, New York",
    cityCode: "NYC",
    rating: 4.8,
    pricePerNight: 799,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["5-star luxury", "Central Park views", "Spa & wellness"],
    description: "Iconic luxury hotel overlooking Central Park"
  },
  {
    id: 2,
    name: "Hotel de Crillon",
    location: "Place de la Concorde, Paris",
    cityCode: "PAR",
    rating: 4.9,
    pricePerNight: 1299,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["Palace hotel", "Michelin dining", "Historic landmark"],
    description: "Palace hotel in the heart of Paris"
  },
  {
    id: 3,
    name: "The Peninsula Tokyo",
    location: "Marunouchi, Tokyo",
    cityCode: "TYO",
    rating: 4.7,
    pricePerNight: 899,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["Modern luxury", "Imperial Palace views", "Rooftop bar"],
    description: "Contemporary elegance in central Tokyo"
  },
  {
    id: 4,
    name: "Claridge's London",
    location: "Mayfair, London",
    cityCode: "LON",
    rating: 4.6,
    pricePerNight: 649,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["Art Deco style", "Afternoon tea", "Michelin star"],
    description: "Timeless British elegance and tradition"
  },
  {
    id: 5,
    name: "Burj Al Arab Dubai",
    location: "Jumeirah Beach, Dubai",
    cityCode: "DXB",
    rating: 4.9,
    pricePerNight: 2199,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["7-star luxury", "Private beach", "Helicopter pad"],
    description: "World's most luxurious hotel experience"
  },
  {
    id: 6,
    name: "Park Hyatt Sydney",
    location: "Circular Quay, Sydney",
    cityCode: "SYD",
    rating: 4.5,
    pricePerNight: 759,
    imageUrl: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["Harbor views", "Opera House location", "Waterfront dining"],
    description: "Premium harbor views and iconic location"
  }
];

export default function FeaturedHotels() {
  const { data: apiStatus, isLoading } = useQuery({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const response = await fetch("/api/hotels");
      return { status: response.status, available: response.ok };
    },
    retry: false
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars ? "text-yellow-400 fill-current" : 
              i === fullStars && hasHalf ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
          <p className="text-xl text-gray-600">Handpicked accommodations for your perfect stay</p>
          

        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_HOTELS.map((hotel) => (
            <Link key={hotel.id} href={`/hotels?city=${hotel.cityCode}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                <img 
                  src={hotel.imageUrl} 
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{hotel.name}</h3>
                    {renderStars(hotel.rating)}
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <p className="text-sm line-clamp-1">{hotel.location}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{hotel.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">${hotel.pricePerNight}</span>
                      <span className="text-gray-600 text-sm">/night</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border">
                      <span className="text-xs font-medium text-gray-800">{hotel.cityCode}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/hotels">
              <Building2 className="w-5 h-5 mr-2" />
              Explore All Hotels
            </Link>
          </Button>
          <div className="mt-4">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-lg border border-orange-200">
              <span className="text-sm font-medium">Hotel Booking - Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
