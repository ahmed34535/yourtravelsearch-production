import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Plane, MapPin, Calendar, Users, Clock, ArrowUpDown } from 'lucide-react';

// Duffel Pagination Types
export interface DuffelPaginationMeta {
  after: string | null;
  before: string | null;
  limit: number;
}

export interface DuffelPaginatedResponse<T> {
  data: T[];
  meta: DuffelPaginationMeta;
}

export interface DuffelAirport {
  id: string;
  iata_code: string;
  icao_code: string;
  name: string;
  city: {
    name: string;
    iata_code: string;
  };
  country: {
    name: string;
    iso_code: string;
  };
  latitude: number;
  longitude: number;
  time_zone: string;
}

export interface DuffelOfferRequest {
  id: string;
  passengers: Array<{
    type: string;
    age?: number;
  }>;
  slices: Array<{
    origin: string;
    destination: string;
    departure_date: string;
  }>;
  cabin_class: string;
  created_at: string;
  live_mode: boolean;
}

// Pagination Hook
export function useDuffelPagination<T>(
  initialData: T[] = [],
  initialMeta: DuffelPaginationMeta = { after: null, before: null, limit: 50 }
) {
  const [data, setData] = useState<T[]>(initialData);
  const [meta, setMeta] = useState<DuffelPaginationMeta>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadNextPage = async (fetchFunction: (after: string, limit: number) => Promise<DuffelPaginatedResponse<T>>) => {
    if (!meta.after || loading) return;
    
    setLoading(true);
    try {
      const response = await fetchFunction(meta.after, meta.limit);
      setData(response.data);
      setMeta(response.meta);
      setHistory(prev => [...prev, meta.after!]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load next page:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreviousPage = async (fetchFunction: (after: string | null, limit: number) => Promise<DuffelPaginatedResponse<T>>) => {
    if (history.length === 0 || loading) return;
    
    setLoading(true);
    try {
      const previousCursor = history.length > 1 ? history[history.length - 2] : null;
      const response = await fetchFunction(previousCursor, meta.limit);
      setData(response.data);
      setMeta(response.meta);
      setHistory(prev => prev.slice(0, -1));
      setCurrentPage(prev => prev - 1);
    } catch (error) {
      console.error('Failed to load previous page:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPagination = (newData: T[], newMeta: DuffelPaginationMeta) => {
    setData(newData);
    setMeta(newMeta);
    setHistory([]);
    setCurrentPage(1);
  };

  return {
    data,
    meta,
    loading,
    currentPage,
    hasNextPage: meta.after !== null,
    hasPreviousPage: history.length > 0,
    loadNextPage,
    loadPreviousPage,
    resetPagination
  };
}

// Airport List Component with Pagination
export function AirportListWithPagination() {
  const [searchTerm, setSearchTerm] = useState('');
  const [limitPerPage, setLimitPerPage] = useState(50);
  
  // Mock data following Duffel API structure
  const generateMockAirports = (offset: number, limit: number): DuffelAirport[] => {
    const airports = [
      { iata: 'LHR', icao: 'EGLL', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', lat: 51.4706, lng: -0.4619, tz: 'Europe/London' },
      { iata: 'JFK', icao: 'KJFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', lat: 40.6413, lng: -73.7781, tz: 'America/New_York' },
      { iata: 'CDG', icao: 'LFPG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479, tz: 'Europe/Paris' },
      { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2532, lng: 55.3657, tz: 'Asia/Dubai' },
      { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915, tz: 'Asia/Singapore' },
      { iata: 'NRT', icao: 'RJAA', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', lat: 35.7647, lng: 140.3864, tz: 'Asia/Tokyo' },
      { iata: 'LAX', icao: 'KLAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
      { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622, tz: 'Europe/Berlin' },
      { iata: 'AMS', icao: 'EHAM', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lng: 4.7683, tz: 'Europe/Amsterdam' },
      { iata: 'SYD', icao: 'YSSY', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', lat: -33.9399, lng: 151.1753, tz: 'Australia/Sydney' }
    ];
    
    // Cycle through airports to create more data
    return Array.from({ length: limit }, (_, i) => {
      const baseIndex = (offset + i) % airports.length;
      const airport = airports[baseIndex];
      const variation = Math.floor((offset + i) / airports.length);
      
      return {
        id: `apt_${airport.iata.toLowerCase()}_${variation}`,
        iata_code: airport.iata,
        icao_code: airport.icao,
        name: variation > 0 ? `${airport.name} Terminal ${variation + 1}` : airport.name,
        city: {
          name: airport.city,
          iata_code: airport.iata.slice(0, 2) + 'C'
        },
        country: {
          name: airport.country,
          iso_code: airport.iata.slice(0, 2)
        },
        latitude: airport.lat + (variation * 0.01),
        longitude: airport.lng + (variation * 0.01),
        time_zone: airport.tz
      };
    });
  };

  const mockFetchAirports = async (after: string | null, limit: number): Promise<DuffelPaginatedResponse<DuffelAirport>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const offset = after ? parseInt(atob(after)) : 0;
    const data = generateMockAirports(offset, limit);
    
    // Generate next cursor if there are more results
    const nextOffset = offset + limit;
    const hasMore = nextOffset < 500; // Simulate 500 total airports
    
    return {
      data,
      meta: {
        after: hasMore ? btoa(nextOffset.toString()) : null,
        before: null,
        limit
      }
    };
  };

  const {
    data: airports,
    meta,
    loading,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    loadNextPage,
    loadPreviousPage,
    resetPagination
  } = useDuffelPagination<DuffelAirport>();

  useEffect(() => {
    const loadInitialData = async () => {
      const response = await mockFetchAirports(null, limitPerPage);
      resetPagination(response.data, response.meta);
    };
    loadInitialData();
  }, [limitPerPage]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      // In real implementation, this would include search parameters
      const response = await mockFetchAirports(null, limitPerPage);
      resetPagination(response.data, response.meta);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Airport Directory with Duffel Pagination
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search airports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="limit">Per page:</Label>
            <select
              id="limit"
              value={limitPerPage}
              onChange={(e) => setLimitPerPage(Number(e.target.value))}
              className="px-3 py-1 border rounded"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} • Showing {airports.length} airports
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Limit: {meta.limit}
            </Badge>
            {meta.after && (
              <Badge variant="secondary">
                More results available
              </Badge>
            )}
          </div>
        </div>

        {/* Airport List */}
        <div className="space-y-2">
          {airports.map((airport) => (
            <Card key={airport.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-lg">{airport.iata_code}</div>
                    <div className="text-xs text-gray-500">{airport.icao_code}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{airport.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{airport.city.name}, {airport.country.name}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{airport.latitude.toFixed(4)}, {airport.longitude.toFixed(4)}</div>
                  <div>{airport.time_zone}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => loadPreviousPage(mockFetchAirports)}
            disabled={!hasPreviousPage || loading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page {currentPage}</span>
            {hasNextPage && <MoreHorizontal className="h-4 w-4 text-gray-400" />}
          </div>
          
          <Button
            variant="outline"
            onClick={() => loadNextPage(mockFetchAirports)}
            disabled={!hasNextPage || loading}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Offer Requests List Component
export function OfferRequestsWithPagination() {
  // Mock data for offer requests
  const generateMockOfferRequests = (offset: number, limit: number): DuffelOfferRequest[] => {
    const routes = [
      { origin: 'LHR', destination: 'JFK', city_pair: 'London → New York' },
      { origin: 'CDG', destination: 'DXB', city_pair: 'Paris → Dubai' },
      { origin: 'SIN', destination: 'NRT', city_pair: 'Singapore → Tokyo' },
      { origin: 'LAX', destination: 'SYD', city_pair: 'Los Angeles → Sydney' },
      { origin: 'FRA', destination: 'AMS', city_pair: 'Frankfurt → Amsterdam' }
    ];

    return Array.from({ length: limit }, (_, i) => {
      const routeIndex = (offset + i) % routes.length;
      const route = routes[routeIndex];
      const variation = Math.floor((offset + i) / routes.length);
      const baseDate = new Date('2024-06-01');
      baseDate.setDate(baseDate.getDate() + variation);

      return {
        id: `ofr_${route.origin.toLowerCase()}${route.destination.toLowerCase()}_${offset + i}`,
        passengers: [
          { type: 'adult' },
          ...(variation % 3 === 0 ? [{ type: 'child', age: 8 }] : [])
        ],
        slices: [{
          origin: route.origin,
          destination: route.destination,
          departure_date: baseDate.toISOString().split('T')[0]
        }],
        cabin_class: ['economy', 'premium_economy', 'business', 'first'][variation % 4],
        created_at: new Date(Date.now() - (offset + i) * 3600000).toISOString(),
        live_mode: variation % 2 === 0
      };
    });
  };

  const mockFetchOfferRequests = async (after: string | null, limit: number): Promise<DuffelPaginatedResponse<DuffelOfferRequest>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const offset = after ? parseInt(atob(after)) : 0;
    const data = generateMockOfferRequests(offset, limit);
    
    const nextOffset = offset + limit;
    const hasMore = nextOffset < 250; // Simulate 250 total offer requests
    
    return {
      data,
      meta: {
        after: hasMore ? btoa(nextOffset.toString()) : null,
        before: null,
        limit
      }
    };
  };

  const {
    data: offerRequests,
    meta,
    loading,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    loadNextPage,
    loadPreviousPage,
    resetPagination
  } = useDuffelPagination<DuffelOfferRequest>();

  useEffect(() => {
    const loadInitialData = async () => {
      const response = await mockFetchOfferRequests(null, 25);
      resetPagination(response.data, response.meta);
    };
    loadInitialData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Offer Requests with Cursor Pagination
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Page {currentPage} • {offerRequests.length} requests shown
        </div>

        <div className="space-y-3">
          {offerRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{request.id}</Badge>
                    <Badge variant={request.live_mode ? 'default' : 'secondary'}>
                      {request.live_mode ? 'Live' : 'Test'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      <span>{request.slices[0].origin} → {request.slices[0].destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{request.slices[0].departure_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{request.passengers.length} passenger{request.passengers.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="capitalize">{request.cabin_class.replace('_', ' ')}</div>
                  <div>{new Date(request.created_at).toLocaleString()}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => loadPreviousPage(mockFetchOfferRequests)}
            disabled={!hasPreviousPage || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm">Page {currentPage}</span>
          
          <Button
            variant="outline"
            onClick={() => loadNextPage(mockFetchOfferRequests)}
            disabled={!hasNextPage || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Demo Component
export function DuffelPaginationDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel API Cursor-Based Pagination</h2>
        <p className="text-gray-600">
          Efficient handling of large datasets using Duffel's cursor-based pagination system
        </p>
      </div>

      <Alert>
        <ArrowUpDown className="h-4 w-4" />
        <AlertDescription>
          Duffel uses cursor-based pagination with the `after` parameter for efficient traversal of large result sets. 
          The `meta.after` value is used as a cursor to fetch the next page, and when it's null, there are no more results.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8">
        <AirportListWithPagination />
        <OfferRequestsWithPagination />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagination Implementation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Cursor-Based Pagination</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Uses `after` parameter for next page</li>
                <li>• Default limit: 50 results per page</li>
                <li>• Configurable limit: 1-200 results</li>
                <li>• Null `after` indicates end of results</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Implementation Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Maintains navigation history</li>
                <li>• Loading states and error handling</li>
                <li>• Configurable page sizes</li>
                <li>• Search integration support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}