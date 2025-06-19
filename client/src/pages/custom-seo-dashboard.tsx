import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, TrendingUp, TrendingDown, BarChart3, Target, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface KeywordAnalysis {
  keyword: string;
  ourPosition: number | null;
  totalResults: number;
  competitors: Array<{
    domain: string;
    position: number;
    title: string;
    url: string;
  }>;
  difficulty: number;
  searchVolume: number;
  updatedAt: string;
}

interface CompetitorAnalysis {
  domain: string;
  domainAuthority: number;
  backlinks: Array<{
    url: string;
    domain: string;
    authority: number;
    anchor: string;
  }>;
  topPages: Array<{
    url: string;
    traffic: number;
    keywords: number;
  }>;
  keywords: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    position?: number;
  }>;
  trafficEstimate: number;
  technicalSEO: {
    pageSpeed: number;
    mobileOptimized: boolean;
    httpsEnabled: boolean;
    xmlSitemap: boolean;
    structuredData: boolean;
  };
  contentGaps: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
  }>;
  updatedAt: string;
}

interface Opportunity {
  keyword: string;
  currentPosition: number | null;
  difficulty: number;
  searchVolume: number;
  topCompetitors: Array<{
    domain: string;
    position: number;
    title: string;
    url: string;
  }>;
  opportunity: number;
  recommendedActions: string[];
}

