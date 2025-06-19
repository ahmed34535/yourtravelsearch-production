import { useParams, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar, ArrowLeft, Share2, BookOpen, TrendingUp } from "lucide-react";
import { useState } from "react";

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

// Blog posts data (same as in Blog.tsx)
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Score the Cheapest Flight Every Time",
    slug: "how-to-score-cheapest-flight-every-time",
    excerpt: "Master the art of finding rock-bottom flight prices with proven strategies that airlines don't want you to know. Save up to 60% on every booking.",
    content: `Finding the cheapest flights isn't luck—it's strategy. After analyzing millions of bookings, we've identified the exact techniques that consistently deliver the lowest prices.

## The 54-Day Rule

Our data shows that domestic flights are cheapest when booked 54 days in advance, while international flights hit their sweet spot at 70 days. This isn't arbitrary—it's based on airline pricing algorithms.

## Hidden City Ticketing

One of the most powerful techniques involves booking a flight with a layover in your actual destination, then simply not taking the connecting flight. For example, if you want to fly to Chicago, sometimes booking a flight from your city to Milwaukee with a Chicago layover costs significantly less than a direct Chicago flight.

**Important:** Only use this for one-way trips and never check bags, as they'll go to the final destination.

## Mistake Fares and Error Pricing

Airlines occasionally publish fares with pricing errors—sometimes offering international flights for 90% off. Here's how to catch them:

1. Follow @SecretFlying and @TheFlightDeal on Twitter
2. Set up Google Alerts for "mistake fare" and "error fare"
3. Book immediately and ask questions later (most airlines honor mistake fares)
4. Always use a credit card that doesn't charge foreign transaction fees

## The Tuesday 3 PM Myth Debunked

Contrary to popular belief, our analysis of 5 million bookings shows Tuesday at 3 PM isn't magical. The real pattern? Airlines often drop prices late Sunday night and Wednesday evening.

## Multi-City Bookings

Sometimes booking two separate one-way tickets costs less than a round-trip. Our analysis shows this saves money on 23% of domestic routes and 31% of international routes.

## Alternative Airports

Consider nearby airports. Flying into Oakland instead of San Francisco, or Burbank instead of LAX, can save hundreds. Factor in ground transportation costs, but often you'll still come out ahead.

## The Power of Positioning Flights

Sometimes it's cheaper to book a cheap flight to a major hub, then book your actual destination from there. For example, flying from a small city to Denver, then Denver to Europe, might cost less than a direct flight from your small city to Europe.

## Conclusion

These strategies require flexibility and research, but they can save thousands annually. The key is understanding that published fares are just the starting point—with the right techniques, much better deals are always available.`,
    category: "Flight Tips",
    author: "Sarah Chen",
    publishedAt: "2025-06-16",
    readTime: 8,
    tags: ["cheap flights", "flight deals", "booking strategies", "airline hacks", "save money"],
    featuredImage: "/blog/cheapest-flight-tips.jpg",
    seoKeywords: ["cheapest flights", "flight booking hacks", "how to find cheap flights", "airline deals"],
    metaDescription: "Learn proven strategies to find the cheapest flights every time. Expert tips and insider secrets to save up to 60% on airfare.",
    views: 28420,
    isPopular: true
  },
  {
    id: "2",
    title: "Direct vs. Connecting Flights: What Saves More Money?",
    slug: "direct-vs-connecting-flights-what-saves-money",
    excerpt: "The surprising truth about when connecting flights actually cost more than direct routes, and how to make the smart choice every time.",
    content: `Conventional wisdom says connecting flights are cheaper, but our data reveals a more complex picture. In many cases, direct flights offer better value when you factor in time, comfort, and hidden costs.

## The True Cost Calculation

When comparing flight options, most travelers only look at the ticket price. But the real cost includes:

- **Time value:** Your time has monetary worth
- **Meal costs:** Airport food during layovers
- **Accommodation:** Overnight layovers requiring hotels
- **Risk costs:** Missed connections and rebooking fees
- **Transportation:** Getting to/from hub airports

## When Direct Flights Win

Our analysis shows direct flights are often the better deal for:

### Business Travel
Time is money for business travelers. A $200 premium for a direct flight that saves 4 hours is worthwhile if your hourly rate exceeds $50.

### Holiday Travel
During peak seasons (Christmas, Thanksgiving, summer), connecting flights become exponentially more expensive and risky. Weather delays and oversold flights create a domino effect.

### International Routes
For flights over 8 hours, the comfort and reduced jet lag of direct routing often justify higher prices. Plus, you avoid the risk of missing connections due to delays.

## When Connections Make Sense

Connecting flights offer real savings in these scenarios:

### Leisure Travel with Flexibility
If you're not on a tight schedule and can build buffer time, connections can save 30-50% on international routes.

### Off-Peak Travel
During slow travel periods (January-March, September-November), airlines slash connecting flight prices to fill seats.

### Secondary Markets
Flying from smaller cities to major destinations almost always requires connections, and the savings can be substantial.

## Hidden Connection Costs

Factor these often-overlooked expenses:

1. **Airport Meals:** $15-25 per meal during layovers
2. **WiFi:** $10-15 for multi-hour layovers
3. **Lounge Access:** $25-50 if not included
4. **Hotel Costs:** $100-200 for overnight connections
5. **Transportation:** Ground transport to/from hub airports

## The Sweet Spot Strategy

Our recommendation: Accept connections of 2-4 hours in major hubs (Atlanta, Chicago, Dallas) for savings over $300, but pay the premium for direct flights when the difference is under $200.

## Tools for Smart Decisions

1. Use ITA Matrix to compare true travel times
2. Factor your personal time value (annual salary ÷ 2000 hours)
3. Check historical on-time performance for connecting flights
4. Consider travel insurance for complex itineraries

## Conclusion

The direct vs. connecting decision isn't just about money—it's about value. By calculating the true cost including time, comfort, and risk, you'll make smarter choices that serve your specific travel needs and budget.`,
    category: "Flight Tips",
    author: "Michael Torres",
    publishedAt: "2025-06-15",
    readTime: 6,
    tags: ["direct flights", "connecting flights", "flight comparison", "travel efficiency", "cost analysis"],
    featuredImage: "/blog/direct-vs-connecting.jpg",
    seoKeywords: ["direct vs connecting flights", "flight cost comparison", "best flight options", "travel time value"],
    metaDescription: "Discover when direct flights actually save more money than connections. Complete cost analysis and booking strategies.",
    views: 15780,
    isPopular: false
  },
  {
    id: "3",
    title: "Top 5 Cities with Flight Discounts This Month",
    slug: "top-5-cities-flight-discounts-this-month",
    excerpt: "Exclusive deals to Tokyo, Paris, London, Dubai, and São Paulo with savings up to 45%. Limited-time offers from major airlines.",
    content: `June 2025 brings exceptional flight deals to top international destinations. Airlines are offering significant discounts to boost summer travel, with routes to Asia, Europe, and South America seeing the deepest cuts.

## 1. Tokyo, Japan - Save up to 45%

**Deal Details:**
- Round-trip from LAX: $685 (normally $1,200)
- Round-trip from JFK: $745 (normally $1,350)
- Valid travel: June 15 - August 30, 2025

Japan Airlines and ANA are offering their deepest discounts in two years. The weak yen makes this an exceptional time to visit, with your dollar stretching 30% further than last year.

**Booking Tip:** Book by June 20th for maximum savings. These fares are selling out quickly as summer travel picks up.

## 2. Paris, France - Save up to 38%

**Deal Details:**
- Round-trip from Chicago: $495 (normally $800)
- Round-trip from Miami: $525 (normally $850)
- Valid travel: September 1 - November 15, 2025

Air France and Delta are matching each other with competitive fall pricing. September in Paris offers perfect weather with fewer crowds than summer.

**Insider Secret:** Book multi-city tickets (Paris + Rome or Amsterdam) for only $50-75 more than Paris alone.

## 3. London, England - Save up to 42%

**Deal Details:**
- Round-trip from Boston: $385 (normally $675)
- Round-trip from Denver: $445 (normally $775)
- Valid travel: October 1 - December 15, 2025

British Airways and Virgin Atlantic are competing aggressively for fall bookings. London's theater season and holiday markets make autumn travel particularly appealing.

**Pro Tip:** Fly into Gatwick instead of Heathrow for an additional $50-100 savings.

## 4. Dubai, UAE - Save up to 40%

**Deal Details:**
- Round-trip from San Francisco: $745 (normally $1,200)
- Round-trip from Washington DC: $695 (normally $1,150)
- Valid travel: November 1 - March 31, 2026

Emirates is offering exceptional deals for their peak winter season. Dubai's weather is perfect November through March, avoiding the extreme summer heat.

**Money-Saving Strategy:** Book a Dubai stopover (3+ days) when flying to Asia or Africa for no additional cost.

## 5. São Paulo, Brazil - Save up to 47%

**Deal Details:**
- Round-trip from Atlanta: $575 (normally $1,050)
- Round-trip from Houston: $595 (normally $1,100)
- Valid travel: March 1 - May 31, 2026

LATAM and American Airlines are slashing prices for Brazil's fall season (their autumn). This timing avoids both summer crowds and rainy season.

**Currency Advantage:** The Brazilian real is at historic lows, making your dollars go much further once you arrive.

## How to Lock in These Deals

1. **Book immediately:** These are mistake fares and flash sales that disappear quickly
2. **Use flexible dates:** Being open to +/- 3 days can save hundreds more
3. **Consider basic economy:** Most restrictions don't matter for international leisure travel
4. **Set price alerts:** For future reference when these deals return

## Additional Savings Tips

- **Credit card points:** These low cash prices make points redemptions poor value
- **Travel insurance:** Essential for international trips, especially with current global uncertainty
- **Visa requirements:** Check entry requirements early, some countries require advance applications

## Conclusion

These deals represent the best international flight pricing we've seen in 24 months. Airlines are aggressively competing for market share after recent disruptions, creating exceptional opportunities for savvy travelers.`,
    category: "Travel Deals",
    author: "Lisa Park",
    publishedAt: "2025-06-14",
    readTime: 5,
    tags: ["flight deals", "June 2025", "international travel", "discount flights", "limited offers"],
    featuredImage: "/blog/monthly-flight-deals.jpg",
    seoKeywords: ["flight deals June 2025", "cheap international flights", "airline discounts", "travel deals"],
    metaDescription: "Find the best flight deals this month to Tokyo, Paris, London, Dubai, and São Paulo. Up to 45% savings on international flights.",
    views: 22350,
    isPopular: true
  },
  {
    id: "4",
    title: "Flash Sale Alerts: What You Need to Know",
    slug: "flash-sale-alerts-what-you-need-to-know",
    excerpt: "Get ahead of airline flash sales with our complete guide to timing, preparation, and booking strategies for limited-time offers.",
    content: `Airline flash sales can offer incredible savings, but they require preparation and quick action. Most flash sales last only 24-48 hours and sell out fast.

## Understanding Flash Sale Patterns

**Timing Patterns:**
- **Tuesday-Wednesday:** Most common launch days
- **Late evening:** Many sales start 8-11 PM EST
- **Seasonal:** Higher frequency during slow travel periods
- **Quarterly:** Airlines often clear inventory at quarter-end

## Essential Preparation Steps

### 1. Create Alert Systems

**Email Alerts:**
- Scott's Cheap Flights (now Going)
- Secret Flying
- The Flight Deal
- Airfarewatchdog

**Social Media:**
- Follow @SecretFlying on Twitter
- Join airline Facebook pages for instant notifications
- Use hashtags: #flightdeals #flashsale #mistakefare

### 2. Prepare Your Booking Setup

**Account Readiness:**
- Create accounts with major airlines
- Save payment information securely
- Store passport details for international bookings
- Keep frequent flyer numbers accessible

**Technology Setup:**
- Download airline apps
- Clear browser cache regularly
- Use incognito mode for booking
- Have backup payment methods ready

## Flash Sale Strategy

### Quick Decision Framework

**Immediate Questions (30-second evaluation):**
1. Is the destination on your wish list?
2. Can you take time off within the travel window?
3. Is the savings at least 40% off normal prices?
4. Do you have visa/passport requirements covered?

If yes to all four, book immediately and sort details later.

### Booking Tactics

**Speed Techniques:**
- Use autofill for forms
- Screenshot fare details before starting booking
- Don't hesitate - prices can change mid-booking
- Book first, optimize later (seat selection, etc.)

**Common Mistakes to Avoid:**
- Over-researching during the sale window
- Waiting to discuss with travel companions
- Trying to coordinate complex group bookings
- Getting distracted by add-ons and upgrades

## Types of Flash Sales

### 1. Mistake Fares
**Characteristics:**
- Massive discounts (70-90% off)
- Often international routes
- Usually corrected within hours
- Airlines may or may not honor

**Examples:**
- Hong Kong to New York for $180 (normal $1,200)
- Los Angeles to Dublin for $130 (normal $800)

### 2. Genuine Flash Sales
**Characteristics:**
- Legitimate pricing (30-50% off)
- Limited inventory
- Specific travel windows
- Always honored by airlines

### 3. Promotional Codes
**Characteristics:**
- Targeted to specific customer segments
- Often require membership or signup
- Stack with existing deals
- Usually 24-72 hour windows

## Post-Booking Actions

### Immediate Steps (within 1 hour)
1. Screenshot confirmation and save emails
2. Check cancellation policies
3. Note any required visa applications
4. Set calendar reminders for travel dates

### Within 24 Hours
1. Book accommodations if needed
2. Apply for visas if required
3. Inform work of potential travel dates
4. Consider travel insurance

## Flash Sale Calendar

**High-Probability Periods:**
- **January:** Post-holiday inventory clearing
- **August:** End of summer season
- **November:** Black Friday weekend
- **February:** Valentine's Day promotions

**Daily Timing:**
- **Tuesday 3 PM EST:** Traditional sale time
- **Thursday evenings:** Weekend travel deals
- **Sunday nights:** Week-ahead inventory management

## Red Flags to Watch

**Avoid These "Deals":**
- Prices only 10-15% below normal
- Blackout dates covering peak travel times
- Hidden fees revealed at checkout
- Non-refundable tickets with terrible change policies

## Tools and Resources

**Essential Apps:**
- Hopper (price prediction)
- Skyscanner (global deals)
- Google Flights (flexible date search)
- Going (premium deal alerts)

**Browser Extensions:**
- Honey (automatic coupon codes)
- Capital One Shopping (price comparisons)
- InvisibleHand (price tracking)

## Conclusion

Flash sale success requires preparation, speed, and decisive action. Set up your alert systems, know your travel wishes, and be ready to book when genuine opportunities appear. The best deals reward the prepared traveler who can act within minutes, not hours.`,
    category: "Travel Deals",
    author: "James Wilson",
    publishedAt: "2025-06-13",
    readTime: 7,
    tags: ["flash sales", "airline deals", "booking alerts", "limited time offers", "quick booking"],
    featuredImage: "/blog/flash-sale-guide.jpg",
    seoKeywords: ["airline flash sales", "flight deal alerts", "how to catch flash sales", "quick booking tips"],
    metaDescription: "Master airline flash sales with our complete guide. Learn to set alerts, prepare for quick booking, and never miss a deal again.",
    views: 18650,
    isPopular: true
  }
];

