import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Check URL for signup-to-book message
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get('message');
  const isSignupToBook = message === 'signup-to-book';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await login(formData.email, formData.password, rememberMe);
      
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        // Set session expiration based on remember me
        if (rememberMe) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30); // 30 days
          localStorage.setItem('sessionExpiration', expirationDate.toISOString());
        } else {
          // Session expires when browser closes (no expiration set)
          localStorage.removeItem('sessionExpiration');
        }
        
        // Check for pending booking after successful login
        const pendingBooking = localStorage.getItem('pendingBooking');
        if (pendingBooking) {
          localStorage.removeItem('pendingBooking');
          const bookingData = JSON.parse(pendingBooking);
          setLocation(bookingData.returnUrl);
          return;
        }
        
        // Redirect based on user type
        if (formData.email.includes("admin@")) {
          setLocation("/admin-dashboard");
        } else {
          setLocation("/profile");
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try demo@travalsearch.com / demo123 or admin@yourtravelsearch.com / admin123",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      if (response.ok) {
        setResetSent(true);
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions.",
        });
      } else {
        toast({
          title: "Reset failed",
          description: "Please check your email address and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignupToBook ? "Sign up to book your flight" : "Welcome back"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isSignupToBook 
              ? "Create an account or sign in to complete your flight booking"
              : "Sign in to your YourTravelSearch account"
            }
          </p>
          {isSignupToBook && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                ✈️ Your selected flight is saved. Complete signup to proceed with booking.
              </p>
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">Remember me (30 days)</span>
                </label>
                <button 
                  type="button" 
                  className="text-sm text-travel-blue hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-travel-blue hover:bg-travel-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 space-y-1">
              <div>Quick Login Options:</div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={async () => {
                  try {
                    const success = await login("demo@travalsearch.com", "demo123");
                    if (success) {
                      toast({
                        title: "Welcome back!",
                        description: "You have successfully logged in as demo user.",
                      });
                      setLocation("/profile");
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Something went wrong. Please try again.",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Login as Demo User
              </Button>
              <Button
                variant="outline"
                className="w-full bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                onClick={async () => {
                  try {
                    const success = await login("admin@yourtravelsearch.com", "admin123");
                    if (success) {
                      toast({
                        title: "Admin access granted!",
                        description: "Welcome to the admin dashboard.",
                      });
                      setLocation("/admin-dashboard");
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Something went wrong. Please try again.",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Login as Admin
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("Google")}
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("Facebook")}
              >
                Continue with Facebook
              </Button>
            </div>

            <Separator />
            
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600">New to YourTravelSearch?</div>
              <Button
                variant="default"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3"
                onClick={() => setLocation("/register")}
              >
                Create New Account
              </Button>
              <div className="text-xs text-gray-500">
                Join thousands of travelers • Free to sign up • Start booking in minutes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {!resetSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email address</Label>
                <div className="relative">
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-travel-blue hover:bg-travel-blue-dark">
                  Send Reset Link
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <Mail className="w-16 h-16 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Check your email</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We've sent a password reset link to {resetEmail}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                    setResetEmail("");
                  }}
                  className="w-full bg-travel-blue hover:bg-travel-blue-dark"
                >
                  Back to Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setResetSent(false)}
                  className="w-full"
                >
                  Send Another Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}