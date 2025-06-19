import { Search, Phone, Mail, Clock, HelpCircle, BookOpen, MessageCircle, Shield, CreditCard, Plane, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenter() {
  const popularTopics = [
    { icon: Plane, title: "Flight Booking", description: "How to search, book, and manage flight reservations", articles: 12 },
    { icon: Shield, title: "Booking Changes", description: "Modify dates, passengers, or cancel your reservation", articles: 8 },
    { icon: CreditCard, title: "Payment Issues", description: "Payment methods, refunds, and billing questions", articles: 15 },
    { icon: Users, title: "Account Management", description: "Profile settings, login issues, and preferences", articles: 6 },
    { icon: MapPin, title: "Travel Requirements", description: "Visa, passport, and health requirements", articles: 10 },
    { icon: MessageCircle, title: "Customer Service", description: "How to contact support and response times", articles: 5 }
  ];

  const faqs = [
    {
      question: "How do I cancel or change my booking?",
      answer: "You can cancel or modify your booking by logging into your account and visiting 'Manage Booking'. Changes are subject to airline policies and may incur fees. Free cancellation is available within 24 hours of booking for most flights."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and bank transfers. Payment is processed securely using industry-standard encryption."
    },
    {
      question: "How far in advance can I book flights?",
      answer: "You can book flights up to 11 months in advance. We recommend booking 6-8 weeks ahead for domestic flights and 2-3 months for international travel to get the best prices."
    },
    {
      question: "What happens if my flight is cancelled?",
      answer: "If your flight is cancelled by the airline, you're entitled to a full refund or rebooking at no extra cost. We'll help you find alternative flights and handle the rebooking process."
    },
    {
      question: "Can I book for someone else?",
      answer: "Yes, you can book flights for family members or friends. You'll need their full name (as it appears on their ID), date of birth, and contact information."
    },
    {
      question: "How do I add special services like meals or seats?",
      answer: "Special services can be added during booking or afterwards through 'Manage Booking'. This includes seat selection, meal preferences, wheelchair assistance, and other special requests."
    },
    {
      question: "What's your baggage policy?",
      answer: "Baggage policies vary by airline. During booking, you'll see baggage allowances and fees. Most domestic flights include a carry-on bag, while checked bags typically incur additional fees."
    },
    {
      question: "How do I get my boarding pass?",
      answer: "You can check in online 24 hours before departure through our website or the airline's website. Mobile boarding passes can be saved to your phone or printed at home."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search for help topics, booking issues, or travel questions..."
                className="pl-12 py-3 text-lg bg-white text-gray-900"
              />
            </div>
            <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
              Search Help Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center text-center">
              <Phone className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold">24/7 Support</p>
                <p className="text-blue-600">1-800-TRAVAL-1</p>
              </div>
            </div>
            <div className="flex items-center justify-center text-center">
              <Mail className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-blue-600">help@yourtravelsearch.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center text-center">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold">Response Time</p>
                <p className="text-blue-600">Under 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Help Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center">
                    <topic.icon className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <p className="text-sm text-gray-600">{topic.articles} articles</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Self-Service Tools */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Self-Service Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Manage Booking</h3>
                <p className="text-sm text-gray-600 mb-4">View, modify, or cancel your reservations</p>
                <Button variant="outline" size="sm">Access Booking</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Plane className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flight Status</h3>
                <p className="text-sm text-gray-600 mb-4">Check real-time flight information</p>
                <Button variant="outline" size="sm">Check Status</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Refund Status</h3>
                <p className="text-sm text-gray-600 mb-4">Track your refund requests</p>
                <Button variant="outline" size="sm">Check Refund</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Get instant help from our team</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl mb-8">Our travel experts are here 24/7 to assist you</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-lg p-6">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="mb-4">Speak directly with a travel specialist</p>
              <p className="text-2xl font-bold">1-800-TRAVAL-1</p>
              <p className="text-sm opacity-75">Available 24/7</p>
            </div>

            <div className="bg-white/10 rounded-lg p-6">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="mb-4">Send us a detailed message</p>
              <p className="text-xl font-bold">help@yourtravelsearch.com</p>
              <p className="text-sm opacity-75">Response within 2 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-8 bg-red-50 border-t border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold text-red-800 mb-2">Emergency Travel Assistance</h3>
            <p className="text-red-700">
              For urgent travel emergencies outside business hours: <span className="font-bold">1-800-EMERGENCY</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}