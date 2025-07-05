import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Calendar, Download, FileText, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrucks, useDrivers, useTrips, useMaintenance, useFuelRecords } from "@/hooks/useSupabaseData";

interface CustomReportGeneratorProps {
  onClose: () => void;
}

export const CustomReportGenerator: React.FC<CustomReportGeneratorProps> = ({ onClose }) => {
  const [reportType, setReportType] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [reportName, setReportName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: trucks } = useTrucks();
  const { data: drivers } = useDrivers();
  const { data: trips } = useTrips();
  const { data: maintenance } = useMaintenance();
  const { data: fuelRecords } = useFuelRecords();
  const { toast } = useToast();

  const reportTypeOptions = [
    { value: 'fleet', label: 'Fleet Performance Report' },
    { value: 'truck_analytics', label: 'Truck Analytics Report' },
    { value: 'trips', label: 'Trip Analysis Report' },
    { value: 'drivers', label: 'Driver Performance Report' },
    { value: 'maintenance', label: 'Maintenance Report' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'fuel', label: 'Fuel Consumption Report' },
    { value: 'compliance', label: 'Compliance Report' },
    { value: 'custom', label: 'Custom Multi-Table Report' }
  ];

  const getColumnsForReportType = (type: string) => {
    switch (type) {
      case 'fleet':
        return ['truck_number', 'make', 'model', 'status', 'mileage', 'last_service_date', 'next_service_due'];
      case 'truck_analytics':
        return ['truck_number', 'monthly_trips', 'completed_trips', 'total_mileage', 'fuel_cost', 'top_routes', 'efficiency_rating'];
      case 'trips':
        return ['trip_number', 'origin', 'destination', 'status', 'planned_departure', 'actual_departure', 'distance_km', 'cargo_value_usd'];
      case 'drivers':
        return ['full_name', 'employee_id', 'license_number', 'hire_date', 'status', 'compliance_score'];
      case 'maintenance':
        return ['maintenance_type', 'service_date', 'cost', 'status', 'technician', 'description'];
      case 'fuel':
        return ['fuel_date', 'liters', 'total_cost', 'cost_per_liter', 'fuel_station', 'odometer_reading'];
      default:
        return [];
    }
  };

  const handleColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    }
  };

  const getTruckAnalytics = (truckId: string, fromDate?: Date, toDate?: Date) => {
    const startDate = fromDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = toDate || new Date();

    const truckTrips = trips?.filter(trip => 
      trip.truck_id === truckId && 
      new Date(trip.created_at) >= startDate &&
      new Date(trip.created_at) <= endDate
    ) || [];

    const truckFuel = fuelRecords?.filter(fuel => 
      fuel.truck_id === truckId &&
      new Date(fuel.fuel_date) >= startDate &&
      new Date(fuel.fuel_date) <= endDate
    ) || [];

    const totalMileage = truckTrips.reduce((sum, trip) => sum + (trip.distance_km || 0), 0);
    const totalFuelCost = truckFuel.reduce((sum, fuel) => sum + (fuel.total_cost || 0), 0);
    const routes = [...new Set(truckTrips.map(trip => `${trip.origin} → ${trip.destination}`))];
    const completedTrips = truckTrips.filter(trip => trip.status === 'completed').length;

    return {
      tripsCount: truckTrips.length,
      completedTrips,
      totalMileage: Math.round(totalMileage),
      totalFuelCost: Math.round(totalFuelCost * 130),
      topRoutes: routes.slice(0, 5).join('; '),
      efficiencyRating: completedTrips > 0 ? Math.round((completedTrips / truckTrips.length) * 100) : 0
    };
  };

  const generateReport = async () => {
    if (!reportType || !reportName) {
      toast({
        title: "Missing Information",
        description: "Please select a report type and enter a report name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportData = getReportData();
      generatePrintableReport(reportData);

      toast({
        title: "Report Generated Successfully",
        description: `${reportName} has been generated and is ready for viewing/printing.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportData = () => {
    let data: any[] = [];
    
    switch (reportType) {
      case 'fleet':
        data = trucks || [];
        break;
      case 'truck_analytics':
        data = trucks?.map(truck => {
          const analytics = getTruckAnalytics(truck.id, dateRange.from, dateRange.to);
          return {
            truck_number: truck.truck_number,
            make: truck.make,
            model: truck.model,
            monthly_trips: analytics.tripsCount,
            completed_trips: analytics.completedTrips,
            total_mileage: analytics.totalMileage,
            fuel_cost: analytics.totalFuelCost,
            top_routes: analytics.topRoutes,
            efficiency_rating: `${analytics.efficiencyRating}%`
          };
        }) || [];
        break;
      case 'trips':
        data = trips || [];
        break;
      case 'drivers':
        data = drivers || [];
        break;
      case 'maintenance':
        data = maintenance || [];
        break;
      case 'fuel':
        data = fuelRecords || [];
        break;
      default:
        data = [];
    }

    // Apply date filtering for non-analytics reports
    if (reportType !== 'truck_analytics' && dateRange.from && dateRange.to) {
      data = data.filter(item => {
        const itemDate = new Date(item.created_at || item.service_date || item.fuel_date);
        return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
      });
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        data = data.filter(item => 
          item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    return data;
  };

  const generatePrintableReport = (data: any[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Approved Logistics Limited</h1>
            <h2>${reportName}</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="company-info">
            <strong>Report Parameters:</strong><br>
            Report Type: ${reportTypeOptions.find(opt => opt.value === reportType)?.label}<br>
            Date Range: ${dateRange.from ? dateRange.from.toLocaleDateString() : 'All'} - ${dateRange.to ? dateRange.to.toLocaleDateString() : 'All'}<br>
            Total Records: ${data.length}
          </div>

          <div class="summary">
            <h3>Summary Statistics</h3>
            <p>Total Records: ${data.length}</p>
            ${reportType === 'trips' ? `<p>Total Distance: ${data.reduce((sum, item) => sum + (item.distance_km || 0), 0).toLocaleString()} km</p>` : ''}
            ${reportType === 'trips' ? `<p>Total Value: KSh ${data.reduce((sum, item) => sum + (item.cargo_value_usd * 130 || 0), 0).toLocaleString()}</p>` : ''}
            ${reportType === 'truck_analytics' ? `<p>Total Monthly Trips: ${data.reduce((sum, item) => sum + (item.monthly_trips || 0), 0)}</p>` : ''}
            ${reportType === 'truck_analytics' ? `<p>Total Monthly Mileage: ${data.reduce((sum, item) => sum + (item.total_mileage || 0), 0).toLocaleString()} km</p>` : ''}
            ${reportType === 'truck_analytics' ? `<p>Total Monthly Fuel Cost: KSh ${data.reduce((sum, item) => sum + (item.fuel_cost || 0), 0).toLocaleString()}</p>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                ${selectedColumns.length > 0 ? selectedColumns.map(col => `<th>${col.replace('_', ' ').toUpperCase()}</th>`).join('') : getColumnsForReportType(reportType).map(col => `<th>${col.replace('_', ' ').toUpperCase()}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  ${(selectedColumns.length > 0 ? selectedColumns : getColumnsForReportType(reportType)).map(col => {
                    let value = item[col] || 'N/A';
                    if (col === 'cargo_value_usd' && value !== 'N/A') {
                      value = `KSh ${(value * 130).toLocaleString()}`;
                    }
                    if (col === 'fuel_cost' && value !== 'N/A') {
                      value = `KSh ${value.toLocaleString()}`;
                    }
                    if (col.includes('date') && value !== 'N/A') {
                      value = new Date(value).toLocaleDateString();
                    }
                    return `<td>${value}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>This report was generated by Approved Logistics Limited Management System</p>
            <p>© ${new Date().getFullYear()} Approved Logistics Limited. All rights reserved.</p>
          </div>

          <button class="no-print" onclick="window.print()" style="margin: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Custom Report Generator
              </CardTitle>
              <CardDescription>Create detailed reports with custom parameters and filters</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Report Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                placeholder="Enter report name..."
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label>Date Range (Optional)</Label>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>

          {/* Column Selection */}
          {reportType && (
            <div>
              <Label>Select Columns to Include</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {getColumnsForReportType(reportType).map(column => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={column}
                      checked={selectedColumns.includes(column)}
                      onCheckedChange={(checked) => handleColumnToggle(column, checked as boolean)}
                    />
                    <Label htmlFor={column} className="text-sm">
                      {column.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Filters */}
          <div>
            <Label>Additional Filters (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="statusFilter" className="text-sm">Status Filter</Label>
                <Input
                  id="statusFilter"
                  placeholder="Filter by status..."
                  value={filters.status || ''}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="locationFilter" className="text-sm">Location Filter</Label>
                <Input
                  id="locationFilter"
                  placeholder="Filter by location..."
                  value={filters.location || ''}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={generateReport} 
              disabled={isGenerating}
              className="bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
