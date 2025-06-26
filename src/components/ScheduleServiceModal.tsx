
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useTrucks } from "@/hooks/useSupabaseData";

interface ScheduleServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (serviceData: any) => void;
}

export const ScheduleServiceModal: React.FC<ScheduleServiceModalProps> = ({
  isOpen,
  onClose,
  onSchedule
}) => {
  const [serviceDate, setServiceDate] = useState<Date>();
  const [formData, setFormData] = useState({
    truckId: '',
    maintenanceType: '',
    description: '',
    technician: '',
    estimatedCost: '',
    serviceProvider: ''
  });
  const { toast } = useToast();
  const { data: trucks } = useTrucks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceDate || !formData.truckId || !formData.maintenanceType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const serviceData = {
      ...formData,
      serviceDate: serviceDate.toISOString(),
      cost: parseFloat(formData.estimatedCost) || 0,
      status: 'scheduled'
    };

    onSchedule(serviceData);
    
    // Reset form
    setFormData({
      truckId: '',
      maintenanceType: '',
      description: '',
      technician: '',
      estimatedCost: '',
      serviceProvider: ''
    });
    setServiceDate(undefined);
    
    toast({
      title: "Service Scheduled",
      description: "Maintenance service has been successfully scheduled.",
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl">Schedule Service</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Truck Selection */}
            <div>
              <Label htmlFor="truck" className="text-sm font-medium">
                Truck <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.truckId} onValueChange={(value) => handleInputChange('truckId', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select truck" />
                </SelectTrigger>
                <SelectContent>
                  {trucks?.map(truck => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.truck_number} - {truck.make} {truck.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Type */}
            <div>
              <Label htmlFor="maintenanceType" className="text-sm font-medium">
                Service Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.maintenanceType} onValueChange={(value) => handleInputChange('maintenanceType', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine_maintenance">Routine Maintenance</SelectItem>
                  <SelectItem value="oil_change">Oil Change</SelectItem>
                  <SelectItem value="brake_service">Brake Service</SelectItem>
                  <SelectItem value="tire_service">Tire Service</SelectItem>
                  <SelectItem value="engine_repair">Engine Repair</SelectItem>
                  <SelectItem value="transmission_service">Transmission Service</SelectItem>
                  <SelectItem value="electrical_repair">Electrical Repair</SelectItem>
                  <SelectItem value="inspection">Safety Inspection</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Service Date */}
            <div>
              <Label className="text-sm font-medium">
                Service Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {serviceDate ? format(serviceDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={serviceDate}
                    onSelect={setServiceDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Technician */}
            <div>
              <Label htmlFor="technician" className="text-sm font-medium">Technician</Label>
              <Input
                id="technician"
                placeholder="Enter technician name"
                value={formData.technician}
                onChange={(e) => handleInputChange('technician', e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Service Provider */}
            <div>
              <Label htmlFor="serviceProvider" className="text-sm font-medium">Service Provider</Label>
              <Input
                id="serviceProvider"
                placeholder="Enter service provider"
                value={formData.serviceProvider}
                onChange={(e) => handleInputChange('serviceProvider', e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Estimated Cost */}
            <div>
              <Label htmlFor="estimatedCost" className="text-sm font-medium">Estimated Cost (KSh)</Label>
              <Input
                id="estimatedCost"
                type="number"
                placeholder="0.00"
                value={formData.estimatedCost}
                onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the maintenance work needed..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-sm"
            >
              Schedule Service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
