import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plane, Clock, Users, CreditCard, Shield, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const passengerSchema = z.object({
  given_name: z.string().min(1, "First name is required"),
  family_name: z.string().min(1, "Last name is required"),
  born_on: z.string().optional(),
  email: z.string().email("Valid email is required").optional(),
  phone_number: z.string().optional(),
  gender: z.enum(["m", "f"]).optional(),
});

const checkoutSchema = z.object({
  passengers: z.array(passengerSchema),
  contact_email: z.string().email("Valid email is required"),
  contact_phone: z.string().min(1, "Phone number is required"),
  payment_method: z.enum(["card", "balance"]).default("card"),
  card_number: z.string().min(16, "Valid card number required").optional(),
  cardholder_name: z.string().min(1, "Cardholder name required").optional(),
  expiry_date: z.string().min(5, "Valid expiry date required").optional(),
  cvv: z.string().min(3, "Valid CVV required").optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [searchParams, setSearchParams] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get offer details from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const offerId = urlParams.get('offerId');
    const price = urlParams.get('price');
    const currency = urlParams.get('currency');
    
    if (offerId && price && currency) {
      // Create offer object from URL params
      setSelectedOffer({
        id: offerId,
        total_amount: price,
        total_currency: currency,
        type: urlParams.get('type') || 'flight'
      });
    } else {
      // Fallback to localStorage
      const offer = localStorage.getItem('selectedOffer');
      const params = localStorage.getItem('flightSearchParams');
      
      if (offer) {
        setSelectedOffer(JSON.parse(offer));
      }
      if (params) {
        setSearchParams(JSON.parse(params));
      }
    }
  }, [setLocation]);

  const totalPassengers = searchParams ? 
    (searchParams.adults || 0) + (searchParams.children || 0) + (searchParams.infants || 0) : 1;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      passengers: Array(totalPassengers).fill({}).map(() => ({
        given_name: "",
        family_name: "",
        born_on: "",
        email: "",
        phone_number: "",
      })),
      contact_email: "",
      contact_phone: "",
      payment_method: "card",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: (data: any) => {
      const bookingRef = data.booking_reference || data.confirmation_code || 'CONFIRMED';
      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${bookingRef}`,
      });
      localStorage.removeItem('selectedOffer');
      localStorage.removeItem('flightSearchParams');
      setLocation(`/booking-confirmation?ref=${bookingRef}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to complete booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    if (!selectedOffer) return;

    const bookingData = {
      offer_id: selectedOffer.id,
      passengers: data.passengers.map(passenger => ({
        ...passenger,
        born_on: passenger.born_on || undefined,
        email: passenger.email || data.contact_email,
        phone_number: passenger.phone_number || data.contact_phone,
      })),
      payment: {
        type: data.payment_method,
        amount: selectedOffer.total_amount,
        currency: selectedOffer.total_currency || "USD",
      },
    };

    createBookingMutation.mutate(bookingData);
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  if (!selectedOffer || !searchParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No flight selected</h2>
          <Button onClick={() => setLocation('/flights')}>Search Flights</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Passenger Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Passenger Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Array.from({ length: totalPassengers }, (_, index) => (
                    <div key={index} className="space-y-4">
                      {index > 0 && <Separator />}
                      <h3 className="font-semibold text-lg">
                        Passenger {index + 1}
                        {index < (searchParams.adults || 0) && <Badge className="ml-2">Adult</Badge>}
                        {index >= (searchParams.adults || 0) && index < (searchParams.adults || 0) + (searchParams.children || 0) && <Badge variant="secondary" className="ml-2">Child</Badge>}
                        {index >= (searchParams.adults || 0) + (searchParams.children || 0) && <Badge variant="outline" className="ml-2">Infant</Badge>}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`passengers.${index}.given_name`}>First Name *</Label>
                          <Input
                            id={`passengers.${index}.given_name`}
                            {...register(`passengers.${index}.given_name`)}
                            placeholder="Enter first name"
                          />
                          {errors.passengers?.[index]?.given_name && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.passengers[index]?.given_name?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`passengers.${index}.family_name`}>Last Name *</Label>
                          <Input
                            id={`passengers.${index}.family_name`}
                            {...register(`passengers.${index}.family_name`)}
                            placeholder="Enter last name"
                          />
                          {errors.passengers?.[index]?.family_name && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.passengers[index]?.family_name?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`passengers.${index}.born_on`}>Date of Birth</Label>
                          <Input
                            id={`passengers.${index}.born_on`}
                            type="date"
                            {...register(`passengers.${index}.born_on`)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`passengers.${index}.email`}>Email</Label>
                          <Input
                            id={`passengers.${index}.email`}
                            type="email"
                            {...register(`passengers.${index}.email`)}
                            placeholder="passenger@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      {...register('contact_email')}
                      placeholder="your@example.com"
                    />
                    {errors.contact_email && (
                      <p className="text-sm text-red-600 mt-1">{errors.contact_email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      {...register('contact_phone')}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.contact_phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.contact_phone.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50">
                    <Shield className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-800">Your payment is protected with 256-bit SSL encryption</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="cardholder_name">Cardholder Name *</Label>
                      <Input
                        id="cardholder_name"
                        {...register("cardholder_name")}
                        placeholder="Full name as on card"
                      />
                      {errors.cardholder_name && (
                        <p className="text-sm text-red-600 mt-1">{errors.cardholder_name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="card_number">Card Number *</Label>
                      <Input
                        id="card_number"
                        {...register("card_number")}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.card_number && (
                        <p className="text-sm text-red-600 mt-1">{errors.card_number.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry_date">Expiry Date *</Label>
                        <Input
                          id="expiry_date"
                          {...register("expiry_date")}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiry_date && (
                          <p className="text-sm text-red-600 mt-1">{errors.expiry_date.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          {...register("cvv")}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-600 mt-1">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  "Processing Booking..."
                ) : (
                  <>
                    Complete Booking - ${selectedOffer.total_amount}
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Flight Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Flight Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedOffer.slices?.map((slice: any, index: number) => (
                  <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                    {slice.segments?.map((segment: any, segIndex: number) => (
                      <div key={segIndex} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-lg">
                              {formatTime(segment.departing_at)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {segment.origin.iata_code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(segment.departing_at)}
                            </div>
                          </div>
                          <div className="text-center">
                            <Plane className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs text-gray-500">
                              {segment.marketing_carrier.iata_code} {segment.flight_number}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {formatTime(segment.arriving_at)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {segment.destination.iata_code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(segment.arriving_at)}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(slice.duration)}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {segment.marketing_carrier.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Flight ({totalPassengers} passenger{totalPassengers > 1 ? 's' : ''})</span>
                    <span>${selectedOffer.original_amount || selectedOffer.total_amount}</span>
                  </div>
                  {selectedOffer.markup_applied && selectedOffer.original_amount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Best Price Guarantee</span>
                      <span>-${(parseFloat(selectedOffer.total_amount) - parseFloat(selectedOffer.original_amount)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${selectedOffer.total_amount} {selectedOffer.total_currency || 'USD'}</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Secure Booking</p>
                      <p className="text-blue-700">Your booking is protected by our secure payment system and can be modified or cancelled according to airline policies.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}