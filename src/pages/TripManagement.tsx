
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, MapPin, Clock, Plus, Truck, User } from "lucide-react";

const TripManagement = () => {
  const trips = [
    {
      id: "TRP-001",
      route: "Lagos → Abuja",
      truck: "TRK-001",
      driver: "John Adebayo",
      status: "In Transit",
      startDate: "2024-06-28",
      estimatedArrival: "2024-06-29",
      cargo: "Electronics",
      distance: "773 km",
      progress: 65,
    },
    {
      id: "TRP-002",
      route: "Kano → Port Harcourt",
      truck: "TRK-004",
      driver: "Blessing Okafor",
      status: "Scheduled",
      startDate: "2024-06-30",
      estimatedArrival: "2024-07-02",
      cargo: "Agricultural Products",
      distance: "1,200 km",
      progress: 0,
    },
    {
      id: "TRP-003",
      route: "Abuja → Kaduna",
      truck: "TRK-002",
      driver: "Ahmed Hassan",
      status: "Completed",
      startDate: "2024-06-26",
      estimatedArrival: "2024-06-26",
      cargo: "Construction Materials",
      distance: "189 km",
      progress: 100,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Transit": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      case "Delayed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-logistics-primary flex items-center gap-3">
              <Route className="w-8 h-8" />
              Trip & Route Management
            </h1>
            <p className="text-gray-600">Plan, track, and manage transportation routes</p>
          </div>
          <Button className="bg-logistics-primary hover:bg-logistics-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Button>
        </div>

        {/* Trip Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trips</p>
                  <p className="text-2xl font-bold text-logistics-primary">12</p>
                </div>
                <Route className="w-8 h-8 text-logistics-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Distance</p>
                  <p className="text-2xl font-bold text-blue-600">15,420</p>
                  <p className="text-sm text-gray-500">km this month</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Current Trips</CardTitle>
            <CardDescription>Monitor ongoing and scheduled trips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trips.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-logistics-primary text-lg">{trip.id}</h3>
                      <p className="text-xl font-medium text-gray-900">{trip.route}</p>
                      <p className="text-sm text-gray-600">{trip.cargo}</p>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Truck</p>
                        <p className="font-medium">{trip.truck}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Driver</p>
                        <p className="font-medium">{trip.driver}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Distance</p>
                        <p className="font-medium">{trip.distance}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">ETA</p>
                        <p className="font-medium">{trip.estimatedArrival}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {trip.status === "In Transit" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{trip.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${trip.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Track Live
                    </Button>
                    {trip.status === "Scheduled" && (
                      <Button size="sm" className="bg-logistics-primary hover:bg-logistics-secondary">
                        Start Trip
                      </Button>
                    )}
                    {trip.status === "In Transit" && (
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                        Update Status
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Route Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Routes</CardTitle>
              <CardDescription>Most frequently used transportation routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { route: "Lagos → Abuja", trips: 45, revenue: "₦2.1M" },
                  { route: "Kano → Lagos", trips: 38, revenue: "₦1.8M" },
                  { route: "Port Harcourt → Abuja", trips: 32, revenue: "₦1.5M" },
                  { route: "Kaduna → Lagos", trips: 28, revenue: "₦1.3M" },
                ].map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-logistics-primary">{route.route}</p>
                      <p className="text-sm text-gray-600">{route.trips} trips this month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{route.revenue}</p>
                      <p className="text-sm text-gray-500">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trip Performance</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>On-Time Delivery</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Fuel Efficiency</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Route Optimization</span>
                    <span>91%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Customer Satisfaction</span>
                    <span>96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-logistics-accent h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TripManagement;
