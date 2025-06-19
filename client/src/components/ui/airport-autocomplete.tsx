import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plane } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Airport {
  id: string;
  iata_code: string;
  icao_code: string;
  name: string;
  city_name: string;
  country_code: string;
  country_name: string;
  time_zone: string;
}

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AirportAutocomplete({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  className 
}: AirportAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search airports when input changes
  const { data: airports, isLoading } = useQuery({
    queryKey: ['/api/airports', inputValue],
    queryFn: () => inputValue.length >= 2 ? apiRequest('GET', `/api/airports?q=${encodeURIComponent(inputValue)}`) : null,
    enabled: inputValue.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedAirport(null);
    onChange(newValue);
    
    if (newValue.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleAirportSelect = (airport: Airport) => {
    const displayValue = `${airport.city_name} (${airport.iata_code})`;
    setInputValue(displayValue);
    setSelectedAirport(airport);
    onChange(airport.iata_code);
    setIsOpen(false);
  };

  const airportList = (airports as any)?.data || [];

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={label.toLowerCase()}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Plane className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Selected airport info */}
        {selectedAirport && (
          <div className="mt-1">
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {selectedAirport.name}, {selectedAirport.country_name}
            </Badge>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching airports...
            </div>
          ) : airportList.length > 0 ? (
            <div className="py-1">
              {airportList.slice(0, 8).map((airport: Airport) => (
                <button
                  key={airport.id}
                  onClick={() => handleAirportSelect(airport)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {airport.city_name}
                        <span className="ml-2 text-blue-600 font-semibold">
                          {airport.iata_code}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {airport.name}, {airport.country_name}
                      </div>
                    </div>
                    <Plane className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          ) : inputValue.length >= 2 ? (
            <div className="p-3 text-center text-gray-500">
              <div className="mb-2">No airports found for "{inputValue}"</div>
              <div className="text-xs text-gray-400">
                Try searching for city names (e.g., "New York", "London") or airport codes (e.g., "JFK", "LHR")
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}