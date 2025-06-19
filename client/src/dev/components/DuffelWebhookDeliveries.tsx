import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Webhook, 
  CheckCircle, 
  X, 
  Clock, 
  Search, 
  Filter,
  RefreshCw,
  ExternalLink,
  Eye,
  Calendar
} from 'lucide-react';

// Duffel Webhook Delivery Types
export interface DuffelWebhookDelivery {
  id: string;
  endpoint_id: string;
  event_id: string;
  live_mode: boolean;
  created_at: string;
  type: string;
  url: string;
  response_status_code: number;
  response_body: string;
}

// Webhook Deliveries List Component
export function WebhookDeliveriesList() {
  const [deliveries, setDeliveries] = useState<DuffelWebhookDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    endpoint_id: '',
    delivery_success: 'all' as 'all' | 'success' | 'failed'
  });
  const [selectedDelivery, setSelectedDelivery] = useState<DuffelWebhookDelivery | null>(null);

  // Mock data following Duffel specifications
  useEffect(() => {
    const mockDeliveries: DuffelWebhookDelivery[] = [
      {
        id: 'del_0000A3tQSmKyqOrcySrGbo',
        endpoint_id: 'end_0000A3tQSmKyqOrcySrGbo',
        event_id: 'wev_0000A3tQSmKyqOrcySrGbo',
        live_mode: true,
        created_at: '2024-01-15T15:48:11.642Z',
        type: 'order.created',
        url: 'https://api.example.com/webhooks/duffel',
        response_status_code: 200,
        response_body: '{"status":"received","order_id":"ord_00009hthhsUZ8W4LxQgkjo"}'
      },
      {
        id: 'del_0000A3tQSmKyqOrcySrGbp',
        endpoint_id: 'end_0000A3tQSmKyqOrcySrGbo',
        event_id: 'wev_0000A3tQSmKyqOrcySrGbp',
        live_mode: true,
        created_at: '2024-01-15T14:32:22.123Z',
        type: 'order.payment_required',
        url: 'https://api.example.com/webhooks/duffel',
        response_status_code: 500,
        response_body: '{"error":"Internal server error","message":"Database connection failed"}'
      },
      {
        id: 'del_0000A3tQSmKyqOrcySrGbq',
        endpoint_id: 'end_0000A3tQSmKyqOrcySrGbr',
        event_id: 'wev_0000A3tQSmKyqOrcySrGbq',
        live_mode: false,
        created_at: '2024-01-15T13:15:45.789Z',
        type: 'order.cancelled',
        url: 'https://staging.example.com/webhooks/duffel',
        response_status_code: 200,
        response_body: '{}'
      },
      {
        id: 'del_0000A3tQSmKyqOrcySrGbs',
        endpoint_id: 'end_0000A3tQSmKyqOrcySrGbo',
        event_id: 'wev_0000A3tQSmKyqOrcySrGbs',
        live_mode: true,
        created_at: '2024-01-15T12:20:30.456Z',
        type: 'order.payment_succeeded',
        url: 'https://api.example.com/webhooks/duffel',
        response_status_code: 404,
        response_body: '{"error":"Not found","message":"Endpoint not configured"}'
      },
      {
        id: 'del_0000A3tQSmKyqOrcySrGbt',
        endpoint_id: 'end_0000A3tQSmKyqOrcySrGbs',
        event_id: 'wev_0000A3tQSmKyqOrcySrGbt',
        live_mode: true,
        created_at: '2024-01-15T11:05:18.321Z',
        type: 'order.updated',
        url: 'https://production.example.com/webhooks/duffel',
        response_status_code: 200,
        response_body: '{"acknowledged":true,"processed_at":"2024-01-15T11:05:20.123Z"}'
      }
    ];

    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesType = !filters.type || delivery.type.toLowerCase().includes(filters.type.toLowerCase());
    const matchesEndpoint = !filters.endpoint_id || delivery.endpoint_id.includes(filters.endpoint_id);
    const matchesSuccess = filters.delivery_success === 'all' ||
      (filters.delivery_success === 'success' && delivery.response_status_code >= 200 && delivery.response_status_code < 300) ||
      (filters.delivery_success === 'failed' && (delivery.response_status_code < 200 || delivery.response_status_code >= 300));
    
    return matchesType && matchesEndpoint && matchesSuccess;
  });

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge variant="destructive">Client Error</Badge>;
    } else if (statusCode >= 500) {
      return <Badge variant="destructive">Server Error</Badge>;
    } else {
      return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      'order.created': 'bg-blue-100 text-blue-800',
      'order.updated': 'bg-purple-100 text-purple-800',
      'order.cancelled': 'bg-red-100 text-red-800',
      'order.payment_required': 'bg-yellow-100 text-yellow-800',
      'order.payment_succeeded': 'bg-green-100 text-green-800',
      'order.payment_failed': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatResponseBody = (body: string) => {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Webhook Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="event_type">Event Type</Label>
              <Input
                id="event_type"
                placeholder="order.created, order.updated..."
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endpoint_id">Endpoint ID</Label>
              <Input
                id="endpoint_id"
                placeholder="end_0000A3tQSmKyqOrcySrGbo"
                value={filters.endpoint_id}
                onChange={(e) => setFilters(prev => ({ ...prev, endpoint_id: e.target.value }))}
              />
            </div>
            <div>
              <Label>Delivery Status</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.delivery_success}
                onChange={(e) => setFilters(prev => ({ ...prev, delivery_success: e.target.value as any }))}
              >
                <option value="all">All Deliveries</option>
                <option value="success">Successful</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ type: '', endpoint_id: '', delivery_success: 'all' })}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDeliveries.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later.</p>
              </CardContent>
            </Card>
          ) : (
            filteredDeliveries.map((delivery) => (
              <Card 
                key={delivery.id} 
                className={`cursor-pointer transition-colors ${
                  selectedDelivery?.id === delivery.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDelivery(delivery)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-mono text-sm">{delivery.id}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getEventTypeColor(delivery.type)}>
                            {delivery.type}
                          </Badge>
                          {getStatusBadge(delivery.response_status_code)}
                          {delivery.live_mode && (
                            <Badge variant="secondary">Live</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold">{delivery.response_status_code}</div>
                        <div className="text-gray-500">
                          {new Date(delivery.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1 mb-1">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate">{delivery.url}</span>
                      </div>
                      <div className="text-xs">
                        Endpoint: {delivery.endpoint_id}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delivery Details Panel */}
        <div className="lg:sticky lg:top-6">
          {selectedDelivery ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Delivery Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDelivery(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Delivery ID</Label>
                    <p className="font-mono text-sm">{selectedDelivery.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Event ID</Label>
                    <p className="font-mono text-sm">{selectedDelivery.event_id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Endpoint ID</Label>
                    <p className="font-mono text-sm">{selectedDelivery.endpoint_id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Status Code</Label>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedDelivery.response_status_code}</span>
                      {getStatusBadge(selectedDelivery.response_status_code)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-gray-500">Event Type</Label>
                  <Badge variant="outline" className={`${getEventTypeColor(selectedDelivery.type)} mt-1`}>
                    {selectedDelivery.type}
                  </Badge>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Delivery URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-gray-100 p-1 rounded break-all">
                      {selectedDelivery.url}
                    </code>
                    <Button size="sm" variant="ghost" className="p-1">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Created At</Label>
                  <p className="text-sm">
                    {new Date(selectedDelivery.created_at).toLocaleString()}
                  </p>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Response Body</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-60">
                      {formatResponseBody(selectedDelivery.response_body)}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Delivery
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a delivery</h3>
                <p className="text-gray-500">Click on any delivery to view its details and response.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Webhook Delivery Stats Component
export function WebhookDeliveryStats() {
  const [stats, setStats] = useState({
    total_deliveries: 0,
    successful_deliveries: 0,
    failed_deliveries: 0,
    success_rate: 0,
    most_common_event: '',
    most_recent_delivery: ''
  });

  useEffect(() => {
    // Mock stats calculation
    setTimeout(() => {
      setStats({
        total_deliveries: 1247,
        successful_deliveries: 1186,
        failed_deliveries: 61,
        success_rate: 95.1,
        most_common_event: 'order.created',
        most_recent_delivery: '2 minutes ago'
      });
    }, 500);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.total_deliveries.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Deliveries</p>
            </div>
            <Webhook className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.successful_deliveries.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Successful</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.failed_deliveries.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
            <X className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.success_rate}%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Demo Component
export function DuffelWebhookDeliveriesDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Webhook Deliveries</h2>
        <p className="text-gray-600">
          Monitor and manage webhook delivery status, responses, and retry mechanisms
        </p>
      </div>

      <Alert>
        <Webhook className="h-4 w-4" />
        <AlertDescription>
          This system tracks all webhook deliveries to your endpoints, including success/failure status, 
          response details, and provides retry capabilities for failed deliveries.
        </AlertDescription>
      </Alert>

      <WebhookDeliveryStats />

      <Card>
        <CardHeader>
          <CardTitle>Webhook Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <WebhookDeliveriesList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Duffel Compliance</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Complete webhook delivery tracking</li>
                <li>• Response status code monitoring</li>
                <li>• Event type filtering and organization</li>
                <li>• Endpoint-specific delivery management</li>
                <li>• Live mode and test mode separation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Monitoring Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Real-time delivery status tracking</li>
                <li>• Detailed response body inspection</li>
                <li>• Success rate analytics</li>
                <li>• Failed delivery identification</li>
                <li>• Retry mechanism support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}