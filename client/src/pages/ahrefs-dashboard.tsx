import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Zap, Eye, DollarSign, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KeywordGap {
  keyword: string;
  competitorUrl: string;
  competitorPosition: number;
  ourPosition: number | null;
  opportunity: number;
  monthlyTraffic: number;
}

interface KeywordOpportunity {
  keyword: string;
  searchVolume: number;
  keywordDifficulty: number;
  cpc: number;
  competitorRanking: number;
  trafficPotential: number;
  intent: string;
  serp_features: string[];
}

export default function AhrefsDashboard() {
  const { toast } = useToast();
  const [competitorGaps, setCompetitorGaps] = useState<{
    keywordGaps: KeywordGap[];
    contentOpportunities: string[];
    technicalRecommendations: string[];
  } | null>(null);
  const [keywordOpportunities, setKeywordOpportunities] = useState<KeywordOpportunity[]>([]);
  const [rankingStrategy, setRankingStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompetitorGaps();
    loadKeywordOpportunities();
  }, []);

  const loadCompetitorGaps = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seo/ahrefs-gaps?domain=yourtravelsearch.com');
      if (response.ok) {
        const data = await response.json();
        setCompetitorGaps(data);
      } else {
        throw new Error('Failed to load competitor gaps');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load competitor gap analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadKeywordOpportunities = async () => {
    try {
      const response = await fetch('/api/seo/keyword-opportunities?domain=yourtravelsearch.com');
      if (response.ok) {
        const data = await response.json();
        setKeywordOpportunities(data.keywords || []);
      }
    } catch (error) {
      console.error('Failed to load keyword opportunities:', error);
    }
  };

  const generateRankingStrategy = async () => {
    if (keywordOpportunities.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/seo/ranking-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: keywordOpportunities.slice(0, 10) })
      });
      
      if (response.ok) {
        const strategy = await response.json();
        setRankingStrategy(strategy);
        toast({
          title: "Strategy Generated",
          description: "Comprehensive ranking strategy created for top opportunities"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ranking strategy",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity >= 90) return "bg-green-500";
    if (opportunity >= 70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return "text-green-600";
    if (difficulty <= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const totalMonthlyTraffic = competitorGaps?.keywordGaps?.reduce((sum, gap) => sum + gap.monthlyTraffic, 0) || 0;
  const totalSearchVolume = keywordOpportunities.reduce((sum, kw) => sum + kw.searchVolume, 0);
  const avgCPC = keywordOpportunities.length > 0 ? 
    keywordOpportunities.reduce((sum, kw) => sum + kw.cpc, 0) / keywordOpportunities.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            Competitive Intelligence Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered competitor analysis and ranking opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Competitor Gaps</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {competitorGaps?.keywordGaps?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Monthly Traffic Potential</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalMonthlyTraffic.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Search Volume</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSearchVolume.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg CPC</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${avgCPC.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="gaps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gaps">Competitor Gaps</TabsTrigger>
            <TabsTrigger value="opportunities">Keyword Opportunities</TabsTrigger>
            <TabsTrigger value="strategy">Ranking Strategy</TabsTrigger>
            <TabsTrigger value="content">Content Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="gaps">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  High-Value Competitor Gaps
                  <Button onClick={loadCompetitorGaps} disabled={loading}>
                    {loading ? "Analyzing..." : "Refresh Analysis"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {competitorGaps?.keywordGaps ? (
                  <div className="space-y-4">
                    {competitorGaps.keywordGaps.map((gap, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{gap.keyword}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{gap.competitorUrl}</Badge>
                            <div className={`w-3 h-3 rounded-full ${getOpportunityColor(gap.opportunity)}`}></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Competitor Position</div>
                            <div className="font-semibold">#{gap.competitorPosition}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Our Position</div>
                            <div className="font-semibold text-red-600">Not Ranking</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Monthly Traffic</div>
                            <div className="font-semibold">{gap.monthlyTraffic.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Opportunity Score</div>
                            <div className="font-semibold">{gap.opportunity}/100</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {loading ? "Analyzing competitor gaps..." : "Click Refresh Analysis to start"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>High-Volume Keyword Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keywordOpportunities.map((kw, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{kw.keyword}</h3>
                        <Badge className={`${kw.intent === 'transactional' ? 'bg-green-100 text-green-800' : 
                          kw.intent === 'commercial' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {kw.intent}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Search Volume</div>
                          <div className="font-semibold">{kw.searchVolume.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Difficulty</div>
                          <div className={`font-semibold ${getDifficultyColor(kw.keywordDifficulty)}`}>
                            {kw.keywordDifficulty}/100
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">CPC</div>
                          <div className="font-semibold">${kw.cpc.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Traffic Potential</div>
                          <div className="font-semibold">{kw.trafficPotential.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">SERP Features</div>
                          <div className="flex gap-1">
                            {kw.serp_features?.map((feature, fidx) => (
                              <Badge key={fidx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Comprehensive Ranking Strategy
                  <Button onClick={generateRankingStrategy} disabled={loading}>
                    {loading ? "Generating..." : "Generate Strategy"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rankingStrategy ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Content Strategy
                      </h3>
                      <div className="space-y-2">
                        {rankingStrategy.contentStrategy?.map((strategy: string, index: number) => (
                          <div key={index} className="p-3 bg-yellow-50 rounded-lg text-sm">
                            {strategy}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Technical Optimizations
                      </h3>
                      <div className="space-y-2">
                        {rankingStrategy.technicalOptimizations?.map((opt: string, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg text-sm">
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Competitor Weaknesses
                      </h3>
                      <div className="space-y-2">
                        {rankingStrategy.competitorWeaknesses?.map((weakness: string, index: number) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg text-sm">
                            {weakness}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Click Generate Strategy to create a comprehensive ranking plan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Gap Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                {competitorGaps?.contentOpportunities ? (
                  <div className="space-y-4">
                    {competitorGaps.contentOpportunities.map((opportunity, index) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm">{opportunity}</p>
                      </div>
                    ))}
                    
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Technical Recommendations</h3>
                      <div className="space-y-2">
                        {competitorGaps.technicalRecommendations?.map((rec, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No content opportunities analyzed yet</p>
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