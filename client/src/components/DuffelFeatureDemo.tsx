import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plane, MapPin, Clock, CreditCard, Building2, Users, Shield, Package, XCircle } from "lucide-react";

export function DuffelFeatureDemo() {
  return (
    <div className="space-y-6">
      {/* Airport Location Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Airport Location Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Automatically suggests nearby airports when customers search for destinations without direct airport access.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-mono">
                <div className="text-gray-500 mb-2">Search: "Lagos, Portugal" (no airport)</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>✈️ Faro Airport (FAO)</span>
                    <Badge variant="secondary">45km • Major Hub</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>✈️ Portimão Airport (PRM)</span>
                    <Badge variant="outline">25km • Regional</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Corporate Loyalty Programmes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            Corporate Loyalty Programmes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Support for 10 major airline corporate programs with automatic benefits application.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-semibold text-sm">Tour Code Programs:</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>United Airlines</span>
                    <Badge>PerksPlus</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm">Tracking Reference:</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>American Airlines</span>
                    <Badge>AAdvantage</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Air France/KLM</span>
                    <Badge>Bluebiz</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Delta</span>
                    <Badge>SkyBonus</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hold Orders & Deferred Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Hold Orders & Deferred Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Book flights with flexible payment timing, perfect for corporate approval workflows.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Booking Status</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Awaiting Payment</Badge>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Price Guarantee</div>
                    <div className="text-gray-600">Until: June 20, 2025 23:59</div>
                    <div className="text-green-600">£450.00 locked</div>
                  </div>
                  <div>
                    <div className="font-semibold">Payment Required</div>
                    <div className="text-gray-600">By: June 25, 2025 23:59</div>
                    <div className="text-blue-600">5 days remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Stops Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-orange-600" />
            Flight Stops Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Detailed routing information with technical stops and connection details.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">LHR → SYD</span>
                  <Badge variant="outline">1 Stop</Badge>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>London Heathrow (LHR)</span>
                    <span className="text-gray-500">Dep: 14:30</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span className="text-orange-600">→ Stop: Dubai (DXB)</span>
                    <span className="text-gray-500">2h 15m layover</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sydney Kingsford (SYD)</span>
                    <span className="text-gray-500">Arr: 08:45+1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fare Conditions Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Fare Flexibility Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Clear fare type comparison with change and refund policies.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <div className="font-semibold text-red-800">Basic Economy</div>
                <div className="text-xs space-y-1 mt-2">
                  <div className="text-red-600">❌ Not changeable</div>
                  <div className="text-red-600">❌ Not refundable</div>
                  <div className="text-gray-600">✅ Carry-on included</div>
                </div>
                <div className="font-bold text-gray-900 mt-3">£299.00</div>
              </div>
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <div className="font-semibold text-orange-800">Comfort</div>
                <div className="text-xs space-y-1 mt-2">
                  <div className="text-orange-600">⚠️ Change fee: £75</div>
                  <div className="text-orange-600">⚠️ Refund fee: £150</div>
                  <div className="text-gray-600">✅ Checked bag included</div>
                </div>
                <div className="font-bold text-gray-900 mt-3">£449.00</div>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="font-semibold text-green-800">Flexible</div>
                <div className="text-xs space-y-1 mt-2">
                  <div className="text-green-600">✅ Fully changeable</div>
                  <div className="text-green-600">✅ Fully refundable</div>
                  <div className="text-gray-600">✅ Premium benefits</div>
                </div>
                <div className="font-bold text-gray-900 mt-3">£799.00</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Interactive Seat Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Interactive seat maps with real-time availability, pricing, and passenger assignment for American Airlines and select carriers.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-9 gap-1 mb-4">
                <div className="text-center text-xs font-medium">A</div>
                <div className="text-center text-xs font-medium">B</div>
                <div className="text-center text-xs font-medium">C</div>
                <div className="text-center text-xs text-gray-400">28</div>
                <div className="text-center text-xs font-medium">D</div>
                <div className="text-center text-xs font-medium">E</div>
                <div className="text-center text-xs font-medium">F</div>
                <div className="text-center text-xs text-gray-400">28</div>
                <div className="text-center text-xs font-medium">H</div>
                
                <div className="w-6 h-6 bg-green-100 border border-green-300 rounded text-xs flex items-center justify-center">A</div>
                <div className="w-6 h-6 bg-green-100 border border-green-300 rounded text-xs flex items-center justify-center">B</div>
                <div className="w-6 h-6 bg-blue-600 border border-blue-700 rounded text-xs flex items-center justify-center text-white">C</div>
                <div className="text-xs text-gray-500"></div>
                <div className="w-6 h-6 bg-gray-300 border border-gray-400 rounded text-xs flex items-center justify-center">D</div>
                <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded text-xs flex items-center justify-center relative">
                  E
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded text-xs flex items-center justify-center relative">
                  F
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500"></div>
                <div className="w-6 h-6 bg-green-100 border border-green-300 rounded text-xs flex items-center justify-center">H</div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-gray-800">Features:</div>
                  <div className="text-gray-600">• Real-time seat availability</div>
                  <div className="text-gray-600">• Dynamic pricing display</div>
                  <div className="text-gray-600">• Multi-passenger assignment</div>
                  <div className="text-gray-600">• Cabin class navigation</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Selection Status:</div>
                  <div className="text-blue-600">• Seat 28C: Selected (£20.00)</div>
                  <div className="text-green-600">• Seats A, B, H: Included</div>
                  <div className="text-yellow-600">• Seats E, F: Premium (£30.00)</div>
                  <div className="text-gray-600">• Seat D: Unavailable</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Baggage Booking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Extra Baggage Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add extra checked and carry-on baggage during booking with automatic pricing and Electronic Miscellaneous Document (EMD) generation.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">British Airways • Checked Bag</span>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Weight allowance: Up to 23kg</div>
                    <div className="text-gray-600">Dimensions: 90×75×43cm</div>
                    <div className="text-gray-600">Applies to: All passengers</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">£35.00</div>
                    <div className="text-xs text-gray-500">per bag, per segment</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-800">Booking Integration</span>
                  <div className="text-sm text-blue-600">
                    <span className="font-medium">2 bags × £35.00 = £70.00</span>
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Automatically added to total payment • EMD issued post-booking
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Order Change Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Flexible flight modifications with two-step change process, automatic penalty calculation, and slice-level change validation. Individual segments can be modified based on fare restrictions.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Change Request: Return Flight</span>
                  <Badge className="bg-blue-100 text-blue-800">Changeable</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Current: ATL → NYC, Jun 18</div>
                    <div className="text-gray-600">Requested: ATL → NYC, Jun 24</div>
                    <div className="text-gray-600">Quote Expires: 28 minutes</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Change Fee: £85.50</div>
                    <div className="text-gray-600">Penalty Fee: £25.00</div>
                    <div className="text-gray-600">New Total: £562.50</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-800">Outbound Flight</span>
                  <Badge className="bg-gray-100 text-gray-600">Not Changeable</Badge>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  NYC → ATL, Jun 11 • Departure restrictions apply • Contact support for assistance
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Cancellation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Order Cancellation Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Two-step cancellation process with quote review, multiple refund methods, and airline credit support. Automatic compatibility checking ensures only cancellable orders proceed.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Cancellation Quote</span>
                  <Badge className="bg-amber-100 text-amber-800">Review Required</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Refund Amount: £90.80</div>
                    <div className="text-gray-600">Method: Original Payment</div>
                    <div className="text-gray-600">Quote Expires: 28 minutes</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Processing Time: 3-5 business days</div>
                    <div className="text-gray-600">Cancellation Fee: Included</div>
                    <div className="text-gray-600">Status: Pending Confirmation</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-800">Alternative: Airline Credits</span>
                  <div className="text-sm text-blue-600">
                    <span className="font-medium">£95.00 credit value</span>
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Higher value • Future booking flexibility • 12-month validity
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post-Booking Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-600" />
            Post-Booking Baggage Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add extra baggage to existing bookings with easyJet and select airlines. Post-booking services automatically calculate total costs and generate Electronic Miscellaneous Documents.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Available Services: easyJet EZY1234</span>
                  <Badge className="bg-blue-100 text-blue-800">2 Services Available</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Checked Bag (23kg): £28.99 each</div>
                    <div className="text-gray-600">Carry-on Bag (10kg): £14.99 each</div>
                    <div className="text-gray-600">Passenger: All 3 passengers</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Maximum per passenger: 3 bags</div>
                    <div className="text-gray-600">Payment: Balance account</div>
                    <div className="text-gray-600">EMD: Auto-generated</div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-orange-800">Service Booking</span>
                  <div className="text-sm text-orange-600">
                    <span className="font-medium">3 × £28.99 = £86.97</span>
                  </div>
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Note: Baggage can only be added where not included in original booking
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duffel Stays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Duffel Stays Hotel Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Complete hotel booking integration with millions of properties worldwide. Four-step process: search, rates, quote, and booking with comprehensive accommodation management.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">The Ritz-Carlton, London</span>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Check-in: Fri 18 May from 15:00</div>
                    <div className="text-gray-600">Check-out: Tue 23 May until 11:00</div>
                    <div className="text-gray-600">Guests: 2 adults, 1 room</div>
                  </div>
                  <div>
                    <div className="text-gray-600">5-star luxury hotel</div>
                    <div className="text-gray-600">Breakfast included</div>
                    <div className="text-gray-600">Free cancellation</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-800">Booking Details</span>
                  <div className="text-sm text-green-600">
                    <span className="font-medium">£1,081.54 total</span>
                  </div>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Reference: AF33SE2 • Confirmed • Key collection: Reception desk
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Complete Travel Ecosystem</h3>
              <p className="text-sm text-gray-600 mt-2">
                Full-stack travel platform with flights, hotels, and comprehensive booking lifecycle management. 
                Every enterprise feature implemented with professional UI components and proper error handling.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Airport Discovery</Badge>
              <Badge variant="secondary">Corporate Loyalty</Badge>
              <Badge variant="secondary">Hold Orders</Badge>
              <Badge variant="secondary">Seat Selection</Badge>
              <Badge variant="secondary">Baggage Booking</Badge>
              <Badge variant="secondary">Post-Booking Services</Badge>
              <Badge variant="secondary">Hotel Bookings</Badge>
              <Badge variant="secondary">Order Changes</Badge>
              <Badge variant="secondary">Order Cancellation</Badge>
              <Badge variant="secondary">Private Fares</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}