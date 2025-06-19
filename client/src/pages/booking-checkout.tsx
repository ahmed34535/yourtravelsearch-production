import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, CreditCard, Calendar, MapPin, Shield, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function BookingCheckout() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/checkout/:type/:id");
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({});
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: "",
    specialRequests: ""
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "US"
  });

  const bookingType = params?.type;
  const itemId = params?.id;

  // Fetch item details based on type and ID
  const { data: itemDetails, isLoading } = useQuery({
    queryKey: [`/api/${bookingType}s`, itemId],
    queryFn: async () => {
      const response = await fetch(`/api/${bookingType}s/${itemId}`);
      if (!response.ok) throw new Error("Failed to fetch item details");
      return response.json();
    },
    enabled: !!(bookingType && itemId)
  });

  const calculateTotal = () => {
    if (!itemDetails) return 0;
    const basePrice = parseFloat(itemDetails.price || itemDetails.pricePerNight || "0");
    const taxes = basePrice * 0.12; // 12% taxes
    const fees = 25; // Booking fee
    return basePrice + taxes + fees;
  };

  const handlePassengerChange = (field: string, value: string) => {
    setPassengerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = [];
    const newFieldErrors: {[key: string]: boolean} = {};
    
    // Validate passenger information
    if (!passengerInfo.firstName.trim()) {
      errors.push("First name is required");
      newFieldErrors.firstName = true;
    }
    if (!passengerInfo.lastName.trim()) {
      errors.push("Last name is required");
      newFieldErrors.lastName = true;
    }
    if (!passengerInfo.email.trim()) {
      errors.push("Email is required");
      newFieldErrors.email = true;
    }
    if (!passengerInfo.phone.trim()) {
      errors.push("Phone number is required");
      newFieldErrors.phone = true;
    }
    if (!passengerInfo.dateOfBirth.trim()) {
      errors.push("Date of birth is required");
      newFieldErrors.dateOfBirth = true;
    }
    
    // Validate payment information
    if (!paymentInfo.cardholderName.trim()) {
      errors.push("Cardholder name is required");
      newFieldErrors.cardholderName = true;
    }
    if (!paymentInfo.cardNumber.trim()) {
      errors.push("Card number is required");
      newFieldErrors.cardNumber = true;
    }
    if (!paymentInfo.expiryDate.trim()) {
      errors.push("Expiry date is required");
      newFieldErrors.expiryDate = true;
    }
    if (!paymentInfo.cvv.trim()) {
      errors.push("CVV is required");
      newFieldErrors.cvv = true;
    }
    if (!paymentInfo.billingAddress.trim()) {
      errors.push("Billing address is required");
      newFieldErrors.billingAddress = true;
    }
    if (!paymentInfo.city.trim()) {
      errors.push("City is required");
      newFieldErrors.city = true;
    }
    if (!paymentInfo.zipCode.trim()) {
      errors.push("ZIP code is required");
      newFieldErrors.zipCode = true;
    }
    
    setFieldErrors(newFieldErrors);
    setValidationErrors(errors);
    return errors;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const errors = validateForm();
    if (errors.length > 0) {
      // Update validation errors state to show in UI
      setValidationErrors(errors);
      
      // Show clear error message about what's missing
      const errorMessage = errors.length === 1 
        ? errors[0]
        : `Please fill out: ${errors.join(", ")}`;
      
      toast({
        title: "Complete Required Information",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    
    // Clear validation errors if form is valid
    setValidationErrors([]);
    
    setIsProcessing(true);

    try {
      // Process the booking with validated data
      const bookingData = {
        offerId: itemId,
        passengers: [{
          firstName: passengerInfo.firstName,
          lastName: passengerInfo.lastName,
          dateOfBirth: passengerInfo.dateOfBirth,
          passportNumber: passengerInfo.passportNumber,
          nationality: "United States",
          email: passengerInfo.email,
          phone: passengerInfo.phone
        }],
        paymentInfo: {
          cardNumber: paymentInfo.cardNumber,
          expiryMonth: paymentInfo.expiryDate.split('/')[0],
          expiryYear: paymentInfo.expiryDate.split('/')[1],
          cvc: paymentInfo.cvv,
          cardholderName: paymentInfo.cardholderName,
          billingAddress: {
            street: paymentInfo.billingAddress,
            city: paymentInfo.city,
            state: "",
            zipCode: paymentInfo.zipCode,
            country: paymentInfo.country || "US"
          }
        },
        totalAmount: calculateTotal().toString(),
        currency: "USD"
      };

      // Submit booking to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      
      // Check if booking was actually successful
      if (!response.ok || !result.success) {
        // If it's a validation error, trigger field highlighting
        if (response.status === 400 && result.message && result.message.includes('complete all required fields')) {
          // Trigger validation to show field errors and highlighting
          validateForm();
        }
        
        const errorMessage = result.message || result.error || 'Booking failed';
        throw new Error(errorMessage);
      }

      const bookingReference = result.booking_reference || result.confirmation_code || `TRV-${Date.now().toString().slice(-6)}`;
      
      // Store booking locally for confirmation page
      const booking = {
        reference: bookingReference,
        type: bookingType,
        item: itemDetails,
        passenger: passengerInfo,
        total: calculateTotal(),
        status: "confirmed",
        bookedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`booking_${bookingReference}`, JSON.stringify(booking));
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${bookingReference}`,
      });
      
      setLocation(`/booking-confirmation/${bookingReference}`);
    } catch (error: any) {
      // If it's a validation error response, show the specific validation errors
      if (error.message && error.message.includes('complete all required fields')) {
        // Re-run validation to show field errors
        const errors = validateForm();
        setValidationErrors(errors);
      }
      
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (!itemDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
                <p className="text-gray-600">The requested item could not be found.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Please fill in your details to confirm your reservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleBookingSubmit}>
              <Tabs defaultValue="passenger" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="passenger">Passenger Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment Information</TabsTrigger>
                </TabsList>

                {/* Passenger Information */}
                <TabsContent value="passenger">
                  {validationErrors.length > 0 && (
                    <Card className="border-red-200 bg-red-50 mb-4">
                      <CardContent className="pt-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-600 text-sm font-medium">!</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-red-800">Please complete the following required fields:</h3>
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                              {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Passenger Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className={fieldErrors.firstName ? "text-red-600" : ""}>First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter first name"
                            value={passengerInfo.firstName}
                            onChange={(e) => {
                              handlePassengerChange("firstName", e.target.value);
                              if (e.target.value.trim()) {
                                setFieldErrors(prev => ({ ...prev, firstName: false }));
                              }
                            }}
                            className={fieldErrors.firstName ? "border-red-500 focus:border-red-500" : ""}
                            required
                          />
                          {fieldErrors.firstName && <p className="text-red-600 text-sm">First name is required</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className={fieldErrors.lastName ? "text-red-600" : ""}>Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter last name"
                            value={passengerInfo.lastName}
                            onChange={(e) => {
                              handlePassengerChange("lastName", e.target.value);
                              if (e.target.value.trim()) {
                                setFieldErrors(prev => ({ ...prev, lastName: false }));
                              }
                            }}
                            className={fieldErrors.lastName ? "border-red-500 focus:border-red-500" : ""}
                            required
                          />
                          {fieldErrors.lastName && <p className="text-red-600 text-sm">Last name is required</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className={fieldErrors.email ? "text-red-600" : ""}>Email *</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              value={passengerInfo.email}
                              onChange={(e) => {
                                handlePassengerChange("email", e.target.value);
                                if (e.target.value.trim()) {
                                  setFieldErrors(prev => ({ ...prev, email: false }));
                                }
                              }}
                              className={`pl-10 ${fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                              required
                            />
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          </div>
                          {fieldErrors.email && <p className="text-red-600 text-sm">Email is required</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className={fieldErrors.phone ? "text-red-600" : ""}>Phone *</Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              placeholder="Enter phone number"
                              value={passengerInfo.phone}
                              onChange={(e) => {
                                handlePassengerChange("phone", e.target.value);
                                if (e.target.value.trim()) {
                                  setFieldErrors(prev => ({ ...prev, phone: false }));
                                }
                              }}
                              className={`pl-10 ${fieldErrors.phone ? "border-red-500 focus:border-red-500" : ""}`}
                              required
                            />
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          </div>
                          {fieldErrors.phone && <p className="text-red-600 text-sm">Phone number is required</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className={fieldErrors.dateOfBirth ? "text-red-600" : ""}>Date of Birth *</Label>
                          <div className="relative">
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={passengerInfo.dateOfBirth}
                              onChange={(e) => {
                                handlePassengerChange("dateOfBirth", e.target.value);
                                if (e.target.value.trim()) {
                                  setFieldErrors(prev => ({ ...prev, dateOfBirth: false }));
                                }
                              }}
                              className={`pl-10 ${fieldErrors.dateOfBirth ? "border-red-500 focus:border-red-500" : ""}`}
                              required
                            />
                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          </div>
                          {fieldErrors.dateOfBirth && <p className="text-red-600 text-sm">Date of birth is required</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="passportNumber">Passport Number</Label>
                          <Input
                            id="passportNumber"
                            placeholder="US123456789"
                            value={passengerInfo.passportNumber}
                            onChange={(e) => handlePassengerChange("passportNumber", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">Special Requests</Label>
                        <Textarea
                          id="specialRequests"
                          placeholder="Dietary requirements, accessibility needs, etc."
                          value={passengerInfo.specialRequests}
                          onChange={(e) => handlePassengerChange("specialRequests", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payment Information */}
                <TabsContent value="payment">
                  {validationErrors.length > 0 && (
                    <Card className="border-red-200 bg-red-50 mb-4">
                      <CardContent className="pt-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-600 text-sm font-medium">!</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-red-800">Please complete the following required fields:</h3>
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                              {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className={fieldErrors.cardNumber ? "text-red-600" : ""}>Card Number *</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => {
                              handlePaymentChange("cardNumber", e.target.value);
                              if (e.target.value.trim()) {
                                setFieldErrors(prev => ({ ...prev, cardNumber: false }));
                              }
                            }}
                            className={`pl-10 ${fieldErrors.cardNumber ? "border-red-500 focus:border-red-500" : ""}`}
                            required
                          />
                          <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        </div>
                        {fieldErrors.cardNumber && <p className="text-red-600 text-sm">Card number is required</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className={fieldErrors.expiryDate ? "text-red-600" : ""}>Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => {
                              handlePaymentChange("expiryDate", e.target.value);
                              if (e.target.value.trim()) {
                                setFieldErrors(prev => ({ ...prev, expiryDate: false }));
                              }
                            }}
                            className={fieldErrors.expiryDate ? "border-red-500 focus:border-red-500" : ""}
                            required
                          />
                          {fieldErrors.expiryDate && <p className="text-red-600 text-sm">Expiry date is required</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className={fieldErrors.cvv ? "text-red-600" : ""}>CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => {
                              handlePaymentChange("cvv", e.target.value);
                              if (e.target.value.trim()) {
                                setFieldErrors(prev => ({ ...prev, cvv: false }));
                              }
                            }}
                            className={fieldErrors.cvv ? "border-red-500 focus:border-red-500" : ""}
                            required
                          />
                          {fieldErrors.cvv && <p className="text-red-600 text-sm">CVV is required</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardholderName" className={fieldErrors.cardholderName ? "text-red-600" : ""}>Cardholder Name *</Label>
                        <Input
                          id="cardholderName"
                          placeholder="Enter cardholder name"
                          value={paymentInfo.cardholderName}
                          onChange={(e) => {
                            handlePaymentChange("cardholderName", e.target.value);
                            if (e.target.value.trim()) {
                              setFieldErrors(prev => ({ ...prev, cardholderName: false }));
                            }
                          }}
                          className={fieldErrors.cardholderName ? "border-red-500 focus:border-red-500" : ""}
                          required
                        />
                        {fieldErrors.cardholderName && <p className="text-red-600 text-sm">Cardholder name is required</p>}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-semibold">Billing Address</h4>
                        <div className="space-y-2">
                          <Label htmlFor="billingAddress" className={fieldErrors.billingAddress ? "text-red-600" : ""}>Address *</Label>
                          <Input
                            id="billingAddress"
                            placeholder="Enter street address"
                            value={paymentInfo.billingAddress}
                            onChange={(e) => {
                              handlePaymentChange("billingAddress", e.target.value);
                              if (e.target.value.trim()) {
                                setFieldErrors(prev => ({ ...prev, billingAddress: false }));
                              }
                            }}
                            className={fieldErrors.billingAddress ? "border-red-500 focus:border-red-500" : ""}
                            required
                          />
                          {fieldErrors.billingAddress && <p className="text-red-600 text-sm">Billing address is required</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city" className={fieldErrors.city ? "text-red-600" : ""}>City *</Label>
                            <Input
                              id="city"
                              placeholder="Enter city"
                              value={paymentInfo.city}
                              onChange={(e) => {
                                handlePaymentChange("city", e.target.value);
                                if (e.target.value.trim()) {
                                  setFieldErrors(prev => ({ ...prev, city: false }));
                                }
                              }}
                              className={fieldErrors.city ? "border-red-500 focus:border-red-500" : ""}
                              required
                            />
                            {fieldErrors.city && <p className="text-red-600 text-sm">City is required</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode" className={fieldErrors.zipCode ? "text-red-600" : ""}>ZIP Code *</Label>
                            <Input
                              id="zipCode"
                              placeholder="Enter ZIP code"
                              value={paymentInfo.zipCode}
                              onChange={(e) => {
                                handlePaymentChange("zipCode", e.target.value);
                                if (e.target.value.trim()) {
                                  setFieldErrors(prev => ({ ...prev, zipCode: false }));
                                }
                              }}
                              className={fieldErrors.zipCode ? "border-red-500 focus:border-red-500" : ""}
                              required
                            />
                            {fieldErrors.zipCode && <p className="text-red-600 text-sm">ZIP code is required</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Select value={paymentInfo.country} onValueChange={(value) => handlePaymentChange("country", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="DE">Germany</SelectItem>
                              <SelectItem value="FR">France</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-travel-blue hover:bg-travel-blue-dark px-8 py-3 text-lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Confirm & Pay ${calculateTotal().toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <img 
                    src={itemDetails.imageUrl} 
                    alt={itemDetails.name || itemDetails.title || itemDetails.airline}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">
                    {itemDetails.name || itemDetails.title || `${itemDetails.airline} ${itemDetails.flightNumber}`}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {itemDetails.location || `${itemDetails.origin} → ${itemDetails.destination}`}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>${(parseFloat(itemDetails.price || itemDetails.pricePerNight || "0")).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>${(parseFloat(itemDetails.price || itemDetails.pricePerNight || "0") * 0.12 + 25).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-travel-blue">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Free cancellation within 24 hours</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Your payment is secured with 256-bit SSL encryption</p>
                  <p>• Confirmation will be sent to your email</p>
                  <p>• 24/7 customer support available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}