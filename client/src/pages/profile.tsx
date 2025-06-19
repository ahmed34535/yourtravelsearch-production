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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, CreditCard, Shield, Bell, Globe, MapPin, Calendar, Phone, Mail, Camera } from "lucide-react";
import PaymentMethodsManager from "@/components/PaymentMethodsManager";
import SocialLoginManager from "@/components/SocialLoginManager";
import InternationalSupport from "@/components/InternationalSupport";
import TravelManagement from "@/components/TravelManagement";

import VisaDocumentationAssistant from "@/components/VisaDocumentationAssistant";
import NotificationSystem from "@/components/NotificationSystem";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle two-factor authentication toggle
  const handleTwoFactorToggle = async () => {
    try {
      const newStatus = !profile?.twoFactorEnabled;
      
      // Make API call to update two-factor status
      const response = await fetch('/api/profile/two-factor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: newStatus }),
      });

      if (response.ok) {
        // Update the user in localStorage and AuthContext
        const updatedUser = { ...profile, twoFactorEnabled: newStatus };
        localStorage.setItem('travalsearch_user', JSON.stringify(updatedUser));
        
        // Force a page refresh to update the context
        window.location.reload();
        
        toast({
          title: "Two-Factor Authentication Updated",
          description: `Two-factor authentication has been ${newStatus ? 'enabled' : 'disabled'}.`,
        });
      } else {
        throw new Error('Failed to update two-factor authentication');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication. Please try again.",
        variant: "destructive",
      });
    }
  };


  // Use user data from AuthContext directly
  const profile = user;
  const isLoading = false; // No API call needed since we use AuthContext data

  // Generate avatar color based on name
  const generateAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500',
      'bg-lime-500', 'bg-emerald-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-rose-500'
    ];
    
    // Generate consistent color based on name hash
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get user initials
  const getUserInitials = () => {
    if (!profile) return 'U';
    
    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';
    
    // If we have a first name, use its first letter
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    
    // If no first name but have last name, use last name's first letter
    if (lastName) {
      return lastName[0].toUpperCase();
    }
    
    // If no names available, use 'U' as fallback
    return 'U';
  };

  // Handle avatar color change
  const handleChangeAvatarColor = async () => {
    try {
      const firstName = profile?.firstName || '';
      const lastName = profile?.lastName || '';
      const fullName = `${firstName} ${lastName}`;
      
      // Generate a new random color by adding timestamp to name
      const newColorSeed = fullName + Date.now();
      const newColor = generateAvatarColor(newColorSeed);
      
      await apiRequest('POST', '/api/update-avatar', { avatar: newColor });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Avatar Updated",
        description: "Your profile picture color has been updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Password change mutation
  const passwordChangeMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return apiRequest('POST', '/api/change-password', data);
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    passwordChangeMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  // Fetch booking history
  const { data: bookings } = useQuery({
    queryKey: ['/api/bookings/history'],
    enabled: !!user,
  });

  // Fetch payment methods
  const { data: paymentMethods } = useQuery({
    queryKey: ['/api/payment-methods'],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', '/api/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and travel preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="travel" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Travel
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div 
                    className={`h-20 w-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                      profile?.avatar?.startsWith('bg-') 
                        ? profile.avatar 
                        : generateAvatarColor(`${profile?.firstName || ''} ${profile?.lastName || ''}`)
                    }`}
                  >
                    {getUserInitials() || 'U'}
                  </div>
                  <div>
                    <Button type="button" variant="outline" size="sm" onClick={handleChangeAvatarColor}>
                      <Camera className="h-4 w-4 mr-2" />
                      Change Color
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click to get a new random color for your profile picture.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={profile?.firstName}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={profile?.lastName}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={profile?.email}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                      {profile?.emailVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Mail className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={profile?.phone}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                      {profile?.phoneVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Phone className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      defaultValue={profile?.dateOfBirth}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      name="passportNumber"
                      defaultValue={profile?.passportNumber}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContactName">Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        name="emergencyContactName"
                        defaultValue={profile?.emergencyContactName}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        name="emergencyContactPhone"
                        defaultValue={profile?.emergencyContactPhone}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>View and manage your past and upcoming bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings?.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{booking.reference}</h4>
                          <p className="text-sm text-muted-foreground">{booking.type}</p>
                          <p className="text-sm">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-semibold mt-1">
                            {booking.currency} {booking.totalAmount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No bookings found</p>
                  <p className="text-sm text-muted-foreground">Start planning your next trip!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <PaymentMethodsManager />
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Preferences</CardTitle>
              <CardDescription>Set your default travel preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                  <Select defaultValue={profile?.preferredCurrency || "USD"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferredLanguage">Language</Label>
                  <Select defaultValue={profile?.preferredLanguage || "en"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="seatPreference">Seat Preference</Label>
                  <Select defaultValue={profile?.seatPreference}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="window">Window</SelectItem>
                      <SelectItem value="aisle">Aisle</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mealPreference">Meal Preference</Label>
                  <Select defaultValue={profile?.mealPreference}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="kosher">Kosher</SelectItem>
                      <SelectItem value="halal">Halal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="frequentFlyerNumbers">Frequent Flyer Numbers</Label>
                <Textarea
                  id="frequentFlyerNumbers"
                  placeholder="Enter your frequent flyer numbers (one per line)"
                  defaultValue={profile?.frequentFlyerNumbers}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button 
                  onClick={handleTwoFactorToggle}
                  variant={profile?.twoFactorEnabled ? "destructive" : "default"}
                >
                  {profile?.twoFactorEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your password regularly for security
                  </p>
                </div>
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new secure password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setPasswordDialogOpen(false)}
                        disabled={passwordChangeMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={passwordChangeMutation.isPending}
                      >
                        {passwordChangeMutation.isPending ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSystem />
        </TabsContent>

        {/* Travel Management Tab */}
        <TabsContent value="travel" className="space-y-6">
          <TravelManagement />
          
          {/* International Support */}
          <InternationalSupport />
          
          {/* Social Login Manager */}
          <SocialLoginManager />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <VisaDocumentationAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
}