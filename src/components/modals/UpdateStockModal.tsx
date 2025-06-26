
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, Plus, Minus } from "lucide-react";

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onUpdate: (itemId: string, newQuantity: number, operation: 'add' | 'remove' | 'set') => void;
}

export const UpdateStockModal = ({ isOpen, onClose, item, onUpdate }: UpdateStockModalProps) => {
  const [operation, setOperation] = useState<'add' | 'remove' | 'set'>('add');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(item.id, quantity, operation);
      onClose();
      setQuantity(0);
      setReason('');
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNewQuantity = () => {
    switch (operation) {
      case 'add':
        return item.quantity_in_stock + quantity;
      case 'remove':
        return Math.max(0, item.quantity_in_stock - quantity);
      case 'set':
        return quantity;
      default:
        return item.quantity_in_stock;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            Update stock quantity for {item?.part_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Stock</p>
            <p className="text-2xl font-bold">{item?.quantity_in_stock || 0}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="operation">Operation</Label>
              <Select value={operation} onValueChange={(value: 'add' | 'remove' | 'set') => setOperation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Stock
                    </div>
                  </SelectItem>
                  <SelectItem value="remove">
                    <div className="flex items-center gap-2">
                      <Minus className="w-4 h-4" />
                      Remove Stock
                    </div>
                  </SelectItem>
                  <SelectItem value="set">Set Exact Quantity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">
                {operation === 'set' ? 'New Quantity' : 'Quantity to ' + operation}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Received shipment, Used for maintenance"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                New stock quantity will be: <span className="font-bold">{getNewQuantity()}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Stock'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
