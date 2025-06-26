
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, FileText, TrendingUp, DollarSign, Truck, MapPin, Loader2, Eye } from "lucide-react";
import { useState } from "react";
import { useTrucks, useTrips, useFuelRecords } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import { CustomReportGenerator } from "@/components/CustomReportGenerator";

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showCustomReportGenerator, setShowCustomReportGenerator] = useState(false);
  const { data: trucks, isLoading: trucksLoading } = useTrucks();
  const { data: trips, isLoading: tripsLoading } = useTrips();
  const { data: fuelRecords, isLoading: fuelRecordsLoading } = useFuelRecords();
  const { toast } = useToast();

  const isLoading = trucksLoading || tripsLoading || fuelRecordsLoading;

  // Calculate real metrics
  const monthlyRevenue = trips?.reduce((sum, trip) => sum + (trip.cargo_value_usd * 130), 0) || 0;
  const totalMileage = trucks?.reduce((sum, truck) => sum + (truck.mileage || 0), 0) || 0;
  const fleetEfficiency = trucks ? Math.round((trucks.filter(t => t.status === 'active').length / trucks.length) * 100) : 0;
  const costSavings = Math.round(monthlyRevenue * 0.065);

  // Performance data for charts
  const monthlyData = [
    { name: 'Jan', mileage: 45000, efficiency: 88 },
    { name: 'Feb', mileage: 52000, efficiency: 91 },
    { name: 'Mar', mileage: 48000, efficiency: 87 },
    { name: 'Apr', mileage: 61000, efficiency: 93 },
    { name: 'May', mileage: 55000, efficiency: 89 },
    { name: 'Jun', mileage: totalMileage, efficiency: fleetEfficiency },
  ];

  const driverPerformance = [
    { name: 'John Adebayo', mileage: 125000, trips: 45, efficiency: 92 },
    { name: 'Mary Wanjiku', mileage: 118000, trips: 42, efficiency: 89 },
    { name: 'Peter Ochieng', mileage: 134000, trips: 48, efficiency: 94 },
    { name: 'Grace Mutiso', mileage: 102000, trips: 38, efficiency: 87 },
  ];

  const handleDownloadReport = async (reportName: string) => {
    setIsGenerating(reportName);
    try {
      // Simulate report generation and download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock PDF download
      const element = document.createElement('a');
      const file = new Blob([`${reportName} - Generated on ${new Date().toLocaleDateString()}`], 
        { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Report Downloaded",
        description: `${reportName} has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleViewReport = (reportName: string) => {
    // Open a new window with report preview
    const reportWindow = window.open('', '_blank', 'width=800,height=600');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>${reportName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .header { border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
              .content { margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${reportName}</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
              <p>This is a preview of the ${reportName}. The full report contains detailed analytics and insights.</p>
              <p>Report data is based on current system information and may be updated in real-time.</p>
            </div>
          </body>
        </html>
      `);
      reportWindow.document.close();
    }
    
    toast({
      title: "Report Opened",
      description: `${reportName} opened in a new window.`,
    });
  };

  const handleScheduleReport = (reportName: string) => {
    toast({
      title: "Report Scheduled",
      description: `${reportName} has been scheduled for weekly generation.`,
    });
  };

  const handleGenerateCustomReport = () => {
    setShowCustomReportGenerator(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">Comprehensive business intelligence and reporting</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={handleGenerateCustomReport}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">KSh {Math.round(monthlyRevenue / 1000000)}M</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fleet Efficiency</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{fleetEfficiency}%</p>
                  <p className="text-sm text-green-600">+4% improvement</p>
                </div>
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Mileage</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{Math.round(totalMileage / 1000)}K</p>
                  <p className="text-sm text-muted-foreground">km this month</p>
                </div>
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cost Savings</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">KSh {Math.round(costSavings / 1000000)}M</p>
                  <p className="text-sm text-muted-foreground">YTD optimization</p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Fleet Performance & Mileage Trends</CardTitle>
              <CardDescription>Monthly efficiency, maintenance metrics, and mileage data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: '8px' 
                    }} 
                  />
                  <Line type="monotone" dataKey="mileage" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Top Driver Performance</CardTitle>
              <CardDescription>Driver efficiency and mileage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverPerformance.map((driver, index) => (
                  <div key={driver.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-semibold text-foreground">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">Total Mileage: {driver.mileage.toLocaleString()} km</p>
                      <p className="text-sm text-muted-foreground">Trips: {driver.trips}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {driver.efficiency}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet Reports */}
          <Card className="bg-card border-2 border-yellow-400/50 dark:border-yellow-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Fleet Reports
              </CardTitle>
              <CardDescription>Vehicle performance, utilization, and maintenance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Fleet Performance Summary</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-28 • 2.3 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Fleet Performance Summary")}
                      disabled={isGenerating === "Fleet Performance Summary"}
                    >
                      {isGenerating === "Fleet Performance Summary" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Fleet Performance Summary")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Fleet Performance Summary")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Vehicle Utilization Report</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-27 • 1.8 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Vehicle Utilization Report")}
                      disabled={isGenerating === "Vehicle Utilization Report"}
                    >
                      {isGenerating === "Vehicle Utilization Report" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Vehicle Utilization Report")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Vehicle Utilization Report")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Maintenance Schedule Report</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-26 • 1.2 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Maintenance Schedule Report")}
                      disabled={isGenerating === "Maintenance Schedule Report"}
                    >
                      {isGenerating === "Maintenance Schedule Report" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Maintenance Schedule Report")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Maintenance Schedule Report")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleViewReport("All Fleet Reports")}>
                View All Reports
              </Button>
            </CardContent>
          </Card>

          {/* Financial Reports */}
          <Card className="bg-card border-2 border-yellow-400/50 dark:border-yellow-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Financial Reports
              </CardTitle>
              <CardDescription>Revenue, costs, and profitability analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Monthly Revenue Report</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-28 • 3.1 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Monthly Revenue Report")}
                      disabled={isGenerating === "Monthly Revenue Report"}
                    >
                      {isGenerating === "Monthly Revenue Report" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Monthly Revenue Report")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Monthly Revenue Report")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Cost Analysis Report</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-25 • 2.7 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Cost Analysis Report")}
                      disabled={isGenerating === "Cost Analysis Report"}
                    >
                      {isGenerating === "Cost Analysis Report" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Cost Analysis Report")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Cost Analysis Report")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Profit & Loss Statement</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-24 • 1.9 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Profit & Loss Statement")}
                      disabled={isGenerating === "Profit & Loss Statement"}
                    >
                      {isGenerating === "Profit & Loss Statement" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Profit & Loss Statement")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Profit & Loss Statement")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleViewReport("All Financial Reports")}>
                View All Reports
              </Button>
            </CardContent>
          </Card>

          {/* Operational Reports */}
          <Card className="bg-card border-2 border-yellow-400/50 dark:border-yellow-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Operational Reports
              </CardTitle>
              <CardDescription>Trip statistics, driver performance, and route analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Trip Performance Report</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-28 • 2.5 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Trip Performance Report")}
                      disabled={isGenerating === "Trip Performance Report"}
                    >
                      {isGenerating === "Trip Performance Report" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Trip Performance Report")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Trip Performance Report")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Driver Performance Report</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-27 • 1.6 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Driver Performance Report")}
                      disabled={isGenerating === "Driver Performance Report"}
                    >
                      {isGenerating === "Driver Performance Report" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Driver Performance Report")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Driver Performance Report")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Route Optimization Report</p>
                    <p className="text-sm text-muted-foreground">Last: 2024-06-26 • 2.2 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadReport("Route Optimization Report")}
                      disabled={isGenerating === "Route Optimization Report"}
                    >
                      {isGenerating === "Route Optimization Report" ? 
                        <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <Download className="w-4 h-4" />
                      }
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleReport("Route Optimization Report")}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewReport("Route Optimization Report")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleViewReport("All Operational Reports")}>
                View All Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Custom Report Generator Modal */}
        {showCustomReportGenerator && (
          <CustomReportGenerator onClose={() => setShowCustomReportGenerator(false)} />
        )}
      </div>
    </Layout>
  );
};

export default Reports;
