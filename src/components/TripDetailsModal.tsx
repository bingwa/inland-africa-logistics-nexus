
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, User, Truck, DollarSign, X, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TripDetailsModalProps {
  trip: any;
  onClose: () => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ trip, onClose }) => {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400";
      case "planned": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const handleLiveTracking = () => {
    // Simulate opening live tracking
    const trackingUrl = `https://maps.google.com/maps?q=${trip.origin}+to+${trip.destination}`;
    window.open(trackingUrl, '_blank');
    toast({
      title: "Live Tracking",
      description: "Opening live tracking in Google Maps...",
    });
  };

  const handlePrintDetails = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const detailsHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Trip Details - ${trip.trip_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            .section { margin: 20px 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .status { padding: 5px 10px; border-radius: 15px; display: inline-block; margin-left: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TransLogistics Kenya</h1>
            <h2>Trip Details Report</h2>
            <p>Trip Number: ${trip.trip_number}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h3>Trip Information</h3>
            <div class="grid">
              <div>
                <div class="field"><span class="label">Origin:</span><span class="value">${trip.origin}</span></div>
                <div class="field"><span class="label">Destination:</span><span class="value">${trip.destination}</span></div>
                <div class="field"><span class="label">Distance:</span><span class="value">${trip.distance_km || 0} km</span></div>
                <div class="field"><span class="label">Status:</span><span class="value status">${trip.status}</span></div>
              </div>
              <div>
                <div class="field"><span class="label">Planned Departure:</span><span class="value">${trip.planned_departure ? new Date(trip.planned_departure).toLocaleString() : 'N/A'}</span></div>
                <div class="field"><span class="label">Planned Arrival:</span><span class="value">${trip.planned_arrival ? new Date(trip.planned_arrival).toLocaleString() : 'N/A'}</span></div>
                <div class="field"><span class="label">Actual Departure:</span><span class="value">${trip.actual_departure ? new Date(trip.actual_departure).toLocaleString() : 'Not departed'}</span></div>
                <div class="field"><span class="label">Actual Arrival:</span><span class="value">${trip.actual_arrival ? new Date(trip.actual_arrival).toLocaleString() : 'Not arrived'}</span></div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Assignment Details</h3>
            <div class="grid">
              <div>
                <div class="field"><span class="label">Driver:</span><span class="value">${trip.drivers?.full_name || 'Not assigned'}</span></div>
                <div class="field"><span class="label">Employee ID:</span><span class="value">${trip.drivers?.employee_id || 'N/A'}</span></div>
              </div>
              <div>
                <div class="field"><span class="label">Truck:</span><span class="value">${trip.trucks?.truck_number || 'Not assigned'}</span></div>
                <div class="field"><span class="label">Vehicle:</span><span class="value">${trip.trucks?.make} ${trip.trucks?.model || ''}</span></div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Financial Information</h3>
            <div class="grid">
              <div>
                <div class="field"><span class="label">Cargo Value:</span><span class="value">KSh ${((trip.cargo_value_usd || 0) * 130).toLocaleString()}</span></div>
                <div class="field"><span class="label">Fuel Cost:</span><span class="value">KSh ${(trip.fuel_cost || 0).toLocaleString()}</span></div>
              </div>
              <div>
                <div class="field"><span class="label">Toll Cost:</span><span class="value">KSh ${(trip.toll_cost || 0).toLocaleString()}</span></div>
                <div class="field"><span class="label">Other Expenses:</span><span class="value">KSh ${(trip.other_expenses || 0).toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          ${trip.notes ? `
          <div class="section">
            <h3>Notes</h3>
            <p>${trip.notes}</p>
          </div>
          ` : ''}

          <button class="no-print" onclick="window.print()" style="margin: 20px auto; display: block; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Details</button>
        </body>
      </html>
    `;

    printWindow.document.write(detailsHtml);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Trip Details - {trip.trip_number}
              </CardTitle>
              <CardDescription>Comprehensive trip information and tracking</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(trip.status) + " border text-sm px-3 py-1"}>
              {trip.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleLiveTracking}>
                <Navigation className="w-4 h-4 mr-2" />
                Live Tracking
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrintDetails}>
                Print Details
              </Button>
            </div>
          </div>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Route Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Origin</p>
                      <p className="font-semibold">{trip.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-semibold">{trip.destination}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="font-semibold">{trip.distance_km || 0} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Contact</p>
                    <p className="font-semibold">{trip.customer_contact || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Planned Departure</p>
                      <p className="font-semibold">
                        {trip.planned_departure ? new Date(trip.planned_departure).toLocaleString() : 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Actual Departure</p>
                      <p className="font-semibold">
                        {trip.actual_departure ? new Date(trip.actual_departure).toLocaleString() : 'Not departed'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Planned Arrival</p>
                      <p className="font-semibold">
                        {trip.planned_arrival ? new Date(trip.planned_arrival).toLocaleString() : 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Actual Arrival</p>
                      <p className="font-semibold">
                        {trip.actual_arrival ? new Date(trip.actual_arrival).toLocaleString() : 'Not arrived'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned Driver</p>
                      <p className="font-semibold">{trip.drivers?.full_name || 'Not assigned'}</p>
                      {trip.drivers?.employee_id && (
                        <p className="text-sm text-muted-foreground">ID: {trip.drivers.employee_id}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned Truck</p>
                      <p className="font-semibold">{trip.trucks?.truck_number || 'Not assigned'}</p>
                      {trip.trucks && (
                        <p className="text-sm text-muted-foreground">
                          {trip.trucks.make} {trip.trucks.model}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <DollarSign className="w-5 h-5 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Cargo Value</p>
                  <p className="font-bold text-lg">KSh {((trip.cargo_value_usd || 0) * 130).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Fuel Cost</p>
                  <p className="font-bold text-lg">KSh {(trip.fuel_cost || 0).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Toll Cost</p>
                  <p className="font-bold text-lg">KSh {(trip.toll_cost || 0).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Other Expenses</p>
                  <p className="font-bold text-lg">KSh {(trip.other_expenses || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {trip.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{trip.notes}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
