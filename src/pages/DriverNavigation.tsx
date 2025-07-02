
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Route, Clock, Fuel, AlertTriangle } from "lucide-react";

const DriverNavigation = () => {
  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Navigation className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Navigation & Routes
            </h1>
            <p className="text-muted-foreground">GPS navigation and route optimization tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Route */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Route className="w-5 h-5" />
                Current Route
              </CardTitle>
              <CardDescription>Active navigation for your current trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Nairobi → Mombasa</span>
                  <span className="text-sm text-blue-600">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Distance:</span>
                    <p className="font-medium">485 km</p>
                  </div>
                  <div>
                    <span className="text-gray-600">ETA:</span>
                    <p className="font-medium">6h 30m</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Navigation className="w-4 h-4 mr-2" />
                Open GPS Navigation
              </Button>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Start: Nairobi Industrial Area</p>
                    <p className="text-sm text-gray-600">08:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Rest Stop: Voi</p>
                    <p className="text-sm text-gray-600">12:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Destination: Mombasa Port</p>
                    <p className="text-sm text-gray-600">02:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic & Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Traffic & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Construction Zone</span>
                </div>
                <p className="text-sm text-orange-700">Roadwork on A109 near Machakos. Expect delays.</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Traffic Update</span>
                </div>
                <p className="text-sm text-blue-700">Light traffic on current route. Good conditions ahead.</p>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Stations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-green-500" />
                Nearby Fuel Stations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { name: "Shell Machakos", distance: "15 km", price: "KSh 165/L" },
                  { name: "Total Voi", distance: "45 km", price: "KSh 162/L" },
                  { name: "Kenol Mtito Andei", distance: "78 km", price: "KSh 160/L" }
                ].map((station, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-600">{station.distance} ahead</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">{station.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DriverLayout>
  );
};

export default DriverNavigation;
