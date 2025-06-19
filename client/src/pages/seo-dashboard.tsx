import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SEOAnalysis {
  domain: string;
  currentTitle: string;
  currentDescription: string;
  targetKeywords: string[];
  recommendations: {
    title: string;
    description: string;
    contentSuggestions: string[];
    keywordOpportunities: string[];
    competitorInsights: string[];
  };
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
}

interface WeeklyTasks {
  week: string;
  tasks: {
    task: string;
    description: string;
    timeEstimate: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export default function SEODashboard() {
  const [selectedDomain, setSelectedDomain] = useState("yourtravelsearch.com");
  const [analysisForm, setAnalysisForm] = useState({
    url: "",
    content: "",
    domain: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch weekly tasks
  const { data: weeklyTasks, isLoading: tasksLoading } = useQuery<WeeklyTasks>({
    queryKey: ["/api/seo/weekly-tasks", selectedDomain],
    enabled: !!selectedDomain
  });

  // SEO Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (data: typeof analysisForm) => {
      return await apiRequest("POST", "/api/seo/analyze", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "SEO recommendations generated successfully"
      });
      queryClient.setQueryData(["/api/seo/analysis", analysisForm.domain], data);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze page",
        variant: "destructive"
      });
    }
  });

  // SEO Strategy mutation
  const strategyMutation = useMutation({
    mutationFn: async ({ domain, brandName }: { domain: string; brandName: string }) => {
      return await apiRequest("POST", "/api/seo/strategy", { domain, brandName });
    },
    onSuccess: () => {
      toast({
        title: "Strategy Generated",
        description: "SEO strategy created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Strategy Failed", 
        description: error.message || "Failed to generate strategy",
        variant: "destructive"
      });
    }
  });

  const domains = [
    "yourtravelsearch.com",
    "flightfinderplus.com", 
    "traveldealsexpress.com",
    "quickbookflights.com",
    "airfarehunter.com"
  ];

  const handleRunAnalysis = () => {
    if (!analysisForm.url || !analysisForm.domain) {
      toast({
        title: "Missing Information",
        description: "Please enter both URL and domain",
        variant: "destructive"
      });
      return;
    }
    
    analysisMutation.mutate(analysisForm);
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SEO Intelligence Dashboard</h1>
          <p className="text-xl text-gray-600">
            Automated SEO analysis and recommendations for your travel booking sites
          </p>
        </div>

        <Tabs defaultValue="weekly-tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weekly-tasks">Weekly Tasks</TabsTrigger>
            <TabsTrigger value="analysis">Page Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Domain Strategy</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly-tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  This Week's SEO Tasks
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Label htmlFor="domain-select">Domain:</Label>
                  <select
                    id="domain-select"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ) : weeklyTasks ? (
                  <div className="space-y-4">
                    {weeklyTasks.tasks.map((task, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{task.task}</h3>
                                <Badge variant={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>⏱️ {task.timeEstimate}</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tasks available. Generate weekly tasks first.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Page SEO Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="analysis-url">Page URL</Label>
                    <Input
                      id="analysis-url"
                      placeholder="https://yourdomain.com/page"
                      value={analysisForm.url}
                      onChange={(e) => setAnalysisForm(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="analysis-domain">Domain</Label>
                    <Input
                      id="analysis-domain"
                      placeholder="yourdomain.com"
                      value={analysisForm.domain}
                      onChange={(e) => setAnalysisForm(prev => ({ ...prev, domain: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="analysis-content">Page Content (HTML or text)</Label>
                  <textarea
                    id="analysis-content"
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Paste your page content here..."
                    value={analysisForm.content}
                    onChange={(e) => setAnalysisForm(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleRunAnalysis}
                  disabled={analysisMutation.isPending}
                  className="w-full"
                >
                  {analysisMutation.isPending ? "Analyzing..." : "Run SEO Analysis"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Domain SEO Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map(domain => (
                    <Card key={domain} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{domain}</h3>
                        <Button
                          size="sm"
                          onClick={() => strategyMutation.mutate({ 
                            domain, 
                            brandName: domain.split('.')[0] 
                          })}
                          disabled={strategyMutation.isPending}
                          className="w-full"
                        >
                          Generate Strategy
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78/100</div>
                  <Progress value={78} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    +12 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Keywords Tracking</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground">
                    Across all domains
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23/30</div>
                  <Progress value={77} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    This month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Keyword Opportunity Found</p>
                      <p className="text-sm text-gray-600">
                        "cheap flights to Europe" has low competition and good search volume
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Competitor Alert</p>
                      <p className="text-sm text-gray-600">
                        Kayak launched new landing pages targeting your keywords
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Traffic Increase</p>
                      <p className="text-sm text-gray-600">
                        yourtravelsearch.com saw 23% increase in organic traffic
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}