import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  CheckCircle, 
  CreditCard, 
  AlertTriangle,
  Timer,
  Lock,
  Plane,
  Calendar,
  DollarSign
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

function HoldConfirmation() {
  const [, setLocation] = useLocation();
  const [holdId, setHoldId] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('hold_id');
    if (id) {
      setHoldId(id);
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  const { data: holdOrder, isLoading, error } = useQuery({
    queryKey: ['/api/hold-orders', holdId],
    queryFn: () => holdId ? apiRequest('GET', `/api/hold-orders/${holdId}`) : null,
    enabled: !!holdId,
    refetchInterval: 60000, // Refresh every minute to update timer
  });

  // Update countdown timer
  useEffect(() => {
    if (!holdOrder?.data?.payment_required_by) return;

    const updateTimer = () => {
      const now = new Date();
      const expiry = new Date(holdOrder.data.payment_required_by);
      const diff = expiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [holdOrder]);

  const handleCompletePayment = async () => {
    try {
      const payment = await apiRequest('POST', `/api/hold-orders/${holdId}/pay`, {
        payment_intent_id: 'pi_test_123'
      });
      
      setLocation(`/booking-confirmation?ref=${payment.data.booking_reference}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleCancelHold = async () => {
    try {
      await apiRequest('DELETE', `/api/hold-orders/${holdId}`);
      setLocation('/');
    } catch (error) {
      console.error('Cancel failed:', error);
      alert('Failed to cancel hold order. Please try again.');
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading hold order...</h2>
        </div>
      </div>
    );
  }

  if (error || !holdOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hold Order Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to find hold order details</p>
          <Button onClick={() => setLocation('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const hold = holdOrder.data;
  const isExpired = timeRemaining === 'Expired';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Timer className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Held Successfully</h1>
          <p className="text-lg text-gray-600">Your flight is reserved for 24 hours</p>
          <div className="mt-4">
            <Badge variant="outline" className="text-lg px-4 py-2 border-orange-300 text-orange-700">
              Booking Reference: {hold.booking_reference}
            </Badge>
          </div>
        </div>

        {/* Countdown Timer */}
        {!isExpired ? (
          <Alert className="border-orange-200 bg-orange-50 mb-6">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <span>
                  <strong>Complete payment within:</strong> {timeRemaining}
                </span>
                <span className="text-sm">
                  Expires: {formatDate(hold.payment_required_by)} at {formatTime(hold.payment_required_by)}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Hold Order Expired:</strong> This hold order has expired and is no longer valid.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hold.slices?.map((slice: any, index: number) => (
                  <div key={index} className={index > 0 ? "mt-6 pt-6 border-t" : ""}>
                    {slice.segments?.map((segment: any, segIndex: number) => (
                      <div key={segIndex} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatTime(segment.departing_at)}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {segment.origin.iata_code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {segment.origin.name}
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
                              <div className="flex-1 h-0.5 bg-gray-300 relative">
                                <Plane className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {segment.marketing_carrier.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {segment.marketing_carrier.iata_code} {segment.flight_number}
                            </div>
                            <div className="text-xs text-gray-500">
                              {segment.aircraft.name}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatTime(segment.arriving_at)}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {segment.destination.iata_code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {segment.destination.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(segment.arriving_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Passenger Information */}
            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
              </CardHeader>
              <CardContent>
                {hold.passengers?.map((passenger: any, index: number) => (
                  <div key={index} className={index > 0 ? "mt-4 pt-4 border-t" : ""}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {passenger.title} {passenger.given_name} {passenger.family_name}
                        </p>
                        {passenger.born_on && (
                          <p className="text-sm text-gray-600">
                            Born: {new Date(passenger.born_on).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {passenger.loyalty_programme_accounts && passenger.loyalty_programme_accounts.length > 0 && (
                        <div className="text-right">
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {passenger.loyalty_programme_accounts[0].airline_iata_code} Member
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hold Order Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Hold Order Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Important Information</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Price is guaranteed during the hold period</li>
                    <li>• Payment must be completed before expiry</li>
                    <li>• Hold order will be automatically cancelled if payment not received</li>
                    <li>• No payment required until you choose to complete booking</li>
                    <li>• You can cancel this hold order at any time without penalty</li>
                  </ul>
                </div>

                {hold.conditions && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Booking Conditions</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className={`w-4 h-4 ${hold.conditions.change_before_departure?.allowed ? 'text-green-600' : 'text-red-600'}`} />
                          <span className="font-medium">Changes Before Departure</span>
                        </div>
                        <p className="text-gray-600 ml-6">
                          {hold.conditions.change_before_departure?.allowed 
                            ? `Allowed with ${hold.conditions.change_before_departure.penalty_currency} ${hold.conditions.change_before_departure.penalty_amount} fee`
                            : 'Not permitted'
                          }
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className={`w-4 h-4 ${hold.conditions.refund_before_departure?.allowed ? 'text-green-600' : 'text-red-600'}`} />
                          <span className="font-medium">Refunds Before Departure</span>
                        </div>
                        <p className="text-gray-600 ml-6">
                          {hold.conditions.refund_before_departure?.allowed 
                            ? `Allowed with ${hold.conditions.refund_before_departure.penalty_currency} ${hold.conditions.refund_before_departure.penalty_amount} fee`
                            : 'Not permitted'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-600" />
                  Hold Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hold Status:</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {isExpired ? 'Expired' : 'Active'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium">
                      {formatDate(hold.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expires:</span>
                    <span className="text-sm font-medium">
                      {formatDate(hold.payment_required_by)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare:</span>
                    <span className="font-medium">{hold.base_currency} {hold.base_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees:</span>
                    <span className="font-medium">{hold.tax_currency} {hold.tax_amount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-gray-900">{hold.total_currency} {hold.total_amount}</span>
                  </div>
                </div>

                <Separator />

                {!isExpired ? (
                  <div className="space-y-3">
                    <Button 
                      onClick={handleCompletePayment}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Payment
                    </Button>
                    <Button 
                      onClick={handleCancelHold}
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Cancel Hold Order
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setLocation('/')}
                      className="w-full"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Search New Flights
                    </Button>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Secure Hold</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your flight is securely held with price protection. Complete payment when ready.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoldConfirmation;