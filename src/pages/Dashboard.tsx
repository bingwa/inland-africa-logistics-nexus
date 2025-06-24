
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Route, Settings, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  // Sample data for charts
  const monthlyRevenue = [
    { month: "Jan", revenue: 45000, trips: 120 },
    { month: "Feb", revenue: 52000, trips: 135 },
    { month: "Mar", revenue: 48000, trips: 128 },
    { month: "Apr", revenue: 61000, trips: 150 },
    { month: "May", revenue: 55000, trips: 142 },
    { month: "Jun", revenue: 67000, trips: 165 },
  ];

  const fleetStatus = [
    { name: "Active", value: 45, color: "#1B4332" },
    { name: "Maintenance", value: 8, color: "#D4AF37" },
    { name: "Out of Service", value: 3, color: "#EF4444" },
  ];

  const stats = [
    {
      title: "Active Trucks",
      value: "45",
      change: "+2",
      icon: Truck,
      color: "text-green-600",
    },
    {
      title: "Total Trips",
      value: "1,247",
      change: "+12%",
      icon: Route,
      color: "text-blue-600",
    },
    {
      title: "Inventory Items",
      value: "2,350",
      change: "-5",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Pending Services",
      value: "23",
      change: "+3",
      icon: Settings,
      color: "text-orange-600",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-logistics-primary">Dashboard</h1>
          <p className="text-gray-600">Overview of your logistics operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-logistics-primary">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-logistics-accent" />
                Monthly Revenue & Trips
              </CardTitle>
              <CardDescription>Revenue and trip statistics for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#1B4332" name="Revenue ($)" />
                  <Bar dataKey="trips" fill="#D4AF37" name="Trips" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fleet Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-logistics-accent" />
                Fleet Status
              </CardTitle>
              <CardDescription>Current status of your truck fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fleetStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {fleetStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {fleetStatus.map((status, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{status.name}: {status.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Trip completed", details: "Route: Lagos - Abuja", time: "2 hours ago" },
                  { action: "Service scheduled", details: "Truck: TRK-001", time: "4 hours ago" },
                  { action: "Inventory updated", details: "Brake pads restocked", time: "6 hours ago" },
                  { action: "New trip assigned", details: "Route: Kano - Port Harcourt", time: "8 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-logistics-accent rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-logistics-primary">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                System Alerts
              </CardTitle>
              <CardDescription>Important notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { level: "high", message: "TRK-005 requires immediate service", time: "1 hour ago" },
                  { level: "medium", message: "Low fuel detected on Route 12", time: "3 hours ago" },
                  { level: "low", message: "Driver license expiring in 30 days", time: "1 day ago" },
                  { level: "medium", message: "Spare parts inventory low", time: "2 days ago" },
                ].map((alert, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border-l-4 border-l-orange-400 bg-orange-50">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.level === 'high' ? 'text-red-500' : 
                      alert.level === 'medium' ? 'text-orange-500' : 
                      'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
