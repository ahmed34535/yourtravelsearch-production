import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CountrySelect } from "@/components/CountrySelect";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  FileCheck, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Phone,
  Mail,
  User,
  Shield
} from "lucide-react";

// Enhanced passenger schema with all required international travel fields
const passengerSchema = z.object({
  // Basic Information
  title: z.enum(["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"]),
  given_name: z.string().min(1, "First name is required").max(50, "First name too long"),
  middle_name: z.string().optional(),
  family_name: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  born_on: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["M", "F"], { required_error: "Gender is required" }),
  
  // Contact Information
  email: z.string().email("Valid email is required").optional(),
  phone_number: z.string().optional(),
  
  // Passport & Travel Documents
  passport_number: z.string().min(1, "Passport number is required"),
  passport_country_code: z.string().min(2, "Passport issuing country is required"),
  passport_expiry_date: z.string().min(1, "Passport expiry date is required"),
  nationality: z.string().min(2, "Nationality is required"),
  
  // Additional Information for International Travel
  known_traveler_number: z.string().optional(),
  redress_number: z.string().optional(),
  
  // Special Requirements
  special_requirements: z.array(z.string()).default([]),
  dietary_requirements: z.string().optional(),
  mobility_assistance: z.boolean().default(false),
  
  // Emergency Contact
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
});

