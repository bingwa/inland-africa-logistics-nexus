
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useCreateSparePart } from "@/hooks/useSupabaseData";
import { Loader2 } from "lucide-react";

interface AddInventoryFormProps {
  onClose: () => void;
}

export const AddInventoryForm = ({ onClose }: AddInventoryFormProps) => {
  const [formData, setFormData] = useState({
    part_name: '',
    part_number: '',
    category: '',
    description: '',
    quantity_in_stock: 0,
    minimum_stock_level: 0,
    unit_price_usd: 0,
    supplier_name: '',
    supplier_contact: '',
    location: ''
  });

  const createSparePart = useCreateSparePart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createSparePart.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create spare part:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new spare part or inventory item to the system
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_name">Part Name *</Label>
              <Input
                id="part_name"
                value={formData.part_name}
                onChange={(e) => handleInputChange('part_name', e.target.value)}
                placeholder="e.g., Brake Pads"
                required
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="part_number">Part Number *</Label>
              <Input
                id="part_number"
                value={formData.part_number}
                onChange={(e) => handleInputChange('part_number', e.target.value)}
                placeholder="e.g., BP-HD-001"
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)} required>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg">
                <SelectItem value="engine">Engine Parts</SelectItem>
                <SelectItem value="brakes">Brakes</SelectItem>
                <SelectItem value="transmission">Transmission</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="suspension">Suspension</SelectItem>
                <SelectItem value="tires">Tires & Wheels</SelectItem>
                <SelectItem value="filters">Filters</SelectItem>
                <SelectItem value="oils">Oils & Fluids</SelectItem>
                <SelectItem value="body">Body Parts</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Part description and specifications"
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity_in_stock">Current Stock *</Label>
              <Input
                id="quantity_in_stock"
                type="number"
                min="0"
                value={formData.quantity_in_stock}
                onChange={(e) => handleInputChange('quantity_in_stock', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimum_stock_level">Minimum Stock Level *</Label>
              <Input
                id="minimum_stock_level"
                type="number"
                min="0"
                value={formData.minimum_stock_level}
                onChange={(e) => handleInputChange('minimum_stock_level', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_price_usd">Unit Price (USD) *</Label>
            <Input
              id="unit_price_usd"
              type="number"
              min="0"
              step="0.01"
              value={formData.unit_price_usd}
              onChange={(e) => handleInputChange('unit_price_usd', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier_name">Supplier Name</Label>
              <Input
                id="supplier_name"
                value={formData.supplier_name}
                onChange={(e) => handleInputChange('supplier_name', e.target.value)}
                placeholder="Supplier name"
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier_contact">Supplier Contact</Label>
              <Input
                id="supplier_contact"
                value={formData.supplier_contact}
                onChange={(e) => handleInputChange('supplier_contact', e.target.value)}
                placeholder="Phone/Email"
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Storage Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Warehouse A, Shelf 3"
              className="bg-background"
            />
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
              disabled={createSparePart.isPending}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {createSparePart.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Item'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
