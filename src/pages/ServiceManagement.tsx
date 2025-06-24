
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react";

const ServiceManagement = () => {
  const serviceRecords = [
    {
      id: "SRV-001",
      truckId: "TRK-001",
      type: "Preventive Maintenance",
      status: "Scheduled",
      date: "2024-07-15",
      priority: "Medium",
      description: "Oil change and filter replacement",
      technician: "Mike Johnson",
      estimatedCost: 250,
    },
    {
      id: "SRV-002",
      truckId: "TRK-003",
      type: "Emergency Repair",
      status: "In Progress",
      date: "2024-06-28",
      priority: "High",
      description: "Brake system repair",
      technician: "Sarah Williams",
      estimatedCost: 850,
    },
    {
      id: "SRV-003",
      truckId: "TRK-002",
      type: "Routine Inspection",
      status: "Completed",
      date: "2024-06-25",
      priority: "Low",
      description: "Annual safety inspection",
      technician: "David Brown",
      estimatedCost: 150,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-4 h-4" />;
      case "In Progress": return <Settings className="w-4 h-4" />;
      case "Scheduled": return <Clock className="w-4 h-4" />;
      case "Overdue": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-logistics-primary flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Service Management
            </h1>
            <p className="text-gray-600">Track and manage vehicle maintenance and repairs</p>
          </div>
          <Button className="bg-logistics-primary hover:bg-logistics-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Service
          </Button>
        </div>

        {/* Service Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold text-logistics-primary">156</p>
                </div>
                <Settings className="w-8 h-8 text-logistics-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-yellow-600">23</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Records */}
        <Card>
          <CardHeader>
            <CardTitle>Service Records</CardTitle>
            <CardDescription>Recent and upcoming maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <h3 className="font-semibold text-logistics-primary">{record.id}</h3>
                        <p className="text-sm text-gray-600">Truck: {record.truckId}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                      <Badge className={getPriorityColor(record.priority)}>
                        {record.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Service Type</p>
                      <p className="font-medium">{record.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Technician</p>
                      <p className="font-medium">{record.technician}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Cost</p>
                      <p className="font-medium">${record.estimatedCost}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{record.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled: {record.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {record.status === "Scheduled" && (
                        <Button size="sm" className="bg-logistics-primary hover:bg-logistics-secondary">
                          Start Service
                        </Button>
                      )}
                      {record.status === "In Progress" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Services</CardTitle>
            <CardDescription>Scheduled maintenance and inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <div key={day} className="text-center">
                  <p className="font-semibold text-gray-700 mb-2">{day}</p>
                  <div className="space-y-2">
                    {index === 1 && (
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 rounded text-xs">
                        <p className="font-medium">TRK-001</p>
                        <p>Oil Change</p>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="bg-red-100 border-l-4 border-red-500 p-2 rounded text-xs">
                        <p className="font-medium">TRK-003</p>
                        <p>Brake Repair</p>
                      </div>
                    )}
                    {index === 5 && (
                      <div className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded text-xs">
                        <p className="font-medium">TRK-005</p>
                        <p>Inspection</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceManagement;
