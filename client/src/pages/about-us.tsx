import { Users, Globe, Award, Target, Heart, Plane, Shield, Star, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutUs() {
  const stats = [
    { number: "2M+", label: "Happy Travelers", icon: Users },
    { number: "500K+", label: "Hotels Worldwide", icon: MapPin },
    { number: "1,200+", label: "Airline Partners", icon: Plane },
    { number: "190+", label: "Countries Served", icon: Globe }
  ];

  const leadership = [
    {
      name: "Sarah Johnson",
      title: "Chief Executive Officer",
      bio: "Former VP of Product at Expedia, 15+ years in travel technology. Led digital transformation initiatives serving millions of travelers globally.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&q=80"
    },
    {
      name: "Michael Chen",
      title: "Chief Technology Officer", 
      bio: "Ex-Google software engineer, expert in scalable systems. Built travel platforms processing over $2B in annual bookings.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80"
    },
    {
      name: "Emily Rodriguez",
      title: "Chief Marketing Officer",
      bio: "Former Airbnb marketing director, specialist in customer acquisition and retention. Drove 300% growth in user engagement.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80"
    },
    {
      name: "David Kim",
      title: "Chief Financial Officer",
      bio: "Previously CFO at Booking Holdings, 20+ years in travel finance. Managed P&L for multi-billion dollar travel portfolios.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make starts with our travelers' needs and experiences at the center."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We protect your personal information and ensure secure, reliable booking experiences."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for the highest standards in technology, service, and customer satisfaction."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Making world-class travel accessible to everyone, regardless of destination or budget."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About TravalSearch</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Empowering travelers worldwide with innovative technology and personalized service since 2019
            </p>
            <div className="flex justify-center">
              <Badge className="bg-white text-blue-600 text-lg px-6 py-2">
                Trusted by 2M+ Travelers
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Target className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To democratize travel by making it simple, affordable, and accessible for everyone. 
              We believe that exploring the world should be effortless, inspiring, and within reach 
              for travelers of all backgrounds and budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-blue-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To become the world's most trusted travel platform, connecting every traveler 
                  to their perfect journey through innovative technology and exceptional service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-6 h-6 mr-3 text-blue-600" />
                  Our Promise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We promise transparent pricing, reliable service, and dedicated support 
                  throughout your entire travel experience, from planning to return.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Founded on Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  TravalSearch was founded in 2019 by a team of travel industry veterans and 
                  technology innovators who saw an opportunity to revolutionize how people 
                  plan and book their travels. Frustrated by complex booking processes and 
                  hidden fees, we set out to create a platform that puts transparency and 
                  user experience first.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">2019</h4>
                <p className="text-gray-600">TravalSearch founded with a vision to simplify travel booking</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-green-50 rounded-lg p-8 text-center md:order-1">
                <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">2021</h4>
                <p className="text-gray-600">Reached 500,000 satisfied customers and expanded globally</p>
              </div>
              <div className="md:order-2">
                <h3 className="text-2xl font-semibold mb-4">Rapid Growth</h3>
                <p className="text-gray-600 leading-relaxed">
                  By 2021, we had served over half a million travelers and expanded our 
                  platform to include comprehensive hotel booking, vacation packages, 
                  and corporate travel solutions. Our commitment to customer service 
                  earned us industry recognition and loyal customers worldwide.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Industry Leadership</h3>
                <p className="text-gray-600 leading-relaxed">
                  Today, TravalSearch serves over 2 million travelers annually, partnering 
                  with 1,200+ airlines and 500,000+ hotels worldwide. We've integrated 
                  cutting-edge technology including live API connections with major 
                  travel providers to offer real-time pricing and instant confirmations.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-8 text-center">
                <Star className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">2024</h4>
                <p className="text-gray-600">Leading travel platform with 2M+ annual users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <value.icon className="w-8 h-8 mr-3 text-blue-600" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the experienced professionals leading TravalSearch</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={leader.image} 
                      alt={leader.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{leader.name}</h3>
                      <p className="text-blue-600 font-medium mb-3">{leader.title}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{leader.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Innovation */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology & Innovation</h2>
            <p className="text-xl text-gray-600">Powering seamless travel experiences through advanced technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Live API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Real-time connections with Duffel flight APIs and major hotel booking platforms 
                  ensure accurate pricing and instant confirmations.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time flight pricing</li>
                  <li>• Instant booking confirmations</li>
                  <li>• Live inventory updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  PCI DSS compliant payment processing with 3D Secure authentication 
                  protects your financial information and personal data.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SSL encryption</li>
                  <li>• PCI DSS compliance</li>
                  <li>• Secure payment processing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Scalable cloud infrastructure ensures fast loading times and reliable 
                  service for millions of users worldwide, 24/7.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Global server network</li>
                  <li>• 24/7 monitoring</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-600">Recognized for excellence in travel technology and customer service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Award className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Best Travel Technology</h3>
              <p className="text-sm text-gray-600">Travel Tech Awards 2023</p>
            </div>
            <div className="text-center">
              <Star className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Customer Choice Award</h3>
              <p className="text-sm text-gray-600">Travel Industry Review 2023</p>
            </div>
            <div className="text-center">
              <Shield className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Security Excellence</h3>
              <p className="text-sm text-gray-600">Cybersecurity Awards 2023</p>
            </div>
            <div className="text-center">
              <Users className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Best Customer Service</h3>
              <p className="text-sm text-gray-600">Service Excellence Awards 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-xl mb-8">
            Become part of the TravalSearch story and discover why millions of travelers trust us 
            with their most important journeys.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              View Careers
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}