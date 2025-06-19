import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Shield, 
  Clock, 
  CreditCard, 
  Globe, 
  Award,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Phone,
  Star
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose YourTravelSearch?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience seamless travel booking with our comprehensive platform designed 
            for modern travelers seeking convenience, value, and reliability.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Best Price Guarantee */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Best Price Guarantee</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Find the lowest prices on flights, hotels, and packages. If you find a better deal elsewhere, we'll match it.
              </p>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Save up to 40%
              </Badge>
            </CardContent>
          </Card>

          {/* 24/7 Support */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">24/7 Customer Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our travel experts are available around the clock to assist with bookings, changes, and travel emergencies.
              </p>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                Always Available
              </Badge>
            </CardContent>
          </Card>

          {/* Secure Booking */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Secure & Protected</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Bank-level security with SSL encryption ensures your personal and payment information stays safe.
              </p>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                SSL Secured
              </Badge>
            </CardContent>
          </Card>

          {/* Instant Confirmation */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold">Instant Confirmation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get immediate booking confirmations with digital tickets delivered straight to your email.
              </p>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                Real-time
              </Badge>
            </CardContent>
          </Card>

          {/* Global Coverage */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Globe className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold">Worldwide Destinations</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access thousands of destinations across 190+ countries with our extensive partner network.
              </p>
              <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                190+ Countries
              </Badge>
            </CardContent>
          </Card>

          {/* Flexible Payments */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold">Flexible Payment Options</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Pay with credit cards, digital wallets, or choose installment plans to spread your travel costs.
              </p>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                Multiple Options
              </Badge>
            </CardContent>
          </Card>

        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500K+</div>
              <div className="text-gray-600">Hotels Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1,200+</div>
              <div className="text-gray-600">Airlines Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">190+</div>
              <div className="text-gray-600">Countries Covered</div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Trusted by Millions</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Join millions of satisfied customers who have chosen YourTravelSearch for their travel needs. 
              We're committed to making your journey unforgettable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
              </div>
              <div className="text-xl font-semibold mb-2">4.8/5 Rating</div>
              <div className="text-blue-100">Based on 50,000+ reviews</div>
            </div>
            
            <div className="text-center">
              <Award className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-xl font-semibold mb-2">Industry Awards</div>
              <div className="text-blue-100">Best Travel Platform 2024</div>
            </div>
            
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-200 mx-auto mb-3" />
              <div className="text-xl font-semibold mb-2">Expert Team</div>
              <div className="text-blue-100">Travel specialists worldwide</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-white">
              Start Your Journey Today
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}