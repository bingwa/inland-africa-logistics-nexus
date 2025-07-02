
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Navigation } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Delivery {
  id: string;
  cargo_number: string;
  client_name: string;
  pickup_address: string;
  delivery_address: string;
  weight_kg: number;
  status: string;
  special_instructions: string | null;
}

const DriverDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('cargo')
        .select('*')
        .in('status', ['pending', 'in_transit', 'delivered'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Error loading deliveries",
        description: "Failed to load delivery information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('cargo')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Delivery updated",
        description: `Delivery status changed to ${newStatus}`,
      });

      fetchDeliveries();
    } catch (error: any) {
      toast({
        title: "Error updating delivery",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 border-green-300";
      case "in_transit": return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              My Deliveries
            </h1>
            <p className="text-muted-foreground">Manage your assigned deliveries and cargo</p>
          </div>
        </div>

        {deliveries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No deliveries assigned</h3>
              <p className="text-muted-foreground">Check back later for new delivery assignments.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {delivery.cargo_number}
                      </CardTitle>
                      <CardDescription>Client: {delivery.client_name}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(delivery.status) + " border"}>
                      {delivery.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Pickup Location
                      </h4>
                      <p className="text-sm text-muted-foreground">{delivery.pickup_address}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        Delivery Location
                      </h4>
                      <p className="text-sm text-muted-foreground">{delivery.delivery_address}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Weight: </span>
                      <span>{delivery.weight_kg} kg</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {delivery.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                        >
                          Start Delivery
                        </Button>
                      )}
                      {delivery.status === 'in_transit' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-blue-400 text-blue-600 hover:bg-blue-50"
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Navigate
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                          >
                            Mark Delivered
                          </Button>
                        </>
                      )}
                      {delivery.status === 'delivered' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Delivered</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {delivery.special_instructions && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-yellow-800">Special Instructions</h5>
                          <p className="text-sm text-yellow-700">{delivery.special_instructions}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DriverLayout>
  );
};

export default DriverDeliveries;
