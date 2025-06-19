import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Info,
  ExternalLink,
  Download,
  Shield
} from "lucide-react";

interface VisaRequirement {
  country: string;
  countryCode: string;
  requiresVisa: boolean;
  visaType: string;
  processingTime: string;
  validityPeriod: string;
  requirements: string[];
  cost: string;
  embassy: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    workingHours: string;
  };
}

interface PassportCheck {
  isValid: boolean;
  expiryDate: string;
  daysUntilExpiry: number;
  requiresRenewal: boolean;
  warnings: string[];
}

interface TravelDocument {
  id: string;
  type: string;
  name: string;
  required: boolean;
  description: string;
  validFor: string[];
  downloadUrl?: string;
}

export default function VisaDocumentationAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDestination, setSelectedDestination] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [nationality, setNationality] = useState("");

  // Handle PDF document downloads
  const handleDownloadDocument = async (doc: TravelDocument) => {
    try {
      const response = await fetch('/api/travel-documents/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId: doc.id,
          documentType: doc.type,
          documentName: doc.name,
          userInfo: {
            name: user?.firstName + ' ' + user?.lastName || 'Traveler',
            passportNumber: passportNumber,
            nationality: nationality,
            destination: selectedDestination
          }
        })
      });

      if (!response.ok) throw new Error('Failed to generate document');

      const htmlContent = await response.text();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.name.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Document Downloaded",
        description: `${doc.name} downloaded as HTML. Open the file and use your browser's Print to PDF feature to save as PDF.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch visa requirements
  const { data: visaInfo, isLoading: visaLoading } = useQuery({
    queryKey: ['/api/visa-requirements', selectedDestination, nationality],
    enabled: !!selectedDestination && !!nationality,
  });

  // Check passport validity
  const { data: passportCheck, isLoading: passportLoading } = useQuery({
    queryKey: ['/api/passport-check', passportNumber, passportExpiry, selectedDestination],
    enabled: !!passportNumber && !!passportExpiry && !!selectedDestination,
  });

  // Get travel documents
  const { data: travelDocuments } = useQuery({
    queryKey: ['/api/travel-documents', selectedDestination],
    enabled: !!selectedDestination,
  });

  // Embassy information
  const { data: embassyInfo } = useQuery({
    queryKey: ['/api/embassy-info', selectedDestination, nationality],
    enabled: !!selectedDestination && !!nationality,
  });

  const checkVisaRequirements = () => {
    if (!selectedDestination || !nationality) {
      toast({
        title: "Missing Information",
        description: "Please select destination and nationality to check visa requirements.",
        variant: "destructive",
      });
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ['/api/visa-requirements'] });
  };

  const countries = [
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "JP", name: "Japan" },
    { code: "AU", name: "Australia" },
    { code: "CA", name: "Canada" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "NL", name: "Netherlands" },
    { code: "CH", name: "Switzerland" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "SG", name: "Singapore" },
    { code: "TH", name: "Thailand" },
    { code: "IN", name: "India" },
    { code: "CN", name: "China" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" }
  ];

  // Mock data for demonstration
  const mockVisaRequirements: VisaRequirement = {
    country: "Japan",
    countryCode: "JP",
    requiresVisa: false,
    visaType: "Tourist Visa Waiver",
    processingTime: "N/A",
    validityPeriod: "90 days",
    requirements: [
      "Valid passport (minimum 6 months validity)",
      "Return/onward ticket",
      "Proof of accommodation",
      "Sufficient funds ($3,000+ recommended)"
    ],
    cost: "Free",
    embassy: {
      name: "Consulate-General of Japan",
      address: "350 S Grand Ave, Los Angeles, CA 90071",
      phone: "+1 (213) 617-6700",
      email: "info@la.us.emb-japan.go.jp",
      website: "https://www.la.us.emb-japan.go.jp",
      workingHours: "Mon-Fri: 9:00 AM - 12:00 PM, 1:30 PM - 5:00 PM"
    }
  };

  const mockPassportCheck: PassportCheck = {
    isValid: true,
    expiryDate: "2027-03-15",
    daysUntilExpiry: 756,
    requiresRenewal: false,
    warnings: []
  };

  const mockTravelDocuments: TravelDocument[] = [
    {
      id: "1",
      type: "Form",
      name: "Customs Declaration Form",
      required: true,
      description: "Required for all international arrivals",
      validFor: ["JP", "US", "UK"],
      downloadUrl: "/forms/customs-declaration.pdf"
    },
    {
      id: "2",
      type: "Certificate",
      name: "International Vaccination Certificate",
      required: false,
      description: "Recommended for certain destinations",
      validFor: ["TH", "IN", "BR"],
      downloadUrl: "/forms/vaccination-cert.pdf"
    },
    {
      id: "3",
      type: "Insurance",
      name: "Travel Insurance Certificate",
      required: true,
      description: "Mandatory for Schengen Area countries",
      validFor: ["FR", "DE", "IT", "ES", "NL"],
      downloadUrl: "/forms/insurance-template.pdf"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Visa & Documentation Assistant</h3>
        <p className="text-sm text-muted-foreground">
          Check visa requirements, verify passport validity, and get travel documentation guidance
        </p>
      </div>

      <Tabs defaultValue="visa-check" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visa-check">Visa Requirements</TabsTrigger>
          <TabsTrigger value="passport">Passport Check</TabsTrigger>
          <TabsTrigger value="documents">Travel Documents</TabsTrigger>
          <TabsTrigger value="embassy">Embassy Info</TabsTrigger>
        </TabsList>

        {/* Visa Requirements Tab */}
        <TabsContent value="visa-check" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Visa Requirements Checker
              </CardTitle>
              <CardDescription>
                Check if you need a visa for your destination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationality">Your Nationality</Label>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="destination">Destination Country</Label>
                  <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={checkVisaRequirements} className="w-full">
                Check Visa Requirements
              </Button>

              {selectedDestination && nationality && (
                <div className="space-y-4 mt-6">
                  <Alert className={mockVisaRequirements.requiresVisa ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
                    <div className="flex items-center gap-2">
                      {mockVisaRequirements.requiresVisa ? (
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <AlertDescription className="font-semibold">
                        {mockVisaRequirements.requiresVisa 
                          ? `Visa Required: ${mockVisaRequirements.visaType}`
                          : `No Visa Required: ${mockVisaRequirements.visaType}`
                        }
                      </AlertDescription>
                    </div>
                  </Alert>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-medium">Processing Time</p>
                      <p className="text-xs text-muted-foreground">{mockVisaRequirements.processingTime}</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <p className="text-sm font-medium">Validity</p>
                      <p className="text-xs text-muted-foreground">{mockVisaRequirements.validityPeriod}</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <span className="text-xl mx-auto mb-2 block">💰</span>
                      <p className="text-sm font-medium">Cost</p>
                      <p className="text-xs text-muted-foreground">{mockVisaRequirements.cost}</p>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Required Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockVisaRequirements.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passport Check Tab */}
        <TabsContent value="passport" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Passport Validity Checker
              </CardTitle>
              <CardDescription>
                Verify your passport meets travel requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="Enter passport number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="passportExpiry">Expiry Date</Label>
                  <Input
                    id="passportExpiry"
                    type="date"
                    value={passportExpiry}
                    onChange={(e) => setPassportExpiry(e.target.value)}
                  />
                </div>
              </div>

              {passportNumber && passportExpiry && (
                <div className="space-y-4 mt-6">
                  <Alert className={mockPassportCheck.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <CheckCircle className={`h-4 w-4 ${mockPassportCheck.isValid ? 'text-green-600' : 'text-red-600'}`} />
                    <AlertDescription>
                      <strong>Passport Status: {mockPassportCheck.isValid ? 'Valid' : 'Invalid'}</strong>
                      <br />
                      Expires: {new Date(mockPassportCheck.expiryDate).toLocaleDateString()}
                      <br />
                      Days until expiry: {mockPassportCheck.daysUntilExpiry}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Validity Requirements</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Minimum 6 months validity required</li>
                        <li>• At least 2 blank pages needed</li>
                        <li>• No damage to machine-readable zone</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Renewal Information</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Standard processing: 6-8 weeks</li>
                        <li>• Expedited processing: 2-3 weeks</li>
                        <li>• Emergency: 1-2 business days</li>
                      </ul>
                    </div>
                  </div>

                  {mockPassportCheck.requiresRenewal && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription>
                        <strong>Renewal Recommended</strong>
                        <br />
                        Your passport expires within 6 months. Consider renewing before travel.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Travel Documents & Forms
              </CardTitle>
              <CardDescription>
                Download required forms and documentation for your trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTravelDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{doc.name}</h4>
                        <Badge variant={doc.required ? "destructive" : "secondary"}>
                          {doc.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Valid for: {doc.validFor.join(", ")}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {doc.downloadUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embassy Information Tab */}
        <TabsContent value="embassy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Embassy & Consulate Information
              </CardTitle>
              <CardDescription>
                Contact information for embassies and consulates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDestination && nationality ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">{mockVisaRequirements.embassy.name}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">{mockVisaRequirements.embassy.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{mockVisaRequirements.embassy.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{mockVisaRequirements.embassy.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Working Hours</p>
                            <p className="text-sm text-muted-foreground">{mockVisaRequirements.embassy.workingHours}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Website</p>
                            <a 
                              href={mockVisaRequirements.embassy.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Visit Official Website
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-2">Services Available</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>• Visa applications</span>
                        <span>• Passport services</span>
                        <span>• Emergency assistance</span>
                        <span>• Notarization services</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Select your destination and nationality to view embassy information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}