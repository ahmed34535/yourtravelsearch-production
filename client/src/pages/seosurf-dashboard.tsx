import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Eye, Search, Users } from "lucide-react";

interface KeywordData {
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  change: number;
  searchVolume: number;
  difficulty: number;
  url: string;
  device: string;
}

interface CompetitorData {
  domain: string;
  keywords: string[];
  averagePosition: number;
  visibilityScore: number;
  organicTraffic: number;
}

interface OpportunityData {
  type: string;
  keyword?: string;
  competitor?: string;
  currentPosition?: number;
  searchVolume?: number;
  opportunity: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTrafficGain?: number;
}

export default function SEOSurfDashboard() {
  const [selectedDomain, setSelectedDomain] = useState("yourtravelsearch.com");
  
  const domains = [
    "yourtravelsearch.com",
    "cheapflightfinder.com",
    "traveldealspro.com"
  ];

  // Fetch SEOSurf data
  const { data: keywordData, isLoading: keywordsLoading } = useQuery({
    queryKey: ["/api/seosurf/keywords", selectedDomain],
    enabled: !!selectedDomain
  });

  const { data: competitorData, isLoading: competitorsLoading } = useQuery({
    queryKey: ["/api/seosurf/competitors", selectedDomain],
    enabled: !!selectedDomain
  });

  const { data: opportunityData, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["/api/seosurf/opportunities", selectedDomain],
    enabled: !!selectedDomain
  });

  const { data: seoSurfReport, isLoading: reportLoading } = useQuery({
    queryKey: ["/api/seosurf/report", selectedDomain],
    enabled: !!selectedDomain
  });

  const keywords: KeywordData[] = keywordData?.keywords || [];
  const competitors: CompetitorData[] = competitorData?.competitors || [];
  const opportunities: OpportunityData[] = opportunityData?.opportunities || [];
  const report = seoSurfReport || {
    summary: {
      totalKeywords: 0,
      averagePosition: 0,
      visibilityIndex: 0,
      organicTrafficEstimate: 0
    },
    keywordPerformance: {
      improving: 0,
      declining: 0,
      stable: 0
    },
    recommendations: []
  };

  const getRankingTrend = (change: number) => {
    if (change > 0) return { icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" };
    if (change < 0) return { icon: TrendingDown, color: "text-red-600", bg: "bg-red-100" };
    return { icon: Target, color: "text-gray-600", bg: "bg-gray-100" };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 font-bold';
    if (position <= 10) return 'text-blue-600 font-semibold';
    if (position <= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SEO Intelligence Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time keyword rankings and competitive analysis</p>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.totalKeywords}</div>
              <p className="text-xs text-muted-foreground">
                Tracked across all devices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Position</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.averagePosition}</div>
              <p className="text-xs text-muted-foreground">
                Across all tracked keywords
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visibility Index</CardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.visibilityIndex}%</div>
              <p className="text-xs text-muted-foreground">
                Keywords in top 10
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.summary.organicTrafficEstimate.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Estimated monthly visits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="keywords" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keywords">Keyword Rankings</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Keyword Rankings</CardTitle>
                <CardDescription>
                  Current positions and changes for your most important travel keywords
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keywordsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {keywords.slice(0, 15).map((keyword, index) => {
                      const trend = getRankingTrend(keyword.change);
                      const TrendIcon = trend.icon;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${trend.bg}`}>
                              <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                            </div>
                            
                            <div>
                              <div className="font-medium">{keyword.keyword}</div>
                              <div className="text-sm text-gray-500">
                                {keyword.searchVolume?.toLocaleString()} monthly searches • {keyword.device}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className={`text-lg font-bold ${getPositionColor(keyword.currentPosition)}`}>
                                #{keyword.currentPosition}
                              </div>
                              <div className="text-xs text-gray-500">Current</div>
                            </div>
                            
                            <div className="text-center">
                              <div className={`text-sm ${keyword.change > 0 ? 'text-green-600' : keyword.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {keyword.change > 0 ? '+' : ''}{keyword.change}
                              </div>
                              <div className="text-xs text-gray-500">Change</div>
                            </div>
                            
                            <div className="text-center">
                              <Progress value={Math.max(0, 100 - keyword.difficulty)} className="w-16" />
                              <div className="text-xs text-gray-500 mt-1">Difficulty</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>
                  How your travel booking site compares to major competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {competitorsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {competitors.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium text-lg">{competitor.domain}</div>
                          <div className="text-sm text-gray-600">
                            Shared keywords: {competitor.keywords.join(', ')}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getPositionColor(competitor.averagePosition)}`}>
                              #{competitor.averagePosition}
                            </div>
                            <div className="text-xs text-gray-500">Avg Position</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {competitor.visibilityScore}%
                            </div>
                            <div className="text-xs text-gray-500">Visibility</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {competitor.organicTraffic?.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Est. Traffic</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Opportunities</CardTitle>
                <CardDescription>
                  AI-powered recommendations to improve your travel site rankings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {opportunitiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {opportunities.map((opportunity, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getPriorityColor(opportunity.priority)}>
                                {opportunity.priority.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500 capitalize">
                                {opportunity.type.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <div className="font-medium mb-1">{opportunity.opportunity}</div>
                            
                            {opportunity.keyword && (
                              <div className="text-sm text-gray-600">
                                Keyword: "{opportunity.keyword}" • Position: #{opportunity.currentPosition} • 
                                Volume: {opportunity.searchVolume?.toLocaleString()}
                              </div>
                            )}
                            
                            {opportunity.competitor && (
                              <div className="text-sm text-gray-600">
                                Target competitor: {opportunity.competitor}
                              </div>
                            )}
                          </div>
                          
                          {opportunity.estimatedTrafficGain && (
                            <div className="text-center ml-4">
                              <div className="text-lg font-bold text-green-600">
                                +{opportunity.estimatedTrafficGain.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">Est. Traffic</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Overview of keyword ranking changes and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportLoading ? (
                  <div className="space-y-4">
                    <div className="h-32 bg-gray-100 rounded animate-pulse" />
                    <div className="h-48 bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Performance Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-700">
                          {report.keywordPerformance.improving}
                        </div>
                        <div className="text-sm text-green-600">Keywords Improving</div>
                      </div>
                      
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-700">
                          {report.keywordPerformance.declining}
                        </div>
                        <div className="text-sm text-red-600">Keywords Declining</div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-gray-700">
                          {report.keywordPerformance.stable}
                        </div>
                        <div className="text-sm text-gray-600">Keywords Stable</div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                      <div className="space-y-3">
                        {report.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">{rec.effort} effort</span>
                            </div>
                            <div className="font-medium mb-1">{rec.action}</div>
                            <div className="text-sm text-gray-600">{rec.impact}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}