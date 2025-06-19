import { Briefcase, MapPin, Clock, DollarSign, Users, Star, Globe, Heart, Code, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Careers() {
  const openPositions = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "New York, NY / Remote",
      type: "Full-time",
      salary: "$120k - $180k",
      description: "Join our engineering team building scalable travel booking platforms. Experience with React, Node.js, and cloud infrastructure required."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA / Remote", 
      type: "Full-time",
      salary: "$140k - $200k",
      description: "Lead product strategy for our hotel booking platform. Experience in travel industry and B2C products preferred."
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "London, UK / Remote",
      type: "Full-time", 
      salary: "£60k - £90k",
      description: "Design intuitive travel booking experiences. Portfolio showcasing mobile-first design and user research experience required."
    },
    {
      title: "Customer Success Manager", 
      department: "Customer Experience",
      location: "Austin, TX / Remote",
      type: "Full-time",
      salary: "$80k - $120k", 
      description: "Build relationships with corporate travel clients. Experience in SaaS customer success and travel industry preferred."
    },
    {
      title: "Data Scientist",
      department: "Analytics",
      location: "Seattle, WA / Remote",
      type: "Full-time",
      salary: "$130k - $170k",
      description: "Analyze travel patterns and optimize pricing algorithms. PhD in quantitative field or equivalent experience required."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering", 
      location: "Toronto, ON / Remote",
      type: "Full-time",
      salary: "CAD $100k - $140k",
      description: "Maintain and scale our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines required."
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Travel Perks",
      description: "Annual travel allowance, discounted bookings, and travel rewards for exploring the world"
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible hours, unlimited PTO, and remote work options for most positions"
    },
    {
      icon: Users,
      title: "Professional Growth",
      description: "Learning stipends, conference attendance, mentorship programs, and career development"
    },
    {
      icon: Star,
      title: "Equity & Compensation",
      description: "Competitive salaries, equity participation, and performance bonuses"
    },
    {
      icon: Shield,
      title: "Financial Security",
      description: "401(k) matching, life insurance, disability coverage, and financial planning resources"
    }
  ];

  const departments = [
    {
      name: "Engineering",
      count: 12,
      description: "Build scalable platforms serving millions of travelers"
    },
    {
      name: "Product",
      count: 4,
      description: "Shape the future of travel booking experiences"
    },
    {
      name: "Design",
      count: 3,
      description: "Create intuitive and beautiful user interfaces"
    },
    {
      name: "Customer Experience",
      count: 8,
      description: "Support travelers throughout their journey"
    },
    {
      name: "Marketing",
      count: 5,
      description: "Connect with travelers and grow our community"
    },
    {
      name: "Sales",
      count: 6,
      description: "Build partnerships with travel industry leaders"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Help us revolutionize travel by building the future of booking technology
            </p>
            <div className="flex justify-center">
              <Badge className="bg-white text-purple-600 text-lg px-6 py-2">
                38 Open Positions
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why TravalSearch?</h2>
            <p className="text-xl text-gray-600">Join a team that's passionate about making travel accessible to everyone</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-6 h-6 mr-3 text-purple-600" />
                  Innovation-Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Work with cutting-edge technology including live APIs, real-time pricing systems, 
                  and scalable cloud infrastructure serving millions of users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-purple-600" />
                  Global Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your work directly impacts millions of travelers worldwide, making their 
                  dream trips possible and accessible across 190+ countries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-3 text-purple-600" />
                  Collaborative Culture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join a diverse, inclusive team that values different perspectives, 
                  encourages innovation, and supports professional growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">Find your next opportunity with us</p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                        <Badge variant="secondary">{position.department}</Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {position.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {position.type}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {position.salary}
                        </div>
                      </div>
                      
                      <p className="text-gray-600">{position.description}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Button>Apply Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see a position that fits? We're always looking for talented people.</p>
            <Button variant="outline">Send General Application</Button>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Departments</h2>
            <p className="text-xl text-gray-600">Explore different teams and find where you belong</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{dept.name}</CardTitle>
                    <Badge>{dept.count} open roles</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{dept.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <p className="text-xl text-gray-600">We invest in our team's success and well-being</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <benefit.icon className="w-6 h-6 mr-3 text-purple-600" />
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Testimonials */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Team Says</h2>
            <p className="text-xl text-gray-600">Hear from employees about their experience at TravalSearch</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80" 
                    alt="Alex Thompson"
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-600 mb-4 italic">
                      "The engineering culture here is incredible. We work with cutting-edge technology 
                      and have the freedom to innovate while solving real problems for millions of travelers."
                    </p>
                    <div>
                      <p className="font-semibold">Alex Thompson</p>
                      <p className="text-sm text-gray-500">Senior Software Engineer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&q=80" 
                    alt="Maria Garcia"
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-600 mb-4 italic">
                      "TravalSearch truly cares about work-life balance. The flexible schedule and 
                      remote work options have allowed me to travel while building my career."
                    </p>
                    <div>
                      <p className="font-semibold">Maria Garcia</p>
                      <p className="text-sm text-gray-500">Product Designer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80" 
                    alt="James Wilson"
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-600 mb-4 italic">
                      "The growth opportunities are amazing. I started as a junior developer and 
                      was promoted to team lead within 18 months thanks to the mentorship program."
                    </p>
                    <div>
                      <p className="font-semibold">James Wilson</p>
                      <p className="text-sm text-gray-500">Engineering Team Lead</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80" 
                    alt="Lisa Chen"
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-600 mb-4 italic">
                      "Working in customer success here means directly impacting people's travel experiences. 
                      It's rewarding to help customers plan their dream vacations every day."
                    </p>
                    <div>
                      <p className="font-semibold">Lisa Chen</p>
                      <p className="text-sm text-gray-500">Customer Success Manager</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-xl text-gray-600">What to expect when you apply</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Apply Online</h3>
              <p className="text-sm text-gray-600">Submit your application and resume through our careers portal</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Initial Screening</h3>
              <p className="text-sm text-gray-600">Phone or video call with our recruiting team</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Technical Interview</h3>
              <p className="text-sm text-gray-600">Skills assessment and interviews with team members</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Final Decision</h3>
              <p className="text-sm text-gray-600">Reference checks and offer discussion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Journey?</h2>
          <p className="text-xl mb-8">
            Help us build the future of travel technology and make exploring the world accessible to everyone
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold mb-4">Questions About Working Here?</h3>
          <p className="text-gray-600 mb-4">Our People team is here to help</p>
          <p className="text-purple-600 font-semibold">careers@yourtravelsearch.com</p>
        </div>
      </section>
    </div>
  );
}