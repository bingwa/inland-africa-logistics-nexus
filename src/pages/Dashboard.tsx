import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Truck, Users, Route, AlertTriangle, Settings, Calendar, Loader2, TrendingUp, MapPin, FileText, Fuel, DollarSign, ShieldCheck } from "lucide-react";
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
  const [selectedTruckForReport, setSelectedTruckForReport] = useState<string>('all');

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

  // New Analytics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Fuel consumption analytics per truck
  const getFuelConsumptionAnalytics = () => {
    const truckFuelData = trucks?.map(truck => {
      const truckFuel = fuelRecords?.filter(fuel => 
        fuel.truck_id === truck.id &&
        new Date(fuel.fuel_date).getMonth() === currentMonth &&
        new Date(fuel.fuel_date).getFullYear() === currentYear
      ) || [];
      
      const totalLiters = truckFuel.reduce((sum, fuel) => sum + (fuel.liters || 0), 0);
      return {
        truck: truck.truck_number,
        totalLiters: Math.round(totalLiters)
      };
    }).filter(data => data.totalLiters > 0) || [];

    const totalConsumption = truckFuelData.reduce((sum, data) => sum + data.totalLiters, 0);
    const averageConsumption = truckFuelData.length > 0 ? Math.round(totalConsumption / truckFuelData.length) : 0;
    
    return { totalConsumption, averageConsumption, truckCount: truckFuelData.length };
  };

  // Total maintenance cost per truck
  const getMaintenanceCostAnalytics = () => {
    const truckMaintenanceData = trucks?.map(truck => {
      const truckMaintenance = maintenance?.filter(m => 
        m.truck_id === truck.id &&
        new Date(m.service_date).getMonth() === currentMonth &&
        new Date(m.service_date).getFullYear() === currentYear
      ) || [];
      
      const totalCost = truckMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0);
      return {
        truck: truck.truck_number,
        totalCost: Math.round(totalCost * 130) // Convert to KSh
      };
    }).filter(data => data.totalCost > 0) || [];

    const totalMaintenanceCost = truckMaintenanceData.reduce((sum, data) => sum + data.totalCost, 0);
    const averageMaintenanceCost = truckMaintenanceData.length > 0 ? Math.round(totalMaintenanceCost / truckMaintenanceData.length) : 0;
    
    return { totalMaintenanceCost, averageMaintenanceCost, trucksWithMaintenance: truckMaintenanceData.length };
  };

  // Compliance status analytics
  const getComplianceAnalytics = () => {
    const complianceData = trucks?.map(truck => {
      const ntsaStatus = getCertificateStatus(truck.ntsa_expiry);
      const insuranceStatus = getCertificateStatus(truck.insurance_expiry);
      const tglStatus = getCertificateStatus(truck.tgl_expiry);
      
      let score = 0;
      if (ntsaStatus === 'valid') score += 33.33;
      if (insuranceStatus === 'valid') score += 33.33;
      if (tglStatus === 'valid') score += 33.34;
      
      return {
        truck: truck.truck_number,
        score: Math.round(score),
        status: getComplianceStatus(truck)
      };
    }) || [];

    const averageCompliance = complianceData.length > 0 ? 
      Math.round(complianceData.reduce((sum, data) => sum + data.score, 0) / complianceData.length) : 0;
    
    const compliantCount = complianceData.filter(data => data.status === 'compliant').length;
    
    return { averageCompliance, compliantCount, totalTrucks: complianceData.length };
  };

  const fuelAnalytics = getFuelConsumptionAnalytics();
  const maintenanceAnalytics = getMaintenanceCostAnalytics();
  const complianceAnalytics = getComplianceAnalytics();

  // Additional statistics for compatibility
  const activeTrucks = trucks?.filter(truck => truck.status === 'active').length || 0;
  const recentTrips = trips?.slice(0, 5) || [];

  // Maintenance Statistics
  const totalMaintenanceRecords = maintenance?.length || 0;
  const pendingMaintenance = maintenance?.filter(m => m.status === 'pending').length || 0;
  const completedMaintenance = maintenance?.filter(m => m.status === 'completed').length || 0;
  const totalMaintenanceCost = maintenance?.reduce((sum, m) => sum + (m.cost || 0), 0) || 0;

  // Get current month data for truck analytics (removed duplicate declaration)

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

  // Generate maintenance report
  const generateMaintenanceReport = (period: 'monthly' | 'annual') => {
    const currentDate = new Date();
    let startDate: Date;

    if (period === 'monthly') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    } else {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
    }

    let filteredMaintenance = maintenance?.filter(m => 
      new Date(m.service_date) >= startDate && new Date(m.service_date) <= currentDate
    ) || [];

    if (selectedTruckForReport !== 'all') {
      filteredMaintenance = filteredMaintenance.filter(m => m.truck_id === selectedTruckForReport);
    }

    const totalCost = filteredMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0);
    const servicesByType = filteredMaintenance.reduce((acc, m) => {
      const types = m.maintenance_type.split(', ');
      types.forEach(type => {
        if (!acc[type]) acc[type] = { count: 0, cost: 0 };
        acc[type].count += 1;
        acc[type].cost += m.cost || 0;
      });
      return acc;
    }, {} as Record<string, { count: number; cost: number }>);

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const truckInfo = selectedTruckForReport === 'all' 
      ? 'All Trucks' 
      : trucks?.find(t => t.id === selectedTruckForReport)?.truck_number || 'Unknown Truck';

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Maintenance Report - ${period.charAt(0).toUpperCase() + period.slice(1)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; }
            .service-type { background-color: #e8f4fd; padding: 10px; margin: 10px 0; border-radius: 5px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Approved Logistics Limited</h1>
            <h2>Maintenance Report - ${period.charAt(0).toUpperCase() + period.slice(1)}</h2>
            <p><strong>Truck(s):</strong> ${truckInfo}</p>
            <p><strong>Period:</strong> ${startDate.toLocaleDateString()} - ${currentDate.toLocaleDateString()}</p>
          </div>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Services:</strong> ${filteredMaintenance.length}</p>
            <p><strong>Total Cost:</strong> KSh ${Math.round(totalCost * 130).toLocaleString()}</p>
            <p><strong>Service Types:</strong> ${Object.keys(servicesByType).length}</p>
          </div>

          <div class="service-types">
            <h3>Services by Type</h3>
            ${Object.entries(servicesByType).map(([type, data]) => `
              <div class="service-type">
                <strong>${type}:</strong> ${data.count} services, Total Cost: KSh ${Math.round(data.cost * 130).toLocaleString()}
              </div>
            `).join('')}
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Truck</th>
                <th>Service Type</th>
                <th>Description</th>
                <th>Cost (KSh)</th>
                <th>Provider</th>
                <th>Items Purchased</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMaintenance.map(m => `
                <tr>
                  <td>${new Date(m.service_date).toLocaleDateString()}</td>
                  <td>${m.trucks?.truck_number || 'N/A'}</td>
                  <td>${m.maintenance_type}</td>
                  <td>${m.description}</td>
                  <td>${Math.round(m.cost * 130).toLocaleString()}</td>
                  <td>${m.service_provider || 'N/A'}</td>
                  <td>${m.items_purchased || 'None'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <button class="no-print" onclick="window.print()" style="margin: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
        </body>
      </html>
    `;

    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of Approved Logistics Limited operations</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Fuel Consumption</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{fuelAnalytics.averageConsumption}L</p>
                  <p className="text-xs text-muted-foreground">{fuelAnalytics.truckCount} trucks this month</p>
                </div>
                <Fuel className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Maintenance Cost</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">KSh {maintenanceAnalytics.averageMaintenanceCost.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{maintenanceAnalytics.trucksWithMaintenance} trucks this month</p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fleet Compliance</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{complianceAnalytics.averageCompliance}%</p>
                  <p className="text-xs text-muted-foreground">{complianceAnalytics.compliantCount}/{complianceAnalytics.totalTrucks} compliant</p>
                </div>
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Reports Section */}
        <Card className="border-2 border-green-400/50 dark:border-green-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Maintenance Reports
            </CardTitle>
            <CardDescription>Generate detailed maintenance reports for trucks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Select Truck</Label>
                <Select value={selectedTruckForReport} onValueChange={setSelectedTruckForReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose truck" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trucks</SelectItem>
                    {trucks?.map(truck => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.truck_number} - {truck.make} {truck.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => generateMaintenanceReport('monthly')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Monthly Report
                </Button>
                <Button
                  onClick={() => generateMaintenanceReport('annual')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Annual Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
