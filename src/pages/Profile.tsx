
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Camera,
  Bell,
  Lock,
  Activity,
  Briefcase,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { profile, loading, updateProfile } = useProfile();
  const [formData, setFormData] = useState(profile || {});

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData(profile);
    }
  });

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile || {});
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Unable to load profile data.
        </div>
      </Layout>
    );
  }

  const getRoleColor = (role: string) => {
    const colors = {
      'Fleet Manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Admin': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'driver': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Supervisor': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'activity', label: 'Activity Log', icon: Activity }
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
              <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
              User Profile
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your account information and preferences</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={handleSignOut} className="flex-1 sm:flex-none">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-6">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto">
                    <AvatarImage src="" alt={profile.full_name || ''} />
                    <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary text-primary-foreground">
                      {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-6 h-6 sm:w-8 sm:h-8 p-0">
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  )}
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-foreground">{profile.full_name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">{profile.employee_id}</p>
                
                <Badge className={getRoleColor(profile.role || '') + " mb-4 text-xs"}>
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.role}
                </Badge>
                
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{profile.department}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Joined {profile.join_date ? new Date(profile.join_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 mb-4 sm:mb-6 p-1 bg-muted rounded-lg overflow-x-auto">
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap"
                  size="sm"
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </Button>
              ))}
            </div>

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
                    <CardDescription className="text-sm">Your basic profile and contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.full_name || ''}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          disabled={!isEditing}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="employeeId" className="text-sm">Employee ID</Label>
                        <Input
                          id="employeeId"
                          value={formData.employee_id || ''}
                          disabled
                          className="bg-muted text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role" className="text-sm">Role</Label>
                        <Select 
                          value={formData.role || ''} 
                          onValueChange={(value) => handleInputChange('role', value)} 
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department" className="text-sm">Department</Label>
                        <Input
                          id="department"
                          value={formData.department || ''}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          disabled={!isEditing}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-sm">Location</Label>
                        <Input
                          id="location"
                          value={formData.location || ''}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!isEditing}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Address & Emergency Contact</CardTitle>
                    <CardDescription className="text-sm">Additional contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address" className="text-sm">Address</Label>
                        <Input
                          id="address"
                          value={formData.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="emergencyContact" className="text-sm">Emergency Contact</Label>
                          <Input
                            id="emergencyContact"
                            value={formData.emergency_contact || ''}
                            onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                            disabled={!isEditing}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="licenseNumber" className="text-sm">License Number</Label>
                          <Input
                            id="licenseNumber"
                            value={formData.license_number || ''}
                            onChange={(e) => handleInputChange('license_number', e.target.value)}
                            disabled={!isEditing}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Notification Preferences</CardTitle>
                  <CardDescription className="text-sm">Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <div>
                          <p className="font-medium text-sm">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive updates via email</p>
                        </div>
                      </div>
                      <Switch 
                        checked={formData.email_notifications || false} 
                        onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <div>
                          <p className="font-medium text-sm">SMS Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive updates via SMS</p>
                        </div>
                      </div>
                      <Switch 
                        checked={formData.sms_notifications || false} 
                        onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <div>
                          <p className="font-medium text-sm">Push Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive browser notifications</p>
                        </div>
                      </div>
                      <Switch 
                        checked={formData.push_notifications || false} 
                        onCheckedChange={(checked) => handleInputChange('push_notifications', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Password & Security</CardTitle>
                    <CardDescription className="text-sm">Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full sm:w-auto text-sm">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Separator />
                    <div>
                      <p className="font-medium mb-2 text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" className="text-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                  <CardDescription className="text-sm">Your recent system activities and login history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Profile updated', time: '2 hours ago', icon: User },
                      { action: 'Password changed', time: '1 day ago', icon: Lock },
                      { action: 'Login from Nairobi', time: '2 days ago', icon: MapPin },
                      { action: 'Trip created', time: '3 days ago', icon: Activity }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <activity.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
