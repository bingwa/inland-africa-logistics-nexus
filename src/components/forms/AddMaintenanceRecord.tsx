import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, X, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useTrucks, useCreateMaintenance } from "@/hooks/useSupabaseData";

interface AddMaintenanceRecordProps {
  onClose: () => void;
}

interface ItemPurchased {
  name: string;
  quantity: number;
  cost: number;
}

const maintenanceTypes = [
  { id: "routine_maintenance", label: "Routine Maintenance" },
  { id: "oil_change", label: "Oil Change" },
  { id: "brake_service", label: "Brake Service" },
  { id: "tire_service", label: "Tire Service" },
  { id: "engine_repair", label: "Engine Repair" },
  { id: "transmission_service", label: "Transmission Service" },
  { id: "electrical_repair", label: "Electrical Repair" },
  { id: "inspection", label: "Safety Inspection" },
  { id: "other", label: "Other" }
];

export const AddMaintenanceRecord: React.FC<AddMaintenanceRecordProps> = ({ onClose }) => {
  const [serviceDate, setServiceDate] = useState<Date>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [itemsPurchased, setItemsPurchased] = useState<ItemPurchased[]>([]);
  const [formData, setFormData] = useState({
    truck_id: '',
    description: '',
    technician: '',
    cost: '',
    service_provider: ''
  });
  const { toast } = useToast();
  const { data: trucks } = useTrucks();
  const createMaintenance = useCreateMaintenance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceDate || !formData.truck_id || selectedTypes.length === 0 || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one maintenance type.",
        variant: "destructive"
      });
      return;
    }

    try {
      const maintenanceType = selectedTypes.join(", ");
      const itemsString = itemsPurchased.length > 0 
        ? itemsPurchased.map(item => `${item.name} (Qty: ${item.quantity}, Cost: KSh ${item.cost})`).join(', ')
        : null;
      
      await createMaintenance.mutateAsync({
        ...formData,
        maintenance_type: maintenanceType,
        service_date: serviceDate.toISOString().split('T')[0],
        cost: parseFloat(formData.cost) || 0,
        items_purchased: itemsString
      });

      toast({
        title: "Maintenance Record Added",
        description: "Maintenance record has been successfully scheduled.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add maintenance record.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const addItem = () => {
    setItemsPurchased(prev => [...prev, { name: '', quantity: 1, cost: 0 }]);
  };

  const removeItem = (index: number) => {
    setItemsPurchased(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ItemPurchased, value: string | number) => {
    setItemsPurchased(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl">Schedule Maintenance Service</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="truck" className="text-sm font-medium">
                Truck <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.truck_id} onValueChange={(value) => handleInputChange('truck_id', value)}>
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
                    initialFocus
                    disabled={(date) => date < new Date("1900-01-01")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">
              Maintenance Types <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 p-3 border rounded-lg">
              {maintenanceTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => handleTypeToggle(type.id)}
                  />
                  <Label htmlFor={type.id} className="text-sm cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost" className="text-sm font-medium">Service Cost (KSh)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                className="text-sm"
              />
            </div>

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
          </div>

          <div>
            <Label htmlFor="serviceProvider" className="text-sm font-medium">Service Provider</Label>
            <Input
              id="serviceProvider"
              placeholder="Enter service provider"
              value={formData.service_provider}
              onChange={(e) => handleInputChange('service_provider', e.target.value)}
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the maintenance work..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          {/* Items Purchased Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Items Purchased</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            {itemsPurchased.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 p-3 border rounded-lg">
                <div>
                  <Label className="text-xs">Item Name</Label>
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity === 1 ? '' : item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="text-sm"
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cost (KSh)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.cost === 0 ? '' : item.cost}
                    onChange={(e) => updateItem(index, 'cost', parseFloat(e.target.value) || 0)}
                    className="text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

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
              disabled={createMaintenance.isPending}
            >
              {createMaintenance.isPending ? "Scheduling..." : "Schedule Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
