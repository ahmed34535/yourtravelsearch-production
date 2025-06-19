import { Shield, Clock, CreditCard, AlertTriangle, CheckCircle, X, DollarSign, Calendar, Plane, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cancellation Policy</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Understand your rights and options when you need to cancel your travel booking
          </p>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="py-8 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-bold">24-Hour Free Cancellation</h3>
              <p className="text-sm text-gray-600">Cancel within 24 hours of booking for a full refund</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-bold">Flexible Refund Options</h3>
              <p className="text-sm text-gray-600">Multiple refund methods based on fare type</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-bold">Travel Protection Available</h3>
              <p className="text-sm text-gray-600">Add insurance for additional cancellation coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="flights" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="flights">Flight Cancellations</TabsTrigger>
              <TabsTrigger value="hotels">Hotel Cancellations</TabsTrigger>
              <TabsTrigger value="packages">Package Cancellations</TabsTrigger>
              <TabsTrigger value="general">General Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="flights">
              <div className="space-y-8">
                {/* 24-Hour Rule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle className="w-6 h-6 mr-3" />
                      24-Hour Free Cancellation Rule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-lg">All flight bookings can be cancelled within 24 hours of purchase for a full refund, regardless of fare type.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Eligible Bookings:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Flights departing 7+ days from booking date</li>
                            <li>• All fare types (Basic, Standard, Flexible)</li>
                            <li>• Round-trip and one-way tickets</li>
                            <li>• Multi-city itineraries</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Refund Process:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Automatic refund to original payment method</li>
                            <li>• Processing time: 3-5 business days</li>
                            <li>• No cancellation fees applied</li>
                            <li>• Email confirmation sent immediately</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fare Type Policies */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        <Badge variant="secondary" className="mb-2">Basic Fare</Badge>
                        <p className="text-lg font-semibold">Non-Refundable</p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-red-600">
                          <X className="w-4 h-4 mr-2" />
                          <span>No refund after 24 hours</span>
                        </div>
                        <div className="flex items-center text-orange-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>Change fee: $200 + fare difference</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Credit valid for 12 months</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        <Badge className="mb-2">Standard Fare</Badge>
                        <p className="text-lg font-semibold">Partially Refundable</p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-orange-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>Cancellation fee: $150</span>
                        </div>
                        <div className="flex items-center text-blue-600">
                          <CreditCard className="w-4 h-4 mr-2" />
                          <span>Refund to original payment</span>
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Change fee: $100 + fare difference</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">
                        <Badge variant="default" className="mb-2 bg-green-600">Flexible Fare</Badge>
                        <p className="text-lg font-semibold">Fully Refundable</p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Full refund anytime</span>
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>No cancellation fees</span>
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Free changes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Airline-Specific Policies */}
                <Card>
                  <CardHeader>
                    <CardTitle>Airline-Specific Cancellation Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Major US Carriers</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium">Delta Air Lines</p>
                            <p className="text-gray-600">24-hour cancellation + same-day changes allowed</p>
                          </div>
                          <div>
                            <p className="font-medium">American Airlines</p>
                            <p className="text-gray-600">Basic Economy non-changeable, Main Cabin flexible</p>
                          </div>
                          <div>
                            <p className="font-medium">United Airlines</p>
                            <p className="text-gray-600">No change fees on most domestic flights</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">International Carriers</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium">Lufthansa</p>
                            <p className="text-gray-600">Varies by fare class, EU261 protection applies</p>
                          </div>
                          <div>
                            <p className="font-medium">Emirates</p>
                            <p className="text-gray-600">Flexible cancellation on premium fares</p>
                          </div>
                          <div>
                            <p className="font-medium">British Airways</p>
                            <p className="text-gray-600">24-hour cancellation + flexible rebooking</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hotels">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hotel Cancellation Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Standard Policy</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Free cancellation up to 24-48 hours before check-in</li>
                          <li>• Late cancellation fee: 1 night's room rate</li>
                          <li>• No-show fee: Full stay amount</li>
                          <li>• Prepaid rates may be non-refundable</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Flexible Rates</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Free cancellation until check-in day</li>
                          <li>• Full refund to original payment method</li>
                          <li>• Same-day cancellation allowed</li>
                          <li>• Higher nightly rate for flexibility</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Free Cancellation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">Cancel without penalty</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Up to 24-48 hours before</li>
                        <li>• Full refund guaranteed</li>
                        <li>• Most standard bookings</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-orange-600">Partially Refundable</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">Late cancellation fees apply</p>
                      <ul className="space-y-1 text-sm">
                        <li>• 1 night penalty after deadline</li>
                        <li>• Refund minus cancellation fee</li>
                        <li>• 7-10 day processing time</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Non-Refundable</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">No refund available</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Deeply discounted rates</li>
                        <li>• No changes or cancellations</li>
                        <li>• Travel insurance recommended</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="packages">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vacation Package Cancellations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Cancellation Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">45+ days before departure</span>
                            <Badge className="bg-green-600">$0 fee</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span className="font-medium">31-44 days before departure</span>
                            <Badge variant="secondary">$200 fee</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <span className="font-medium">15-30 days before departure</span>
                            <Badge className="bg-orange-600">50% of total</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="font-medium">14 days or less</span>
                            <Badge variant="destructive">100% forfeiture</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">What's Included in Packages</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Round-trip flights</li>
                            <li>• Hotel accommodations</li>
                            <li>• Airport transfers</li>
                            <li>• Some meals and activities</li>
                            <li>• Travel protection options</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Partial Cancellations</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Remove travelers from booking</li>
                            <li>• Reduce room quantity</li>
                            <li>• Cancel optional activities</li>
                            <li>• Fees may apply per change</li>
                            <li>• Subject to availability</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="general">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Cancellation Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Your Rights</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• 24-hour free cancellation on all bookings</li>
                          <li>• Clear disclosure of all fees before booking</li>
                          <li>• Multiple refund options when eligible</li>
                          <li>• Access to booking modifications when possible</li>
                          <li>• Customer service support throughout the process</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Refund Processing</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="font-medium mb-2">Credit Card Refunds</p>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>• 3-5 business days to original card</li>
                              <li>• Email confirmation provided</li>
                              <li>• Statement may take 1-2 billing cycles</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Travel Credits</p>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>• Valid for 12 months from issue date</li>
                              <li>• Transferable to family members</li>
                              <li>• Can be combined with new bookings</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Special Circumstances</h4>
                        <div className="space-y-3">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-2">Medical Emergencies</h5>
                            <p className="text-sm text-blue-800">Documentation required. May qualify for fee waivers with travel insurance.</p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <h5 className="font-medium text-yellow-900 mb-2">Weather/Natural Disasters</h5>
                            <p className="text-sm text-yellow-800">Flexible rebooking and waived fees for weather-related disruptions.</p>
                          </div>
                          <div className="p-4 bg-red-50 rounded-lg">
                            <h5 className="font-medium text-red-900 mb-2">Government Travel Restrictions</h5>
                            <p className="text-sm text-red-800">Full refunds available for government-imposed travel bans or restrictions.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Travel Insurance CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Protect Your Trip with Travel Insurance</h2>
          <p className="text-xl mb-8">
            Get additional cancellation coverage and peace of mind for unexpected situations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Trip Cancellation</h3>
              <p className="text-sm opacity-90">Cancel for any covered reason</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Medical Coverage</h3>
              <p className="text-sm opacity-90">Emergency medical expenses</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Baggage Protection</h3>
              <p className="text-sm opacity-90">Lost or delayed luggage coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help with a Cancellation?</h3>
          <p className="text-gray-600 mb-6">Our customer service team is available 24/7 to assist you</p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <Plane className="w-5 h-5 mr-2 text-blue-600" />
              <span>Call: 1-800-TRAVAL-1</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              <span>Live Chat Available</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}