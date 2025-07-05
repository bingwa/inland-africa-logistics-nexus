
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Route, AlertTriangle, Settings, Calendar, Loader2, TrendingUp, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTrucks, useTrips, useDrivers, useMaintenance, useFuelRecords } from "@/hooks/useSupabaseData";
import { useState } from "react";

const Dashboard = () => {
  const { data: trucks, isLoading: trucksLoading } = useTrucks();
  const { data: trips, isLoading: tripsLoading } = useTrips();
  const { data: drivers, isLoading: driversLoading } = useDrivers();
  const { data: maintenance, isLoading: maintenanceLoading } = useMaintenance();
  const { data: fuelRecords, isLoading: fuelLoading } = useFuelRecords();

  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  const isLoading = trucksLoading || tripsLoading || driversLoading || maintenanceLoading || fuelLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  // Fleet Statistics
  const totalTrucks = trucks?.length || 0;
  const activeTrucks = trucks?.filter(truck => truck.status === 'active').length || 0;
  const totalDrivers = drivers?.length || 0;
  const activeDrivers = drivers?.filter(driver => driver.status === 'active').length || 0;

  // Trip Statistics
  const totalTrips = trips?.length || 0;
  const completedTrips = trips?.filter(trip => trip.status === 'completed').length || 0;
  const inTransitTrips = trips?.filter(trip => trip.status === 'in_transit').length || 0;
  const recentTrips = trips?.slice(0, 5) || [];

  // Maintenance Statistics
  const totalMaintenanceRecords = maintenance?.length || 0;
  const pendingMaintenance = maintenance?.filter(m => m.status === 'pending').length || 0;
  const completedMaintenance = maintenance?.filter(m => m.status === 'completed').length || 0;
  const totalMaintenanceCost = maintenance?.reduce((sum, m) => sum + (m.cost || 0), 0) || 0;

  // Get current month data for truck analytics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getTruckAnalytics = (truckId: string) => {
    const truckTrips = trips?.filter(trip => 
      trip.truck_id === truckId && 
      new Date(trip.created_at).getMonth() === currentMonth &&
      new Date(trip.created_at).getFullYear() === currentYear
    ) || [];

    const truckFuel = fuelRecords?.filter(fuel => 
      fuel.truck_id === truckId &&
      new Date(fuel.fuel_date).getMonth() === currentMonth &&
      new Date(fuel.fuel_date).getFullYear() === currentYear
    ) || [];

    const totalMileage = truckTrips.reduce((sum, trip) => sum + (trip.distance_km || 0), 0);
    const totalFuelCost = truckFuel.reduce((sum, fuel) => sum + (fuel.total_cost || 0), 0);
    const routes = [...new Set(truckTrips.map(trip => `${trip.origin} → ${trip.destination}`))];

    return {
      tripsCount: truckTrips.length,
      totalMileage: Math.round(totalMileage),
      totalFuelCost: Math.round(totalFuelCost * 130), // Convert to KSh
      routes: routes.slice(0, 3), // Show top 3 routes
      completedTrips: truckTrips.filter(trip => trip.status === 'completed').length
    };
  };

  // Compliance Statistics
  const getCertificateStatus = (expiryDate: string | null) => {
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

  const compliantTrucks = trucks?.filter(truck => getComplianceStatus(truck) === 'compliant').length || 0;
  const expiringCerts = trucks?.filter(truck => {
    const status = getComplianceStatus(truck);
    return status === 'expiring-soon' || status === 'non-compliant';
  }).length || 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of Approved Logistics Limited operations</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Trucks</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{activeTrucks}</p>
                  <p className="text-xs text-muted-foreground">of {totalTrucks} total</p>
                </div>
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Drivers</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{activeDrivers}</p>
                  <p className="text-xs text-muted-foreground">of {totalDrivers} total</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trips in Transit</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{inTransitTrips}</p>
                  <p className="text-xs text-muted-foreground">{completedTrips} completed</p>
                </div>
                <Route className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Issues</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{expiringCerts}</p>
                  <p className="text-xs text-muted-foreground">{compliantTrucks} compliant</p>
                </div>
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Truck Performance Analytics */}
        <Card className="border-2 border-blue-400/50 dark:border-blue-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Truck Performance Analytics
            </CardTitle>
            <CardDescription>Detailed performance metrics for each truck this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {trucks?.map((truck) => {
                const analytics = getTruckAnalytics(truck.id);
                return (
                  <Card key={truck.id} className="border border-muted hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{truck.truck_number}</h3>
                        <Badge variant="outline" className="text-xs">
                          {truck.make} {truck.model}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <p className="text-sm text-muted-foreground">Trips</p>
                            <p className="text-xl font-bold text-blue-600">{analytics.tripsCount}</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-xl font-bold text-green-600">{analytics.completedTrips}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <p className="text-sm text-muted-foreground">Mileage</p>
                            <p className="text-sm font-bold text-purple-600">{analytics.totalMileage.toLocaleString()} km</p>
                          </div>
                          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <p className="text-sm text-muted-foreground">Fuel Cost</p>
                            <p className="text-sm font-bold text-orange-600">KSh {analytics.totalFuelCost.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {analytics.routes.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Top Routes:
                            </p>
                            <div className="space-y-1">
                              {analytics.routes.map((route, index) => (
                                <p key={index} className="text-xs text-muted-foreground bg-muted/50 p-1 rounded">
                                  {route}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Fleet and Compliance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Fleet Status Overview
              </CardTitle>
              <CardDescription>Current fleet operational status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Active Trucks</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-bold">{activeTrucks}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">In Maintenance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-bold">{trucks?.filter(t => t.status === 'maintenance').length || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Inactive</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span className="text-sm font-bold">{trucks?.filter(t => t.status === 'inactive').length || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-400/50 dark:border-red-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Compliance Overview
              </CardTitle>
              <CardDescription>Kenyan licensing and certification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Fully Compliant</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-bold">{compliantTrucks}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expiring Soon</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-bold">{trucks?.filter(truck => getComplianceStatus(truck) === 'expiring-soon').length || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Non-Compliant</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-bold">{trucks?.filter(truck => getComplianceStatus(truck) === 'non-compliant').length || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-400/50 dark:border-blue-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Recent Trips
              </CardTitle>
              <CardDescription>Latest trip activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTrips.length > 0 ? recentTrips.map((trip, index) => (
                  <div key={trip.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{trip.trip_number}</p>
                      <p className="text-xs text-muted-foreground">{trip.origin} → {trip.destination}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {trip.status}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent trips</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-400/50 dark:border-green-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Maintenance Summary
              </CardTitle>
              <CardDescription>Service and maintenance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Services</span>
                  <span className="text-sm font-bold">{totalMaintenanceRecords}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm font-bold text-orange-600">{pendingMaintenance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm font-bold text-green-600">{completedMaintenance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Cost</span>
                  <span className="text-sm font-bold">KSh {Math.round(totalMaintenanceCost * 130).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
