import { Newspaper, Calendar, Download, ExternalLink, Award, Users, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Press() {
  const pressReleases = [
    {
      date: "March 15, 2024",
      title: "TravalSearch Reaches 2 Million Annual Users Milestone",
      summary: "Company celebrates significant growth in customer base while maintaining industry-leading satisfaction rates",
      category: "Company News"
    },
    {
      date: "February 28, 2024", 
      title: "TravalSearch Integrates Live Duffel API for Real-Time Flight Booking",
      summary: "New integration provides instant confirmations and competitive pricing for travelers worldwide",
      category: "Product Update"
    },
    {
      date: "January 22, 2024",
      title: "TravalSearch Wins 'Best Travel Technology' Award at Travel Tech Summit 2024",
      summary: "Recognition highlights company's innovation in travel booking platform and customer experience",
      category: "Awards"
    },
    {
      date: "December 18, 2023",
      title: "TravalSearch Expands Corporate Travel Solutions",
      summary: "New enterprise features include group booking management and advanced reporting capabilities",
      category: "Product Update"
    },
    {
      date: "November 30, 2023",
      title: "TravalSearch Partners with Leading Hotel Chains for Enhanced Inventory",
      summary: "Strategic partnerships add 100,000+ new properties to platform's accommodation options",
      category: "Partnership"
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo Package",
      description: "High-resolution logos in various formats (PNG, SVG, JPG)",
      size: "2.3 MB"
    },
    {
      title: "Executive Headshots",
      description: "Professional photos of leadership team",
      size: "15.7 MB"
    },
    {
      title: "Product Screenshots",
      description: "High-quality screenshots of platform features",
      size: "8.9 MB"
    },
    {
      title: "Company Fact Sheet",
      description: "Key statistics, milestones, and company information",
      size: "850 KB"
    }
  ];

  const mediaContacts = [
    {
      name: "Jennifer Martinez",
      title: "Director of Communications",
      email: "press@travalsearch.com",
      phone: "+1 (555) 123-4567"
    },
    {
      name: "David Thompson", 
      title: "Public Relations Manager",
      email: "media@travalsearch.com",
      phone: "+1 (555) 123-4568"
    }
  ];

  const keyStats = [
    { number: "2M+", label: "Annual Users", icon: Users },
    { number: "500K+", label: "Hotel Partners", icon: Globe },
    { number: "1,200+", label: "Airline Partners", icon: TrendingUp },
    { number: "190+", label: "Countries Served", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Newspaper className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Press Center</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Latest news, press releases, and media resources from TravalSearch
            </p>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">TravalSearch at a Glance</h2>
            <p className="text-xl text-gray-600">Key metrics and achievements</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Press Releases */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Press Releases</h2>
            <p className="text-xl text-gray-600">Stay updated with our latest announcements and news</p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="secondary">{release.category}</Badge>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {release.date}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                      <p className="text-gray-600">{release.summary}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Button variant="outline">
                        Read More <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline">View All Press Releases</Button>
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Kit</h2>
            <p className="text-xl text-gray-600">Download our brand assets and company materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Company Milestones</h2>
            <p className="text-xl text-gray-600">Key moments in TravalSearch's journey</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-lg font-semibold text-blue-600">2024</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">2 Million Users & Industry Awards</h3>
                <p className="text-gray-600">Reached 2M annual users and won multiple industry recognition awards</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-lg font-semibold text-blue-600">2023</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Live API Integration & Global Expansion</h3>
                <p className="text-gray-600">Integrated Duffel live APIs and expanded to 190+ countries</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-lg font-semibold text-blue-600">2022</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">1 Million User Milestone</h3>
                <p className="text-gray-600">Celebrated serving over 1 million travelers worldwide</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-lg font-semibold text-blue-600">2021</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Series A Funding & Team Growth</h3>
                <p className="text-gray-600">Secured Series A funding and expanded team to 50+ employees</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-lg font-semibold text-blue-600">2020</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Platform Launch & First Customers</h3>
                <p className="text-gray-600">Official platform launch with hotel and flight booking capabilities</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-lg font-semibold text-blue-600">2019</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Company Founded</h3>
                <p className="text-gray-600">TravalSearch founded with mission to democratize travel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-600">Industry recognition and achievements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Best Travel Technology</h3>
                <p className="text-gray-600 mb-2">Travel Tech Awards 2024</p>
                <p className="text-sm text-gray-500">Recognized for innovation in booking platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Customer Choice Award</h3>
                <p className="text-gray-600 mb-2">Travel Industry Review 2023</p>
                <p className="text-sm text-gray-500">Based on customer satisfaction ratings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rising Star Company</h3>
                <p className="text-gray-600 mb-2">Startup Awards 2022</p>
                <p className="text-sm text-gray-500">Fastest growing travel platform</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Media Contacts */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Contacts</h2>
            <p className="text-xl text-gray-600">Get in touch with our communications team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaContacts.map((contact, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{contact.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{contact.title}</p>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <strong>Email:</strong> {contact.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {contact.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Inquiry CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-xl mb-8">
            Need additional information or want to schedule an interview? Our communications team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Send Press Inquiry
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Download Media Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">Subscribe to receive our latest press releases and company news</p>
          <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}