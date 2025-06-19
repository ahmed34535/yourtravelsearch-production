import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, MapPin, Calendar, Users, Star, Wifi, Car, Coffee, Utensils, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CancellationTimeline } from './CancellationTimeline';

interface HotelSearchProps {
  onSearch?: (searchData: any) => void;
}

interface SearchResult {
  search_result_id: string;
  accommodation: {
    id: string;
    name: string;
    location: {
      address: string;
      city: string;
      latitude: number;
      longitude: number;
    };
    star_rating?: number;
    amenities: string[];
    images: Array<{ url: string; caption?: string }>;
    cheapest_rate_total_amount: string;
    cheapest_rate_total_currency: string;
  };
}

interface HotelRate {
  id: string;
  total_amount: string;
  total_currency: string;
  rate_plan_name: string;
  includes_breakfast: boolean;
  refundable: boolean;
  supported_loyalty_programme?: {
    reference: string;
    name: string;
    logo_url: string;
  };
  room: {
    name: string;
    bed_configurations: Array<{ type: string; count: number }>;
    maximum_occupancy: number;
    amenities: string[];
  };
  cancellation_policy: {
    free_cancellation_before?: string;
    penalties: Array<{
      amount: string;
      currency: string;
      starts_at: string;
    }>;
  };
  cancellation_timeline?: Array<{
    before: string;
    refund_amount: string;
    refund_currency: string;
  }>;
}

interface HotelQuote {
  id: string;
  total_amount: string;
  total_currency: string;
  expires_at: string;
}