const passengerFormSchema = z.object({
  passengers: z.array(passengerSchema),
  contact_email: z.string().email("Valid contact email is required"),
  contact_phone: z.string().min(1, "Contact phone is required"),
  marketing_consent: z.boolean().default(false),
  terms_accepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

type PassengerFormData = z.infer<typeof passengerFormSchema>;

interface PassengerDetailsFormProps {
  totalPassengers: number;
  passengerTypes: { adults: number; children: number; infants: number };
  onSubmit: (data: PassengerFormData) => void;
  isSubmitting?: boolean;
  isInternational?: boolean;
}

export default function PassengerDetailsForm({ 
  totalPassengers, 
  passengerTypes, 
  onSubmit, 
  isSubmitting = false,
  isInternational = true 
}: PassengerDetailsFormProps) {
  const { toast } = useToast();
  const [expandedPassenger, setExpandedPassenger] = useState<number>(0);

  const form = useForm<PassengerFormData>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      passengers: Array.from({ length: totalPassengers }, () => ({
        title: "Mr",
        given_name: "",
        middle_name: "",
        family_name: "",
        born_on: "",
        gender: "M",
        email: "",
        phone_number: "",
        passport_number: "",
        passport_country_code: "",
        passport_expiry_date: "",
        nationality: "",
        known_traveler_number: "",
        redress_number: "",
        special_requirements: [],
        dietary_requirements: "",
        mobility_assistance: false,
        emergency_contact_name: "",
        emergency_contact_phone: "",
        emergency_contact_relationship: "",
      })),
      contact_email: "",
      contact_phone: "",
      marketing_consent: false,
      terms_accepted: false,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "passengers",
  });

  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "NL", name: "Netherlands" },
    { code: "CH", name: "Switzerland" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "JP", name: "Japan" },
    { code: "SG", name: "Singapore" },
    { code: "IN", name: "India" },
    { code: "CN", name: "China" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "ZA", name: "South Africa" },
  ];

  const specialRequirements = [
    "Wheelchair assistance",
    "Special meal",
    "Extra legroom",
    "Traveling with infant",
    "Unaccompanied minor",
    "Medical equipment",
    "Service animal",
    "Oxygen concentrator",
  ];

  const getPassengerType = (index: number) => {
    if (index < passengerTypes.adults) return { type: "Adult", badge: "default" };
    if (index < passengerTypes.adults + passengerTypes.children) return { type: "Child", badge: "secondary" };
    return { type: "Infant", badge: "outline" };
  };

  const validatePassportExpiry = (expiryDate: string, birthDate: string) => {
    const expiry = new Date(expiryDate);
    const birth = new Date(birthDate);
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    if (expiry <= today) {
      return { valid: false, message: "Passport has expired" };
    }
    if (expiry <= sixMonthsFromNow) {
      return { valid: false, message: "Passport expires within 6 months - renewal may be required" };
    }
    if (expiry <= birth) {
      return { valid: false, message: "Passport expiry date must be after birth date" };
    }
    return { valid: true, message: "Passport validity confirmed" };
  };

  const validateAge = (birthDate: string, passengerIndex: number) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) 
      ? age - 1 
      : age;

    const passengerType = getPassengerType(passengerIndex);
    
    if (passengerType.type === "Adult" && actualAge < 18) {
      return { valid: false, message: "Adult passengers must be 18 or older" };
    }
    if (passengerType.type === "Child" && (actualAge < 2 || actualAge >= 18)) {
      return { valid: false, message: "Child passengers must be between 2-17 years old" };
    }
    if (passengerType.type === "Infant" && actualAge >= 2) {
      return { valid: false, message: "Infant passengers must be under 2 years old" };
    }
    
    return { valid: true, message: `Age verified: ${actualAge} years` };
  };

  const handleFormSubmit = (data: PassengerFormData) => {
    // Validate all passengers
    let hasErrors = false;
    
    data.passengers.forEach((passenger, index) => {
      const ageValidation = validateAge(passenger.born_on, index);
      const passportValidation = validatePassportExpiry(passenger.passport_expiry_date, passenger.born_on);
      
      if (!ageValidation.valid || !passportValidation.valid) {
        hasErrors = true;
        toast({
          title: `Passenger ${index + 1} Validation Error`,
          description: ageValidation.message || passportValidation.message,
          variant: "destructive",
        });
      }
    });

    if (!hasErrors) {
      onSubmit(data);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Passenger Information
            {isInternational && (
              <Badge variant="outline" className="ml-2">International Flight</Badge>
            )}
          </CardTitle>
          {isInternational && (
            <Alert>
              <FileCheck className="h-4 w-4" />
              <AlertDescription>
                <strong>International Travel Requirements:</strong>
                All passengers must provide valid passport information. Ensure passport is valid for at least 6 months beyond travel date.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
      </Card>

      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Passenger Details */}
        {fields.map((field, index) => {
          const passengerType = getPassengerType(index);
          const isExpanded = expandedPassenger === index;
          
          return (
            <Card key={field.id}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedPassenger(isExpanded ? -1 : index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Passenger {index + 1}
                    <Badge variant={passengerType.badge as "default"}>{passengerType.type}</Badge>
                  </CardTitle>
                  <Button type="button" variant="ghost" size="sm">
                    {isExpanded ? "Collapse" : "Expand"}
                  </Button>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="font-semibold mb-3">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`passengers.${index}.title`}>Title *</Label>
                        <Select {...form.register(`passengers.${index}.title`)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr">Mr</SelectItem>
                            <SelectItem value="Mrs">Mrs</SelectItem>
                            <SelectItem value="Ms">Ms</SelectItem>
                            <SelectItem value="Miss">Miss</SelectItem>
                            <SelectItem value="Dr">Dr</SelectItem>
                            <SelectItem value="Prof">Prof</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.given_name`}>First Name *</Label>
                        <Input
                          {...form.register(`passengers.${index}.given_name`)}
                          placeholder="As shown on passport"
                        />
                        {form.formState.errors.passengers?.[index]?.given_name && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.passengers[index]?.given_name?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.middle_name`}>Middle Name</Label>
                        <Input
                          {...form.register(`passengers.${index}.middle_name`)}
                          placeholder="Optional"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.family_name`}>Last Name *</Label>
                        <Input
                          {...form.register(`passengers.${index}.family_name`)}
                          placeholder="As shown on passport"
                        />
                        {form.formState.errors.passengers?.[index]?.family_name && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.passengers[index]?.family_name?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor={`passengers.${index}.born_on`}>Date of Birth *</Label>
                        <Input
                          type="date"
                          {...form.register(`passengers.${index}.born_on`)}
                        />
                        {form.formState.errors.passengers?.[index]?.born_on && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.passengers[index]?.born_on?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.gender`}>Gender *</Label>
                        <Select {...form.register(`passengers.${index}.gender`)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Passport Information */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      Passport & Travel Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`passengers.${index}.passport_number`}>Passport Number *</Label>
                        <Input
                          {...form.register(`passengers.${index}.passport_number`)}
                          placeholder="Enter passport number"
                          className="font-mono"
                        />
                        {form.formState.errors.passengers?.[index]?.passport_number && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.passengers[index]?.passport_number?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.passport_expiry_date`}>Passport Expiry Date *</Label>
                        <Input
                          type="date"
                          {...form.register(`passengers.${index}.passport_expiry_date`)}
                        />
                        {form.formState.errors.passengers?.[index]?.passport_expiry_date && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.passengers[index]?.passport_expiry_date?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.passport_country_code`}>Passport Issuing Country *</Label>
                        <CountrySelect
                          value={form.watch(`passengers.${index}.passport_country_code`)}
                          onValueChange={(value) => form.setValue(`passengers.${index}.passport_country_code`, value)}
                          placeholder="Search and select passport issuing country..."
                          className="w-full"
                        />
                        {form.formState.errors.passengers?.[index]?.passport_country_code && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.passengers[index]?.passport_country_code?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.nationality`}>Nationality *</Label>
                        <CountrySelect
                          value={form.watch(`passengers.${index}.nationality`)}
                          onValueChange={(value) => form.setValue(`passengers.${index}.nationality`, value)}
                          placeholder="Search and select nationality..."
                          className="w-full"
                        />
                        {form.formState.errors.passengers?.[index]?.nationality && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.passengers[index]?.nationality?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor={`passengers.${index}.known_traveler_number`}>Known Traveler Number (TSA PreCheck)</Label>
                        <Input
                          {...form.register(`passengers.${index}.known_traveler_number`)}
                          placeholder="Optional - for TSA PreCheck"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.redress_number`}>Redress Number</Label>
                        <Input
                          {...form.register(`passengers.${index}.redress_number`)}
                          placeholder="Optional - if provided by DHS"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`passengers.${index}.email`}>Email Address</Label>
                        <Input
                          type="email"
                          {...form.register(`passengers.${index}.email`)}
                          placeholder="passenger@example.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.phone_number`}>Phone Number</Label>
                        <Input
                          type="tel"
                          {...form.register(`passengers.${index}.phone_number`)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="font-semibold mb-3">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`passengers.${index}.emergency_contact_name`}>Emergency Contact Name</Label>
                        <Input
                          {...form.register(`passengers.${index}.emergency_contact_name`)}
                          placeholder="Full name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.emergency_contact_phone`}>Emergency Contact Phone</Label>
                        <Input
                          type="tel"
                          {...form.register(`passengers.${index}.emergency_contact_phone`)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.emergency_contact_relationship`}>Relationship</Label>
                        <Input
                          {...form.register(`passengers.${index}.emergency_contact_relationship`)}
                          placeholder="e.g., Spouse, Parent, Friend"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Special Requirements */}
                  <div>
                    <h4 className="font-semibold mb-3">Special Requirements</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>Special Assistance Needed</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {specialRequirements.map((requirement) => (
                            <div key={requirement} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${index}-${requirement}`}
                                checked={form.watch(`passengers.${index}.special_requirements`)?.includes(requirement)}
                                onCheckedChange={(checked) => {
                                  const current = form.getValues(`passengers.${index}.special_requirements`) || [];
                                  if (checked) {
                                    form.setValue(`passengers.${index}.special_requirements`, [...current, requirement]);
                                  } else {
                                    form.setValue(`passengers.${index}.special_requirements`, current.filter(r => r !== requirement));
                                  }
                                }}
                              />
                              <Label htmlFor={`${index}-${requirement}`} className="text-sm">
                                {requirement}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`passengers.${index}.dietary_requirements`}>Dietary Requirements</Label>
                        <Textarea
                          {...form.register(`passengers.${index}.dietary_requirements`)}
                          placeholder="Any special dietary needs, allergies, or meal preferences"
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Primary Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  type="email"
                  {...form.register('contact_email')}
                  placeholder="your@example.com"
                />
                {form.formState.errors.contact_email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.contact_email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="contact_phone">Contact Phone *</Label>
                <Input
                  type="tel"
                  {...form.register('contact_phone')}
                  placeholder="+1 (555) 123-4567"
                />
                {form.formState.errors.contact_phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.contact_phone.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing_consent"
                  {...form.register('marketing_consent')}
                />
                <Label htmlFor="marketing_consent" className="text-sm">
                  I would like to receive promotional emails and travel deals from YourTravelSearch
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms_accepted"
                  {...form.register('terms_accepted')}
                />
                <Label htmlFor="terms_accepted" className="text-sm">
                  I accept the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
                </Label>
              </div>
              {form.formState.errors.terms_accepted && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.terms_accepted.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-12 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Validating Information..."
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Continue to Payment
            </>
          )}
        </Button>
      </form>
    </div>
  );
}