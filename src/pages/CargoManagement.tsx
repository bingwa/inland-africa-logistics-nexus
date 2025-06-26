
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FilterExportBar } from "@/components/FilterExportBar";
import { Package, Search, Plus, MapPin, Clock, Weight, DollarSign, Thermometer, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCargo } from "@/hooks/useSupabaseData";

const CargoManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState({});
  const { data: cargoData, isLoading, error } = useCargo();

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
          Error loading cargo: {error.message}
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'in_transit': 'bg-blue-100 text-blue-800 border-blue-300',
      'delivered': 'bg-green-100 text-green-800 border-green-300',
      'delayed': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getCategoryIcon = (category: string) => {
    if (category?.toLowerCase().includes('perishable') || category?.toLowerCase().includes('food')) {
      return <Thermometer className="w-4 h-4" />;
    }
    return <Shield className="w-4 h-4" />;
  };

  const filteredCargo = cargoData?.filter(cargo => {
    const matchesSearch = cargo.cargo_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cargo.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cargo.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const totalCargo = cargoData?.length || 0;
  const inTransitCargo = cargoData?.filter(c => c.status === 'in_transit').length || 0;
  const deliveredCargo = cargoData?.filter(c => c.status === 'delivered').length || 0;
  const totalValue = cargoData?.reduce((sum, cargo) => sum + (cargo.value || 0), 0) || 0;

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting cargo data in ${format} format`);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Package className="w-6 h-6 sm:w-8 sm:h-8" />
              Cargo Management
            </h1>
            <p className="text-muted-foreground">Track and manage cargo shipments and deliveries</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Cargo
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cargo</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalCargo}</p>
                </div>
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{inTransitCargo}</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{deliveredCargo}</p>
                </div>
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    KSh {Math.round(totalValue * 130 / 1000000 * 10) / 10}M
                  </p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cargo Overview */}
        <Card className="border-2 border-blue-400/50">
          <CardHeader>
            <CardTitle>Cargo Tracking Overview</CardTitle>
            <CardDescription>Monitor and track all cargo shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <FilterExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterApply={handleFilterApply}
              onExport={handleExport}
              filterOptions={{
                status: ['pending', 'in_transit', 'delivered', 'delayed'],
                types: ['perishable', 'non_perishable', 'fragile', 'hazardous']
              }}
            />

            {/* Cargo Items */}
            <div className="space-y-4 mt-6">
              {filteredCargo.map((cargo) => (
                <Card key={cargo.id} className="hover:shadow-md transition-shadow border-2 border-blue-300/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{cargo.cargo_number}</h3>
                          <Badge className={getStatusColor(cargo.status) + " border"}>
                            {cargo.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {getCategoryIcon(cargo.description)}
                            <span>
                              {cargo.description?.toLowerCase().includes('perishable') ? 'Perishable' : 'Non-Perishable'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                          <div className="text-muted-foreground">
                            <span className="font-medium">Client:</span> {cargo.client_name}
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium">Contact:</span> {cargo.client_contact || 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Weight</p>
                          <p className="font-medium text-foreground flex items-center gap-1">
                            <Weight className="w-3 h-3" />
                            {cargo.weight_kg}kg
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Value</p>
                          <p className="font-medium text-foreground">
                            KSh {Math.round((cargo.value || 0) * 130).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Origin</p>
                          <p className="font-medium text-foreground">{cargo.pickup_address?.split(',')[0] || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Destination</p>
                          <p className="font-medium text-foreground">{cargo.delivery_address?.split(',')[0] || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">{cargo.description}</p>
                      {cargo.special_instructions && (
                        <p className="text-sm text-orange-600 mt-1">
                          <span className="font-medium">Special Instructions:</span> {cargo.special_instructions}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
                      <Button size="sm" variant="outline" className="border-blue-400 text-foreground hover:bg-blue-50">
                        Track Location
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-400 text-foreground hover:bg-green-50">
                        Update Status
                      </Button>
                      <Button size="sm" variant="outline" className="border-yellow-400 text-foreground hover:bg-yellow-50">
                        Generate Label
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-400 text-foreground hover:bg-purple-50">
                        Contact Client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!cargoData || cargoData.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No cargo found. Add your first cargo shipment to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CargoManagement;
