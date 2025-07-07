
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterExportBar } from "@/components/FilterExportBar";
import { Calendar, Settings, Truck, Loader2, Clock, CheckCircle, DollarSign, FileText } from "lucide-react";
import { useState } from "react";
import { useOngoingMaintenance, useCreateMaintenance, useUpdateMaintenanceStatus } from "@/hooks/useSupabaseData";
import { AddMaintenanceRecord } from "@/components/forms/AddMaintenanceRecord";
import { MaintenanceDetailsModal } from "@/components/MaintenanceDetailsModal";
import { ScheduleServiceModal } from "@/components/ScheduleServiceModal";
import { useToast } from "@/hooks/use-toast";

const ServiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const { data: maintenance, isLoading, error } = useOngoingMaintenance();
  const createMaintenance = useCreateMaintenance();
  const updateMaintenanceStatus = useUpdateMaintenanceStatus();
  const { toast } = useToast();

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
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'in_progress': 'bg-blue-100 text-blue-800 border-blue-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'overdue': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const filteredRecords = maintenance?.filter(record => {
    const matchesSearch = record.maintenance_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.trucks?.truck_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const totalServices = maintenance?.length || 0;
  const pendingServices = maintenance?.filter(record => record.status === 'pending').length || 0;
  const inProgressServices = maintenance?.filter(record => record.status === 'in_progress').length || 0;
  const totalCost = maintenance?.reduce((sum, record) => sum + (record.cost || 0), 0) || 0;

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters:', filters);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting service records in ${format} format`);
  };

  const handleCompleteService = async (recordId: string) => {
    try {
      await updateMaintenanceStatus.mutateAsync({
        id: recordId,
        status: 'completed'
      });
      
      toast({
        title: "Service Completed",
        description: "Maintenance service has been marked as completed successfully.",
      });
    } catch (error) {
      console.error('Failed to complete service:', error);
      toast({
        title: "Error",
        description: "Failed to complete service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleService = async (serviceData: any) => {
    try {
      const maintenanceData = {
        truck_id: serviceData.truckId,
        maintenance_type: serviceData.maintenanceType,
        description: serviceData.description,
        service_date: new Date(serviceData.serviceDate).toISOString().split('T')[0],
        cost: serviceData.cost,
        technician: serviceData.technician || null,
        service_provider: serviceData.serviceProvider || null,
        status: 'pending',
        items_purchased: serviceData.itemsPurchased || null
      };

      await createMaintenance.mutateAsync(maintenanceData);
      
      toast({
        title: "Service Scheduled",
        description: "Maintenance service has been successfully scheduled.",
      });
    } catch (error) {
      console.error('Failed to schedule service:', error);
      toast({
        title: "Error",
        description: "Failed to schedule service. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
              Ongoing Service Management
            </h1>
            <p className="text-muted-foreground">Manage ongoing truck maintenance and service records</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={() => setShowAddForm(true)}
          >
            Schedule New Service
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ongoing Services</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalServices}</p>
                </div>
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Services</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{pendingServices}</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{inProgressServices}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">KSh {Math.round(totalCost * 130 / 1000000 * 10) / 10}M</p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Records Overview */}
        <Card className="border-2 border-blue-400/50">
          <CardHeader>
            <CardTitle>Ongoing Service Records</CardTitle>
            <CardDescription>Track and manage ongoing truck maintenance and service activities</CardDescription>
          </CardHeader>
          <CardContent>
            <FilterExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterApply={handleFilterApply}
              onExport={handleExport}
              filterOptions={{
                status: ['pending', 'in_progress'],
                types: ['engine', 'brakes', 'transmission', 'electrical', 'suspension', 'tires', 'other']
              }}
            />

            <div className="space-y-4 mt-6">
              {filteredRecords.map((record) => {
                const isCompleted = record.status === 'completed';
                
                return (
                  <div key={record.id} className="border-2 border-yellow-300/50 dark:border-yellow-600/50 rounded-lg p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{record.maintenance_type}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                          <div className="text-muted-foreground">
                            <span className="font-medium">Truck:</span> {record.trucks?.truck_number || 'N/A'}
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium">Service Date:</span> {new Date(record.service_date).toLocaleDateString()}
                          </div>
                        </div>
                        {record.items_purchased && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-muted-foreground">Items:</span> {record.items_purchased}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Cost</p>
                          <p className="font-medium text-foreground">KSh {Math.round(record.cost * 130).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Provider</p>
                          <p className="font-medium text-foreground">{record.service_provider || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Technician</p>
                          <p className="font-medium text-foreground">{record.technician || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Downtime</p>
                          <p className="font-medium text-foreground">{record.downtime_hours || 0}h</p>
                        </div>
                      </div>
                    </div>
                    
                    {record.next_service_date && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Next Service: {new Date(record.next_service_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                        onClick={() => setSelectedRecord(record)}
                      >
                        View Details
                      </Button>
                      {record.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-400 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={() => handleCompleteService(record.id)}
                          disabled={updateMaintenanceStatus.isPending}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete Service
                        </Button>
                      )}
                      {!isCompleted && record.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-400 text-foreground hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={() => setShowScheduleModal(true)}
                        >
                          Schedule Service
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {(!maintenance || maintenance.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No ongoing maintenance records found. All services are completed.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        {showAddForm && (
          <AddMaintenanceRecord onClose={() => setShowAddForm(false)} />
        )}

        {selectedRecord && (
          <MaintenanceDetailsModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}

        {showScheduleModal && (
          <ScheduleServiceModal
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
            onSchedule={handleScheduleService}
          />
        )}
      </div>
    </Layout>
  );
};

export default ServiceManagement;
