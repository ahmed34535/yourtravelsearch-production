/**
 * Duffel Card Integration Component
 * 
 * Official Duffel card component integration for corporate payment processing.
 * Implements Duffel's card form with 3D Secure authentication flow.
 */

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, CheckCircle, AlertCircle, Building } from 'lucide-react';
import { corporateAPI } from '../services/CorporateAPIService';
import { customerUserService } from '../services/CustomerUserService';

interface DuffelCardData {
  id: string;
  live_mode: boolean;
  last_4_digits: string;
  brand: string;
  unavailable_at: string;
}

interface ThreeDSecureResult {
  id: string;
  status: 'ready_for_payment' | 'failed' | 'requires_challenge';
  challenge_url?: string;
}

interface CorporateOrderResult {
  id: string;
  booking_reference: string;
  status: string;
  total_amount: string;
  total_currency: string;
}

export function DuffelCardIntegration() {
  const [cardData, setCardData] = useState<DuffelCardData | null>(null);
  const [threeDSResult, setThreeDSResult] = useState<ThreeDSecureResult | null>(null);
  const [orderResult, setOrderResult] = useState<CorporateOrderResult | null>(null);
  const [customerUserId, setCustomerUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'card' | '3ds' | 'order' | 'complete'>('card');

  // Simulate card form submission with test data
  const handleCardSubmit = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create Customer User for corporate booking
      console.log('Creating Customer User...');
      const userResponse = await customerUserService.createCustomerUser({
        email: 'corporate.test@company.com',
        phone_number: '+44 20 1234 5678',
        given_name: 'Corporate',
        family_name: 'Traveller'
      });
      
      setCustomerUserId(userResponse.data.id);
      console.log('Customer User created:', userResponse.data.id);

      // Step 2: Store corporate card (simulate Duffel card component)
      console.log('Storing corporate card...');
      const cardResponse = await corporateAPI.storeCard({
        address_city: 'London',
        address_country_code: 'GB',
        address_line_1: '1 Corporate Plaza',
        address_line_2: 'Floor 10',
        address_postal_code: 'EC2A 4RQ',
        address_region: 'London',
        expiry_month: '03',
        expiry_year: '30',
        name: 'Corporate Test Card',
        number: '4111110116638870', // Test card that should succeed
        cvc: '123',
        multi_use: false
      });

      setCardData(cardResponse.data);
      setCurrentStep('3ds');
      console.log('Card stored successfully:', cardResponse.data.id);

      // Step 3: Create 3DS session with secure corporate payment
      console.log('Creating 3DS session with secure_corporate_payment...');
      const threeDSResponse = await corporateAPI.createSecureCorporateSession({
        card_id: cardResponse.data.id,
        resource_id: 'off_test_corporate_offer',
        services: [],
        multi_use: false,
        exception: 'secure_corporate_payment'
      });

      setThreeDSResult(threeDSResponse.data);
      console.log('3DS session created:', threeDSResponse.data);

      if (threeDSResponse.data.status === 'ready_for_payment') {
        setCurrentStep('order');
        
        // Step 4: Create corporate order
        console.log('Creating corporate order...');
        const orderResponse = await corporateAPI.createCorporateOrder({
          offerId: 'off_test_corporate_offer',
          threeDSecureSessionId: threeDSResponse.data.id,
          customerUsers: [userResponse.data.id],
          services: []
        });

        setOrderResult(orderResponse.data);
        setCurrentStep('complete');
        console.log('Corporate order created:', orderResponse.data);
      } else {
        setError('3DS authentication failed or requires challenge');
      }

    } catch (err) {
      console.error('Corporate payment error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFlow = () => {
    setCardData(null);
    setThreeDSResult(null);
    setOrderResult(null);
    setCustomerUserId(null);
    setError(null);
    setCurrentStep('card');
  };

  const getStepStatus = (step: string) => {
    const steps = ['card', '3ds', 'order', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case 'current':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Corporate Payment Flow Progress
          </CardTitle>
          <CardDescription>
            Live integration with Duffel's card processing and 3D Secure authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Card Storage</span>
                {getStatusBadge(getStepStatus('card'))}
              </div>
              <div className="text-xs text-gray-600">
                PCI-compliant card capture via api.duffel.cards
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">3DS Session</span>
                {getStatusBadge(getStepStatus('3ds'))}
              </div>
              <div className="text-xs text-gray-600">
                secure_corporate_payment exception
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Order Creation</span>
                {getStatusBadge(getStepStatus('order'))}
              </div>
              <div className="text-xs text-gray-600">
                Customer User association
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Complete</span>
                {getStatusBadge(getStepStatus('complete'))}
              </div>
              <div className="text-xs text-gray-600">
                Booking confirmed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Card Input Step */}
      {currentStep === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Corporate Card Details
            </CardTitle>
            <CardDescription>
              Using test card 4111110116638870 for corporate payment demonstration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Secure Corporate Environment:</strong> This payment will use the secure_corporate_payment exception, bypassing user authentication challenges for corporate cards.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Test Card Number</div>
                <div className="p-3 bg-gray-50 rounded font-mono">4111 1101 1663 8870</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Card Type</div>
                <div className="p-3 bg-gray-50 rounded">Visa Corporate (Ready for Payment)</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Expiry</div>
                <div className="p-3 bg-gray-50 rounded">03/30</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">CVC</div>
                <div className="p-3 bg-gray-50 rounded">123</div>
              </div>
            </div>

            <Button 
              onClick={handleCardSubmit} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing Corporate Payment...' : 'Process Corporate Payment'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {cardData && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Processing Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Card Data */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Card Stored Successfully
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Card ID:</span> {cardData.id}
                </div>
                <div>
                  <span className="font-medium">Last 4 Digits:</span> {cardData.last_4_digits}
                </div>
                <div>
                  <span className="font-medium">Brand:</span> {cardData.brand}
                </div>
                <div>
                  <span className="font-medium">Live Mode:</span> {cardData.live_mode ? 'Yes' : 'Test'}
                </div>
              </div>
            </div>

            {customerUserId && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Customer User Created
                  </h4>
                  <div className="text-sm">
                    <span className="font-medium">User ID:</span> {customerUserId}
                  </div>
                </div>
              </>
            )}

            {threeDSResult && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    3DS Session Created
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Session ID:</span> {threeDSResult.id}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge className="ml-2 bg-green-100 text-green-800">{threeDSResult.status}</Badge>
                    </div>
                  </div>
                </div>
              </>
            )}

            {orderResult && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Corporate Order Created
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Order ID:</span> {orderResult.id}
                    </div>
                    <div>
                      <span className="font-medium">Booking Reference:</span> {orderResult.booking_reference}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> {orderResult.total_currency} {(parseInt(orderResult.total_amount) / 100).toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge className="ml-2 bg-green-100 text-green-800">Confirmed</Badge>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 'complete' && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Corporate Payment Complete!</strong> The booking has been successfully processed using Duffel's secure corporate payment system with Customer User integration.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={resetFlow} variant="outline" className="w-full">
                    Test Another Corporate Payment
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}