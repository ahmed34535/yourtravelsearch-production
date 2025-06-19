import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  User, 
  ShoppingCart, 
  Calendar, 
  Copy, 
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  Clock
} from 'lucide-react';

// Duffel Component Client Key Types
export interface DuffelComponentClientKey {
  component_client_key: string;
  created_at: string;
  expires_at?: string;
  scope: {
    type: 'unrestricted' | 'user_only' | 'user_and_order' | 'user_and_booking';
    user_id?: string;
    order_id?: string;
    booking_id?: string;
  };
}

export interface ComponentClientKeyUserOnlyPayload {
  user_id: string;
}

export interface ComponentClientKeyUserAndOrderPayload {
  user_id: string;
  order_id: string;
}

export interface ComponentClientKeyUserAndBookingPayload {
  user_id: string;
  booking_id: string;
}

// Component Client Key List Component
export function ComponentClientKeysList() {
  const [clientKeys, setClientKeys] = useState<DuffelComponentClientKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  // Mock data following Duffel specifications
  useEffect(() => {
    const mockClientKeys: DuffelComponentClientKey[] = [
      {
        component_client_key: process.env.VITE_DUFFEL_CLIENT_KEY_USER_ORDER || '[CLIENT_KEY_REQUIRED]',
        created_at: '2024-01-15T10:30:00Z',
        expires_at: '2024-01-15T11:30:00Z',
        scope: {
          type: 'user_and_order',
          user_id: 'icu_0000AgZitpOnQtd3NQxjwO',
          order_id: 'ord_0000ABdZnggSct7BoraU1o'
        }
      },
      {
        component_client_key: process.env.VITE_DUFFEL_CLIENT_KEY_USER_ONLY || '[CLIENT_KEY_REQUIRED]',
        created_at: '2024-01-15T09:15:00Z',
        scope: {
          type: 'user_only',
          user_id: 'icu_0000AgZitpOnQtd3NQxjwO'
        }
      },
      {
        component_client_key: process.env.VITE_DUFFEL_CLIENT_KEY_USER_BOOKING || '[CLIENT_KEY_REQUIRED]',
        created_at: '2024-01-15T08:45:00Z',
        expires_at: '2024-01-15T09:45:00Z',
        scope: {
          type: 'user_and_booking',
          user_id: 'icu_0000AgZitpOnQtd3NQxjwO',
          booking_id: 'bok_0000AcTKWKVb0RWQOUazJo'
        }
      },
      {
        component_client_key: process.env.VITE_DUFFEL_CLIENT_KEY_UNRESTRICTED || '[CLIENT_KEY_REQUIRED]',
        created_at: '2024-01-15T07:20:00Z',
        scope: {
          type: 'unrestricted'
        }
      }
    ];

    setTimeout(() => {
      setClientKeys(mockClientKeys);
      setIsLoading(false);
    }, 800);
  }, []);

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getScopeDisplay = (scope: DuffelComponentClientKey['scope']) => {
    switch (scope.type) {
      case 'unrestricted':
        return 'Unrestricted Access';
      case 'user_only':
        return `User: ${scope.user_id}`;
      case 'user_and_order':
        return `User + Order: ${scope.user_id} / ${scope.order_id}`;
      case 'user_and_booking':
        return `User + Booking: ${scope.user_id} / ${scope.booking_id}`;
      default:
        return 'Unknown Scope';
    }
  };

  const getScopeBadgeColor = (type: string) => {
    const colors = {
      'unrestricted': 'bg-red-100 text-red-800',
      'user_only': 'bg-blue-100 text-blue-800',
      'user_and_order': 'bg-green-100 text-green-800',
      'user_and_booking': 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isExpired = (expiresAt?: string) => {
    return expiresAt ? new Date(expiresAt) < new Date() : false;
  };

  const maskKey = (key: string) => {
    if (key.length <= 20) return '••••••••••••••••••••';
    return key.substring(0, 10) + '••••••••••••••••••••' + key.substring(key.length - 10);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : clientKeys.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No client keys found</h3>
            <p className="text-gray-500">Create your first component client key to get started.</p>
          </CardContent>
        </Card>
      ) : (
        clientKeys.map((clientKey, index) => (
          <Card key={index} className={isExpired(clientKey.expires_at) ? 'border-red-200 bg-red-50' : ''}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getScopeBadgeColor(clientKey.scope.type)}
                      >
                        {clientKey.scope.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {isExpired(clientKey.expires_at) && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {getScopeDisplay(clientKey.scope)}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>Created: {new Date(clientKey.created_at).toLocaleString()}</div>
                    {clientKey.expires_at && (
                      <div>Expires: {new Date(clientKey.expires_at).toLocaleString()}</div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Component Client Key</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-gray-100 p-2 rounded font-mono break-all">
                      {visibleKeys[clientKey.component_client_key] 
                        ? clientKey.component_client_key 
                        : maskKey(clientKey.component_client_key)
                      }
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleKeyVisibility(clientKey.component_client_key)}
                    >
                      {visibleKeys[clientKey.component_client_key] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(clientKey.component_client_key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {clientKey.scope.type !== 'unrestricted' && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {clientKey.scope.user_id && (
                        <div>
                          <Label className="text-xs text-gray-500">User ID</Label>
                          <p className="font-mono">{clientKey.scope.user_id}</p>
                        </div>
                      )}
                      {clientKey.scope.order_id && (
                        <div>
                          <Label className="text-xs text-gray-500">Order ID</Label>
                          <p className="font-mono">{clientKey.scope.order_id}</p>
                        </div>
                      )}
                      {clientKey.scope.booking_id && (
                        <div>
                          <Label className="text-xs text-gray-500">Booking ID</Label>
                          <p className="font-mono">{clientKey.scope.booking_id}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// Create Component Client Key Component
export function CreateComponentClientKey({ onKeyCreated }: { 
  onKeyCreated?: (clientKey: DuffelComponentClientKey) => void 
}) {
  const [keyType, setKeyType] = useState<'unrestricted' | 'user_only' | 'user_and_order' | 'user_and_booking'>('user_only');
  const [formData, setFormData] = useState({
    user_id: '',
    order_id: '',
    booking_id: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateKey = async () => {
    if (keyType !== 'unrestricted' && !formData.user_id) {
      setError('User ID is required for scoped keys');
      return;
    }
    
    if (keyType === 'user_and_order' && !formData.order_id) {
      setError('Order ID is required for user+order scope');
      return;
    }
    
    if (keyType === 'user_and_booking' && !formData.booking_id) {
      setError('Booking ID is required for user+booking scope');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newClientKey: DuffelComponentClientKey = {
        component_client_key: process.env.VITE_DUFFEL_CLIENT_KEY_GENERATED || `[GENERATED_CLIENT_KEY_${Date.now()}]`,
        created_at: new Date().toISOString(),
        expires_at: keyType !== 'unrestricted' ? new Date(Date.now() + 60 * 60 * 1000).toISOString() : undefined,
        scope: {
          type: keyType,
          user_id: formData.user_id || undefined,
          order_id: formData.order_id || undefined,
          booking_id: formData.booking_id || undefined
        }
      };

      onKeyCreated?.(newClientKey);
      setFormData({ user_id: '', order_id: '', booking_id: '' });
      setKeyType('user_only');
    } catch (err) {
      setError('Failed to create client key. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create Component Client Key</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Key Scope</Label>
          <Tabs value={keyType} onValueChange={(value) => setKeyType(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user_only">User Only</TabsTrigger>
              <TabsTrigger value="user_and_order">User + Order</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 mt-2">
              <TabsTrigger value="user_and_booking">User + Booking</TabsTrigger>
              <TabsTrigger value="unrestricted">Unrestricted</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {keyType !== 'unrestricted' && (
          <div>
            <Label htmlFor="user_id">User ID *</Label>
            <Input
              id="user_id"
              placeholder="icu_0000AgZitpOnQtd3NQxjwO"
              value={formData.user_id}
              onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
              disabled={isCreating}
            />
          </div>
        )}

        {keyType === 'user_and_order' && (
          <div>
            <Label htmlFor="order_id">Order ID *</Label>
            <Input
              id="order_id"
              placeholder="ord_0000ABdZnggSct7BoraU1o"
              value={formData.order_id}
              onChange={(e) => setFormData(prev => ({ ...prev, order_id: e.target.value }))}
              disabled={isCreating}
            />
          </div>
        )}

        {keyType === 'user_and_booking' && (
          <div>
            <Label htmlFor="booking_id">Booking ID *</Label>
            <Input
              id="booking_id"
              placeholder="bok_0000AcTKWKVb0RWQOUazJo"
              value={formData.booking_id}
              onChange={(e) => setFormData(prev => ({ ...prev, booking_id: e.target.value }))}
              disabled={isCreating}
            />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCreateKey}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Creating Client Key...
            </>
          ) : (
            <>
              <Key className="h-4 w-4 mr-2" />
              Create Client Key
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Main Demo Component
export function DuffelComponentClientKeysDemo() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleKeyCreated = (clientKey: DuffelComponentClientKey) => {
    console.log('New client key created:', clientKey);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Component Client Keys</h2>
        <p className="text-gray-600">
          Secure authentication tokens for Duffel UI components with scoped access control
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Component Client Keys provide secure, scoped authentication for Duffel UI components. 
          Keys can be restricted to specific users, orders, or bookings for enhanced security.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateComponentClientKey onKeyCreated={handleKeyCreated} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Component Client Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <ComponentClientKeysList key={refreshKey} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Security Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• JWT-based secure authentication</li>
                <li>• Scoped access control (user, order, booking)</li>
                <li>• Automatic expiration handling</li>
                <li>• Secure key visibility controls</li>
                <li>• Copy-to-clipboard functionality</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Key Types</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>User Only:</strong> Access to user-specific resources</li>
                <li>• <strong>User + Order:</strong> Scoped to specific order</li>
                <li>• <strong>User + Booking:</strong> Scoped to specific booking</li>
                <li>• <strong>Unrestricted:</strong> Full access (use with caution)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}