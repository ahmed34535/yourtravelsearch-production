import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Globe, 
  Mail,
  FileText,
  AlertCircle,
  CheckCircle,
  Calendar
} from "lucide-react";

export default function Privacy() {
  const dataTypes = [
    { type: "Personal Information", description: "Name, email, phone number, date of birth", icon: <Users className="w-5 h-5 text-blue-600" /> },
    { type: "Travel Preferences", description: "Seat preferences, meal requirements, loyalty programs", icon: <Globe className="w-5 h-5 text-green-600" /> },
    { type: "Booking Data", description: "Flight details, hotel reservations, payment information", icon: <FileText className="w-5 h-5 text-purple-600" /> },
    { type: "Usage Analytics", description: "Website interactions, search patterns, device information", icon: <Eye className="w-5 h-5 text-orange-600" /> }
  ];

  const rights = [
    "Access your personal data and receive a copy",
    "Correct inaccurate or incomplete information",
    "Delete your personal data (right to be forgotten)",
    "Restrict processing of your data",
    "Data portability to another service provider",
    "Object to processing for marketing purposes"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <Badge variant="outline" className="mb-4">Last Updated: December 15, 2024</Badge>
          <p className="text-lg text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              Privacy Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-blue-900">
                <strong>We collect only what we need</strong> to process your bookings and improve our service.
              </p>
              <p className="text-blue-900">
                <strong>We never sell your data</strong> to advertisers or marketing companies.
              </p>
              <p className="text-blue-900">
                <strong>We share booking details</strong> only with airlines and hotels to complete your reservations.
              </p>
              <p className="text-blue-900">
                <strong>You control your information</strong> and can request changes or deletion at any time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Information We Collect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal Details</h4>
                <p className="text-gray-600">Name, email, phone number, and date of birth - required for flight bookings and customer communication.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Travel Preferences</h4>
                <p className="text-gray-600">Seat preferences, meal requirements, and loyalty program numbers - to enhance your booking experience.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Booking Information</h4>
                <p className="text-gray-600">Flight details, hotel reservations, and payment information - necessary to process and confirm your reservations.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Website Usage</h4>
                <p className="text-gray-600">Search patterns, device information, and browsing data - helps us improve our platform and fix technical issues.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Essential Services</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Process your bookings and manage reservations</li>
                <li>• Provide customer support and assistance</li>
                <li>• Send booking confirmations and travel updates</li>
                <li>• Verify your identity and prevent fraud</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Improvement</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Personalize your travel recommendations</li>
                <li>• Improve our website and mobile app functionality</li>
                <li>• Analyze usage patterns to enhance user experience</li>
                <li>• Develop new features and services</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Marketing (With Your Consent)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Send promotional offers and travel deals</li>
                <li>• Share newsletters and travel inspiration</li>
                <li>• Provide targeted advertisements</li>
                <li>• Invite you to participate in surveys</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>When We Share Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">We DO Share With:</h4>
              </div>
              <ul className="space-y-1 text-green-800">
                <li>• Airlines, hotels, and travel providers to complete your bookings</li>
                <li>• Payment processors to handle transactions securely</li>
                <li>• Service providers who help us operate our platform</li>
                <li>• Law enforcement when required by law</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-900">We NEVER Share With:</h4>
              </div>
              <ul className="space-y-1 text-red-800">
                <li>• Data brokers or marketing companies</li>
                <li>• Social media platforms for advertising</li>
                <li>• Third parties for their own marketing purposes</li>
                <li>• Anyone without your explicit consent or legal requirement</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Under GDPR and other privacy laws, you have the following rights regarding your personal data:
            </p>
            <div className="space-y-2">
              {rights.map((right, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{right}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                <strong>To exercise your rights:</strong> Contact us at privacy@travalsearch.com or use the 
                privacy controls in your account settings. We'll respond within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Protect Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Technical Safeguards</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 256-bit SSL encryption for all data transmission</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• Secure data centers with 24/7 monitoring</li>
                  <li>• Two-factor authentication for account access</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Operational Safeguards</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Limited access to personal data on need-to-know basis</li>
                  <li>• Regular employee training on privacy protection</li>
                  <li>• Incident response plan for potential breaches</li>
                  <li>• Regular backup and disaster recovery procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to improve your experience on our website:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Essential Cookies</h4>
                <p className="text-gray-600 text-sm">Required for website functionality, login, and security</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Analytics Cookies</h4>
                <p className="text-gray-600 text-sm">Help us understand how you use our site to improve performance</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Marketing Cookies</h4>
                <p className="text-gray-600 text-sm">Used to show relevant ads and measure campaign effectiveness (with consent)</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                You can manage cookie preferences in your browser settings or through our cookie consent banner.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              As a global travel platform, we may transfer your data internationally to provide our services. 
              We ensure adequate protection through:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Standard Contractual Clauses approved by the European Commission</li>
              <li>• Adequacy decisions for countries with equivalent protection</li>
              <li>• Binding Corporate Rules for internal data transfers</li>
              <li>• Your explicit consent when required</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Contact Our Privacy Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>privacy@travalsearch.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Response within 30 days</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Postal Address</h4>
                <div className="text-gray-300">
                  <p>YourTravelSearch Privacy Team</p>
                  <p>123 Travel Plaza</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}