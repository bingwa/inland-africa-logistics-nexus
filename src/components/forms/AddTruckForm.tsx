
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTruck } from "@/hooks/useSupabaseData";
import { X } from "lucide-react";

interface AddTruckFormProps {
  onClose: () => void;
}

interface TruckFormData {
  truck_number: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  capacity_tons: number;
  fuel_type: string;
  vin?: string;
  purchase_date?: string;
}

export const AddTruckForm = ({ onClose }: AddTruckFormProps) => {
  const { register, handleSubmit, setValue, reset } = useForm<TruckFormData>();
  const createTruck = useCreateTruck();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: TruckFormData) => {
    setIsLoading(true);
    try {
      await createTruck.mutateAsync({
        truck_number: data.truck_number,
        license_plate: data.license_plate,
        make: data.make,
        model: data.model,
        year: data.year,
        capacity_tons: data.capacity_tons,
        fuel_type: data.fuel_type,
        vin: data.vin,
        purchase_date: data.purchase_date,
        status: 'active',
        mileage: 0
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating truck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Add New Truck</CardTitle>
            <CardDescription>Enter truck details to add to your fleet</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="truck_number">Truck Number *</Label>
                <Input
                  id="truck_number"
                  {...register("truck_number", { required: true })}
                  placeholder="e.g., TRK001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_plate">License Plate *</Label>
                <Input
                  id="license_plate"
                  {...register("license_plate", { required: true })}
                  placeholder="e.g., KCB 123A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  {...register("make", { required: true })}
                  placeholder="e.g., Mercedes-Benz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  {...register("model", { required: true })}
                  placeholder="e.g., Actros"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  {...register("year", { required: true, valueAsNumber: true })}
                  placeholder="e.g., 2022"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity_tons">Capacity (tons) *</Label>
                <Input
                  id="capacity_tons"
                  type="number"
                  step="0.1"
                  {...register("capacity_tons", { required: true, valueAsNumber: true })}
                  placeholder="e.g., 25.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type *</Label>
                <Select onValueChange={(value) => setValue("fuel_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  {...register("vin")}
                  placeholder="Vehicle Identification Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  {...register("purchase_date")}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Truck"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
