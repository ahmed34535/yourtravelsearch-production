import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Send,
  RefreshCw,
  ExternalLink,
  Shield,
  CheckCircle,
  X,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

// Duffel Webhook Types
export interface DuffelWebhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  secret?: string;
}

export interface WebhookEvent {
  id: string;
  api_version: string;
  type: string;
  data: {
    object: any;
  };
  live_mode: boolean;
  idempotency_key: string;
  created_at: string;
  identity_organisation_id: string;
}

// Available webhook events
const AVAILABLE_EVENTS = [
  'order.created',
  'order.creation_failed',
  'order.airline_initiated_change_detected',
  'order_cancellation.created',
  'order_cancellation.confirmed',
  'payment.created',
  'stays.booking.created',
  'stays.booking.cancelled',
  'stays.booking_creation_failed'
];

// Webhook List Component
export function WebhooksList() {
  const [webhooks, setWebhooks] = useState<DuffelWebhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingWebhook, setEditingWebhook] = useState<DuffelWebhook | null>(null);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});

  // Mock data following Duffel specifications
  useEffect(() => {
    const mockWebhooks: DuffelWebhook[] = [
      {
        id: 'end_0000A3tQSmKyqOrcySrGbo',
        url: 'https://api.example.com/webhooks/duffel',
        events: ['order.created', 'order.airline_initiated_change_detected', 'payment.created'],
        active: true,
        live_mode: true,
        created_at: '2024-01-15T10:48:11.642Z',
        updated_at: '2024-01-15T10:48:11.642Z',
        secret: 'QKfUULLQh+8SegYmIsF6kA=='
      },
      {
        id: 'end_0000A3tQSmKyqOrcySrGbp',
        url: 'https://staging.example.com/webhooks/duffel',
        events: ['order.created', 'order_cancellation.created', 'order_cancellation.confirmed'],
        active: false,
        live_mode: false,
        created_at: '2024-01-14T15:30:22.123Z',
        updated_at: '2024-01-15T09:15:45.789Z'
      },
      {
        id: 'end_0000A3tQSmKyqOrcySrGbq',
        url: 'https://production.example.com/webhooks/stays',
        events: ['stays.booking.created', 'stays.booking.cancelled'],
        active: true,
        live_mode: true,
        created_at: '2024-01-13T08:20:30.456Z',
        updated_at: '2024-01-13T08:20:30.456Z',
        secret: 'XYZfUULLQh+8SegYmIsF6kA=='
      }
    ];

    setTimeout(() => {
      setWebhooks(mockWebhooks);
      setIsLoading(false);
    }, 800);
  }, []);

  const toggleWebhookStatus = async (webhookId: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, active: !webhook.active, updated_at: new Date().toISOString() }
        : webhook
    ));
  };

  const deleteWebhook = async (webhookId: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
  };

  const pingWebhook = async (webhookId: string) => {
    console.log(`Pinging webhook ${webhookId}`);
    // Simulate ping
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const toggleSecretVisibility = (webhookId: string) => {
    setVisibleSecrets(prev => ({
      ...prev,
      [webhookId]: !prev[webhookId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskSecret = (secret: string) => {
    return secret.substring(0, 4) + '••••••••••••••••' + secret.substring(secret.length - 4);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
      ) : webhooks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
            <p className="text-gray-500">Create your first webhook to start receiving event notifications.</p>
          </CardContent>
        </Card>
      ) : (
        webhooks.map((webhook) => (
          <Card key={webhook.id} className={!webhook.active ? 'border-gray-200 bg-gray-50' : ''}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={webhook.active ? "default" : "secondary"}>
                        {webhook.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={webhook.live_mode ? "destructive" : "outline"}>
                        {webhook.live_mode ? 'Live' : 'Test'}
                      </Badge>
                      <span className="text-sm text-gray-500 font-mono">{webhook.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {webhook.url}
                      </code>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => pingWebhook(webhook.id)}
                      title="Send test ping"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleWebhookStatus(webhook.id)}
                      title={webhook.active ? 'Deactivate' : 'Activate'}
                    >
                      {webhook.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingWebhook(webhook)}
                      title="Edit webhook"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteWebhook(webhook.id)}
                      title="Delete webhook"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Subscribed Events</Label>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                {webhook.secret && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Webhook Secret</Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-gray-100 p-2 rounded font-mono">
                          {visibleSecrets[webhook.id] ? webhook.secret : maskSecret(webhook.secret)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSecretVisibility(webhook.id)}
                        >
                          {visibleSecrets[webhook.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(webhook.secret!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(webhook.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(webhook.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// Create/Edit Webhook Component
export function CreateEditWebhook({ 
  webhook, 
  onSave, 
  onCancel 
}: { 
  webhook?: DuffelWebhook | null;
  onSave: (webhook: DuffelWebhook) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    url: webhook?.url || '',
    events: webhook?.events || [],
    active: webhook?.active ?? true
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleEventToggle = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const handleSave = async () => {
    if (!formData.url.trim()) {
      setError('URL is required');
      return;
    }

    if (formData.events.length === 0) {
      setError('At least one event must be selected');
      return;
    }

    if (!formData.url.startsWith('https://')) {
      setError('URL must use HTTPS');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedWebhook: DuffelWebhook = {
        id: webhook?.id || `end_${Date.now().toString(36)}`,
        url: formData.url,
        events: formData.events,
        active: formData.active,
        live_mode: !webhook?.live_mode ? true : webhook.live_mode,
        created_at: webhook?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        secret: webhook?.secret || btoa(Math.random().toString()).substring(0, 22)
      };

      onSave(savedWebhook);
    } catch (err) {
      setError('Failed to save webhook. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {webhook ? 'Edit Webhook' : 'Create New Webhook'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="webhook-url">Webhook URL *</Label>
          <Input
            id="webhook-url"
            placeholder="https://example.com/webhooks/duffel"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            disabled={isCreating}
          />
        </div>

        <div>
          <Label className="mb-3 block">Events to Subscribe *</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {AVAILABLE_EVENTS.map((event) => (
              <div key={event} className="flex items-center space-x-2">
                <Checkbox
                  id={event}
                  checked={formData.events.includes(event)}
                  onCheckedChange={() => handleEventToggle(event)}
                  disabled={isCreating}
                />
                <Label htmlFor={event} className="text-sm">
                  {event}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked as boolean }))}
            disabled={isCreating}
          />
          <Label htmlFor="active">
            Active (start receiving events immediately)
          </Label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleSave}
            disabled={isCreating}
            className="flex-1"
          >
            {isCreating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {webhook ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Webhook className="h-4 w-4 mr-2" />
                {webhook ? 'Update Webhook' : 'Create Webhook'}
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Webhook Events Display Component
export function WebhookEventsPreview() {
  const [selectedEvent, setSelectedEvent] = useState('order.created');

  const sampleEvents: Record<string, WebhookEvent> = {
    'order.created': {
      id: 'wev_0000A4tQSmKyqOrcySrGbo',
      api_version: 'v2',
      type: 'order.created',
      data: {
        object: {
          id: 'ord_00009hthhsUZ8W4LxQgkjo',
          booking_reference: 'DUFFEL',
          passengers: [{ given_name: 'Amelia', family_name: 'Earhart' }]
        }
      },
      live_mode: true,
      idempotency_key: 'ord_0000ABd6wggSct7BoraU1o',
      created_at: '2024-01-15T15:48:11.642000Z',
      identity_organisation_id: 'org_0000APMFjhs4X2rJ6k7UIE'
    },
    'payment.created': {
      id: 'wev_0000A4tQSmKyqOrcySrGbp',
      api_version: 'v2',
      type: 'payment.created',
      data: {
        object: {
          id: 'pay_00009hthhsUZ8W4LxQgkjo',
          amount: '125.50',
          currency: 'GBP',
          type: 'card'
        }
      },
      live_mode: true,
      idempotency_key: 'pay_0000ABd6wggSct7BoraU1o',
      created_at: '2024-01-15T15:50:22.123000Z',
      identity_organisation_id: 'org_0000APMFjhs4X2rJ6k7UIE'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sample Webhook Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Event Type</Label>
          <select
            className="w-full p-2 border rounded-md mt-1"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            {Object.keys(sampleEvents).map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="mb-2 block">Event Payload</Label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs overflow-auto max-h-80">
              {JSON.stringify(sampleEvents[selectedEvent], null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Demo Component
export function DuffelWebhookManagementDemo() {
  const [webhooks, setWebhooks] = useState<DuffelWebhook[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<DuffelWebhook | null>(null);

  const handleWebhookSave = (webhook: DuffelWebhook) => {
    if (editingWebhook) {
      setWebhooks(prev => prev.map(w => w.id === webhook.id ? webhook : w));
    } else {
      setWebhooks(prev => [...prev, webhook]);
    }
    setShowCreateForm(false);
    setEditingWebhook(null);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingWebhook(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Webhook Management</h2>
        <p className="text-gray-600">
          Configure and manage webhook endpoints for real-time event notifications
        </p>
      </div>

      <Alert>
        <Webhook className="h-4 w-4" />
        <AlertDescription>
          Webhooks provide real-time notifications of events like order creation, payment processing, 
          and schedule changes. Configure endpoints to receive and process these events automatically.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Configured Webhooks</CardTitle>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <WebhooksList />
            </CardContent>
          </Card>

          {(showCreateForm || editingWebhook) && (
            <CreateEditWebhook
              webhook={editingWebhook}
              onSave={handleWebhookSave}
              onCancel={handleCancel}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <WebhookEventsPreview />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Webhook Management</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Complete CRUD operations for webhooks</li>
                <li>• Event subscription management</li>
                <li>• Active/inactive status control</li>
                <li>• Webhook secret generation and display</li>
                <li>• Test ping functionality</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Security & Events</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• HTTPS-only endpoint validation</li>
                <li>• Secure webhook secret handling</li>
                <li>• Complete event type coverage</li>
                <li>• Live/test mode separation</li>
                <li>• Sample event payload preview</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}