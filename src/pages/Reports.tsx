
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp, BarChart } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

const Reports = () => {
  // Sample data for reports
  const fleetPerformance = [
    { month: "Jan", efficiency: 85, maintenance: 12, revenue: 180000 },
    { month: "Feb", efficiency: 88, maintenance: 8, revenue: 195000 },
    { month: "Mar", efficiency: 82, maintenance: 15, revenue: 175000 },
    { month: "Apr", efficiency: 91, maintenance: 6, revenue: 220000 },
    { month: "May", efficiency: 89, maintenance: 9, revenue: 210000 },
    { month: "Jun", efficiency: 93, maintenance: 5, revenue: 235000 },
  ];

  const operationalMetrics = [
    { name: "Fleet Utilization", value: 85, color: "#1B4332" },
    { name: "Route Efficiency", value: 92, color: "#D4AF37" },
    { name: "Driver Performance", value: 88, color: "#95D5B2" },
    { name: "Fuel Efficiency", value: 79, color: "#2D5D47" },
  ];

  const reportCategories = [
    {
      title: "Fleet Reports",
      description: "Vehicle performance, utilization, and maintenance reports",
      reports: [
        { name: "Fleet Performance Summary", lastGenerated: "2024-06-28", size: "2.3 MB" },
        { name: "Vehicle Utilization Report", lastGenerated: "2024-06-27", size: "1.8 MB" },
        { name: "Maintenance Schedule Report", lastGenerated: "2024-06-26", size: "1.2 MB" },
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
      ]
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-logistics-primary flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
          </div>
          <Button className="bg-logistics-primary hover:bg-logistics-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-logistics-primary">₦235M</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-logistics-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
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
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-blue-600">This month</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-purple-600">₦15.2M</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Fleet Performance Trends</CardTitle>
              <CardDescription>Monthly efficiency and maintenance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={fleetPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#1B4332" fill="#1B4332" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="maintenance" stackId="2" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Operational Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
              <CardDescription>Key performance indicators overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operationalMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{metric.name}</span>
                      <span className="font-bold">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${metric.value}%`,
                          backgroundColor: metric.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Monthly revenue trends and projections</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={fleetPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1B4332" 
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#D4AF37" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Report Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reportCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-logistics-accent" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.reports.map((report, reportIndex) => (
                    <div key={reportIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs text-gray-600">
                          Last: {report.lastGenerated} • {report.size}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Calendar className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Reports
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
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
                { name: "Custom Date Range", description: "Specify your own period" },
              ].map((quickReport, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <FileText className="w-8 h-8 text-logistics-accent mx-auto" />
                      <h3 className="font-semibold">{quickReport.name}</h3>
                      <p className="text-sm text-gray-600">{quickReport.description}</p>
                      <Button size="sm" className="w-full bg-logistics-primary hover:bg-logistics-secondary">
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
