import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link2, Unlink, CheckCircle, AlertCircle, Chrome } from "lucide-react";
import { FaGoogle, FaFacebook, FaApple, FaTwitter, FaMicrosoft } from "react-icons/fa";

interface SocialAccount {
  provider: string;
  providerId: string;
  email: string;
  isConnected: boolean;
  connectedAt: string;
}

export default function SocialLoginManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);

  // Connect social account mutation
  const connectSocialMutation = useMutation({
    mutationFn: (provider: string) => {
      // In a real implementation, this would redirect to OAuth provider
      return apiRequest('POST', `/api/auth/social/connect/${provider}`);
    },
    onSuccess: (data, provider) => {
      toast({
        title: "Account Connected",
        description: `Your ${provider} account has been successfully connected.`,
      });
      setConnecting(null);
    },
    onError: (error, provider) => {
      toast({
        title: "Connection Failed",
        description: `Failed to connect your ${provider} account. Please try again.`,
        variant: "destructive",
      });
      setConnecting(null);
    },
  });

  // Disconnect social account mutation
  const disconnectSocialMutation = useMutation({
    mutationFn: (provider: string) => apiRequest('DELETE', `/api/auth/social/disconnect/${provider}`),
    onSuccess: (data, provider) => {
      toast({
        title: "Account Disconnected",
        description: `Your ${provider} account has been disconnected.`,
      });
    },
    onError: (error, provider) => {
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect your ${provider} account. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleConnect = (provider: string) => {
    setConnecting(provider);
    // In a real implementation, this would redirect to OAuth provider
    window.location.href = `/api/auth/social/${provider}`;
  };

  const handleDisconnect = (provider: string) => {
    disconnectSocialMutation.mutate(provider);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return <FaGoogle className="h-5 w-5" />;
      case 'facebook':
        return <FaFacebook className="h-5 w-5" />;
      case 'apple':
        return <FaApple className="h-5 w-5" />;
      case 'twitter':
        return <FaTwitter className="h-5 w-5" />;
      case 'microsoft':
        return <FaMicrosoft className="h-5 w-5" />;
      default:
        return <Chrome className="h-5 w-5" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return 'text-red-600 bg-red-50 hover:bg-red-100';
      case 'facebook':
        return 'text-blue-600 bg-blue-50 hover:bg-blue-100';
      case 'apple':
        return 'text-gray-800 bg-gray-50 hover:bg-gray-100';
      case 'twitter':
        return 'text-blue-500 bg-blue-50 hover:bg-blue-100';
      case 'microsoft':
        return 'text-blue-700 bg-blue-50 hover:bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-50 hover:bg-gray-100';
    }
  };

  // Mock social accounts data - in real implementation, this would come from API
  const socialAccounts: SocialAccount[] = [
    {
      provider: 'Google',
      providerId: 'google_123456789',
      email: user?.email || '',
      isConnected: false,
      connectedAt: '',
    },
    {
      provider: 'Facebook',
      providerId: 'facebook_987654321',
      email: user?.email || '',
      isConnected: false,
      connectedAt: '',
    },
    {
      provider: 'Apple',
      providerId: 'apple_456789123',
      email: user?.email || '',
      isConnected: false,
      connectedAt: '',
    },
    {
      provider: 'Microsoft',
      providerId: 'microsoft_789123456',
      email: user?.email || '',
      isConnected: false,
      connectedAt: '',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Social Login Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Connect your social media accounts for faster login and enhanced features
        </p>
      </div>

      <div className="grid gap-4">
        {socialAccounts.map((account) => (
          <Card key={account.provider} className="relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getProviderColor(account.provider)}`}>
                    {getProviderIcon(account.provider)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{account.provider}</p>
                      {account.isConnected && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    {account.isConnected ? (
                      <div>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Connected {new Date(account.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Connect your {account.provider} account for faster login
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  {account.isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(account.provider.toLowerCase())}
                      disabled={disconnectSocialMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Unlink className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(account.provider.toLowerCase())}
                      disabled={connecting === account.provider.toLowerCase()}
                      className={getProviderColor(account.provider)}
                    >
                      <Link2 className="h-4 w-4 mr-1" />
                      {connecting === account.provider.toLowerCase() ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base text-blue-800">Benefits of Social Login</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Faster login without remembering passwords</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Enhanced security with two-factor authentication</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Sync profile information automatically</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Share travel experiences with friends</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-amber-800 mb-1">Privacy & Security</h4>
              <ul className="text-amber-700 space-y-1">
                <li>• We only access basic profile information (name, email)</li>
                <li>• Your social media posts and private data remain private</li>
                <li>• You can disconnect accounts at any time</li>
                <li>• We never post to your social media without permission</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Sharing Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Features</CardTitle>
          <CardDescription>Share your travel experiences with friends and family</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Trip Sharing</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Share your upcoming trips and get recommendations from friends
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Travel Reviews</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Write and share reviews of places you've visited
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Photo Albums</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Create and share photo albums from your travels
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Group Planning</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Plan trips together with friends and family
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}