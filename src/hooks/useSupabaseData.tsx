
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTrucks = () => {
  return useQuery({
    queryKey: ['trucks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trucks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          trucks (truck_number, make, model),
          drivers (full_name, employee_id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useMaintenance = () => {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance')
        .select(`
          *,
          trucks (truck_number, make, model)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useSpareParts = () => {
  return useQuery({
    queryKey: ['spare_parts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCargo = () => {
  return useQuery({
    queryKey: ['cargo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cargo')
        .select(`
          *,
          trips (trip_number, origin, destination)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFuelRecords = () => {
  return useQuery({
    queryKey: ['fuel_records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_records')
        .select(`
          *,
          trucks (truck_number),
          drivers (full_name),
          trips (trip_number)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTruck = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (truckData: any) => {
      const { data, error } = await supabase
        .from('trucks')
        .insert([truckData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      toast({
        title: "Success",
        description: "Truck added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
