
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, MapPin, Clock, Plus, Truck, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTrips, useUpdateTripStatus } from "@/hooks/useSupabaseData";
import { AddTripForm } from "@/components/forms/AddTripForm";

const TripManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: trips, isLoading, error } = useTrips();
  const updateTripStatus = useUpdateTripStatus();

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
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (tripId: string, newStatus: string) => {
    await updateTripStatus.mutateAsync({ id: tripId, status: newStatus });
  };

  const activeTrips = trips?.filter(trip => trip.status === 'in_progress').length || 0;
  const completedToday = trips?.filter(trip => 
    trip.status === 'completed' && 
    new Date(trip.actual_arrival || trip.planned_arrival).toDateString() === new Date().toDateString()
  ).length || 0;
  const totalDistance = trips?.reduce((sum, trip) => sum + (trip.distance_km || 0), 0) || 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-3">
              <Route className="w-8 h-8" />
              Trip & Route Management
            </h1>
            <p className="text-gray-600">Plan, track, and manage transportation routes</p>
          </div>
          <Button 
            className="bg-black hover:bg-gray-800 text-white"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Button>
        </div>

        {/* Trip Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trips</p>
                  <p className="text-2xl font-bold text-black">{activeTrips}</p>
                </div>
                <Route className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-green-600">{completedToday}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Distance</p>
                  <p className="text-2xl font-bold text-blue-600">{totalDistance.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">km total</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Current Trips</CardTitle>
            <CardDescription>Monitor ongoing and scheduled trips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trips?.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-black text-lg">{trip.trip_number}</h3>
                      <p className="text-xl font-medium text-gray-900">{trip.origin} → {trip.destination}</p>
                      <p className="text-sm text-gray-600">Value: ${trip.cargo_value_usd?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Truck</p>
                        <p className="font-medium">{trip.trucks?.truck_number || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Driver</p>
                        <p className="font-medium">{trip.drivers?.full_name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Distance</p>
                        <p className="font-medium">{trip.distance_km?.toLocaleString() || 'N/A'} km</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Planned Arrival</p>
                        <p className="font-medium">{new Date(trip.planned_arrival).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Track Live
                    </Button>
                    {trip.status === "planned" && (
                      <Button 
                        size="sm" 
                        className="bg-black hover:bg-gray-800 text-white"
                        onClick={() => handleStatusUpdate(trip.id, 'in_progress')}
                      >
                        Start Trip
                      </Button>
                    )}
                    {trip.status === "in_progress" && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusUpdate(trip.id, 'completed')}
                      >
                        Complete Trip
                      </Button>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No trips found. Create your first trip to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <AddTripForm onClose={() => setShowAddForm(false)} />
        )}
      </div>
    </Layout>
  );
};

export default TripManagement;
