import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CreditCard, Plane, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AirlineCredit {
  passenger_id: string;
  credit_name: string;
  credit_currency: string;
  credit_amount: string;
  credit_code: string | null;
}

interface OrderCancellation {
  id: string;
  order_id: string;
  refund_currency: string;
  refund_amount: string;
  refund_to: 'original_form_of_payment' | 'airline_credits' | 'voucher';
  expires_at: string;
  confirmed_at: string | null;
  airline_credits?: AirlineCredit[];
}

interface OrderCancellationProps {
  orderId: string;
  availableActions: string[];
  onCancel?: () => void;
}

export function OrderCancellation({ orderId, availableActions, onCancel }: OrderCancellationProps) {
  const [cancellationQuote, setCancellationQuote] = useState<OrderCancellation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if cancellation is available for this order
  const canCancel = availableActions.includes('cancel');

  const createCancellationQuote = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In live mode, this would call the Duffel API
      // For demo purposes, we simulate the response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockQuote: OrderCancellation = {
        id: 'ore_00009qzZWzjDipIkqpaUAj',
        order_id: orderId,
        refund_currency: 'GBP',
        refund_amount: '90.80',
        refund_to: 'original_form_of_payment',
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        confirmed_at: null,
        airline_credits: undefined
      };
      
      setCancellationQuote(mockQuote);
    } catch (err) {
      setError('Failed to create cancellation quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCancellation = async () => {
    if (!cancellationQuote) return;
    
    setIsConfirming(true);
    setError(null);
    
    try {
      // In live mode, this would call the Duffel API confirmation endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCancellationQuote({
        ...cancellationQuote,
        confirmed_at: new Date().toISOString()
      });
      setConfirmed(true);
      onCancel?.();
    } catch (err) {
      setError('Failed to confirm cancellation. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const formatExpiryTime = (expiresAt: string) => {
    const expiryTime = new Date(expiresAt);
    const now = new Date();
    const minutesRemaining = Math.max(0, Math.floor((expiryTime.getTime() - now.getTime()) / (1000 * 60)));
    
    if (minutesRemaining === 0) {
      return 'Expired';
    }
    
    return `${minutesRemaining} minutes remaining`;
  };

  if (!canCancel) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">Cancellation Not Available</p>
              <p className="text-sm text-orange-600">
                This order cannot be cancelled through the API. Please contact customer support for manual cancellation assistance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (confirmed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Order Successfully Cancelled</p>
              <p className="text-sm text-green-600">
                Your cancellation has been confirmed. The refund will be processed according to the details below.
              </p>
            </div>
          </div>
          
          {cancellationQuote && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Refund Amount:</span>
                <span className="font-medium">{cancellationQuote.refund_currency} {cancellationQuote.refund_amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Refund Method:</span>
                <Badge variant="outline">
                  {cancellationQuote.refund_to === 'original_form_of_payment' ? 'Original Payment Method' : 
                   cancellationQuote.refund_to === 'airline_credits' ? 'Airline Credits' : 'Voucher'}
                </Badge>
              </div>
              
              {cancellationQuote.airline_credits && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-800 mb-2">Airline Credits</p>
                  {cancellationQuote.airline_credits.map((credit, index) => (
                    <div key={index} className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-600">{credit.credit_name}:</span>
                        <span className="font-medium">{credit.credit_currency} {credit.credit_amount}</span>
                      </div>
                      {credit.credit_code && (
                        <div className="text-xs text-blue-600">
                          Credit Code: <span className="font-mono">{credit.credit_code}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-600" />
          Cancel Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {!cancellationQuote ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Get a cancellation quote to review refund details before confirming the cancellation.
            </p>
            
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> Cancellation policies vary by airline and fare type. 
                Review the quote carefully before confirming as this action cannot be undone.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={createCancellationQuote}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Quote...' : 'Get Cancellation Quote'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cancellation Quote</span>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  {formatExpiryTime(cancellationQuote.expires_at)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Refund Amount:</span>
                  <div className="font-medium text-lg">
                    {cancellationQuote.refund_currency} {cancellationQuote.refund_amount}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Refund Method:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {cancellationQuote.refund_to === 'original_form_of_payment' && (
                      <>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Original Payment</span>
                      </>
                    )}
                    {cancellationQuote.refund_to === 'airline_credits' && (
                      <>
                        <Plane className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Airline Credits</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {cancellationQuote.airline_credits && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="font-medium text-blue-800 mb-2">Airline Credit Details</p>
                  {cancellationQuote.airline_credits.map((credit, index) => (
                    <div key={index} className="text-sm text-blue-600">
                      <div>{credit.credit_name}: {credit.credit_currency} {credit.credit_amount}</div>
                      <div className="text-xs mt-1">Credit code will be provided after confirmation</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Final Warning:</strong> Once confirmed, this cancellation cannot be reversed. 
                Please ensure you want to proceed with cancelling this order.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCancellationQuote(null)}
                className="flex-1"
              >
                Get New Quote
              </Button>
              <Button 
                onClick={confirmCancellation}
                disabled={isConfirming}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isConfirming ? 'Confirming...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}