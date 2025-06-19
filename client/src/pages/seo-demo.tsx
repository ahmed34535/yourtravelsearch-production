import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Target } from "lucide-react";

export default function SEODemo() {
  const [showTasks, setShowTasks] = useState(false);
  const [showAutomated, setShowAutomated] = useState(false);

  const sampleTasks = [
    {
      task: "Update homepage title tag",
      description: "Change from 'YourTravelSearch - Book Flights' to 'Cheap Flights to Europe, Asia & USA - Compare 200+ Airlines'",
      timeEstimate: "2 minutes",
      priority: "high" as const,
      impact: "Could increase clicks by 15-20%"
    },
    {
      task: "Add FAQ section about baggage fees",
      description: "Create FAQ answering 'What baggage fees apply?' and 'How do I add bags to my booking?' - targets 'flight baggage fees' keyword",
      timeEstimate: "15 minutes", 
      priority: "medium" as const,
      impact: "Targets 12,000 monthly searches"
    },
    {
      task: "Write blog post about flight booking tips",
      description: "Write 800-word article 'How to Find Cheap Flights: 10 Expert Tips' targeting 'cheap flight tips' and 'how to find cheap flights'",
      timeEstimate: "45 minutes",
      priority: "medium" as const,
      impact: "Could drive 500+ visitors per month"
    },
    {
      task: "Optimize flight search page meta description",
      description: "Change to 'Search and compare flights from 200+ airlines. No hidden fees, transparent pricing. Book direct with airlines.'",
      timeEstimate: "1 minute",
      priority: "high" as const,
      impact: "Improve search result click-through rate"
    },
    {
      task: "Add customer reviews section",
      description: "Add reviews mentioning specific benefits like 'no hidden fees' and 'transparent pricing' to build trust",
      timeEstimate: "20 minutes",
      priority: "low" as const,
      impact: "Improve conversion rate"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SEO Assistant Demo</h1>
          <p className="text-xl text-gray-600 mb-6">
            See how AI analyzes your site and gives you specific tasks to improve search rankings
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowTasks(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Manual SEO Tasks
            </Button>
            <Button 
              onClick={() => setShowAutomated(true)}
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Show Ahrefs + ChatGPT Automation
            </Button>
          </div>
        </div>

        {showTasks && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Your SEO Tasks for This Week
                </CardTitle>
                <p className="text-gray-600">
                  Complete these 5 tasks to improve your search rankings
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleTasks.map((task, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{task.task}</h3>
                              <Badge variant={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-4 h-4" />
                                {task.timeEstimate}
                              </div>
                              <div className="flex items-center gap-1 text-green-600">
                                <Target className="w-4 h-4" />
                                {task.impact}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="ml-4">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Done
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Expected Results</h3>
                  <p className="text-green-700 text-sm">
                    Completing these tasks could increase your organic traffic by 25-40% within 4-6 weeks. 
                    The homepage title change alone typically improves click-through rates by 15-20%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showAutomated && (
          <div className="space-y-6">
            <Card className="border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Target className="w-5 h-5" />
                  Ahrefs + ChatGPT Automated SEO System
                </CardTitle>
                <p className="text-purple-700">
                  How AI automatically researches keywords and creates your weekly SEO strategy
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-green-600 font-bold">1</span>
                        </div>
                        <h3 className="font-semibold mb-2">Ahrefs Pulls Data</h3>
                        <p className="text-sm text-gray-600">
                          Automatically queries Ahrefs API for keyword volumes, competitor rankings, and backlink opportunities
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-blue-600 font-bold">2</span>
                        </div>
                        <h3 className="font-semibold mb-2">ChatGPT Analyzes</h3>
                        <p className="text-sm text-gray-600">
                          AI reviews all data and creates specific, actionable tasks ranked by priority and impact
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-200">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-orange-600 font-bold">3</span>
                        </div>
                        <h3 className="font-semibold mb-2">You Get Results</h3>
                        <p className="text-sm text-gray-600">
                          Receive weekly emails with exactly what to do, no technical knowledge required
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Sample Automated Report:</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive" className="mt-0.5">HIGH</Badge>
                        <div>
                          <p className="font-medium">"cheap flights to Tokyo" opportunity found</p>
                          <p className="text-gray-600">22,000 monthly searches, medium competition. Your competitor Kayak ranks #4, you can beat them. Add this keyword to your Japan flights page.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="default" className="mt-0.5">MEDIUM</Badge>
                        <div>
                          <p className="font-medium">Write blog post: "Best Time to Book Flights"</p>
                          <p className="text-gray-600">Expedia ranks #2 for this topic (18,100 searches). AI analysis shows content gaps you can fill to outrank them.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="default" className="mt-0.5">MEDIUM</Badge>
                        <div>
                          <p className="font-medium">Update Miami flights page title</p>
                          <p className="text-gray-600">Include "last minute deals" - 8,900 monthly searches with low competition detected.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">What You Need:</h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>• Ahrefs API subscription ($199-399/month depending on plan)</li>
                      <li>• OpenAI API access (already connected to your platform)</li>
                      <li>• Email address for automated weekly reports</li>
                      <li>• 15 minutes per week to implement the suggested changes</li>
                    </ul>
                  </div>

                  <div className="text-center space-y-4">
                    <Button className="bg-purple-600 hover:bg-purple-700 mr-4">
                      Set Up Automated SEO System
                    </Button>
                    <Button variant="outline" onClick={() => window.open('/google-seo', '_blank')}>
                      View Google SEO Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}