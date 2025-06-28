
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTrip, useTrucks, useDrivers } from "@/hooks/useSupabaseData";
import { X } from "lucide-react";

interface AddTripFormProps {
  onClose: () => void;
}

interface TripFormData {
  trip_number: string;
  origin: string;
  destination: string;
  planned_departure: string;
  planned_arrival: string;
  truck_id: string;
  driver_id: string;
  distance_km?: number;
  cargo_value_ksh?: number;
  customer_contact?: string;
  notes?: string;
  estimated_wear_tear_ksh?: number;
}

export const AddTripForm = ({ onClose }: AddTripFormProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<TripFormData>();
  const createTrip = useCreateTrip();
  const { data: trucks } = useTrucks();
  const { data: drivers } = useDrivers();
  const [isLoading, setIsLoading] = useState(false);

  // Watch distance and truck selection for wear and tear calculation
  const watchedDistance = watch("distance_km");
  const watchedTruckId = watch("truck_id");

  // Calculate wear and tear based on distance and truck type
  const calculateWearAndTear = (distance: number, truckId: string) => {
    if (!distance || !truckId) return 0;
    
    const selectedTruck = trucks?.find(truck => truck.id === truckId);
    if (!selectedTruck) return 0;

    // Wear and tear calculation based on truck capacity and distance
    // Formula: Base rate per km * distance * capacity factor
    const baseRatePerKm = 12; // KSH per km base rate
    const capacityFactor = selectedTruck.capacity_tons / 10; // Adjust based on truck size
    const ageFactor = selectedTruck.year < 2020 ? 1.3 : 1.0; // Older trucks have higher wear
    
    const wearAndTear = baseRatePerKm * distance * capacityFactor * ageFactor;
    return Math.round(wearAndTear);
  };

  // Auto-calculate wear and tear when distance or truck changes
  React.useEffect(() => {
    if (watchedDistance && watchedTruckId) {
      const wearTear = calculateWearAndTear(Number(watchedDistance), watchedTruckId);
      setValue("estimated_wear_tear_ksh", wearTear);
    }
  }, [watchedDistance, watchedTruckId, setValue, trucks]);

  const onSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    try {
      await createTrip.mutateAsync({
        trip_number: data.trip_number,
        origin: data.origin,
        destination: data.destination,
        planned_departure: data.planned_departure,
        planned_arrival: data.planned_arrival,
        truck_id: data.truck_id,
        driver_id: data.driver_id,
        distance_km: data.distance_km,
        cargo_value_usd: data.cargo_value_ksh ? data.cargo_value_ksh / 130 : undefined, // Convert KSH to USD for storage
        customer_contact: data.customer_contact,
        notes: data.notes,
        estimated_wear_tear_ksh: data.estimated_wear_tear_ksh,
        status: 'planned'
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Create New Trip</CardTitle>
            <CardDescription>Plan a new transportation trip</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trip_number">Trip Number *</Label>
                <Input
                  id="trip_number"
                  {...register("trip_number", { required: true })}
                  placeholder="e.g., TRIP001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin *</Label>
                <Input
                  id="origin"
                  {...register("origin", { required: true })}
                  placeholder="e.g., Nairobi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  {...register("destination", { required: true })}
                  placeholder="e.g., Mombasa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance_km">Distance (km)</Label>
                <Input
                  id="distance_km"
                  type="number"
                  step="0.1"
                  {...register("distance_km", { valueAsNumber: true })}
                  placeholder="e.g., 480.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planned_departure">Planned Departure *</Label>
                <Input
                  id="planned_departure"
                  type="datetime-local"
                  {...register("planned_departure", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planned_arrival">Planned Arrival *</Label>
                <Input
                  id="planned_arrival"
                  type="datetime-local"
                  {...register("planned_arrival", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="truck_id">Assign Truck *</Label>
                <Select onValueChange={(value) => setValue("truck_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {trucks?.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.truck_number} - {truck.make} {truck.model} ({truck.capacity_tons}T)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver_id">Assign Driver *</Label>
                <Select onValueChange={(value) => setValue("driver_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers?.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.full_name} ({driver.employee_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo_value_ksh">Cargo Value (KSH)</Label>
                <Input
                  id="cargo_value_ksh"
                  type="number"
                  step="0.01"
                  {...register("cargo_value_ksh", { valueAsNumber: true })}
                  placeholder="e.g., 1950000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_wear_tear_ksh">Estimated Wear & Tear (KSH)</Label>
                <Input
                  id="estimated_wear_tear_ksh"
                  type="number"
                  {...register("estimated_wear_tear_ksh", { valueAsNumber: true })}
                  placeholder="Auto-calculated"
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <p className="text-xs text-muted-foreground">
                  Calculated based on distance, truck capacity, and age
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_contact">Customer Contact</Label>
                <Input
                  id="customer_contact"
                  {...register("customer_contact")}
                  placeholder="e.g., +254700123456"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Additional trip notes or instructions"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Trip"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
