
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Mail,
  Phone,
  Smartphone,
  Save,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    maintenance: true,
    trips: true,
    inventory: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    dateFormat: 'DD/MM/YYYY'
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    loginNotifications: true
  });

  const { toast } = useToast();
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: string, value: boolean | string) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme}`,
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change functionality would be implemented here.",
    });
  };

  if (!mounted) return null;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your application preferences and configurations</p>
          </div>
          <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
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
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(value) => handleNotificationChange('sms', value)}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                />
              </div>
              <Separator />

              <div className="space-y-3">
                <p className="font-medium">Notification Categories</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Maintenance Alerts</p>
                    <Switch 
                      checked={notifications.maintenance}
                      onCheckedChange={(value) => handleNotificationChange('maintenance', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Trip Updates</p>
                    <Switch 
                      checked={notifications.trips}
                      onCheckedChange={(value) => handleNotificationChange('trips', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Inventory Alerts</p>
                    <Switch 
                      checked={notifications.inventory}
                      onCheckedChange={(value) => handleNotificationChange('inventory', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                </div>
                <Switch 
                  checked={security.twoFactor}
                  onCheckedChange={(value) => handleSecurityChange('twoFactor', value)}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Login Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                </div>
                <Switch 
                  checked={security.loginNotifications}
                  onCheckedChange={(value) => handleSecurityChange('loginNotifications', value)}
                />
              </div>
              <Separator />

              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select 
                  value={security.sessionTimeout} 
                  onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={handleChangePassword}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Application Preferences */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Application Preferences
              </CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={preferences.language} 
                  onValueChange={(value) => handlePreferenceChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={preferences.timezone} 
                  onValueChange={(value) => handlePreferenceChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Nairobi">Nairobi (EAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={preferences.currency} 
                  onValueChange={(value) => handlePreferenceChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select 
                  value={preferences.dateFormat} 
                  onValueChange={(value) => handlePreferenceChange('dateFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
