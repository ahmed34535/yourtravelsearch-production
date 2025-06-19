import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PackageSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchForm, setSearchForm] = useState({
    destination: "",
    departureDate: "",
    duration: "7",
    travelers: "2"
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to packages page
    setLocation("/packages");
    
    toast({
      title: "Searching Packages",
      description: "Finding the best vacation packages for you...",
    });
  };

  return (
    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="packageDestination">Destination</Label>
        <div className="relative">
          <Input
            id="packageDestination"
            placeholder="Where do you want to go?"
            value={searchForm.destination}
            onChange={(e) => handleInputChange("destination", e.target.value)}
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="packageDeparture">Departure</Label>
        <div className="relative">
          <Input
            id="packageDeparture"
            type="date"
            value={searchForm.departureDate}
            onChange={(e) => handleInputChange("departureDate", e.target.value)}
            className="pl-10"
          />
          <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <div className="relative">
          <Select value={searchForm.duration} onValueChange={(value) => handleInputChange("duration", value)}>
            <SelectTrigger className="pl-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Days</SelectItem>
              <SelectItem value="5">5 Days</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="10">10 Days</SelectItem>
              <SelectItem value="14">14 Days</SelectItem>
            </SelectContent>
          </Select>
          <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="packageTravelers">Travelers</Label>
        <div className="relative">
          <Select value={searchForm.travelers} onValueChange={(value) => handleInputChange("travelers", value)}>
            <SelectTrigger className="pl-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Traveler</SelectItem>
              <SelectItem value="2">2 Travelers</SelectItem>
              <SelectItem value="3">3 Travelers</SelectItem>
              <SelectItem value="4">4+ Travelers</SelectItem>
            </SelectContent>
          </Select>
          <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-4">
        <Button 
          type="submit"
          className="w-full bg-travel-blue hover:bg-travel-blue-dark text-lg font-semibold py-4"
        >
          Search Packages
        </Button>
      </div>
    </form>
  );
}
