import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Bed, Utensils, MapPin } from "lucide-react";
import type { Package } from "@shared/schema";

export default function VacationPackages() {
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const response = await fetch("/api/packages");
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    }
  });

  const getIconForInclude = (include: string) => {
    if (include.toLowerCase().includes("flight")) return <Plane className="w-4 h-4" />;
    if (include.toLowerCase().includes("hotel") || include.toLowerCase().includes("accommodation")) return <Bed className="w-4 h-4" />;
    if (include.toLowerCase().includes("meal") || include.toLowerCase().includes("dining")) return <Utensils className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading vacation packages...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vacation Packages</h2>
          <p className="text-xl text-gray-600">All-inclusive deals combining flights, hotels, and activities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages?.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src={pkg.imageUrl} 
                alt={pkg.title}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    <p className="text-gray-600">{pkg.location}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-travel-orange text-white font-semibold">
                      Save ${pkg.savings}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{pkg.description}</p>
                <div className="space-y-3 mb-6">
                  {pkg.includes.map((include, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="text-travel-blue mr-3">
                        {getIconForInclude(include)}
                      </div>
                      <span>{include}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                    <span className="text-3xl font-bold text-travel-blue ml-2">${pkg.price}</span>
                    <span className="text-gray-600">/person</span>
                  </div>
                  <Button className="bg-travel-blue hover:bg-travel-blue-dark font-semibold px-6 py-3">
                    Book Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
