import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Search, Zap, Eye, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KeywordGap {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  opportunity: number;
  intent: 'commercial' | 'informational' | 'transactional';
  category: string;
}

interface RouteOpportunity {
  route: string;
  keywords: string[];
  competitorGap: number;
  trafficPotential: number;
  seasonality: string;
}

export default function GapAnalysis() {
  const { toast } = useToast();
  const [gapData, setGapData] = useState<{
    gaps: KeywordGap[];
    routes: RouteOpportunity[];
    recommendations: string[];
  } | null>(null);
  const [competitorData, setCompetitorData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState("expedia.com, kayak.com, booking.com");
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordGap | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  useEffect(() => {
    loadGapAnalysis();
  }, []);

  const loadGapAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seo/gap-analysis');
      if (response.ok) {
        const data = await response.json();
        setGapData(data);
      } else {
        throw new Error('Failed to fetch gap analysis');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load keyword gap analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeCompetitors = async () => {
    setLoading(true);
    try {
      const competitorList = competitors.split(',').map(c => c.trim());
      const response = await fetch('/api/seo/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitors: competitorList })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompetitorData(data);
        toast({
          title: "Analysis Complete",
          description: `Found ${data.weakKeywords?.length || 0} competitor weakness opportunities`
        });
      } else {
        throw new Error('Failed to analyze competitors');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze competitor weaknesses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (keyword: KeywordGap) => {
    setLoading(true);
    try {
      const response = await fetch('/api/seo/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyword)
      });
      
      if (response.ok) {
        const content = await response.json();
        setGeneratedContent(content);
        setSelectedKeyword(keyword);
        toast({
          title: "Content Generated",
          description: "SEO-optimized landing page content created"
        });
      } else {
        throw new Error('Failed to generate content');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity >= 80) return "bg-green-500";
    if (opportunity >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getIntentBadge = (intent: string) => {
    const colors = {
      commercial: "bg-blue-100 text-blue-800",
      transactional: "bg-green-100 text-green-800",
      informational: "bg-purple-100 text-purple-800"
    };
    return colors[intent as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            Keyword Gap Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Identify uncovered search opportunities and dominate untapped keyword lanes
          </p>
        </div>

        <Tabs defaultValue="gaps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gaps" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Keyword Gaps
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Route Opportunities
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Competitor Analysis
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Content Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gaps">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  High-Opportunity Keywords
                  <Button onClick={loadGapAnalysis} disabled={loading}>
                    {loading ? "Analyzing..." : "Refresh Analysis"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gapData?.gaps ? (
                  <div className="grid gap-4">
                    {gapData.gaps.map((gap, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{gap.keyword}</h3>
                          <Badge className={getIntentBadge(gap.intent)}>
                            {gap.intent}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Search Volume</div>
                            <div className="font-semibold">{gap.searchVolume?.toLocaleString()}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Difficulty</div>
                            <div className="font-semibold">{gap.difficulty}/100</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Opportunity</div>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getOpportunityColor(gap.opportunity)}`}></div>
                              <span className="font-semibold">{gap.opportunity}/100</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Category</div>
                            <div className="font-semibold text-sm">{gap.category}</div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => generateContent(gap)}
                          className="w-full"
                          variant="outline"
                        >
                          Generate Landing Page Content
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {loading ? "Analyzing keyword opportunities..." : "Click Refresh Analysis to start"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Route-Specific Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                {gapData?.routes ? (
                  <div className="grid gap-4">
                    {gapData.routes.map((route, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">{route.route}</h3>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-gray-500">Competitor Gap</div>
                            <Progress value={route.competitorGap} className="mt-1" />
                            <div className="text-sm font-semibold">{route.competitorGap}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Traffic Potential</div>
                            <div className="font-semibold">{route.trafficPotential?.toLocaleString()}/month</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Seasonality</div>
                            <Badge variant="outline">{route.seasonality}</Badge>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Target Keywords:</div>
                          <div className="flex flex-wrap gap-2">
                            {route.keywords?.map((keyword, kidx) => (
                              <Badge key={kidx} variant="secondary">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No route opportunities analyzed yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Weakness Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="competitors">Competitor Domains (comma-separated)</Label>
                    <Input
                      id="competitors"
                      value={competitors}
                      onChange={(e) => setCompetitors(e.target.value)}
                      placeholder="expedia.com, kayak.com, booking.com"
                    />
                  </div>
                  
                  <Button onClick={analyzeCompetitors} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze Competitor Weaknesses"}
                  </Button>

                  {competitorData && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3">Weak Keywords ({competitorData.weakKeywords?.length || 0})</h3>
                        <div className="grid gap-2">
                          {competitorData.weakKeywords?.map((keyword: KeywordGap, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <span className="font-medium">{keyword.keyword}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">Vol: {keyword.searchVolume}</span>
                                <span className="text-sm text-gray-600">Diff: {keyword.difficulty}</span>
                                <Badge className={getIntentBadge(keyword.intent)}>{keyword.intent}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Content Gaps</h3>
                        <div className="grid gap-2">
                          {competitorData.contentGaps?.map((gap: string, index: number) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg">
                              <span className="text-sm">{gap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedContent && selectedKeyword ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Content for: {selectedKeyword.keyword}
                      </h3>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">SEO Title</h4>
                      <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                        {generatedContent.title}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Meta Description</h4>
                      <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                        {generatedContent.metaDescription}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Content Structure</h4>
                      <div className="space-y-2">
                        {generatedContent.headings?.map((heading: string, index: number) => (
                          <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                            {index === 0 ? 'H1: ' : 'H2: '}{heading}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Content Outline</h4>
                      <div className="space-y-2">
                        {generatedContent.contentOutline?.map((section: string, index: number) => (
                          <div key={index} className="p-2 bg-purple-50 rounded text-sm">
                            {index + 1}. {section}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Select a keyword from the Gap Analysis tab and click "Generate Landing Page Content"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {gapData?.recommendations && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gapData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}