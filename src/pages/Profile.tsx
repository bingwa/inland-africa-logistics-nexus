import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Settings,
  Bell,
  Lock,
  Activity,
  Award,
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdminAccessControl } from "@/components/AdminAccessControl";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: 'John Adebayo',
    email: 'john.adebayo@translogistics.co.ke',
    phone: '+254 712 345 678',
    role: 'Fleet Manager',
    department: 'Operations',
    employeeId: 'TL-2024-001',
    joinDate: '2024-01-15',
    location: 'Nairobi, Kenya',
    bio: 'Experienced fleet manager with 8+ years in logistics and transportation management. Specialized in route optimization and driver performance management.',
    address: 'Westlands, Nairobi',
    emergencyContact: '+254 722 987 654',
    licenseNumber: 'DL-123456789',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  
  const [originalData, setOriginalData] = useState(profileData);

  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    setOriginalData(profileData);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(originalData);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => {
        const parentObj = prev[parent as keyof typeof prev];
        if (typeof parentObj === 'object' && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Fleet Manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Admin': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Driver': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Supervisor': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'activity', label: 'Activity Log', icon: Activity }
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <User className="w-6 h-6 sm:w-8 sm:h-8" />
              User Profile
            </h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src="" alt={profileData.fullName} />
                    <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                      {profileData.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-foreground">{profileData.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-2">{profileData.email}</p>
                
                <Badge className={getRoleColor(profileData.role) + " mb-4"}>
                  <Shield className="w-3 h-3 mr-1" />
                  {profileData.role}
                </Badge>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{profileData.department}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 mb-6 p-1 bg-muted rounded-lg">
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 text-sm"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              ))}
            </div>

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your basic profile and contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                          id="employeeId"
                          value={profileData.employeeId}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={profileData.role} 
                          onValueChange={(value) => handleInputChange('role', value)} 
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                            <SelectItem value="Driver">Driver</SelectItem>
                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={profileData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Address & Emergency Contact</CardTitle>
                    <CardDescription>Additional contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={profileData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact</Label>
                          <Input
                            id="emergencyContact"
                            value={profileData.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="licenseNumber">License Number</Label>
                          <Input
                            id="licenseNumber"
                            value={profileData.licenseNumber}
                            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Bio</CardTitle>
                    <CardDescription>Tell us about your experience and expertise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Share your professional background, experience, and expertise..."
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={profileData.notifications.email} 
                        onChange={(e) => handleInputChange('notifications.email', e.target.checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={profileData.notifications.sms} 
                        onChange={(e) => handleInputChange('notifications.sms', e.target.checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={profileData.notifications.push} 
                        onChange={(e) => handleInputChange('notifications.push', e.target.checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full sm:w-auto">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Separator />
                    <div>
                      <p className="font-medium mb-2">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <AdminAccessControl userRole="user" requiredRole="admin">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Security Settings</CardTitle>
                      <CardDescription>Advanced security configurations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Advanced admin security settings would appear here.</p>
                    </CardContent>
                  </Card>
                </AdminAccessControl>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent system activities and login history</CardDescription>
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
                        <activity.icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
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
