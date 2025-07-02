
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Trash2 } from "lucide-react";

const DriverNotifications = () => {
  const notifications = [
    {
      id: 1,
      type: "trip",
      title: "New Trip Assignment",
      message: "You have been assigned to trip TRP-2024-001 from Nairobi to Mombasa",
      time: "2 hours ago",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      type: "document",
      title: "Document Expiry Warning",
      message: "Your Medical Certificate expires in 45 days. Please renew before August 15, 2024",
      time: "5 hours ago",
      read: false,
      priority: "medium"
    },
    {
      id: 3,
      type: "vehicle",
      title: "Vehicle Maintenance Due",
      message: "TRK-001 is due for scheduled maintenance. Please schedule service appointment",
      time: "1 day ago",
      read: true,
      priority: "medium"
    },
    {
      id: 4,
      type: "system",
      title: "System Update",
      message: "Driver portal has been updated with new features. Check out the latest improvements",
      time: "2 days ago",
      read: true,
      priority: "low"
    },
    {
      id: 5,
      type: "safety",
      title: "Safety Alert",
      message: "Weather advisory: Heavy rains expected on Nairobi-Mombasa highway. Drive safely",
      time: "3 days ago",
      read: true,
      priority: "high"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trip": return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "document": return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "vehicle": return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "safety": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-300";
      case "low": return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">Stay updated with important alerts and messages</p>
          </div>
          <Button variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>

        {/* Notification Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">
                    {notifications.filter(n => n.priority === 'high').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Medium Priority</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {notifications.filter(n => n.priority === 'medium').length}
                  </p>
                </div>
                <Info className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total</p>
                  <p className="text-2xl font-bold text-green-600">{notifications.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Your latest alerts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    !notification.read 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{notification.title}</h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Badge className={getPriorityColor(notification.priority) + " border text-xs"}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  );
};

export default DriverNotifications;
