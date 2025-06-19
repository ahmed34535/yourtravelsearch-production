import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  DollarSign,
  Shield,
  Timer,
  Lock
} from 'lucide-react';

// Duffel Hold Order Types
export interface DuffelHoldOrder {
  id: string;
  type: 'hold';
  live_mode: boolean;
  booking_reference: string;
  created_at: string;
  expires_at: string;
  payment_required_by: string;
  base_amount: string;
  base_currency: string;
  total_amount: string;
  total_currency: string;
  tax_amount: string;
  tax_currency: string;
  hold_expires_at: string;
  available_actions: ('pay' | 'cancel')[];
  passengers: DuffelOrderPassenger[];
  slices: DuffelOrderSlice[];
  conditions: DuffelOrderConditions;
}

export interface DuffelOrderPassenger {
  id: string;
  given_name: string;
  family_name: string;
  title: string;
  born_on: string;
  email?: string;
  phone_number?: string;
  loyalty_programme_accounts?: DuffelLoyaltyAccount[];
}

export interface DuffelOrderSlice {
  id: string;
  origin: {
    iata_code: string;
    name: string;
    city_name: string;
  };
  destination: {
    iata_code: string;
    name: string;
    city_name: string;
  };
  departure_date: string;
  arrival_date: string;
  duration: string;
  segments: DuffelOrderSegment[];
  fare_brand_name?: string;
  conditions: DuffelSliceConditions;
}

export interface DuffelOrderSegment {
  id: string;
  origin: {
    iata_code: string;
    name: string;
    terminal?: string;
  };
  destination: {
    iata_code: string;
    name: string;
    terminal?: string;
  };
  departing_at: string;
  arriving_at: string;
  duration: string;
  flight_number: string;
  marketing_carrier: {
    iata_code: string;
    name: string;
    logo_symbol_url?: string;
  };
  operating_carrier: {
    iata_code: string;
    name: string;
  };
  aircraft: {
    name: string;
    iata_code: string;
  };
  distance: string;
  passengers: Array<{
    passenger_id: string;
    cabin_class: 'first' | 'business' | 'premium_economy' | 'economy';
    cabin_class_marketing_name: string;
    seat?: {
      designator: string;
      name: string;
    };
    baggages: Array<{
      type: 'checked' | 'carry_on';
      quantity: number;
    }>;
  }>;
}

export interface DuffelOrderConditions {
  change_before_departure?: DuffelCondition;
  refund_before_departure?: DuffelCondition;
  refund_after_departure?: DuffelCondition;
}

export interface DuffelSliceConditions {
  change_before_departure?: DuffelCondition;
}

export interface DuffelCondition {
  allowed: boolean;
  penalty_amount?: string;
  penalty_currency?: string;
}

export interface DuffelLoyaltyAccount {
  account_number: string;
  airline_iata_code: string;
}

