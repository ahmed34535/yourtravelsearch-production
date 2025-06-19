/**
 * Development Checkout Test Environment
 * 
 * Isolated testing environment for Duffel Card and 3DS integration.
 * This is completely separate from the main site and only accessible
 * via direct URL navigation or dev flags.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Shield, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { DuffelCardForm } from '../components/DuffelCardForm';
import { ThreeDSecureChallenge } from '../components/ThreeDSecureChallenge';
import { PaymentTestScenarios } from '../components/PaymentTestScenarios';

interface TestBooking {
  id: string;
  type: 'flight' | 'hotel' | 'package';
  amount: number;
  currency: string;
  description: string;
}

const mockBookings: TestBooking[] = [
  {
    id: 'bkg_flight_001',
    type: 'flight',
    amount: 45566, // £455.66 in cents
    currency: 'GBP',
    description: 'London (LHR) → New York (JFK) • Duffel Airways'
  },
  {
    id: 'bkg_hotel_001', 
    type: 'hotel',
    amount: 24446, // £244.46 in cents
    currency: 'GBP',
    description: 'Grand Plaza Hotel • 2 nights • London'
  },
  {
    id: 'bkg_package_001',
    type: 'package',
    amount: 125000, // £1,250.00 in cents
    currency: 'GBP',
    description: 'Caribbean Paradise Package • 7 nights'
  }
];

export function CheckoutTestEnvironment() {
  const [selectedBooking, setSelectedBooking] = useState<TestBooking>(mockBookings[0]);
  const [cardCaptured, setCardCaptured] = useState(false);
  const [threeDSCompleted, setThreeDSCompleted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [cardId, setCardId] = useState<string | null>(null);
  const [threeDSSessionId, setThreeDSSessionId] = useState<string | null>(null);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  const resetTestFlow = () => {
    setCardCaptured(false);
    setThreeDSCompleted(false);
    setPaymentStatus('idle');
    setCardId(null);
    setThreeDSSessionId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TestTube className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Duffel Payment Integration - Test Environment
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Development Only
            </Badge>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              This is an isolated testing environment for Duffel Cards and 3D Secure integration. 
              All payments use test data and will not process real transactions.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Booking Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Test Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockBookings.map((booking) => (
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
                  Reset Test Flow
                </Button>
              </CardContent>
            </Card>

            {/* Payment Test Scenarios */}
            <div className="mt-6">
              <PaymentTestScenarios />
            </div>
          </div>

          {/* Payment Flow */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="card-capture" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card-capture" className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    cardCaptured ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {cardCaptured ? <CheckCircle className="w-4 h-4" /> : '1'}
                  </div>
                  Card Capture
                </TabsTrigger>
                <TabsTrigger 
                  value="three-ds" 
                  disabled={!cardCaptured}
                  className="flex items-center gap-2"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    threeDSCompleted ? 'bg-green-500 text-white' : 
                    cardCaptured ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {threeDSCompleted ? <CheckCircle className="w-4 h-4" /> : '2'}
                  </div>
                  3D Secure
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  disabled={!threeDSCompleted}
                  className="flex items-center gap-2"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    paymentStatus === 'success' ? 'bg-green-500 text-white' :
                    paymentStatus === 'failed' ? 'bg-red-500 text-white' :
                    threeDSCompleted ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {paymentStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : 
                     paymentStatus === 'failed' ? <XCircle className="w-4 h-4" /> : '3'}
                  </div>
                  Payment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card-capture">
                <DuffelCardForm
                  booking={selectedBooking}
                  onCardCaptured={(id) => {
                    setCardId(id);
                    setCardCaptured(true);
                  }}
                  onError={(error) => {
                    console.error('Card capture failed:', error);
                  }}
                />
              </TabsContent>

              <TabsContent value="three-ds">
                <ThreeDSecureChallenge
                  cardId={cardId!}
                  booking={selectedBooking}
                  onCompleted={(sessionId) => {
                    setThreeDSSessionId(sessionId);
                    setThreeDSCompleted(true);
                  }}
                  onError={(error) => {
                    console.error('3DS failed:', error);
                  }}
                />
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Payment Summary</h4>
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
                          <span>Card ID:</span>
                          <span className="font-mono text-xs">{cardId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3DS Session:</span>
                          <span className="font-mono text-xs">{threeDSSessionId}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setPaymentStatus('processing');
                        // Simulate payment processing
                        setTimeout(() => {
                          setPaymentStatus('success');
                        }, 2000);
                      }}
                      disabled={paymentStatus === 'processing'}
                      className="w-full"
                    >
                      {paymentStatus === 'processing' ? 'Processing...' : 'Complete Payment'}
                    </Button>

                    {paymentStatus === 'success' && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Payment completed successfully! This would create a real booking in production.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}