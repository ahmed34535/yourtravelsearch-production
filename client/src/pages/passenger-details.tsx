import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Users, Plane, MapPin, FileCheck, Phone, Mail, Calendar, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Comprehensive passenger validation schema
const passengerSchema = z.object({
  given_name: z.string().min(2, "First name must be at least 2 characters"),
  family_name: z.string().min(2, "Last name must be at least 2 characters"),
  born_on: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  passport_number: z.string().optional(),
  passport_expiry: z.string().optional(),
  passport_issuing_country: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone_number: z.string().min(10, "Valid phone number is required"),
  emergency_contact_name: z.string().min(2, "Emergency contact name is required"),
  emergency_contact_phone: z.string().min(10, "Emergency contact phone is required"),
  emergency_contact_relationship: z.string().min(1, "Relationship is required"),
  dietary_requirements: z.string().optional(),
  accessibility_requirements: z.string().optional(),
  address_line1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
});

const passengerDetailsSchema = z.object({
  passengers: z.array(passengerSchema),
});

type PassengerDetailsForm = z.infer<typeof passengerDetailsSchema>;

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
];

const relationships = [
  "Spouse", "Parent", "Child", "Sibling", "Partner", "Friend", "Other"
];

export default function PassengerDetails() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isInternational, setIsInternational] = useState(false);

  useEffect(() => {
    // Get offer details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const offerId = urlParams.get('offerId');
    const price = urlParams.get('price');
    const currency = urlParams.get('currency');
    
    if (offerId && price && currency) {
      const offer = {
        id: offerId,
        total_amount: price,
        total_currency: currency,
        type: urlParams.get('type') || 'flight'
      };
      setSelectedOffer(offer);
      
      // Determine if this is an international flight
      // For now, assume international if not domestic US routes
      const searchParams = localStorage.getItem('flightSearchParams');
      if (searchParams) {
        const params = JSON.parse(searchParams);
        const isDomesticUS = params.origin?.includes('US') && params.destination?.includes('US');
        setIsInternational(!isDomesticUS);
      }
    } else {
      // Redirect back to search if no offer found
      setLocation('/');
    }
  }, [setLocation]);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<PassengerDetailsForm>({
    resolver: zodResolver(passengerDetailsSchema),
    defaultValues: {
      passengers: [{
        given_name: user?.firstName || "",
        family_name: user?.lastName || "",
        born_on: "",
        nationality: "",
        passport_number: "",
        passport_expiry: "",
        passport_issuing_country: "",
        email: user?.email || "",
        phone_number: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        emergency_contact_relationship: "",
        dietary_requirements: "",
        accessibility_requirements: "",
        address_line1: "",
        city: "",
        country: "US",
        postal_code: "",
      }],
    },
  });

  const onSubmit = (data: PassengerDetailsForm) => {
    // Store passenger data and proceed to review step
    localStorage.setItem('passengerDetails', JSON.stringify(data));
    localStorage.setItem('selectedOffer', JSON.stringify(selectedOffer));
    
    // Navigate to booking review page
    const reviewParams = new URLSearchParams({
      offerId: selectedOffer.id,
      price: selectedOffer.total_amount,
      currency: selectedOffer.total_currency,
      type: selectedOffer.type
    });
    setLocation(`/booking-review?${reviewParams.toString()}`);
  };

  const handleCancel = () => {
    setLocation('/');
  };

  if (!selectedOffer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Passenger Information</h1>
          <Badge variant="outline" className="px-3 py-1">
            Step 1 of 3
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-blue-600">Passenger Details</span>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm text-gray-600">Review Booking</span>
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

      {/* Flight Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-600" />
            Flight Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Selected Flight</p>
              <p className="font-medium">Flight Details • {selectedOffer.type}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {selectedOffer.total_currency} {selectedOffer.total_amount}
              </p>
              <p className="text-sm text-gray-600">per person</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* International Flight Warning */}
      {isInternational && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>International Flight Requirements:</strong> Valid passport required. Ensure passport is valid for at least 6 months beyond travel date. Visa requirements may apply.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Passenger Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Passenger 1 - Primary Traveler
              {isInternational && (
                <Badge variant="outline" className="ml-2">International Flight</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="given_name" className="flex items-center gap-1">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="given_name"
                  {...register("passengers.0.given_name")}
                  placeholder="As shown on government ID"
                  className={errors.passengers?.[0]?.given_name ? "border-red-500" : ""}
                />
                {errors.passengers?.[0]?.given_name && (
                  <p className="text-red-500 text-sm">{errors.passengers[0].given_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="family_name" className="flex items-center gap-1">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="family_name"
                  {...register("passengers.0.family_name")}
                  placeholder="As shown on government ID"
                  className={errors.passengers?.[0]?.family_name ? "border-red-500" : ""}
                />
                {errors.passengers?.[0]?.family_name && (
                  <p className="text-red-500 text-sm">{errors.passengers[0].family_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="born_on" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="born_on"
                  type="date"
                  {...register("passengers.0.born_on")}
                  className={errors.passengers?.[0]?.born_on ? "border-red-500" : ""}
                />
                {errors.passengers?.[0]?.born_on && (
                  <p className="text-red-500 text-sm">{errors.passengers[0].born_on.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Nationality <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("passengers.0.nationality", value)}>
                  <SelectTrigger className={errors.passengers?.[0]?.nationality ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.passengers?.[0]?.nationality && (
                  <p className="text-red-500 text-sm">{errors.passengers[0].nationality.message}</p>
                )}
              </div>
            </div>

            {/* Passport Information (for international flights) */}
            {isInternational && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Passport Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passport_number">Passport Number</Label>
                      <Input
                        id="passport_number"
                        {...register("passengers.0.passport_number")}
                        placeholder="123456789"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport_expiry">Passport Expiry</Label>
                      <Input
                        id="passport_expiry"
                        type="date"
                        {...register("passengers.0.passport_expiry")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport_issuing_country">Issuing Country</Label>
                      <Select onValueChange={(value) => setValue("passengers.0.passport_issuing_country", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Contact Information */}
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("passengers.0.email")}
                    placeholder="john@example.com"
                    className={errors.passengers?.[0]?.email ? "border-red-500" : ""}
                  />
                  {errors.passengers?.[0]?.email && (
                    <p className="text-red-500 text-sm">{errors.passengers[0].email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone_number"
                    {...register("passengers.0.phone_number")}
                    placeholder="+1 (555) 123-4567"
                    className={errors.passengers?.[0]?.phone_number ? "border-red-500" : ""}
                  />
                  {errors.passengers?.[0]?.phone_number && (
                    <p className="text-red-500 text-sm">{errors.passengers[0].phone_number.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name" className="flex items-center gap-1">
                    Contact Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="emergency_contact_name"
                    {...register("passengers.0.emergency_contact_name")}
                    placeholder="Jane Doe"
                    className={errors.passengers?.[0]?.emergency_contact_name ? "border-red-500" : ""}
                  />
                  {errors.passengers?.[0]?.emergency_contact_name && (
                    <p className="text-red-500 text-sm">{errors.passengers[0].emergency_contact_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone" className="flex items-center gap-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="emergency_contact_phone"
                    {...register("passengers.0.emergency_contact_phone")}
                    placeholder="+1 (555) 987-6543"
                    className={errors.passengers?.[0]?.emergency_contact_phone ? "border-red-500" : ""}
                  />
                  {errors.passengers?.[0]?.emergency_contact_phone && (
                    <p className="text-red-500 text-sm">{errors.passengers[0].emergency_contact_phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_relationship" className="flex items-center gap-1">
                    Relationship <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => setValue("passengers.0.emergency_contact_relationship", value)}>
                    <SelectTrigger className={errors.passengers?.[0]?.emergency_contact_relationship ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map((relationship) => (
                        <SelectItem key={relationship} value={relationship}>
                          {relationship}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.passengers?.[0]?.emergency_contact_relationship && (
                    <p className="text-red-500 text-sm">{errors.passengers[0].emergency_contact_relationship.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Special Requirements (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dietary_requirements">Dietary Requirements</Label>
                  <Textarea
                    id="dietary_requirements"
                    {...register("passengers.0.dietary_requirements")}
                    placeholder="Vegetarian, kosher, halal, allergies, etc."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessibility_requirements">Accessibility Requirements</Label>
                  <Textarea
                    id="accessibility_requirements"
                    {...register("passengers.0.accessibility_requirements")}
                    placeholder="Wheelchair assistance, mobility aid, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel Booking
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
}