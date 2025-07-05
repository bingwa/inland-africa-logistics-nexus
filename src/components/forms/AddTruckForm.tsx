
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useCreateTruck } from "@/hooks/useSupabaseData";
import { Loader2, X, Upload } from "lucide-react";
import { TruckDocumentUpload } from "@/components/TruckDocumentUpload";

interface AddTruckFormProps {
  onClose: () => void;
}

export const AddTruckForm = ({ onClose }: AddTruckFormProps) => {
  const [formData, setFormData] = useState({
    truck_number: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    capacity_tons: 0,
    fuel_type: 'diesel',
    mileage: 0,
    purchase_date: '',
    ntsa_expiry: '',
    insurance_expiry: '',
    tgl_expiry: '',
    last_service_mileage: 0
  });

  const [documents, setDocuments] = useState({
    ntsa_certificate: null as File | null,
    insurance_certificate: null as File | null,
    tgl_certificate: null as File | null
  });

  const createTruck = useCreateTruck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTruck.mutateAsync({
        ...formData,
        last_service_mileage: formData.last_service_mileage || formData.mileage
      });
      onClose();
    } catch (error) {
      console.error('Failed to create truck:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (documentType: string, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: file
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Truck</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Add a new truck to the fleet with Kenyan licensing information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="truck_number">Truck Number *</Label>
              <Input
                id="truck_number"
                value={formData.truck_number}
                onChange={(e) => handleInputChange('truck_number', e.target.value)}
                placeholder="e.g., TRK-001"
                required
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="license_plate">License Plate *</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => handleInputChange('license_plate', e.target.value)}
                placeholder="e.g., KAA 001A"
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Isuzu"
                required
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., NPR"
                required
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity_tons">Capacity (tons) *</Label>
              <Input
                id="capacity_tons"
                type="number"
                min="0"
                step="0.1"
                value={formData.capacity_tons}
                onChange={(e) => handleInputChange('capacity_tons', parseFloat(e.target.value) || 0)}
                required
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type *</Label>
              <Select value={formData.fuel_type} onValueChange={(value) => handleInputChange('fuel_type', value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage">Current Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          {/* Kenyan Licensing Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Kenyan Licensing & Certification</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ntsa_expiry">NTSA Certificate Expiry</Label>
                <div className="flex gap-2">
                  <Input
                    id="ntsa_expiry"
                    type="date"
                    value={formData.ntsa_expiry}
                    onChange={(e) => handleInputChange('ntsa_expiry', e.target.value)}
                    className="bg-background flex-1"
                  />
                  <TruckDocumentUpload
                    documentType="ntsa_certificate"
                    onFileSelect={(file) => handleFileSelect('ntsa_certificate', file)}
                    selectedFile={documents.ntsa_certificate}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance_expiry">Insurance Expiry</Label>
                <div className="flex gap-2">
                  <Input
                    id="insurance_expiry"
                    type="date"
                    value={formData.insurance_expiry}
                    onChange={(e) => handleInputChange('insurance_expiry', e.target.value)}
                    className="bg-background flex-1"
                  />
                  <TruckDocumentUpload
                    documentType="insurance_certificate"
                    onFileSelect={(file) => handleFileSelect('insurance_certificate', file)}
                    selectedFile={documents.insurance_certificate}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tgl_expiry">TGL Certificate Expiry</Label>
                <div className="flex gap-2">
                  <Input
                    id="tgl_expiry"
                    type="date"
                    value={formData.tgl_expiry}
                    onChange={(e) => handleInputChange('tgl_expiry', e.target.value)}
                    className="bg-background flex-1"
                  />
                  <TruckDocumentUpload
                    documentType="tgl_certificate"
                    onFileSelect={(file) => handleFileSelect('tgl_certificate', file)}
                    selectedFile={documents.tgl_certificate}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTruck.isPending}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {createTruck.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Truck'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
