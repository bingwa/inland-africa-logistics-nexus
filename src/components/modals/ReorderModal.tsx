
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export const ReorderModal = ({ isOpen, onClose, item }: ReorderModalProps) => {
  const [orderQuantity, setOrderQuantity] = useState(item?.minimum_stock_level * 2 || 10);
  const [supplierContact, setSupplierContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Reorder Request Sent",
        description: `Order for ${orderQuantity} units of ${item.part_name} has been submitted.`,
      });
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  const estimatedCost = orderQuantity * item?.unit_price * 130 || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Reorder Item
          </DialogTitle>
          <DialogDescription>
            Create a reorder request for {item?.part_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Stock</p>
                <p className="font-semibold">{item?.quantity_in_stock || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Minimum Level</p>
                <p className="font-semibold">{item?.minimum_stock_level || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Unit Price</p>
                <p className="font-semibold">KSh {Math.round((item?.unit_price || 0) * 130).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Supplier</p>
                <p className="font-semibold">{item?.supplier || 'N/A'}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="orderQuantity">Order Quantity</Label>
              <Input
                id="orderQuantity"
                type="number"
                min="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="supplierContact">Supplier Contact</Label>
              <Input
                id="supplierContact"
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value)}
                placeholder="Supplier email or phone"
              />
            </div>

            <div>
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special delivery or quality requirements"
                rows={3}
              />
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                Estimated Total Cost: <span className="font-bold">KSh {estimatedCost.toLocaleString()}</span>
              </p>
              <p className="text-xs text-green-600 mt-1">
                New stock level after delivery: {(item?.quantity_in_stock || 0) + orderQuantity}
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
                    Submitting...
                  </>
                ) : (
                  'Submit Reorder'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
