import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X,
  CreditCard,
  RefreshCw,
  Calendar,
  DollarSign,
  Plane,
  Users,
  Luggage,
  MapPin,
  Timer,
  Lock
} from 'lucide-react';

// Comprehensive Duffel Policy Types
export interface DuffelOrderPolicies {
  // Hold Order Policies
  hold_order: {
    supported: boolean;
    hold_duration_hours: number;
    payment_required_by: string;
    auto_cancel_on_expiry: boolean;
  };
  
  // Cancellation Policies
  cancellation: {
    before_departure: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
      refund_method: 'original_payment' | 'airline_credits' | 'voucher' | 'balance';
      processing_time_days: number;
    };
    after_departure: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
    };
    within_24_hours: {
      free_cancellation: boolean;
      applies_to: 'all_fares' | 'refundable_only';
    };
  };
  
  // Change Policies
  changes: {
    before_departure: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
      change_fee?: string;
      changeable_elements: ('date' | 'time' | 'route' | 'passenger')[];
    };
    same_day_changes: {
      allowed: boolean;
      deadline_hours_before: number;
      additional_fee?: string;
    };
  };
  
  // Baggage Policies
  baggage: {
    included_checked: number;
    included_carry_on: number;
    additional_baggage: {
      available: boolean;
      price_per_bag?: string;
      currency?: string;
      weight_limit_kg: number;
    };
    special_baggage: {
      sports_equipment: boolean;
      musical_instruments: boolean;
      medical_equipment: boolean;
    };
  };
  
  // Seat Selection Policies
  seat_selection: {
    available: boolean;
    advance_selection: boolean;
    fees_apply: boolean;
    premium_seats: {
      available: boolean;
      extra_legroom: boolean;
      priority_boarding: boolean;
    };
  };
  
  // Meal Policies
  meals: {
    included: boolean;
    special_meals: boolean;
    advance_booking_required: boolean;
    dietary_restrictions: string[];
  };
  
  // Loyalty Program Policies
  loyalty: {
    points_earning: boolean;
    status_benefits: boolean;
    upgrades_available: boolean;
    priority_services: string[];
  };
  
  // Corporate Booking Policies
  corporate: {
    supported: boolean;
    credit_terms_available: boolean;
    volume_discounts: boolean;
    consolidated_billing: boolean;
  };
  
  // Travel Documentation
  documentation: {
    passport_required: boolean;
    visa_requirements: boolean;
    health_certificates: boolean;
    advance_passenger_info: boolean;
  };
}

export interface DuffelPolicyDisplay {
  category: string;
  title: string;
  description: string;
  status: 'included' | 'available' | 'not_available' | 'fee_applies';
  details: string[];
  fees?: {
    amount: string;
    currency: string;
    description: string;
  };
  conditions?: string[];
}

