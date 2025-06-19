import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Globe, 
  Award, 
  Shield, 
  Plane, 
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Heart,
  Target,
  CheckCircle
} from "lucide-react";

export default function About() {
  const stats = [
    { label: "Global Destinations", value: "150+", icon: <Globe className="w-6 h-6 text-blue-600" /> },
    { label: "Active Users", value: "25,000+", icon: <Users className="w-6 h-6 text-green-600" /> },
    { label: "Airline Partners", value: "180+", icon: <Plane className="w-6 h-6 text-purple-600" /> },
    { label: "Since Founded", value: "2020", icon: <Award className="w-6 h-6 text-orange-600" /> }
  ];

  const values = [
    {
      title: "Customer First",
      description: "Every decision we make is guided by what's best for our travelers",
      icon: <Heart className="w-8 h-8 text-red-500" />
    },
    {
      title: "Trust & Security",
      description: "Your personal information and payments are protected with industry-leading security",
      icon: <Shield className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Innovation",
      description: "We continuously improve our platform to make travel booking simpler and smarter",
      icon: <TrendingUp className="w-8 h-8 text-green-500" />
    },
    {
      title: "Global Reach",
      description: "Connecting travelers to destinations worldwide with local expertise",
      icon: <Globe className="w-8 h-8 text-purple-500" />
    }
  ];

  const milestones = [
    { year: "2020", event: "Platform launched during travel industry transformation, focusing on transparent pricing" },
    { year: "2021", event: "Integrated with major booking systems and achieved first 1,000 successful bookings" },
    { year: "2022", event: "Expanded airline partnerships and introduced flexible change policies" },
    { year: "2023", event: "Launched multi-currency support and international payment methods" },
    { year: "2024", event: "Achieved 25,000 active users and established direct airline partnerships" }
  ];

  const team = [
    {
      name: "Alex Thompson",
      role: "Founder & CEO",
      description: "Started this after getting stranded in Denver due to a booking mix-up on a major travel site. Previously built airline reservation systems, which is how he knew we could do better.",
      image: <Users className="w-12 h-12 text-blue-600" />,
      quote: "Travel should be exciting, not stressful. Bad booking experiences ruin trips before they even start."
    },
    {
      name: "Maria Santos",
      role: "Operations Director",
      description: "Spent 12 years as a travel agent helping people fix botched online bookings. Joined us because she believes in transparent pricing and real customer service.",
      image: <Globe className="w-12 h-12 text-green-600" />,
      quote: "I've seen people pay twice for the same flight because of booking site errors. We fix that."
    },
    {
      name: "James Park",
      role: "Lead Developer",
      description: "Built payment systems for fintech companies before joining us. Obsessed with making checkout processes that actually work on the first try.",
      image: <Shield className="w-12 h-12 text-purple-600" />,
      quote: "If our booking flow takes more than 3 minutes, I consider it broken."
    },
    {
      name: "Lisa Chang",
      role: "Customer Success",
      description: "Speaks four languages and has helped customers in 23 countries. Responds to support emails from her laptop while traveling (which she does 6 months of the year).",
      image: <Heart className="w-12 h-12 text-red-500" />,
      quote: "I answer every email personally. If you're stuck, I'll get you unstuck."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 section-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-8">
            About YourTravelSearch
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 mb-6">
              After booking one too many "cheap" flights that doubled in price at checkout, 
              we decided to build something different.
            </p>
            <p className="text-lg text-gray-700">
              YourTravelSearch started in 2020 when Alex (our founder) spent three hours trying to book 
              a simple flight to Seattle. Every site showed different prices, added mysterious fees, 
              or crashed during payment. There had to be a better way.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-600" />
                <CardTitle>Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Fix the broken experience of booking flights online. Every decision we make 
                starts with the question: "Would this annoy us if we were the customer?" 
                If yes, we don't do it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <CardTitle>Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Become the default choice for people who've been burned by other booking sites. 
                When someone says "I need to book a flight," we want them to think of us first 
                because they know we won't waste their time or money.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Our Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {milestone.year.slice(-2)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-1">
                      <Badge variant="outline">{milestone.year}</Badge>
                    </div>
                    <p className="text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 text-center mb-6">Meet the Team</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className={`card-hover ${index % 2 === 0 ? 'md:mt-8' : ''} bg-white/90 backdrop-blur-sm border border-white/50`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 feature-gradient rounded-2xl flex items-center justify-center shadow-lg">
                        <div className="text-white">
                          {member.image}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-display font-bold text-xl text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{member.description}</p>
                      <blockquote className="text-sm italic text-gray-600 border-l-4 border-blue-300 pl-4 bg-blue-50/50 rounded-r-lg py-2">
                        "{member.quote}"
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Why Choose YourTravelSearch?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Direct Airline Connections</h4>
                  <p className="text-gray-600 text-sm">We work directly with airlines to offer competitive rates without middleman markups.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Transparent Pricing</h4>
                  <p className="text-gray-600 text-sm">What you see is what you pay. No surprise fees at checkout.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Human Support</h4>
                  <p className="text-gray-600 text-sm">Real people available during business hours to help with bookings and changes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Secure Payments</h4>
                  <p className="text-gray-600 text-sm">Industry-standard encryption protects your payment information during transactions.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Multi-Currency Support</h4>
                  <p className="text-gray-600 text-sm">Book in your local currency and avoid foreign transaction fees when possible.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Booking Flexibility</h4>
                  <p className="text-gray-600 text-sm">Many flights offer free changes or cancellation within 24 hours of booking.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ready to book your next trip? Our platform makes it easy to compare flights, 
              find great deals, and book with confidence. Join thousands of travelers who choose 
              transparent pricing and reliable service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 text-blue-700">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">150+ Destinations</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Business Hours Support</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-700">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure Payments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}