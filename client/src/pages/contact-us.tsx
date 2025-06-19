import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Globe, Shield, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're here to help with all your travel needs. Get in touch with our expert team.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 mb-2">1-800-TRAVAL-1</p>
                <p className="text-sm text-gray-600 mb-2">24/7 Customer Service</p>
                <p className="text-2xl font-bold text-blue-600 mb-2">1-800-GROUPS</p>
                <p className="text-sm text-gray-600 mb-4">Group Travel Specialists</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>🇺🇸 USA: Toll-free</p>
                  <p>🇨🇦 Canada: Toll-free</p>
                  <p>🇬🇧 UK: +44 20 7946 0958</p>
                  <p>🇦🇺 Australia: +61 2 8073 3450</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">General Inquiries</p>
                    <p className="text-blue-600">info@yourtravelsearch.com</p>
                  </div>
                  <div>
                    <p className="font-semibold">Booking Support</p>
                    <p className="text-blue-600">bookings@yourtravelsearch.com</p>
                  </div>
                  <div>
                    <p className="font-semibold">Group Travel</p>
                    <p className="text-blue-600">groups@yourtravelsearch.com</p>
                  </div>
                  <div>
                    <p className="font-semibold">Corporate Travel</p>
                    <p className="text-blue-600">corporate@yourtravelsearch.com</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Response within 2 hours</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Get instant help from our travel experts</p>
                <Button className="w-full mb-4">Start Live Chat</Button>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Monday - Friday:</span>
                    <span>24/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekends:</span>
                    <span>24/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average wait:</span>
                    <span className="text-green-600 font-semibold">&lt; 30 seconds</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <HeadphonesIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 font-bold text-xl mb-2">1-800-EMERGENCY</p>
                <p className="text-sm text-gray-600 mb-4">24/7 Travel Emergency Assistance</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Flight disruptions</p>
                  <p>• Medical emergencies</p>
                  <p>• Lost documents</p>
                  <p>• Travel advisories</p>
                  <p>• Natural disasters</p>
                </div>
                <p className="text-xs text-red-500 mt-4 font-semibold">For urgent situations only</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600">Fill out the form below and we'll get back to you within 2 hours</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <Input placeholder="Enter your first name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <Input placeholder="Enter your last name" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Assistance</SelectItem>
                        <SelectItem value="change">Booking Changes</SelectItem>
                        <SelectItem value="cancel">Cancellation</SelectItem>
                        <SelectItem value="refund">Refund Request</SelectItem>
                        <SelectItem value="group">Group Travel</SelectItem>
                        <SelectItem value="corporate">Corporate Travel</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Reference</label>
                    <Input placeholder="Enter booking reference (if applicable)" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <Textarea 
                    rows={6} 
                    placeholder="Please provide details about your inquiry. Include your booking reference, travel dates, and any specific questions or concerns..."
                    required 
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="newsletter" className="rounded" />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    I'd like to receive travel deals and updates via email
                  </label>
                </div>

                <Button className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Global Offices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  New York (Headquarters)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>350 Fifth Avenue, Suite 7800</p>
                  <p>New York, NY 10118</p>
                  <p>United States</p>
                  <p className="text-blue-600 font-semibold">Phone: +1 (212) 555-0123</p>
                  <p className="text-gray-600">Mon-Fri: 8:00 AM - 8:00 PM EST</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  London
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>25 Old Broad Street</p>
                  <p>London EC2N 1HN</p>
                  <p>United Kingdom</p>
                  <p className="text-blue-600 font-semibold">Phone: +44 20 7946 0958</p>
                  <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM GMT</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Sydney
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>Level 42, 2 Park Street</p>
                  <p>Sydney NSW 2000</p>
                  <p>Australia</p>
                  <p className="text-blue-600 font-semibold">Phone: +61 2 8073 3450</p>
                  <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM AEST</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Level Commitment */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Service Commitment</h2>
            <p className="text-xl max-w-2xl mx-auto">
              We're committed to providing exceptional customer service at every step of your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p>Around-the-clock assistance whenever you need help</p>
            </div>

            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">2-Hour Response</h3>
              <p>Email responses within 2 hours during business hours</p>
            </div>

            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
              <p>Support in multiple languages and time zones</p>
            </div>

            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p>Experienced travel professionals ready to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Need Quick Answers?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline">View FAQ</Button>
              <Button variant="outline">Manage Booking</Button>
              <Button variant="outline">Flight Status</Button>
              <Button variant="outline">Refund Policy</Button>
              <Button variant="outline">Travel Requirements</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}