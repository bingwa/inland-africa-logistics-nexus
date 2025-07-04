
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, Calendar, Gauge, X, Settings, MapPin, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TruckDetailsModalProps {
  truck: any;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}

export const TruckDetailsModal: React.FC<TruckDetailsModalProps> = ({ 
  truck, 
  onClose, 
  onStatusUpdate 
}) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400";
      case "in_transit": return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400";
      case "maintenance": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const getCertificateStatus = (expiryDate: string) => {
    if (!expiryDate) return { status: 'missing', color: 'bg-red-100 text-red-800', days: 0 };
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'bg-red-100 text-red-800', days: diffDays };
    if (diffDays <= 30) return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800', days: diffDays };
    return { status: 'valid', color: 'bg-green-100 text-green-800', days: diffDays };
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(truck.id, newStatus);
      toast({
        title: "Success",
        description: `Truck status updated to ${newStatus}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update truck status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintDetails = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const detailsHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Truck Details - ${truck.truck_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            .section { margin: 20px 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .cert-status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Approved Logistics Limited</h1>
            <h2>Truck Information Report</h2>
            <p>Truck Number: ${truck.truck_number}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h3>Vehicle Specifications</h3>
            <div class="grid">
              <div>
                <div class="field"><span class="label">Make:</span><span class="value">${truck.make}</span></div>
                <div class="field"><span class="label">Model:</span><span class="value">${truck.model}</span></div>
                <div class="field"><span class="label">Year:</span><span class="value">${truck.year}</span></div>
                <div class="field"><span class="label">License Plate:</span><span class="value">${truck.license_plate}</span></div>
              </div>
              <div>
                <div class="field"><span class="label">Capacity:</span><span class="value">${truck.capacity_tons} tons</span></div>
                <div class="field"><span class="label">Fuel Type:</span><span class="value">${truck.fuel_type}</span></div>
                <div class="field"><span class="label">Mileage:</span><span class="value">${(truck.mileage || 0).toLocaleString()} km</span></div>
                <div class="field"><span class="label">Status:</span><span class="value">${truck.status}</span></div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Licensing & Certification Status</h3>
            <div class="field"><span class="label">NTSA Inspection:</span><span class="value cert-status">${truck.ntsa_expiry ? new Date(truck.ntsa_expiry).toLocaleDateString() : 'Not Available'}</span></div>
            <div class="field"><span class="label">Insurance:</span><span class="value cert-status">${truck.insurance_expiry ? new Date(truck.insurance_expiry).toLocaleDateString() : 'Not Available'}</span></div>
            <div class="field"><span class="label">TGL License:</span><span class="value cert-status">${truck.tgl_expiry ? new Date(truck.tgl_expiry).toLocaleDateString() : 'Not Available'}</span></div>
          </div>

          ${truck.next_service_due ? `
          <div class="section">
            <h3>Maintenance Information</h3>
            <div class="field"><span class="label">Next Service Due:</span><span class="value">${new Date(truck.next_service_due).toLocaleDateString()}</span></div>
            ${truck.last_service_date ? `<div class="field"><span class="label">Last Service:</span><span class="value">${new Date(truck.last_service_date).toLocaleDateString()}</span></div>` : ''}
          </div>
          ` : ''}

          <button class="no-print" onclick="window.print()" style="margin: 20px auto; display: block; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Details</button>
        </body>
      </html>
    `;

    printWindow.document.write(detailsHtml);
    printWindow.document.close();
  };

  // Certificate status calculations
  const ntsaStatus = getCertificateStatus(truck.ntsa_expiry);
  const insuranceStatus = getCertificateStatus(truck.insurance_expiry);
  const tglStatus = getCertificateStatus(truck.tgl_expiry);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Truck Details - {truck.truck_number}
              </CardTitle>
              <CardDescription>Complete vehicle information and compliance status</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(truck.status) + " border text-sm px-3 py-1"}>
              {truck.status.toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm" onClick={handlePrintDetails}>
              Print Details
            </Button>
          </div>

          {/* Vehicle Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Make & Model</p>
                    <p className="font-semibold">{truck.make} {truck.model} ({truck.year})</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">License Plate</p>
                    <p className="font-semibold">{truck.license_plate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">VIN</p>
                    <p className="font-semibold">{truck.vin || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold">{truck.capacity_tons} tons</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel Type</p>
                    <p className="font-semibold">{truck.fuel_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-semibold">{(truck.mileage || 0).toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Licensing & Certification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Licensing & Certification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {ntsaStatus.status === 'valid' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <p className="text-sm font-medium">NTSA Inspection</p>
                  </div>
                  <Badge className={ntsaStatus.color + " text-xs"}>
                    {truck.ntsa_expiry ? new Date(truck.ntsa_expiry).toLocaleDateString() : 'Not Available'}
                  </Badge>
                  {ntsaStatus.status !== 'missing' && (
                    <p className="text-xs text-muted-foreground">
                      {ntsaStatus.status === 'expired' ? `Expired ${Math.abs(ntsaStatus.days)} days ago` :
                       ntsaStatus.status === 'expiring' ? `Expires in ${ntsaStatus.days} days` :
                       `Valid for ${ntsaStatus.days} days`}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {insuranceStatus.status === 'valid' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <p className="text-sm font-medium">Insurance Certificate</p>
                  </div>
                  <Badge className={insuranceStatus.color + " text-xs"}>
                    {truck.insurance_expiry ? new Date(truck.insurance_expiry).toLocaleDateString() : 'Not Available'}
                  </Badge>
                  {insuranceStatus.status !== 'missing' && (
                    <p className="text-xs text-muted-foreground">
                      {insuranceStatus.status === 'expired' ? `Expired ${Math.abs(insuranceStatus.days)} days ago` :
                       insuranceStatus.status === 'expiring' ? `Expires in ${insuranceStatus.days} days` :
                       `Valid for ${insuranceStatus.days} days`}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {tglStatus.status === 'valid' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <p className="text-sm font-medium">TGL License</p>
                  </div>
                  <Badge className={tglStatus.color + " text-xs"}>
                    {truck.tgl_expiry ? new Date(truck.tgl_expiry).toLocaleDateString() : 'Not Available'}
                  </Badge>
                  {tglStatus.status !== 'missing' && (
                    <p className="text-xs text-muted-foreground">
                      {tglStatus.status === 'expired' ? `Expired ${Math.abs(tglStatus.days)} days ago` :
                       tglStatus.status === 'expiring' ? `Expires in ${tglStatus.days} days` :
                       `Valid for ${tglStatus.days} days`}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Schedule */}
          {truck.next_service_due && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Next Service Due</p>
                      <p className="font-semibold">{new Date(truck.next_service_due).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {truck.last_service_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Last Service</p>
                        <p className="font-semibold">{new Date(truck.last_service_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Information */}
          {(truck.last_gps_lat && truck.last_gps_lng) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Known Location</p>
                    <p className="font-semibold">
                      {truck.last_gps_lat.toFixed(6)}, {truck.last_gps_lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={() => handleStatusUpdate(truck.status === 'active' ? 'maintenance' : 'active')}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary/90"
            >
              <Settings className="w-4 h-4 mr-2" />
              {truck.status === 'active' ? 'Set Maintenance' : 'Set Active'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
