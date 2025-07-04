
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings, AlertTriangle, CheckCircle, Clock, Plus, Loader2, Wrench, Package, TrendingUp } from "lucide-react";
import { useMaintenance, useUpdateMaintenanceStatus, useTrucks } from "@/hooks/useSupabaseData";
import { ServiceDetailsModal } from "@/components/ServiceDetailsModal";
import { ScheduleServiceModal } from "@/components/ScheduleServiceModal";
import { FilterExportBar } from "@/components/FilterExportBar";
import { useState } from "react";

const ServiceManagement = () => {
  const { data: maintenanceRecords, isLoading, error } = useMaintenance();
  const { data: trucks } = useTrucks();
  const updateMaintenanceStatus = useUpdateMaintenanceStatus();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<any>({});

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
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "scheduled": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "overdue": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400";
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

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateMaintenanceStatus.mutateAsync({ id, status });
  };

  const handleScheduleService = (serviceData: any) => {
    console.log('Scheduling service:', serviceData);
    // This would normally save to the database
    // For now, we'll just show a success message
  };

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting maintenance records in ${format} format`);
  };

  // Apply filters
  let filteredRecords = maintenanceRecords || [];
  
  if (searchTerm) {
    filteredRecords = filteredRecords.filter(record =>
      record.trucks?.truck_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.maintenance_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technician?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filters.status) {
    filteredRecords = filteredRecords.filter(record => record.status === filters.status);
  }

  // Calculate statistics
  const totalServices = maintenanceRecords?.length || 0;
  const completedServices = maintenanceRecords?.filter(record => record.status === 'completed').length || 0;
  const inProgressServices = maintenanceRecords?.filter(record => record.status === 'in_progress').length || 0;
  const scheduledServices = maintenanceRecords?.filter(record => record.status === 'scheduled').length || 0;
  const totalMaintenanceCost = maintenanceRecords?.reduce((sum, record) => sum + (record.cost || 0), 0) || 0;
  const averageServiceCost = totalServices > 0 ? totalMaintenanceCost / totalServices : 0;

  // Calculate trucks due for service (based on mileage - example: every 10,000 km)
  const trucksDueForService = trucks?.filter(truck => {
    const lastServiceMileage = truck.last_service_mileage || 0;
    const currentMileage = truck.mileage || 0;
    return (currentMileage - lastServiceMileage) >= 10000;
  }).length || 0;

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
              Service Management
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track maintenance, costs, and service history for Approved Logistics Limited</p>
          </div>
          <Button 
            onClick={() => setShowScheduleModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Service
          </Button>
        </div>

        {/* Service Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{totalServices}</p>
                </div>
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{scheduledServices}</p>
                </div>
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{inProgressServices}</p>
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{completedServices}</p>
                </div>
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Due for Service</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{trucksDueForService}</p>
                </div>
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg. Cost</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">KSh {averageServiceCost.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Records */}
        <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Service Records & History</CardTitle>
            <CardDescription className="text-sm">Complete maintenance history with cost breakdowns</CardDescription>
          </CardHeader>
          <CardContent>
            <FilterExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterApply={handleFilterApply}
              onExport={handleExport}
              filterOptions={{
                status: ['scheduled', 'in_progress', 'completed'],
                types: ['repair', 'maintenance', 'inspection']
              }}
            />

            <div className="space-y-4 mt-6">
              {filteredRecords.map((record) => {
                const partsUsed = record.parts_used ? (typeof record.parts_used === 'string' ? JSON.parse(record.parts_used) : record.parts_used) : [];
                const partsCount = Array.isArray(partsUsed) ? partsUsed.length : 0;
                
                return (
                  <div key={record.id} className="border-2 border-yellow-300/50 dark:border-yellow-600/50 rounded-lg p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <h3 className="font-semibold text-foreground text-sm sm:text-base">
                            {record.trucks?.truck_number || 'Unknown Truck'}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {record.trucks?.make} {record.trucks?.model}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(record.status) + " border text-xs"}>
                          {record.status}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
                          {record.maintenance_type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Service Type</p>
                        <p className="font-medium text-foreground text-sm">{record.maintenance_type}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Technician</p>
                        <p className="font-medium text-foreground text-sm">{record.technician || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Total Cost</p>
                        <p className="font-medium text-foreground text-sm">KSh {record.cost?.toLocaleString() || '0'}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Parts Used</p>
                        <p className="font-medium text-foreground text-sm">{partsCount} items</p>
                      </div>
                    </div>

                    {record.service_provider && (
                      <div className="mb-4">
                        <p className="text-xs sm:text-sm text-muted-foreground">Service Provider</p>
                        <p className="font-medium text-foreground text-sm">{record.service_provider}</p>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
                      <p className="font-medium text-foreground text-sm">{record.description}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Service Date: {new Date(record.service_date).toLocaleDateString()}</span>
                        </div>
                        {record.mileage_at_service && (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>Mileage: {record.mileage_at_service.toLocaleString()} km</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-xs"
                          onClick={() => setSelectedService(record)}
                        >
                          View Details
                        </Button>
                        {record.status === "scheduled" && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                            onClick={() => handleStatusUpdate(record.id, 'in_progress')}
                          >
                            Start Service
                          </Button>
                        )}
                        {record.status === "in_progress" && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => handleStatusUpdate(record.id, 'completed')}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {(!filteredRecords || filteredRecords.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No maintenance records found. Start by scheduling a service.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        <ScheduleServiceModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleService}
        />
      </div>
    </Layout>
  );
};

export default ServiceManagement;