// Comprehensive Policies Management Component
export function DuffelPoliciesManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [policies, setPolicies] = useState<DuffelOrderPolicies | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock comprehensive Duffel policies
  useEffect(() => {
    const mockPolicies: DuffelOrderPolicies = {
      hold_order: {
        supported: true,
        hold_duration_hours: 24,
        payment_required_by: '2024-01-16T10:30:00Z',
        auto_cancel_on_expiry: true
      },
      cancellation: {
        before_departure: {
          allowed: true,
          penalty_amount: '75.00',
          penalty_currency: 'USD',
          refund_method: 'original_payment',
          processing_time_days: 7
        },
        after_departure: {
          allowed: false
        },
        within_24_hours: {
          free_cancellation: true,
          applies_to: 'all_fares'
        }
      },
      changes: {
        before_departure: {
          allowed: true,
          penalty_amount: '50.00',
          penalty_currency: 'USD',
          change_fee: '25.00',
          changeable_elements: ['date', 'time']
        },
        same_day_changes: {
          allowed: true,
          deadline_hours_before: 2,
          additional_fee: '75.00'
        }
      },
      baggage: {
        included_checked: 1,
        included_carry_on: 1,
        additional_baggage: {
          available: true,
          price_per_bag: '35.00',
          currency: 'USD',
          weight_limit_kg: 23
        },
        special_baggage: {
          sports_equipment: true,
          musical_instruments: true,
          medical_equipment: true
        }
      },
      seat_selection: {
        available: true,
        advance_selection: true,
        fees_apply: true,
        premium_seats: {
          available: true,
          extra_legroom: true,
          priority_boarding: true
        }
      },
      meals: {
        included: false,
        special_meals: true,
        advance_booking_required: true,
        dietary_restrictions: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free']
      },
      loyalty: {
        points_earning: true,
        status_benefits: true,
        upgrades_available: true,
        priority_services: ['check-in', 'boarding', 'baggage_handling']
      },
      corporate: {
        supported: true,
        credit_terms_available: true,
        volume_discounts: true,
        consolidated_billing: true
      },
      documentation: {
        passport_required: true,
        visa_requirements: true,
        health_certificates: false,
        advance_passenger_info: true
      }
    };

    setTimeout(() => {
      setPolicies(mockPolicies);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getPolicyDisplays = (): DuffelPolicyDisplay[] => {
    if (!policies) return [];

    return [
      // Hold Orders
      {
        category: 'Hold Orders',
        title: '24-Hour Hold Available',
        description: 'Reserve your flight and pay later',
        status: policies.hold_order.supported ? 'available' : 'not_available',
        details: [
          `Hold duration: ${policies.hold_order.hold_duration_hours} hours`,
          'Price guaranteed during hold period',
          'Automatic cancellation if payment not received'
        ]
      },
      
      // Cancellation Policies
      {
        category: 'Cancellation',
        title: '24-Hour Free Cancellation',
        description: 'Cancel within 24 hours of booking for free',
        status: policies.cancellation.within_24_hours.free_cancellation ? 'included' : 'not_available',
        details: [
          'Applies to all fare types',
          'Full refund to original payment method',
          'No questions asked cancellation'
        ]
      },
      {
        category: 'Cancellation',
        title: 'Standard Cancellation',
        description: 'Cancel before departure',
        status: policies.cancellation.before_departure.allowed ? 'fee_applies' : 'not_available',
        details: [
          `Processing time: ${policies.cancellation.before_departure.processing_time_days} business days`,
          'Refund to original payment method'
        ],
        fees: policies.cancellation.before_departure.penalty_amount ? {
          amount: policies.cancellation.before_departure.penalty_amount,
          currency: policies.cancellation.before_departure.penalty_currency || 'USD',
          description: 'Cancellation fee'
        } : undefined
      },
      
      // Change Policies
      {
        category: 'Changes',
        title: 'Flight Changes',
        description: 'Modify your booking before departure',
        status: policies.changes.before_departure.allowed ? 'fee_applies' : 'not_available',
        details: [
          'Change dates and times',
          'Subject to seat availability',
          'Fare difference applies'
        ],
        fees: {
          amount: policies.changes.before_departure.penalty_amount || '0',
          currency: policies.changes.before_departure.penalty_currency || 'USD',
          description: 'Change fee'
        }
      },
      {
        category: 'Changes',
        title: 'Same-Day Changes',
        description: 'Change to earlier/later flight same day',
        status: policies.changes.same_day_changes.allowed ? 'fee_applies' : 'not_available',
        details: [
          `Available until ${policies.changes.same_day_changes.deadline_hours_before} hours before departure`,
          'Same route only',
          'Subject to availability'
        ],
        fees: {
          amount: policies.changes.same_day_changes.additional_fee || '0',
          currency: 'USD',
          description: 'Same-day change fee'
        }
      },
      
      // Baggage Policies
      {
        category: 'Baggage',
        title: 'Included Baggage',
        description: 'Free baggage allowance',
        status: 'included',
        details: [
          `${policies.baggage.included_carry_on} carry-on bag included`,
          `${policies.baggage.included_checked} checked bag included`,
          `Up to ${policies.baggage.additional_baggage.weight_limit_kg}kg per bag`
        ]
      },
      {
        category: 'Baggage',
        title: 'Additional Baggage',
        description: 'Extra bags for your journey',
        status: policies.baggage.additional_baggage.available ? 'fee_applies' : 'not_available',
        details: [
          'Pre-book for better rates',
          'Pay at airport (higher cost)',
          'Special baggage available'
        ],
        fees: {
          amount: policies.baggage.additional_baggage.price_per_bag || '0',
          currency: policies.baggage.additional_baggage.currency || 'USD',
          description: 'Per additional bag'
        }
      },
      
      // Seat Selection
      {
        category: 'Seats',
        title: 'Seat Selection',
        description: 'Choose your preferred seat',
        status: policies.seat_selection.available ? 'fee_applies' : 'not_available',
        details: [
          'Advance seat selection available',
          'Premium seats with extra legroom',
          'Priority boarding included'
        ]
      },
      
      // Loyalty Programs
      {
        category: 'Loyalty',
        title: 'Frequent Flyer Benefits',
        description: 'Earn and redeem loyalty points',
        status: policies.loyalty.points_earning ? 'available' : 'not_available',
        details: [
          'Earn points on eligible fares',
          'Status tier benefits apply',
          'Priority services available',
          'Upgrade opportunities'
        ]
      },
      
      // Corporate Features
      {
        category: 'Corporate',
        title: 'Business Travel Features',
        description: 'Enhanced features for corporate bookings',
        status: policies.corporate.supported ? 'available' : 'not_available',
        details: [
          'Consolidated billing available',
          'Volume discount programs',
          'Extended payment terms',
          'Travel policy compliance'
        ]
      }
    ];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'included':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'available':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'fee_applies':
        return <DollarSign className="w-4 h-4 text-orange-600" />;
      case 'not_available':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'included':
        return <Badge className="bg-green-100 text-green-800">Included</Badge>;
      case 'available':
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
      case 'fee_applies':
        return <Badge className="bg-orange-100 text-orange-800">Fee Applies</Badge>;
      case 'not_available':
        return <Badge variant="secondary">Not Available</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const policyDisplays = getPolicyDisplays();
  const categories = [...new Set(policyDisplays.map(p => p.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Policies & Features</h2>
          <p className="text-gray-600 mt-1">
            Complete overview of all available policies and features for your booking
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Duffel API v2
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hold-orders">Hold Orders</TabsTrigger>
          <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
          <TabsTrigger value="changes">Changes & Extras</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              All policies are enforced according to Duffel API specifications and airline terms. 
              Policies may vary by airline, fare type, and route.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category === 'Hold Orders' && <Timer className="w-5 h-5" />}
                    {category === 'Cancellation' && <X className="w-5 h-5" />}
                    {category === 'Changes' && <RefreshCw className="w-5 h-5" />}
                    {category === 'Baggage' && <Luggage className="w-5 h-5" />}
                    {category === 'Seats' && <MapPin className="w-5 h-5" />}
                    {category === 'Loyalty' && <Users className="w-5 h-5" />}
                    {category === 'Corporate' && <Shield className="w-5 h-5" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {policyDisplays
                      .filter(policy => policy.category === category)
                      .map((policy, index) => (
                        <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(policy.status)}
                              <h4 className="font-medium text-gray-900">{policy.title}</h4>
                              {getStatusBadge(policy.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {policy.details.map((detail, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                            {policy.fees && (
                              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-orange-600" />
                                  <span className="font-medium text-orange-800">
                                    {policy.fees.currency} {policy.fees.amount} - {policy.fees.description}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hold-orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-orange-600" />
                Hold Orders - Reserve & Pay Later
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-orange-200 bg-orange-50">
                <Clock className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Hold your booking for 24 hours</strong> - Reserve your seat and pay later. 
                  Price is guaranteed during the hold period.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">How Hold Orders Work</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Reserve your flight without immediate payment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Price locked for 24 hours
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Complete payment before expiry
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Automatic cancellation if payment not received
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Perfect For</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Corporate approvals</li>
                    <li>• Checking travel documents</li>
                    <li>• Coordinating group travel</li>
                    <li>• Comparing multiple options</li>
                    <li>• Securing prices while deciding</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Available Actions</h4>
                <div className="flex gap-3">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Create Hold Order
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Active Holds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancellation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                Cancellation Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>24-Hour Free Cancellation:</strong> Cancel any booking within 24 hours 
                  of purchase for a full refund, regardless of fare type.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Within 24 Hours</h4>
                    <Badge className="bg-green-100 text-green-800">Free</Badge>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Full refund to original payment method</li>
                    <li>• No cancellation fees</li>
                    <li>• Applies to all fare types</li>
                    <li>• Instant processing</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Before Departure</h4>
                    <Badge className="bg-orange-100 text-orange-800">Fee Applies</Badge>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Cancellation fee: USD 75.00</li>
                    <li>• Refund amount depends on fare rules</li>
                    <li>• Processing time: 7 business days</li>
                    <li>• Refund to original payment method</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-red-900">After Departure</h4>
                    <Badge variant="secondary">Not Available</Badge>
                  </div>
                  <p className="text-sm text-red-800">
                    Cancellations are not permitted after the departure time of the first flight segment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  Flight Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Standard Changes</h4>
                    <p className="text-sm text-gray-600 mb-3">Modify dates, times, or routes</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Change fee: USD 50.00</li>
                      <li>• Fare difference applies</li>
                      <li>• Subject to availability</li>
                      <li>• Up to 24 hours before departure</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Same-Day Changes</h4>
                    <p className="text-sm text-gray-600 mb-3">Earlier or later flight same day</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Change fee: USD 75.00</li>
                      <li>• Available until 2 hours before</li>
                      <li>• Same route only</li>
                      <li>• No fare difference</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Luggage className="w-5 h-5 text-green-600" />
                  Baggage & Extras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Included Baggage</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 1 carry-on bag</li>
                      <li>• 1 checked bag (23kg)</li>
                      <li>• Personal item</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Bags</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• USD 35.00 per bag</li>
                      <li>• Up to 23kg each</li>
                      <li>• Pre-book recommended</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Special Items</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Sports equipment</li>
                      <li>• Musical instruments</li>
                      <li>• Medical equipment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}