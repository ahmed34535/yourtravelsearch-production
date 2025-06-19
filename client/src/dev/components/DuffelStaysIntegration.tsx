import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, Users, Bed, Coffee, Wifi, Car, CreditCard, Shield, Star, Clock, CheckCircle, XCircle } from 'lucide-react';

// Duffel Stays Data Model Types
export interface Accommodation {
  id: string;
  name: string;
  description: string;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: {
      street_address: string;
      city: string;
      postal_code: string;
      country_code: string;
    };
  };
  photos: Array<{
    url: string;
    caption?: string;
  }>;
  amenities: string[];
  star_rating?: number;
  property_type: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  bed_configuration: string;
  photos: Array<{
    url: string;
    caption?: string;
  }>;
  max_occupancy: number;
}

export interface CancellationPolicy {
  type: 'fully_refundable' | 'partially_refundable' | 'non_refundable';
  timeline: Array<{
    deadline: string;
    refund_amount: string;
    refund_currency: string;
  }>;
}

export interface Rate {
  id: string;
  room_id: string;
  accommodation_id: string;
  price: {
    total_amount: string;
    currency: string;
    base_amount: string;
    taxes_amount: string;
    fees_amount: string;
  };
  board_type: 'room_only' | 'breakfast_included' | 'half_board' | 'full_board' | 'all_inclusive';
  payment_method: 'card_at_booking' | 'pay_at_property' | 'card_and_property';
  cancellation_policy: CancellationPolicy;
  loyalty_programme?: {
    name: string;
    points_earned?: number;
    member_benefits?: string[];
  };
  rate_code?: string;
  included_services: string[];
  check_in: string;
  check_out: string;
}

export interface StaysSearchRequest {
  location: string;
  check_in: string;
  check_out: string;
  guests: number;
  rooms: number;
}

export interface StaysSearchResult {
  id: string;
  accommodation: Accommodation;
  rooms: Room[];
  rates: Rate[];
}

