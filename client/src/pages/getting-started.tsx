import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, Plane, Hotel, Package, Search, CreditCard, MapPin, Code, Zap, Shield } from 'lucide-react';
import { DuffelFeatureDemo } from '@/components/DuffelFeatureDemo';
import { Link, useLocation } from 'wouter';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function GettingStarted() {
  const [, setLocation] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const guideSteps: GuideStep[] = [
    {
      id: 'explore-destinations',
      title: 'Explore Destinations',
      description: 'Browse our featured travel destinations and get inspired for your next trip.',
      path: '/',
      icon: <MapPin className="h-5 w-5" />,
      completed: completedSteps.includes('explore-destinations'),
    },
    {
      id: 'search-flights',
      title: 'Search Flights',
      description: 'Find the perfect flight for your journey with our advanced search filters.',
      path: '/flights',
      icon: <Plane className="h-5 w-5" />,
      completed: completedSteps.includes('search-flights'),
    },
    {
      id: 'browse-hotels',
      title: 'Browse Hotels',
      description: 'Discover amazing accommodations with detailed amenities and reviews.',
      path: '/hotels',
      icon: <Hotel className="h-5 w-5" />,
      completed: completedSteps.includes('browse-hotels'),
    },
    {
      id: 'view-packages',
      title: 'View Packages',
      description: 'Explore curated vacation packages for complete travel experiences.',
      path: '/packages',
      icon: <Package className="h-5 w-5" />,
      completed: completedSteps.includes('view-packages'),
    },
    {
      id: 'make-booking',
      title: 'Make a Booking',
      description: 'Complete a sample booking to see the full booking process.',
      path: '/flights/1',
      icon: <CreditCard className="h-5 w-5" />,
      completed: completedSteps.includes('make-booking'),
    },
  ];

  const completionPercentage = (completedSteps.length / guideSteps.length) * 100;

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const navigateToStep = (step: GuideStep) => {
    markStepCompleted(step.id);
    setLocation(step.path);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to YourTravelSearch</h1>
        <p className="text-xl text-gray-600 mb-6">
          Your comprehensive travel booking platform. Let's take a quick tour!
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Getting Started Progress</span>
            <span className="text-sm text-gray-500">{completedSteps.length}/{guideSteps.length}</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="guide">Step-by-Step</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">What You Can Do</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Search and compare flights from multiple airlines</li>
                    <li>• Browse hotels with detailed amenities and photos</li>
                    <li>• Discover vacation packages for complete experiences</li>
                    <li>• Book travel with secure payment processing</li>
                    <li>• Manage your bookings and travel history</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Platform Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Real-time search with smart filters</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Secure user authentication</li>
                    <li>• Comprehensive error handling</li>
                    <li>• Fast, reliable database backend</li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Badge variant="secondary" className="mb-2">Current Mode</Badge>
                <p className="text-sm text-gray-600">
                  The platform currently operates with comprehensive demo data. 
                  All functionality is fully working with realistic travel information.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-600" />
                  Flight Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Advanced flight search with multiple airlines, flexible dates, and price comparisons.
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li>• Multiple airline options</li>
                  <li>• Flexible date selection</li>
                  <li>• Price range filtering</li>
                  <li>• Duration and stops preferences</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-green-600" />
                  Hotel Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse and book accommodations with detailed information and guest reviews.
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li>• Detailed amenity listings</li>
                  <li>• Guest ratings and reviews</li>
                  <li>• Location-based search</li>
                  <li>• Price comparison tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Vacation Packages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete vacation experiences combining flights, hotels, and activities.
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li>• All-inclusive packages</li>
                  <li>• Curated experiences</li>
                  <li>• Group booking options</li>
                  <li>• Special destination deals</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  Secure Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Safe and secure booking process with multiple payment options and confirmation.
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li>• Secure payment processing</li>
                  <li>• Instant booking confirmation</li>
                  <li>• Email confirmations</li>
                  <li>• Booking management dashboard</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Getting Started Guide</CardTitle>
              <p className="text-gray-600">
                Follow these steps to explore all the key features of YourTravelSearch.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guideSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    <Button
                      onClick={() => navigateToStep(step)}
                      variant={step.completed ? "outline" : "default"}
                      size="sm"
                    >
                      {step.completed ? "Revisit" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Exploring YourTravelSearch
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Live API Integration Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">Current Status</Badge>
                    <span className="text-sm text-gray-600">Mock Data Mode</span>
                  </div>
                  <p className="text-gray-600">
                    The platform currently operates with comprehensive demo data. All live API integration code 
                    is ready but isolated until official API keys are provided.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Architecture Benefits
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 ml-6">
                      <li>• Complete separation between demo and live systems</li>
                      <li>• Zero downtime during API activation</li>
                      <li>• No frontend code changes required</li>
                      <li>• Automatic fallback to demo data if APIs fail</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-600" />
                    Ready for Live Integration
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900">Duffel Flight API</h5>
                      <p className="text-sm text-blue-700">Complete integration following official Duffel documentation</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-900">Hotel Booking APIs</h5>
                      <p className="text-sm text-green-700">Ready for major hotel booking platforms</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-900">Package APIs</h5>
                      <p className="text-sm text-purple-700">Framework prepared for travel package providers</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Duffel Integration Workflow</h4>
                <p className="text-gray-600">
                  Our implementation follows the official Duffel API workflow with advanced search optimization:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-blue-900 mb-2">1. Optimized Search</h5>
                      <p className="text-sm text-gray-600">
                        Advanced search with filters for cabin class, connections, departure/arrival times, and private fares
                      </p>
                      <div className="text-xs bg-gray-100 p-2 rounded mt-2">
                        <div>• Cabin class filtering</div>
                        <div>• Max connections (0-2 stops)</div>
                        <div>• Time-based filtering</div>
                        <div>• Private fare support</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-green-900 mb-2">2. Smart Selection</h5>
                      <p className="text-sm text-gray-600">
                        Real-time pricing updates with performance optimization and supplier timeout controls
                      </p>
                      <div className="text-xs bg-gray-100 p-2 rounded mt-2">
                        <div>• Real-time pricing</div>
                        <div>• Supplier timeout control</div>
                        <div>• Compressed responses</div>
                        <div>• Fare conditions</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-purple-900 mb-2">3. Secure Booking</h5>
                      <p className="text-sm text-gray-600">
                        Complete order processing with payment handling and booking confirmation
                      </p>
                      <div className="text-xs bg-gray-100 p-2 rounded mt-2">
                        <div>• Payment processing</div>
                        <div>• Passenger validation</div>
                        <div>• Booking references</div>
                        <div>• Order management</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">Advanced Features Ready</h5>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Search Optimization:</strong>
                      <ul className="text-gray-600 ml-4 mt-1">
                        <li>• Performance-tuned timeout settings</li>
                        <li>• Connection filtering (direct flights priority)</li>
                        <li>• Cabin class pre-filtering</li>
                        <li>• Compressed API responses</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Premium Features:</strong>
                      <ul className="text-gray-600 ml-4 mt-1">
                        <li>• Fare conditions display (Basic/Comfort/Flexible)</li>
                        <li>• Flight stops intelligence with detailed routing</li>
                        <li>• Loyalty programme accounts integration</li>
                        <li>• Corporate and leisure private fares</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-800 mb-2">Fare Flexibility Display</h5>
                  <p className="text-sm text-amber-700 mb-3">
                    When live APIs are activated, customers can compare fare types with clear change and refund policies:
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border">
                      <div className="font-semibold text-gray-800">Basic Economy</div>
                      <div className="text-red-600">• Not changeable</div>
                      <div className="text-red-600">• Not refundable</div>
                      <div className="text-gray-600">• Carry-on included</div>
                      <div className="font-semibold text-gray-900 mt-2">£100.00</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-semibold text-gray-800">Comfort</div>
                      <div className="text-orange-600">• Changeable (£50 fee)</div>
                      <div className="text-orange-600">• Refundable (£100 fee)</div>
                      <div className="text-gray-600">• Checked bag included</div>
                      <div className="font-semibold text-gray-900 mt-2">£200.00</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded border border-purple-200">
                      <div className="font-semibold text-purple-800">Flexible ✓</div>
                      <div className="text-green-600">• Fully changeable</div>
                      <div className="text-green-600">• Fully refundable</div>
                      <div className="text-gray-600">• Premium benefits</div>
                      <div className="font-semibold text-gray-900 mt-2">£500.00</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Loyalty Programme Benefits</h4>
                <p className="text-gray-600">
                  When live APIs are activated, travelers can access exclusive discounts and benefits through their airline loyalty accounts:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-blue-900 mb-2">Customer Benefits</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div>• Discounted fares for loyalty members</div>
                        <div>• Additional baggage allowances</div>
                        <div>• Preferential seat selection</div>
                        <div>• Priority boarding privileges</div>
                        <div>• Lounge access eligibility</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-green-900 mb-2">Technical Features</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div>• Multi-airline account support</div>
                        <div>• Real-time benefit validation</div>
                        <div>• Automatic fare optimization</div>
                        <div>• Seamless booking integration</div>
                        <div>• Test mode with 10% discounts</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h5 className="font-semibold text-yellow-800 mb-2">Flight Stops Intelligence</h5>
                  <p className="text-sm text-yellow-700 mb-2">
                    Advanced flight routing display helps travelers make informed decisions:
                  </p>
                  <div className="grid md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <strong>Direct Flights:</strong> Non-stop routing for fastest travel
                    </div>
                    <div>
                      <strong>Connecting Flights:</strong> Layovers with different flight numbers
                    </div>
                    <div>
                      <strong>Technical Stops:</strong> Same flight number, brief stops for fuel/passengers
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">API Activation Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h5 className="font-medium">Obtain Official API Keys</h5>
                      <p className="text-sm text-gray-600">
                        Sign up for Duffel account and generate production access tokens from your dashboard
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h5 className="font-medium">Provide API Credentials</h5>
                      <p className="text-sm text-gray-600">
                        Add DUFFEL_API_KEY and other credentials to environment variables
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h5 className="font-medium">Automatic Activation</h5>
                      <p className="text-sm text-gray-600">
                        System automatically detects API keys and switches to live mode without downtime
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">✓</div>
                    <div>
                      <h5 className="font-medium">Live Booking Ready</h5>
                      <p className="text-sm text-gray-600">
                        Platform operates with real flight data, pricing, and booking capabilities
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The current demo version provides the exact same user experience 
                  as the live system. All features, booking flows, and interfaces remain identical during the transition.
                </p>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Enterprise API Features Preview</h4>
                <p className="text-gray-600">
                  Experience the comprehensive Duffel API integration capabilities that will be activated when you provide your official API keys:
                </p>
                <DuffelFeatureDemo />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}