
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings, AlertTriangle, CheckCircle, Clock, Plus, Loader2 } from "lucide-react";
import { useMaintenance } from "@/hooks/useSupabaseData";

const ServiceManagement = () => {
  const { data: maintenanceRecords, isLoading, error } = useMaintenance();

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
          Error loading maintenance records: {error.message}
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in_progress": return <Settings className="w-4 h-4" />;
      case "scheduled": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const totalServices = maintenanceRecords?.length || 0;
  const completedServices = maintenanceRecords?.filter(record => record.status === 'completed').length || 0;
  const inProgressServices = maintenanceRecords?.filter(record => record.status === 'in_progress').length || 0;
  const scheduledServices = maintenanceRecords?.filter(record => record.status === 'scheduled').length || 0;

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
                  <p className="text-2xl font-bold text-logistics-primary">{totalServices}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{scheduledServices}</p>
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
                  <p className="text-2xl font-bold text-blue-600">{inProgressServices}</p>
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedServices}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
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
              {maintenanceRecords?.map((record) => (
                <div key={record.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <h3 className="font-semibold text-logistics-primary">
                          {record.trucks?.truck_number || 'Unknown Truck'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {record.trucks?.make} {record.trucks?.model}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {record.maintenance_type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Service Type</p>
                      <p className="font-medium">{record.maintenance_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Technician</p>
                      <p className="font-medium">{record.technician || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cost</p>
                      <p className="font-medium">KSh {record.cost?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{record.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Service Date: {new Date(record.service_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {record.status === "scheduled" && (
                        <Button size="sm" className="bg-logistics-primary hover:bg-logistics-secondary">
                          Start Service
                        </Button>
                      )}
                      {record.status === "in_progress" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {(!maintenanceRecords || maintenanceRecords.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No maintenance records found. Start by scheduling a service.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceManagement;
