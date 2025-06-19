import { MapPin, Calendar, Users, Plane, Star, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function TravelPlanning() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MapPin className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Travel Planning</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Expert travel planning services to create your perfect itinerary
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Start Planning
            </Button>
          </div>
        </div>
      </section>

      {/* Planning Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planning Services</h2>
            <p className="text-xl text-gray-600">From concept to departure, we handle every detail</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Custom Itineraries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Personalized day-by-day itineraries based on your interests, budget, and travel style.</p>
                <div className="space-y-2">
                  <Badge variant="secondary">Destination Research</Badge>
                  <Badge variant="secondary">Activity Planning</Badge>
                  <Badge variant="secondary">Local Insights</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="w-5 h-5 mr-2 text-green-600" />
                  Transportation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Complete flight, train, and ground transportation planning with optimal routing.</p>
                <div className="space-y-2">
                  <Badge variant="secondary">Flight Optimization</Badge>
                  <Badge variant="secondary">Ground Transport</Badge>
                  <Badge variant="secondary">Transfer Coordination</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-green-600" />
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Curated hotel selections matching your preferences and budget requirements.</p>
                <div className="space-y-2">
                  <Badge variant="secondary">Hotel Selection</Badge>
                  <Badge variant="secondary">Room Upgrades</Badge>
                  <Badge variant="secondary">Special Requests</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Planning Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Planning Process</h2>
            <p className="text-xl text-gray-600">Simple steps to your perfect trip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600">Tell us about your dream trip, preferences, and budget</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Research</h3>
              <p className="text-gray-600">Our experts research destinations and create options</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Design</h3>
              <p className="text-gray-600">We craft a detailed itinerary with all arrangements</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-gray-600">24/7 support during your travels for peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planning Packages</h2>
            <p className="text-xl text-gray-600">Choose the level of service that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Essential Planning</CardTitle>
                <div className="text-3xl font-bold text-green-600">$99</div>
                <p className="text-gray-600">Perfect for simple trips</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Basic itinerary (up to 5 days)</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Flight recommendations</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Hotel suggestions</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Must-see attractions list</li>
                </ul>
                <Button className="w-full mt-6">Choose Essential</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500">
              <CardHeader>
                <div className="text-center">
                  <Badge className="mb-2">Most Popular</Badge>
                </div>
                <CardTitle>Complete Planning</CardTitle>
                <div className="text-3xl font-bold text-green-600">$299</div>
                <p className="text-gray-600">Comprehensive trip planning</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Full itinerary (up to 14 days)</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Flight booking assistance</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Hotel reservations</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Activity bookings</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Restaurant recommendations</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Travel documents checklist</li>
                </ul>
                <Button className="w-full mt-6">Choose Complete</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Luxury Concierge</CardTitle>
                <div className="text-3xl font-bold text-green-600">$599</div>
                <p className="text-gray-600">White-glove service</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Unlimited itinerary length</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />All bookings handled</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />VIP experiences</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Personal travel assistant</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />24/7 travel support</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Changes & modifications</li>
                </ul>
                <Button className="w-full mt-6">Choose Luxury</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Planning Request Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Planning</h2>
            <p className="text-xl text-gray-600">Tell us about your travel dreams</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <Input placeholder="Where do you want to go?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Dates</label>
                    <Input placeholder="When do you want to travel?" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                    <Input placeholder="How many people?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <Input placeholder="Approximate budget" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Adventure
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Luxury
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Cultural
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Relaxation
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell Us More</label>
                  <Textarea rows={4} placeholder="Share your travel dreams, interests, and any special requirements..." />
                </div>

                <Button className="w-full" size="lg">Start My Travel Planning</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Planning Service?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p>Let our experts handle the research and bookings while you focus on excitement</p>
            </div>

            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Knowledge</h3>
              <p>Benefit from years of travel experience and insider destination knowledge</p>
            </div>

            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Service</h3>
              <p>Every itinerary is tailored specifically to your interests and travel style</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}