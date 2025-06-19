import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AirportAutocomplete } from "@/components/ui/airport-autocomplete";
import { PlaneTakeoff, PlaneLanding } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FlightSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  // Set tomorrow as default departure date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];
  
  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
    departureDate: defaultDate,
    travelers: "1"
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!searchForm.origin || !searchForm.destination || !searchForm.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in origin, destination, and departure date.",
        variant: "destructive"
      });
      return;
    }

    // Validate IATA codes (3 letters)
    const iataRegex = /^[A-Z]{3}$/;
    if (!iataRegex.test(searchForm.origin)) {
      toast({
        title: "Invalid Origin",
        description: "Please enter a valid 3-letter airport code (e.g., LAX)",
        variant: "destructive"
      });
      return;
    }

    if (!iataRegex.test(searchForm.destination)) {
      toast({
        title: "Invalid Destination", 
        description: "Please enter a valid 3-letter airport code (e.g., JFK)",
        variant: "destructive"
      });
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(searchForm.departureDate)) {
      toast({
        title: "Invalid Date",
        description: "Please enter date in YYYY-MM-DD format",
        variant: "destructive"
      });
      return;
    }

    // Validate at least 1 passenger
    const travelers = parseInt(searchForm.travelers);
    if (isNaN(travelers) || travelers < 1) {
      toast({
        title: "Invalid Passengers",
        description: "At least 1 passenger is required",
        variant: "destructive"
      });
      return;
    }

    // Navigate to flights page with search parameters
    const params = new URLSearchParams();
    if (searchForm.origin) params.append("origin", searchForm.origin);
    if (searchForm.destination) params.append("destination", searchForm.destination);
    if (searchForm.departureDate) params.append("departureDate", searchForm.departureDate);
    params.append("adults", searchForm.travelers);
    params.append("cabin_class", "economy");
    
    console.log("[Flight Search] Navigating with params:", Object.fromEntries(params.entries()));
    console.log("[Flight Search] Form data:", searchForm);
    
    setLocation(`/flight-results?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AirportAutocomplete
        label="From"
        placeholder="New York (NYC)"
        value={searchForm.origin}
        onChange={(value) => handleInputChange("origin", value)}
      />
      <AirportAutocomplete
        label="To"
        placeholder="Los Angeles (LAX)"
        value={searchForm.destination}
        onChange={(value) => handleInputChange("destination", value)}
      />
      <div className="space-y-2">
        <Label htmlFor="departureDate">Departure</Label>
        <Input
          id="departureDate"
          type="date"
          value={searchForm.departureDate}
          onChange={(e) => handleInputChange("departureDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="travelers">Travelers</Label>
        <Select value={searchForm.travelers} onValueChange={(value) => handleInputChange("travelers", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Adult</SelectItem>
            <SelectItem value="2">2 Adults</SelectItem>
            <SelectItem value="3">3 Adults</SelectItem>
            <SelectItem value="4">4+ Adults</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2 lg:col-span-4">
        <Button 
          type="submit"
          className="w-full bg-travel-blue hover:bg-travel-blue-dark text-lg font-semibold py-4"
        >
          Search Flights
        </Button>
      </div>
    </form>
  );
}
