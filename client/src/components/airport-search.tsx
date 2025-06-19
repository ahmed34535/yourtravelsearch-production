import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface Airport {
  iata_code: string;
  name: string;
  city_name?: string;
  iata_country_code: string;
}

interface AirportSearchProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: () => void; // Called when an airport is selected from dropdown
  id: string;
  className?: string;
}

export default function AirportSearch({ label, placeholder, value, onChange, onSelect, id, className }: AirportSearchProps) {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search airports as user types
  const searchAirports = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/airports?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Airport search results:', data.data?.length || 0, 'airports found for', query);
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Airport search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('Searching for airports, value:', value, 'length:', value.length);
      searchAirports(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSuggestionClick = (airport: Airport) => {
    const displayValue = `${airport.iata_code} - ${airport.name}`;
    onChange(displayValue);
    setShowSuggestions(false);
    // Trigger onSelect callback if provided
    if (onSelect) {
      onSelect();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2" ref={searchRef}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          className="pr-8"
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Suggestions dropdown - positioned absolutely within relative container */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.slice(0, 8).map((airport, index) => (
              <div
                key={`${airport.iata_code}-${index}`}
                onClick={() => handleSuggestionClick(airport)}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">{airport.iata_code}</span>
                    <span className="text-gray-600 truncate">{airport.name}</span>
                  </div>
                  {airport.city_name && (
                    <div className="text-sm text-gray-500 truncate">
                      {airport.city_name}, {airport.iata_country_code}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {showSuggestions && suggestions.length === 0 && !isLoading && value.length >= 2 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="px-4 py-3 text-gray-500 text-center">
              No airports found for "{value}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}