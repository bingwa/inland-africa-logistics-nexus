import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        .from("trucks" as any)
        .select("id, truck_number, ntsa_expiry, insurance_expiry, tgl_expiry");
      if (error) throw error;
      return data?.map((truck: any) => ({
        truck_id: truck.id,
        ntsa_renewal: null,
        ntsa_expiry: truck.ntsa_expiry,
        insurance_renewal: null,
        insurance_expiry: truck.insurance_expiry,
        tgl_renewal: null,
        tgl_expiry: truck.tgl_expiry,
        trucks: { truck_number: truck.truck_number }
      })) || [];
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
