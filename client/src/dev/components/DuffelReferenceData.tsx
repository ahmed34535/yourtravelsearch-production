import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plane, 
  MapPin, 
  Building, 
  Globe, 
  Search, 
  Filter,
  RefreshCw,
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';

// Duffel Reference Data Types
export interface DuffelAirline {
  id: string;
  name: string;
  iata_code?: string;
  logo_symbol_url?: string;
  logo_lockup_url?: string;
  conditions_of_carriage_url?: string;
}

export interface DuffelAircraft {
  id: string;
  name: string;
  iata_code: string;
}

export interface DuffelAirport {
  id: string;
  name: string;
  iata_code: string;
  iata_city_code: string;
  iata_country_code: string;
  icao_code?: string;
  city_name: string;
  latitude: number;
  longitude: number;
  time_zone: string;
  city?: DuffelCity;
}

export interface DuffelCity {
  id: string;
  name: string;
  iata_code: string;
  iata_country_code: string;
  airports: DuffelAirport[];
}

export interface DuffelPlace {
  id: string;
  name: string;
  iata_code: string;
  iata_country_code: string;
  type: 'airport' | 'city';
  iata_city_code?: string;
  icao_code?: string;
  city_name?: string;
  latitude?: number;
  longitude?: number;
  time_zone?: string;
  city?: DuffelCity;
  airports?: DuffelAirport[];
}

export interface DuffelLoyaltyProgramme {
  id: string;
  name: string;
  owner_airline_id: string;
  logo_url?: string;
  alliance?: string;
}

