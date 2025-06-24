
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Route, Settings, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  // Sample data for charts
  const monthlyRevenue = [
    { month: "Jan", revenue: 450000, trips: 120 },
    { month: "Feb", revenue: 520000, trips: 135 },
    { month: "Mar", revenue: 480000, trips: 128 },
    { month: "Apr", revenue: 610000, trips: 150 },
    { month: "May", revenue: 550000, trips: 142 },
    { month: "Jun", revenue: 670000, trips: 165 },
  ];

  const fleetStatus = [
    { name: "Active", value: 45, color: "#ffd700" },
    { name: "Maintenance", value: 8, color: "#fbbf24" },
    { name: "Out of Service", value: 3, color: "#ef4444" },
  ];

  const stats = [
    {
      title: "Active Trucks",
      value: "45",
      change: "+2",
      icon: Truck,
      color: "text-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "Total Trips",
      value: "1,247",
      change: "+12%",
      icon: Route,
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Inventory Items",
      value: "2,350",
      change: "-5",
      icon: Package,
      color: "text-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Pending Services",
      value: "23",
      change: "+3",
      icon: Settings,
      color: "text-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/10 rounded-2xl -rotate-1"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-yellow-200/50">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 text-lg mt-2">Real-time insights into your logistics operations</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-xl rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <Card className="relative stats-card animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm font-medium ${stat.color}`}>{stat.change} from last month</p>
                    </div>
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500">
                  <TrendingUp className="w-5 h-5 text-black" />
                </div>
                Monthly Revenue & Trips
              </CardTitle>
              <CardDescription>Revenue and trip statistics for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #ffd700', 
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                  <Bar dataKey="revenue" fill="url(#revenueGradient)" name="Revenue (KSh)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="trips" fill="url(#tripsGradient)" name="Trips" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="tripsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffd700" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#ffd700" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fleet Status */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500">
                  <Truck className="w-5 h-5 text-black" />
                </div>
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
                    <span className="text-sm text-gray-600 font-medium">{status.name}: {status.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activities</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Trip completed", details: "Route: Nairobi - Mombasa", time: "2 hours ago", icon: "✅" },
                  { action: "Service scheduled", details: "Truck: TRK-001", time: "4 hours ago", icon: "🔧" },
                  { action: "Inventory updated", details: "Brake pads restocked", time: "6 hours ago", icon: "📦" },
                  { action: "New trip assigned", details: "Route: Kisumu - Eldoret", time: "8 hours ago", icon: "🚛" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-yellow-50/30 hover:from-yellow-50 hover:to-yellow-100/50 transition-all duration-300 group">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-400 to-red-500">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                System Alerts
              </CardTitle>
              <CardDescription>Important notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { level: "high", message: "TRK-005 requires immediate service", time: "1 hour ago", priority: "🔴" },
                  { level: "medium", message: "Low fuel detected on Route 12", time: "3 hours ago", priority: "🟡" },
                  { level: "low", message: "Driver license expiring in 30 days", time: "1 day ago", priority: "🟢" },
                  { level: "medium", message: "Spare parts inventory low", time: "2 days ago", priority: "🟡" },
                ].map((alert, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-xl border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50 to-red-50/30 hover:shadow-md transition-all duration-300">
                    <div className="text-xl">{alert.priority}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{alert.message}</p>
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