export default function CustomSEODashboard() {
  const [keywordInput, setKeywordInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch opportunities data
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<Opportunity[]>({
    queryKey: ['/api/custom-seo/opportunities'],
    retry: false
  });

  // Keyword analysis mutation
  const keywordAnalysisMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const response = await apiRequest('GET', `/api/custom-seo/keyword-analysis/${encodeURIComponent(keyword)}`);
      return response.json();
    },
    onSuccess: (data: KeywordAnalysis) => {
      setSelectedKeyword(keywordInput);
      queryClient.setQueryData(['/api/custom-seo/keyword-analysis', keywordInput], data);
    }
  });

  // Competitor analysis mutation
  const competitorAnalysisMutation = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest('GET', `/api/custom-seo/competitor-analysis/${encodeURIComponent(domain)}`);
      return response.json();
    },
    onSuccess: (data: CompetitorAnalysis) => {
      setSelectedCompetitor(competitorInput);
      queryClient.setQueryData(['/api/custom-seo/competitor-analysis', competitorInput], data);
    }
  });

  // Get keyword analysis data
  const { data: keywordAnalysis } = useQuery<KeywordAnalysis>({
    queryKey: ['/api/custom-seo/keyword-analysis', selectedKeyword],
    enabled: !!selectedKeyword,
    retry: false
  });

  // Get competitor analysis data
  const { data: competitorAnalysis } = useQuery<CompetitorAnalysis>({
    queryKey: ['/api/custom-seo/competitor-analysis', selectedCompetitor],
    enabled: !!selectedCompetitor,
    retry: false
  });

  const handleKeywordAnalysis = () => {
    if (keywordInput.trim()) {
      keywordAnalysisMutation.mutate(keywordInput.trim());
    }
  };

  const handleCompetitorAnalysis = () => {
    if (competitorInput.trim()) {
      competitorAnalysisMutation.mutate(competitorInput.trim());
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 80) return 'text-red-600';
    if (difficulty >= 60) return 'text-orange-500';
    if (difficulty >= 40) return 'text-yellow-500';
    return 'text-green-600';
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Custom SEO Intelligence
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Advanced SEO analysis and competitor intelligence - Your free alternative to Ahrefs
        </p>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="keyword-analysis">Keyword Analysis</TabsTrigger>
          <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="serp-monitoring">SERP Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                SEO Opportunities
              </CardTitle>
              <CardDescription>
                High-impact keywords to target for better rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {opportunitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {opportunities?.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{opportunity.keyword}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-16 rounded-full ${getOpportunityColor(opportunity.opportunity)}`}>
                            <div className="h-full bg-white rounded-full opacity-30" style={{ width: `${opportunity.opportunity}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{opportunity.opportunity}% opportunity</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Current Position:</span>
                          <span className="ml-2 font-medium">
                            {opportunity.currentPosition ? `#${opportunity.currentPosition}` : 'Not ranking'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Search Volume:</span>
                          <span className="ml-2 font-medium">{formatNumber(opportunity.searchVolume)}/month</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Difficulty:</span>
                          <span className={`ml-2 font-medium ${getDifficultyColor(opportunity.difficulty)}`}>
                            {opportunity.difficulty}/100
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Top Competitors:</h4>
                        <div className="flex gap-2">
                          {opportunity.topCompetitors.map((comp, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              #{comp.position} {comp.domain}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Recommended Actions:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {opportunity.recommendedActions.map((action, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keyword-analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Keyword Analysis
              </CardTitle>
              <CardDescription>
                Analyze keyword difficulty, search volume, and competitor positions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keyword to analyze..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleKeywordAnalysis()}
                />
                <Button 
                  onClick={handleKeywordAnalysis}
                  disabled={keywordAnalysisMutation.isPending}
                >
                  {keywordAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>

              {keywordAnalysis && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {keywordAnalysis.ourPosition ? `#${keywordAnalysis.ourPosition}` : 'Not ranking'}
                        </div>
                        <p className="text-sm text-gray-500">Our Position</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{formatNumber(keywordAnalysis.searchVolume)}</div>
                        <p className="text-sm text-gray-500">Monthly Searches</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className={`text-2xl font-bold ${getDifficultyColor(keywordAnalysis.difficulty)}`}>
                          {keywordAnalysis.difficulty}/100
                        </div>
                        <p className="text-sm text-gray-500">Difficulty</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{keywordAnalysis.totalResults}</div>
                        <p className="text-sm text-gray-500">Top Results</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Competitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {keywordAnalysis.competitors.map((competitor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">#{competitor.position}</Badge>
                              <div>
                                <h4 className="font-medium">{competitor.title}</h4>
                                <p className="text-sm text-gray-500">{competitor.domain}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitor-analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Competitor Analysis
              </CardTitle>
              <CardDescription>
                Deep dive into competitor strategies and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter competitor domain (e.g., expedia.com)..."
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCompetitorAnalysis()}
                />
                <Button 
                  onClick={handleCompetitorAnalysis}
                  disabled={competitorAnalysisMutation.isPending}
                >
                  {competitorAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>

              {competitorAnalysis && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{competitorAnalysis.domainAuthority}/100</div>
                        <p className="text-sm text-gray-500">Domain Authority</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{formatNumber(competitorAnalysis.trafficEstimate)}</div>
                        <p className="text-sm text-gray-500">Monthly Traffic</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{competitorAnalysis.backlinks.length}</div>
                        <p className="text-sm text-gray-500">Quality Backlinks</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Technical SEO Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Page Speed</span>
                          <div className="flex items-center gap-2">
                            <Progress value={competitorAnalysis.technicalSEO.pageSpeed} className="w-32" />
                            <span className="text-sm font-medium">{competitorAnalysis.technicalSEO.pageSpeed}/100</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Mobile Optimized</span>
                            <Badge variant={competitorAnalysis.technicalSEO.mobileOptimized ? "default" : "destructive"}>
                              {competitorAnalysis.technicalSEO.mobileOptimized ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>HTTPS Enabled</span>
                            <Badge variant={competitorAnalysis.technicalSEO.httpsEnabled ? "default" : "destructive"}>
                              {competitorAnalysis.technicalSEO.httpsEnabled ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>XML Sitemap</span>
                            <Badge variant={competitorAnalysis.technicalSEO.xmlSitemap ? "default" : "destructive"}>
                              {competitorAnalysis.technicalSEO.xmlSitemap ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Structured Data</span>
                            <Badge variant={competitorAnalysis.technicalSEO.structuredData ? "default" : "destructive"}>
                              {competitorAnalysis.technicalSEO.structuredData ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Keywords</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {competitorAnalysis.keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{keyword.keyword}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">#{keyword.position}</Badge>
                                <span className="text-gray-500">{formatNumber(keyword.searchVolume)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Content Gaps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {competitorAnalysis.contentGaps.map((gap, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{gap.keyword}</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${getDifficultyColor(gap.difficulty)}`}>
                                  {gap.difficulty}
                                </span>
                                <span className="text-gray-500">{formatNumber(gap.searchVolume)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serp-monitoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                SERP Monitoring
              </CardTitle>
              <CardDescription>
                Track ranking changes for your target keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">SERP monitoring feature coming soon</p>
                <p className="text-sm text-gray-400">
                  This will track daily ranking changes for your keyword portfolio
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}