// Demo Components
export function StaysAccommodationCard({ accommodation, rooms, rates }: { accommodation: Accommodation; rooms: Room[]; rates: Rate[] }) {
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  
  const getBoardTypeLabel = (boardType: string) => {
    const labels = {
      'room_only': 'Room Only',
      'breakfast_included': 'Breakfast Included',
      'half_board': 'Half Board',
      'full_board': 'Full Board',
      'all_inclusive': 'All Inclusive'
    };
    return labels[boardType as keyof typeof labels] || boardType;
  };

  const getCancellationIcon = (type: string) => {
    switch (type) {
      case 'fully_refundable': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partially_refundable': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'non_refundable': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const lowestRate = rates.reduce((min, rate) => 
    parseFloat(rate.price.total_amount) < parseFloat(min.price.total_amount) ? rate : min
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{accommodation.name}</CardTitle>
              {accommodation.star_rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: accommodation.star_rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span>{accommodation.location.address.city}, {accommodation.location.address.country_code}</span>
              <Badge variant="outline">{accommodation.property_type}</Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">{accommodation.description}</p>
            
            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {accommodation.amenities.slice(0, 6).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity === 'wifi' && <Wifi className="h-3 w-3 mr-1" />}
                  {amenity === 'parking' && <Car className="h-3 w-3 mr-1" />}
                  {amenity === 'restaurant' && <Coffee className="h-3 w-3 mr-1" />}
                  {amenity}
                </Badge>
              ))}
              {accommodation.amenities.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{accommodation.amenities.length - 6} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{lowestRate.price.currency} {lowestRate.price.total_amount}</div>
            <div className="text-sm text-gray-600">per night</div>
            <Badge variant={lowestRate.cancellation_policy.type === 'fully_refundable' ? 'default' : 'secondary'} className="mt-2">
              {getCancellationIcon(lowestRate.cancellation_policy.type)}
              <span className="ml-1 capitalize">{lowestRate.cancellation_policy.type.replace('_', ' ')}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="rates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rates">Available Rates</TabsTrigger>
            <TabsTrigger value="rooms">Room Details</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rates" className="space-y-4">
            {rates.map((rate) => {
              const room = rooms.find(r => r.id === rate.room_id);
              return (
                <Card key={rate.id} className={`cursor-pointer transition-colors ${selectedRate?.id === rate.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedRate(rate)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{room?.name}</h4>
                          <Badge variant="outline">{getBoardTypeLabel(rate.board_type)}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4 text-gray-400" />
                            <span>{room?.bed_configuration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>Max {room?.max_occupancy} guests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <span className="capitalize">{rate.payment_method.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getCancellationIcon(rate.cancellation_policy.type)}
                            <span className="capitalize">{rate.cancellation_policy.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                        
                        {rate.loyalty_programme && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <div className="text-sm font-medium text-blue-900">
                              {rate.loyalty_programme.name} Member Benefits
                            </div>
                            {rate.loyalty_programme.points_earned && (
                              <div className="text-xs text-blue-700">
                                Earn {rate.loyalty_programme.points_earned} points
                              </div>
                            )}
                          </div>
                        )}
                        
                        {rate.included_services.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-600 mb-1">Included services:</div>
                            <div className="flex flex-wrap gap-1">
                              {rate.included_services.map((service, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold">{rate.price.currency} {rate.price.total_amount}</div>
                        <div className="text-xs text-gray-600">
                          Base: {rate.price.base_amount} + Taxes: {rate.price.taxes_amount}
                        </div>
                        {rate.rate_code && (
                          <div className="text-xs text-gray-500 mt-1">
                            Rate code: {rate.rate_code}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          
          <TabsContent value="rooms" className="space-y-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{room.name}</h4>
                  <p className="text-sm text-gray-700 mb-3">{room.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-gray-400" />
                      <span>{room.bed_configuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>Max {room.max_occupancy} guests</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accommodation.photos.slice(0, 6).map((photo, index) => (
                <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">{photo.caption || `Photo ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedRate && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Selected Rate Details</h4>
                <p className="text-sm text-gray-600">Check-in: {selectedRate.check_in} | Check-out: {selectedRate.check_out}</p>
              </div>
              <Button>Book Now</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DuffelStaysDemo() {
  const [searchParams, setSearchParams] = useState<StaysSearchRequest>({
    location: 'London, UK',
    check_in: '2024-06-01',
    check_out: '2024-06-03',
    guests: 2,
    rooms: 1
  });

  // Demo data following Duffel Stays specifications
  const demoAccommodation: Accommodation = {
    id: 'acc_demo_london_hotel',
    name: 'The Savoy London',
    description: 'Iconic luxury hotel on the Strand, offering world-class service and elegantly appointed rooms with views of the Thames or the hotel\'s private courtyard.',
    location: {
      coordinates: {
        latitude: 51.5101,
        longitude: -0.1207
      },
      address: {
        street_address: 'Strand',
        city: 'London',
        postal_code: 'WC2R 0EZ',
        country_code: 'GB'
      }
    },
    photos: [
      { url: '/api/photos/savoy-exterior.jpg', caption: 'Hotel Exterior' },
      { url: '/api/photos/savoy-lobby.jpg', caption: 'Elegant Lobby' },
      { url: '/api/photos/savoy-room.jpg', caption: 'Deluxe Room' }
    ],
    amenities: ['wifi', 'spa', 'fitness_center', 'restaurant', 'bar', 'room_service', 'concierge', 'valet_parking'],
    star_rating: 5,
    property_type: 'hotel'
  };

  const demoRooms: Room[] = [
    {
      id: 'room_deluxe_king',
      name: 'Deluxe King Room',
      description: 'Elegantly appointed room with king bed, marble bathroom, and courtyard views.',
      bed_configuration: '1 King Bed',
      photos: [
        { url: '/api/photos/deluxe-king.jpg', caption: 'Deluxe King Room' }
      ],
      max_occupancy: 2
    },
    {
      id: 'room_deluxe_twin',
      name: 'Deluxe Twin Room',
      description: 'Spacious room with twin beds, perfect for business travelers or friends.',
      bed_configuration: '2 Twin Beds',
      photos: [
        { url: '/api/photos/deluxe-twin.jpg', caption: 'Deluxe Twin Room' }
      ],
      max_occupancy: 2
    }
  ];

  const demoRates: Rate[] = [
    {
      id: 'rate_deluxe_king_standard',
      room_id: 'room_deluxe_king',
      accommodation_id: 'acc_demo_london_hotel',
      price: {
        total_amount: '450.00',
        currency: 'GBP',
        base_amount: '375.00',
        taxes_amount: '75.00',
        fees_amount: '0.00'
      },
      board_type: 'breakfast_included',
      payment_method: 'card_at_booking',
      cancellation_policy: {
        type: 'fully_refundable',
        timeline: [
          {
            deadline: '2024-05-30T18:00:00Z',
            refund_amount: '450.00',
            refund_currency: 'GBP'
          }
        ]
      },
      rate_code: 'SAVER',
      included_services: ['breakfast', 'wifi', 'newspaper'],
      check_in: '2024-06-01',
      check_out: '2024-06-03'
    },
    {
      id: 'rate_deluxe_king_flexible',
      room_id: 'room_deluxe_king',
      accommodation_id: 'acc_demo_london_hotel',
      price: {
        total_amount: '520.00',
        currency: 'GBP',
        base_amount: '433.33',
        taxes_amount: '86.67',
        fees_amount: '0.00'
      },
      board_type: 'breakfast_included',
      payment_method: 'card_at_booking',
      cancellation_policy: {
        type: 'fully_refundable',
        timeline: [
          {
            deadline: '2024-06-01T15:00:00Z',
            refund_amount: '520.00',
            refund_currency: 'GBP'
          }
        ]
      },
      loyalty_programme: {
        name: 'Marriott Bonvoy',
        points_earned: 2600,
        member_benefits: ['Late checkout', 'Welcome amenity', 'Room upgrade (subject to availability)']
      },
      rate_code: 'FLEXIBLE',
      included_services: ['breakfast', 'wifi', 'newspaper', 'minibar_credit'],
      check_in: '2024-06-01',
      check_out: '2024-06-03'
    },
    {
      id: 'rate_deluxe_twin_standard',
      room_id: 'room_deluxe_twin',
      accommodation_id: 'acc_demo_london_hotel',
      price: {
        total_amount: '420.00',
        currency: 'GBP',
        base_amount: '350.00',
        taxes_amount: '70.00',
        fees_amount: '0.00'
      },
      board_type: 'room_only',
      payment_method: 'pay_at_property',
      cancellation_policy: {
        type: 'non_refundable',
        timeline: []
      },
      rate_code: 'ADVANCE',
      included_services: ['wifi'],
      check_in: '2024-06-01',
      check_out: '2024-06-03'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Stays Integration</h2>
        <p className="text-gray-600">
          Complete accommodation booking system following official Duffel Stays API specifications
        </p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Search Accommodations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check_in">Check-in</Label>
              <Input
                id="check_in"
                type="date"
                value={searchParams.check_in}
                onChange={(e) => setSearchParams({...searchParams, check_in: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check_out">Check-out</Label>
              <Input
                id="check_out"
                type="date"
                value={searchParams.check_out}
                onChange={(e) => setSearchParams({...searchParams, check_out: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Rooms</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={searchParams.rooms}
                onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <Button className="mt-4">Search Hotels</Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Search Results</h3>
        <StaysAccommodationCard 
          accommodation={demoAccommodation} 
          rooms={demoRooms} 
          rates={demoRates} 
        />
      </div>

      {/* Data Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>Duffel Stays Data Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This implementation follows Duffel's official three-core-element data model: Accommodation (property details), 
              Room (specific room being booked), and Rate (booking conditions with pricing, cancellation policy, and included services).
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accommodation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Physical property information</p>
                <p>• Location, photos, descriptions</p>
                <p>• Amenities and star rating</p>
                <p>• Property type classification</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Specific room being booked</p>
                <p>• Bed configuration details</p>
                <p>• Room photos and amenities</p>
                <p>• Maximum occupancy limits</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Booking conditions and pricing</p>
                <p>• Cancellation policy timeline</p>
                <p>• Board type and payment method</p>
                <p>• Loyalty programme integration</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}