import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, Settings, Database, Zap, Target, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have admin privileges.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminTools = [
    {
      title: "SEO Dashboard",
      description: "Google Search Console, Analytics & PageSpeed insights",
      icon: BarChart3,
      href: "/google-seo",
      color: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      title: "Rankings",
      description: "Keyword tracking and competitor analysis",
      icon: TrendingUp,
      href: "/seosurf",
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      title: "AI Automation",
      description: "Autonomous SEO optimization and content creation",
      icon: Zap,
      href: "/seo-automation",
      color: "bg-purple-50 border-purple-200 text-purple-700"
    },
    {
      title: "Gap Analysis",
      description: "Identify and dominate uncovered keyword opportunities",
      icon: Target,
      href: "/gap-analysis",
      color: "bg-yellow-50 border-yellow-200 text-yellow-700"
    },
    {
      title: "Competitor Intel",
      description: "AI-powered competitive analysis and ranking strategies",
      icon: Eye,
      href: "/ahrefs-dashboard",
      color: "bg-red-50 border-red-200 text-red-700"
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/admin/users",
      color: "bg-orange-50 border-orange-200 text-orange-700"
    },
    {
      title: "System Settings",
      description: "Configure application settings and integrations",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-50 border-gray-200 text-gray-700"
    },
    {
      title: "Database",
      description: "Database management and monitoring",
      icon: Database,
      href: "/admin/database",
      color: "bg-red-50 border-red-200 text-red-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user.firstName}. Manage your travel platform and SEO optimization tools.
              </p>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Admin Access
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool) => (
            <Card key={tool.title} className={`hover:shadow-md transition-shadow ${tool.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <tool.icon className="w-6 h-6" />
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 opacity-80">
                  {tool.description}
                </p>
                <Link href={tool.href}>
                  <Button className="w-full" variant="outline">
                    Open Tool
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-blue-600">Active Domains</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-green-600">Tracked Keywords</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">23</div>
                  <div className="text-sm text-purple-600">AI Optimizations</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-sm text-orange-600">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}