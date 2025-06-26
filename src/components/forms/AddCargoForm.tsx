
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddCargoFormProps {
  onSuccess?: () => void;
}

export const AddCargoForm = ({ onSuccess }: AddCargoFormProps) => {
  const [formData, setFormData] = useState({
    cargo_number: '',
    client_name: '',
    client_contact: '',
    description: '',
    weight_kg: '',
    value: '',
    pickup_address: '',
    delivery_address: '',
    status: 'pending',
    special_instructions: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCargoMutation = useMutation({
    mutationFn: async (cargoData: any) => {
      const { data, error } = await supabase
        .from('cargo')
        .insert([{
          ...cargoData,
          weight_kg: parseFloat(cargoData.weight_kg),
          value: parseFloat(cargoData.value)
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargo'] });
      toast({
        title: "Success",
        description: "Cargo added successfully!",
      });
      // Reset form
      setFormData({
        cargo_number: '',
        client_name: '',
        client_contact: '',
        description: '',
        weight_kg: '',
        value: '',
        pickup_address: '',
        delivery_address: '',
        status: 'pending',
        special_instructions: ''
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate cargo number if not provided
    const cargoNumber = formData.cargo_number || `CRG${Date.now().toString().slice(-6)}`;
    
    createCargoMutation.mutate({
      ...formData,
      cargo_number: cargoNumber
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Cargo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cargo_number">Cargo Number (Optional)</Label>
              <Input
                id="cargo_number"
                value={formData.cargo_number}
                onChange={(e) => handleInputChange('cargo_number', e.target.value)}
                placeholder="Auto-generated if empty"
              />
            </div>
            <div>
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="client_contact">Client Contact</Label>
              <Input
                id="client_contact"
                value={formData.client_contact}
                onChange={(e) => handleInputChange('client_contact', e.target.value)}
                placeholder="+254700000000"
              />
            </div>
            <div>
              <Label htmlFor="weight_kg">Weight (kg) *</Label>
              <Input
                id="weight_kg"
                type="number"
                value={formData.weight_kg}
                onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="value">Value (USD) *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                placeholder="Describe the cargo contents..."
              />
            </div>
            <div>
              <Label htmlFor="pickup_address">Pickup Address *</Label>
              <Textarea
                id="pickup_address"
                value={formData.pickup_address}
                onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                required
                placeholder="Full pickup address..."
              />
            </div>
            <div>
              <Label htmlFor="delivery_address">Delivery Address *</Label>
              <Textarea
                id="delivery_address"
                value={formData.delivery_address}
                onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                required
                placeholder="Full delivery address..."
              />
            </div>
            <div>
              <Label htmlFor="special_instructions">Special Instructions</Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                placeholder="Any special handling requirements..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="submit" 
              disabled={createCargoMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createCargoMutation.isPending ? "Adding..." : "Add Cargo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
