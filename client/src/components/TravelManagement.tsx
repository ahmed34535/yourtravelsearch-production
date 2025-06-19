import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Plus, Share2, Star, Clock, Users, Plane, Hotel, Car, Package } from "lucide-react";

interface Itinerary {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: string;
  status: 'planning' | 'confirmed' | 'completed';
  items: ItineraryItem[];
  sharedWith: string[];
}

interface ItineraryItem {
  id: number;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'transport';
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  completed: boolean;
}

export default function TravelManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [isCreatingItinerary, setIsCreatingItinerary] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Fetch itineraries
  const { data: itineraries, isLoading } = useQuery({
    queryKey: ['/api/itineraries'],
    enabled: !!user,
  });

  // Create itinerary mutation
  const createItineraryMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/itineraries', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/itineraries'] });
      setIsCreatingItinerary(false);
      toast({
        title: "Itinerary Created",
        description: "Your travel itinerary has been created successfully.",
      });
    },
  });

  // Add itinerary item mutation
  const addItemMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', `/api/itineraries/${selectedItinerary?.id}/items`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/itineraries'] });
      setIsAddingItem(false);
      toast({
        title: "Item Added",
        description: "Item has been added to your itinerary.",
      });
    },
  });

  // Share itinerary mutation
  const shareItineraryMutation = useMutation({
    mutationFn: ({ id, email }: { id: number; email: string }) => 
      apiRequest('POST', `/api/itineraries/${id}/share`, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/itineraries'] });
      toast({
        title: "Itinerary Shared",
        description: "Your itinerary has been shared successfully.",
      });
    },
  });

  const handleCreateItinerary = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    createItineraryMutation.mutate(data);
  };

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    addItemMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning':
        return <Badge variant="secondary">Planning</Badge>;
      case 'confirmed':
        return <Badge variant="default">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'transport':
        return <Car className="h-4 w-4" />;
      case 'activity':
        return <MapPin className="h-4 w-4" />;
      case 'restaurant':
        return <Star className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Travel Management</h3>
          <p className="text-sm text-muted-foreground">Plan and organize your travel itineraries</p>
        </div>
        <Dialog open={isCreatingItinerary} onOpenChange={setIsCreatingItinerary}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Itinerary
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Itinerary</DialogTitle>
              <DialogDescription>Plan your next adventure</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateItinerary} className="space-y-4">
              <div>
                <Label htmlFor="title">Trip Title</Label>
                <Input id="title" name="title" placeholder="Summer Vacation in Europe" required />
              </div>
              
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" name="destination" placeholder="Paris, France" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your trip..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" disabled={createItineraryMutation.isPending}>
                  {createItineraryMutation.isPending ? "Creating..." : "Create Itinerary"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreatingItinerary(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {itineraries && itineraries.length > 0 ? (
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">My Itineraries</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-4">
              {itineraries.map((itinerary: Itinerary) => (
                <Card key={itinerary.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedItinerary(itinerary)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{itinerary.title}</h4>
                          {getStatusBadge(itinerary.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{itinerary.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{itinerary.destination}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{itinerary.sharedWith?.length || 0} shared</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          // Handle share
                        }}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shared">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Shared Itineraries</h3>
                <p className="text-muted-foreground">
                  Itineraries shared with you will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Itineraries Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first travel itinerary to get started
            </p>
            <Button onClick={() => setIsCreatingItinerary(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Itinerary
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Itinerary Detail Modal */}
      {selectedItinerary && (
        <Dialog open={!!selectedItinerary} onOpenChange={() => setSelectedItinerary(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle>{selectedItinerary.title}</DialogTitle>
                  <DialogDescription>{selectedItinerary.description}</DialogDescription>
                </div>
                {getStatusBadge(selectedItinerary.status)}
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedItinerary.destination}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedItinerary.startDate).toLocaleDateString()} - {new Date(selectedItinerary.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Itinerary Item</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddItem} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select name="type" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flight">Flight</SelectItem>
                              <SelectItem value="hotel">Hotel</SelectItem>
                              <SelectItem value="transport">Transport</SelectItem>
                              <SelectItem value="activity">Activity</SelectItem>
                              <SelectItem value="restaurant">Restaurant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" name="date" type="date" required />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" placeholder="Flight to Paris" required />
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input id="time" name="time" type="time" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="Charles de Gaulle Airport" />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Additional details..."
                          className="min-h-[60px]"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button type="submit" className="flex-1" disabled={addItemMutation.isPending}>
                          {addItemMutation.isPending ? "Adding..." : "Add Item"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsAddingItem(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Itinerary Items */}
              <div className="space-y-3">
                {selectedItinerary.items?.length > 0 ? (
                  selectedItinerary.items.map((item: ItineraryItem) => (
                    <Card key={item.id} className={`border-l-4 ${item.completed ? 'border-l-green-500 bg-green-50' : 'border-l-blue-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getItemIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium">{item.title}</h5>
                                <Badge variant="outline">{item.type}</Badge>
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                {item.time && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{item.time}</span>
                                  </div>
                                )}
                                {item.location && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{item.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            {item.completed ? 'Completed' : 'Mark Complete'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2" />
                    <p>No items in this itinerary yet</p>
                    <p className="text-sm">Add flights, hotels, activities and more</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Trip Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Statistics</CardTitle>
          <CardDescription>Your travel achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-muted-foreground">Trips Completed</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-sm text-muted-foreground">Countries Visited</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-sm text-muted-foreground">Cities Explored</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-orange-600">89,420</p>
              <p className="text-sm text-muted-foreground">Miles Traveled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}