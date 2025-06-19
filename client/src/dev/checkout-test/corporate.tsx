/**
 * Corporate Checkout Test Environment
 * 
 * Secure corporate payment testing with Duffel's secure_corporate_payment exception.
 * Simulates PCI-compliant corporate card processing in a secure booking environment.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Shield, TestTube, CheckCircle, XCircle, Lock, Users } from 'lucide-react';
import { CorporateCardForm } from '../components/CorporateCardForm';

interface TestBooking {
  id: string;
  type: 'flight' | 'hotel' | 'package';
  amount: number;
  currency: string;
  description: string;
  offerId: string;
  services: Array<{ id: string; quantity: number }>;
}

interface CorporateCardResult {
  cardId: string;
  threeDSSessionId: string;
  status: 'ready_for_payment' | 'failed';
  paymentReady: boolean;
}

const mockCorporateBookings: TestBooking[] = [
  {
    id: 'corp_flight_001',
    type: 'flight',
    amount: 125000, // £1,250.00 in cents
    currency: 'GBP',
    description: 'London (LHR) → New York (JFK) • Business Class • Duffel Airways',
    offerId: 'off_00009htYpSCXrwaB9DnUm0',
    services: [{ id: 'sea_00003hthlsHZ8W4LxXjkzo', quantity: 1 }]
  },
  {
    id: 'corp_hotel_001', 
    type: 'hotel',
    amount: 85000, // £850.00 in cents
    currency: 'GBP',
    description: 'Marriott Hotel Manhattan • 3 nights • Executive Suite',
    offerId: 'hot_00009htYpSCXrwaB9DnUm0',
    services: []
  },
  {
    id: 'corp_package_001',
    type: 'package',
    amount: 350000, // £3,500.00 in cents
    currency: 'GBP',
    description: 'Singapore Business Trip Package • 5 nights • Premium',
    offerId: 'pkg_00009htYpSCXrwaB9DnUm0',
    services: [{ id: 'sea_00003hthlsHZ8W4LxXjkzo', quantity: 2 }]
  }
];

export function CorporateCheckoutEnvironment() {
  const [selectedBooking, setSelectedBooking] = useState<TestBooking>(mockCorporateBookings[0]);
  const [cardProcessed, setCardProcessed] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cardResult, setCardResult] = useState<CorporateCardResult | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  const resetTestFlow = () => {
    setCardProcessed(false);
    setPaymentComplete(false);
    setCardResult(null);
    setPaymentStatus('idle');
  };

  const handleCardProcessed = (result: CorporateCardResult) => {
    setCardResult(result);
    setCardProcessed(true);
  };

  const completePayment = async () => {
    if (!cardResult || !cardResult.paymentReady) return;

    setPaymentStatus('processing');

    try {
      // Simulate order creation with 3DS session ID
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('success');
      setPaymentComplete(true);
    } catch (error) {
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Corporate Payment Integration - Secure Environment
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Corporate Testing
            </Badge>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              This simulates Duffel's secure corporate payment environment with secure_corporate_payment exception.
              Corporate cards bypass user authentication challenges in secure booking systems.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Corporate Features & Booking Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Corporate Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Corporate Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure employee login required</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>PCI DSS Level 1 compliance</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Corporate card authentication bypass</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure booking environment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>TMC/OBT integration ready</span>
                </div>
              </CardContent>
            </Card>

            {/* Test Booking Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Corporate Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCorporateBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBooking.id === booking.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedBooking(booking);
                      resetTestFlow();
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {booking.type}
                      </Badge>
                      <span className="font-bold text-lg">
                        {formatAmount(booking.amount, booking.currency)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{booking.description}</p>
                  </div>
                ))}

                <Button 
                  onClick={resetTestFlow}
                  variant="outline" 
                  className="w-full"
                >
                  Reset Corporate Flow
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Payment Flow */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="corporate-card" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="corporate-card" className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    cardProcessed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {cardProcessed ? <CheckCircle className="w-4 h-4" /> : '1'}
                  </div>
                  Corporate Card
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  disabled={!cardProcessed || !cardResult?.paymentReady}
                  className="flex items-center gap-2"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    paymentComplete ? 'bg-green-500 text-white' :
                    cardResult?.paymentReady ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {paymentComplete ? <CheckCircle className="w-4 h-4" /> : '2'}
                  </div>
                  Complete Order
                </TabsTrigger>
              </TabsList>

              <TabsContent value="corporate-card">
                <CorporateCardForm
                  booking={selectedBooking}
                  onCardProcessed={handleCardProcessed}
                  onError={(error) => {
                    console.error('Corporate card processing failed:', error);
                  }}
                />
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Corporate Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Corporate Payment Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Corporate Payment Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Booking Type:</span>
                          <span className="capitalize">{selectedBooking.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">
                            {formatAmount(selectedBooking.amount, selectedBooking.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span>Corporate Card</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Card ID:</span>
                          <span className="font-mono text-xs">{cardResult?.cardId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3DS Session:</span>
                          <span className="font-mono text-xs">{cardResult?.threeDSSessionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant={cardResult?.status === 'ready_for_payment' ? 'default' : 'destructive'}>
                            {cardResult?.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Exception:</span>
                          <span className="text-blue-600 font-medium">secure_corporate_payment</span>
                        </div>
                      </div>
                    </div>

                    {/* Corporate Payment Status */}
                    {cardResult?.status === 'ready_for_payment' && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Corporate card authentication successful. Payment is ready for processing without user challenge.
                        </AlertDescription>
                      </Alert>
                    )}

                    {cardResult?.status === 'failed' && (
                      <Alert className="bg-red-50 border-red-200">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Corporate card processing failed. The card cannot be used with secure corporate payment exception.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Complete Payment Button */}
                    {cardResult?.paymentReady && (
                      <Button
                        onClick={completePayment}
                        disabled={paymentStatus === 'processing'}
                        className="w-full"
                        size="lg"
                      >
                        {paymentStatus === 'processing' ? 'Creating Corporate Order...' : 'Complete Corporate Order'}
                      </Button>
                    )}

                    {/* Payment Success */}
                    {paymentStatus === 'success' && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Corporate order created successfully! In production, this would generate booking confirmations and tickets.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Payment Failed */}
                    {paymentStatus === 'failed' && (
                      <Alert className="bg-red-50 border-red-200">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Corporate order creation failed. Please try again or contact support.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* API Implementation Notes */}
        <div className="mt-8">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800">Implementation Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-800 space-y-2">
              <p className="text-sm">
                <strong>Card Storage:</strong> Uses api.duffel.cards endpoint for PCI-compliant card processing
              </p>
              <p className="text-sm">
                <strong>3DS Session:</strong> Creates session with exception: "secure_corporate_payment"
              </p>
              <p className="text-sm">
                <strong>Order Creation:</strong> Passes three_d_secure_session_id to flights/hotels/packages booking API
              </p>
              <p className="text-sm">
                <strong>Security:</strong> Corporate environment bypasses user authentication challenges
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}