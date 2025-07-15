import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FilterExportBar } from "@/components/FilterExportBar";
import { Truck, Plus, Calendar, Gauge, MapPin, Settings, Loader2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useTrucks, useUpdateTruckStatus } from "@/hooks/useSupabaseData";
import { AddTruckForm } from "@/components/forms/AddTruckForm";
import { TruckDetailsModal } from "@/components/TruckDetailsModal";
import { useToast } from "@/hooks/use-toast";

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const { data: trucks, isLoading, error, refetch } = useTrucks();
  const updateTruckStatus = useUpdateTruckStatus();
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
          Error loading trucks: {error.message}
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400',
      'in_transit': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400',
      'maintenance': 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400',
      'inactive': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/20 dark:text-gray-400';
  };

  const getCertificateStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: 'missing', color: 'text-red-600', icon: AlertTriangle };
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-600', icon: AlertTriangle };
    if (diffDays <= 30) return { status: 'expiring', color: 'text-yellow-600', icon: Clock };
    return { status: 'valid', color: 'text-green-600', icon: CheckCircle };
  };

  const filteredTrucks = trucks?.filter(truck => {
    const matchesSearch = truck.truck_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const totalTrucks = trucks?.length || 0;
  const activeTrucks = trucks?.filter(truck => truck.status === 'active').length || 0;
  const maintenanceTrucks = trucks?.filter(truck => truck.status === 'maintenance').length || 0;
  const inTransitTrucks = trucks?.filter(truck => truck.status === 'in_transit').length || 0;

  const handleFilterApply = (filters: any) => {
    console.log('Applying filters:', filters);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting fleet data in ${format} format`);
  };

  const handleStatusUpdate = async (truckId: string, newStatus: string) => {
    try {
      await updateTruckStatus.mutateAsync({ id: truckId, status: newStatus });
      await refetch(); // Refresh the trucks data
      toast({
        title: "Status Updated",
        description: `Truck status has been updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Failed to update truck status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update truck status. Please try again.",
        variant: "destructive",
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
              <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
              Fleet Management
            </h1>
            <p className="text-muted-foreground">Manage your truck fleet, documents, and compliance</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Truck
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Trucks</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalTrucks}</p>
                </div>
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Trucks</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{activeTrucks}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Maintenance</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{maintenanceTrucks}</p>
                </div>
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{inTransitTrucks}</p>
                </div>
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Overview */}
        <Card className="border-2 border-blue-400/50">
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
            <CardDescription>Complete list of all trucks with compliance status and key information</CardDescription>
          </CardHeader>
          <CardContent>
            <FilterExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterApply={handleFilterApply}
              onExport={handleExport}
              filterOptions={{
                status: ['active', 'maintenance', 'in_transit', 'inactive'],
                make: ['Isuzu', 'Mercedes Benz', 'Volvo', 'Scania']
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6">
              {filteredTrucks.map((truck) => {
                const ntsaStatus = getCertificateStatus(truck.ntsa_expiry);
                const insuranceStatus = getCertificateStatus(truck.insurance_expiry);
                const tglStatus = getCertificateStatus(truck.tgl_expiry);
                
                // Determine overall compliance status
                const hasExpiredDocs = [ntsaStatus, insuranceStatus, tglStatus].some(status => status.status === 'expired');
                const hasExpiringSoon = [ntsaStatus, insuranceStatus, tglStatus].some(status => status.status === 'expiring');
                const allValid = [ntsaStatus, insuranceStatus, tglStatus].every(status => status.status === 'valid');
                
                let complianceStatus = 'incomplete';
                let complianceColor = 'text-red-600';
                
                if (allValid) {
                  complianceStatus = 'complete';
                  complianceColor = 'text-green-600';
                } else if (hasExpiredDocs) {
                  complianceStatus = 'expired';
                  complianceColor = 'text-red-600';
                } else if (hasExpiringSoon) {
                  complianceStatus = 'expiring';
                  complianceColor = 'text-yellow-600';
                }

                return (
                  <Card key={truck.id} className="border-2 border-yellow-300/50 dark:border-yellow-600/50 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{truck.truck_number}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(truck.status) + " border text-xs"}>
                            {truck.status}
                          </Badge>
                          <Badge className={`${complianceColor} border text-xs`} variant="outline">
                            {complianceStatus}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        {truck.make} {truck.model} ({truck.year})
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">License Plate</p>
                          <p className="font-medium text-foreground">{truck.license_plate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Capacity</p>
                          <p className="font-medium text-foreground">{truck.capacity_tons} tons</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mileage</p>
                          <p className="font-medium text-foreground">{(truck.mileage || 0).toLocaleString()} km</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fuel Type</p>
                          <p className="font-medium text-foreground">{truck.fuel_type}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Document Status */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Document Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1">
                            <ntsaStatus.icon className={`w-3 h-3 ${ntsaStatus.color}`} />
                            <span className="text-xs">NTSA</span>
                            {truck.ntsa_expiry && (
                              <span className="text-xs text-muted-foreground">
                                ({new Date(truck.ntsa_expiry).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <insuranceStatus.icon className={`w-3 h-3 ${insuranceStatus.color}`} />
                            <span className="text-xs">Insurance</span>
                            {truck.insurance_expiry && (
                              <span className="text-xs text-muted-foreground">
                                ({new Date(truck.insurance_expiry).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <tglStatus.icon className={`w-3 h-3 ${tglStatus.color}`} />
                            <span className="text-xs">TGL</span>
                            {truck.tgl_expiry && (
                              <span className="text-xs text-muted-foreground">
                                ({new Date(truck.tgl_expiry).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {truck.next_service_due && (
                        <>
                          <Separator />
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Next Service: {new Date(truck.next_service_due).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          onClick={() => setSelectedTruck(truck)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant={truck.status === 'active' ? "default" : "outline"}
                          className={truck.status === 'active' ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-400 text-foreground hover:bg-green-50 dark:hover:bg-green-900/20"}
                          onClick={() => handleStatusUpdate(truck.id, truck.status === 'active' ? 'maintenance' : 'active')}
                          disabled={updateTruckStatus.isPending}
                        >
                          {updateTruckStatus.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <Settings className="w-3 h-3 mr-1" />
                          )}
                          {truck.status === 'active' ? 'Set Maintenance' : 'Set Active'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {(!trucks || trucks.length === 0) && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No trucks found. Add your first truck to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        {showAddForm && (
          <AddTruckForm onClose={() => setShowAddForm(false)} />
        )}

        {selectedTruck && (
          <TruckDetailsModal
            truck={selectedTruck}
            onClose={() => setSelectedTruck(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </Layout>
  );
};

export default FleetManagement;
