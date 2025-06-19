import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Search,
  Zap
} from "lucide-react";

interface SearchConsoleData {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  page: string;
}

interface SEOReport {
  domain: string;
  period: string;
  summary: {
    totalClicks: number;
    totalImpressions: number;
    avgPosition: number;
    totalPageViews: number;
    overallScore: number;
  };
  topKeywords: SearchConsoleData[];
  performanceIssues: string[];
  opportunities: string[];
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    task: string;
    description: string;
    estimatedImpact: string;
    timeRequired: string;
  }[];
}

export default function GoogleSEODashboard() {
  const [selectedDomain, setSelectedDomain] = useState("yourtravelsearch.com");

  const { data: seoReport, isLoading: reportLoading } = useQuery<SEOReport>({
    queryKey: ["/api/seo/google-report", selectedDomain],
    enabled: !!selectedDomain
  });

  const { data: pagespeedData, isLoading: speedLoading } = useQuery({
    queryKey: ["/api/seo/pagespeed", selectedDomain],
    enabled: !!selectedDomain
  });

  const domains = [
    "yourtravelsearch.com",
    "flightfinderplus.com", 
    "traveldealsexpress.com",
    "quickbookflights.com",
    "airfarehunter.com"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Google SEO Intelligence</h1>
          <p className="text-xl text-gray-600">
            Real-time data from Google Search Console, Analytics, and PageSpeed Insights
          </p>
          
          <div className="flex items-center gap-4 mt-6">
            <label htmlFor="domain-select" className="font-medium">Domain:</label>
            <select
              id="domain-select"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {reportLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : seoReport ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(seoReport.summary.totalClicks)}</div>
                      <p className="text-xs text-muted-foreground">
                        From Search Console
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(seoReport.summary.totalImpressions)}</div>
                      <p className="text-xs text-muted-foreground">
                        Search appearances
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Position</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{seoReport.summary.avgPosition.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">
                        In search results
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{seoReport.summary.overallScore}/100</div>
                      <Progress value={seoReport.summary.overallScore} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Performance Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {seoReport.performanceIssues.slice(0, 4).map((issue, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                            <p className="text-sm text-gray-700">{issue}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-500" />
                        Top Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {seoReport.opportunities.slice(0, 4).map((opportunity, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <p className="text-sm text-gray-700">{opportunity}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Top Performing Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                {seoReport?.topKeywords ? (
                  <div className="space-y-4">
                    {seoReport.topKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{keyword.keyword}</h3>
                          <p className="text-sm text-gray-600">{keyword.page}</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{keyword.clicks}</div>
                            <div className="text-gray-500">Clicks</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{formatNumber(keyword.impressions)}</div>
                            <div className="text-gray-500">Impressions</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{keyword.ctr.toFixed(1)}%</div>
                            <div className="text-gray-500">CTR</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{keyword.position.toFixed(1)}</div>
                            <div className="text-gray-500">Position</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Loading keyword data...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>PageSpeed Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  {speedLoading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : pagespeedData ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Performance Score</span>
                        <span className="text-2xl font-bold">{pagespeedData.score}/100</span>
                      </div>
                      <Progress value={pagespeedData.score} className="h-2" />
                      
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{pagespeedData.coreWebVitals?.lcp}s</div>
                          <div className="text-xs text-gray-500">LCP</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{pagespeedData.coreWebVitals?.fid}ms</div>
                          <div className="text-xs text-gray-500">FID</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{pagespeedData.coreWebVitals?.cls}</div>
                          <div className="text-xs text-gray-500">CLS</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Loading performance data...</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {seoReport ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Page Views</span>
                        <span className="font-semibold">{formatNumber(seoReport.summary.totalPageViews)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Period</span>
                        <span className="font-semibold">{seoReport.period}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Loading analytics data...</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                {seoReport?.opportunities ? (
                  <div className="space-y-4">
                    {seoReport.opportunities.map((opportunity, index) => (
                      <div key={index} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <p className="text-green-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Loading opportunities...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Prioritized Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {seoReport?.actionItems ? (
                  <div className="space-y-4">
                    {seoReport.actionItems.map((item, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{item.task}</h3>
                                <Badge variant={getPriorityColor(item.priority)}>
                                  {item.priority}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-1 text-green-600">
                                  <TrendingUp className="w-4 h-4" />
                                  {item.estimatedImpact}
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  {item.timeRequired}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Done
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Loading action items...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}