// Airlines Component
export function AirlinesList() {
  const [airlines, setAirlines] = useState<DuffelAirline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    country: ''
  });

  // Mock data following Duffel specifications
  useEffect(() => {
    const mockAirlines: DuffelAirline[] = [
      {
        id: 'arl_00001876aqC8c5umZmrRds',
        name: 'British Airways',
        iata_code: 'BA',
        logo_symbol_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/BA.svg',
        logo_lockup_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/BA.svg',
        conditions_of_carriage_url: 'https://www.britishairways.com/en-gb/information/legal/british-airways/general-conditions-of-carriage'
      },
      {
        id: 'arl_00001876aqC8c5umZmrRdt',
        name: 'Emirates',
        iata_code: 'EK',
        logo_symbol_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/EK.svg',
        logo_lockup_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/EK.svg'
      },
      {
        id: 'arl_00001876aqC8c5umZmrRdu',
        name: 'American Airlines',
        iata_code: 'AA',
        logo_symbol_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/AA.svg',
        logo_lockup_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AA.svg'
      },
      {
        id: 'arl_00001876aqC8c5umZmrRdv',
        name: 'Lufthansa',
        iata_code: 'LH',
        logo_symbol_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/LH.svg',
        logo_lockup_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/LH.svg'
      },
      {
        id: 'arl_00001876aqC8c5umZmrRdw',
        name: 'Singapore Airlines',
        iata_code: 'SQ',
        logo_symbol_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/SQ.svg',
        logo_lockup_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/SQ.svg'
      }
    ];

    setTimeout(() => {
      setAirlines(mockAirlines);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredAirlines = airlines.filter(airline => {
    const matchesSearch = !filters.search || 
      airline.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      airline.iata_code?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search airlines by name or IATA code..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <Button 
              onClick={() => setFilters({ search: '', country: '' })}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Airlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredAirlines.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No airlines found</h3>
                <p className="text-gray-500">Try adjusting your search criteria.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredAirlines.map((airline) => (
            <Card key={airline.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {airline.logo_symbol_url ? (
                      <img 
                        src={airline.logo_symbol_url} 
                        alt={airline.name}
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                        <Plane className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                    {airline.iata_code && (
                      <Badge variant="outline">{airline.iata_code}</Badge>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm">{airline.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{airline.id}</p>
                  </div>

                  {airline.conditions_of_carriage_url && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => window.open(airline.conditions_of_carriage_url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Conditions of Carriage
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Aircraft Component
export function AircraftList() {
  const [aircraft, setAircraft] = useState<DuffelAircraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockAircraft: DuffelAircraft[] = [
      {
        id: 'arc_00009UhD4ongolulWd91Ky',
        name: 'Airbus Industries A380',
        iata_code: '380'
      },
      {
        id: 'arc_00009UhD4ongolulWd91Kz',
        name: 'Boeing 777-300ER',
        iata_code: '77W'
      },
      {
        id: 'arc_00009UhD4ongolulWd91K1',
        name: 'Airbus A350-900',
        iata_code: '359'
      },
      {
        id: 'arc_00009UhD4ongolulWd91K2',
        name: 'Boeing 787-9 Dreamliner',
        iata_code: '789'
      },
      {
        id: 'arc_00009UhD4ongolulWd91K3',
        name: 'Airbus A321neo',
        iata_code: '32Q'
      },
      {
        id: 'arc_00009UhD4ongolulWd91K4',
        name: 'Boeing 737 MAX 8',
        iata_code: '7M8'
      }
    ];

    setTimeout(() => {
      setAircraft(mockAircraft);
      setIsLoading(false);
    }, 600);
  }, []);

  const filteredAircraft = aircraft.filter(plane =>
    !searchTerm || 
    plane.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plane.iata_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search aircraft by name or IATA code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredAircraft.map((plane) => (
            <Card key={plane.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{plane.name}</h3>
                    <Badge variant="outline">{plane.iata_code}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{plane.id}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Airports Component
export function AirportsList() {
  const [airports, setAirports] = useState<DuffelAirport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    country: ''
  });

  useEffect(() => {
    const mockAirports: DuffelAirport[] = [
      {
        id: 'arp_lhr_gb',
        name: 'Heathrow',
        iata_code: 'LHR',
        iata_city_code: 'LON',
        iata_country_code: 'GB',
        icao_code: 'EGLL',
        city_name: 'London',
        latitude: 51.4700,
        longitude: -0.4543,
        time_zone: 'Europe/London'
      },
      {
        id: 'arp_jfk_us',
        name: 'John F. Kennedy International Airport',
        iata_code: 'JFK',
        iata_city_code: 'NYC',
        iata_country_code: 'US',
        icao_code: 'KJFK',
        city_name: 'New York',
        latitude: 40.6413,
        longitude: -73.7781,
        time_zone: 'America/New_York'
      },
      {
        id: 'arp_dxb_ae',
        name: 'Dubai International Airport',
        iata_code: 'DXB',
        iata_city_code: 'DXB',
        iata_country_code: 'AE',
        icao_code: 'OMDB',
        city_name: 'Dubai',
        latitude: 25.2532,
        longitude: 55.3657,
        time_zone: 'Asia/Dubai'
      },
      {
        id: 'arp_sin_sg',
        name: 'Singapore Changi Airport',
        iata_code: 'SIN',
        iata_city_code: 'SIN',
        iata_country_code: 'SG',
        icao_code: 'WSSS',
        city_name: 'Singapore',
        latitude: 1.3644,
        longitude: 103.9915,
        time_zone: 'Asia/Singapore'
      }
    ];

    setTimeout(() => {
      setAirports(mockAirports);
      setIsLoading(false);
    }, 700);
  }, []);

  const filteredAirports = airports.filter(airport => {
    const matchesSearch = !filters.search || 
      airport.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      airport.iata_code.toLowerCase().includes(filters.search.toLowerCase()) ||
      airport.city_name.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCountry = !filters.country || airport.iata_country_code === filters.country;
    
    return matchesSearch && matchesCountry;
  });

  const uniqueCountries = Array.from(new Set(airports.map(a => a.iata_country_code))).sort();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search airports by name, IATA code, or city..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border rounded-md"
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <Button 
                onClick={() => setFilters({ search: '', country: '' })}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredAirports.map((airport) => (
            <Card key={airport.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{airport.name}</h3>
                      <p className="text-xs text-gray-500">{airport.city_name}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline">{airport.iata_code}</Badge>
                      <Badge variant="secondary">{airport.iata_country_code}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">ICAO:</span> {airport.icao_code || 'N/A'}
                    </div>
                    <div>
                      <span className="text-gray-500">City:</span> {airport.iata_city_code}
                    </div>
                    <div>
                      <span className="text-gray-500">Lat:</span> {airport.latitude.toFixed(4)}
                    </div>
                    <div>
                      <span className="text-gray-500">Lng:</span> {airport.longitude.toFixed(4)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    {airport.time_zone}
                  </div>
                  
                  <p className="text-xs text-gray-400 font-mono">{airport.id}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Cities Component
export function CitiesList() {
  const [cities, setCities] = useState<DuffelCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockCities: DuffelCity[] = [
      {
        id: 'cit_lon_gb',
        name: 'London',
        iata_code: 'LON',
        iata_country_code: 'GB',
        airports: [
          {
            id: 'arp_lhr_gb',
            name: 'Heathrow',
            iata_code: 'LHR',
            iata_city_code: 'LON',
            iata_country_code: 'GB',
            icao_code: 'EGLL',
            city_name: 'London',
            latitude: 51.4700,
            longitude: -0.4543,
            time_zone: 'Europe/London'
          },
          {
            id: 'arp_lgw_gb',
            name: 'Gatwick',
            iata_code: 'LGW',
            iata_city_code: 'LON',
            iata_country_code: 'GB',
            icao_code: 'EGKK',
            city_name: 'London',
            latitude: 51.1481,
            longitude: -0.1903,
            time_zone: 'Europe/London'
          }
        ]
      },
      {
        id: 'cit_nyc_us',
        name: 'New York',
        iata_code: 'NYC',
        iata_country_code: 'US',
        airports: [
          {
            id: 'arp_jfk_us',
            name: 'John F. Kennedy International Airport',
            iata_code: 'JFK',
            iata_city_code: 'NYC',
            iata_country_code: 'US',
            icao_code: 'KJFK',
            city_name: 'New York',
            latitude: 40.6413,
            longitude: -73.7781,
            time_zone: 'America/New_York'
          },
          {
            id: 'arp_lga_us',
            name: 'LaGuardia Airport',
            iata_code: 'LGA',
            iata_city_code: 'NYC',
            iata_country_code: 'US',
            icao_code: 'KLGA',
            city_name: 'New York',
            latitude: 40.7769,
            longitude: -73.8740,
            time_zone: 'America/New_York'
          }
        ]
      }
    ];

    setTimeout(() => {
      setCities(mockCities);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredCities = cities.filter(city =>
    !searchTerm || 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.iata_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search cities by name or IATA code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredCities.map((city) => (
            <Card key={city.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{city.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{city.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{city.iata_code}</Badge>
                      <Badge variant="secondary">{city.iata_country_code}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Airports ({city.airports.length})
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {city.airports.map((airport) => (
                        <div key={airport.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{airport.name}</h4>
                            <Badge variant="outline" className="text-xs">{airport.iata_code}</Badge>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>ICAO: {airport.icao_code || 'N/A'}</div>
                            <div>Coordinates: {airport.latitude.toFixed(4)}, {airport.longitude.toFixed(4)}</div>
                            <div className="font-mono text-gray-400">{airport.id}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Places Component
export function PlacesList() {
  const [places, setPlaces] = useState<DuffelPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '' as '' | 'airport' | 'city'
  });

  useEffect(() => {
    const mockPlaces: DuffelPlace[] = [
      {
        id: 'arp_lhr_gb',
        name: 'Heathrow',
        iata_code: 'LHR',
        iata_country_code: 'GB',
        type: 'airport',
        iata_city_code: 'LON',
        icao_code: 'EGLL',
        city_name: 'London',
        latitude: 51.4700,
        longitude: -0.4543,
        time_zone: 'Europe/London'
      },
      {
        id: 'cit_lon_gb',
        name: 'London',
        iata_code: 'LON',
        iata_country_code: 'GB',
        type: 'city',
        airports: [
          {
            id: 'arp_lhr_gb',
            name: 'Heathrow',
            iata_code: 'LHR',
            iata_city_code: 'LON',
            iata_country_code: 'GB',
            icao_code: 'EGLL',
            city_name: 'London',
            latitude: 51.4700,
            longitude: -0.4543,
            time_zone: 'Europe/London'
          }
        ]
      },
      {
        id: 'arp_jfk_us',
        name: 'John F. Kennedy International Airport',
        iata_code: 'JFK',
        iata_country_code: 'US',
        type: 'airport',
        iata_city_code: 'NYC',
        icao_code: 'KJFK',
        city_name: 'New York',
        latitude: 40.6413,
        longitude: -73.7781,
        time_zone: 'America/New_York'
      },
      {
        id: 'cit_nyc_us',
        name: 'New York',
        iata_code: 'NYC',
        iata_country_code: 'US',
        type: 'city'
      }
    ];

    setTimeout(() => {
      setPlaces(mockPlaces);
      setIsLoading(false);
    }, 600);
  }, []);

  const filteredPlaces = places.filter(place => {
    const matchesSearch = !filters.search || 
      place.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      place.iata_code.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = !filters.type || place.type === filters.type;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search places by name or IATA code..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border rounded-md"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as '' | 'airport' | 'city' }))}
              >
                <option value="">All Types</option>
                <option value="airport">Airports</option>
                <option value="city">Cities</option>
              </select>
              <Button 
                onClick={() => setFilters({ search: '', type: '' })}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredPlaces.map((place) => (
            <Card key={place.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{place.name}</h3>
                      {place.city_name && place.type === 'airport' && (
                        <p className="text-xs text-gray-500">{place.city_name}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline">{place.iata_code}</Badge>
                      <Badge variant={place.type === 'airport' ? 'default' : 'secondary'}>
                        {place.type}
                      </Badge>
                    </div>
                  </div>
                  
                  {place.type === 'airport' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">ICAO:</span> {place.icao_code || 'N/A'}
                      </div>
                      <div>
                        <span className="text-gray-500">City:</span> {place.iata_city_code || 'N/A'}
                      </div>
                      {place.latitude && place.longitude && (
                        <>
                          <div>
                            <span className="text-gray-500">Lat:</span> {place.latitude.toFixed(4)}
                          </div>
                          <div>
                            <span className="text-gray-500">Lng:</span> {place.longitude.toFixed(4)}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {place.time_zone && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {place.time_zone}
                    </div>
                  )}
                  
                  {place.type === 'city' && place.airports && (
                    <div className="text-xs text-gray-600">
                      {place.airports.length} airport{place.airports.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400 font-mono">{place.id}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Loyalty Programmes Component
export function LoyaltyProgrammesList() {
  const [programmes, setProgrammes] = useState<DuffelLoyaltyProgramme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockProgrammes: DuffelLoyaltyProgramme[] = [
      {
        id: 'loy_00001876aqC8c5umZmrRds',
        name: 'AAdvantage',
        owner_airline_id: 'arl_00001876aqC8c5umZmrRds',
        logo_url: 'https://assets.duffel.com/img/loyalty-programmes/full-color-logo/AA-AAdvantage.svg',
        alliance: 'Oneworld'
      },
      {
        id: 'loy_00001876aqC8c5umZmrRdt',
        name: 'Executive Club',
        owner_airline_id: 'arl_00001876aqC8c5umZmrRdt',
        logo_url: 'https://assets.duffel.com/img/loyalty-programmes/full-color-logo/BA-ExecutiveClub.svg',
        alliance: 'Oneworld'
      },
      {
        id: 'loy_00001876aqC8c5umZmrRdu',
        name: 'Miles & More',
        owner_airline_id: 'arl_00001876aqC8c5umZmrRdu',
        logo_url: 'https://assets.duffel.com/img/loyalty-programmes/full-color-logo/LH-MilesMore.svg',
        alliance: 'Star Alliance'
      },
      {
        id: 'loy_00001876aqC8c5umZmrRdv',
        name: 'KrisFlyer',
        owner_airline_id: 'arl_00001876aqC8c5umZmrRdv',
        logo_url: 'https://assets.duffel.com/img/loyalty-programmes/full-color-logo/SQ-KrisFlyer.svg',
        alliance: 'Star Alliance'
      },
      {
        id: 'loy_00001876aqC8c5umZmrRdw',
        name: 'Skywards',
        owner_airline_id: 'arl_00001876aqC8c5umZmrRdw',
        logo_url: 'https://assets.duffel.com/img/loyalty-programmes/full-color-logo/EK-Skywards.svg'
      }
    ];

    setTimeout(() => {
      setProgrammes(mockProgrammes);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredProgrammes = programmes.filter(programme =>
    !searchTerm || 
    programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    programme.alliance?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedByAlliance = filteredProgrammes.reduce((acc, programme) => {
    const alliance = programme.alliance || 'Independent';
    if (!acc[alliance]) {
      acc[alliance] = [];
    }
    acc[alliance].push(programme);
    return acc;
  }, {} as Record<string, DuffelLoyaltyProgramme[]>);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search loyalty programmes by name or alliance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          Object.entries(groupedByAlliance).map(([alliance, programmes]) => (
            <Card key={alliance}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {alliance}
                  <Badge variant="outline">{programmes.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programmes.map((programme) => (
                    <div key={programme.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {programme.logo_url ? (
                            <img 
                              src={programme.logo_url} 
                              alt={programme.name}
                              className="h-8 w-8 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                              <Plane className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm">{programme.name}</h4>
                          <p className="text-xs text-gray-500 font-mono">{programme.owner_airline_id}</p>
                        </div>
                        
                        <p className="text-xs text-gray-400 font-mono">{programme.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Main Reference Data Demo Component
export function DuffelReferenceDataDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Reference Data</h2>
        <p className="text-gray-600">
          Comprehensive airline, aircraft, airport, and city information for flight booking systems
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Reference data provides essential information about airlines, aircraft types, airports, and cities 
          used throughout the Duffel ecosystem for flight search and booking operations.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="airlines" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="airlines" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Airlines
          </TabsTrigger>
          <TabsTrigger value="aircraft" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Aircraft
          </TabsTrigger>
          <TabsTrigger value="airports" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Airports
          </TabsTrigger>
          <TabsTrigger value="cities" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Cities
          </TabsTrigger>
          <TabsTrigger value="places" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Places
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Loyalty Programmes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="airlines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Airlines Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <AirlinesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aircraft" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aircraft Types</CardTitle>
            </CardHeader>
            <CardContent>
              <AircraftList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="airports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Airports Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <AirportsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cities and Metropolitan Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <CitiesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="places" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Places Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <PlacesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Airline Loyalty Programmes</CardTitle>
            </CardHeader>
            <CardContent>
              <LoyaltyProgrammesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Data Coverage</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Complete airline directory with logos and IATA codes</li>
                <li>• Aircraft types with IATA aircraft codes</li>
                <li>• Global airports with coordinates and time zones</li>
                <li>• Metropolitan areas with associated airports</li>
                <li>• Place suggestions with geographic search capabilities</li>
                <li>• Loyalty programmes grouped by airline alliances</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Search & Display</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Real-time search across all data types</li>
                <li>• Visual airline logos and branding</li>
                <li>• Geographic coordinates for mapping</li>
                <li>• Time zone information for scheduling</li>
                <li>• Responsive grid layouts for all devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}