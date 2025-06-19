import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Plane, Clock, MapPin, Mail, Phone, Download, Calendar, Users, FileText, Send, Printer } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function BookingConfirmation() {
  const [, setLocation] = useLocation();
  const [bookingRef, setBookingRef] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setBookingRef(ref);
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['/api/bookings/reference', bookingRef],
    queryFn: () => bookingRef ? apiRequest('GET', `/api/bookings/reference/${bookingRef}`) : null,
    enabled: !!bookingRef,
  });

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

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      const response = await apiRequest('GET', `/api/bookings/${bookingRef}/receipt`, {
        responseType: 'blob'
      });
      
      // Create blob URL and download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TravalSearch-Receipt-${bookingRef}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download receipt:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailReceipt = async () => {
    setIsSendingEmail(true);
    try {
      await apiRequest('POST', `/api/bookings/${bookingRef}/email-receipt`);
      // Show success message to user
    } catch (error) {
      console.error('Failed to email receipt:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading booking details...</h2>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to find booking details</p>
          <Button onClick={() => setLocation('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const bookingDetails = booking.details ? JSON.parse(booking.details) : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">Your flight has been successfully booked</p>
          <div className="mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Booking Reference: {booking.reference}
            </Badge>
          </div>
        </div>

        {/* 24-Hour Cancellation Notice */}
        {booking && isWithin24Hours(booking.createdAt) && (
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-green-800 mb-1">24-Hour Free Cancellation Available</h3>
                  <p className="text-sm text-green-700 mb-2">
                    Cancel your booking for free within 24 hours of booking. Time remaining: {getTimeRemaining(booking.createdAt)}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-green-300 text-green-700 hover:bg-green-100"
                    onClick={() => handleCancelBooking()}
                  >
                    Cancel Booking (Free)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadReceipt} disabled={isDownloading}>
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download E-Ticket'}
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleEmailReceipt} disabled={isSendingEmail}>
            <Mail className="w-4 h-4" />
            {isSendingEmail ? 'Sending...' : 'Email Confirmation'}
          </Button>
          <Button variant="outline" onClick={() => setLocation('/profile')}>
            View All Bookings
          </Button>
          {!isWithin24Hours(booking?.createdAt || '') && (
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleCancelBooking()}>
              <X className="w-4 h-4 mr-2" />
              Cancel Booking
            </Button>
          )}
        </div>

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
                {bookingDetails.slices?.map((slice: any, index: number) => (
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
                              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                              <div className="flex-1 h-0.5 bg-gray-300 relative">
                                <Plane className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                              </div>
                              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(slice.duration)}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 mt-2">
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
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Passenger Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingDetails.passengers?.map((passenger: any, index: number) => (
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
                      <div className="text-right">
                        {passenger.email && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {passenger.email}
                          </p>
                        )}
                        {passenger.phone_number && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {passenger.phone_number}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Reference</span>
                    <span className="font-medium">{booking.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Type</span>
                    <span className="font-medium capitalize">{booking.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked On</span>
                    <span className="font-medium">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Total</span>
                    <span className="font-medium">${booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium">{booking.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Paid
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Important Notes */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Check-in opens 24 hours before departure</li>
                    <li>• Arrive at airport 2 hours before domestic flights</li>
                    <li>• Arrive at airport 3 hours before international flights</li>
                    <li>• Bring valid ID and passport if required</li>
                  </ul>
                </div>

                {/* Receipt Actions */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Receipt Options
                  </h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full text-green-700 border-green-200 hover:bg-green-100"
                      onClick={handleDownloadReceipt}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Download PDF Receipt
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-green-700 border-green-200 hover:bg-green-100"
                      onClick={handleEmailReceipt}
                      disabled={isSendingEmail}
                    >
                      {isSendingEmail ? (
                        <div className="animate-spin w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Email Receipt
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-green-700 border-green-200 hover:bg-green-100"
                      onClick={handlePrintReceipt}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => setLocation('/flights')}>
                    Book Another Flight
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setLocation('/profile')}>
                    Manage Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}