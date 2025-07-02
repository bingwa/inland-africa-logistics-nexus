
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, Plus, MapPin, Calendar, User, Truck, Clock, Loader2, Wrench } from "lucide-react";
import { useState } from "react";
import { useTrips, useUpdateTripStatus } from "@/hooks/useSupabaseData";
import { AddTripForm } from "@/components/forms/AddTripForm";
import { TripDetailsModal } from "@/components/TripDetailsModal";
import { LiveTripTracker } from "@/components/LiveTripTracker";
import { FilterExportBar } from "@/components/FilterExportBar";
import { useToast } from "@/hooks/use-toast";

const TripManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [trackingTrip, setTrackingTrip] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const { data: trips, isLoading, error } = useTrips();
  const updateTripStatus = useUpdateTripStatus();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Error loading trips: {error.message}
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400";
      case "planned": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const handleStatusUpdate = async (tripId: string, newStatus: string) => {
    try {
      await updateTripStatus.mutateAsync({ id: tripId, status: newStatus });
    } catch (error) {
      console.error('Failed to update trip status:', error);
    }
  };

  const handleTrackLive = (trip: any) => {
    setTrackingTrip(trip);
  };

  const handleViewDetails = (trip: any) => {
    setSelectedTrip(trip);
  };

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting trips in ${format} format`);
  };

  // Apply filters
  let filteredTrips = trips || [];
  
  if (searchTerm) {
    filteredTrips = filteredTrips.filter(trip =>
      trip.trip_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filters.status) {
    filteredTrips = filteredTrips.filter(trip => trip.status === filters.status);
  }

  const activeTrips = trips?.filter(trip => trip.status === 'in_progress').length || 0;
  const completedToday = trips?.filter(trip => 
    trip.status === 'completed' && 
    new Date(trip.updated_at).toDateString() === new Date().toDateString()
  ).length || 0;
  const totalDistance = trips?.reduce((sum, trip) => sum + (trip.distance_km || 0), 0) || 0;
  const onTimeRate = 94; // Mock data

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Route className="w-6 h-6 sm:w-8 sm:h-8" />
              Trip & Route Management
            </h1>
            <p className="text-muted-foreground">Plan, track, and manage transportation routes</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Button>
        </div>

        {/* Trip Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Trips</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{activeTrips}</p>
                </div>
                <Route className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{completedToday}</p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalDistance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">km total</p>
                </div>
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On-Time Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{onTimeRate}%</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Trips */}
        <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50">
          <CardHeader>
            <CardTitle>Current Trips</CardTitle>
            <CardDescription>Monitor ongoing and scheduled trips</CardDescription>
          </CardHeader>
          <CardContent>
            <FilterExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterApply={handleFilterApply}
              onExport={handleExport}
              filterOptions={{
                status: ['planned', 'in_progress', 'completed'],
                locations: ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret']
              }}
            />

            {/* Trips List */}
            <div className="space-y-4 mt-6">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow border-2 border-yellow-300/50 dark:border-yellow-600/50">
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
                          <div className="text-muted-foreground">
                            Value: KSh {(trip.cargo_value_usd * 130)?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Truck className="w-4 h-4" />
                            <span>Truck</span>
                          </div>
                          <p className="font-medium text-foreground">{trip.trucks?.truck_number || 'N/A'}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>Driver</span>
                          </div>
                          <p className="font-medium text-foreground">{trip.drivers?.full_name || 'N/A'}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>Distance</span>
                          </div>
                          <p className="font-medium text-foreground">{trip.distance_km || 0} km</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Wrench className="w-4 h-4" />
                            <span>Wear & Tear</span>
                          </div>
                          <p className="font-medium text-foreground">
                            KSh {trip.estimated_wear_tear_ksh?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Planned Arrival</span>
                          </div>
                          <p className="font-medium text-foreground">
                            {trip.planned_arrival ? new Date(trip.planned_arrival).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-yellow-400 text-foreground hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                        onClick={() => handleViewDetails(trip)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-400 text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => handleTrackLive(trip)}
                      >
                        Track Live
                      </Button>
                      {trip.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleStatusUpdate(trip.id, 'completed')}
                        >
                          Complete Trip
                        </Button>
                      )}
                      {trip.status === 'planned' && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleStatusUpdate(trip.id, 'in_progress')}
                        >
                          Start Trip
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!trips || trips.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No trips found. Create your first trip to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <AddTripForm onClose={() => setShowAddForm(false)} />
        )}

        {selectedTrip && (
          <TripDetailsModal
            trip={selectedTrip}
            onClose={() => setSelectedTrip(null)}
          />
        )}

        {trackingTrip && (
          <LiveTripTracker
            trip={trackingTrip}
            onClose={() => setTrackingTrip(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default TripManagement;