// Hold Order Management Component
export function HoldOrderManagement() {
  const [holdOrders, setHoldOrders] = useState<DuffelHoldOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DuffelHoldOrder | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Mock hold orders following Duffel specifications
  useEffect(() => {
    const mockHoldOrders: DuffelHoldOrder[] = [
      {
        id: 'ord_00009hthhsUZ8W4LxQgkjo',
        type: 'hold',
        live_mode: false,
        booking_reference: 'EYDTKN',
        created_at: '2024-01-15T10:30:00Z',
        expires_at: '2024-01-17T10:30:00Z',
        payment_required_by: '2024-01-16T10:30:00Z',
        hold_expires_at: '2024-01-16T10:30:00Z',
        base_amount: '248.50',
        base_currency: 'GBP',
        total_amount: '318.20',
        total_currency: 'GBP',
        tax_amount: '69.70',
        tax_currency: 'GBP',
        available_actions: ['pay', 'cancel'],
        passengers: [
          {
            id: 'pas_00009hj8USM7Ncg31cBCLL',
            given_name: 'John',
            family_name: 'Smith',
            title: 'mr',
            born_on: '1990-01-15',
            email: 'john.smith@example.com',
            phone_number: '+44 123 456 7890',
            loyalty_programme_accounts: [
              {
                account_number: '12901014',
                airline_iata_code: 'BA'
              }
            ]
          }
        ],
        slices: [
          {
            id: 'sli_00009hthhsUZ8W4LxQgkjo',
            origin: {
              iata_code: 'LHR',
              name: 'Heathrow Airport',
              city_name: 'London'
            },
            destination: {
              iata_code: 'JFK',
              name: 'John F. Kennedy International Airport',
              city_name: 'New York'
            },
            departure_date: '2024-02-15',
            arrival_date: '2024-02-15',
            duration: 'PT8H30M',
            fare_brand_name: 'Basic Economy',
            segments: [
              {
                id: 'seg_00009hthhsUZ8W4LxQgkjo',
                origin: {
                  iata_code: 'LHR',
                  name: 'Heathrow Airport',
                  terminal: '5'
                },
                destination: {
                  iata_code: 'JFK',
                  name: 'John F. Kennedy International Airport',
                  terminal: '7'
                },
                departing_at: '2024-02-15T14:30:00Z',
                arriving_at: '2024-02-15T17:00:00-05:00',
                duration: 'PT8H30M',
                flight_number: '117',
                marketing_carrier: {
                  iata_code: 'BA',
                  name: 'British Airways',
                  logo_symbol_url: 'https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/BA.svg'
                },
                operating_carrier: {
                  iata_code: 'BA',
                  name: 'British Airways'
                },
                aircraft: {
                  name: 'Boeing 777-200',
                  iata_code: '772'
                },
                distance: '5585',
                passengers: [
                  {
                    passenger_id: 'pas_00009hj8USM7Ncg31cBCLL',
                    cabin_class: 'economy',
                    cabin_class_marketing_name: 'World Traveller',
                    baggages: [
                      {
                        type: 'carry_on',
                        quantity: 1
                      }
                    ]
                  }
                ]
              }
            ],
            conditions: {
              change_before_departure: {
                allowed: true,
                penalty_amount: '75.00',
                penalty_currency: 'GBP'
              }
            }
          }
        ],
        conditions: {
          change_before_departure: {
            allowed: true,
            penalty_amount: '75.00',
            penalty_currency: 'GBP'
          },
          refund_before_departure: {
            allowed: true,
            penalty_amount: '100.00',
            penalty_currency: 'GBP'
          },
          refund_after_departure: {
            allowed: false
          }
        }
      }
    ];

    setTimeout(() => {
      setHoldOrders(mockHoldOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handlePayOrder = async (orderId: string) => {
    setSelectedOrder(holdOrders.find(order => order.id === orderId) || null);
    setShowPayment(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    // In live mode, this would call the Duffel API to cancel the hold order
    console.log('Cancelling hold order:', orderId);
    
    // Remove from local state for demo
    setHoldOrders(orders => orders.filter(order => order.id !== orderId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hold Orders</h2>
          <p className="text-gray-600 mt-1">
            Manage your held bookings and complete payment within the hold period
          </p>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-200">
          {holdOrders.length} Active Holds
        </Badge>
      </div>

      {holdOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Hold Orders</h3>
            <p className="text-gray-600">You don't have any active hold orders at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {holdOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-orange-400">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="w-5 h-5 text-orange-600" />
                      Hold Order - {order.booking_reference}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Created {formatDate(order.created_at)} at {formatTime(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {order.total_currency} {order.total_amount}
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Payment Required
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hold Expiry Warning */}
                <Alert className="border-orange-200 bg-orange-50">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>Payment Required:</strong> Complete payment within {getTimeRemaining(order.payment_required_by)}
                      </span>
                      <span className="text-sm">
                        Expires: {formatDate(order.payment_required_by)} at {formatTime(order.payment_required_by)}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Flight Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Flight Details</h4>
                  {order.slices.map((slice) => (
                    <div key={slice.id} className="bg-gray-50 p-4 rounded-lg">
                      {slice.segments.map((segment) => (
                        <div key={segment.id} className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {formatTime(segment.departing_at)}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {segment.origin.iata_code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(segment.departing_at)}
                            </div>
                          </div>

                          <div className="flex-1 text-center mx-8">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              {segment.marketing_carrier.logo_symbol_url ? (
                                <img 
                                  src={segment.marketing_carrier.logo_symbol_url} 
                                  alt={segment.marketing_carrier.name}
                                  className="h-6 w-6"
                                />
                              ) : (
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-blue-600">
                                    {segment.marketing_carrier.iata_code}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm font-medium">
                                {segment.marketing_carrier.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {segment.marketing_carrier.iata_code} {segment.flight_number}
                            </div>
                            <div className="text-xs text-gray-500">
                              {segment.aircraft.name}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {formatTime(segment.arriving_at)}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {segment.destination.iata_code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(segment.arriving_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Passenger Information */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Passengers</h4>
                  {order.passengers.map((passenger) => (
                    <div key={passenger.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {passenger.title} {passenger.given_name} {passenger.family_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Born: {new Date(passenger.born_on).toLocaleDateString()}
                        </p>
                      </div>
                      {passenger.loyalty_programme_accounts && passenger.loyalty_programme_accounts.length > 0 && (
                        <div className="text-right">
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {passenger.loyalty_programme_accounts[0].airline_iata_code} Member
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Pricing Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800">Base Fare:</span>
                      <span className="font-medium">{order.base_currency} {order.base_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Taxes & Fees:</span>
                      <span className="font-medium">{order.tax_currency} {order.tax_amount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-blue-900">Total Amount:</span>
                      <span className="font-bold">{order.total_currency} {order.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Order Conditions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Booking Conditions</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className={`w-4 h-4 ${order.conditions.change_before_departure?.allowed ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="font-medium">Changes Before Departure</span>
                      </div>
                      <p className="text-gray-600 ml-6">
                        {order.conditions.change_before_departure?.allowed 
                          ? `Allowed with ${order.conditions.change_before_departure.penalty_currency} ${order.conditions.change_before_departure.penalty_amount} fee`
                          : 'Not permitted'
                        }
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className={`w-4 h-4 ${order.conditions.refund_before_departure?.allowed ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="font-medium">Refunds Before Departure</span>
                      </div>
                      <p className="text-gray-600 ml-6">
                        {order.conditions.refund_before_departure?.allowed 
                          ? `Allowed with ${order.conditions.refund_before_departure.penalty_currency} ${order.conditions.refund_before_departure.penalty_amount} fee`
                          : 'Not permitted'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {order.available_actions.includes('pay') && (
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handlePayOrder(order.id)}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Payment
                    </Button>
                  )}
                  {order.available_actions.includes('cancel') && (
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Hold
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Modal would go here */}
      {showPayment && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {selectedOrder.total_currency} {selectedOrder.total_amount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Booking: {selectedOrder.booking_reference}
                  </p>
                </div>
                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Secure payment processing with PCI DSS compliance
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Process payment
                      setShowPayment(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Pay Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowPayment(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}