
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Settings, Calendar, Gauge, User, Route, Loader2, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTrucks, useUpdateTruckStatus } from "@/hooks/useSupabaseData";
import { AddTruckForm } from "@/components/forms/AddTruckForm";
import { TruckDetailsModal } from "@/components/TruckDetailsModal";
import { FilterExportBar } from "@/components/FilterExportBar";

const FleetManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<any>({});
  const { data: trucks, isLoading, error } = useTrucks();
  const updateTruckStatus = useUpdateTruckStatus();

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
      case "active": return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400";
      case "in_transit": return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400";
      case "maintenance": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const getCertificateStatus = (expiryDate: string) => {
    if (!expiryDate) return 'missing';
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'expiring';
    return 'valid';
  };

  const getComplianceStatus = (truck: any) => {
    const ntsaStatus = getCertificateStatus(truck.ntsa_expiry);
    const insuranceStatus = getCertificateStatus(truck.insurance_expiry);
    const tglStatus = getCertificateStatus(truck.tgl_expiry);
    
    if ([ntsaStatus, insuranceStatus, tglStatus].includes('expired')) return 'non-compliant';
    if ([ntsaStatus, insuranceStatus, tglStatus].includes('expiring')) return 'expiring-soon';
    if ([ntsaStatus, insuranceStatus, tglStatus].includes('missing')) return 'incomplete';
    return 'compliant';
  };

  const handleStatusUpdate = async (truckId: string, newStatus: string) => {
    await updateTruckStatus.mutateAsync({ id: truckId, status: newStatus });
  };

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting fleet data in ${format} format`);
  };

  // Apply filters
  let filteredTrucks = trucks || [];
  
  if (searchTerm) {
    filteredTrucks = filteredTrucks.filter(truck =>
      truck.truck_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filters.status) {
    filteredTrucks = filteredTrucks.filter(truck => truck.status === filters.status);
  }

  const activeTrucks = trucks?.filter(truck => truck.status === 'active').length || 0;
  const totalMileage = trucks?.reduce((sum, truck) => sum + (truck.mileage || 0), 0) || 0;
  const estimatedFuelCost = Math.round(totalMileage * 0.15 * 150); // Convert to KSh
  const compliantTrucks = trucks?.filter(truck => getComplianceStatus(truck) === 'compliant').length || 0;
  const expiringCerts = trucks?.filter(truck => {
    const status = getComplianceStatus(truck);
    return status === 'expiring-soon' || status === 'non-compliant';
  }).length || 0;

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
            <p className="text-muted-foreground">Manage trucks, licensing, and compliance for Approved Logistics Limited</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Truck
          </Button>
        </div>

        {/* Fleet Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Trucks</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{trucks?.length || 0}</p>
                </div>
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{activeTrucks}</p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliant</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{compliantTrucks}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cert. Issues</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{expiringCerts}</p>
                </div>
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Est. Fuel Cost</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">KSh {estimatedFuelCost.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Monthly est.</p>
                </div>
                <Gauge className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Overview */}
        <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50">
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
            <CardDescription>View and manage all trucks with compliance monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <FilterExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterApply={handleFilterApply}
              onExport={handleExport}
              filterOptions={{
                status: ['active', 'in_transit', 'maintenance'],
                types: ['truck', 'trailer', 'van']
              }}
            />

            {/* Trucks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6">
              {filteredTrucks.map((truck) => {
                const complianceStatus = getComplianceStatus(truck);
                const complianceColor = {
                  'compliant': 'bg-green-100 text-green-800 border-green-300',
                  'expiring-soon': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                  'non-compliant': 'bg-red-100 text-red-800 border-red-300',
                  'incomplete': 'bg-gray-100 text-gray-800 border-gray-300'
                }[complianceStatus];

                return (
                  <Card key={truck.id} className="hover:shadow-md transition-shadow border-2 border-yellow-300/50 dark:border-yellow-600/50">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-foreground">{truck.truck_number}</CardTitle>
                          <CardDescription>{truck.make} {truck.model} ({truck.year})</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(truck.status) + " border"}>
                            {truck.status}
                          </Badge>
                          <Badge className={complianceColor + " border text-xs"}>
                            {complianceStatus.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
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

                      {/* Certification Quick Status */}
                      <div className="flex gap-1 text-xs">
                        <Badge variant="outline" className={getCertificateStatus(truck.ntsa_expiry) === 'valid' ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}>
                          NTSA
                        </Badge>
                        <Badge variant="outline" className={getCertificateStatus(truck.insurance_expiry) === 'valid' ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}>
                          Insurance
                        </Badge>
                        <Badge variant="outline" className={getCertificateStatus(truck.tgl_expiry) === 'valid' ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}>
                          TGL
                        </Badge>
                      </div>

                      {truck.next_service_due && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Next Service: {new Date(truck.next_service_due).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          onClick={() => setSelectedTruck(truck)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleStatusUpdate(truck.id, truck.status === 'active' ? 'maintenance' : 'active')}
                        >
                          {truck.status === 'active' ? 'Set Maintenance' : 'Set Active'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
