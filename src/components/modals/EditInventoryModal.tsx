
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSave: (updatedItem: any) => void;
}

export const EditInventoryModal = ({ isOpen, onClose, item, onSave }: EditInventoryModalProps) => {
  const [formData, setFormData] = useState({
    part_name: item?.part_name || '',
    part_number: item?.part_number || '',
    category: item?.category || '',
    description: item?.description || '',
    quantity_in_stock: item?.quantity_in_stock || 0,
    minimum_stock_level: item?.minimum_stock_level || 0,
    unit_price: item?.unit_price || 0,
    supplier: item?.supplier || '',
    location: item?.location || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave({ ...item, ...formData });
      onClose();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Update the inventory item information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="part_name">Part Name</Label>
              <Input
                id="part_name"
                value={formData.part_name}
                onChange={(e) => handleInputChange('part_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="part_number">Part Number</Label>
              <Input
                id="part_number"
                value={formData.part_number}
                onChange={(e) => handleInputChange('part_number', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
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

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity_in_stock">Current Stock</Label>
              <Input
                id="quantity_in_stock"
                type="number"
                value={formData.quantity_in_stock}
                onChange={(e) => handleInputChange('quantity_in_stock', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="minimum_stock_level">Minimum Stock</Label>
              <Input
                id="minimum_stock_level"
                type="number"
                value={formData.minimum_stock_level}
                onChange={(e) => handleInputChange('minimum_stock_level', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="unit_price">Unit Price (USD)</Label>
            <Input
              id="unit_price"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
