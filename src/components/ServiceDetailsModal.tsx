
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Calendar, User, Truck, DollarSign, X, CheckCircle, Clock, FileText, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceDetailsModalProps {
  service: any;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ 
  service, 
  onClose, 
  onStatusUpdate 
}) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400";
      case "scheduled": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(service.id, newStatus);
      toast({
        title: "Success",
        description: `Service ${newStatus === 'completed' ? 'completed' : 'started'} successfully!`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintDetails = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const partsUsed = service.parts_used ? JSON.parse(service.parts_used) : [];
    const partsTotal = partsUsed.reduce((sum: number, part: any) => sum + (part.quantity * part.price), 0);

    const detailsHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Details - ${service.trucks?.truck_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            .section { margin: 20px 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .parts-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .parts-table th, .parts-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .parts-table th { background-color: #f5f5f5; }
            .cost-breakdown { background-color: #f9f9f9; padding: 15px; margin: 10px 0; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Approved Logistics Limited</h1>
            <h2>Service Record Report</h2>
            <p>Service ID: ${service.id}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h3>Vehicle Information</h3>
            <div class="field"><span class="label">Truck Number:</span><span class="value">${service.trucks?.truck_number || 'N/A'}</span></div>
            <div class="field"><span class="label">Make/Model:</span><span class="value">${service.trucks?.make} ${service.trucks?.model}</span></div>
          </div>

          <div class="section">
            <h3>Service Details</h3>
            <div class="grid">
              <div>
                <div class="field"><span class="label">Service Type:</span><span class="value">${service.maintenance_type}</span></div>
                <div class="field"><span class="label">Status:</span><span class="value">${service.status}</span></div>
                <div class="field"><span class="label">Technician:</span><span class="value">${service.technician || 'Not assigned'}</span></div>
                <div class="field"><span class="label">Service Provider:</span><span class="value">${service.service_provider || 'In-house'}</span></div>
              </div>
              <div>
                <div class="field"><span class="label">Service Date:</span><span class="value">${new Date(service.service_date).toLocaleDateString()}</span></div>
                <div class="field"><span class="label">Mileage:</span><span class="value">${service.mileage_at_service || 'N/A'} km</span></div>
                <div class="field"><span class="label">Downtime:</span><span class="value">${service.downtime_hours || 0} hours</span></div>
              </div>
            </div>
          </div>

          ${partsUsed.length > 0 ? `
          <div class="section">
            <h3>Parts & Materials Used</h3>
            <table class="parts-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price (KSh)</th>
                  <th>Total (KSh)</th>
                </tr>
              </thead>
              <tbody>
                ${partsUsed.map((part: any) => `
                  <tr>
                    <td>${part.name}</td>
                    <td>${part.quantity}</td>
                    <td>${part.price.toLocaleString()}</td>
                    <td>${(part.quantity * part.price).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="section">
            <h3>Cost Breakdown</h3>
            <div class="cost-breakdown">
              <div class="field"><span class="label">Parts & Materials:</span><span class="value">KSh ${partsTotal.toLocaleString()}</span></div>
              <div class="field"><span class="label">Labor Cost:</span><span class="value">KSh ${((service.cost || 0) - partsTotal).toLocaleString()}</span></div>
              <div class="field" style="border-top: 1px solid #ccc; padding-top: 10px; font-weight: bold;">
                <span class="label">Total Service Cost:</span><span class="value">KSh ${(service.cost || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Description & Notes</h3>
            <p>${service.description}</p>
          </div>

          <button class="no-print" onclick="window.print()" style="margin: 20px auto; display: block; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
        </body>
      </html>
    `;

    printWindow.document.write(detailsHtml);
    printWindow.document.close();
  };

  const partsUsed = service.parts_used ? JSON.parse(service.parts_used) : [];
  const partsTotal = partsUsed.reduce((sum: number, part: any) => sum + (part.quantity * part.price), 0);
  const laborCost = (service.cost || 0) - partsTotal;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Service Details - {service.trucks?.truck_number}
              </CardTitle>
              <CardDescription>Complete maintenance record and cost breakdown</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(service.status) + " border text-sm px-3 py-1"}>
              {service.status.toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm" onClick={handlePrintDetails}>
              <FileText className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </div>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Truck Number</p>
                      <p className="font-semibold">{service.trucks?.truck_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Make & Model</p>
                    <p className="font-semibold">{service.trucks?.make} {service.trucks?.model}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Service Type</p>
                    <p className="font-semibold">{service.maintenance_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Technician</p>
                      <p className="font-semibold">{service.technician || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Provider</p>
                    <p className="font-semibold">{service.service_provider || 'In-house'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Service Date</p>
                      <p className="font-semibold">{new Date(service.service_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage at Service</p>
                    <p className="font-semibold">{service.mileage_at_service?.toLocaleString() || 'N/A'} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Downtime</p>
                    <p className="font-semibold">{service.downtime_hours || 0} hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parts & Materials Used */}
          {partsUsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Parts & Materials Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Item</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Unit Price (KSh)</th>
                        <th className="text-left p-2">Total (KSh)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partsUsed.map((part: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{part.name}</td>
                          <td className="p-2">{part.quantity}</td>
                          <td className="p-2">{part.price.toLocaleString()}</td>
                          <td className="p-2">{(part.quantity * part.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Parts & Materials:</span>
                  <span className="font-semibold">KSh {partsTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor Cost:</span>
                  <span className="font-semibold">KSh {laborCost.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Service Cost:</span>
                  <span>KSh {(service.cost || 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description & Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description & Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4 border-t">
            {service.status === "scheduled" && (
              <Button 
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Service
              </Button>
            )}
            {service.status === "in_progress" && (
              <Button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
