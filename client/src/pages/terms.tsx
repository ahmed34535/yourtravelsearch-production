import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  CreditCard, 
  Plane,
  Shield,
  Clock,
  Mail,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function Terms() {
  const keyTerms = [
    {
      term: "Booking Confirmation",
      definition: "A binding agreement between you and the travel provider once payment is processed"
    },
    {
      term: "Fare Rules",
      definition: "Specific conditions set by airlines regarding changes, cancellations, and refunds"
    },
    {
      term: "Service Fee",
      definition: "TravalSearch booking fee charged in addition to the travel provider's price"
    },
    {
      term: "Force Majeure",
      definition: "Extraordinary circumstances beyond our control (natural disasters, strikes, etc.)"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <Badge variant="outline" className="mb-4">Effective Date: December 15, 2024</Badge>
          <p className="text-lg text-gray-600">
            These terms govern your use of TravalSearch services. Please read them carefully.
          </p>
        </div>

        {/* Agreement Overview */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              Agreement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800">
              By using TravalSearch, you agree to these terms and conditions. This agreement is between you 
              and TravalSearch Inc., a travel technology company that connects you with airlines, hotels, 
              and other travel providers. We act as an intermediary to facilitate your bookings.
            </p>
          </CardContent>
        </Card>

        {/* Key Terms Definitions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Terms & Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyTerms.map((item, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.term}</h4>
                  <p className="text-gray-600 text-sm">{item.definition}</p>
                  {index < keyTerms.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plane className="w-5 h-5 text-blue-600 mr-2" />
              Booking Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Making a Booking</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• You must be 18+ years old to make bookings</li>
                <li>• All information provided must be accurate and complete</li>
                <li>• Prices are subject to availability and may change until confirmed</li>
                <li>• Booking confirmation creates a binding contract</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Price & Payment</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• All prices are shown in USD unless otherwise stated</li>
                <li>• Total price includes taxes, fees, and service charges</li>
                <li>• Payment is processed immediately upon booking confirmation</li>
                <li>• Additional fees may apply for changes or special services</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Changes & Cancellations</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Changes subject to airline/hotel policies and availability</li>
                <li>• Cancellation fees vary by fare type and timing</li>
                <li>• Some bookings may be non-refundable</li>
                <li>• Process changes through your account or contact support</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  You Must:
                </h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Provide accurate personal and payment information</li>
                  <li>• Check travel document requirements and validity</li>
                  <li>• Arrive at the airport/hotel at recommended times</li>
                  <li>• Review and understand fare conditions</li>
                  <li>• Keep your booking confirmation details secure</li>
                  <li>• Notify us of any changes to contact information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <XCircle className="w-4 h-4 text-red-600 mr-2" />
                  You Must Not:
                </h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Use false or fraudulent information</li>
                  <li>• Make speculative or duplicate bookings</li>
                  <li>• Resell bookings for commercial purposes</li>
                  <li>• Interfere with our website functionality</li>
                  <li>• Share account credentials with others</li>
                  <li>• Use our services for illegal activities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Limitations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Service Limitations & Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Important Disclaimers</h4>
              <ul className="space-y-1 text-orange-800 text-sm">
                <li>• We are not responsible for airline/hotel service quality or policies</li>
                <li>• Flight delays, cancellations, or itinerary changes are handled by the airline</li>
                <li>• Travel insurance is recommended for protection against unforeseen circumstances</li>
                <li>• We cannot guarantee specific seat assignments or special meal requests</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h4>
              <p className="text-gray-600 text-sm">
                TravalSearch's liability is limited to the total amount paid for the booking. We are not 
                liable for indirect, consequential, or punitive damages. Our role is to facilitate bookings 
                between you and travel providers, and we cannot control their services or policies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 text-green-600 mr-2" />
              Payment & Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Accepted Payment Methods</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Major credit cards (Visa, Mastercard, American Express)</li>
                <li>• Debit cards with Visa/Mastercard logos</li>
                <li>• PayPal and digital wallets</li>
                <li>• Bank transfers for select bookings</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Refund Processing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Refundable Bookings</h5>
                  <p className="text-gray-600 text-sm">Processed within 7-14 business days to original payment method</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Non-Refundable Bookings</h5>
                  <p className="text-gray-600 text-sm">May be eligible for travel credits or vouchers per provider policy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 text-purple-600 mr-2" />
              Privacy & Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your personal information. Key points include:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• We only collect information necessary to provide our services</li>
              <li>• Your data is shared with travel providers only to complete bookings</li>
              <li>• We use industry-standard security measures to protect your information</li>
              <li>• You have rights to access, correct, or delete your personal data</li>
              <li>• We comply with GDPR, CCPA, and other applicable privacy laws</li>
            </ul>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-purple-800 text-sm">
                For detailed information, please review our complete Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Customer Service First</h4>
              <p className="text-gray-600 text-sm">
                Most issues can be resolved through our customer service team. Contact us at 
                support@yourtravelsearch.com or call 1-800-TRAVAL-1 for assistance.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Formal Disputes</h4>
              <p className="text-gray-600 text-sm">
                For unresolved disputes, we encourage mediation through the American Arbitration Association. 
                Legal proceedings must be filed in New York State courts under New York law.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              Updates to These Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We may update these terms periodically to reflect changes in our services or legal requirements. 
              When we make significant changes:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• We'll notify you via email at least 30 days in advance</li>
              <li>• We'll post the updated terms on our website</li>
              <li>• Continued use of our services constitutes acceptance</li>
              <li>• You may close your account if you disagree with changes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Questions About These Terms?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Legal Department</h4>
                <div className="space-y-1 text-gray-300">
                  <p>legal@yourtravelsearch.com</p>
                  <p>Response within 5 business days</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mailing Address</h4>
                <div className="text-gray-300">
                  <p>TravalSearch Inc.</p>
                  <p>Legal Department</p>
                  <p>123 Travel Plaza</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-4 border-gray-700" />
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                These terms constitute the entire agreement between you and TravalSearch Inc. 
                regarding the use of our services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}