import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit3, Calendar, Plane, Clock, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OrderSlice {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departure_date: string;
  arrival_date: string;
  changeable: boolean;
  conditions: {
    change_before_departure?: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
    };
  };
  segments: Array<{
    id: string;
    departing_at: string;
    arriving_at: string;
    flight_number: string;
    marketing_carrier: {
      iata_code: string;
      name: string;
    };
  }>;
}

interface OrderChange {
  id: string;
  order_id: string;
  created_at: string;
  confirmed_at: string | null;
  expires_at: string;
  change_total_amount: string;
  change_total_currency: string;
  penalty_total_amount?: string;
  penalty_total_currency?: string;
  new_total_amount: string;
  new_total_currency: string;
}

interface OrderChangeProps {
  orderId: string;
  slices: OrderSlice[];
  availableActions: string[];
  onChangeConfirmed?: () => void;
}

export function OrderChange({ orderId, slices, availableActions, onChangeConfirmed }: OrderChangeProps) {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const [newDepartureDate, setNewDepartureDate] = useState('');
  const [changeQuote, setChangeQuote] = useState<OrderChange | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if changes are available for this order
  const canChange = availableActions.includes('change');
  const changeableSlices = slices.filter(slice => slice.changeable);

  const createChangeQuote = async () => {
    if (!selectedSlice || !newDepartureDate) {
      setError('Please select a flight segment and new departure date.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // In live mode, this would call the Duffel API
      // For demo purposes, we simulate the response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const slice = slices.find(s => s.id === selectedSlice);
      const mockQuote: OrderChange = {
        id: 'orc_00009qzZWzjDipIkqpaUAj',
        order_id: orderId,
        created_at: new Date().toISOString(),
        confirmed_at: null,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        change_total_amount: '85.50',
        change_total_currency: 'GBP',
        penalty_total_amount: '25.00',
        penalty_total_currency: 'GBP',
        new_total_amount: '562.50',
        new_total_currency: 'GBP'
      };
      
      setChangeQuote(mockQuote);
    } catch (err) {
      setError('Failed to create change quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmChange = async () => {
    if (!changeQuote) return;
    
    setIsConfirming(true);
    setError(null);
    
    try {
      // In live mode, this would call the Duffel API confirmation endpoint
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setChangeQuote({
        ...changeQuote,
        confirmed_at: new Date().toISOString()
      });
      setConfirmed(true);
      onChangeConfirmed?.();
    } catch (err) {
      setError('Failed to confirm order change. Please try again.');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!canChange || changeableSlices.length === 0) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">Changes Not Available</p>
              <p className="text-sm text-orange-600">
                {!canChange 
                  ? 'This order cannot be changed through the API. Please contact customer support for assistance.'
                  : 'No flight segments in this order are eligible for changes. This may be due to fare restrictions or departure times.'
                }
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
              <p className="font-medium text-green-800">Order Successfully Changed</p>
              <p className="text-sm text-green-600">
                Your flight change has been confirmed. Updated booking details will be sent to your email.
              </p>
            </div>
          </div>
          
          {changeQuote && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Change Fee:</span>
                <span className="font-medium">
                  {changeQuote.change_total_currency} {changeQuote.change_total_amount}
                </span>
              </div>
              {changeQuote.penalty_total_amount && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Penalty Fee:</span>
                  <span className="font-medium">
                    {changeQuote.penalty_total_currency} {changeQuote.penalty_total_amount}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-sm font-medium text-gray-800">New Total:</span>
                <span className="font-bold text-lg">
                  {changeQuote.new_total_currency} {changeQuote.new_total_amount}
                </span>
              </div>
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
          <Edit3 className="h-5 w-5 text-blue-600" />
          Change Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {!changeQuote ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select a flight segment to change and specify your preferred new departure date.
            </p>

            {/* Display current flight segments */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Current Flight Segments:</Label>
              {changeableSlices.map((slice) => (
                <div key={slice.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {slice.origin.iata_code} → {slice.destination.iata_code}
                      </span>
                      {slice.conditions.change_before_departure?.penalty_amount && (
                        <Badge variant="outline" className="text-xs">
                          Change fee: {slice.conditions.change_before_departure.penalty_currency} {slice.conditions.change_before_departure.penalty_amount}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant={selectedSlice === slice.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSlice(slice.id)}
                    >
                      {selectedSlice === slice.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <div>
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {slice.origin.name}
                    </div>
                    <div>
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {slice.destination.name}
                    </div>
                    <div>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {formatDate(slice.departure_date)}
                    </div>
                    <div>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {slice.segments.length > 0 && formatTime(slice.segments[0].departing_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New departure date selection */}
            <div className="space-y-2">
              <Label htmlFor="new-date">New Departure Date</Label>
              <Input
                id="new-date"
                type="date"
                value={newDepartureDate}
                onChange={(e) => setNewDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> Change fees and penalties may apply. Review the quote carefully before confirming as availability is not guaranteed.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={createChangeQuote}
              disabled={isLoading || !selectedSlice || !newDepartureDate}
              className="w-full"
            >
              {isLoading ? 'Creating Quote...' : 'Get Change Quote'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Change Quote</span>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  {formatExpiryTime(changeQuote.expires_at)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Change Fee:</span>
                  <div className="font-medium">
                    {changeQuote.change_total_currency} {changeQuote.change_total_amount}
                  </div>
                </div>
                {changeQuote.penalty_total_amount && (
                  <div>
                    <span className="text-gray-600">Penalty Fee:</span>
                    <div className="font-medium">
                      {changeQuote.penalty_total_currency} {changeQuote.penalty_total_amount}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">New Total Amount:</span>
                  <span className="font-bold text-lg">
                    {changeQuote.new_total_currency} {changeQuote.new_total_amount}
                  </span>
                </div>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Review Required:</strong> Once confirmed, this change cannot be reversed. Additional restrictions may apply to your new booking.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setChangeQuote(null);
                  setSelectedSlice(null);
                  setNewDepartureDate('');
                }}
                className="flex-1"
              >
                Start Over
              </Button>
              <Button 
                onClick={confirmChange}
                disabled={isConfirming}
                className="flex-1"
              >
                {isConfirming ? 'Confirming...' : 'Confirm Change'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}