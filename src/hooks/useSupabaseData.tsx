
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Truck = Database["public"]["Tables"]["trucks"]["Row"];
type Trip = Database["public"]["Tables"]["trips"]["Row"];
type Driver = Database["public"]["Tables"]["drivers"]["Row"];
type Maintenance = Database["public"]["Tables"]["maintenance"]["Row"];
type FuelRecord = Database["public"]["Tables"]["fuel_records"]["Row"];

export const useTrucks = () => {
  return useQuery<Truck[], Error>({
    queryKey: ["trucks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trucks").select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTruck = () => {
  return useMutation({
    mutationFn: async (newTruck: Partial<Truck>) => {
      const { data, error } = await supabase
        .from("trucks")
        .insert(newTruck)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateTruckStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("trucks")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useTrips = () => {
  return useQuery<Trip[], Error>({
    queryKey: ["trips"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trips").select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTrip = () => {
  return useMutation({
    mutationFn: async (newTrip: Partial<Trip>) => {
      const { data, error } = await supabase
        .from("trips")
        .insert(newTrip)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useDrivers = () => {
  return useQuery<Driver[], Error>({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("drivers").select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateDriver = () => {
  return useMutation({
    mutationFn: async (newDriver: Partial<Driver>) => {
      const { data, error } = await supabase
        .from("drivers")
        .insert(newDriver)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useMaintenance = () => {
  return useQuery<Maintenance[], Error>({
    queryKey: ["maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance")
        .select("*, trucks(*)");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateMaintenance = () => {
  return useMutation({
    mutationFn: async (newMaintenance: Partial<Maintenance>) => {
      const { data, error } = await supabase
        .from("maintenance")
        .insert(newMaintenance)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
};

export const useFuelRecords = () => {
  return useQuery<FuelRecord[], Error>({
    queryKey: ["fuel_records"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fuel_records").select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateFuelRecord = () => {
  return useMutation({
    mutationFn: async (newFuelRecord: Partial<FuelRecord>) => {
      const { data, error } = await supabase
        .from("fuel_records")
        .insert(newFuelRecord)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
};
