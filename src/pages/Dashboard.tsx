import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Route, AlertTriangle, Settings, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTrucks, useTrips, useDrivers, useMaintenance } from "@/hooks/useSupabaseData";

const Dashboard = () => {
  const { data: trucks, isLoading: trucksLoading } = useTrucks();
  const { data: trips, isLoading: tripsLoading } = useTrips();
  const { data: drivers, isLoading: driversLoading } = useDrivers();
  const { data: maintenance, isLoading: maintenanceLoading } = useMaintenance();

  const isLoading = trucksLoading || tripsLoading || driversLoading || maintenanceLoading;

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
