import { Search, Calendar, Users, MapPin, Plane, CreditCard, Phone, Mail, AlertTriangle, CheckCircle, Clock, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function ManageBooking() {
  const [bookingReference, setBookingReference] = useState("");
  const [email, setEmail] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  const handleSearch = () => {
    if (bookingReference && email) {
      setShowBooking(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Search className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Manage Your Booking</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            View, modify, or cancel your travel reservations quickly and easily
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Find Your Booking</CardTitle>
              <p className="text-center text-gray-600">Enter your booking details to access your reservation</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Reference *</label>
                <Input 
                  placeholder="Enter your 6-character booking reference (e.g., ABC123)"
                  value={bookingReference}
                  onChange={(e) => setBookingReference(e.target.value)}
                  className="text-center text-lg font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Found in your confirmation email</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <Input 
                  type="email"
                  placeholder="Enter the email used for booking"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSearch}
                disabled={!bookingReference || !email}
              >
                <Search className="w-4 h-4 mr-2" />
                Find My Booking
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Can't find your booking reference? <span className="text-blue-600 cursor-pointer hover:underline">Contact Support</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Details (shown after search) */}
      {showBooking && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Booking Reference: TRV123456</h2>
                  <p className="text-gray-600">Booked on March 15, 2024</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>
            </div>

            <Tabs defaultValue="details" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Flight Details</TabsTrigger>
                <TabsTrigger value="passengers">Passengers</TabsTrigger>
                <TabsTrigger value="services">Add Services</TabsTrigger>
                <TabsTrigger value="manage">Manage Booking</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="space-y-6">
                  {/* Outbound Flight */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Plane className="w-5 h-5 mr-2" />
                        Outbound Flight - March 25, 2024
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Departure</p>
                          <p className="font-semibold">New York (JFK)</p>
                          <p className="text-lg font-bold">8:30 AM</p>
                          <p className="text-sm text-gray-600">Terminal 4</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Flight</p>
                          <p className="font-semibold">Delta Air Lines DL 1234</p>
                          <p className="text-sm text-gray-600">Duration: 6h 15m</p>
                          <p className="text-sm text-gray-600">Nonstop</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Arrival</p>
                          <p className="font-semibold">Los Angeles (LAX)</p>
                          <p className="text-lg font-bold">11:45 AM</p>
                          <p className="text-sm text-gray-600">Terminal 2</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Return Flight */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Plane className="w-5 h-5 mr-2" />
                        Return Flight - March 30, 2024
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Departure</p>
                          <p className="font-semibold">Los Angeles (LAX)</p>
                          <p className="text-lg font-bold">2:15 PM</p>
                          <p className="text-sm text-gray-600">Terminal 2</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Flight</p>
                          <p className="font-semibold">Delta Air Lines DL 5678</p>
                          <p className="text-sm text-gray-600">Duration: 5h 45m</p>
                          <p className="text-sm text-gray-600">Nonstop</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Arrival</p>
                          <p className="font-semibold">New York (JFK)</p>
                          <p className="text-lg font-bold">10:00 PM</p>
                          <p className="text-sm text-gray-600">Terminal 4</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="passengers">
                <Card>
                  <CardHeader>
                    <CardTitle>Passenger Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Passenger 1</h3>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-semibold">John Doe</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Date of Birth</p>
                            <p className="font-semibold">January 15, 1985</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Seat Selection</p>
                            <p className="font-semibold">12A (Outbound), 15C (Return)</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Special Requests</p>
                            <p className="font-semibold">Vegetarian Meal</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Passenger 2</h3>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-semibold">Jane Doe</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Date of Birth</p>
                            <p className="font-semibold">March 22, 1987</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Seat Selection</p>
                            <p className="font-semibold">12B (Outbound), 15D (Return)</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Special Requests</p>
                            <p className="font-semibold">None</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Baggage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Add checked bags to your booking</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">Checked Bag (23kg)</p>
                            <p className="text-sm text-gray-600">Per bag, per flight</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">$35</p>
                            <Button size="sm">Add</Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">Extra Bag (23kg)</p>
                            <p className="text-sm text-gray-600">Second bag, per flight</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">$55</p>
                            <Button size="sm">Add</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Seat Selection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Choose your preferred seats</p>
                      <div className="space-y-3">
                        <Button className="w-full" variant="outline">
                          View Seat Map - Outbound
                        </Button>
                        <Button className="w-full" variant="outline">
                          View Seat Map - Return
                        </Button>
                        <p className="text-sm text-gray-600">Current seats: 12A & 12B (Outbound), 15C & 15D (Return)</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Insurance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Protect your trip with comprehensive coverage</p>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <p className="font-semibold">Comprehensive Coverage</p>
                          <p className="text-sm text-gray-600 mb-2">Trip cancellation, medical, baggage</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">$89</span>
                            <Button size="sm">Add Insurance</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Special Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Add special assistance or services</p>
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline" size="sm">
                          Wheelchair Assistance
                        </Button>
                        <Button className="w-full" variant="outline" size="sm">
                          Special Meals
                        </Button>
                        <Button className="w-full" variant="outline" size="sm">
                          Pet Travel
                        </Button>
                        <Button className="w-full" variant="outline" size="sm">
                          Unaccompanied Minor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="manage">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Edit className="w-5 h-5 mr-2" />
                        Change Booking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Modify your flight dates, times, or destinations</p>
                      <div className="space-y-3">
                        <Button className="w-full">Change Flights</Button>
                        <div className="text-sm text-gray-600">
                          <p>• Change fees may apply</p>
                          <p>• Fare difference will be calculated</p>
                          <p>• Subject to availability</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <X className="w-5 h-5 mr-2" />
                        Cancel Booking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Cancel your entire reservation</p>
                      <div className="space-y-3">
                        <Button variant="destructive" className="w-full">Cancel Booking</Button>
                        <div className="text-sm text-gray-600">
                          <p>• 24-hour free cancellation</p>
                          <p>• Cancellation fees may apply</p>
                          <p>• Refund processing: 7-10 days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Check-in
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Online check-in opens 24 hours before departure</p>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-semibold text-yellow-800">Check-in available March 24, 8:30 AM</p>
                        </div>
                        <Button className="w-full" disabled>
                          <Clock className="w-4 h-4 mr-2" />
                          Check-in Not Available Yet
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Paid:</span>
                          <span className="font-bold">$649.00</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Payment Method:</span>
                          <span>**** **** **** 1234</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Transaction ID:</span>
                          <span>TXN123456789</span>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          View Receipt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Plane className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flight Status</h3>
                <p className="text-sm text-gray-600 mb-4">Check real-time flight information</p>
                <Button variant="outline" size="sm">Check Status</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Online Check-in</h3>
                <p className="text-sm text-gray-600 mb-4">Check in and get boarding passes</p>
                <Button variant="outline" size="sm">Check In</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 mb-4">Get help with your booking</p>
                <Button variant="outline" size="sm">Call Support</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Confirmation</h3>
                <p className="text-sm text-gray-600 mb-4">Resend booking confirmation</p>
                <Button variant="outline" size="sm">Resend Email</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Important Reminders</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Check-in opens 24 hours before departure</li>
                <li>• Arrive at the airport 2 hours early for domestic flights, 3 hours for international</li>
                <li>• Ensure your ID matches the name on your booking exactly</li>
                <li>• Check current travel requirements and restrictions for your destination</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}