import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HotelSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchForm, setSearchForm] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "2"
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchForm.location) {
      toast({
        title: "Missing Information",
        description: "Please enter a destination or hotel name.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to hotels page with search parameters
    const params = new URLSearchParams();
    if (searchForm.location) params.append("location", searchForm.location);
    
    setLocation(`/hotels?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="hotelLocation">Destination</Label>
        <div className="relative">
          <Input
            id="hotelLocation"
            placeholder="City or hotel name"
            value={searchForm.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkIn">Check-in</Label>
        <div className="relative">
          <Input
            id="checkIn"
            type="date"
            value={searchForm.checkIn}
            onChange={(e) => handleInputChange("checkIn", e.target.value)}
            className="pl-10"
          />
          <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkOut">Check-out</Label>
        <div className="relative">
          <Input
            id="checkOut"
            type="date"
            value={searchForm.checkOut}
            onChange={(e) => handleInputChange("checkOut", e.target.value)}
            className="pl-10"
          />
          <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="guests">Guests</Label>
        <div className="relative">
          <Select value={searchForm.guests} onValueChange={(value) => handleInputChange("guests", value)}>
            <SelectTrigger className="pl-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Guest</SelectItem>
              <SelectItem value="2">2 Guests</SelectItem>
              <SelectItem value="3">3 Guests</SelectItem>
              <SelectItem value="4">4+ Guests</SelectItem>
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
          Search Hotels
        </Button>
      </div>
    </form>
  );
}
