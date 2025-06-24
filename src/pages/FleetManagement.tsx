
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Truck, Search, Plus, Settings, Calendar, Gauge, User, Route, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTrucks } from "@/hooks/useSupabaseData";

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: trucks, isLoading, error } = useTrucks();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Error loading trucks: {error.message}
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-300";
      case "in_transit": return "bg-blue-100 text-blue-800 border-blue-300";
      case "maintenance": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredTrucks = trucks?.filter(truck =>
    truck.truck_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.make.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate statistics
  const activeTrucks = trucks?.filter(truck => truck.status === 'active').length || 0;
  const totalMileage = trucks?.reduce((sum, truck) => sum + (truck.mileage || 0), 0) || 0;
  const estimatedFuelCost = Math.round(totalMileage * 0.15); // Estimated at KSh 0.15 per km

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-3">
              <Truck className="w-8 h-8" />
              Fleet Management
            </h1>
            <p className="text-gray-600">Manage and monitor your truck fleet</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Truck
          </Button>
        </div>

        {/* Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trucks</p>
                  <p className="text-2xl font-bold text-black">{trucks?.length || 0}</p>
                </div>
                <Truck className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{activeTrucks}</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Mileage</p>
                  <p className="text-2xl font-bold text-blue-600">{totalMileage.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">km total</p>
                </div>
                <Route className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Est. Fuel Cost</p>
                  <p className="text-2xl font-bold text-red-600">KSh {estimatedFuelCost.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Monthly est.</p>
                </div>
                <Gauge className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-2 border-yellow-400">
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
            <CardDescription>View and manage all trucks in your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by truck ID, model, or make..."
                  className="pl-10 border-yellow-300 focus:border-yellow-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="border-yellow-400 text-black hover:bg-yellow-50">Filter</Button>
              <Button variant="outline" className="border-yellow-400 text-black hover:bg-yellow-50">Export</Button>
            </div>

            {/* Trucks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrucks.map((truck) => (
                <Card key={truck.id} className="hover:shadow-md transition-shadow border-2 border-yellow-300">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-black">{truck.truck_number}</CardTitle>
                        <CardDescription>{truck.make} {truck.model} ({truck.year})</CardDescription>
                      </div>
                      <Badge className={getStatusColor(truck.status) + " border"}>
                        {truck.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">License Plate</p>
                        <p className="font-medium text-black">{truck.license_plate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Capacity</p>
                        <p className="font-medium text-black">{truck.capacity_tons} tons</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mileage</p>
                        <p className="font-medium text-black">{(truck.mileage || 0).toLocaleString()} km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fuel Type</p>
                        <p className="font-medium text-black">{truck.fuel_type}</p>
                      </div>
                    </div>

                    {truck.next_service_due && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Next Service: {new Date(truck.next_service_due).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 border-yellow-400 text-black hover:bg-yellow-50">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-black hover:bg-gray-800 text-white">
                        Track
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FleetManagement;
