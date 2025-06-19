import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, 
  Settings, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  triggerCondition: string;
  action: string;
  permissions: 'low' | 'medium' | 'high' | 'full';
  lastRun: string;
  successCount: number;
}

interface SEOChange {
  type: string;
  priority: string;
  action: string;
  target: string;
  reasoning: string;
  estimatedImpact: string;
  riskLevel: string;
  autoApproved: boolean;
}

export default function SEOAutomation() {
  const [selectedDomain, setSelectedDomain] = useState("yourtravelsearch.com");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const domains = [
    "yourtravelsearch.com",
    "cheapflightfinder.com", 
    "traveldealspro.com"
  ];

  // Fetch automation rules
  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ["/api/seo/automation/rules"]
  });

  // Execute automation mutation
  const executeAutomation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/seo/automation/execute/${selectedDomain}`);
    },
    onSuccess: (data: any) => {
      toast({
        title: "SEO Automation Completed",
        description: `${data.autoApproved} changes auto-implemented, ${data.pendingApproval} need approval`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/automation/rules"] });
    },
    onError: (error: any) => {
      toast({
        title: "Automation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update rule mutation
  const updateRule = useMutation({
    mutationFn: async ({ ruleId, updates }: { ruleId: string; updates: any }) => {
      return await apiRequest("PATCH", `/api/seo/automation/rules/${ruleId}`, updates);
    },
    onSuccess: () => {
      toast({
        title: "Rule Updated",
        description: "Automation rule updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/automation/rules"] });
    }
  });

  const toggleRule = (ruleId: string, enabled: boolean) => {
    updateRule.mutate({ ruleId, updates: { enabled } });
  };

  const updatePermissions = (ruleId: string, permissions: string) => {
    updateRule.mutate({ ruleId, updates: { permissions } });
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'full': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionDescription = (permission: string) => {
    switch (permission) {
      case 'full': return 'Can make any changes automatically';
      case 'high': return 'Can make content and meta changes automatically';
      case 'medium': return 'Can make low-risk meta and technical changes';
      case 'low': return 'Can only make technical optimizations';
      default: return 'Unknown permission level';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="h-8 w-8 text-purple-600" />
              AI SEO Automation
            </h1>
            <p className="text-gray-600 mt-2">
              Autonomous SEO optimization with intelligent permission controls
            </p>
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
            
            <Button 
              onClick={() => executeAutomation.mutate()}
              disabled={executeAutomation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              {executeAutomation.isPending ? "Running..." : "Run Automation"}
            </Button>
          </div>
        </div>

        {/* Execution Results */}
        {executeAutomation.data && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Latest Automation Results</CardTitle>
              <CardDescription>
                Executed on {selectedDomain} at {new Date(executeAutomation.data.executedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {executeAutomation.data.autoApproved}
                  </div>
                  <div className="text-sm text-green-600">Auto-Implemented</div>
                  <div className="text-xs text-green-500 mt-1">LOW & MEDIUM permissions</div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">
                    {executeAutomation.data.pendingApproval}
                  </div>
                  <div className="text-sm text-orange-600">Awaiting Your Approval</div>
                  <div className="text-xs text-orange-500 mt-1">HIGH & FULL permissions</div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {executeAutomation.data.totalChanges}
                  </div>
                  <div className="text-sm text-blue-600">Total Opportunities</div>
                  <div className="text-xs text-blue-500 mt-1">AI analysis complete</div>
                </div>
              </div>

              {/* Changes List */}
              <div className="space-y-3">
                {executeAutomation.data.changes?.map((change: SEOChange, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {change.autoApproved ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        )}
                        <span className="font-medium">{change.action}</span>
                        <Badge variant="outline" className="capitalize">
                          {change.type}
                        </Badge>
                        <Badge className={change.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                       change.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-green-100 text-green-800'}>
                          {change.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{change.reasoning}</div>
                      <div className="text-sm text-blue-600">{change.estimatedImpact}</div>
                    </div>
                    
                    <div className="text-center ml-4">
                      <div className="text-sm font-medium">
                        {change.autoApproved ? "Implemented" : "Needs Approval"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Risk: {change.riskLevel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Automation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Automation Rules
            </CardTitle>
            <CardDescription>
              Configure what the AI can do automatically without your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rulesLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {(rules as AutomationRule[])?.map((rule: AutomationRule) => (
                  <div key={rule.id} className="p-6 border rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{rule.name}</h3>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(enabled) => toggleRule(rule.id, enabled)}
                          />
                          {rule.enabled ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Play className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Pause className="h-3 w-3 mr-1" />
                              Paused
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Trigger:</strong> {rule.triggerCondition}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Action:</strong> {rule.action}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Last run: {new Date(rule.lastRun).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {rule.successCount} successful executions
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 text-right">
                        <div className="mb-2">
                          <Badge className={getPermissionColor(rule.permissions)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {rule.permissions.toUpperCase()} PERMISSION
                          </Badge>
                        </div>
                        
                        <Select 
                          value={rule.permissions} 
                          onValueChange={(permissions) => updatePermissions(rule.id, permissions)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - Technical only</SelectItem>
                            <SelectItem value="medium">Medium - Meta & tech</SelectItem>
                            <SelectItem value="high">High - Content & meta</SelectItem>
                            <SelectItem value="full">Full - All changes</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="text-xs text-gray-500 mt-1 max-w-40">
                          {getPermissionDescription(rule.permissions)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permission Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Levels Guide</CardTitle>
            <CardDescription>
              Understand what each permission level allows the AI to do automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg border-green-200">
                <Badge className="bg-green-100 text-green-800 mb-2">LOW</Badge>
                <h4 className="font-semibold mb-2">Technical Fixes</h4>
                <div className="text-xs text-green-600 mb-2">✅ Auto-Approved (Backend Only)</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Image optimization (no visual changes)</li>
                  <li>• Cache improvements (invisible)</li>
                  <li>• Schema markup (search engines only)</li>
                  <li>• Loading speed fixes (backend)</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg border-yellow-200">
                <Badge className="bg-yellow-100 text-yellow-800 mb-2">MEDIUM</Badge>
                <h4 className="font-semibold mb-2">Meta & Technical</h4>
                <div className="text-xs text-yellow-600 mb-2">✅ Auto-Approved (No Design Impact)</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Meta descriptions (hidden from users)</li>
                  <li>• Title tags (browser tab only)</li>
                  <li>• SEO headers (no design changes)</li>
                  <li>• Internal linking (preserves layout)</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg border-orange-200">
                <Badge className="bg-orange-100 text-orange-800 mb-2">HIGH</Badge>
                <h4 className="font-semibold mb-2">SEO Content Creation</h4>
                <div className="text-xs text-orange-600 mb-2">⚠️ Requires Your Approval</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• NEW SEO landing pages (existing pages untouched)</li>
                  <li>• SEO blog content (separate from main site)</li>
                  <li>• Keyword-targeted content (preserves design)</li>
                  <li>• Content structure (uses existing templates)</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg border-red-200">
                <Badge className="bg-red-100 text-red-800 mb-2">FULL</Badge>
                <h4 className="font-semibold mb-2">Strategic SEO</h4>
                <div className="text-xs text-red-600 mb-2">⚠️ Requires Your Approval</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SEO URL structure (preserves functionality)</li>
                  <li>• Search-optimized navigation (keeps existing UX)</li>
                  <li>• Content strategy (no design changes)</li>
                  <li>• Competitive SEO tactics (backend only)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}