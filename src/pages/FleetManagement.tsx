
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Truck, Search, Plus, Settings, Calendar, Gauge, User, Route } from "lucide-react";
import { useState } from "react";

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const trucks = [
    {
      id: "TRK-001",
      model: "MAN TGX 540",
      year: 2021,
      status: "Active",
      location: "Nairobi",
      mileage: 45000,
      fuelLevel: 85,
      nextService: "2024-07-15",
      driver: "John Adebayo",
      driverLicense: "DL-2019-NAI-1234",
      monthlyMileage: 4500,
      fuelCostPerKm: 25,
    },
    {
      id: "TRK-002",
      model: "Volvo FH16",
      year: 2020,
      status: "In Transit",
      location: "Mombasa",
      mileage: 67000,
      fuelLevel: 45,
      nextService: "2024-07-20",
      driver: "Ahmed Hassan",
      driverLicense: "DL-2018-MSA-5678",
      monthlyMileage: 5200,
      fuelCostPerKm: 28,
    },
    {
      id: "TRK-003",
      model: "Mercedes Actros",
      year: 2019,
      status: "Maintenance",
      location: "Kisumu",
      mileage: 89000,
      fuelLevel: 20,
      nextService: "2024-07-10",
      driver: "Not Assigned",
      driverLicense: "",
      monthlyMileage: 0,
      fuelCostPerKm: 30,
    },
    {
      id: "TRK-004",
      model: "Scania R500",
      year: 2022,
      status: "Active",
      location: "Eldoret",
      mileage: 23000,
      fuelLevel: 75,
      nextService: "2024-08-01",
      driver: "Mary Wanjiku",
      driverLicense: "DL-2020-ELD-9012",
      monthlyMileage: 3800,
      fuelCostPerKm: 24,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-300";
      case "In Transit": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Maintenance": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
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
                  <p className="text-2xl font-bold text-black">56</p>
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
                  <p className="text-sm font-medium text-gray-600">Monthly Mileage</p>
                  <p className="text-2xl font-bold text-blue-600">187,500</p>
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
                  <p className="text-sm font-medium text-gray-600">Fuel Cost</p>
                  <p className="text-2xl font-bold text-red-600">KSh 4.8M</p>
                  <p className="text-sm text-gray-500">This month</p>
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
                  placeholder="Search by truck ID, model, or driver..."
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
                        <CardTitle className="text-lg text-black">{truck.id}</CardTitle>
                        <CardDescription>{truck.model} ({truck.year})</CardDescription>
                      </div>
                      <Badge className={getStatusColor(truck.status) + " border"}>
                        {truck.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium text-black">{truck.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Mileage</p>
                        <p className="font-medium text-black">{truck.mileage.toLocaleString()} km</p>
                      </div>
                    </div>

                    {/* Driver Information */}
                    <div className="border rounded-lg p-3 bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-black">Driver Details</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Name:</span> <span className="font-medium">{truck.driver}</span></p>
                        {truck.driverLicense && (
                          <p><span className="text-gray-600">License:</span> <span className="font-medium">{truck.driverLicense}</span></p>
                        )}
                        <p><span className="text-gray-600">Monthly Mileage:</span> <span className="font-medium">{truck.monthlyMileage.toLocaleString()} km</span></p>
                      </div>
                    </div>

                    {/* Fuel and Cost Information */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-600 text-sm">Fuel Level</p>
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
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fuel Cost/km:</span>
                        <span className="font-medium text-black">KSh {truck.fuelCostPerKm}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Next Service: {truck.nextService}</span>
                    </div>
                    
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
