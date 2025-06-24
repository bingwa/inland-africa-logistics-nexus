
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Truck, Search, Plus, Settings, Calendar, Gauge } from "lucide-react";
import { useState } from "react";

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const trucks = [
    {
      id: "TRK-001",
      model: "MAN TGX 540",
      year: 2021,
      status: "Active",
      location: "Lagos",
      mileage: 45000,
      fuelLevel: 85,
      nextService: "2024-07-15",
      driver: "John Adebayo",
    },
    {
      id: "TRK-002",
      model: "Volvo FH16",
      year: 2020,
      status: "In Transit",
      location: "Abuja",
      mileage: 67000,
      fuelLevel: 45,
      nextService: "2024-07-20",
      driver: "Ahmed Hassan",
    },
    {
      id: "TRK-003",
      model: "Mercedes Actros",
      year: 2019,
      status: "Maintenance",
      location: "Port Harcourt",
      mileage: 89000,
      fuelLevel: 20,
      nextService: "2024-07-10",
      driver: "Not Assigned",
    },
    {
      id: "TRK-004",
      model: "Scania R500",
      year: 2022,
      status: "Active",
      location: "Kano",
      mileage: 23000,
      fuelLevel: 75,
      nextService: "2024-08-01",
      driver: "Blessing Okafor",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "In Transit": return "bg-blue-100 text-blue-800";
      case "Maintenance": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTrucks = trucks.filter(truck =>
    truck.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-logistics-primary flex items-center gap-3">
              <Truck className="w-8 h-8" />
              Fleet Management
            </h1>
            <p className="text-gray-600">Manage and monitor your truck fleet</p>
          </div>
          <Button className="bg-logistics-primary hover:bg-logistics-secondary">
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
                  <p className="text-2xl font-bold text-logistics-primary">56</p>
                </div>
                <Truck className="w-8 h-8 text-logistics-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">45</p>
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
                  <p className="text-sm font-medium text-gray-600">In Maintenance</p>
                  <p className="text-2xl font-bold text-orange-600">8</p>
                </div>
                <Settings className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Fuel Level</p>
                  <p className="text-2xl font-bold text-blue-600">67%</p>
                </div>
                <Gauge className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
            <CardDescription>View and manage all trucks in your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by truck ID, model, or driver..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>

            {/* Trucks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrucks.map((truck) => (
                <Card key={truck.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{truck.id}</CardTitle>
                        <CardDescription>{truck.model} ({truck.year})</CardDescription>
                      </div>
                      <Badge className={getStatusColor(truck.status)}>
                        {truck.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium">{truck.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Driver</p>
                        <p className="font-medium">{truck.driver}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mileage</p>
                        <p className="font-medium">{truck.mileage.toLocaleString()} km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fuel Level</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                truck.fuelLevel > 50 ? 'bg-green-500' : 
                                truck.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${truck.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{truck.fuelLevel}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Next Service: {truck.nextService}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-logistics-primary hover:bg-logistics-secondary">
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
