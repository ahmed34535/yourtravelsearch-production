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
  RefreshCw, 
  Plus, 
  Minus, 
  ArrowRight, 
  Plane, 
  Calendar, 
  MapPin,
  Clock,
  Search,
  Filter
} from 'lucide-react';

// Duffel Order Change Request Types
export interface DuffelOrderChangeRequest {
  id: string;
  order_id: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  slices: {
    remove: SliceToRemove[];
    add: SliceToAdd[];
  };
  order_change_offers: DuffelOrderChangeOffer[];
}

export interface SliceToRemove {
  slice_id: string;
}

export interface SliceToAdd {
  origin: string;
  destination: string;
  departure_date: string;
  cabin_class: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface DuffelOrderChangeOffer {
  id: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  order_change_id: string;
  expires_at: string;
  change_total_amount: string;
  change_total_currency: string;
  penalty_total_amount: string;
  penalty_total_currency: string;
  refund_to: string;
  slices: {
    add: DuffelSlice[];
    remove: DuffelSlice[];
  };
}

export interface DuffelSlice {
  id: string;
  origin: {
    type: string;
    iata_code: string;
    name: string;
    city_name: string;
  };
  destination: {
    type: string;
    iata_code: string;
    name: string;
    city_name: string;
  };
  departure_date: string;
  duration: string;
  segments: DuffelSegment[];
}

export interface DuffelSegment {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departing_at: string;
  arriving_at: string;
  duration: string;
  marketing_carrier: {
    iata_code: string;
    name: string;
  };
  flight_number: string;
}

// Order Change Request List Component
export function OrderChangeRequestsList() {
  const [changeRequests, setChangeRequests] = useState<DuffelOrderChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    order_id: '',
    status: 'all' as 'all' | 'pending' | 'completed'
  });

  // Mock data following Duffel specifications
  useEffect(() => {
    const mockChangeRequests: DuffelOrderChangeRequest[] = [
      {
        id: 'ocr_0000A3bQP9RLVfNUcdpLpw',
        order_id: 'ord_0000A3bQ8FJIQoEfuC07n6',
        live_mode: false,
        created_at: '2024-01-15T10:12:14.545Z',
        updated_at: '2024-01-15T10:12:14.545Z',
        slices: {
          remove: [
            { slice_id: 'sli_00009htYpSCXrwaB9Dn123' }
          ],
          add: [
            {
              origin: 'LHR',
              destination: 'JFK',
              departure_date: '2024-04-24',
              cabin_class: 'economy'
            }
          ]
        },
        order_change_offers: [
          {
            id: 'oco_0000A3bQP9RLVfNUcdpLpx',
            live_mode: false,
            created_at: '2024-01-15T10:13:00.000Z',
            updated_at: '2024-01-15T10:13:00.000Z',
            order_change_id: 'ocr_0000A3bQP9RLVfNUcdpLpw',
            expires_at: '2024-01-15T11:13:00.000Z',
            change_total_amount: '85.50',
            change_total_currency: 'GBP',
            penalty_total_amount: '25.00',
            penalty_total_currency: 'GBP',
            refund_to: 'balance',
            slices: {
              add: [
                {
                  id: 'sli_00009htYpSCXrwaB9Dn456',
                  origin: {
                    type: 'airport',
                    iata_code: 'LHR',
                    name: 'Heathrow',
                    city_name: 'London'
                  },
                  destination: {
                    type: 'airport',
                    iata_code: 'JFK',
                    name: 'John F. Kennedy International Airport',
                    city_name: 'New York'
                  },
                  departure_date: '2024-04-24',
                  duration: 'PT8H15M',
                  segments: [
                    {
                      id: 'seg_00009htYpSCXrwaB9Dn789',
                      origin: { iata_code: 'LHR', name: 'Heathrow' },
                      destination: { iata_code: 'JFK', name: 'John F. Kennedy International Airport' },
                      departing_at: '2024-04-24T10:30:00',
                      arriving_at: '2024-04-24T13:45:00',
                      duration: 'PT8H15M',
                      marketing_carrier: { iata_code: 'BA', name: 'British Airways' },
                      flight_number: 'BA183'
                    }
                  ]
                }
              ],
              remove: [
                {
                  id: 'sli_00009htYpSCXrwaB9Dn123',
                  origin: {
                    type: 'airport',
                    iata_code: 'LHR',
                    name: 'Heathrow',
                    city_name: 'London'
                  },
                  destination: {
                    type: 'airport',
                    iata_code: 'LAX',
                    name: 'Los Angeles International Airport',
                    city_name: 'Los Angeles'
                  },
                  departure_date: '2024-04-20',
                  duration: 'PT11H30M',
                  segments: [
                    {
                      id: 'seg_00009htYpSCXrwaB9Dn456',
                      origin: { iata_code: 'LHR', name: 'Heathrow' },
                      destination: { iata_code: 'LAX', name: 'Los Angeles International Airport' },
                      departing_at: '2024-04-20T14:20:00',
                      arriving_at: '2024-04-20T18:50:00',
                      duration: 'PT11H30M',
                      marketing_carrier: { iata_code: 'VS', name: 'Virgin Atlantic' },
                      flight_number: 'VS11'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ];

    setTimeout(() => {
      setChangeRequests(mockChangeRequests);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredRequests = changeRequests.filter(request => {
    const matchesOrderId = !filters.order_id || request.order_id.toLowerCase().includes(filters.order_id.toLowerCase());
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'completed' && request.order_change_offers.length > 0) ||
      (filters.status === 'pending' && request.order_change_offers.length === 0);
    
    return matchesOrderId && matchesStatus;
  });

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Change Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="order_id">Order ID</Label>
              <Input
                id="order_id"
                placeholder="Search by order ID..."
                value={filters.order_id}
                onChange={(e) => setFilters(prev => ({ ...prev, order_id: e.target.value }))}
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Has Offers</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ order_id: '', status: 'all' })}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No change requests found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-mono">{request.id}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{request.order_id}</Badge>
                      <Badge variant={request.order_change_offers.length > 0 ? "default" : "secondary"}>
                        {request.order_change_offers.length > 0 ? `${request.order_change_offers.length} Offers` : 'Processing'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Created: {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Slice Changes Summary */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Flight Changes</Label>
                    <div className="mt-2 space-y-2">
                      {request.slices.remove.map((remove, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Minus className="h-4 w-4 text-red-500" />
                          <span className="text-red-700">Remove slice {remove.slice_id}</span>
                        </div>
                      ))}
                      {request.slices.add.map((add, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Plus className="h-4 w-4 text-green-500" />
                          <span className="text-green-700">
                            Add {add.origin} → {add.destination} on {add.departure_date} ({add.cabin_class})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Change Offers */}
                  {request.order_change_offers.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium">Available Change Offers</Label>
                        <div className="mt-2 space-y-4">
                          {request.order_change_offers.map((offer) => (
                            <Card key={offer.id} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-mono text-sm">{offer.id}</p>
                                    <p className="text-xs text-gray-500">
                                      Expires: {new Date(offer.expires_at).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-lg">
                                      {offer.change_total_currency} {offer.change_total_amount}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      + {offer.penalty_total_currency} {offer.penalty_total_amount} penalty
                                    </p>
                                  </div>
                                </div>

                                <Tabs defaultValue="add" className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="add">New Flights</TabsTrigger>
                                    <TabsTrigger value="remove">Removed Flights</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="add" className="space-y-2">
                                    {offer.slices.add.map((slice) => (
                                      <div key={slice.id} className="bg-green-50 p-3 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <Plane className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">
                                              {slice.origin.iata_code} → {slice.destination.iata_code}
                                            </span>
                                          </div>
                                          <Badge variant="outline">{formatDuration(slice.duration)}</Badge>
                                        </div>
                                        {slice.segments.map((segment) => (
                                          <div key={segment.id} className="text-sm text-gray-600">
                                            <div className="flex items-center justify-between">
                                              <span>
                                                {segment.marketing_carrier.name} {segment.flight_number}
                                              </span>
                                              <span>
                                                {new Date(segment.departing_at).toLocaleTimeString()} - 
                                                {new Date(segment.arriving_at).toLocaleTimeString()}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </TabsContent>
                                  
                                  <TabsContent value="remove" className="space-y-2">
                                    {offer.slices.remove.map((slice) => (
                                      <div key={slice.id} className="bg-red-50 p-3 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <Plane className="h-4 w-4 text-red-600" />
                                            <span className="font-medium">
                                              {slice.origin.iata_code} → {slice.destination.iata_code}
                                            </span>
                                          </div>
                                          <Badge variant="outline">{formatDuration(slice.duration)}</Badge>
                                        </div>
                                        {slice.segments.map((segment) => (
                                          <div key={segment.id} className="text-sm text-gray-600">
                                            <div className="flex items-center justify-between">
                                              <span>
                                                {segment.marketing_carrier.name} {segment.flight_number}
                                              </span>
                                              <span>
                                                {new Date(segment.departing_at).toLocaleTimeString()} - 
                                                {new Date(segment.arriving_at).toLocaleTimeString()}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </TabsContent>
                                </Tabs>

                                <div className="flex gap-2 mt-4">
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    Accept Change
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
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

// Create Order Change Request Component
export function CreateOrderChangeRequest({ onChangeRequestCreated }: { 
  onChangeRequestCreated?: (request: DuffelOrderChangeRequest) => void 
}) {
  const [formData, setFormData] = useState({
    order_id: '',
    remove_slice_id: '',
    add_origin: '',
    add_destination: '',
    add_departure_date: '',
    add_cabin_class: 'economy' as const
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateChangeRequest = async () => {
    if (!formData.order_id.trim()) {
      setError('Order ID is required');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newChangeRequest: DuffelOrderChangeRequest = {
        id: `ocr_${Date.now().toString(36)}`,
        order_id: formData.order_id,
        live_mode: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        slices: {
          remove: formData.remove_slice_id ? [{ slice_id: formData.remove_slice_id }] : [],
          add: formData.add_origin && formData.add_destination ? [{
            origin: formData.add_origin,
            destination: formData.add_destination,
            departure_date: formData.add_departure_date,
            cabin_class: formData.add_cabin_class
          }] : []
        },
        order_change_offers: []
      };

      onChangeRequestCreated?.(newChangeRequest);
      setFormData({
        order_id: '',
        remove_slice_id: '',
        add_origin: '',
        add_destination: '',
        add_departure_date: '',
        add_cabin_class: 'economy'
      });
    } catch (err) {
      setError('Failed to create change request. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create Order Change Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="order-id">Order ID</Label>
          <Input
            id="order-id"
            placeholder="ord_0000A3bQ8FJIQoEfuC07n6"
            value={formData.order_id}
            onChange={(e) => setFormData(prev => ({ ...prev, order_id: e.target.value }))}
            disabled={isCreating}
          />
        </div>

        <Separator />

        <div>
          <Label htmlFor="remove-slice">Remove Slice ID (Optional)</Label>
          <Input
            id="remove-slice"
            placeholder="sli_00009htYpSCXrwaB9Dn123"
            value={formData.remove_slice_id}
            onChange={(e) => setFormData(prev => ({ ...prev, remove_slice_id: e.target.value }))}
            disabled={isCreating}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="add-origin">Add Origin</Label>
            <Input
              id="add-origin"
              placeholder="LHR"
              value={formData.add_origin}
              onChange={(e) => setFormData(prev => ({ ...prev, add_origin: e.target.value }))}
              disabled={isCreating}
            />
          </div>
          <div>
            <Label htmlFor="add-destination">Add Destination</Label>
            <Input
              id="add-destination"
              placeholder="JFK"
              value={formData.add_destination}
              onChange={(e) => setFormData(prev => ({ ...prev, add_destination: e.target.value }))}
              disabled={isCreating}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="add-date">Departure Date</Label>
            <Input
              id="add-date"
              type="date"
              value={formData.add_departure_date}
              onChange={(e) => setFormData(prev => ({ ...prev, add_departure_date: e.target.value }))}
              disabled={isCreating}
            />
          </div>
          <div>
            <Label htmlFor="cabin-class">Cabin Class</Label>
            <select
              id="cabin-class"
              className="w-full p-2 border rounded-md"
              value={formData.add_cabin_class}
              onChange={(e) => setFormData(prev => ({ ...prev, add_cabin_class: e.target.value as any }))}
              disabled={isCreating}
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCreateChangeRequest}
          disabled={isCreating || !formData.order_id.trim()}
          className="w-full"
        >
          {isCreating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Creating Change Request...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Create Change Request
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Main Demo Component
export function DuffelOrderChangeRequestsDemo() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleChangeRequestCreated = (request: DuffelOrderChangeRequest) => {
    console.log('New change request created:', request);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Order Change Requests</h2>
        <p className="text-gray-600">
          Comprehensive flight change management with offer comparison and booking workflow
        </p>
      </div>

      <Alert>
        <RefreshCw className="h-4 w-4" />
        <AlertDescription>
          This system handles the complete order change workflow: create change requests, 
          receive offers from airlines, compare options, and process the changes with penalty calculations.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateOrderChangeRequest onChangeRequestCreated={handleChangeRequestCreated} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Change Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderChangeRequestsList key={refreshKey} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Duffel Compliance</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Complete slice addition and removal workflow</li>
                <li>• Order change offer comparison system</li>
                <li>• Penalty and change fee calculation</li>
                <li>• Expiration handling for offers</li>
                <li>• Multi-segment flight visualization</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Business Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Advanced filtering and search capabilities</li>
                <li>• Visual flight change comparison</li>
                <li>• Real-time offer status tracking</li>
                <li>• Comprehensive change cost breakdown</li>
                <li>• Intuitive slice management interface</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}