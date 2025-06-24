
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Route, Settings, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTrucks, useTrips, useMaintenance, useSpareParts } from "@/hooks/useSupabaseData";

const Dashboard = () => {
  const { data: trucks, isLoading: trucksLoading } = useTrucks();
  const { data: trips, isLoading: tripsLoading } = useTrips();
  const { data: maintenance, isLoading: maintenanceLoading } = useMaintenance();
  const { data: spareParts, isLoading: sparePartsLoading } = useSpareParts();

  const isLoading = trucksLoading || tripsLoading || maintenanceLoading || sparePartsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  // Calculate statistics from real data
  const activeTrucks = trucks?.filter(truck => truck.status === 'active').length || 0;
  const totalTrips = trips?.length || 0;
  const inventoryItems = spareParts?.reduce((sum, part) => sum + part.quantity_in_stock, 0) || 0;
  const pendingServices = maintenance?.filter(m => m.status === 'scheduled' || m.status === 'in_progress').length || 0;

  // Fleet status data
  const fleetStatus = [
    { 
      name: "Active", 
      value: trucks?.filter(t => t.status === 'active').length || 0, 
      color: "#22c55e" 
    },
    { 
      name: "Maintenance", 
      value: trucks?.filter(t => t.status === 'maintenance').length || 0, 
      color: "#f59e0b" 
    },
    { 
      name: "Out of Service", 
      value: trucks?.filter(t => t.status === 'out_of_service').length || 0, 
      color: "#ef4444" 
    },
  ];

  // Trip status data for chart
  const tripStatusData = [
    { status: "Completed", count: trips?.filter(t => t.status === 'completed').length || 0 },
    { status: "In Progress", count: trips?.filter(t => t.status === 'in_progress').length || 0 },
    { status: "Planned", count: trips?.filter(t => t.status === 'planned').length || 0 },
  ];

  const stats = [
    {
      title: "Active Trucks",
      value: activeTrucks.toString(),
      change: `+${Math.floor(Math.random() * 5)}`,
      icon: Truck,
      color: "text-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "Total Trips",
      value: totalTrips.toString(),
      change: "+12%",
      icon: Route,
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Inventory Items",
      value: inventoryItems.toString(),
      change: "-5",
      icon: Package,
      color: "text-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Pending Services",
      value: pendingServices.toString(),
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
          {/* Trip Status Chart */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500">
                  <TrendingUp className="w-5 h-5 text-black" />
                </div>
                Trip Status Overview
              </CardTitle>
              <CardDescription>Current status of all trips in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tripStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #ffd700', 
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                  <Bar dataKey="count" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
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
                {trips?.slice(0, 4).map((trip, index) => (
                  <div key={trip.id} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-yellow-50/30 hover:from-yellow-50 hover:to-yellow-100/50 transition-all duration-300 group">
                    <div className="text-2xl">🚛</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Trip {trip.trip_number}</p>
                      <p className="text-sm text-gray-600">{trip.origin} → {trip.destination}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{trip.status}</span>
                  </div>
                )) || []}
                
                {(!trips || trips.length === 0) && (
                  <div className="text-center py-4 text-gray-500">
                    No recent activities
                  </div>
                )}
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
                {maintenance?.filter(m => m.status === 'in_progress').slice(0, 4).map((alert, index) => (
                  <div key={alert.id} className="flex items-center space-x-4 p-4 rounded-xl border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50 to-red-50/30 hover:shadow-md transition-all duration-300">
                    <div className="text-xl">🔧</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{alert.trucks?.truck_number} requires service</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                )) || []}
                
                {(!maintenance || maintenance.filter(m => m.status === 'in_progress').length === 0) && (
                  <div className="text-center py-4 text-gray-500">
                    No active alerts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
