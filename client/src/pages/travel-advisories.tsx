import { AlertTriangle, Shield, Globe, MapPin, Calendar, ExternalLink, RefreshCw, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TravelAdvisories() {
  const currentAdvisories = [
    {
      country: "Turkey",
      level: "Exercise Increased Caution",
      levelColor: "bg-yellow-500",
      lastUpdated: "March 10, 2024",
      summary: "Exercise increased caution due to terrorism and arbitrary detentions.",
      details: "Some areas have increased risk. Reconsider travel to areas near the Syrian border."
    },
    {
      country: "Mexico",
      level: "Exercise Increased Caution", 
      levelColor: "bg-yellow-500",
      lastUpdated: "March 8, 2024",
      summary: "Exercise increased caution due to crime and kidnapping.",
      details: "Crime and violence are serious problems. Some areas have increased risk."
    },
    {
      country: "France",
      level: "Exercise Normal Precautions",
      levelColor: "bg-green-500",
      lastUpdated: "March 5, 2024", 
      summary: "Exercise normal precautions when traveling to France.",
      details: "Generally safe destination. Follow standard safety precautions."
    },
    {
      country: "United Kingdom",
      level: "Exercise Normal Precautions",
      levelColor: "bg-green-500",
      lastUpdated: "March 1, 2024",
      summary: "Exercise normal precautions when traveling to the UK.",
      details: "Generally safe destination. Be aware of potential for terrorism."
    }
  ];

  const healthAdvisories = [
    {
      title: "COVID-19 Updates",
      severity: "Ongoing",
      description: "Check destination-specific requirements for testing, vaccination, and quarantine.",
      link: "View COVID-19 Travel Requirements"
    },
    {
      title: "Measles Outbreak",
      severity: "Alert",
      description: "Increased measles activity in several countries. Ensure vaccinations are up to date.",
      link: "View Affected Countries"
    },
    {
      title: "Seasonal Flu",
      severity: "Advisory",
      description: "Peak flu season in Northern Hemisphere. Consider vaccination before travel.",
      link: "Flu Prevention Guidelines"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Travel Advisories</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stay informed about current travel conditions, safety alerts, and health requirements worldwide
          </p>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-8 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search by country or destination..."
                className="h-12 text-lg"
              />
            </div>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              <MapPin className="w-4 h-4 mr-2" />
              Search Advisories
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Last updated: March 15, 2024 | <RefreshCw className="w-4 h-4 inline mr-1" />Updated daily
          </p>
        </div>
      </section>

      {/* Advisory Levels Guide */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Travel Advisory Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-3"></div>
                <h3 className="font-semibold text-green-700 mb-2">Level 1</h3>
                <p className="text-sm font-medium mb-2">Exercise Normal Precautions</p>
                <p className="text-xs text-gray-600">This is the lowest advisory level for safety and security risk.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-3"></div>
                <h3 className="font-semibold text-yellow-700 mb-2">Level 2</h3>
                <p className="text-sm font-medium mb-2">Exercise Increased Caution</p>
                <p className="text-xs text-gray-600">Be aware of heightened risks to safety and security.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-3"></div>
                <h3 className="font-semibold text-orange-700 mb-2">Level 3</h3>
                <p className="text-sm font-medium mb-2">Reconsider Travel</p>
                <p className="text-xs text-gray-600">Avoid travel due to serious risks to safety and security.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-3"></div>
                <h3 className="font-semibold text-red-700 mb-2">Level 4</h3>
                <p className="text-sm font-medium mb-2">Do Not Travel</p>
                <p className="text-xs text-gray-600">Do not travel due to greater likelihood of life-threatening risks.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="current" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="current">Current Advisories</TabsTrigger>
              <TabsTrigger value="health">Health Alerts</TabsTrigger>
              <TabsTrigger value="requirements">Entry Requirements</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Current Travel Advisories</h3>
                  <Badge className="bg-blue-600">156 countries monitored</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentAdvisories.map((advisory, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center">
                            <Globe className="w-5 h-5 mr-2" />
                            {advisory.country}
                          </CardTitle>
                          <Badge className={`text-white ${advisory.levelColor}`}>
                            {advisory.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm font-medium">{advisory.summary}</p>
                          <p className="text-sm text-gray-600">{advisory.details}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Updated: {advisory.lastUpdated}</span>
                            <Button variant="link" size="sm" className="p-0 h-auto">
                              View Full Advisory <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Europe</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Enhanced security measures in major cities</li>
                          <li>• Seasonal weather considerations</li>
                          <li>• Updated COVID-19 protocols</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Asia-Pacific</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Monsoon season travel impacts</li>
                          <li>• Border crossing updates</li>
                          <li>• Health screening requirements</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Americas</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Hurricane season preparations</li>
                          <li>• Crime prevention tips</li>
                          <li>• Entry requirement changes</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="health">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Health Alerts & Requirements</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {healthAdvisories.map((alert, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-red-600" />
                          {alert.title}
                        </CardTitle>
                        <Badge variant={alert.severity === "Ongoing" ? "default" : alert.severity === "Alert" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          {alert.link} <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Vaccination Requirements by Region</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Required Vaccinations</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">Yellow Fever</p>
                            <p className="text-sm text-gray-600">Required for travel to parts of Africa and South America</p>
                          </div>
                          <div>
                            <p className="font-medium">Meningitis</p>
                            <p className="text-sm text-gray-600">Required for travel to Saudi Arabia during Hajj/Umrah</p>
                          </div>
                          <div>
                            <p className="font-medium">Japanese Encephalitis</p>
                            <p className="text-sm text-gray-600">Recommended for rural areas in Asia</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Recommended Vaccinations</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">Hepatitis A & B</p>
                            <p className="text-sm text-gray-600">Recommended for most international travel</p>
                          </div>
                          <div>
                            <p className="font-medium">Typhoid</p>
                            <p className="text-sm text-gray-600">Recommended for South Asia, Africa, Caribbean</p>
                          </div>
                          <div>
                            <p className="font-medium">Routine Vaccines</p>
                            <p className="text-sm text-gray-600">Ensure MMR, DPT, flu, and COVID-19 are current</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requirements">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Entry Requirements & Documentation</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Passport Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Valid for at least 6 months beyond travel dates</li>
                        <li>• At least 2-4 blank pages for stamps</li>
                        <li>• No damage or alterations</li>
                        <li>• Check specific country requirements</li>
                        <li>• Consider expedited renewal if needed</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Visa Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Check visa requirements for each destination</li>
                        <li>• Apply well in advance (6-8 weeks)</li>
                        <li>• Ensure passport validity meets requirements</li>
                        <li>• Prepare required documentation</li>
                        <li>• Consider visa processing times</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>COVID-19 Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Vaccination requirements vary by country</li>
                        <li>• Testing may be required before travel</li>
                        <li>• Health screening at borders</li>
                        <li>• Travel insurance may be mandatory</li>
                        <li>• Check airline-specific policies</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• International driving permit if needed</li>
                        <li>• Travel insurance documentation</li>
                        <li>• Proof of onward travel</li>
                        <li>• Hotel reservations or invitation letters</li>
                        <li>• Emergency contact information</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Country-Specific Entry Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Country</th>
                            <th className="text-left p-2">Visa Required</th>
                            <th className="text-left p-2">Passport Validity</th>
                            <th className="text-left p-2">COVID-19 Requirements</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2 font-medium">United Kingdom</td>
                            <td className="p-2">No (US citizens)</td>
                            <td className="p-2">Valid throughout stay</td>
                            <td className="p-2">None</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">France</td>
                            <td className="p-2">No (US citizens)</td>
                            <td className="p-2">Valid throughout stay</td>
                            <td className="p-2">None</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Japan</td>
                            <td className="p-2">No (tourist visa waiver)</td>
                            <td className="p-2">Valid throughout stay</td>
                            <td className="p-2">Check current requirements</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Brazil</td>
                            <td className="p-2">Yes</td>
                            <td className="p-2">6 months minimum</td>
                            <td className="p-2">Vaccination may be required</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Travel Safety Resources</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Government Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">U.S. State Department</p>
                          <p className="text-sm text-gray-600">Official travel advisories and alerts</p>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            Visit State.gov <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                        <div>
                          <p className="font-medium">CDC Travel Health Notices</p>
                          <p className="text-sm text-gray-600">Health recommendations by destination</p>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            Visit CDC.gov <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                        <div>
                          <p className="font-medium">STEP Program</p>
                          <p className="text-sm text-gray-600">Register with U.S. embassies</p>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            Register for STEP <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">U.S. Citizens Abroad</p>
                          <p className="text-sm text-gray-600">Emergency assistance hotline</p>
                          <p className="text-sm font-mono">+1 (202) 501-4444</p>
                        </div>
                        <div>
                          <p className="font-medium">TravalSearch Emergency</p>
                          <p className="text-sm text-gray-600">24/7 travel assistance</p>
                          <p className="text-sm font-mono">1-800-EMERGENCY</p>
                        </div>
                        <div>
                          <p className="font-medium">Travel Insurance Claims</p>
                          <p className="text-sm text-gray-600">Report incidents immediately</p>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            File a Claim <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Safety Apps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">Smart Traveler App</p>
                          <p className="text-sm text-gray-600">State Department mobile app</p>
                        </div>
                        <div>
                          <p className="font-medium">TravelSafe Pro</p>
                          <p className="text-sm text-gray-600">Offline safety information</p>
                        </div>
                        <div>
                          <p className="font-medium">Emergency SOS</p>
                          <p className="text-sm text-gray-600">Built into most smartphones</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Pre-Travel Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">8 Weeks Before Travel</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>□ Check passport expiration date</li>
                          <li>□ Apply for visas if required</li>
                          <li>□ Research vaccination requirements</li>
                          <li>□ Schedule travel health consultation</li>
                          <li>□ Purchase travel insurance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">2 Weeks Before Travel</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>□ Check current travel advisories</li>
                          <li>□ Register with STEP program</li>
                          <li>□ Notify banks of travel plans</li>
                          <li>□ Make copies of important documents</li>
                          <li>□ Check COVID-19 requirements</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Emergency Assistance</h2>
          <p className="text-xl mb-8">
            Need immediate help while traveling? Contact our 24/7 emergency assistance team
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-lg p-6">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Emergency Hotline</h3>
              <p className="text-2xl font-bold">1-800-EMERGENCY</p>
              <p className="text-sm opacity-75">Available 24/7 worldwide</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Emergency Email</h3>
              <p className="text-xl font-bold">emergency@yourtravelsearch.com</p>
              <p className="text-sm opacity-75">Response within 30 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Disclaimer:</strong> Travel advisories and requirements change frequently. 
              Always verify current information with official government sources before traveling.
            </p>
            <p>
              TravalSearch provides this information for convenience but is not responsible for its accuracy. 
              Travelers are responsible for ensuring they meet all requirements for their destinations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}