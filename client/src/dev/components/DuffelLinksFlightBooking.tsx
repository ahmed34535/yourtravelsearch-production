import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plane, Users, Calendar, DollarSign, ExternalLink, CheckCircle, Building } from 'lucide-react';
import { duffelLinksService } from '../services/DuffelLinksService';
import { PricingService } from '../services/PricingService';

interface FlightSearchForm {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  isRoundTrip: boolean;
}

interface SessionResult {
  id: string;
  url: string;
  reference: string;
  markup_rate: string;
  status: string;
  expires_at: string;
}

export function DuffelLinksFlightBooking() {
  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    origin: 'LHR',
    destination: 'JFK',
    departureDate: '2024-03-15',
    returnDate: '2024-03-22',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy',
    isRoundTrip: true
  });

  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FlightSearchForm, value: string | number | boolean) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createBookingSession = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const userRef = `corp_flight_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      const sessionResponse = await duffelLinksService.createLinkSession({
        userReference: userRef,
        searchParams: {
          origin: searchForm.origin,
          destination: searchForm.destination,
          departure_date: searchForm.departureDate,
          return_date: searchForm.isRoundTrip ? searchForm.returnDate : undefined,
          passengers: {
            adults: searchForm.adults,
            children: searchForm.children,
            infants: searchForm.infants
          },
          cabin_class: searchForm.cabinClass as any
        },
        customization: {
          primary_color: '#2563eb',
          logo_url: `${window.location.origin}/logo.png`
        }
      });

      setSessionResult({
        id: sessionResponse.data.id,
        url: sessionResponse.data.url,
        reference: sessionResponse.data.reference,
        markup_rate: sessionResponse.data.markup_rate,
        status: sessionResponse.data.status,
        expires_at: sessionResponse.data.expires_at
      });

      console.log('Duffel Links session created:', sessionResponse.data);
    } catch (err) {
      console.error('Session creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking session');
    } finally {
      setIsCreating(false);
    }
  };

  const openBookingWindow = () => {
    if (sessionResult?.url) {
      window.open(sessionResult.url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    }
  };

  const resetSession = () => {
    setSessionResult(null);
    setError(null);
  };

  const popularRoutes = [
    { from: 'LHR', to: 'JFK', label: 'London → New York' },
    { from: 'LAX', to: 'NRT', label: 'Los Angeles → Tokyo' },
    { from: 'CDG', to: 'SIN', label: 'Paris → Singapore' },
    { from: 'DXB', to: 'LHR', label: 'Dubai → London' }
  ];

  const setPopularRoute = (from: string, to: string) => {
    setSearchForm(prev => ({
      ...prev,
      origin: from,
      destination: to
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Booking with 2% Markup
          </CardTitle>
          <CardDescription>
            Create Duffel Links session for hosted flight booking with automatic revenue generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50">
            <DollarSign className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              <strong>Pricing Formula:</strong> Final Price = (Base Price + 2% Markup) / (1 - 0.029)
              <br />
              <strong>Customer Display:</strong> Only final price shown (covers 2.9% Duffel fee + preserves 2% profit)
            </AlertDescription>
          </Alert>

          {/* Pricing Examples */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">Base $100</div>
              <div className="font-mono font-medium text-green-600">
                {PricingService.formatCustomerPrice(PricingService.calculateFlightPrice(100))}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">Base $500</div>
              <div className="font-mono font-medium text-green-600">
                {PricingService.formatCustomerPrice(PricingService.calculateFlightPrice(500))}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">Base $1000</div>
              <div className="font-mono font-medium text-green-600">
                {PricingService.formatCustomerPrice(PricingService.calculateFlightPrice(1000))}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">Base $1500</div>
              <div className="font-mono font-medium text-green-600">
                {PricingService.formatCustomerPrice(PricingService.calculateFlightPrice(1500))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Search Form */}
      {!sessionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Flight Search Parameters</CardTitle>
            <CardDescription>
              Configure your flight search for the Duffel hosted booking experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Popular Routes */}
            <div className="space-y-3">
              <Label>Popular Corporate Routes</Label>
              <div className="grid grid-cols-2 gap-2">
                {popularRoutes.map((route, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPopularRoute(route.from, route.to)}
                    className="justify-start"
                  >
                    {route.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Route Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin Airport</Label>
                <Input
                  id="origin"
                  value={searchForm.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value.toUpperCase())}
                  placeholder="LHR"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Airport</Label>
                <Input
                  id="destination"
                  value={searchForm.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value.toUpperCase())}
                  placeholder="JFK"
                  maxLength={3}
                />
              </div>
            </div>

            {/* Trip Type */}
            <div className="space-y-3">
              <Label>Trip Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={searchForm.isRoundTrip}
                    onChange={() => handleInputChange('isRoundTrip', true)}
                  />
                  <span>Round Trip</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!searchForm.isRoundTrip}
                    onChange={() => handleInputChange('isRoundTrip', false)}
                  />
                  <span>One Way</span>
                </label>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={searchForm.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                />
              </div>
              {searchForm.isRoundTrip && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={searchForm.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Passengers */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults">Adults</Label>
                <Select
                  value={searchForm.adults.toString()}
                  onValueChange={(value) => handleInputChange('adults', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <Select
                  value={searchForm.children.toString()}
                  onValueChange={(value) => handleInputChange('children', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="infants">Infants</Label>
                <Select
                  value={searchForm.infants.toString()}
                  onValueChange={(value) => handleInputChange('infants', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cabin Class */}
            <div className="space-y-2">
              <Label htmlFor="cabinClass">Cabin Class</Label>
              <Select
                value={searchForm.cabinClass}
                onValueChange={(value) => handleInputChange('cabinClass', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={createBookingSession} 
              disabled={isCreating}
              className="w-full"
              size="lg"
            >
              {isCreating ? 'Creating Booking Session...' : 'Create Flight Booking Session'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Session Result */}
      {sessionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Booking Session Created
            </CardTitle>
            <CardDescription>
              Duffel hosted booking experience with 2% markup configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Building className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                <strong>Session Active:</strong> Corporate booking environment ready with automatic markup applied to flight prices.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Session Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Session ID:</span>
                    <div className="font-mono bg-gray-50 p-1 rounded text-xs mt-1">{sessionResult.id}</div>
                  </div>
                  <div>
                    <span className="font-medium">Reference:</span> {sessionResult.reference}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">{sessionResult.status}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Expires:</span> {new Date(sessionResult.expires_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Revenue Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Markup Rate:</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-800">{sessionResult.markup_rate}% (2%)</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Applied To:</span> Flight base fares only
                  </div>
                  <div>
                    <span className="font-medium">Ancillaries:</span> No markup (bags, seats, etc.)
                  </div>
                  <div>
                    <span className="font-medium">Currency:</span> USD
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Flight Search Configuration</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Route:</span> {searchForm.origin} → {searchForm.destination}
                </div>
                <div>
                  <span className="font-medium">Departure:</span> {searchForm.departureDate}
                </div>
                {searchForm.isRoundTrip && (
                  <div>
                    <span className="font-medium">Return:</span> {searchForm.returnDate}
                  </div>
                )}
                <div>
                  <span className="font-medium">Passengers:</span> {searchForm.adults} Adults
                  {searchForm.children > 0 && `, ${searchForm.children} Children`}
                  {searchForm.infants > 0 && `, ${searchForm.infants} Infants`}
                </div>
                <div>
                  <span className="font-medium">Class:</span> {searchForm.cabinClass.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Trip Type:</span> {searchForm.isRoundTrip ? 'Round Trip' : 'One Way'}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={openBookingWindow} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Duffel Booking Experience
              </Button>
              <Button onClick={resetSession} variant="outline">
                Create New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}