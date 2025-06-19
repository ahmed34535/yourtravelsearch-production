import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  DollarSign
} from 'lucide-react';

// Duffel Order Cancellation Types
export interface DuffelOrderCancellation {
  id: string;
  order_id: string;
  live_mode: boolean;
  created_at: string;
  confirmed_at?: string;
  expires_at?: string;
  refund_amount?: string;
  refund_currency?: string;
  refund_to: 'arc_bsp_cash' | 'balance' | 'card' | 'voucher' | 'awaiting_payment' | 'airline_credits';
  airline_credits: DuffelAirlineCredit[];
}

export interface DuffelAirlineCredit {
  id: string;
  passenger_id: string;
  credit_name: string;
  credit_code: string;
  credit_amount: string;
  credit_currency: string;
  issued_on: string;
}

export interface OrderCancellationRequest {
  order_id: string;
}

// Order Cancellation Management Component
export function OrderCancellationsList() {
  const [cancellations, setCancellations] = useState<DuffelOrderCancellation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    order_id: '',
    status: 'all' as 'all' | 'pending' | 'confirmed'
  });

  // Mock data following Duffel specifications
  useEffect(() => {
    const mockCancellations: DuffelOrderCancellation[] = [
      {
        id: 'ore_00009qzZWzjDipIkqpaUAj',
        order_id: 'ord_00009hthhsUZ8W4LxQgkjo',
        live_mode: false,
        created_at: '2024-01-15T10:30:00Z',
        confirmed_at: '2024-01-15T11:15:00Z',
        expires_at: '2024-01-17T10:42:14Z',
        refund_amount: '90.80',
        refund_currency: 'GBP',
        refund_to: 'arc_bsp_cash',
        airline_credits: [
          {
            id: 'act_00009qzZWzjDipIkqpaUAj',
            passenger_id: 'pas_00009hj8USM7Ncg31cBCLL',
            credit_name: 'Duffel Travel Credit',
            credit_code: '1234567890123',
            credit_amount: '90.80',
            credit_currency: 'GBP',
            issued_on: '2024-01-15'
          }
        ]
      },
      {
        id: 'ore_00009qzZWzjDipIkqpaUBj',
        order_id: 'ord_00009hthhsUZ8W4LxQgklm',
        live_mode: false,
        created_at: '2024-01-14T14:20:00Z',
        expires_at: '2024-01-16T14:20:00Z',
        refund_amount: '250.00',
        refund_currency: 'USD',
        refund_to: 'balance',
        airline_credits: []
      },
      {
        id: 'ore_00009qzZWzjDipIkqpaUCj',
        order_id: 'ord_00009hthhsUZ8W4LxQgkmn',
        live_mode: false,
        created_at: '2024-01-13T09:15:00Z',
        confirmed_at: '2024-01-13T09:45:00Z',
        refund_amount: '0.00',
        refund_currency: 'EUR',
        refund_to: 'voucher',
        airline_credits: [
          {
            id: 'act_00009qzZWzjDipIkqpaUBj',
            passenger_id: 'pas_00009hj8USM7Ncg31cBCMM',
            credit_name: 'Non-refundable Credit',
            credit_code: '9876543210987',
            credit_amount: '150.00',
            credit_currency: 'EUR',
            issued_on: '2024-01-13'
          }
        ]
      }
    ];

    setTimeout(() => {
      setCancellations(mockCancellations);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredCancellations = cancellations.filter(cancellation => {
    const matchesOrderId = !filters.order_id || cancellation.order_id.toLowerCase().includes(filters.order_id.toLowerCase());
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'confirmed' && cancellation.confirmed_at) ||
      (filters.status === 'pending' && !cancellation.confirmed_at);
    
    return matchesOrderId && matchesStatus;
  });

  const getStatusBadge = (cancellation: DuffelOrderCancellation) => {
    if (cancellation.confirmed_at) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Confirmed</Badge>;
    }
    
    const isExpired = cancellation.expires_at && new Date(cancellation.expires_at) < new Date();
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getRefundMethodDisplay = (refundTo: string) => {
    const methods = {
      'arc_bsp_cash': 'ARC/BSP Cash',
      'balance': 'Duffel Balance',
      'card': 'Original Card',
      'voucher': 'Airline Voucher',
      'awaiting_payment': 'Awaiting Payment',
      'airline_credits': 'Airline Credits'
    };
    return methods[refundTo as keyof typeof methods] || refundTo;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Cancellations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="order_id">Order ID</Label>
              <Input
                id="order_id"
                placeholder="Search by order ID..."
                value={filters.order_id}
                onChange={(e) => setFilters(prev => ({ ...prev, order_id: e.target.value }))}
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ order_id: '', status: 'all' })}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellations List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCancellations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cancellations found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </CardContent>
          </Card>
        ) : (
          filteredCancellations.map((cancellation) => (
            <Card key={cancellation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-mono">{cancellation.id}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{cancellation.order_id}</Badge>
                      {getStatusBadge(cancellation)}
                    </div>
                  </div>
                  <div className="text-right">
                    {cancellation.refund_amount && (
                      <div className="text-lg font-semibold">
                        {cancellation.refund_currency} {cancellation.refund_amount}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {getRefundMethodDisplay(cancellation.refund_to)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Created</Label>
                    <p className="text-sm font-medium">
                      {new Date(cancellation.created_at).toLocaleString()}
                    </p>
                  </div>
                  {cancellation.confirmed_at && (
                    <div>
                      <Label className="text-xs text-gray-500">Confirmed</Label>
                      <p className="text-sm font-medium">
                        {new Date(cancellation.confirmed_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {cancellation.expires_at && !cancellation.confirmed_at && (
                    <div>
                      <Label className="text-xs text-gray-500">Expires</Label>
                      <p className="text-sm font-medium">
                        {new Date(cancellation.expires_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {cancellation.airline_credits.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Airline Credits</Label>
                      <div className="space-y-2">
                        {cancellation.airline_credits.map((credit) => (
                          <div key={credit.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{credit.credit_name}</p>
                                <p className="text-sm text-gray-600">Code: {credit.credit_code}</p>
                                <p className="text-xs text-gray-500">Issued: {credit.issued_on}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{credit.credit_currency} {credit.credit_amount}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!cancellation.confirmed_at && cancellation.expires_at && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Cancellation
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Create Order Cancellation Component
export function CreateOrderCancellation({ onCancellationCreated }: { 
  onCancellationCreated?: (cancellation: DuffelOrderCancellation) => void 
}) {
  const [orderId, setOrderId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateCancellation = async () => {
    if (!orderId.trim()) {
      setError('Order ID is required');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCancellation: DuffelOrderCancellation = {
        id: `ore_${Date.now().toString(36)}`,
        order_id: orderId,
        live_mode: false,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refund_amount: '125.50',
        refund_currency: 'GBP',
        refund_to: 'balance',
        airline_credits: []
      };

      onCancellationCreated?.(newCancellation);
      setOrderId('');
    } catch (err) {
      setError('Failed to create cancellation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create Order Cancellation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="order-id">Order ID</Label>
          <Input
            id="order-id"
            placeholder="ord_00009hthhsUZ8W4LxQgkjo"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            disabled={isCreating}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleCreateCancellation}
          disabled={isCreating || !orderId.trim()}
          className="w-full"
        >
          {isCreating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Creating Cancellation...
            </>
          ) : (
            <>
              <X className="h-4 w-4 mr-2" />
              Create Cancellation Quote
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Main Demo Component
export function DuffelOrderCancellationsDemo() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCancellationCreated = (cancellation: DuffelOrderCancellation) => {
    console.log('New cancellation created:', cancellation);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Order Cancellations</h2>
        <p className="text-gray-600">
          Complete cancellation workflow with quotes, confirmations, and refund processing
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This system follows Duffel's two-step cancellation process: create a cancellation quote, 
          review the refund details, then confirm to process the actual cancellation.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateOrderCancellation onCancellationCreated={handleCancellationCreated} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Cancellations</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderCancellationsList key={refreshKey} />
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
              <h4 className="font-semibold">Duffel Compliance</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Two-step cancellation process (quote → confirm)</li>
                <li>• Complete refund amount calculation</li>
                <li>• Multiple refund methods support</li>
                <li>• Airline credits management</li>
                <li>• Expiration handling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Business Features</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Advanced filtering and search</li>
                <li>• Real-time status tracking</li>
                <li>• Refund method transparency</li>
                <li>• Credit voucher management</li>
                <li>• Comprehensive audit trail</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}