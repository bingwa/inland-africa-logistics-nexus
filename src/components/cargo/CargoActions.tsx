
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Phone, Download, RefreshCw } from "lucide-react";

interface CargoActionsProps {
  cargo: any;
}

export const CargoActions = ({ cargo }: CargoActionsProps) => {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(cargo.status);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const { data, error } = await supabase
        .from('cargo')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', cargo.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargo'] });
      toast({
        title: "Success",
        description: "Cargo status updated successfully!",
      });
      setStatusDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTrackLocation = () => {
    // Simulate GPS tracking
    const mockCoordinates = {
      lat: -1.2921 + (Math.random() - 0.5) * 0.1,
      lng: 36.8219 + (Math.random() - 0.5) * 0.1
    };
    
    toast({
      title: "Location Tracked",
      description: `Cargo is currently at: ${mockCoordinates.lat.toFixed(4)}, ${mockCoordinates.lng.toFixed(4)}`,
    });
    
    // In a real implementation, this would open a map or GPS tracking interface
    console.log("Tracking cargo location:", mockCoordinates);
  };

  const handleContactClient = () => {
    if (cargo.client_contact) {
      const message = `Hello ${cargo.client_name}, this is regarding your cargo ${cargo.cargo_number}. Current status: ${cargo.status}`;
      const whatsappUrl = `https://wa.me/${cargo.client_contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast({
        title: "No Contact Information",
        description: "Client contact information is not available.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateLabel = () => {
    // Generate and download cargo label
    const labelData = {
      cargoNumber: cargo.cargo_number,
      clientName: cargo.client_name,
      weight: cargo.weight_kg,
      origin: cargo.pickup_address?.split(',')[0] || 'N/A',
      destination: cargo.delivery_address?.split(',')[0] || 'N/A',
      date: new Date().toLocaleDateString()
    };

    const labelContent = `
      INLAND AFRICA LOGISTICS
      ========================
      Cargo Number: ${labelData.cargoNumber}
      Client: ${labelData.clientName}
      Weight: ${labelData.weight}kg
      
      FROM: ${labelData.origin}
      TO: ${labelData.destination}
      
      Date: ${labelData.date}
      ========================
    `;

    const blob = new Blob([labelContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cargo.cargo_number}_label.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Label Generated",
      description: "Cargo label has been downloaded successfully!",
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        className="border-blue-400 text-foreground hover:bg-blue-50"
        onClick={handleTrackLocation}
      >
        <MapPin className="w-3 h-3 mr-1" />
        Track Location
      </Button>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-green-400 text-foreground hover:bg-green-50"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Update Status
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Cargo Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Status: {cargo.status}</label>
            </div>
            <Select value={newStatus} onValueChange={setNewStatus}>
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
            <Button 
              onClick={() => updateStatusMutation.mutate(newStatus)}
              disabled={updateStatusMutation.isPending}
              className="w-full"
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="outline"
        className="border-yellow-400 text-foreground hover:bg-yellow-50"
        onClick={handleGenerateLabel}
      >
        <Download className="w-3 h-3 mr-1" />
        Generate Label
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="border-purple-400 text-foreground hover:bg-purple-50"
        onClick={handleContactClient}
      >
        <Phone className="w-3 h-3 mr-1" />
        Contact Client
      </Button>
    </div>
  );
};
