import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plane, 
  Mail, 
  ArrowRight, 
  Download,
  Smartphone,
  Zap,
  Gift
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeNewsletter = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Subscribed Successfully!",
        description: "You'll receive our latest travel deals and updates.",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    subscribeNewsletter.mutate(email);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Try Booking Without the Headaches
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Search, compare, and book flights the way it should work. 
            What you see is what you pay. No tricks, no gotchas, no phone trees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
              <Plane className="h-5 w-5 mr-2" />
              Search Flights Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              See How It Works
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Mail className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Get Flight Deal Alerts
              </h3>
              <p className="text-blue-100">
                Get notified when prices drop on routes you're interested in. 
                We'll send weekly updates with the best deals we find.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={subscribeNewsletter.isPending}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 whitespace-nowrap disabled:opacity-50"
                >
                  {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe Now"}
                </Button>
              </div>
              <p className="text-xs text-blue-200 mt-3 text-center">
                No spam. Unsubscribe anytime. Privacy policy applies.
              </p>
            </form>
          </CardContent>
        </Card>



      </div>
    </section>
  );
}