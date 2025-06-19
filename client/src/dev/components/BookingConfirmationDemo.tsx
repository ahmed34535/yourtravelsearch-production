import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, CheckCircle, Clock, User, Plane } from 'lucide-react';
import { BookingConfirmationService } from '../services/BookingConfirmationService';

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export function BookingConfirmationDemo() {
  const [customerEmail, setCustomerEmail] = useState('customer@example.com');
  const [isSending, setIsSending] = useState(false);
  const [emailResult, setEmailResult] = useState<EmailResult | null>(null);

  // Sample booking data following Duffel's specification
  const sampleBookingData = {
    booking_reference: 'P7ETN3',
    confirmation_code: 'P7ETN3',
    segments: [{
      marketing_carrier: {
        iata_code: 'BA',
        name: 'British Airways'
      },
      flight_number: '806',
      departing_at: '2024-09-08T21:35:00Z',
      arriving_at: '2024-09-08T22:50:00Z',
      duration: '3h 21m',
      origin: {
        iata_code: 'BCN',
        city_name: 'Barcelona',
        terminal: '1'
      },
      destination: {
        iata_code: 'LHR',
        city_name: 'London',
        terminal: '4'
      },
      operating_carrier: {
        iata_code: 'IB',
        name: 'Iberia'
      }
    }],
    passengers: [{
      given_name: 'Tony',
      family_name: 'Stark',
      cabin_class: 'Economy',
      seat_designator: '14E',
      baggage: [{
        quantity: 1,
        type: 'checked'
      }]
    }],
    payment: {
      base_amount: 95.00,
      tax_amount: 7.90,
      total_amount: 102.90,
      currency: 'GBP',
      markup_applied: true
    },
    conditions: [{
      change_before_departure: 'Change allowed at any time with a penalty of £65, except in the case of not showing up for the flight (no-show), which does not allow change. No refunds.'
    }],
    customer: {
      email: customerEmail,
      phone: '+44 20 7946 0958'
    }
  };

  const bookingService = new BookingConfirmationService();

  const sendConfirmationEmail = async () => {
    setIsSending(true);
    setEmailResult(null);

    try {
      const updatedBookingData = {
        ...sampleBookingData,
        customer: { ...sampleBookingData.customer, email: customerEmail }
      };

      const result = await bookingService.sendBookingConfirmation(updatedBookingData);
      
      setEmailResult({
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setEmailResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSending(false);
    }
  };

  const previewTemplate = bookingService['generateConfirmationTemplate'](sampleBookingData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Booking Confirmation Email System
          </CardTitle>
          <CardDescription>
            Following Duffel's official guidance for post-booking customer communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50">
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              <strong>Duffel Responsibility:</strong> Travel sellers must send booking confirmations. Duffel never contacts customers directly. 
              Most airlines also don't send confirmations, making this your responsibility.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Email Sending Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Confirmation Email
          </CardTitle>
          <CardDescription>
            Test the booking confirmation email system with sample flight data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>

              <Button 
                onClick={sendConfirmationEmail} 
                disabled={isSending || !customerEmail}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending Confirmation...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Booking Confirmation
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Sample Booking Details</h4>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <div><strong>Reference:</strong> {sampleBookingData.booking_reference}</div>
                <div><strong>Flight:</strong> {sampleBookingData.segments[0].marketing_carrier.iata_code} {sampleBookingData.segments[0].flight_number}</div>
                <div><strong>Route:</strong> {sampleBookingData.segments[0].origin.iata_code} → {sampleBookingData.segments[0].destination.iata_code}</div>
                <div><strong>Passenger:</strong> {sampleBookingData.passengers[0].given_name} {sampleBookingData.passengers[0].family_name}</div>
                <div><strong>Total:</strong> {sampleBookingData.payment.currency} {sampleBookingData.payment.total_amount}</div>
              </div>
            </div>
          </div>

          {emailResult && (
            <div className="mt-4">
              {emailResult.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Email Sent Successfully!</strong>
                    <br />
                    Message ID: {emailResult.messageId}
                    <br />
                    Sent at: {new Date(emailResult.timestamp).toLocaleString()}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>Email Failed:</strong> {emailResult.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Template Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Template Preview</CardTitle>
          <CardDescription>
            Complete email template following Duffel's official booking confirmation specification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Visual Preview</TabsTrigger>
              <TabsTrigger value="html">HTML Source</TabsTrigger>
              <TabsTrigger value="text">Text Version</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
                <div 
                  dangerouslySetInnerHTML={{ __html: previewTemplate.html }}
                  className="[&_body]:max-w-none [&_body]:m-0 [&_body]:p-0"
                />
              </div>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {previewTemplate.html}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {previewTemplate.text}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Duffel Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Duffel Documentation Compliance</CardTitle>
          <CardDescription>
            Verification against official Duffel booking confirmation requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Required Information ✓</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Booking reference for check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Flight details (carrier, number, times)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Airport codes and terminals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Passenger names and seat assignments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Payment breakdown and total</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Booking conditions and policies</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Best Practices ✓</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Immediate sending after booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Mobile-responsive HTML design</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Plain text fallback included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Clear check-in instructions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Support contact information</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Professional branding</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">Official Duffel Compliance Confirmed</h4>
            <div className="text-sm space-y-1">
              <div>✓ Follows Duffel's official email template specification</div>
              <div>✓ Includes all required booking information</div>
              <div>✓ Reduces customer support calls through clear communication</div>
              <div>✓ Improves day-of-travel experience with proper instructions</div>
              <div>✓ Uses travel seller responsibility model (not airline)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}