export function HotelSearch({ onSearch }: HotelSearchProps) {
  const [searchType, setSearchType] = useState<'location' | 'accommodation_id'>('location');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('5');
  const [accommodationIds, setAccommodationIds] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [rooms, setRooms] = useState('1');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [rates, setRates] = useState<HotelRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<HotelRate | null>(null);
  const [quote, setQuote] = useState<HotelQuote | null>(null);
  const [booking, setBooking] = useState<any>(null);
  const [loyaltyNumber, setLoyaltyNumber] = useState('');
  
  const [currentStep, setCurrentStep] = useState<'search' | 'rates' | 'quote' | 'booking' | 'confirmation'>('search');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - in live mode this would call Duffel Stays API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if this is a test hotels search (coordinates: -24.38, -128.32)
      const isTestHotels = location.toLowerCase().includes('test');
      
      const mockResults: SearchResult[] = isTestHotels ? [
        {
          search_result_id: 'sr_test_001',
          accommodation: {
            id: 'acc_test_001',
            name: 'Duffel Test Hotel - Booking Scenarios',
            location: {
              address: 'Test Location for Development',
              city: 'Test City',
              latitude: -24.38,
              longitude: -128.32
            },
            star_rating: 4,
            amenities: ['wifi', 'restaurant', 'bar', 'fitness_center'],
            images: [{ url: '/api/placeholder/400/300', caption: 'Test hotel room' }],
            cheapest_rate_total_amount: '150.00',
            cheapest_rate_total_currency: 'USD'
          }
        },
        {
          search_result_id: 'sr_test_002',
          accommodation: {
            id: 'acc_test_002',
            name: 'Duffel Test Hotel - Payment Scenarios',
            location: {
              address: 'Test Location for Development',
              city: 'Test City',
              latitude: -24.38,
              longitude: -128.32
            },
            star_rating: 3,
            amenities: ['wifi', 'restaurant', 'parking'],
            images: [{ url: '/api/placeholder/400/300', caption: 'Test hotel lobby' }],
            cheapest_rate_total_amount: '200.00',
            cheapest_rate_total_currency: 'USD'
          }
        },
        {
          search_result_id: 'sr_test_003',
          accommodation: {
            id: 'acc_test_003',
            name: 'Duffel Test Hotel - Cancellation Scenarios',
            location: {
              address: 'Test Location for Development',
              city: 'Test City',
              latitude: -24.38,
              longitude: -128.32
            },
            star_rating: 5,
            amenities: ['wifi', 'spa', 'restaurant', 'bar', 'concierge'],
            images: [{ url: '/api/placeholder/400/300', caption: 'Test hotel suite' }],
            cheapest_rate_total_amount: '300.00',
            cheapest_rate_total_currency: 'USD'
          }
        }
      ] : [
        {
          search_result_id: 'sr_001',
          accommodation: {
            id: 'acc_001',
            name: 'The Ritz-Carlton, London',
            location: {
              address: '150 Piccadilly, London W1J 9BR',
              city: 'London',
              latitude: 51.5074,
              longitude: -0.1416
            },
            star_rating: 5,
            amenities: ['wifi', 'spa', 'fitness_center', 'restaurant', 'bar', 'room_service'],
            images: [{ url: '/api/placeholder/400/300', caption: 'Luxury suite' }],
            cheapest_rate_total_amount: '450.00',
            cheapest_rate_total_currency: 'GBP'
          }
        },
        {
          search_result_id: 'sr_002',
          accommodation: {
            id: 'acc_002',
            name: 'The Savoy',
            location: {
              address: 'Strand, London WC2R 0EZ',
              city: 'London',
              latitude: 51.5103,
              longitude: -0.1197
            },
            star_rating: 5,
            amenities: ['wifi', 'spa', 'fitness_center', 'restaurant', 'bar', 'concierge'],
            images: [{ url: '/api/placeholder/400/300', caption: 'River view room' }],
            cheapest_rate_total_amount: '520.00',
            cheapest_rate_total_currency: 'GBP'
          }
        }
      ];
      
      setSearchResults(mockResults);
      setCurrentStep('rates');
      onSearch?.(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRates = async (result: SearchResult) => {
    setSelectedResult(result);
    setIsLoading(true);
    
    try {
      // Simulate fetching rates
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate test-specific rates if this is a test hotel
      const isTestHotel = result.accommodation.name.includes('Test Hotel');
      
      const mockRates: HotelRate[] = isTestHotel ? [
        {
          id: 'rate_test_001',
          total_amount: '150.00',
          total_currency: 'USD',
          rate_plan_name: 'Successful Booking Test',
          includes_breakfast: false,
          refundable: true,
          room: {
            name: 'Standard Room - Successful Booking',
            bed_configurations: [{ type: 'queen', count: 1 }],
            maximum_occupancy: 2,
            amenities: ['wifi', 'desk', 'air_conditioning']
          },
          cancellation_policy: {
            free_cancellation_before: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            penalties: []
          },
          cancellation_timeline: [
            {
              before: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              refund_amount: '150.00',
              refund_currency: 'USD'
            },
            {
              before: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              refund_amount: '75.00',
              refund_currency: 'USD'
            }
          ]
        },
        {
          id: 'rate_test_002',
          total_amount: '200.00',
          total_currency: 'USD',
          rate_plan_name: 'Rate Unavailable at Booking Test',
          includes_breakfast: true,
          refundable: false,
          room: {
            name: 'Premium Room - Rate Unavailable Test',
            bed_configurations: [{ type: 'king', count: 1 }],
            maximum_occupancy: 3,
            amenities: ['wifi', 'minibar', 'air_conditioning', 'balcony']
          },
          cancellation_policy: {
            free_cancellation_before: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            penalties: [
              {
                amount: '50.00',
                currency: 'USD',
                starts_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
              }
            ]
          },
          cancellation_timeline: []
        },
        {
          id: 'rate_test_003',
          total_amount: '300.00',
          total_currency: 'USD',
          rate_plan_name: 'Balance Payment Test',
          includes_breakfast: true,
          refundable: true,
          supported_loyalty_programme: {
            reference: 'marriott_bonvoy',
            name: 'Marriott Bonvoy',
            logo_url: '/api/placeholder/120/40'
          },
          room: {
            name: 'Suite - Balance Payment Test',
            bed_configurations: [{ type: 'king', count: 1 }, { type: 'sofa_bed', count: 1 }],
            maximum_occupancy: 4,
            amenities: ['wifi', 'minibar', 'air_conditioning', 'living_area', 'kitchenette']
          },
          cancellation_policy: {
            free_cancellation_before: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            penalties: []
          },
          cancellation_timeline: [
            {
              before: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              refund_amount: '300.00',
              refund_currency: 'USD'
            },
            {
              before: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              refund_amount: '240.00',
              refund_currency: 'USD'
            },
            {
              before: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              refund_amount: '150.00',
              refund_currency: 'USD'
            }
          ]
        }
      ] : [
        {
          id: 'rate_001',
          total_amount: result.accommodation.cheapest_rate_total_amount,
          total_currency: result.accommodation.cheapest_rate_total_currency,
          rate_plan_name: 'Standard Rate',
          includes_breakfast: false,
          refundable: true,
          room: {
            name: 'Deluxe King Room',
            bed_configurations: [{ type: 'king', count: 1 }],
            maximum_occupancy: 2,
            amenities: ['wifi', 'minibar', 'air_conditioning', 'safe']
          },
          cancellation_policy: {
            free_cancellation_before: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            penalties: []
          }
        },
        {
          id: 'rate_002',
          total_amount: (parseFloat(result.accommodation.cheapest_rate_total_amount) + 70).toString(),
          total_currency: result.accommodation.cheapest_rate_total_currency,
          rate_plan_name: 'Breakfast Included',
          includes_breakfast: true,
          refundable: true,
          room: {
            name: 'Deluxe King Room',
            bed_configurations: [{ type: 'king', count: 1 }],
            maximum_occupancy: 2,
            amenities: ['wifi', 'minibar', 'air_conditioning', 'safe']
          },
          cancellation_policy: {
            free_cancellation_before: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            penalties: []
          }
        }
      ];
      
      setRates(mockRates);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createQuote = async (rate: HotelRate) => {
    setSelectedRate(rate);
    setIsLoading(true);
    setCurrentStep('quote');
    
    try {
      // Simulate quote creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockQuote: HotelQuote = {
        id: 'quote_001',
        total_amount: rate.total_amount,
        total_currency: rate.total_currency,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
      
      setQuote(mockQuote);
    } catch (error) {
      console.error('Failed to create quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async () => {
    if (!quote) return;
    
    setIsLoading(true);
    setCurrentStep('booking');
    
    try {
      // Simulate booking creation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockBooking = {
        id: 'booking_001',
        reference: 'AF33SE2',
        confirmation_code: 'RITZ001',
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      
      setBooking(mockBooking);
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Failed to create booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'restaurant': return <Utensils className="h-4 w-4" />;
      case 'bar': return <Coffee className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (currentStep === 'confirmation' && booking) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Booking Confirmed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Booking Reference</Label>
                <div className="font-bold text-lg">{booking.reference}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Confirmation Code</Label>
                <div className="font-bold text-lg">{booking.confirmation_code}</div>
              </div>
            </div>
          </div>
          
          {selectedResult && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedResult.accommodation.name}</h3>
                <p className="text-gray-600">{selectedResult.accommodation.location.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Check-in</Label>
                  <div>{formatDate(checkInDate)} from 15:00</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Check-out</Label>
                  <div>{formatDate(checkOutDate)} until 11:00</div>
                </div>
              </div>
              
              {selectedRate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{selectedRate.room.name}</div>
                      <div className="text-sm text-gray-600">{selectedRate.rate_plan_name}</div>
                      {selectedRate.supported_loyalty_programme && loyaltyNumber && (
                        <div className="flex items-center gap-2 mt-2">
                          <img 
                            src={selectedRate.supported_loyalty_programme.logo_url} 
                            alt={selectedRate.supported_loyalty_programme.name}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-purple-700 font-medium">
                            {selectedRate.supported_loyalty_programme.name}: {loyaltyNumber}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {selectedRate.total_currency} {selectedRate.total_amount}
                      </div>
                      <div className="text-sm text-gray-600">total</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Booking Confirmed!</strong> Your accommodation has been successfully reserved.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Key Collection Instructions</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Check-in time:</strong> From 15:00 on {formatDate(checkInDate)}</div>
                <div><strong>Location:</strong> Main reception desk</div>
                <div><strong>Required:</strong> Photo ID and booking confirmation</div>
                <div><strong>Contact:</strong> +44 20 7123 4567</div>
              </div>
              
              {selectedResult?.accommodation.name.includes('Test Hotel') && (
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>Test Booking Note:</strong> This is a development test booking. 
                    In live mode, you would receive actual key collection instructions from the hotel.
                  </div>
                </div>
              )}
            </div>
            
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Confirmation email sent to your registered email address with complete booking details and cancellation policy.
              </AlertDescription>
            </Alert>
          </div>
          
          <Button 
            onClick={() => {
              setCurrentStep('search');
              setSearchResults([]);
              setSelectedResult(null);
              setRates([]);
              setSelectedRate(null);
              setQuote(null);
              setBooking(null);
            }}
            className="w-full"
          >
            Search Another Hotel
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      {currentStep === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Hotel Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Type Selection */}
            <Tabs value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="location">Search by Location</TabsTrigger>
                <TabsTrigger value="accommodation_id">Search by Hotel ID</TabsTrigger>
              </TabsList>
              
              <TabsContent value="location" className="space-y-4">
                {/* Quick Search Options */}
                <div className="mb-4">
                  <Label className="text-sm text-gray-600">Exploring our content? Try a quick search:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLocation('Boston, MA');
                        setRadius('5');
                      }}
                      className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    >
                      ⚡ Boston
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLocation('London, UK');
                        setRadius('10');
                      }}
                      className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    >
                      ⚡ London
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLocation('Test Hotels');
                        setRadius('2');
                        // Set test coordinates for Duffel test hotels: -24.38, -128.32
                      }}
                      className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    >
                      ⚡ Test Hotels
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Destination</Label>
                    <Input
                      id="location"
                      placeholder="London, UK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="radius">Search Radius (km)</Label>
                    <Select value={radius} onValueChange={setRadius}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 km</SelectItem>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="25">25 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="accommodation_id" className="space-y-4">
                <div>
                  <Label htmlFor="accommodation-ids">Hotel IDs (comma-separated)</Label>
                  <Input
                    id="accommodation-ids"
                    placeholder="acc_001, acc_002, acc_003"
                    value={accommodationIds}
                    onChange={(e) => setAccommodationIds(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Dates and Guests */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="check-in">Check-in Date</Label>
                <Input
                  id="check-in"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="check-out">Check-out Date</Label>
                <Input
                  id="check-out"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="rooms">Rooms</Label>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Room</SelectItem>
                    <SelectItem value="2">2 Rooms</SelectItem>
                    <SelectItem value="3">3 Rooms</SelectItem>
                    <SelectItem value="4">4 Rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guests">Guests</Label>
                <Select value={`${adults}-${children}`} onValueChange={(value) => {
                  const [a, c] = value.split('-');
                  setAdults(a);
                  setChildren(c);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-0">1 Adult</SelectItem>
                    <SelectItem value="2-0">2 Adults</SelectItem>
                    <SelectItem value="2-1">2 Adults, 1 Child</SelectItem>
                    <SelectItem value="2-2">2 Adults, 2 Children</SelectItem>
                    <SelectItem value="3-0">3 Adults</SelectItem>
                    <SelectItem value="4-0">4 Adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Searching...' : 'Search Hotels'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {currentStep === 'rates' && searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults[0]?.accommodation.name.includes('Test Hotel') && (
            <Alert className="border-blue-200 bg-blue-50">
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Test Hotels Mode:</strong> These are special test accommodations for development. 
                Each hotel simulates different booking scenarios like successful bookings, rate unavailability, 
                payment testing, and cancellation scenarios. In live mode, these would be replaced with real hotels 
                from the coordinates -24.38, -128.32.
              </AlertDescription>
            </Alert>
          )}
          <h2 className="text-xl font-semibold">Available Hotels</h2>
          {searchResults.map((result) => (
            <Card key={result.search_result_id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                    <img 
                      src="/api/placeholder/96/96" 
                      alt={result.accommodation.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{result.accommodation.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{result.accommodation.location.address}</span>
                        </div>
                        {result.accommodation.star_rating && (
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: result.accommodation.star_rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          {result.accommodation.amenities.slice(0, 4).map((amenity) => (
                            <div key={amenity} className="flex items-center gap-1">
                              {getAmenityIcon(amenity)}
                              <span className="text-xs text-gray-600 capitalize">{amenity.replace('_', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">from</div>
                        <div className="font-bold text-lg">
                          {result.accommodation.cheapest_rate_total_currency} {result.accommodation.cheapest_rate_total_amount}
                        </div>
                        <div className="text-sm text-gray-600">per night</div>
                        <Button 
                          onClick={() => fetchRates(result)}
                          disabled={isLoading}
                          className="mt-2"
                        >
                          {isLoading ? 'Loading...' : 'View Rates'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Room Rates */}
      {selectedResult && rates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Rates - {selectedResult.accommodation.name}</h2>
          {rates.map((rate) => (
            <Card key={rate.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{rate.room.name}</h3>
                    <p className="text-gray-600">{rate.rate_plan_name}</p>
                    
                    <div className="flex gap-4 mt-3">
                      {rate.includes_breakfast && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Breakfast Included
                        </Badge>
                      )}
                      {rate.refundable && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Free Cancellation
                        </Badge>
                      )}
                      {rate.supported_loyalty_programme && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 flex items-center gap-1">
                          <img 
                            src={rate.supported_loyalty_programme.logo_url} 
                            alt={rate.supported_loyalty_programme.name}
                            className="w-4 h-4"
                          />
                          {rate.supported_loyalty_programme.name}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      <div>Bed: {rate.room.bed_configurations.map(bed => `${bed.count} ${bed.type}`).join(', ')}</div>
                      <div>Max occupancy: {rate.room.maximum_occupancy} guests</div>
                      {rate.cancellation_policy.free_cancellation_before && (
                        <div>Free cancellation until {formatDate(rate.cancellation_policy.free_cancellation_before)}</div>
                      )}
                    </div>
                    
                    {/* Cancellation Timeline */}
                    {rate.cancellation_timeline && rate.cancellation_timeline.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <CancellationTimeline
                          cancellationTimeline={rate.cancellation_timeline}
                          totalAmount={rate.total_amount}
                          currency={rate.total_currency}
                          checkInDate={checkInDate}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-xl">
                      {rate.total_currency} {rate.total_amount}
                    </div>
                    <div className="text-sm text-gray-600">total stay</div>
                    <Button 
                      onClick={() => createQuote(rate)}
                      disabled={isLoading}
                      className="mt-2"
                    >
                      {isLoading ? 'Creating Quote...' : 'Select Room'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quote Confirmation */}
      {currentStep === 'quote' && quote && selectedRate && selectedResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Confirm Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your quote expires in 30 minutes. Complete your booking to secure this rate.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">{selectedResult.accommodation.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm text-gray-600">Check-in</Label>
                  <div>{formatDate(checkInDate)} from 15:00</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Check-out</Label>
                  <div>{formatDate(checkOutDate)} until 11:00</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{selectedRate.room.name}</div>
                    <div className="text-sm text-gray-600">{selectedRate.rate_plan_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">
                      {quote.total_currency} {quote.total_amount}
                    </div>
                    <div className="text-sm text-gray-600">total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty Programme Input */}
            {selectedRate?.supported_loyalty_programme && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <img 
                    src={selectedRate.supported_loyalty_programme.logo_url} 
                    alt={selectedRate.supported_loyalty_programme.name}
                    className="w-6 h-6"
                  />
                  <h4 className="font-semibold">{selectedRate.supported_loyalty_programme.name}</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loyalty-number">Member Number (Optional)</Label>
                  <Input
                    id="loyalty-number"
                    placeholder="Enter your member number"
                    value={loyaltyNumber}
                    onChange={(e) => setLoyaltyNumber(e.target.value)}
                  />
                  <p className="text-sm text-gray-600">
                    Collect points and enjoy member benefits like free Wi-Fi, late checkout, and gifts.
                  </p>
                </div>
              </div>
            )}

            <Button 
              onClick={createBooking}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing Booking...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}