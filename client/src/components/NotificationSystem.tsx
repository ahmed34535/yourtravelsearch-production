import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  BellRing, 
  Plane, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Settings,
  Smartphone,
  Mail,
  Volume2,
  X,
  Eye,
  EyeOff
} from "lucide-react";

interface Notification {
  id: string;
  type: 'flight_delay' | 'gate_change' | 'price_drop' | 'booking_confirmation' | 'check_in_reminder' | 'deal_alert' | 'weather_alert' | 'document_reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  bookingReference?: string;
  flightNumber?: string;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  flightUpdates: boolean;
  priceAlerts: boolean;
  dealNotifications: boolean;
  bookingReminders: boolean;
  weatherAlerts: boolean;
  documentReminders: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  frequency: 'instant' | 'hourly' | 'daily';
}

interface PriceAlert {
  id: string;
  route: string;
  origin: string;
  destination: string;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export default function NotificationSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [newPriceAlert, setNewPriceAlert] = useState({
    origin: "",
    destination: "",
    targetPrice: "",
    departureDate: "",
  });

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch notification preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['/api/notification-preferences'],
    enabled: !!user,
  });

  // Fetch price alerts
  const { data: priceAlerts = [] } = useQuery({
    queryKey: ['/api/price-alerts'],
    enabled: !!user,
  });

  // Update notification preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (prefs: Partial<NotificationPreferences>) => {
      return apiRequest('PATCH', '/api/notification-preferences', prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-preferences'] });
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });
    },
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest('PATCH', `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Create price alert
  const createPriceAlertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      return apiRequest('POST', '/api/price-alerts', alertData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/price-alerts'] });
      setNewPriceAlert({ origin: "", destination: "", targetPrice: "", departureDate: "" });
      toast({
        title: "Price Alert Created",
        description: "We'll notify you when the price drops to your target.",
      });
    },
  });

  // Delete price alert
  const deletePriceAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('DELETE', `/api/price-alerts/${alertId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/price-alerts'] });
      toast({
        title: "Price Alert Deleted",
        description: "Price alert has been removed.",
      });
    },
  });

  // Request notification permissions
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive real-time notifications.",
        });
      }
    }
  };

  // Mock data for demonstration
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "flight_delay",
      title: "Flight Delay Alert",
      message: "Your flight AA1234 from LAX to JFK has been delayed by 45 minutes. New departure time: 3:45 PM.",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isRead: false,
      priority: "high",
      flightNumber: "AA1234",
      bookingReference: "ABC123"
    },
    {
      id: "2",
      type: "gate_change",
      title: "Gate Change",
      message: "Gate changed for flight UA567 from Gate B12 to Gate A8. Boarding starts in 30 minutes.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      isRead: false,
      priority: "medium",
      flightNumber: "UA567"
    },
    {
      id: "3",
      type: "price_drop",
      title: "Price Drop Alert",
      message: "Great news! The price for LAX → NYC flights dropped to $284. Book now to save $56!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: "medium",
      actionUrl: "/flights?origin=LAX&destination=NYC"
    },
    {
      id: "4",
      type: "check_in_reminder",
      title: "Check-in Reminder",
      message: "Don't forget to check in for your flight tomorrow! Check-in opens 24 hours before departure.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: "low",
      bookingReference: "XYZ789"
    },
    {
      id: "5",
      type: "booking_confirmation",
      title: "Booking Confirmed",
      message: "Your booking ABC123 has been confirmed. Flight details and boarding passes have been emailed to you.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: "high",
      bookingReference: "ABC123"
    }
  ];

  const mockPreferences: NotificationPreferences = {
    email: true,
    push: true,
    sms: false,
    inApp: true,
    flightUpdates: true,
    priceAlerts: true,
    dealNotifications: true,
    bookingReminders: true,
    weatherAlerts: false,
    documentReminders: true,
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    frequency: "instant"
  };

  const mockPriceAlerts: PriceAlert[] = [
    {
      id: "1",
      route: "LAX → JFK",
      origin: "LAX",
      destination: "JFK",
      targetPrice: 300,
      currentPrice: 340,
      isActive: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      route: "SFO → LHR",
      origin: "SFO",
      destination: "LHR",
      targetPrice: 650,
      currentPrice: 720,
      isActive: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'flight_delay':
      case 'gate_change':
        return <Plane className="h-4 w-4" />;
      case 'price_drop':
      case 'deal_alert':
        return <DollarSign className="h-4 w-4" />;
      case 'check_in_reminder':
      case 'booking_confirmation':
        return <CheckCircle className="h-4 w-4" />;
      case 'weather_alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'document_reminder':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'low':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diff = now.getTime() - notificationTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Stay updated with real-time travel notifications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={requestNotificationPermission}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Enable Push
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Notification Preferences</DialogTitle>
                <DialogDescription>
                  Customize how and when you receive notifications
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="channels" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="channels">Channels</TabsTrigger>
                  <TabsTrigger value="types">Types</TabsTrigger>
                  <TabsTrigger value="timing">Timing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="channels" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label>Email Notifications</Label>
                      </div>
                      <Switch 
                        checked={mockPreferences.email}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ email: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <Label>Push Notifications</Label>
                      </div>
                      <Switch 
                        checked={mockPreferences.push}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ push: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <Label>SMS Notifications</Label>
                      </div>
                      <Switch 
                        checked={mockPreferences.sms}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ sms: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label>In-App Notifications</Label>
                      </div>
                      <Switch 
                        checked={mockPreferences.inApp}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ inApp: checked })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="types" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Flight Updates (delays, gate changes)</Label>
                      <Switch 
                        checked={mockPreferences.flightUpdates}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ flightUpdates: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Price Alerts</Label>
                      <Switch 
                        checked={mockPreferences.priceAlerts}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ priceAlerts: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Deal Notifications</Label>
                      <Switch 
                        checked={mockPreferences.dealNotifications}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ dealNotifications: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Booking Reminders</Label>
                      <Switch 
                        checked={mockPreferences.bookingReminders}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ bookingReminders: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Weather Alerts</Label>
                      <Switch 
                        checked={mockPreferences.weatherAlerts}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ weatherAlerts: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Document Reminders</Label>
                      <Switch 
                        checked={mockPreferences.documentReminders}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ documentReminders: checked })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="timing" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Notification Frequency</Label>
                      <Select value={mockPreferences.frequency}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instant</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Quiet Hours</Label>
                      <Switch 
                        checked={mockPreferences.quietHoursEnabled}
                        onCheckedChange={(checked) => 
                          updatePreferencesMutation.mutate({ quietHoursEnabled: checked })
                        }
                      />
                    </div>
                    
                    {mockPreferences.quietHoursEnabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input 
                            type="time" 
                            value={mockPreferences.quietHoursStart}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input 
                            type="time" 
                            value={mockPreferences.quietHoursEnd}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Notifications</TabsTrigger>
          <TabsTrigger value="price-alerts">Price Alerts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Recent Notifications */}
        <TabsContent value="recent" className="space-y-4">
          {mockNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mockNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedNotification(notification);
                    if (!notification.isRead) {
                      markAsReadMutation.mutate(notification.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {notification.flightNumber && (
                          <Badge variant="outline" className="mt-2">
                            {notification.flightNumber}
                          </Badge>
                        )}
                        
                        {notification.bookingReference && (
                          <Badge variant="outline" className="mt-2 ml-2">
                            {notification.bookingReference}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Price Alerts */}
        <TabsContent value="price-alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create Price Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <Input
                    placeholder="Origin airport"
                    value={newPriceAlert.origin}
                    onChange={(e) => setNewPriceAlert({ ...newPriceAlert, origin: e.target.value })}
                  />
                </div>
                <div>
                  <Label>To</Label>
                  <Input
                    placeholder="Destination airport"
                    value={newPriceAlert.destination}
                    onChange={(e) => setNewPriceAlert({ ...newPriceAlert, destination: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Target Price ($)</Label>
                  <Input
                    type="number"
                    placeholder="300"
                    value={newPriceAlert.targetPrice}
                    onChange={(e) => setNewPriceAlert({ ...newPriceAlert, targetPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Departure Date</Label>
                  <Input
                    type="date"
                    value={newPriceAlert.departureDate}
                    onChange={(e) => setNewPriceAlert({ ...newPriceAlert, departureDate: e.target.value })}
                  />
                </div>
              </div>
              <Button 
                onClick={() => createPriceAlertMutation.mutate(newPriceAlert)}
                disabled={!newPriceAlert.origin || !newPriceAlert.destination || !newPriceAlert.targetPrice}
                className="w-full"
              >
                Create Price Alert
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {mockPriceAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{alert.route}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Target: ${alert.targetPrice}</span>
                        <span>Current: ${alert.currentPrice}</span>
                        <span className={alert.currentPrice <= alert.targetPrice ? 'text-green-600' : 'text-red-600'}>
                          {alert.currentPrice <= alert.targetPrice ? '✓ Target met!' : `$${alert.currentPrice - alert.targetPrice} above target`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePriceAlertMutation.mutate(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notification History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{mockNotifications.length}</div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockNotifications.filter(n => n.isRead).length}</div>
                    <div className="text-muted-foreground">Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
                    <div className="text-muted-foreground">Unread</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getNotificationIcon(selectedNotification.type)}
                {selectedNotification.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>{selectedNotification.message}</p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {new Date(selectedNotification.timestamp).toLocaleString()}
              </div>
              
              {selectedNotification.actionUrl && (
                <Button asChild>
                  <a href={selectedNotification.actionUrl}>
                    Take Action
                  </a>
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}