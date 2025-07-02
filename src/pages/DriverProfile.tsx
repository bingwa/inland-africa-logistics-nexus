import { useState } from "react";
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Truck, MapPin, Calendar, Phone, Mail, Save, Edit, Star, Shield, Award, LogOut } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DriverProfile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    employee_id: '',
    department: 'Transport',
    location: '',
    address: '',
    emergency_contact: '',
    license_number: '',
    license_class: '',
    license_expiry_date: '',
    years_experience: '',
    preferred_routes: '',
    medical_cert_expiry: '',
    psv_license_number: '',
    next_of_kin_name: '',
    next_of_kin_phone: '',
    home_county: '',
    id_number: '',
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
  });

  // Sample driver stats
  const driverStats = {
    totalTrips: 247,
    safetyRating: 4.8,
    totalDistance: "125,450 km",
    yearsOfService: 3.5,
    lastTripDate: "2024-07-01"
  };

  useState(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        employee_id: profile.employee_id || '',
        department: profile.department || 'Transport',
        location: profile.location || '',
        address: profile.address || '',
        emergency_contact: profile.emergency_contact || '',
        license_number: profile.license_number || '',
        license_class: '',
        license_expiry_date: '',
        years_experience: '',
        preferred_routes: '',
        medical_cert_expiry: '',
        psv_license_number: '',
        next_of_kin_name: '',
        next_of_kin_phone: '',
        home_county: '',
        id_number: '',
        email_notifications: profile.email_notifications ?? true,
        sms_notifications: profile.sms_notifications ?? true,
        push_notifications: profile.push_notifications ?? true,
      });
    }
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your driver profile has been successfully updated.",
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        employee_id: profile.employee_id || '',
        department: profile.department || 'Transport',
        location: profile.location || '',
        address: profile.address || '',
        emergency_contact: profile.emergency_contact || '',
        license_number: profile.license_number || '',
        license_class: '',
        license_expiry_date: '',
        years_experience: '',
        preferred_routes: '',
        medical_cert_expiry: '',
        psv_license_number: '',
        next_of_kin_name: '',
        next_of_kin_phone: '',
        home_county: '',
        id_number: '',
        email_notifications: profile.email_notifications ?? true,
        sms_notifications: profile.sms_notifications ?? true,
        push_notifications: profile.push_notifications ?? true,
      });
    }
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <User className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
              Driver Profile
            </h1>
            <p className="text-muted-foreground">Manage your driver account and professional information</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button onClick={handleSignOut} variant="destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver Overview */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="text-center">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 border-4 border-blue-300">
                <Truck className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-900">{formData.full_name || 'Driver Name'}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 text-blue-700">
                <Mail className="w-4 h-4" />
                {user?.email}
              </CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  <Shield className="w-3 h-3 mr-1" />
                  Professional Driver
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{driverStats.totalTrips}</p>
                    <p className="text-xs text-blue-700">Total Trips</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <p className="text-lg font-bold text-blue-600">{driverStats.safetyRating}</p>
                    </div>
                    <p className="text-xs text-blue-700">Safety Rating</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{formData.location || 'Location not set'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{formData.phone || 'Phone not set'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{driverStats.yearsOfService} years service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{driverStats.totalDistance} driven</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="id_number">National ID Number</Label>
                    <Input
                      id="id_number"
                      value={formData.id_number}
                      onChange={(e) => handleInputChange('id_number', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="home_county">Home County</Label>
                    <Select value={formData.home_county} onValueChange={(value) => handleInputChange('home_county', value)} disabled={!isEditing}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="mombasa">Mombasa</SelectItem>
                        <SelectItem value="kiambu">Kiambu</SelectItem>
                        <SelectItem value="nakuru">Nakuru</SelectItem>
                        <SelectItem value="machakos">Machakos</SelectItem>
                        <SelectItem value="kajiado">Kajiado</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Home Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <Truck className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee_id">Employee ID</Label>
                    <Input
                      id="employee_id"
                      value={formData.employee_id}
                      onChange={(e) => handleInputChange('employee_id', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="years_experience">Years of Experience</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience}
                      onChange={(e) => handleInputChange('years_experience', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_number">Driving License Number</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => handleInputChange('license_number', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_class">License Class</Label>
                    <Select value={formData.license_class} onValueChange={(value) => handleInputChange('license_class', value)} disabled={!isEditing}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select license class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B">Class B (Light Vehicle)</SelectItem>
                        <SelectItem value="C">Class C (Medium Truck)</SelectItem>
                        <SelectItem value="CE">Class CE (Heavy Truck)</SelectItem>
                        <SelectItem value="D">Class D (Bus)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="psv_license_number">PSV License Number</Label>
                    <Input
                      id="psv_license_number"
                      value={formData.psv_license_number}
                      onChange={(e) => handleInputChange('psv_license_number', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Base Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="preferred_routes">Preferred Routes</Label>
                  <Textarea
                    id="preferred_routes"
                    value={formData.preferred_routes}
                    onChange={(e) => handleInputChange('preferred_routes', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                    rows={2}
                    placeholder="e.g., Nairobi-Mombasa, Nairobi-Kisumu"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact & Medical */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <Phone className="w-5 h-5" />
                  Emergency Contact & Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="next_of_kin_name">Next of Kin Name</Label>
                    <Input
                      id="next_of_kin_name"
                      value={formData.next_of_kin_name}
                      onChange={(e) => handleInputChange('next_of_kin_name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="next_of_kin_phone">Next of Kin Phone</Label>
                    <Input
                      id="next_of_kin_phone"
                      value={formData.next_of_kin_phone}
                      onChange={(e) => handleInputChange('next_of_kin_phone', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    <Input
                      id="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medical_cert_expiry">Medical Certificate Expiry</Label>
                    <Input
                      id="medical_cert_expiry"
                      type="date"
                      value={formData.medical_cert_expiry}
                      onChange={(e) => handleInputChange('medical_cert_expiry', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <Mail className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive trip assignments and updates via email</p>
                  </div>
                  <Switch
                    checked={formData.email_notifications}
                    onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                    disabled={!isEditing}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={formData.sms_notifications}
                    onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
                    disabled={!isEditing}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in the driver app</p>
                  </div>
                  <Switch
                    checked={formData.push_notifications}
                    onCheckedChange={(checked) => handleInputChange('push_notifications', checked)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
};

export default DriverProfile;
