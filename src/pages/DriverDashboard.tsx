
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Route, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Fuel,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DriverTrip {
  id: string;
  trip_number: string;
  origin: string;
  destination: string;
  planned_departure: string;
  planned_arrival: string;
  actual_departure: string | null;
  actual_arrival: string | null;
  status: string;
  distance_km: number | null;
  cargo_value_usd: number | null;
  assigned_at: string;
  assignment_status: string;
  truck_number: string | null;
  make: string | null;
  model: string | null;
}

const DriverDashboard = () => {
  const [trips, setTrips] = useState<DriverTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDriverTrips();
    fetchDriverInfo();
  }, []);

  const fetchDriverInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setDriverName(profile.full_name || 'Driver');
      }
    } catch (error) {
      console.error('Error fetching driver info:', error);
    }
  };

  const fetchDriverTrips = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('driver_trip_view')
        .select('*')
        .order('planned_departure', { ascending: true });

      if (error) {
        console.error('Error fetching driver trips:', error);
        toast({
          title: "Error loading trips",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setTrips(data || []);
    } catch (error) {
      console.error('Error in fetchDriverTrips:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTripStatus = async (tripId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ 
          status: newStatus,
          ...(newStatus === 'in_progress' && { actual_departure: new Date().toISOString() }),
          ...(newStatus === 'completed' && { actual_arrival: new Date().toISOString() })
        })
        .eq('id', tripId);

      if (error) throw error;

      toast({
        title: "Trip updated",
        description: `Trip status changed to ${newStatus.replace('_', ' ')}`,
      });

      fetchDriverTrips(); // Refresh the trips
    } catch (error: any) {
      toast({
        title: "Error updating trip",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-300";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "planned": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const activeTrips = trips.filter(trip => trip.status === 'in_progress');
  const upcomingTrips = trips.filter(trip => trip.status === 'planned');
  const completedTrips = trips.filter(trip => trip.status === 'completed');

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Route className="w-6 h-6 sm:w-8 sm:h-8" />
              Driver Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {driverName}!</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Trips</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{activeTrips.length}</p>
                </div>
                <Route className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Trips</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{upcomingTrips.length}</p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{completedTrips.length}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {trips.reduce((sum, trip) => sum + (trip.distance_km || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">km</p>
                </div>
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Trips */}
        <Card>
          <CardHeader>
            <CardTitle>My Assigned Trips</CardTitle>
            <CardDescription>Your current and upcoming trip assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No trips assigned yet. Check back later for new assignments.
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <Card key={trip.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-foreground">{trip.trip_number}</h3>
                            <Badge className={getStatusColor(trip.status) + " border"}>
                              {trip.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{trip.origin} → {trip.destination}</span>
                            </div>
                            {trip.distance_km && (
                              <div className="text-muted-foreground">
                                Distance: {trip.distance_km} km
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Truck className="w-4 h-4" />
                              <span>Vehicle</span>
                            </div>
                            <p className="font-medium text-foreground">
                              {trip.truck_number ? `${trip.truck_number} (${trip.make} ${trip.model})` : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Departure</span>
                            </div>
                            <p className="font-medium text-foreground">
                              {new Date(trip.planned_departure).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(trip.planned_departure).toLocaleTimeString()}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>Arrival</span>
                            </div>
                            <p className="font-medium text-foreground">
                              {new Date(trip.planned_arrival).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(trip.planned_arrival).toLocaleTimeString()}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Navigation className="w-4 h-4" />
                              <span>Assigned</span>
                            </div>
                            <p className="font-medium text-foreground">
                              {new Date(trip.assigned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                        {trip.status === 'planned' && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => updateTripStatus(trip.id, 'in_progress')}
                          >
                            Start Trip
                          </Button>
                        )}
                        {trip.status === 'in_progress' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => updateTripStatus(trip.id, 'completed')}
                            >
                              Complete Trip
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-blue-400 text-foreground hover:bg-blue-50"
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Navigate
                            </Button>
                          </>
                        )}
                        {trip.status === 'completed' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Trip Completed</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DriverDashboard;
