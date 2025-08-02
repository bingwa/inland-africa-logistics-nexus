import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Truck, Users, Route, AlertTriangle, Settings, Calendar, Loader2, TrendingUp, MapPin, FileText, Fuel, DollarSign, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTrucks, useTrips, useDrivers, useMaintenance, useFuelRecords } from "@/hooks/useSupabaseData";
// import { TruckDetailsModal } from "@/components/TruckDetailsModal";
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

  // Helper functions (moved up to avoid temporal dead zone)
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

  // Calculate analytics
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

  // Get current month data for truck analytics  
  const getTruckAnalytics = (truckId: string) => {
    // Get maintenance records for this truck this month
    const truckMaintenance = maintenance?.filter(record => 
      record.truck_id === truckId && 
      new Date(record.service_date).getMonth() === currentMonth &&
      new Date(record.service_date).getFullYear() === currentYear
    ) || [];
    
    // Get fuel records for this truck this month
    const truckFuelRecords = fuelRecords?.filter(record => 
      record.truck_id === truckId && 
      new Date(record.fuel_date).getMonth() === currentMonth &&
      new Date(record.fuel_date).getFullYear() === currentYear
    ) || [];
    
    const totalMaintenanceCost = truckMaintenance.reduce((sum, record) => sum + (record.cost || 0), 0);
    const totalFuelConsumed = truckFuelRecords.reduce((sum, record) => sum + (record.liters || 0), 0);
    const totalFuelCost = truckFuelRecords.reduce((sum, record) => sum + (record.total_cost || 0), 0);
    
    // Calculate average fuel consumption rate (liters per refuel)
    const avgFuelConsumption = truckFuelRecords.length > 0 ? totalFuelConsumed / truckFuelRecords.length : 0;
    
    // Calculate average maintenance spend
    const avgMaintenanceSpend = truckMaintenance.length > 0 ? totalMaintenanceCost / truckMaintenance.length : 0;
    
    // Get truck compliance status
    const truck = trucks?.find(t => t.id === truckId);
    const complianceStatus = truck ? getComplianceStatus(truck) : 'unknown';
    
    return {
      serviceCheckups: truckMaintenance.length,
      totalFuelConsumed: Math.round(totalFuelConsumed),
      totalFuelCost: Math.round(totalFuelCost * 130), // Convert to KSh
      totalMaintenanceCost: Math.round(totalMaintenanceCost * 130), // Convert to KSh
      avgFuelConsumption: Math.round(avgFuelConsumption * 10) / 10, // Round to 1 decimal
      avgMaintenanceSpend: Math.round(avgMaintenanceSpend * 130), // Convert to KSh
      fuelRecordsCount: truckFuelRecords.length,
      complianceStatus
    };
  };

  const compliantTrucks = trucks?.filter(truck => getComplianceStatus(truck) === 'compliant').length || 0;
  const expiringCerts = trucks?.filter(truck => {
    const status = getComplianceStatus(truck);
    return status === 'expiring-soon' || status === 'non-compliant';
  }).length || 0;

  // Generate truck report
  const generateTruckReport = (truckId: string) => {
    const truck = trucks?.find(t => t.id === truckId);
    if (!truck) return;

    const analytics = getTruckAnalytics(truckId);
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Get maintenance records with spare parts for this truck this month
    const truckMaintenance = maintenance?.filter(record => 
      record.truck_id === truckId && 
      new Date(record.service_date).getMonth() === new Date().getMonth() &&
      new Date(record.service_date).getFullYear() === new Date().getFullYear()
    ) || [];

    // Get fuel records for this truck this month
    const truckFuelRecords = fuelRecords?.filter(record => 
      record.truck_id === truckId && 
      new Date(record.fuel_date).getMonth() === new Date().getMonth() &&
      new Date(record.fuel_date).getFullYear() === new Date().getFullYear()
    ) || [];

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Truck Performance Report - ${truck.truck_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .metric { background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; }
            .metric h3 { margin: 0 0 10px 0; color: #333; }
            .metric p { margin: 0; font-size: 18px; font-weight: bold; color: #007bff; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .compliance-${analytics.complianceStatus} { color: ${analytics.complianceStatus === 'compliant' ? 'green' : analytics.complianceStatus === 'expiring-soon' ? 'orange' : 'red'}; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Approved Logistics Limited</h1>
            <h2>Truck Performance Report</h2>
            <p><strong>Truck:</strong> ${truck.truck_number} - ${truck.make} ${truck.model}</p>
            <p><strong>Report Period:</strong> ${currentMonth}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h3>Vehicle Information</h3>
            <div class="metrics">
              <div class="metric">
                <h4>License Plate</h4>
                <p>${truck.license_plate}</p>
              </div>
              <div class="metric">
                <h4>Capacity</h4>
                <p>${truck.capacity_tons} tons</p>
              </div>
              <div class="metric">
                <h4>Fuel Type</h4>
                <p>${truck.fuel_type}</p>
              </div>
              <div class="metric">
                <h4>Compliance Status</h4>
                <p class="compliance-${analytics.complianceStatus}">${analytics.complianceStatus.replace('-', ' ').toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Monthly Performance Metrics</h3>
            <div class="metrics">
              <div class="metric">
                <h4>Service Checkups</h4>
                <p>${analytics.serviceCheckups}</p>
              </div>
              <div class="metric">
                <h4>Fuel Consumed</h4>
                <p>${analytics.totalFuelConsumed}L</p>
              </div>
              <div class="metric">
                <h4>Avg Fuel Consumption</h4>
                <p>${analytics.avgFuelConsumption}L per refuel</p>
              </div>
              <div class="metric">
                <h4>Total Fuel Cost</h4>
                <p>KSh ${analytics.totalFuelCost.toLocaleString()}</p>
              </div>
              <div class="metric">
                <h4>Total Maintenance Cost</h4>
                <p>KSh ${analytics.totalMaintenanceCost.toLocaleString()}</p>
              </div>
              <div class="metric">
                <h4>Avg Service Cost</h4>
                <p>KSh ${analytics.avgMaintenanceSpend.toLocaleString()}</p>
              </div>
            </div>
          </div>

          ${truckMaintenance.length > 0 ? `
          <div class="section">
            <h3>Service Records (${currentMonth})</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service Type</th>
                  <th>Description</th>
                  <th>Cost (KSh)</th>
                  <th>Provider</th>
                  <th>Spares/Items</th>
                </tr>
              </thead>
              <tbody>
                ${truckMaintenance.map(m => `
                  <tr>
                    <td>${new Date(m.service_date).toLocaleDateString()}</td>
                    <td>${m.maintenance_type}</td>
                    <td>${m.description}</td>
                    <td>${Math.round(m.cost * 130).toLocaleString()}</td>
                    <td>${m.service_provider || 'N/A'}</td>
                    <td>${m.items_purchased || 'None'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${truckFuelRecords.length > 0 ? `
          <div class="section">
            <h3>Fuel Records (${currentMonth})</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Liters</th>
                  <th>Cost per Liter (KSh)</th>
                  <th>Total Cost (KSh)</th>
                  <th>Station</th>
                  <th>Odometer</th>
                </tr>
              </thead>
              <tbody>
                ${truckFuelRecords.map(f => `
                  <tr>
                    <td>${new Date(f.fuel_date).toLocaleDateString()}</td>
                    <td>${f.liters}</td>
                    <td>${Math.round(f.cost_per_liter * 130)}</td>
                    <td>${Math.round(f.total_cost * 130).toLocaleString()}</td>
                    <td>${f.fuel_station || 'N/A'}</td>
                    <td>${f.odometer_reading || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="section">
            <h3>Compliance Status Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NTSA Certificate</td>
                  <td>${truck.ntsa_expiry ? new Date(truck.ntsa_expiry).toLocaleDateString() : 'Not set'}</td>
                  <td class="compliance-${getCertificateStatus(truck.ntsa_expiry)}">${getCertificateStatus(truck.ntsa_expiry).toUpperCase()}</td>
                </tr>
                <tr>
                  <td>Insurance</td>
                  <td>${truck.insurance_expiry ? new Date(truck.insurance_expiry).toLocaleDateString() : 'Not set'}</td>
                  <td class="compliance-${getCertificateStatus(truck.insurance_expiry)}">${getCertificateStatus(truck.insurance_expiry).toUpperCase()}</td>
                </tr>
                <tr>
                  <td>TGL Certificate</td>
                  <td>${truck.tgl_expiry ? new Date(truck.tgl_expiry).toLocaleDateString() : 'Not set'}</td>
                  <td class="compliance-${getCertificateStatus(truck.tgl_expiry)}">${getCertificateStatus(truck.tgl_expiry).toUpperCase()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button class="no-print" onclick="window.print()" style="margin: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
        </body>
      </html>
    `;

    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
  };

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
                            <p className="text-sm text-muted-foreground">Service Checkups</p>
                            <p className="text-xl font-bold text-blue-600">{analytics.serviceCheckups}</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <p className="text-sm text-muted-foreground">Fuel Consumed</p>
                            <p className="text-xl font-bold text-green-600">{analytics.totalFuelConsumed}L</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <p className="text-sm text-muted-foreground">Avg Fuel Rate</p>
                            <p className="text-sm font-bold text-purple-600">{analytics.avgFuelConsumption}L</p>
                          </div>
                          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <p className="text-sm text-muted-foreground">Avg Service Cost</p>
                            <p className="text-sm font-bold text-orange-600">KSh {analytics.avgMaintenanceSpend.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm font-medium">Compliance Status:</span>
                          <Badge 
                            variant={analytics.complianceStatus === 'compliant' ? 'default' : 
                                   analytics.complianceStatus === 'expiring-soon' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {analytics.complianceStatus.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 text-xs"
                            onClick={() => setSelectedTruck(truck.id)}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => generateTruckReport(truck.id)}
                          >
                            Print Report
                          </Button>
                        </div>
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