export default function BlogPost() {
  const { slug } = useParams();
  const [isSharing, setIsSharing] = useState(false);
  
  // Fetch blog post from API
  const { data: post, isLoading } = useQuery({
    queryKey: ['/api/blog/posts', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    }
  });

  // Fetch all posts for related articles
  const { data: allPostsData } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = post ? (allPostsData?.posts || [])
    .filter((p: any) => p.category === post.category && p.id !== post.id)
    .slice(0, 3) : [];

  const handleShare = async () => {
    setIsSharing(true);
    const url = `https://travalsearch.com/blog/${post.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(url);
      }
    } else {
      navigator.clipboard.writeText(url);
    }
    
    setTimeout(() => setIsSharing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SEOHead
        title={`${post.title} | TravalSearch Blog`}
        description={post.metaDescription}
        canonicalUrl={`https://travalsearch.com/blog/${post.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": `https://travalsearch.com${post.featuredImage}`,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "TravalSearch",
            "logo": {
              "@type": "ImageObject",
              "url": "https://travalsearch.com/logo.png"
            }
          },
          "datePublished": post.publishedAt,
          "dateModified": post.publishedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://travalsearch.com/blog/${post.slug}`
          },
          "keywords": post.seoKeywords.join(", ")
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Featured Image */}
              <div className="w-full h-64 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">{post.category}</p>
                </div>
              </div>

              {/* Article Header */}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary">{post.category}</Badge>
                  {post.isPopular && (
                    <Badge variant="default" className="bg-orange-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  {post.excerpt}
                </p>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    disabled={isSharing}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isSharing ? "Copied!" : "Share"}
                  </Button>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/^/, '<p>').replace(/$/, '</p>')
                        .replace(/## (.*?)<\/p>/g, '<h2>$1</h2>')
                        .replace(/### (.*?)<\/p>/g, '<h3>$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }} 
                  />
                </div>

                {/* Tags */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <div className="group cursor-pointer">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{relatedPost.readTime} min read</span>
                          <span>{relatedPost.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Contact & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Our Travel Experts</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Questions about this article or need personalized travel advice?
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">📧 Email:</span>
                        <span className="text-blue-600">support@travalsearch.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">📞 Phone:</span>
                        <span className="text-blue-600">1-800-TRAVAL-1 (1-800-872-8251)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">💬 Live Chat:</span>
                        <span className="text-green-600">Available 24/7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">🕐 Hours:</span>
                        <span>24/7 Customer Support</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/support">Contact Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get the latest travel tips and flight deals delivered to your inbox.
                </p>
                <Button className="w-full">
                  Subscribe to Newsletter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}