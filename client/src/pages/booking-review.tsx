import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plane, User, Shield, FileCheck, Mail, Phone, MapPin, Calendar, CheckCircle, Edit } from "lucide-react";

export default function BookingReview() {
  const [, setLocation] = useLocation();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [passengerDetails, setPassengerDetails] = useState<any>(null);

  useEffect(() => {
    // Get stored data from localStorage
    const offer = localStorage.getItem('selectedOffer');
    const passengers = localStorage.getItem('passengerDetails');
    
    if (offer) {
      setSelectedOffer(JSON.parse(offer));
    }
    if (passengers) {
      setPassengerDetails(JSON.parse(passengers));
    }
    
    // If missing data, redirect back
    if (!offer || !passengers) {
      setLocation('/');
    }
  }, [setLocation]);

  const handleEditDetails = () => {
    // Go back to passenger details with current data preserved
    const params = new URLSearchParams({
      offerId: selectedOffer.id,
      price: selectedOffer.total_amount,
      currency: selectedOffer.total_currency,
      type: selectedOffer.type
    });
    setLocation(`/passenger-details?${params.toString()}`);
  };

  const handleProceedToPayment = () => {
    // Navigate to payment page
    const params = new URLSearchParams({
      offerId: selectedOffer.id,
      price: selectedOffer.total_amount,
      currency: selectedOffer.total_currency,
      type: selectedOffer.type
    });
    setLocation(`/checkout?${params.toString()}`);
  };

  const calculateTotal = () => {
    if (!selectedOffer) return "0.00";
    const basePrice = parseFloat(selectedOffer.total_amount);
    const taxes = basePrice * 0.12; // 12% taxes
    const fees = 25; // Booking fee
    return (basePrice + taxes + fees).toFixed(2);
  };

  if (!selectedOffer || !passengerDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading booking review...</p>
        </div>
      </div>
    );
  }

  const passenger = passengerDetails.passengers[0];
  const isInternational = passenger.passport_number || passenger.passport_expiry;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Review Your Booking</h1>
          <Badge variant="outline" className="px-3 py-1">
            Step 2 of 3
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm text-green-600">Passenger Details</span>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-blue-600">Review Booking</span>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm text-gray-600">Payment</span>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Alert */}
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Almost Ready!</strong> Please review all details below before proceeding to payment. Once payment is processed, changes may incur additional fees.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Passenger Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-600" />
                  Flight Details
                </div>
                {isInternational && (
                  <Badge variant="outline">International Flight</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight Type:</span>
                  <span className="font-medium">{selectedOffer.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-medium">{selectedOffer.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">{selectedOffer.total_currency} {selectedOffer.total_amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Passenger Information
                </div>
                <Button variant="outline" size="sm" onClick={handleEditDetails}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Full Name:</span>
                    <p className="font-medium">{passenger.given_name} {passenger.family_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>
                    <p className="font-medium">{new Date(passenger.born_on).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nationality:</span>
                    <p className="font-medium">{passenger.nationality}</p>
                  </div>
                </div>
              </div>

              {/* Passport Information */}
              {isInternational && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Passport Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {passenger.passport_number && (
                        <div>
                          <span className="text-gray-600">Passport Number:</span>
                          <p className="font-medium">{passenger.passport_number}</p>
                        </div>
                      )}
                      {passenger.passport_expiry && (
                        <div>
                          <span className="text-gray-600">Passport Expiry:</span>
                          <p className="font-medium">{new Date(passenger.passport_expiry).toLocaleDateString()}</p>
                        </div>
                      )}
                      {passenger.passport_issuing_country && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Issuing Country:</span>
                          <p className="font-medium">{passenger.passport_issuing_country}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Contact Information */}
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{passenger.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{passenger.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{passenger.emergency_contact_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{passenger.emergency_contact_phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Relationship:</span>
                    <p className="font-medium">{passenger.emergency_contact_relationship}</p>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {(passenger.dietary_requirements || passenger.accessibility_requirements) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Special Requirements</h4>
                    <div className="space-y-2 text-sm">
                      {passenger.dietary_requirements && (
                        <div>
                          <span className="text-gray-600">Dietary:</span>
                          <p className="font-medium">{passenger.dietary_requirements}</p>
                        </div>
                      )}
                      {passenger.accessibility_requirements && (
                        <div>
                          <span className="text-gray-600">Accessibility:</span>
                          <p className="font-medium">{passenger.accessibility_requirements}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pricing Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare</span>
                  <span>{selectedOffer.total_currency} {selectedOffer.total_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>{selectedOffer.total_currency} {(parseFloat(selectedOffer.total_amount) * 0.12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Fee</span>
                  <span>{selectedOffer.total_currency} 25.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{selectedOffer.total_currency} {calculateTotal()}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                  size="lg"
                >
                  Proceed to Payment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEditDetails}
                  className="w-full"
                >
                  Edit Passenger Details
                </Button>
              </div>

              <div className="text-xs text-gray-500 pt-2">
                <p>• Price guaranteed for 15 minutes</p>
                <p>• All passenger information verified</p>
                <p>• Secure payment processing</p>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-orange-600">Important Notice</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2">
              <p>• Ensure all passenger names match government-issued ID exactly</p>
              <p>• Check passport validity (6+ months) for international flights</p>
              <p>• Verify visa requirements for destination country</p>
              <p>• Changes after booking may incur additional fees</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between pt-8 border-t">
        <Button variant="outline" onClick={() => setLocation('/')}>
          Back to Search
        </Button>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleEditDetails}>
            Edit Details
          </Button>
          <Button 
            onClick={handleProceedToPayment}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}