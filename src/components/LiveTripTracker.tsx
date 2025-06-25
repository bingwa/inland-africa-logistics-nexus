
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Truck, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveTripTrackerProps {
  trip: any;
  onClose: () => void;
}

export const LiveTripTracker: React.FC<LiveTripTrackerProps> = ({ trip, onClose }) => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState({
    lat: -1.2921,
    lng: 36.8219,
    address: "Nairobi, Kenya"
  });
  const [isTracking, setIsTracking] = useState(false);

  // Simulate live tracking updates
  useEffect(() => {
    if (trip.status === 'in_progress') {
      setIsTracking(true);
      const interval = setInterval(() => {
        // Simulate location updates
        setCurrentLocation(prev => ({
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.01,
          lng: prev.lng + (Math.random() - 0.5) * 0.01,
          address: `Moving towards ${trip.destination}`
        }));
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [trip.status, trip.destination]);

  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(trip.origin)}/${encodeURIComponent(trip.destination)}`;
    window.open(mapsUrl, '_blank');
    toast({
      title: "Opening Maps",
      description: "Route opened in Google Maps",
    });
  };

  const estimatedArrival = new Date(trip.planned_arrival);
  const timeToArrival = estimatedArrival.getTime() - new Date().getTime();
  const hoursToArrival = Math.max(0, Math.floor(timeToArrival / (1000 * 60 * 60)));
  const minutesToArrival = Math.max(0, Math.floor((timeToArrival % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Live Trip Tracking - {trip.trip_number}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {trip.origin} → {trip.destination}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Live Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${isTracking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} border`}>
                {isTracking ? 'LIVE TRACKING' : 'TRACKING INACTIVE'}
              </Badge>
              {isTracking && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Updates
                </div>
              )}
            </div>
            <Button onClick={handleOpenMaps} className="bg-blue-600 hover:bg-blue-700">
              <MapPin className="w-4 h-4 mr-2" />
              Open in Maps
            </Button>
          </div>

          {/* Current Location */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">{currentLocation.address}</p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trip Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-semibold">
                      {hoursToArrival}h {minutesToArrival}m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{trip.distance_km || 0} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="font-semibold">
                      {trip.status === 'in_progress' ? '45%' : '0%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Route Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Origin</span>
                  </div>
                  <span className="text-muted-foreground">{trip.origin}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Current</span>
                  </div>
                  <span className="text-muted-foreground">{currentLocation.address}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Destination</span>
                  </div>
                  <span className="text-muted-foreground">{trip.destination}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle & Driver Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">{trip.trucks?.truck_number || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">
                    {trip.trucks?.make} {trip.trucks?.model}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">{trip.drivers?.full_name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {trip.drivers?.employee_id || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mock Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map view</p>
                  <p className="text-sm text-gray-400">Real-time tracking visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
