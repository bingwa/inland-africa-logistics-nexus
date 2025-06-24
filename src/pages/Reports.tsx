
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp, BarChart, Plus } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

const Reports = () => {
  // Sample data for reports with Kenyan context
  const fleetPerformance = [
    { month: "Jan", efficiency: 85, maintenance: 12, revenue: 180000, mileage: 45000 },
    { month: "Feb", efficiency: 88, maintenance: 8, revenue: 195000, mileage: 52000 },
    { month: "Mar", efficiency: 82, maintenance: 15, revenue: 175000, mileage: 48000 },
    { month: "Apr", efficiency: 91, maintenance: 6, revenue: 220000, mileage: 58000 },
    { month: "May", efficiency: 89, maintenance: 9, revenue: 210000, mileage: 55000 },
    { month: "Jun", efficiency: 93, maintenance: 5, revenue: 235000, mileage: 62000 },
  ];

  const operationalMetrics = [
    { name: "Fleet Utilization", value: 85, color: "#000000" },
    { name: "Route Efficiency", value: 92, color: "#FFD700" },
    { name: "Driver Performance", value: 88, color: "#FFA500" },
    { name: "Fuel Efficiency", value: 79, color: "#333333" },
  ];

  const reportCategories = [
    {
      title: "Fleet Reports",
      description: "Vehicle performance, utilization, and maintenance reports",
      reports: [
        { name: "Fleet Performance Summary", lastGenerated: "2024-06-28", size: "2.3 MB" },
        { name: "Vehicle Utilization Report", lastGenerated: "2024-06-27", size: "1.8 MB" },
        { name: "Maintenance Schedule Report", lastGenerated: "2024-06-26", size: "1.2 MB" },
        { name: "Driver Mileage Report", lastGenerated: "2024-06-25", size: "1.5 MB" },
      ]
    },
    {
      title: "Financial Reports",
      description: "Revenue, costs, and profitability analysis",
      reports: [
        { name: "Monthly Revenue Report", lastGenerated: "2024-06-28", size: "3.1 MB" },
        { name: "Cost Analysis Report", lastGenerated: "2024-06-25", size: "2.7 MB" },
        { name: "Profit & Loss Statement", lastGenerated: "2024-06-24", size: "1.9 MB" },
      ]
    },
    {
      title: "Operational Reports",
      description: "Trip statistics, driver performance, and route analysis",
      reports: [
        { name: "Trip Performance Report", lastGenerated: "2024-06-28", size: "2.5 MB" },
        { name: "Driver Performance Report", lastGenerated: "2024-06-27", size: "1.6 MB" },
        { name: "Route Optimization Report", lastGenerated: "2024-06-26", size: "2.2 MB" },
        { name: "Mileage Analysis Report", lastGenerated: "2024-06-24", size: "1.8 MB" },
      ]
    },
  ];

  const driverMetrics = [
    { name: "John Adebayo", totalMileage: 125000, efficiency: 92, trips: 45 },
    { name: "Ahmed Hassan", totalMileage: 98000, efficiency: 88, trips: 38 },
    { name: "Blessing Okafor", totalMileage: 87000, efficiency: 94, trips: 32 },
    { name: "Mary Wanjiku", totalMileage: 76000, efficiency: 85, trips: 29 },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card border-2 border-yellow-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-black">KSh 235M</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card border-2 border-yellow-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fleet Efficiency</p>
                  <p className="text-2xl font-bold text-green-600">93%</p>
                  <p className="text-sm text-green-600">+4% improvement</p>
                </div>
                <BarChart className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card border-2 border-yellow-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mileage</p>
                  <p className="text-2xl font-bold text-blue-600">320,000</p>
                  <p className="text-sm text-blue-600">km this month</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card border-2 border-yellow-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-purple-600">KSh 15.2M</p>
                  <p className="text-sm text-purple-600">YTD optimization</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fleet Performance Trends */}
          <Card className="border-2 border-yellow-400">
            <CardHeader>
              <CardTitle>Fleet Performance & Mileage Trends</CardTitle>
              <CardDescription>Monthly efficiency, maintenance metrics, and mileage data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={fleetPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'revenue') return [`KSh ${value.toLocaleString()}`, "Revenue"];
                    if (name === 'mileage') return [`${value.toLocaleString()} km`, "Mileage"];
                    return [value, name];
                  }} />
                  <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#000000" fill="#000000" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="mileage" stackId="2" stroke="#FFD700" fill="#FFD700" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Driver Performance Metrics */}
          <Card className="border-2 border-yellow-400">
            <CardHeader>
              <CardTitle>Top Driver Performance</CardTitle>
              <CardDescription>Driver efficiency and mileage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverMetrics.map((driver, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-black">{driver.name}</span>
                      <span className="font-bold text-yellow-600">{driver.efficiency}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Mileage: </span>
                        <span className="font-medium">{driver.totalMileage.toLocaleString()} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Trips: </span>
                        <span className="font-medium">{driver.trips}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full bg-yellow-500"
                        style={{ width: `${driver.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <Card className="border-2 border-yellow-400">
          <CardHeader>
            <CardTitle>Revenue Analysis (KSh)</CardTitle>
            <CardDescription>Monthly revenue trends and projections</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={fleetPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, "Revenue"]} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#000000" 
                  strokeWidth={3}
                  dot={{ fill: "#FFD700", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#FFD700" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Report Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reportCategories.map((category, index) => (
            <Card key={index} className="border-2 border-yellow-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-500" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.reports.map((report, reportIndex) => (
                    <div key={reportIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-yellow-50 transition-colors border border-yellow-200">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-black">{report.name}</p>
                        <p className="text-xs text-gray-600">
                          Last: {report.lastGenerated} • {report.size}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="hover:bg-yellow-100">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-yellow-100">
                          <Calendar className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white" variant="outline">
                  View All Reports
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-2 border-yellow-400">
          <CardHeader>
            <CardTitle>Quick Report Generation</CardTitle>
            <CardDescription>Generate reports for specific time periods and categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Daily Summary", description: "Yesterday's operations overview" },
                { name: "Weekly Fleet Report", description: "7-day performance analysis" },
                { name: "Monthly Financial", description: "Complete financial breakdown" },
                { name: "Driver Mileage Report", description: "Individual driver statistics" },
              ].map((quickReport, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border border-yellow-300 hover:border-yellow-500">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <FileText className="w-8 h-8 text-yellow-500 mx-auto" />
                      <h3 className="font-semibold text-black">{quickReport.name}</h3>
                      <p className="text-sm text-gray-600">{quickReport.description}</p>
                      <Button size="sm" className="w-full bg-black hover:bg-gray-800 text-white">
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
