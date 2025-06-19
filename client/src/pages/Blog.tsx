import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, User, Calendar, Search, TrendingUp, Plane, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  featuredImage: string;
  seoKeywords: string[];
  metaDescription: string;
  views: number;
  isPopular: boolean;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch blog posts from API
  const { data: blogData, isLoading } = useQuery({
    queryKey: ['/api/blog/posts', { category: selectedCategory, search: searchTerm }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/blog/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  const blogPosts = blogData?.posts || [];
  const categories = ["All", ...(blogData?.categories || [])];
  
  const popularPosts = blogPosts.filter((post: any) => post.isPopular).slice(0, 3);
  const recentPosts = [...blogPosts].sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 4);
  const filteredPosts = blogPosts;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SEOHead
        title="Travel Blog | Flight Tips, Deals & Travel Guides | TravalSearch"
        description="Get expert travel advice, flight booking tips, and destination guides. Save money on flights with our insider knowledge and data-driven insights."
        keywords="travel blog, flight tips, cheap flights, travel deals, airport guides, travel advice"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Travel <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert travel insights, flight booking strategies, and destination guides to help you travel smarter and save money.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Article */}
            {!searchTerm && selectedCategory === "All" && recentPosts.length > 0 && (
              <Card className="mb-8 overflow-hidden">
                <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <Badge className="mb-3 bg-white/20 text-white">Featured</Badge>
                      <h2 className="text-3xl font-bold mb-4">{recentPosts[0]?.title}</h2>
                      <p className="text-lg opacity-90 mb-4 line-clamp-2">{recentPosts[0]?.excerpt}</p>
                      <Link href={`/blog/${recentPosts[0]?.slug}`}>
                        <Button className="bg-white text-blue-600 hover:bg-gray-100">
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPosts.map((post: any) => (
                <Card key={post.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.isPopular && (
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-tight line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="mt-4">
                      <Button className="w-full">Read More</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card className="p-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p>Try adjusting your search terms or selecting a different category.</p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Popular Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularPosts.map((post: any) => (
                  <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                    <Link href={`/blog/${post.slug}`} className="block hover:text-blue-600 dark:hover:text-blue-400">
                      <h4 className="font-medium line-clamp-2 mb-2">{post.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{post.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.filter(cat => cat !== "All").map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "Flight Tips" && <Plane className="w-4 h-4 mr-2" />}
                      {category === "Airport Guides" && <MapPin className="w-4 h-4 mr-2" />}
                      {category === "Travel Deals" && <TrendingUp className="w-4 h-4 mr-2" />}
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                <p className="text-blue-100 mb-4">Get the latest travel tips and deals delivered to your inbox.</p>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}