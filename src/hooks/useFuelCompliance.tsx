import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------------------------------------------
 * Fuel reserve helpers
 * ----------------------------------------------------------------------------------------------*/

type FuelReserveStatus = {
  capacity_litres: number;
  current_litres: number;
};

export const useFuelReserveStatus = () => {
  return useQuery<FuelReserveStatus | null, Error>({
    queryKey: ["fuel-reserve-status"],
    queryFn: async () => {
      // use `as any` to bypass missing generated types for new table
      const { data, error } = await supabase
        .from<any, any>("fuel_reserve_status")
        .select("capacity_litres,current_litres")
        .single();
      if (error) throw error;
      return data as FuelReserveStatus | null;
    },
    refetchInterval: 60000,
  });
};

type FuelReserveLogInsert = {
  litres_delta: number;
  reason?: string;
};

export const useAddFuelReserveLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FuelReserveLogInsert) => {
      const { error } = await supabase.from<any, any>("fuel_reserve_log").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-reserve-status"] });
      queryClient.invalidateQueries({ queryKey: ["daily-fuel-movement"] });
    },
  });
};

export const useDailyFuelMovement = () => {
  return useQuery({
    queryKey: ["daily-fuel-movement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<any, any>("v_daily_fuel_movement")
        .select("day, litres_dispensed, litres_refilled")
        .order("day", { ascending: true });
      if (error) throw error;
      return data as Array<{ day: string; litres_dispensed: number; litres_refilled: number }>;
    },
  });
};

/* ------------------------------------------------------------------------------------------------
 * Compliance helpers
 * ----------------------------------------------------------------------------------------------*/

type ComplianceRow = {
  id?: string;
  truck_id: string;
  ntsa_renewal: string | null;
  ntsa_expiry: string;
  insurance_renewal: string | null;
  insurance_expiry: string;
  tgl_renewal: string | null;
  tgl_expiry: string;
  trucks?: { truck_number: string };
};

export const useTruckCompliance = () => {
  return useQuery<ComplianceRow[], Error>({
    queryKey: ["truck-compliance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<any, any>("truck_compliance")
        .select(`*, trucks(truck_number)`);
      if (error) throw error;
      return data as ComplianceRow[];
    },
  });
};

export const useUpsertCompliance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (row: ComplianceRow) => {
      const { error } = await supabase.from<any, any>("truck_compliance").upsert(row as any, { onConflict: "truck_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["truck-compliance"] });
    },
  });
};
