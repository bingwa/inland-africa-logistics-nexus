
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormData {
  full_name: string;
  phone: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<ProfileFormData>();

  const getInitials = (email: string) => {
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  const onSubmit = async (data: ProfileFormData) => {
    // Here you would update the profile in Supabase
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      full_name: user?.user_metadata?.full_name || '',
      phone: user?.user_metadata?.phone || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <User className="w-6 h-6 sm:w-8 sm:h-8" />
              Profile Settings
            </h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 bg-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xl">
                    {user?.email ? getInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">
                {user?.user_metadata?.full_name || 'User'}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              <Badge className="w-fit mx-auto bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Active Account
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email verified</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Joined {new Date(user?.created_at || '').toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Standard User</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="lg:col-span-2 bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={handleEdit} className="hidden sm:flex">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* Mobile Edit Button */}
              {!isEditing && (
                <Button variant="outline" onClick={handleEdit} className="w-full sm:hidden mb-4">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        {...register("full_name")}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value="Standard User"
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Role is managed by administrators</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-sm mt-1 text-foreground">{user?.user_metadata?.full_name || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                      <p className="text-sm mt-1 text-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                      <p className="text-sm mt-1 text-foreground">{user?.user_metadata?.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                      <p className="text-sm mt-1 text-foreground">Standard User</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Login Sessions</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">24</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Age</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {Math.floor((Date.now() - new Date(user?.created_at || '').getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                  <p className="text-sm text-muted-foreground">Since registration</p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Level</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">High</p>
                  <p className="text-sm text-muted-foreground">Email verified</p>
                </div>
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
              <div>
                <h4 className="font-medium">Email Verification</h4>
                <p className="text-sm text-muted-foreground">Your email address has been verified</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Verified</Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">Last updated recently</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Change Password
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
