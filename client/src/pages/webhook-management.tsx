import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, TestTube, Eye, EyeOff, Copy } from 'lucide-react';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  created_at: string;
  last_ping?: string;
  success_count: number;
  failure_count: number;
}

const AVAILABLE_EVENTS = [
  { id: 'order.created', name: 'Order Created', description: 'Triggered when a new order is created' },
  { id: 'order.payment_required', name: 'Payment Required', description: 'Triggered when payment is required for an order' },
  { id: 'order.confirmed', name: 'Order Confirmed', description: 'Triggered when an order is confirmed' },
  { id: 'order.cancelled', name: 'Order Cancelled', description: 'Triggered when an order is cancelled' },
  { id: 'order.changed', name: 'Order Changed', description: 'Triggered when an order is modified' },
  { id: 'payment.succeeded', name: 'Payment Succeeded', description: 'Triggered when a payment is successful' },
  { id: 'payment.failed', name: 'Payment Failed', description: 'Triggered when a payment fails' },
  { id: 'stays.booking.created', name: 'Hotel Booking Created', description: 'Triggered when a hotel booking is created' },
  { id: 'stays.booking.confirmed', name: 'Hotel Booking Confirmed', description: 'Triggered when a hotel booking is confirmed' },
  { id: 'stays.booking.cancelled', name: 'Hotel Booking Cancelled', description: 'Triggered when a hotel booking is cancelled' },
];

export default function WebhookManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[],
    active: true,
  });
  const [secretVisibility, setSecretVisibility] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['/api/webhooks'],
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (webhookData: typeof newWebhook) => {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });
      if (!response.ok) throw new Error('Failed to create webhook');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
      setShowCreateForm(false);
      setNewWebhook({ url: '', events: [], active: true });
      toast({ title: 'Webhook created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to create webhook', description: error.message, variant: 'destructive' });
    },
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (webhookId: string) => {
      const response = await fetch(`/api/webhooks/${webhookId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete webhook');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
      toast({ title: 'Webhook deleted successfully' });
    },
  });

  const toggleWebhookMutation = useMutation({
    mutationFn: async ({ webhookId, active }: { webhookId: string; active: boolean }) => {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) throw new Error('Failed to update webhook');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
      toast({ title: 'Webhook updated successfully' });
    },
  });

  const testWebhookMutation = useMutation({
    mutationFn: async (webhookId: string) => {
      const response = await fetch(`/api/webhooks/${webhookId}/test`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to test webhook');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Test webhook sent successfully' });
    },
  });

  const handleEventToggle = (eventId: string, checked: boolean) => {
    setNewWebhook(prev => ({
      ...prev,
      events: checked 
        ? [...prev.events, eventId]
        : prev.events.filter(e => e !== eventId)
    }));
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast({ title: 'Secret copied to clipboard' });
  };

  const toggleSecretVisibility = (webhookId: string) => {
    setSecretVisibility(prev => ({
      ...prev,
      [webhookId]: !prev[webhookId]
    }));
  };

  const validateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && !parsed.hostname.includes('localhost');
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading webhooks...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Webhook Management</h1>
          <p className="text-gray-600 mt-2">
            Configure webhooks to receive real-time notifications about booking events
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Webhook
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Webhook</CardTitle>
            <CardDescription>
              Configure a webhook endpoint to receive event notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://www.example.com/webhook"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                className={!validateUrl(newWebhook.url) && newWebhook.url ? 'border-red-500' : ''}
              />
              <p className="text-sm text-gray-500 mt-1">
                Must be HTTPS. We do not accept IP addresses or localhost URLs.
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">Events to listen to</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {AVAILABLE_EVENTS.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={event.id}
                      checked={newWebhook.events.includes(event.id)}
                      onCheckedChange={(checked) => handleEventToggle(event.id, !!checked)}
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={event.id} className="text-sm font-medium cursor-pointer">
                        {event.name}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="webhook-active"
                checked={newWebhook.active}
                onCheckedChange={(checked) => setNewWebhook(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="webhook-active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createWebhookMutation.mutate(newWebhook)}
                disabled={!validateUrl(newWebhook.url) || newWebhook.events.length === 0 || createWebhookMutation.isPending}
              >
                {createWebhookMutation.isPending ? 'Creating...' : 'Create Webhook'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {webhooks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No webhooks configured yet</p>
              <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                Create your first webhook
              </Button>
            </CardContent>
          </Card>
        ) : (
          webhooks.map((webhook: Webhook) => (
            <Card key={webhook.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-lg">{webhook.url}</h3>
                      <Badge variant={webhook.active ? "default" : "secondary"}>
                        {webhook.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created {new Date(webhook.created_at).toLocaleDateString()}
                      {webhook.last_ping && ` • Last ping: ${new Date(webhook.last_ping).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.active}
                      onCheckedChange={(checked) => 
                        toggleWebhookMutation.mutate({ webhookId: webhook.id, active: checked })
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testWebhookMutation.mutate(webhook.id)}
                      disabled={testWebhookMutation.isPending}
                    >
                      <TestTube className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWebhookMutation.mutate(webhook.id)}
                      disabled={deleteWebhookMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Webhook Secret</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type={secretVisibility[webhook.id] ? "text" : "password"}
                        value={webhook.secret}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecretVisibility(webhook.id)}
                      >
                        {secretVisibility[webhook.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copySecret(webhook.secret)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Subscribed Events</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {webhook.events.map((eventId) => {
                        const event = AVAILABLE_EVENTS.find(e => e.id === eventId);
                        return (
                          <Badge key={eventId} variant="outline">
                            {event?.name || eventId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {webhook.success_count} successful deliveries
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {webhook.failure_count} failed deliveries
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}