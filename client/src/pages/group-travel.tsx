import { Users, Calendar, MapPin, Phone, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function GroupTravel() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Group Travel</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Plan unforgettable group experiences with our dedicated team and exclusive group rates
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Group Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Group Travel Services</h2>
            <p className="text-xl text-gray-600">Specialized solutions for groups of all sizes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Corporate Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Business conferences, team building, and corporate retreats with professional coordination.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Dedicated event coordinator</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Volume discounts</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Flexible payment terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Educational Tours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Student groups, school trips, and educational travel with safety as our priority.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Educational itineraries</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Safety protocols</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Teacher resources</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Special Interest Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Customized travel for hobby groups, clubs, and special interest communities.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Custom itineraries</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Expert guides</li>
                  <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Special access tours</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Group Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Group Travel?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Group Advantages</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Volume Discounts</h4>
                    <p className="text-gray-600">Save up to 30% with group rates on flights, hotels, and activities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Dedicated Support</h4>
                    <p className="text-gray-600">Personal group coordinator from planning to return</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Flexible Payments</h4>
                    <p className="text-gray-600">Extended payment terms and group billing options</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Group Sizes</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">Small Groups (10-25)</h4>
                  <p className="text-gray-600">Perfect for corporate teams, family reunions, friend groups</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">Medium Groups (26-50)</h4>
                  <p className="text-gray-600">Ideal for department retreats, clubs, wedding parties</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">Large Groups (50+)</h4>
                  <p className="text-gray-600">Best for conferences, schools, large organizations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Group Quote</h2>
            <p className="text-xl text-gray-600">Get a customized quote for your group travel needs</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                    <Input placeholder="Company or group name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
                    <Input placeholder="Number of travelers" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Dates</label>
                    <Input placeholder="Preferred dates" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination(s)</label>
                  <Input placeholder="Where would you like to go?" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                  <Textarea rows={4} placeholder="Tell us about your group's needs, budget, and preferences..." />
                </div>

                <Button className="w-full" size="lg">Submit Group Request</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Need Immediate Assistance?</h2>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span className="text-lg">1-800-GROUPS (1-800-476-8777)</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span className="text-lg">groups@yourtravelsearch.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}